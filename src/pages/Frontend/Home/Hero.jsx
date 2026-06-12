import React from 'react';
import { Button, Typography, Space, Row, Col } from 'antd';
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 overflow-hidden bg-white">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-yellow-50 rounded-full blur-3xl opacity-60"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <Row gutter={[40, 40]} align="middle">
                    <Col xs={24} lg={12}>
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-bold mb-6 border border-orange-100 animate-bounce">
                                {/* <span className="flex w-2 h-2 bg-orange-600 rounded-full"></span> */}
                                Now Serving Dinner & Drinks
                            </div>
                            <Title className="!text-5xl md:!text-7xl !font-extrabold !text-gray-900 !leading-[1.1] mb-6">
                                Savor the <span className="text-orange-500">Exquisite</span> Taste of Excellence
                            </Title>
                            <Paragraph className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed">
                                Experience a symphony of flavors crafted with passion. Our chefs bring together the finest ingredients to create culinary masterpieces that delight your senses.
                            </Paragraph>
                            <Space size="large" className="flex-wrap">
                                <Link to="/menu">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="bg-orange-500 hover:bg-orange-600 border-none h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-orange-200 flex items-center gap-2"
                                    >
                                        Order Online <ArrowRightOutlined />
                                    </Button>
                                </Link>
                                <Button
                                    type="text"
                                    size="large"
                                    className="h-14 px-6 flex items-center gap-3 text-lg font-semibold text-gray-700 hover:text-orange-500 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                                        <PlayCircleOutlined className="text-orange-500" />
                                    </div>
                                    Watch Story
                                </Button>
                            </Space>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-100">
                                <div>
                                    <h4 className="text-3xl font-bold text-gray-900">12k+</h4>
                                    <p className="text-gray-500 text-sm">Happy Customers</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-gray-900">45+</h4>
                                    <p className="text-gray-500 text-sm">Signature Dishes</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-gray-900">4.9</h4>
                                    <p className="text-gray-500 text-sm">Review Rating</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} lg={12}>
                        <div className="relative">
                            {/* Main Image Container */}
                            <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200 border-8 border-white group">
                                <img
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                                    alt="Delicious Food"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>

                            {/* Floating Element 1 */}
                            <div className="absolute top-10 -left-10 z-20 bg-white p-4 rounded-3xl shadow-2xl animate-float max-w-[180px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-xl font-bold">
                                        🥗
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Freshly Made</p>
                                        <p className="text-sm font-bold text-gray-900">Organic Salad</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element 2 */}
                            <div className="absolute bottom-10 -right-10 z-20 bg-white p-4 rounded-3xl shadow-2xl animate-float-delayed max-w-[200px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 text-xl font-bold">
                                        ⭐
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Top Rated</p>
                                        <p className="text-sm font-bold text-gray-900">EatEase Experience</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default Hero;