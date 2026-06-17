import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Button, Space, Input, Avatar, Switch, Modal, Form, Select, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined, StarFilled, StarOutlined, PictureOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const Menu = () => {
    // Search and category selection states
    const [searchText, setSearchText] = useState("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

    // Menu list and dynamically loaded category list states
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);

    // UI states
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [image, setImage] = useState(null);

    const [form] = Form.useForm();

    const getItemId = (item) => item.itemId || item._id || item.id;

    const isTruthy = (value) => value === true || value === "true" || value === 1 || value === "1";

    // Fetch both menu items and categories from the backend
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [menuRes, categoryRes] = await Promise.all([
                axios.get(`${window.API}/api/menu/get-menuitems`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
                }),
                axios.get(`${window.API}/api/categories/get-categories`)
            ]);

            if (menuRes.status === 200) {
                console.log("menuresdata:", menuRes.data);
                // Handles both backend variations (menuItems / menuitems)
                setMenuItems(menuRes.data.menuItems || menuRes.data.menuitems || []);
            }
            if (categoryRes.status === 200) {
                setCategories(categoryRes.data.categories || []);
            }
        } catch (err) {
            console.error("Failed to load menu data:", err);
            window.toastify(err?.response?.data?.message || "Failed to load menu data", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handles open for Add Mode
    const handleAddClick = () => {
        setEditingItem(null);
        setImage(null);
        form.resetFields();
        // Set default values for status and isPopular switch
        form.setFieldsValue({
            status: true,
            isPopular: false
        });
        setIsModalOpen(true);
    };

    // Handles open for Edit Mode
    const handleEditClick = (record) => {
        setEditingItem(record);
        setImage(null);
        form.setFieldsValue({
            itemName: record.itemName,
            itemCategory: record.itemCategory,
            itemPrice: record.itemPrice,
            status: record.status === 'In Stock',
            isPopular: isTruthy(record.isPopular)
        });
        setIsModalOpen(true);
    };

    // Resets modal states and closes modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setImage(null);
        form.resetFields();
    };

    // Unified handler for adding/editing menu items
    const handleFormSubmit = async (values) => {
        const { itemName, itemPrice, itemCategory, isPopular, status } = values;
        const statusString = status ? 'In Stock' : 'Out of Stock';

        const formData = new FormData();
        formData.append("itemName", itemName);
        formData.append("itemPrice", itemPrice);
        formData.append("itemCategory", itemCategory);
        formData.append("isPopular", isPopular ? "true" : "false");
        formData.append("status", statusString);

        if (image) {
            formData.append("image", image);
        } else if (!editingItem) {
            return window.toastify("Please upload a dish image", "error");
        }

        setIsLoading(true);
        try {
            let res;
            if (editingItem) {
                // Update API Call
                res = await axios.put(
                    `${window.api}/api/menu/update-menuitem/${getItemId(editingItem)}`,
                    formData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
                );
                if (res.status === 200) {
                    window.toastify("Menu item updated successfully", "success");
                }
            } else {
                // Add API Call
                res = await axios.post(
                    `${window.api}/api/menu/add-menuitem`,
                    formData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
                );
                if (res.status === 201) {
                    window.toastify("Menu item added successfully", "success");
                }
            }
            handleCloseModal();
            fetchData();
        } catch (err) {
            console.error("Save menu item failed:", err);
            window.toastify(err?.response?.data?.message || "Failed to save dish", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Handles deleting a menu item
    const handleDelete = async (itemId) => {
        setIsLoading(true);
        try {
            const res = await axios.delete(
                `${window.api}/api/menu/delete-menuitem/${itemId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
            );
            if (res.status === 200) {
                window.toastify("Menu item deleted successfully", "success");
                fetchData();
            }
        } catch (err) {
            console.error("Delete failed:", err);
            window.toastify(err?.response?.data?.message || "Failed to delete dish", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Handles toggling isPopular directly from the Switch
    const handleTogglePopular = async (itemId, checked) => {
        try {
            const formData = new FormData();
            formData.append("isPopular", checked ? "true" : "false");

            const res = await axios.put(
                `${window.api}/api/menu/update-menuitem/${itemId}`,
                formData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
            );
            if (res.status === 200) {
                window.toastify(`Popular status ${checked ? 'enabled' : 'disabled'}`, "success");
                // Optimistic UI update
                setMenuItems(prev => prev.map(item => getItemId(item) === itemId ? { ...item, isPopular: checked } : item));
            }
        } catch (err) {
            console.error("Popular status toggle failed:", err);
            window.toastify("Failed to update status", "error");
        }
    };

    // 🔥 Columns structure with safe responsive widths:
    const columns = [
        {
            title: 'Dish',
            dataIndex: 'itemName',
            key: 'itemName',
            width: 240, // 👈 Image aur dish name k liye spacious width
            render: (text, record) => (
                <Space size="middle" className="py-1">
                    <Avatar
                        shape="square"
                        size={64}
                        src={record.imageURL}
                        icon={<PictureOutlined />}
                        className="rounded-xl border border-gray-100 shadow-sm shrink-0 object-cover"
                    />
                    <div>
                        <Text className="font-bold text-gray-900 block text-sm leading-tight hover:text-orange-500 transition-colors">
                            {text}
                        </Text>
                        <Text className="text-gray-400 text-xs mt-0.5 block">
                            {record.itemCategory}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'itemCategory',
            key: 'itemCategory',
            width: 140, // 👈 Category tag k liye safe width
            render: (cat) => (
                <Tag className="rounded-full px-3 py-0.5 bg-orange-50 border-orange-100 text-orange-600 font-semibold text-xs">
                    {cat}
                </Tag>
            )
        },
        {
            title: 'Price',
            dataIndex: 'itemPrice',
            key: 'itemPrice',
            width: 110, // 👈 Price text break na ho
            render: (price) => (
                <Text className="font-black text-orange-600 text-base">
                    ${parseFloat(price).toFixed(2)}
                </Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 130, // 👈 In Stock / Out of Stock tag safe width
            render: (status) => {
                const isInstock = status === 'In Stock';
                return (
                    <Tag className={`rounded-full px-3 py-0.5 border-none font-bold uppercase text-[10px] tracking-wider ${isInstock ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'Popular',
            dataIndex: 'isPopular',
            key: 'isPopular',
            width: 150, // 👈 Switch aur text "Popular" k liye dynamic width
            render: (isPopular, record) => {
                const popular = isTruthy(isPopular);
                return (
                    <Space>
                        <Switch
                            checked={popular}
                            onChange={(checked) => handleTogglePopular(getItemId(record), checked)}
                            checkedChildren={<StarFilled style={{ color: '#fff', fontSize: '10px' }} />}
                            unCheckedChildren={<StarOutlined style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }} />}
                            className={popular ? "bg-amber-400" : "bg-gray-300"}
                        />
                        {popular && <span className="text-amber-500 text-xs font-semibold">Popular</span>}
                    </Space>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: 120, // 👈 Edit/Delete buttons safe screen area
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined className="text-blue-500 text-base" />}
                        onClick={() => handleEditClick(record)}
                        className="hover:bg-blue-50 flex items-center justify-center h-9 w-9 rounded-lg transition-all border border-transparent hover:border-blue-100"
                    />
                    <Popconfirm
                        title="Delete Dish"
                        description={`Are you sure you want to delete ${record.itemName}?`}
                        onConfirm={() => handleDelete(getItemId(record))}
                        okText="Yes, Delete"
                        cancelText="No"
                        okButtonProps={{ danger: true, className: "bg-red-500 border-none font-bold h-8 rounded-lg" }}
                        cancelButtonProps={{ className: "h-8 rounded-lg" }}
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined className="text-red-500 text-base" />}
                            className="hover:bg-red-50 flex items-center justify-center h-9 w-9 rounded-lg transition-all border border-transparent hover:border-red-100"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Combinational search & category dropdown filter logic
    const filteredDishes = menuItems.filter(menuItem => {
        const matchesSearch = (menuItem.itemName || "").toLowerCase().includes(searchText.toLowerCase()) ||
            (menuItem.itemCategory || "").toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = selectedCategoryFilter === "All" || menuItem.itemCategory === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Title level={2} className="!mb-1 !font-bold flex items-center gap-3">
                        <UnorderedListOutlined className="text-orange-500 animate-pulse" /> Menu Management
                    </Title>
                    <Text className="text-gray-500">Create, edit, and filter your professional restaurant dishes dynamically.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-none h-12 px-6 rounded-xl font-bold flex items-center shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    onClick={handleAddClick}
                >
                    Add New Dish
                </Button>
            </div>

            {/* Table Card Container */}
            <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden p-0 bg-white">
                {/* Header Filter Panel */}
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center bg-gray-50/30 gap-4">
                    <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                        <Input
                            prefix={<SearchOutlined className="text-gray-400" />}
                            placeholder="Search dishes..."
                            className="max-w-xs h-12 rounded-xl border-gray-200"
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            allowClear
                        />
                        <Select
                            defaultValue="All"
                            value={selectedCategoryFilter}
                            onChange={(value) => setSelectedCategoryFilter(value)}
                            className="w-48 h-12 rounded-xl border-gray-200"
                            dropdownStyle={{ borderRadius: '12px' }}
                        >
                            <Select.Option value="All">All Categories</Select.Option>
                            {categories.map(cat => (
                                <Select.Option key={cat.id || cat._id} value={cat.name}>{cat.name}</Select.Option>
                            ))}
                        </Select>
                    </div>
                    <Text className="text-gray-400 font-bold whitespace-nowrap bg-white border border-gray-100 rounded-full px-4 py-1.5 shadow-2xs">
                        Total Items: {filteredDishes.length} {filteredDishes.length === 1 ? 'Dish' : 'Dishes'}
                    </Text>
                </div>

                {/* Data Table */}
                <Table
                    columns={columns}
                    dataSource={filteredDishes}
                    rowKey={(record) => getItemId(record)}
                    loading={isLoading}
                    scroll={{ x: 'max-content' }} // 🔥 Yeh line poore table ko mobile responsive horizontal scroll bar de gi
                    pagination={{ pageSize: 5, showSizeChanger: false }}
                    className="custom-admin-table"
                />
            </Card>

            {/* Slick Modern Modal for Adding/Editing Dish */}
            <Modal
                title={
                    <div className="pb-3 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-bold">
                            <PlusOutlined />
                        </div>
                        <div>
                            <Title level={4} className="!mb-0 !font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                {editingItem ? "Edit Culinary Masterpiece" : "Add New Culinary Masterpiece"}
                            </Title>
                            <Text className="text-gray-400 text-xs">Fill in the fields below to publish to the menu.</Text>
                        </div>
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                className="custom-modal rounded-3xl overflow-hidden"
                width={650}
                centered
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleFormSubmit}
                    className="mt-6 space-y-4"
                >
                    {/* Visual Preview & File Upload */}
                    <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6">
                        {(image || (editingItem && editingItem.imageURL)) ? (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                <img
                                    src={image ? URL.createObjectURL(image) : editingItem.imageURL}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                <PictureOutlined className="text-3xl" />
                            </div>
                        )}
                        <div className="flex-1 w-full">
                            <Text className="block font-bold text-gray-700 mb-2">Dish Image</Text>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImage(e.target.files[0]);
                                    }
                                }}
                            />
                            {editingItem && (
                                <Text className="text-gray-400 text-xs mt-1 block">
                                    Leave blank to keep current image.
                                </Text>
                            )}
                        </div>
                    </div>

                    {/* Dish Name */}
                    <Form.Item
                        name="itemName"
                        label={<span className="font-bold text-gray-700">Dish Name</span>}
                        rules={[{ required: true, message: 'Please enter dish name' }]}
                    >
                        <Input placeholder="e.g. Garlic Butter Lobster Tails" className="h-12 rounded-xl border-gray-200" />
                    </Form.Item>

                    {/* Row: Category and Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="itemCategory"
                            label={<span className="font-bold text-gray-700">Menu Category</span>}
                            rules={[{ required: true, message: 'Please select a category' }]}
                        >
                            <Select
                                placeholder="Select category..."
                                className="h-12 rounded-xl border-gray-200"
                                dropdownStyle={{ borderRadius: '12px' }}
                            >
                                {categories.map(cat => (
                                    <Select.Option key={cat.id || cat._id} value={cat.name}>{cat.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="itemPrice"
                            label={<span className="font-bold text-gray-700">Price ($)</span>}
                            rules={[{ required: true, message: 'Please enter price' }]}
                        >
                            <InputNumber
                                min={0}
                                step={0.01}
                                placeholder="0.00"
                                className="w-full h-12 rounded-xl border-gray-200 flex items-center"
                                prefix={<span className="text-gray-400 font-bold">$</span>}
                            />
                        </Form.Item>
                    </div>

                    {/* Switches for Stock & Popular status */}
                    <div className="bg-gray-50/30 border border-gray-100 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Text className="block font-bold text-gray-700 mb-2">Availability Status</Text>
                            <div className="flex items-center gap-3 min-h-8">
                                <Form.Item
                                    name="status"
                                    valuePropName="checked"
                                    className="!mb-0"
                                >
                                    <Switch />
                                </Form.Item>
                                <Text className="font-semibold text-sm">In Stock / Available</Text>
                            </div>
                        </div>

                        <div>
                            <Text className="block font-bold text-gray-700 mb-2">Featured / Popular</Text>
                            <div className="flex items-center gap-3 min-h-8">
                                <Form.Item
                                    name="isPopular"
                                    valuePropName="checked"
                                    className="!mb-0"
                                >
                                    <Switch className="bg-orange-500" />
                                </Form.Item>
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                                    <StarFilled />
                                    <span>High Demand</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <Button
                            className="flex-1 h-12 rounded-xl font-bold border-gray-200 hover:border-gray-300 text-gray-500"
                            onClick={handleCloseModal}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-none font-bold shadow-md shadow-orange-500/10"
                        >
                            {editingItem ? "Save Changes" : "Publish Dish"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Menu;