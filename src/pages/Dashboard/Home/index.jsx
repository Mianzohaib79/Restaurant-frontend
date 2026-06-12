import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Table, Tag, Button, Spin, Divider } from 'antd';
import { RiseOutlined, UserOutlined, ShoppingCartOutlined, DollarCircleOutlined, ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined, CreditCardOutlined, WalletOutlined, ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, CarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);
const { Title, Text } = Typography;

const DashboardHome = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt');
            const res = await axios.get(`${window.api}/api/orders/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            window.toastify("Failed to fetch live dashboard stats", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading && !stats) {
        return (
            <div className="h-[70vh] flex flex-col justify-center items-center gap-4 bg-gray-50/50 rounded-[2.5rem]">
                <Spin size="large" />
                <Text className="text-gray-500 font-medium">Loading live dashboard data...</Text>
            </div>
        );
    }

    const {
        totalRevenue = 0,
        totalOrders = 0,
        activeUsers = 0,
        growthRate = 0,
        recentOrders = [],
        statusDistribution = {},
        paymentDistribution = {}
    } = stats || {};

    const statCards = [
        {
            title: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            icon: <DollarCircleOutlined />,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            trend: `${growthRate >= 0 ? '+' : ''}${growthRate}%`,
            trendUp: growthRate >= 0,
            description: 'Non-cancelled orders revenue'
        },
        {
            title: 'Total Orders',
            value: totalOrders.toLocaleString(),
            icon: <ShoppingCartOutlined />,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            trend: null,
            description: 'All-time lifetime orders'
        },
        {
            title: 'Active Users',
            value: activeUsers.toLocaleString(),
            icon: <UserOutlined />,
            color: 'text-green-500',
            bg: 'bg-green-50',
            trend: null,
            description: 'Registered customer accounts'
        },
        {
            title: 'Growth Rate',
            value: `${growthRate >= 0 ? '+' : ''}${growthRate}%`,
            icon: <RiseOutlined />,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            trend: null,
            description: 'Revenue vs last month'
        },
    ];

    // 🔥 Columns array ko responsive widths k sath set kar diya ha:
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 130, // 👈 Phone screen par column ko tootne se bachaye ga
            render: (text) => <Text className="font-bold text-gray-800">{text}</Text>
        },
        {
            title: 'Customer',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 160, // 👈 Name columns k liye flexible standard width
            render: (text) => <Text className="font-medium text-gray-700">{text}</Text>
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 120,
            render: (val) => <Text className="text-orange-600 font-black">${Number(val || 0).toFixed(2)}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150, // 👈 Badge/Tag k liye perfect width
            render: (status) => {
                let color = 'orange';
                let icon = <ClockCircleOutlined />;
                if (status === 'Preparing') {
                    color = 'processing';
                    icon = <SyncOutlined spin />;
                } else if (status === 'Ready for Dispatch') {
                    color = 'cyan';
                    icon = <CarOutlined />;
                } else if (status === 'Delivered') {
                    color = 'success';
                    icon = <CheckCircleOutlined />;
                } else if (status === 'Cancelled') {
                    color = 'error';
                    icon = <CloseCircleOutlined />;
                }
                return (
                    <Tag icon={icon} color={color} className="rounded-full px-3 py-0.5 font-bold uppercase text-[10px] tracking-wider">
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: 'Time',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 130,
            render: (date) => <Text className="text-gray-400 text-xs font-medium">{dayjs(date).fromNow()}</Text>
        },
    ];

    // Calculate Payment Method percentages
    const codCount = paymentDistribution['Cash on Delivery'] || 0;
    const onlineCount = paymentDistribution['Online Payment'] || 0;
    const totalPayments = codCount + onlineCount || 1;
    const codPercent = Math.round((codCount / totalPayments) * 100);
    const onlinePercent = Math.round((onlineCount / totalPayments) * 100);

    // Calculate Status Pipeline counts
    const totalPipeline = totalOrders || 1;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Title level={2} className="!mb-1 !font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Dashboard Overview
                    </Title>
                    <Text className="text-gray-500 font-medium">Welcome back, Admin. Here is your restaurant's live performance.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<ReloadOutlined spin={loading} />}
                    onClick={fetchStats}
                    className="bg-orange-500 hover:bg-orange-600 border-none h-11 px-6 rounded-xl font-bold flex items-center justify-center transition-all shadow-md shadow-orange-500/20"
                >
                    Refresh Stats
                </Button>
            </div>

            {/* Stats Grid */}
            <motion.div variants={containerVariants} initial="hidden" animate="show">
                <Row gutter={[24, 24]}>
                    {statCards.map((stat, idx) => (
                        <Col xs={24} sm={12} lg={6} key={idx}>
                            <motion.div variants={itemVariants}>
                                <Card className="rounded-[2rem] border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group p-2 relative overflow-hidden bg-white">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-[4rem] -z-0 opacity-50"></div>
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                                            {stat.icon}
                                        </div>
                                        {stat.trend && (
                                            <div className={`flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${stat.trendUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
                                                }`}>
                                                {stat.trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {stat.trend}
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative z-10">
                                        <Text className="text-gray-400 block mb-1 uppercase tracking-wider text-[10px] font-bold">{stat.title}</Text>
                                        <Title level={3} className="!mb-0 !font-black text-gray-800">{stat.value}</Title>
                                        <Text className="text-gray-400 text-[10px] block mt-1">{stat.description}</Text>
                                    </div>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </motion.div>

            {/* Charts & Tables */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <Card
                            title={<span className="font-extrabold text-lg text-gray-800">Recent Live Orders</span>}
                            className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white p-1"
                        >
                            <Table
                                columns={columns}
                                dataSource={recentOrders}
                                scroll={{ x: 'max-content' }} // 🔥 Yeh bilkul responsive scroll handle karega
                                pagination={false}
                                rowKey={(record) => record._id || record.orderId}
                                className="custom-admin-table"
                            />
                            <div className="mt-6 text-center">
                                <Button
                                    type="link"
                                    className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
                                    onClick={() => navigate('/dashboard/orders')}
                                >
                                    View All Orders
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </Col>

                <Col xs={24} lg={8}>
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
                        {/* Sales Payment Channels Card */}
                        <Card
                            title={<span className="font-extrabold text-lg text-gray-800">Payment Channels</span>}
                            className="rounded-[2.5rem] border-none shadow-sm bg-white"
                        >
                            <div className="flex flex-col gap-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <CreditCardOutlined className="text-blue-500" />
                                            <Text>Online Payment</Text>
                                        </div>
                                        <Text className="text-gray-900">{onlinePercent}% <span className="text-gray-400 font-normal">({onlineCount})</span></Text>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${onlinePercent}%` }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <WalletOutlined className="text-orange-500" />
                                            <Text>Cash on Delivery</Text>
                                        </div>
                                        <Text className="text-gray-900">{codPercent}% <span className="text-gray-400 font-normal">({codCount})</span></Text>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${codPercent}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Order Pipeline Stats Card */}
                        <Card
                            title={<span className="font-extrabold text-lg text-gray-800">Active Order Pipeline</span>}
                            className="rounded-[2.5rem] border-none shadow-sm bg-white"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Pending', count: statusDistribution['Pending'] || 0, color: 'bg-orange-500', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
                                    { label: 'Preparing', count: statusDistribution['Preparing'] || 0, color: 'bg-blue-500', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
                                    { label: 'Ready', count: statusDistribution['Ready for Dispatch'] || 0, color: 'bg-cyan-500', iconBg: 'bg-cyan-50', iconColor: 'text-cyan-500' },
                                    { label: 'Delivered', count: statusDistribution['Delivered'] || 0, color: 'bg-green-500', iconBg: 'bg-green-50', iconColor: 'text-green-500' },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-gray-50/50 flex flex-col gap-1 border border-gray-100/50">
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{item.label}</span>
                                        <span className="text-2xl font-black text-gray-800">{item.count}</span>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                                            <div
                                                className={`h-full ${item.color} rounded-full`}
                                                style={{ width: `${Math.min(100, Math.round((item.count / totalPipeline) * 100))}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardHome;