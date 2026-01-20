import { useState, useEffect } from 'preact/hooks';

const NinjaAvatar = ({ status = 'normal', level = 1, className = '' }) => {
    const [currentImage, setCurrentImage] = useState('/assets/emotions/ninja_normal.gif');

    const statusImages = {
        normal: '/assets/animations/ninja_normal.gif',
        active: '/assets/animations/ninja_active.gif',
        protect: '/assets/animations/ninja_protect.gif',
        sleep: '/assets/animations/ninja_sleep.gif',
        celebrate: '/assets/animations/ninja_celebrate.gif',
        stealth: '/assets/animations/ninja_stealth.gif',
        error: '/assets/animations/ninja_error.gif'
    };

    useEffect(() => {
        setCurrentImage(statusImages[status] || statusImages.normal);
    }, [status]);

    const getLevelAvatar = () => {
        if (level >= 50) return '/assets/avatars/avatar_legend.png';
        if (level >= 40) return '/assets/avatars/avatar_demon.png';
        if (level >= 30) return '/assets/avatars/avatar_shadow.png';
        if (level >= 20) return '/assets/avatars/avatar_warrior.png';
        return '/assets/avatars/avatar_rookie.png';
    };

    return (
        <div className={`relative flex justify-center items-center ${className}`}>
            {/* Main Ninja Status Animation */}
            <img 
                src={currentImage} 
                alt="Ninja Status" 
                className="w-32 h-32 object-contain animate-float"
            />
            
            {/* Level Badge */}
            <div className="absolute -top-2 -right-2 bg-ninja-purple text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg">
                {level}
            </div>
            
            {/* Level Avatar Overlay */}
            <div className="absolute -bottom-2 -left-2">
                <img 
                    src={getLevelAvatar()} 
                    alt={`Level ${level}`} 
                    className="w-12 h-12 object-contain border-2 border-ninja-purple rounded-full bg-ninja-bg p-1"
                />
            </div>

            {/* Glow Effect */}
            {status !== 'sleep' && (
                <div className="absolute inset-0 rounded-full animate-glow opacity-30 pointer-events-none"></div>
            )}
        </div>
    );
};

export default NinjaAvatar;