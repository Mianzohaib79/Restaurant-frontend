import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const initialState = { fullName: "", phoneNumber: "", email: "", address: "", password: "", confirmPassword: "" }

const Register = () => {
    const [state, setState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setState(s => ({ ...s, [e.target.name]: e.target.value }));

    const handleRegister = () => {
        let { fullName, phoneNumber, email, address, password, confirmPassword } = state;

        console.log('fullName', fullName)
        console.log('phoneNumber', phoneNumber)
        console.log('email', email)
        console.log('address', address)
        console.log('password', password)
        console.log('confirmPassword', confirmPassword)

        if (!fullName || fullName.length < 3) return window.toastify("Full name must be at least 3 characters", "error");
        if (!phoneNumber) return window.toastify("Phone number is required", "error");
        if (!email || !window.isValidEmail(email)) return window.toastify("Invalid email", "error");
        if (!address) return window.toastify("Address is required", "error");
        if (!password || password.length < 6) return window.toastify("Password must be at least 6 characters", "error");
        if (password !== confirmPassword) return window.toastify("Passwords do not match", "error");

        const formData = { fullName, phoneNumber, email, address, password };

        setIsLoading(true);

        axios.post(window.api + "/api/auth/register", formData)
            .then((res) => {
                const { status, data } = res;
                if (status === 201) {
                    window.toastify(data.message || "User created successfully", "success");
                    navigate("/auth/login");
                } else {
                    window.toastify(data.message || "Something went wrong", "error");
                }
            })
            .catch((err) => {
                console.error(err);
                window.toastify(err?.response?.data?.message || "Something went wrong", "error");
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-4! relative overflow-hidden">

            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100">
                {/* Form Side */}
                <div className="pt-5! px-10! flex flex-col justify-center">
                    <div className="mb-3">
                        {/* <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 mb-6">
                            <span className="text-white font-bold text-xl">R</span>
                        </div> */}
                        <Title level={3} className="font-bold! mb-1!">Create an Account</Title>
                        <Text className="text-orange-500">Join EatEase and start your culinary journey.</Text>
                    </div>

                    <Form name='register' layout="vertical" scrollToFirtError className="space-y-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Form.Item className='mb-4!'
                                name="fullName"
                                label={<span className="font-semibold text-gray-700">Full Name</span>}
                                rules={[{ required: true, message: 'Required!' }]}
                            >
                                <Input
                                    placeholder="Enter Your Full Name" name='fullName' onChange={handleChange}
                                    className="h-10 rounded-2xl border-gray-200 focus:border-orange-500 hover:border-orange-500"
                                />
                            </Form.Item>
                            <Form.Item
                                className='mb-4!'
                                name="phoneNumber"
                                label={<span className="font-semibold text-gray-700">Phone Number</span>}
                                rules={[{ required: true, message: 'Required!' }, { type: 'string', message: 'Enter phone number!' }]}
                            >
                                <Input
                                    placeholder="Enter Your Phone Number" name='phoneNumber' onChange={handleChange}
                                    className="h-10 rounded-2xl border-gray-200 focus:border-orange-500 hover:border-orange-500"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="email" className='mb-4!'
                            label={<span className="font-semibold text-gray-700">Email Address</span>}
                            rules={[{ required: true, message: 'Required!' }, { type: 'email', message: 'Invalid email!' }]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-gray-400 mr-2" />}
                                placeholder="Enter Your Email Address" name='email' onChange={handleChange}
                                className="h-10 rounded-2xl border-gray-200 focus:border-orange-500 hover:border-orange-500"
                            />
                        </Form.Item>
                        <Form.Item className='mb-4!'
                            name="address"
                            label={<span className="font-semibold text-gray-700">Address</span>}
                            rules={[{ required: true, message: 'Required!' }, { type: 'string', message: 'Enter address!' }]}
                        >
                            <Input
                                placeholder="Enter Your Address" name='address' onChange={handleChange}
                                className="h-10 rounded-2xl border-gray-200 focus:border-orange-500 hover:border-orange-500"
                            />
                        </Form.Item>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Form.Item className='mb-4!'
                                name="password"
                                label={<span className="font-semibold text-gray-700">Password</span>}
                                rules={[{ required: true, message: 'Required!' }, { min: 6, message: 'Min 6 characters!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400 mr-2" />}
                                    placeholder="••••••••" name='password' onChange={handleChange}
                                    className="h-10 rounded-2xl border-gray-200 focus:border-orange-500 hover:border-orange-500"
                                />
                            </Form.Item>

                            <Form.Item className='mb-4!'
                                name="confirmPassword"
                                label={<span className="font-semibold text-gray-700">Confirm Password</span>}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400 mr-2" />}
                                    placeholder="Confirm Password" name='confirmPassword' onChange={handleChange}
                                    className="h-10 rounded-2xl border-gray-200 focus:border-orange-500 hover:border-orange-500"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <Button className='mb-4!'
                                type="primary"
                                loading={isLoading}
                                onClick={handleRegister}
                            // className="bg-red-500 hover:bg-red-600 border-none font-bold text-lg shadow-xl shadow-red-200"
                            >
                                Create Account
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="text-center mb-4 mt-0">
                        <Text className="text-gray-500">Already have an account? </Text>
                        <Link to="/auth/login" className="text-orange-600 font-bold hover:text-orange-700">
                            Sign in here
                        </Link>
                    </div>
                </div>

                {/* Image Side */}
                <div className="hidden lg:block relative">
                    <img
                        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"
                        alt="Cooking"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-blue-900/80 to-transparent flex flex-col justify-end p-12">
                        <Title level={2} className="text-white! mb-4!">Become a Part of Us</Title>
                        <Paragraph className="text-white/80! text-lg mb-0">
                            Create your account today and unlock a world of EatEase flavors, exclusive events, and the best dining experience in town.
                        </Paragraph>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;