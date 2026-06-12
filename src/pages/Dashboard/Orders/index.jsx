import React, { useEffect, useState } from 'react';
import { Typography, Card, Table, Tag, Button, Space, Input, Select, Avatar, Row, Col, Modal, List } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, EyeOutlined, CheckCircleOutlined, PrinterOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Orders');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // --- Nayi States Status Update Ke Liye ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [isUpdating, setIsLoadingUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${window.api}/api/orders/get-orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
            });
            setOrders(res.data.orders || []);
        } catch (err) {
            console.error("Failed to load orders:", err);
            window.toastify(err?.response?.data?.message || "Failed to load orders", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Status save karne ka function (API Call)
    const handleUpdateStatus = async () => {
        if (!editingOrder || !newStatus) return;

        setIsLoadingUpdating(true);
        try {
            const res = await axios.put(`${window.api}/api/orders/update-status`,
                {
                    orderId: editingOrder._id || editingOrder.orderId, // Jo bhi MongoDB id key use ho rhi ho
                    status: newStatus
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
                }
            );

            if (res.data.success) {
                window.toastify(res.data.message || "Status updated successfully", "success");
                setIsEditModalOpen(false);
                setEditingOrder(null);
                fetchOrders(); // Table data refresh karne k liye
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            window.toastify(err?.response?.data?.message || "Failed to update status", "error");
        } finally {
            setIsLoadingUpdating(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = (order.orderId || '').toLowerCase().includes(searchText.toLowerCase()) ||
            (order.fullName || '').toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'All Orders' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 130, // Responsive width fix
            render: (text) => <Text className="font-bold text-gray-900">{text}</Text>,
        },
        {
            title: 'Customer',
            dataIndex: 'fullName',
            key: 'customer',
            width: 180, // Responsive width fix
            render: (text) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} className="bg-gray-100 text-gray-400" />
                    <Text className="font-medium whitespace-nowrap">{text}</Text>
                </Space>
            )
        },
        {
            title: 'Type',
            dataIndex: 'paymentMethod',
            key: 'type',
            width: 110, // Responsive width fix
            render: (type) => <Tag color="blue" className="rounded-full px-3 font-bold border-none">{type}</Tag>
        },
        {
            title: 'Table/Addr',
            dataIndex: 'address',
            key: 'table',
            width: 200, // Responsive width fix
            render: (text) => <Text className="text-gray-400 text-xs block truncate max-w-[180px]" title={text}>{text}</Text>
        },
        {
            title: 'Items',
            dataIndex: 'totalItems',
            key: 'items',
            width: 80, // Responsive width fix
            render: (items) => <Text className="font-bold text-gray-700">{items}</Text>,
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'total',
            width: 100, // Responsive width fix
            render: (total) => <Text className="font-black text-gray-900">${Number(total || 0).toFixed(2)}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 140, // Responsive width fix
            render: (status) => {
                let color = 'orange';
                if (status === 'Delivered') color = 'green';
                if (status === 'Cancelled') color = 'red';
                return <Tag color={color} className="rounded-full px-3 py-0.5 font-bold uppercase text-[10px] tracking-wider">{status}</Tag>
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 110, // Responsive width fix
            fixed: 'right', // Choti screen par actions freeze rahenge taaki tracking easy ho
            render: (_, record) => (
                <Space>
                    <Button type="text" icon={<EyeOutlined />} onClick={() => setSelectedOrder(record)} className="text-blue-500 hover:bg-blue-50 flex items-center justify-center h-9 w-9" />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingOrder(record);
                            setNewStatus(record.status);
                            setIsEditModalOpen(true);
                        }}
                        className="text-gray-500 hover:bg-gray-50 flex items-center justify-center h-9 w-9"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6 md:space-y-8 p-2 md:p-0">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Title level={2} className="!mb-1 !font-bold flex items-center gap-3 !text-2xl md:!text-3xl">
                        <ShoppingCartOutlined className="text-orange-500" /> Order Management
                    </Title>
                    <Text className="text-gray-500 text-sm md:text-base">Track and manage incoming orders from all channels.</Text>
                </div>
                <div className="w-full sm:w-auto">
                    <Button type="primary" onClick={fetchOrders} className="bg-orange-500 border-none h-11 md:h-12 w-full sm:w-auto px-6 rounded-xl font-bold">Refresh Orders</Button>
                </div>
            </div>

            {/* Quick Filters - Added Horizontal Scrollbar for Mobile */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
                <div className="flex flex-nowrap gap-2 min-w-max">
                    {['All Orders', 'Pending', 'Preparing', 'Ready for Dispatch', 'Delivered', 'Cancelled'].map((filter, idx) => (
                        <Button
                            key={idx}
                            onClick={() => setStatusFilter(filter)}
                            className={`h-10 px-5 rounded-xl font-bold border-none shadow-sm transition-all text-sm ${statusFilter === filter ? 'bg-orange-500 text-white' : 'bg-white text-gray-500'}`}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Main Table Card */}
            <Card className="rounded-[1.5rem] md:rounded-[2.5rem] border-none shadow-sm overflow-hidden p-0 bg-white">
                <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center bg-gray-50/30 gap-4">
                    <Input
                        prefix={<SearchOutlined className="text-gray-400" />}
                        placeholder="Search by Order ID or Customer..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full sm:max-w-md h-11 md:h-12 rounded-xl border-gray-200"
                        allowClear
                    />
                </div>

                {/* AntD Table with Responsive Config */}
                <div className="responsive-table-wrapper">
                    <Table
                        columns={columns}
                        dataSource={filteredOrders}
                        rowKey={(record) => record._id || record.orderId}
                        loading={isLoading}
                        pagination={{ pageSize: 5 }}
                        className="custom-admin-table"
                        scroll={{ x: 1000 }} // Mobile par inner horizontal scroll active karega
                    />
                </div>
            </Card>

            {/* View Order Details Modal */}
            <Modal
                title={`Order Details ${selectedOrder?.orderId || ''}`}
                open={!!selectedOrder}
                onCancel={() => setSelectedOrder(null)}
                footer={null}
                centered
                width={500}
                className="p-2 sm:p-0"
            >
                {selectedOrder && (
                    <div className="space-y-5 pt-2">
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <Text className="block font-bold text-base">{selectedOrder.fullName}</Text>
                            <Text className="block text-gray-500 mt-0.5">{selectedOrder.phoneNumber}</Text>
                            <Text className="block text-gray-500 text-sm mt-1">{selectedOrder.address}</Text>
                        </div>

                        <List
                            className="max-h-[250px] overflow-y-auto pr-1"
                            dataSource={selectedOrder.items || []}
                            renderItem={(item) => (
                                <List.Item className="!px-1">
                                    <div className="max-w-[70%]">
                                        <Text className="font-bold block break-words">{item.name}</Text>
                                        <Text className="text-gray-500 text-xs">Qty: {item.quantity} x ${Number(item.price || 0).toFixed(2)}</Text>
                                    </div>
                                    <Text className="font-black text-right">${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</Text>
                                </List.Item>
                            )}
                        />

                        <div className="flex justify-between border-t border-gray-100 pt-4 items-center">
                            <Text className="font-bold">Total Items: {selectedOrder.totalItems}</Text>
                            <Text className="font-black text-lg text-orange-600">Total: ${Number(selectedOrder.totalAmount || 0).toFixed(2)}</Text>
                        </div>
                    </div>
                )}
            </Modal>

            {/* --- NAYA EDIT STATUS MODAL --- */}
            <Modal
                title={<Title level={4} className="!mb-0 !text-lg sm:!text-xl">Update Order Status</Title>}
                open={isEditModalOpen}
                onCancel={() => {
                    setIsEditModalOpen(false);
                    setEditingOrder(null);
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setIsEditModalOpen(false);
                            setEditingOrder(null);
                        }}
                        className="rounded-xl font-bold h-10 sm:h-11"
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        loading={isUpdating}
                        onClick={handleUpdateStatus}
                        className="bg-orange-500 hover:bg-orange-600 border-none rounded-xl font-bold h-10 sm:h-11 px-6"
                    >
                        Save Changes
                    </Button>
                ]}
                centered
                width={450}
                className="p-2 sm:p-0"
            >
                {editingOrder && (
                    <div className="py-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center bg-gray-50 p-4 rounded-xl">
                            <div>
                                <Text className="text-gray-400 text-[10px] sm:text-xs block">ORDER ID</Text>
                                <Text className="font-bold text-gray-900 text-sm sm:text-base">{editingOrder.orderId}</Text>
                            </div>
                            <div>
                                <Text className="text-gray-400 text-[10px] sm:text-xs block sm:text-right">CUSTOMER</Text>
                                <Text className="font-medium text-gray-800 text-sm sm:text-base block sm:text-right">{editingOrder.fullName}</Text>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Text className="font-bold text-gray-700 text-sm block">Select New Status:</Text>
                            <Select
                                value={newStatus}
                                onChange={(value) => setNewStatus(value)}
                                className="w-full h-11 sm:h-12 custom-status-select"
                                popupClassName="rounded-xl"
                            >
                                <Option value="Pending">Pending</Option>
                                <Option value="Preparing">Preparing</Option>
                                <Option value="Ready for Dispatch">Ready for Dispatch</Option>
                                <Option value="Delivered">Delivered</Option>
                                <Option value="Cancelled">Cancelled</Option>
                            </Select>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;