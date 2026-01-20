import { useState } from 'preact/hooks';

const MissionCard = ({ mission, onComplete }) => {
    const [isCompleted, setIsCompleted] = useState(mission.completed);

    const handleComplete = async () => {
        if (onComplete) {
            await onComplete(mission.id);
            setIsCompleted(true);
        }
    };

    const getRewardIcon = (rewardType) => {
        switch(rewardType) {
            case 'stars': return '/assets/icons/interface/icon_stars.png';
            case 'shuriken': return '/assets/icons/interface/icon_shuriken.png';
            case 'medal': return '/assets/icons/interface/icon_medal.png';
            default: return '/assets/icons/interface/icon_ryo.png';
        }
    };

    return (
        <div className={`ninja-card p-4 mb-3 ${isCompleted ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{mission.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{mission.description}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                        <img src={getRewardIcon(mission.reward.type)} alt="Reward" className="w-4 h-4" />
                        <span className="text-sm text-ninja-yellow">+{mission.reward.amount} {mission.reward.type}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <div className="w-full bg-ninja-gray rounded-full h-2">
                            <div 
                                className="h-2 rounded-full bg-ninja-green transition-all duration-300"
                                style={{ width: `${mission.progress}%` }}
                            ></div>
                        </div>
                        <span className="text-xs text-gray-400">{mission.progress}%</span>
                    </div>
                </div>
                
                {!isCompleted ? (
                    <button 
                        onClick={handleComplete}
                        disabled={mission.progress < 100}
                        className="ml-3 px-3 py-1 bg-ninja-purple rounded-lg text-sm font-medium hover:bg-ninja-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Complete
                    </button>
                ) : (
                    <div className="ml-3 px-3 py-1 bg-green-600 rounded-lg text-sm font-medium">✓ Completed</div>
                )}
            </div>
        </div>
    );
};

export default MissionCard;