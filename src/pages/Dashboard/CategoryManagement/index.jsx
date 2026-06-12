import React, { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, Button, Space, Input, Modal, Form, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const CategoryManagement = () => {
    const [searchText, setSearchText] = useState("");
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const getCategories = async () => {
        setIsLoading(true);
        axios.get(`${window.api}/api/categories/get-categories`)
            .then(res => {
                if (res.status === 200) {
                    setCategories(res.data.categories);
                }
            })
            .catch(err => {
                console.log(err);
                window.toastify(err?.response?.data?.message || "Something went wrong", "error");
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => { getCategories() }, []);

    const handleAddCategory = (values) => {
        setIsLoading(true);
        axios.post(`${window.api}/api/categories/add-category`, values, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
            .then(res => {
                if (res.status === 201) {
                    getCategories();
                    window.toastify(res.data.message, "success");
                    setIsModalOpen(false);
                    form.resetFields();
                }
            })
            .catch(err => {
                console.log(err);
                window.toastify(err?.response?.data?.message || "Something went wrong", "error");
            })
            .finally(() => setIsLoading(false))
    }

    const deleteCategory = (id) => {
        setIsLoading(true);
        axios.delete(`${window.api}/api/categories/delete-category/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } })
            .then(res => {
                if (res.status === 200) {
                    getCategories();
                    window.toastify(res.data.message, "success");
                }
            })
            .catch(err => {
                console.log(err);
                window.toastify(err?.response?.data?.message || "Something went wrong", "error");
            })
            .finally(() => setIsLoading(false))
    }

    // 🔥 Columns array ko responsive widths de di hain:
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            width: 70, // 👈 Serial number k liye small width
            render: (_, __, index) => <Text className="text-gray-500 font-medium">{index + 1}</Text>,
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 120, // 👈 ID break na ho isliye safe width
            render: (text) => <Text className="text-gray-500 font-medium">{text}</Text>,
        },
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
            width: 180, // 👈 Category names lambe ho sakte hain
            render: (text) => <Text className="font-bold text-gray-900">{text}</Text>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 250, // 👈 Takay text araam se space le sake
            ellipsis: true,
            render: (text) => <Text className="text-gray-500">{text}</Text>,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100, // 👈 Delete button k liye safe width
            render: (text, record) => (
                <Space>
                    <Popconfirm
                        title={`Are you sure to delete category ${record.name}?`}
                        onConfirm={() => deleteCategory(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" icon={<DeleteOutlined />} className="text-red-500 hover:bg-red-50 flex items-center justify-center h-10 w-10" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Title level={2} className="!mb-1 !font-bold flex items-center gap-3">
                        <AppstoreOutlined className="text-orange-500" /> Category Management
                    </Title>
                    <Text className="text-gray-500">Organize your menu into logical sections for your customers.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-orange-500 border-none h-12 px-6 rounded-xl font-bold flex items-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add New Category
                </Button>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden p-0 bg-white">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <Input
                        prefix={<SearchOutlined className="text-gray-400" />}
                        placeholder="Search categories..."
                        className="max-w-xs h-12 rounded-xl border-gray-200"
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                    />
                    <Text className="text-gray-400 font-medium">Total: {categories.length} Categories</Text>
                </div>
                <Table
                    columns={columns}
                    dataSource={categories.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))}
                    loading={isLoading}
                    rowKey={"_id"}
                    scroll={{ x: 'max-content' }} // 🔥 Yeh line ab mobile par horizontal scroll bar le aayegi
                    pagination={false}
                    className="custom-admin-table"
                />
            </Card>

            <Modal
                title={<Title level={4} className="!mb-0">Add New Category</Title>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                className="custom-modal"
                centered
            >
                <Form layout="vertical" form={form} onFinish={handleAddCategory} className="mt-8 space-y-4">
                    <Form.Item name="name" label={<span className="font-bold">Category Name</span>} rules={[{ required: true }]}>
                        <Input placeholder="e.g. Italian Classics" className="h-14 rounded-2xl border-gray-200" />
                    </Form.Item>
                    <Form.Item name="description" label={<span className="font-bold">Description</span>}>
                        <Input.TextArea rows={4} placeholder="Briefly describe this category..." className="rounded-2xl border-gray-200" />
                    </Form.Item>
                    <div className="flex gap-4 pt-4">
                        <Button className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" className="flex-1 h-14 rounded-2xl bg-orange-500 border-none font-bold">Create Category</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement;