// src/pages/Missions.jsx
import { useState, useEffect } from 'preact/hooks';
import MissionCard from '../components/MissionCard';
import { apiService } from '../services/api';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

const Missions = () => {
  const { user } = useTelegramAuth();
  const [dailyMissions, setDailyMissions] = useState([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDailyMissions();
    } else {
      // Mock-данные для разработки
      setTimeout(() => {
        const mockMissions = [
          { id: 1, title: 'Connect to VPN', reward: 50, completed: false },
          { id: 2, title: 'Invite a friend', reward: 100, completed: true },
          { id: 3, title: 'Stay online for 1h', reward: 75, completed: false }
        ];
        setDailyMissions(mockMissions);
        setCompletedToday(mockMissions.filter(m => m.completed).length);
        setLoading(false);
      }, 300);
    }
  }, [user]);

  const loadDailyMissions = async () => {
    try {
      setLoading(true);
      const missions = await apiService.getDailyMissions(user.id);
      setDailyMissions(missions);
      setCompletedToday(missions.filter(m => m.completed).length);
    } catch (error) {
      console.error('Failed to load missions:', error);
      // Fallback на mock-данные при ошибке
      const mockMissions = [
        { id: 1, title: 'Test Mission', reward: 50, completed: false }
      ];
      setDailyMissions(mockMissions);
      setCompletedToday(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMissionComplete = async (missionId) => {
    if (!user?.id) return;

    try {
      if (window.Telegram?.WebApp) {
        await apiService.completeMission(missionId);
      }
      // Обновляем локально
      setDailyMissions(prev => prev.map(mission =>
        mission.id === missionId ? { ...mission, completed: true } : mission
      ));
      setCompletedToday(prev => prev + 1);
    } catch (error) {
      console.error('Failed to complete mission:', error);
    }
  };

  return (
    <div className="min-h-screen bg-ninja-bg text-white">
      {/* Header */}
      <div className="p-4 border-b border-ninja-gray">
        <h1 className="text-2xl font-bold text-center">🥷 Daily Missions</h1>
        <p className="text-center text-gray-400 text-sm">
          Complete {completedToday}/{dailyMissions.length} missions today
        </p>
      </div>

      {/* Progress Bar */}
      <div className="p-4">
        <div className="ninja-card p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Daily Progress</span>
            <span className="text-sm text-ninja-yellow">
              {completedToday}/{dailyMissions.length} completed
            </span>
          </div>
          <div className="w-full bg-ninja-gray rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-ninja-green to-ninja-yellow transition-all duration-500"
              style={{ 
                width: `${dailyMissions.length > 0 ? (completedToday / dailyMissions.length) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Missions List */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading missions...</div>
        ) : dailyMissions.length > 0 ? (
          dailyMissions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onComplete={() => handleMissionComplete(mission.id)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No missions available</div>
            <div className="text-sm text-gray-500">Check back tomorrow for new challenges!</div>
          </div>
        )}

        {/* Bonus Rewards */}
        {completedToday >= dailyMissions.length && dailyMissions.length > 0 && (
          <div className="ninja-card p-4 text-center">
            <h3 className="font-bold text-lg text-ninja-yellow mb-2">🎉 Daily Bonus!</h3>
            <p className="text-gray-300 mb-3">
              You've completed all daily missions! Collect your bonus.
            </p>
            <button className="px-6 py-2 bg-gradient-to-r from-ninja-purple to-ninja-pink rounded-full font-semibold">
              Claim 50 Stars
            </button>
          </div>
        )}
      </div>

      {/* Mission Types */}
      <div className="p-4 pt-0">
        <div className="ninja-card p-4">
          <h3 className="font-bold mb-3">Mission Types</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-ninja-gray p-3 rounded text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs">Connect to VPN</div>
            </div>
            <div className="bg-ninja-gray p-3 rounded text-center">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-xs">Invite Friends</div>
            </div>
            <div className="bg-ninja-gray p-3 rounded text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-xs">Stay Connected</div>
            </div>
            <div className="bg-ninja-gray p-3 rounded text-center">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-xs">Achievements</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions;