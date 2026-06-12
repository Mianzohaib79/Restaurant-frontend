import React, { useState, useEffect } from 'react';
import ScreenLoader from '../../../components/Misc/ScreenLoader';
import { Typography, Row, Col, Form, Input, DatePicker, TimePicker, InputNumber, Button, Card, message } from 'antd';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined, PhoneOutlined, MailOutlined, WhatsAppOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Reservations = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const onFinish = (values) => {
        setSubmitting(true);
        setTimeout(() => {
            message.success('Reservation request sent successfully! We will contact you shortly to confirm.');
            setSubmitting(false);
        }, 1500);
    };

    if (loading) return <ScreenLoader />;

    return (
        <div className="bg-white pt-32 pb-24 min-h-screen relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-50 rounded-full blur-[150px] opacity-60"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <Row gutter={[48, 48]} align="middle">
                    <Col xs={24} lg={12}>
                        <div className="max-w-xl">
                            <div className="inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-bold text-sm mb-6 uppercase tracking-widest">
                                Book a Table
                            </div>
                            <Title className="!text-5xl !font-bold mb-8">Reserve Your <span className="text-orange-500">Perfect</span> Evening</Title>
                            <Paragraph className="text-gray-500 text-lg leading-relaxed mb-12">
                                Planning a special occasion or just a casual dinner? Secure your spot at EatEase. We recommend booking at least 24 hours in advance for weekend visits.
                            </Paragraph>

                            <div className="space-y-8 pt-20">
                                <div className="flex items-start gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-orange-500 text-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                        <PhoneOutlined />
                                    </div>
                                    <div>
                                        <Text className="text-gray-400 block text-sm uppercase font-bold tracking-wider mb-1">Direct Call</Text>
                                        <Text className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">03046787426</Text>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-orange-500 text-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                        <WhatsAppOutlined />
                                    </div>
                                    <div>
                                        <Text className="text-gray-400 block text-sm uppercase font-bold tracking-wider mb-1">WhatsApp Support</Text>
                                        <Text className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">03046787426</Text>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-orange-500 text-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                        <MailOutlined />
                                    </div>
                                    <div>
                                        <Text className="text-gray-400 block text-sm uppercase font-bold tracking-wider mb-1">Email Support</Text>
                                        <Text className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">rafiqzohaib515@gmail.com   </Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card className="rounded-[3rem] border-none shadow-2xl p-4 md:p-8 bg-white relative overflow-hidden !mt-12">
                            <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
                            <Title level={3} className="mb-10 !font-bold">Reservation Details</Title>

                            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Form.Item name="name" label={<span className="font-bold text-gray-700">Full Name</span>} rules={[{ required: true }]}>
                                        <Input prefix={<UserOutlined className="text-gray-400" />} className="h-14 rounded-2xl border-gray-200" placeholder="Enter Your Full Name" />
                                    </Form.Item>
                                    <Form.Item name="phone" label={<span className="font-bold text-gray-700">Phone Number</span>} rules={[{ required: true }]}>
                                        <Input prefix={<PhoneOutlined className="text-gray-400" />} className="h-14 rounded-2xl border-gray-200" placeholder="Enter Your Phone Number" />
                                    </Form.Item>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Form.Item name="date" label={<span className="font-bold text-gray-700">Date</span>} rules={[{ required: true }]}>
                                        <DatePicker className="w-full h-14 rounded-2xl border-gray-200" suffixIcon={<CalendarOutlined className="text-orange-500" />} />
                                    </Form.Item>
                                    <Form.Item name="time" label={<span className="font-bold text-gray-700">Time</span>} rules={[{ required: true }]}>
                                        <TimePicker format="HH:mm" className="w-full h-14 rounded-2xl border-gray-200" suffixIcon={<ClockCircleOutlined className="text-orange-500" />} />
                                    </Form.Item>
                                </div>

                                <Form.Item name="guests" label={<span className="font-bold text-gray-700">Number of Guests</span>} rules={[{ required: true }]}>
                                    <InputNumber min={1} max={20} className="w-full h-14 rounded-2xl border-gray-200 flex items-center" defaultValue={2} />
                                </Form.Item>

                                <Form.Item name="requests" label={<span className="font-bold text-gray-700">Special Requests</span>}>
                                    <Input.TextArea rows={4} className="rounded-2xl border-gray-200" placeholder="Any dietary requirements or special occasions?" />
                                </Form.Item>

                                <Form.Item className="mb-0 mt-8">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={submitting}
                                        className="w-full h-16 rounded-2xl bg-orange-500 border-none font-bold text-lg shadow-xl shadow-orange-200"
                                    >
                                        Confirm Reservation
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Reservations;