import React from 'react';
import { Skeleton, Card } from 'antd';

const ScreenLoader = () => {
    return (
        <div className="container mx-auto p-8 animate-pulse">
            <div className="flex flex-col gap-8">
                {/* Header/Hero Skeleton */}
                <div className="w-full h-64 bg-gray-100 rounded-3xl overflow-hidden relative">
                    <Skeleton.Button active style={{ width: '100%', height: '100%' }} />
                    <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
                        <Skeleton.Input active size="large" />
                        {/* ⬇️ Yahan humne size="default" kar diya jo standard hai */}
                        <Skeleton.Input active size="default" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="rounded-2xl border-none shadow-sm overflow-hidden">
                            {/* Ant Design ke Skeleton.Image ke upar direct Tailwind classes kabhi kabhi masla karti hain, isliye inline style de diya taaki warning na aaye */}
                            <Skeleton.Image active style={{ width: '100%', height: '192px' }} />
                            <div className="p-4">
                                <Skeleton active paragraph={{ rows: 2 }} title={true} />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* List Skeleton */}
                <div className="flex flex-col gap-4">
                    <Skeleton active avatar paragraph={{ rows: 3 }} />
                </div>
            </div>
        </div>
    );
};

export default ScreenLoader;