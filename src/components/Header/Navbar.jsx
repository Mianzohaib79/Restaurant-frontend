import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Button, Drawer, Avatar, Dropdown, Space, Badge } from 'antd';
import {
    MenuOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LogoutOutlined,
    DashboardOutlined,
    HeartOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/Cart.jsx';
import { useFavorites } from '../../context/FavoriteContext.jsx';
import Logo from '../Misc/Logo';
import Topbar from './Topbar';

const { Header: AntHeader } = Layout;

/**
 * Navbar Component
 * Renders a sticky navigation header that hides on scroll down and shows on scroll up.
 * Supports dynamic links based on user roles (Admin vs Customer), cart badge, and favorites.
 */
const Navbar = () => {
    const [visible, setVisible] = useState(false); // Mobile sidebar drawer visibility state
    const [showHeader, setShowHeader] = useState(true); // Navbar sticky visible state
    const [lastScrollY, setLastScrollY] = useState(0);

    const { user, isAuth, handleLogout } = useAuth();
    const location = useLocation();
    const { cartCount } = useCart();
    const { favorites } = useFavorites();

    // 1. Scroll-To-Hide Navbar Effect
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                // Hide header when scrolling down past 100px, show when scrolling up
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setShowHeader(false);
                } else {
                    setShowHeader(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    // 2. Navigation Menu Links Configuration
    const menuItems = [
        { key: '/', label: 'Home' },
        { key: '/about', label: 'About' },
        { key: '/menu', label: 'Menu' },
        { key: '/reservations', label: 'Reservations' },
        { key: '/order-history', label: 'Order History' },
    ];

    // 3. User Dropdown Menu Items (Dynamic Role Check)
    const userMenuItems = [
        {
            key: 'profile',
            label: <Link to="/profile">Profile</Link>,
            icon: <UserOutlined />,
        },
    ];

    // Only show dashboard option if user is logged in as superAdmin
    if (user && user.role === 'superAdmin') {
        userMenuItems.push({
            key: 'dashboard',
            label: <Link to="/dashboard">Dashboard</Link>,
            icon: <DashboardOutlined />,
        });
    }

    // Logout and formatting divider options
    userMenuItems.push(
        { type: 'divider' },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        }
    );

    return (
        <AntHeader className={`fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm px-0 h-auto transition-transform duration-500 ease-in-out transform ${showHeader ? 'translate-y-0' : '-translate-y-full'
            }`}>
            {/* Top promotional bar */}
            <Topbar />

            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/">
                    <Logo />
                </Link>

                {/* Desktop Menu Navigation Links (hidden below tablet size 'md') */}
                <div className="hidden md:flex items-center gap-5">
                    {menuItems.map((item) => (
                        <Link
                            key={item.key}
                            to={item.key}
                            className={`relative text-sm font-semibold tracking-wide transition-all duration-300 group ${location.pathname === item.key ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                                }`}
                        >
                            <span className="relative z-10">{item.label}</span>
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 transition-all duration-300 rounded-full ${location.pathname === item.key ? 'w-full' : 'w-0 group-hover:w-full'
                                }`}></span>
                        </Link>
                    ))}
                </div>

                {/* Right Side Header Actions */}
                <div className="flex items-center gap-2">
                    {/* Favorites Badge & Button */}
                    <Link to="/favorites">
                        <Badge count={favorites.length} size="small" color="#f97316" offset={[-5, 5]}>
                            <Button
                                type="text"
                                icon={<HeartOutlined className="text-xl" />}
                                className="flex items-center justify-center hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all duration-300 rounded-xl w-10 h-10"
                            />
                        </Badge>
                    </Link>

                    {/* Cart Badge & Button */}
                    <Link to="/cart">
                        <Badge count={cartCount} size="small" color="#f97316" offset={[-5, 5]}>
                            <Button
                                type="text"
                                icon={<ShoppingCartOutlined className="text-xl" />}
                                className="flex items-center justify-center hover:bg-orange-50 text-gray-700 hover:text-orange-500 transition-all duration-300 rounded-xl w-10 h-10 mx-1"
                            />
                        </Badge>
                    </Link>

                    {/* Authentication Actions */}
                    {isAuth ? (
                        /* Authenticated User Menu Dropdown */
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                            <Space className="cursor-pointer group ml-2">
                                <div className="relative">
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                        className="bg-orange-500 shadow-lg shadow-orange-500/20 border-2 border-white group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="hidden lg:block text-left ml-1">
                                    <p className="text-[13px] font-bold leading-none text-gray-900 group-hover:text-orange-500 transition-colors">{user?.fullName}</p>
                                    <p className="text-[10px] leading-none text-gray-400 mt-1 uppercase tracking-[0.1em] font-medium">
                                        {user?.role}
                                    </p>
                                </div>
                            </Space>
                        </Dropdown>
                    ) : (
                        /* Unauthenticated Sign In/Sign Up buttons (Desktop only) */
                        <div className="hidden sm:flex items-center gap-3 ml-2">
                            <Link to="/auth/login">
                                <Button type="text" className="font-bold text-gray-600 hover:text-orange-500 transition-colors px-4">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/auth/register">
                                <Button
                                    type="primary"
                                    className="bg-orange-500 hover:bg-orange-600 border-none shadow-lg shadow-orange-500/20 h-11 px-7 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Burger Menu Button: Only visible on mobile/tablet (below 'md') and hidden on screen widths >= 'md' */}
                    <Button
                        type="text"
                        icon={<MenuOutlined className="text-2xl" />}
                        className="md:hidden! flex items-center justify-center text-gray-700 hover:bg-gray-50 rounded-xl w-10 h-10 ml-2"
                        onClick={() => setVisible(true)}
                    />
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <Drawer
                title={<Logo className="scale-90" />}
                placement="right"
                onClose={() => setVisible(false)}
                open={visible}
                styles={{ body: { width: '300px' } }}
                className="font-sans"
            >
                <div className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.key}
                            to={item.key}
                            className={`text-lg font-semibold p-4 rounded-2xl transition-all duration-300 flex items-center justify-between ${location.pathname === item.key
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            onClick={() => setVisible(false)}
                        >
                            {item.label}
                            {location.pathname === item.key && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>}
                        </Link>
                    ))}
                    {!isAuth && (
                        <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-100">
                            <Link to="/auth/login" onClick={() => setVisible(false)}>
                                <Button className="w-full h-12 rounded-2xl font-bold border-gray-200 text-gray-700">Sign In</Button>
                            </Link>
                            <Link to="/auth/register" onClick={() => setVisible(false)}>
                                <Button type="primary" className="w-full h-12 rounded-2xl bg-orange-500 font-bold shadow-lg shadow-orange-500/20">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </Drawer>
        </AntHeader>
    );
};

export default Navbar;