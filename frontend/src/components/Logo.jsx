import React from 'react';
import { Handshake } from 'lucide-react';

// Logo component that matches the CareConnect branding
const Logo = ({ size = 'md', variant = 'default' }) => {
    // Size configurations
    const sizes = {
        sm: {
            cSize: 'text-5xl',
            cWidth: 'w-8',
            cHeight: 'h-8',
            handshake: 'w-4 h-4',
            handshakePos: 'right-0 top-1/2 -translate-y-1/2',
            title: 'text-lg',
            tagline: 'text-[8px]',
            gap: 'gap-1',
            lineWidth: 'w-20'
        },
        md: {
            cSize: 'text-5xl',
            cWidth: 'w-12',
            cHeight: 'h-12',
            handshake: 'w-6 h-6',
            handshakePos: 'right-0 top-1/2 -translate-y-1/2',
            title: 'text-2xl',
            tagline: 'text-xs',
            gap: 'gap-2',
            lineWidth: 'w-32'
        },
        lg: {
            cSize: 'text-7xl',
            cWidth: 'w-16',
            cHeight: 'h-16',
            handshake: 'w-8 h-8',
            handshakePos: 'right-0 top-1/2 -translate-y-1/2',
            title: 'text-4xl',
            tagline: 'text-sm',
            gap: 'gap-3',
            lineWidth: 'w-44'
        }
    };

    const s = sizes[size];
    const isWhite = variant === 'white';
    const primaryColor = isWhite ? 'text-white' : 'text-[#1e3a5f]';
    const secondaryColor = isWhite ? 'text-white/80' : 'text-[#3b82c4]';
    const lineColor = isWhite ? 'bg-white/50' : 'bg-[#1e3a5f]';

    return (
        <div className={`flex items-center ${s.gap}`}>
            {/* C with Handshake */}
            <div className="relative flex items-center justify-center">
                {/* The C letter - styled as a crescent */}
                <span
                    className={`${s.cSize} font-bold ${primaryColor} leading-none`}
                    style={{ fontFamily: 'Arial, sans-serif' }}
                >
                    C
                </span>
                {/* Handshake icon positioned inside the C opening */}
                <div className={`absolute ${s.handshakePos}`}>
                    <Handshake className={`${s.handshake} ${secondaryColor} stroke-[1.5]`} />
                </div>
            </div>

            {/* Text section */}
            <div className="flex flex-col">
                {/* Care Connect title */}
                <span
                    className={`${s.title} font-semibold ${primaryColor} italic leading-tight`}
                    style={{ fontFamily: 'Arial, sans-serif' }}
                >
                    Care Connect
                </span>
                {/* Underline */}
                <div className={`${s.lineWidth} h-[1px] ${lineColor} my-0.5`}></div>
                {/* Tagline */}
                <span
                    className={`${s.tagline} ${secondaryColor} italic tracking-wide`}
                    style={{ fontFamily: 'Arial, sans-serif' }}
                >
                    Empower. Rate. Improve.
                </span>
            </div>
        </div>
    );
};

export default Logo;
