import React, { useState, useEffect } from 'react';
import ScreenLoader from '../../../components/Misc/ScreenLoader';
import { Typography, Row, Col, Card, Space, Button } from 'antd';
import { HistoryOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <ScreenLoader />;

    return (
        <div className="bg-white pt-32 pb-24">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Hero Section */}
                <Row gutter={[48, 48]} align="middle" className="mb-32">
                    <Col xs={24} lg={12}>
                        <div className="max-w-xl">
                            <div className="inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-bold text-sm mb-6 uppercase tracking-widest">
                                Our Story
                            </div>
                            <Title className="!text-5xl !font-bold mb-8">Crafting Culinary <span className="text-orange-500">Excellence</span> Since 1995</Title>
                            <Paragraph className="text-gray-500 text-lg leading-relaxed mb-8">
                                EatEase started with a simple vision: to bring people together over exceptional food and warm hospitality. What began as a small family bistro has grown into a destination for food lovers seeking an authentic gastronomic experience.
                            </Paragraph>
                            <Paragraph className="text-gray-500 text-lg leading-relaxed mb-10">
                                Every dish we serve is a testament to our commitment to quality, creativity, and the joy of sharing a great meal.
                            </Paragraph>
                            <Row gutter={[32, 32]}>
                                <Col span={12}>
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <Title level={3} className="!mb-1 !text-gray-900">25+</Title>
                                        <Text className="text-gray-500">Years of Experience</Text>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <Title level={3} className="!mb-1 !text-gray-900">150+</Title>
                                        <Text className="text-gray-500">Master Recipes</Text>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={24} lg={12}>
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                                <img
                                    src="https://images.openai.com/static-rsc-4/mO1HFsC0cTx7RpVS_fiOOqp_OkoQLBTzfSe2Vzc0w_NEzWaIo5IWHRRCG8zNWQZHs8ueFuH3PO3wM--4XKMBQJoAGRKaNXxvK0pdODESRkmUpprWy1Tu5GvlyDqGStLiWPkkBE4BhfdpBRZjMsZwbW5QPRu2S2XIfE3GDJqHJO88B1dipvEz5LiyY1PcZPuv?purpose=fullsize"
                                    alt="Chef Cooking"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 max-w-[280px]">
                                <TrophyOutlined className="text-orange-500 text-4xl mb-4" />
                                <Title level={4} className="mb-2">Michelin Recommended</Title>
                                <Text className="text-gray-500">Recognized for our dedication to flavor and service.</Text>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Values Section */}
                <div className="text-center mb-16">
                    <Title level={2} className="!text-4xl !font-bold">Our Core Values</Title>
                </div>
                <Row gutter={[32, 32]}>
                    {[
                        { title: 'Freshness First', desc: 'We source our ingredients daily from local farmers and sustainable suppliers.', icon: <HistoryOutlined />, color: 'text-blue-500' },
                        { title: 'Culinary Art', desc: 'Our chefs treat every plate as a canvas, creating visually stunning and delicious art.', icon: <TeamOutlined />, color: 'text-orange-500' },
                        { title: 'Community', desc: 'We believe in giving back to the community that has supported us for decades.', icon: <TrophyOutlined />, color: 'text-green-500' }
                    ].map((val, idx) => (
                        <Col xs={24} md={8} key={idx}>
                            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-100/50 p-6 text-center h-full">
                                <div className={`text-5xl mb-8 flex justify-center ${val.color}`}>
                                    {val.icon}
                                </div>
                                <Title level={3} className="mb-4">{val.title}</Title>
                                <Paragraph className="text-gray-500 text-lg mb-0">{val.desc}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default About;