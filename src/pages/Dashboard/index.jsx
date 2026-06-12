import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Badge, Breadcrumb } from 'antd';
import { DashboardOutlined, AppstoreOutlined, UnorderedListOutlined, ShoppingCartOutlined, UserOutlined, BellOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

import Home from './Home';
import CategoryManagement from './CategoryManagement';
import MenuManagement from './MenuManagement';
import Orders from './Orders';
import Users from './Users';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, handleLogout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Overview</Link>,
        },
        {
            key: '/dashboard/category',
            icon: <AppstoreOutlined />,
            label: <Link to="/dashboard/category">Categories</Link>,
        },
        {
            key: '/dashboard/menu',
            icon: <UnorderedListOutlined />,
            label: <Link to="/dashboard/menu">Menu Items</Link>,
        },
        {
            key: '/dashboard/orders',
            icon: <ShoppingCartOutlined />,
            label: <Link to="/dashboard/orders">Orders</Link>,
        },
        {
            key: '/dashboard/users',
            icon: <UserOutlined />,
            label: <Link to="/dashboard/users">User Management</Link>,
        },
    ];

    const userMenuItems = [
        {
            key: 'home',
            label: 'Home',
            icon: <HomeOutlined />,
            onClick: () => navigate("/"),
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <Layout className="h-screen overflow-hidden bg-gray-50">

            {/* Sidebar */}
            <Sider trigger={null} collapsible collapsed={collapsed} width={260} breakpoint="md" collapsedWidth={0} onCollapse={(collapsedState) => setCollapsed(collapsedState)}
                className={`bg-white border-r border-gray-100 h-screen top-0 left-0 z-30 transition-all duration-300 ${collapsed ? 'hidden md:block md:w-0' : 'fixed md:sticky w-[260px]'
                    }`}
                theme="light"
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-100 gap-2 overflow-hidden">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">R</span>
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Admin<span className="text-orange-500">Panel</span>
                        </span>
                    )}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    className="border-none mt-4 px-2"
                    onClick={() => {
                        if (window.innerWidth < 768) setCollapsed(true);
                    }}
                />
            </Sider>

            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}

            <Layout className="h-screen flex flex-col">

                {/* Header */}
                <Header className="bg-white! px-4 md:px-6 flex items-center justify-between border-b border-gray-100 h-20 sticky top-0 z-10 w-full shrink-0">
                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-lg w-10 h-10 flex items-center justify-center text-black!"
                        />
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        {/* <Badge count={5} size="small" offset={[2, 0]}>
                            <Button type="text" icon={<BellOutlined className="text-lg" />} className="flex items-center justify-center h-10 w-10 bg-orange-500! text-white!" />
                        </Badge> */}
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                            <Space className="cursor-pointer ">
                                <Avatar size="large" icon={<UserOutlined />} />
                                <div className="hidden lg:block">
                                    <Text className="text-[10px] text-gray-400 block leading-none">{user?.role || 'Administrator'}</Text>
                                </div>
                            </Space>
                        </Dropdown>
                    </div>
                </Header>

                {/* Content */}
                <Content className="p-4 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/category" element={<CategoryManagement />} />
                            <Route path="/menu/*" element={<MenuManagement />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/users" element={<Users />} />
                        </Routes>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;