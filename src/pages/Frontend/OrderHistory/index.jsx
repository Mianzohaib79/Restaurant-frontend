import React, { useState, useEffect } from 'react';
import ScreenLoader from '../../../components/Misc/ScreenLoader';
import { Typography, Row, Col, Card, Table, Tag, Button, Space, Modal, List } from 'antd';
import { ShoppingOutlined, EyeOutlined, CheckCircleFilled, ClockCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios'; // <-- Axios import kiya

const { Title, Text, Paragraph } = Typography;

const OrderHistory = () => {
    const [orders, setOrders] = useState([]); // <-- Dummy data hata kar live state lagayi
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Live Orders data fetch karne ka function
    const fetchMyOrders = async () => {
        try {
            const res = await axios.get(`${window.api}/api/orders/my-orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
            });
            if (res.data.success) {
                // Table framework key requirement k liye database ki _id ko use kar rhe hain
                const formattedOrders = (res.data.orders || []).map((order) => ({
                    ...order,
                    key: order._id || order.orderId
                }));
                setOrders(formattedOrders);
            }
        } catch (err) {
            console.error("Failed to fetch order history:", err);
            if (window.toastify) {
                window.toastify(err?.response?.data?.message || "Failed to load order history", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (text) => <Text className="font-bold text-gray-900">{text}</Text>,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt', // <-- Database schema k mutabiq 'createdAt' check kiya
            key: 'date',
            render: (date) => <Text className="text-gray-500">{dayjs(date).format('MMM DD, YYYY')}</Text>,
        },
        {
            title: 'Items',
            dataIndex: 'totalItems',
            key: 'items',
            render: (items) => <Text className="font-bold text-gray-700">{items}</Text>,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'total',
            render: (total) => <Text className="font-black text-gray-900">${Number(total || 0).toFixed(2)}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'orange';
                if (status === 'Delivered') color = 'green';
                if (status === 'Cancelled') color = 'red';
                return <Tag color={color} className="rounded-full px-3 py-0.5 font-bold uppercase text-[10px] tracking-wider">{status}</Tag>
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => setSelectedOrder(record)}
                    className="text-blue-500 hover:bg-blue-50 flex items-center justify-center h-10 w-10"
                />
            ),
        },
    ];

    if (loading) return <ScreenLoader />;

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-left">
                        <Title level={2} className="!mb-2 !font-bold flex items-center gap-3">
                            <ShoppingOutlined className="text-orange-500" /> Order History
                        </Title>
                        <Text className="text-gray-500 text-lg">Manage and track your recent culinary experiences.</Text>
                    </div>
                </div>

                {/* Desktop View Table */}
                <div className="hidden md:block">
                    <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden p-0 bg-white">
                        <Table
                            columns={columns}
                            dataSource={orders}
                            pagination={orders.length > 5 ? { pageSize: 5 } : false}
                            className="custom-table"
                        />
                    </Card>
                </div>

                {/* Mobile View / Cards for small screens */}
                <div className="md:hidden space-y-4 mt-8">
                    {orders.length === 0 ? (
                        <Card className="rounded-3xl text-center p-8 border-none shadow-sm">
                            <Text className="text-gray-400 block">No orders found.</Text>
                        </Card>
                    ) : (
                        orders.map((order) => (
                            <Card key={order.key} className="rounded-3xl border-none shadow-sm p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <Title level={5} className="!mb-0">{order.orderId}</Title>
                                    <Tag color={order.status === 'Delivered' ? 'green' : 'orange'} className="rounded-full px-3 py-0.5 font-bold uppercase text-[10px] tracking-wider">{order.status}</Tag>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text className="font-black text-xl text-gray-900">${Number(order.totalAmount || 0).toFixed(2)}</Text>
                                    <Button
                                        type="text"
                                        icon={<EyeOutlined />}
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-blue-500 hover:bg-blue-50 flex items-center justify-center h-10 w-10"
                                    />
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* EXACT SAME MODAL AS ORDERS.JSX */}
            <Modal
                title={`Order Details ${selectedOrder?.orderId || ''}`}
                open={!!selectedOrder}
                onCancel={() => setSelectedOrder(null)}
                footer={null}
                centered
            >
                {selectedOrder && (
                    <div className="space-y-5">
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <Text className="block font-bold">{selectedOrder.fullName}</Text>
                            <Text className="block text-gray-500">{selectedOrder.phoneNumber}</Text>
                            <Text className="block text-gray-500">{selectedOrder.address}</Text>
                        </div>

                        <List
                            dataSource={selectedOrder.items || []}
                            renderItem={(item) => (
                                <List.Item>
                                    <div>
                                        <Text className="font-bold block">{item.name}</Text>
                                        <Text className="text-gray-500">Qty: {item.quantity} x ${Number(item.price || 0).toFixed(2)}</Text>
                                    </div>
                                    <Text className="font-black">${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</Text>
                                </List.Item>
                            )}
                        />

                        <div className="flex justify-between border-t border-gray-100 pt-4">
                            <Text className="font-bold">Total Items: {selectedOrder.totalItems}</Text>
                            <Text className="font-black text-orange-600">Total: ${Number(selectedOrder.totalAmount || 0).toFixed(2)}</Text>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderHistory;