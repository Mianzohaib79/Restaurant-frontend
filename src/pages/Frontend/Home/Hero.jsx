import React, { useState } from 'react';
import { Button, Typography, Space, Row, Col, Modal } from 'antd';
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const { Title, Paragraph } = Typography;

const Hero = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 md:pt-32 overflow-hidden bg-white">
            <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-yellow-50 rounded-full blur-3xl opacity-60"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <Row gutter={[40, 40]} align="middle">
                    <Col xs={24} xl={12}>
                        <div className="max-w-xl mx-auto xl:mx-0 text-center xl:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 mt-3 bg-orange-50 text-orange-600 rounded-full text-sm font-bold mb-6 border border-orange-100 animate-bounce">
                                Now Serving Dinner & Drinks
                            </div>

                            <Title className="!text-4xl sm:!text-5xl md:!text-6xl xl:!text-7xl !font-extrabold !text-gray-900 !leading-[1.1] mb-6">
                                Savor the <span className="text-orange-500">Exquisite</span> Taste of Excellence
                            </Title>

                            <Paragraph className="text-base md:text-lg xl:text-xl text-gray-500 mb-8 md:mb-10 leading-relaxed">
                                Experience a symphony of flavors crafted with passion. Our chefs bring together the finest ingredients to create culinary masterpieces that delight your senses.
                            </Paragraph>

                            <Space size="large" className="flex-wrap justify-center xl:justify-start">
                                <Link to="/menu">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="bg-orange-500 hover:bg-orange-600 border-none h-14 px-8 md:px-10 rounded-2xl text-base md:text-lg font-bold shadow-xl shadow-orange-200 flex items-center gap-2"
                                    >
                                        Order Online <ArrowRightOutlined />
                                    </Button>
                                </Link>
                                <Button
                                    type="text"
                                    size="large"
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-14 px-6 flex items-center gap-3 text-base md:text-lg font-semibold text-gray-700 hover:text-orange-500 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                                        <PlayCircleOutlined className="text-orange-500" />
                                    </div>
                                    Watch Story
                                </Button>
                            </Space>

                            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-16 pt-8 border-t border-gray-100">
                                <div>
                                    <h4 className="text-2xl md:text-3xl font-bold text-gray-900">12k+</h4>
                                    <p className="text-gray-500 text-xs md:text-sm">Happy Customers</p>
                                </div>
                                <div>
                                    <h4 className="text-2xl md:text-3xl font-bold text-gray-900">45+</h4>
                                    <p className="text-gray-500 text-xs md:text-sm">Signature Dishes</p>
                                </div>
                                <div>
                                    <h4 className="text-2xl md:text-3xl font-bold text-gray-900">4.9</h4>
                                    <p className="text-gray-500 text-xs md:text-sm">Review Rating</p>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} xl={12}>
                        <div className="relative max-w-[500px] mx-auto xl:max-w-none px-4 sm:px-10 xl:px-0">
                            <div className="relative z-10 w-full aspect-square rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200 border-4 md:border-8 border-white group">
                                <img
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                                    alt="Delicious Food"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>

                            <div className="absolute top-6 -left-2 sm:-left-6 z-20 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl animate-float max-w-[150px] md:max-w-[180px]">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl md:rounded-2xl flex items-center justify-center text-green-600 text-lg md:text-xl font-bold">
                                        🥗
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Freshly Made</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900">Organic Salad</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-6 -right-2 sm:-right-6 z-20 bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl animate-float-delayed max-w-[170px] md:max-w-[200px]">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center text-orange-600 text-lg md:text-xl font-bold">
                                        ★
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Top Rated</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900">EatEase Experience</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <Modal
                title={null}
                footer={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                destroyOnClose={true}
                centered
                width={800}
                /* style={...} directly wrapper ko target karta hai jo white box ko jad se khatam kar dega */
                style={{ backgroundColor: 'transparent', padding: 0, boxShadow: 'none' }}
                styles={{
                    mask: { backdropFilter: 'blur(4px)' },
                    content: {
                        padding: 0,
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        borderRadius: '1.5rem',
                        overflow: 'hidden'
                    },
                    body: {
                        padding: 0,
                        backgroundColor: 'transparent',
                        overflow: 'hidden'
                    }
                }}
                closeIcon={
                    <span className="text-white text-base bg-black/60 w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-500 transition-colors">
                        ✕
                    </span>
                }
            >
                <div className="aspect-video w-full bg-black rounded-[1.5rem] overflow-hidden shadow-2xl">
                    <video
                        src="/5101342-uhd_3840_2160_25fps.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover pointer-events-none"
                    />
                </div>
            </Modal>
        </section>
    );
};

export default Hero;