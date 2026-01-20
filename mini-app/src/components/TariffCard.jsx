const TariffCard = ({ plan, onSelect, isSelected = false }) => {
    const getPlanIcon = (name) => {
        switch(name.toLowerCase()) {
            case 'shadow': return '/assets/icons/interface/icon_stealth.png';
            case 'warrior-shadow': return '/assets/icons/interface/icon_vpn.png';
            case 'demon': return '/assets/icons/interface/icon_shield.png';
            case 'legend': return '/assets/icons/interface/icon_medal.png';
            default: return '/assets/icons/interface/icon_shop.png';
        }
    };

    const getDiscountColor = (discount) => {
        if (discount >= 30) return 'text-green-400';
        if (discount >= 20) return 'text-yellow-400';
        return 'text-orange-400';
    };

    return (
        <div 
            className={`ninja-card p-4 cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-2 ring-ninja-purple scale-105' : 'hover:scale-102'
            }`}
            onClick={() => onSelect(plan)}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <img src={getPlanIcon(plan.name)} alt={plan.name} className="w-8 h-8" />
                    <div>
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        <p className="text-sm text-gray-400">{plan.duration}</p>
                    </div>
                </div>
                {plan.discount > 0 && (
                    <div className={`text-right ${getDiscountColor(plan.discount)}`}>
                        <div className="text-sm font-semibold">-{plan.discount}%</div>
                        <div className="text-xs">SAVING</div>
                    </div>
                )}
            </div>
            
            <div className="mb-3">
                <div className="text-2xl font-bold text-ninja-yellow">{plan.price} ⭐</div>
                <div className="text-sm text-gray-400">per {plan.duration.replace('days', 'day').replace('year', 'year')}</div>
            </div>
            
            <div className="flex items-center space-x-1">
                <img src="/assets/icons/rewards/icon_stars.png" alt="Stars" className="w-4 h-4" />
                <span className="text-xs">Pay with Telegram Stars</span>
            </div>
        </div>
    );
};

export default TariffCard;