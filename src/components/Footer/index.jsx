import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Row, Col, Space, Button, Divider } from 'antd';
import { FacebookFilled, InstagramFilled, TwitterSquareFilled, YoutubeFilled, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Logo from '../Misc/Logo';

const { Title, Text, Paragraph } = Typography;

const Footer = () => {
    return (
        <footer className="bg-gray-900 pt-24 pb-12 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[150px]"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <Row gutter={[48, 48]}>
                    {/* Brand Section - xl={8} for desktop, lg={12} forces full breathing room on medium viewports */}
                    <Col xs={24} sm={24} lg={12} xl={8}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="mb-8">
                                <Logo />
                            </div>
                            <Paragraph className="text-white! text-lg leading-relaxed mb-8 max-w-sm">
                                Elevating the art of dining through passion, innovation, and the finest ingredients. Join us for an unforgettable culinary journey with EatEase.
                            </Paragraph>
                            <div className="flex gap-4">
                                <a
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 text-xl cursor-pointer"
                                    >
                                        <FacebookFilled />
                                    </motion.div>
                                </a>

                                <a
                                    href="https://www.instagram.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 text-xl cursor-pointer"
                                    >
                                        <InstagramFilled />
                                    </motion.div>
                                </a>

                                <a
                                    href="https://www.twitter.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 text-xl cursor-pointer"
                                    >
                                        <TwitterSquareFilled />
                                    </motion.div>
                                </a>

                                <a
                                    href="https://www.youtube.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 text-xl cursor-pointer"
                                    >
                                        <YoutubeFilled />
                                    </motion.div>
                                </a>
                            </div>
                        </motion.div>
                    </Col>

                    {/* Quick Links - Smooth layout on md/lg screens */}
                    <Col xs={24} sm={12} lg={12} xl={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Title level={4} className="!text-orange-500 !font-bold mb-8">Quick Links</Title>
                            <ul className="flex flex-col gap-4 p-0 list-none">
                                <li><Link to="/" className="text-white! hover:text-orange-500! transition-colors text-lg">Home</Link></li>
                                <li><Link to="/about" className="text-white! hover:text-orange-500! transition-colors text-lg">About Us</Link></li>
                                <li><Link to="/menu" className="text-white! hover:text-orange-500! transition-colors text-lg">Our Menu</Link></li>
                                <li><Link to="/reservations" className="text-white! hover:text-orange-500! transition-colors text-lg">Reservations</Link></li>
                            </ul>
                        </motion.div>
                    </Col>

                    {/* Menu Categories */}
                    <Col xs={24} sm={12} lg={12} xl={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Title level={4} className="!text-orange-500 !font-bold mb-8">Categories</Title>
                            <ul className="flex flex-col gap-4 p-0 list-none">
                                <li><Link to="/menu" className="text-white! hover:text-orange-500! transition-colors text-lg">Starters</Link></li>
                                <li><Link to="/menu" className="text-white! hover:text-orange-500! transition-colors text-lg">Main Course</Link></li>
                                <li><Link to="/menu" className="text-white! hover:text-orange-500! transition-colors text-lg">Desserts</Link></li>
                                <li><Link to="/menu" className="text-white! hover:text-orange-500! transition-colors text-lg">Drinks</Link></li>
                            </ul>
                        </motion.div>
                    </Col>

                    {/* Contact Info - Prevent text clipping between 992px and 1022px */}
                    <Col xs={24} sm={24} lg={12} xl={8}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Title level={4} className="!text-orange-500 !font-bold mb-8">Contact Us</Title>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-start gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 text-xl cursor-pointer shrink-0"
                                    >
                                        <EnvironmentOutlined />
                                    </motion.div>
                                    <div>
                                        <Text className="text-white! font-bold block mb-1">Location</Text>
                                        <Text className="text-white!">123 EatEase Street, Food City, FC 12345</Text>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 text-xl cursor-pointer shrink-0"
                                    >
                                        <PhoneOutlined />
                                    </motion.div>
                                    <div>
                                        <Text className="text-white! font-bold block mb-1">Phone</Text>
                                        <Text className="text-white!">03046787426</Text>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 text-xl cursor-pointer shrink-0"
                                    >
                                        <MailOutlined />
                                    </motion.div>
                                    <div>
                                        <Text className="text-white! font-bold block mb-1">Email</Text>
                                        <Text className="text-white! break-all">rafiqzohai515@gmail.com</Text>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Col>
                </Row>

                <Divider className="border-white/10 my-16" />

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <Text className="text-white! text-base">
                        © {new Date().getFullYear()} EatEase Restaurant. All rights reserved.
                    </Text>
                    <div className="flex gap-8">
                        <Link className="text-white hover:text-orange-500 transition-colors">Privacy Policy</Link>
                        <Link className="text-white hover:text-orange-500 transition-colors">Terms of Service</Link>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;