import React from 'react';

const Logo = ({ className = "", iconOnly = false }) => {
    return (
        <div className={`flex items-center gap-2 group cursor-pointer ${className}`}>
            <div className="relative flex items-center justify-center">
                {/* Circle Background with Spoon Icon */}
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-orange-500/30 transition-all duration-300 group-hover:rotate-[15deg] group-hover:scale-110 animate-fade-in-scale">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {/* Elegant Spoon SVG */}
                        <path d="M12 2C9.5 2 7.5 4 7.5 7.5c0 3 2 4.5 4.5 4.5V22" />
                        <path d="M12 12c2.5 0 4.5-1.5 4.5-4.5S14.5 2 12 2" />
                        <path d="M12 22h-1a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1" />
                    </svg>
                </div>
            </div>
            {!iconOnly && (
                <span className="text-2xl font-black tracking-tight flex items-center">
                    <span className="text-gray-900 group-hover:text-orange-500 transition-all duration-300">Eat</span>
                    <span className="text-orange-500 group-hover:text-orange-600 group-hover:tracking-widest transition-all duration-500">Ease</span>
                </span>
            )}
        </div>
    );
};

export default Logo;
