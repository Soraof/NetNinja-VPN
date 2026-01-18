import { useState, useEffect } from 'preact/hooks';

const ConnectionStatus = ({ isConnected = false, ping = 0, traffic = 0 }) => {
    const [animatedPing, setAnimatedPing] = useState(0);
    const [animatedTraffic, setAnimatedTraffic] = useState(0);

    useEffect(() => {
        setAnimatedPing(ping);
        setAnimatedTraffic(traffic);
    }, [ping, traffic]);

    const getStatusColor = (connected) => {
        return connected ? 'text-green-400' : 'text-red-400';
    };

    const getPingColor = (ms) => {
        if (ms < 50) return 'text-green-400';
        if (ms < 100) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="ninja-card p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`font-semibold ${getStatusColor(isConnected)}`}>
                        {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                    </span>
                </div>
                <div className="text-right">
                    <div className={`text-sm ${getPingColor(animatedPing)}`}>{animatedPing}ms</div>
                    <div className="text-xs text-gray-400">Ping</div>
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Traffic Used:</span>
                    <span>{Math.round(animatedTraffic)} MB</span>
                </div>
                
                <div className="w-full bg-ninja-gray rounded-full h-2">
                    <div 
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${Math.min((animatedTraffic / 1000) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ConnectionStatus;