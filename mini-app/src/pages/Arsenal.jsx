import { useState, useEffect } from 'preact/hooks';
import TariffCard from '../components/TariffCard';
import { apiService } from '../services/api';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

const Arsenal = () => {
    const { user, openInvoice } = useTelegramAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [tariffs] = useState([
        {
            id: 'shadow',
            name: 'Shadow',
            duration: '1 day',
            price: 5,
            discount: 0,
            features: ['Basic protection', '1 server location']
        },
        {
            id: 'warrior-shadow',
            name: 'Warrior-Shadow',
            duration: '7 days',
            price: 30,
            discount: 14,
            features: ['Enhanced protection', '3 server locations', 'Priority support']
        },
        {
            id: 'demon',
            name: 'Demon',
            duration: '30 days',
            price: 120,
            discount: 20,
            features: ['Premium protection', 'All server locations', '24/7 support', 'Exclusive features']
        },
        {
            id: 'legend',
            name: 'Legend',
            duration: '365 days',
            price: 1200,
            discount: 34,
            features: ['Ultimate protection', 'Lifetime access', 'VIP support', 'Early access to new features']
        }
    ]);

    const handlePlanSelect = async (plan) => {
        setSelectedPlan(plan);
        
        try {
            // Here you would call your backend to create an invoice
            // For now, we'll simulate the process
            const invoiceUrl = `https://t.me/netninja_vpn_bot/app?startapp=buy_${plan.id}`;
            
            // Open Telegram invoice
            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.openInvoice(invoiceUrl);
            } else {
                alert(`Selected plan: ${plan.name} - ${plan.price} Stars`);
            }
        } catch (error) {
            console.error('Failed to create invoice:', error);
            alert('Failed to process payment');
        }
    };

    return (
        <div className="min-h-screen bg-ninja-bg text-white">
            {/* Header */}
            <div className="p-4 border-b border-ninja-gray">
                <h1 className="text-2xl font-bold text-center">🥷 Arsenal</h1>
                <p className="text-center text-gray-400 text-sm">Choose your protection</p>
            </div>

            {/* Tariff Cards Grid */}
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tariffs.map(plan => (
                        <TariffCard
                            key={plan.id}
                            plan={plan}
                            onSelect={handlePlanSelect}
                            isSelected={selectedPlan?.id === plan.id}
                        />
                    ))}
                </div>

                {/* Features Comparison */}
                <div className="ninja-card p-4">
                    <h3 className="font-bold text-lg mb-3">Protection Features</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-ninja-gray last:border-b-0">
                            <span>WireGuard Protocol</span>
                            <span className="text-green-400">✓ All plans</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-ninja-gray last:border-b-0">
                            <span>Server Locations</span>
                            <span className="text-ninja-light">1-∞ depending on plan</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-ninja-gray last:border-b-0">
                            <span>Data Encryption</span>
                            <span className="text-green-400">AES-256</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-ninja-gray last:border-b-0">
                            <span>Zero Logs</span>
                            <span className="text-green-400">✓ Always</span>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="ninja-card p-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <img src="/assets/icons/rewards/icon_stars.png" alt="Stars" className="w-5 h-5" />
                        <h3 className="font-bold">Payment with Telegram Stars</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                        Secure and anonymous payments through Telegram's built-in payment system.
                        No credit cards required.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Arsenal;