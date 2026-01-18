import { useState, useEffect } from 'preact/hooks';

const StealthMeter = ({ stealthLevel = 0, className = '' }) => {
    const [animatedLevel, setAnimatedLevel] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedLevel(stealthLevel);
        }, 100);

        return () => clearTimeout(timer);
    }, [stealthLevel]);

    const getColorClass = (level) => {
        if (level >= 80) return 'bg-green-500';
        if (level >= 60) return 'bg-yellow-500';
        if (level >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className={`ninja-card p-4 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Stealth Level</span>
                <span className="text-lg font-bold text-ninja-light">{animatedLevel}%</span>
            </div>
            <div className="w-full bg-ninja-gray rounded-full h-3">
                <div 
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${getColorClass(animatedLevel)}`}
                    style={{ width: `${animatedLevel}%` }}
                ></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Maximum</span>
            </div>
        </div>
    );
};

export default StealthMeter;