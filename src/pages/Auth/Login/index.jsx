import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Divider, message, Card } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

const initialState = { email: "", password: "" };

const Login = () => {
    const [state, setState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { readProfile } = useAuth();

    const handleChange = (e) => { setState(s => ({ ...s, [e.target.name]: e.target.value })); }

    const handleLogin = () => {
        const { email, password } = state;

        if (!email || !password) return window.toastify("All fields are required", "error");
        if (!window.isValidEmail(email)) return window.toastify("Invalid email", "error");

        const formData = { email, password };

        setIsLoading(true);

        axios.post(`${window.API}/api/auth/login`, formData)
            .then((res) => {
                const { status, data } = res;
                if (status === 200) {
                    window.toastify(data.message || "Login successful", "success");
                    localStorage.setItem("jwt", data.token);
                    readProfile(data.token);
                    setState(initialState);
                    navigate("/");
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
            });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 opacity-60"></div>

            <div className="w-full max-w-[900px] grid grid-cols-1 sm:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-gray-100">

                <div className="hidden sm:block relative min-h-[500px]">
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
                        alt="Restaurant Interior"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-orange-600/80 to-transparent flex flex-col justify-end p-8 md:p-12">
                        <Title level={2} className="text-white! mb-3! text-xl md:text-2xl lg:text-3xl">Experience EatEase Dining</Title>
                        <Paragraph className="text-white/80 text-sm md:text-base lg:text-lg mb-0">
                            Join our community of food enthusiasts and enjoy exclusive benefits, personalized recommendations, and seamless ordering.
                        </Paragraph>
                    </div>
                </div>
                <div className="p-6 sm:p-8 md:p-12 lg:p-5 flex flex-col justify-center">
                    <div className="mb-6 md:mb-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 mb-4 md:mb-6">
                            <span className="text-white font-bold text-lg md:text-xl">R</span>
                        </div>
                        <Title level={2} className="font-bold! mb-1! text-xl md:text-2xl lg:text-3xl">Sign In to EatEase</Title>
                        <Text className="text-orange-500 text-sm md:text-base">Welcome back! Please enter your details.</Text>
                    </div>

                    <Form name="login" layout="vertical" className="space-y-1 md:space-y-2">
                        <Form.Item
                            name="email"
                            label={<span className="font-semibold text-gray-700 text-sm md:text-base">Email Address</span>}
                            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400 mr-2" />}
                                name='email'
                                placeholder="name@example.com"
                                onChange={handleChange}
                                className="h-12 md:h-14 rounded-2xl border-gray-200 focus:border-orange-500 hover:border-orange-500"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={<span className="font-semibold text-gray-700 text-sm md:text-base">Password</span>}
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400 mr-2" />}
                                placeholder="••••••••"
                                name='password'
                                onChange={handleChange}
                                className="h-12 md:h-14 rounded-2xl border-gray-200 focus:border-orange-500 hover:border-orange-500"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                loading={isLoading}
                                onClick={handleLogin}
                                className="w-full h-12 md:h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 border-none font-bold text-base md:text-lg shadow-xl shadow-orange-200"
                            >
                                Sign In
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* <Divider plain className="!my-4 md:!my-6"><Text className="text-gray-400 text-xs md:text-sm px-2 md:px-4">OR CONTINUE WITH</Text></Divider>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                        <Button className="h-11 md:h-12 rounded-xl flex items-center justify-center gap-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 text-sm md:text-base">
                            <GoogleOutlined /> Google
                        </Button>
                        <Button className="h-11 md:h-12 rounded-xl flex items-center justify-center gap-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 text-sm md:text-base">
                            <GithubOutlined /> Github
                        </Button>
                    </div> */}

                    <div className="text-center text-sm md:text-base">
                        <Text className="text-gray-500">Don't have an account? </Text>
                        <Link to="/auth/register" className="text-orange-600 font-bold hover:text-orange-700">
                            Sign up for free
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;