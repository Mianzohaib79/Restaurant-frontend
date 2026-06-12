import React, { useState, useEffect } from 'react';
import ScreenLoader from '../../../components/Misc/ScreenLoader';
import { Typography, Row, Col, Card, Avatar, Button, Descriptions, Tag, Space, Divider, Modal, Form, Input, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../../context/AuthContext';
import dayjs from 'dayjs';
import axios from 'axios';

const { Title, Text } = Typography;

const Profile = () => {
    // AuthContext se user, logout aur readProfile teeno cheezain nikal li hain
    const { user, handleLogout, readProfile } = useAuth();
    const [loading, setLoading] = useState(true);

    // ---- MODAL STATES ----
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    // ---- MODAL OPEN HANDLER ----
    const handleEditClick = () => {
        setIsModalOpen(true);
        form.setFieldsValue({
            fullName: user?.fullName,
            phoneNumber: user?.phoneNumber,
            address: user?.address,
        });
    };

    // ---- SUBMIT FORM DATA TO BACKEND API ----
    const handleSave = async (values) => {
        setSubmitting(true);
        try {
            const jwt = localStorage.getItem('jwt');

            // window.api se request bheji
            const response = await axios.patch(`${window.api}/api/auth/user-profile-edit`, values, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            // Double message se bachne k liye strict check lagaya ha
            if (response.status === 200 && response.data && !response.data.isError) {
                message.success('Profile updated successfully!');
                setIsModalOpen(false);

                // Context ka function call kiya taakay screen par data fresh ho jaye
                if (typeof readProfile === 'function') {
                    readProfile(jwt);
                } else {
                    // Agar context load hone me time le to safety k liye reload
                    window.location.reload();
                }
            } else {
                message.error(response.data?.message || 'Could not update profile');
            }
        } catch (error) {
            console.error("Profile update error details:", error);
            message.error(error.response?.data?.message || 'Server error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <ScreenLoader />;

    return (
        <div className="bg-gray-50 min-h-screen pt-45 pb-24">
            <div className="container mx-auto px-6 lg:px-12">
                <Row gutter={[32, 32]}>
                    {/* Sidebar / Info */}
                    <Col xs={24} lg={8}>
                        <Card className="rounded-[3rem] border-none shadow-xl text-center p-8 bg-white overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-32 bg-orange-500"></div>
                            <div className="relative z-10">
                                <Avatar size={120} icon={<UserOutlined />} className="border-4 border-white bg-orange-100 text-orange-500 shadow-lg mb-6 mt-12" />
                                <Title level={3} className="!mb-1 !font-bold">{user?.fullName || 'Guest User'}</Title>
                                <Tag color="orange" className="rounded-full px-4 py-1 font-bold mb-8 uppercase tracking-widest">{user?.role || 'User'}</Tag>

                                <div className="space-y-4 text-left mt-8 p-4 bg-gray-50 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                        <MailOutlined className="text-orange-500" />
                                        <Text className="text-gray-600">{user?.email || 'user@example.com'}</Text>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <PhoneOutlined className="text-orange-500" />
                                        <Text className="text-gray-600">{user?.phoneNumber || 'N/A'}</Text>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <EnvironmentOutlined className="text-orange-500" />
                                        <Text className="text-gray-600">{user?.address || 'N/A'}</Text>
                                    </div>
                                </div>

                                <div className="mt-10 flex flex-col gap-3">
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<EditOutlined />}
                                        onClick={handleEditClick}
                                        className="h-14 rounded-2xl bg-orange-500 border-none font-bold"
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button size="large" icon={<LogoutOutlined />} onClick={handleLogout} className="h-14 rounded-2xl border-gray-100 text-red-500 font-bold hover:bg-red-50 hover:text-red-600">
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Main Content */}
                    <Col xs={24} lg={16}>
                        <Card className="rounded-[3rem] border-none shadow-xl p-8 bg-white h-full">
                            <Title level={3} className="!font-bold mb-10">Account Settings</Title>

                            <div className="space-y-12">
                                <div>
                                    <Title level={4} className="!font-bold mb-6 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                                        Personal Information
                                    </Title>
                                    <Descriptions column={{ xs: 1, sm: 2 }} className="custom-descriptions">
                                        <Descriptions.Item label="Full Name">{user?.fullName || 'N/A'}</Descriptions.Item>
                                        <Descriptions.Item label="Email Address">{user?.email || 'N/A'}</Descriptions.Item>
                                        <Descriptions.Item label="Phone Number">{user?.phoneNumber || 'N/A'}</Descriptions.Item>
                                        <Descriptions.Item label="Joined Since">{user?.createdAt ? dayjs(user.createdAt).format('MMMM DD, YYYY') : 'N/A'}</Descriptions.Item>
                                        <Descriptions.Item label="Language">English (US)</Descriptions.Item>
                                    </Descriptions>
                                </div>

                                <Divider className="border-gray-50" />

                                <div>
                                    <Title level={4} className="!font-bold mb-6 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                        Notifications
                                    </Title>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                            <div>
                                                <Text className="font-bold block">Email Notifications</Text>
                                                <Text className="text-gray-500 text-sm">Receive updates about your orders via email</Text>
                                            </div>
                                            <Tag color="green">Enabled</Tag>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                            <div>
                                                <Text className="font-bold block">SMS Alerts</Text>
                                                <Text className="text-gray-500 text-sm">Get real-time delivery status on your phone</Text>
                                            </div>
                                            <Tag color="orange">Pending</Tag>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* ---- DYNAMIC ANTD EDIT PROFILE MODAL ---- */}
            <Modal
                title={<Title level={4} className="!font-bold !m-0">Edit Profile Details</Title>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                className="font-sans"
            >
                <Divider className="my-4" />
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    requiredMark={false}
                >
                    <Form.Item
                        name="fullName"
                        label={<Text className="font-semibold text-gray-700">Full Name</Text>}
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                        <Input size="large" className="rounded-xl h-12 border-gray-200" placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        label={<Text className="font-semibold text-gray-700">Phone Number</Text>}
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                        <Input size="large" className="rounded-xl h-12 border-gray-200" placeholder="Enter phone number" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label={<Text className="font-semibold text-gray-700">Address</Text>}
                        rules={[{ required: true, message: 'Please enter your delivery address' }]}
                    >
                        <Input.TextArea rows={3} className="rounded-xl border-gray-200" placeholder="Enter full address" />
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button size="large" className="rounded-xl px-6" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={submitting}
                            className="bg-orange-500 hover:bg-orange-600 border-none rounded-xl px-6 font-bold shadow-lg shadow-orange-500/10"
                        >
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Profile;