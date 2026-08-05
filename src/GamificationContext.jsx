import React, { createContext, useState, useContext, useEffect } from 'react';

import { apiService } from './services/api';
const GamificationContext = createContext();

export const GamificationProvider = ({ children, userId, userEmail, authToken, loading: parentLoading = false }) => {
  const [loading, setLoading] = useState(true);
  const isLoading = parentLoading || loading;
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    perfectScores: 0,
    lecturesCompleted: 0
  });

  // Load state from Backend (preferable) or localStorage on mount
  useEffect(() => {
    const loadInitialStats = async () => {
      setLoading(true);
      
      let localData = null;
      if (userEmail) {
        const savedData = localStorage.getItem(`sqp_gamify_${userEmail}`);
        if (savedData) {
          try { localData = JSON.parse(savedData); } catch (e) { console.error('Error parsing local data', e); }
        }
      }

      if (userId && authToken) {
        try {
          const profile = await apiService.getUserProfile(userId, authToken);
          if (profile) {
            // RECONCILIATION: Take the highest XP between local and remote
            const remoteXp = parseInt(profile.xp || 0, 10);
            const localXp = parseInt(localData?.xp || 0, 10);
            
            if (localXp > remoteXp) {
              console.log('Local progress is ahead, syncing to cloud...');
              setXp(localXp);
              setLevel(localData.level || 1);
              setBadges(localData.badges || []);
              setStats(localData.stats || { totalQuizzes: 0, perfectScores: 0, lecturesCompleted: 0 });
              
              // Trigger a sync back to server in the next effect
            } else {
              setXp(remoteXp);
              setLevel(profile.level || 1);
              setBadges(profile.badges || []);
              setStats(profile.stats || { totalQuizzes: 0, perfectScores: 0, lecturesCompleted: 0 });
            }
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('Backend profile fetch failed, using localStorage fallback', error);
        }
      }

      // Fallback to localStorage if no userId or backend fails
      if (localData) {
        setXp(localData.xp || 0);
        setLevel(localData.level || 1);
        setBadges(localData.badges || []);
        setStats(localData.stats || { totalQuizzes: 0, perfectScores: 0, lecturesCompleted: 0 });
      }
    };

    loadInitialStats().finally(() => setLoading(false));
  }, [userId, userEmail, authToken]);

  // Sync state to local and backend whenever it changes
  useEffect(() => {
    if (!userEmail) return;
    const dataToSave = { xp, level, badges, stats };
    
    // Always save locally for offline responsiveness
    localStorage.setItem(`sqp_gamify_${userEmail}`, JSON.stringify(dataToSave));

    // Sync to backend if logged in
    const syncToBackend = async () => {
      if (userId && authToken) {
        try {
          await apiService.syncUserStats(userId, dataToSave, authToken);
        } catch (error) {
          console.error('Failed to sync to backend', error);
        }
      }
    };

    // Debounce sync slightly to avoid excessive calls
    const timeoutId = setTimeout(syncToBackend, 2000);
    return () => clearTimeout(timeoutId);
  }, [xp, level, badges, stats, userEmail, userId, authToken]);

  // Level logic: Level = floor(sqrt(XP / 100)) + 1
  useEffect(() => {
    const newLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
    if (newLevel > level) {
      // Level up! (Could trigger an animation/modal in the UI)
      setLevel(newLevel);
    }
  }, [xp, level]);

  const addXp = (amount) => {
    setXp(prev => parseInt(prev, 10) + parseInt(amount, 10));
  };

  const awardBadge = (badgeId, badgeName, icon) => {
    setBadges(prev => {
      if (prev.find(b => b.id === badgeId)) return prev;
      return [...prev, { id: badgeId, name: badgeName, icon, date: new Date().toISOString() }];
    });
  };

  const updateStats = (newStats) => {
    setStats(prev => ({ ...prev, ...newStats }));
  };

  const getXpToNextLevel = () => {
    const currentLevelThreshold = Math.pow(level - 1, 2) * 100;
    const nextLevelThreshold = Math.pow(level, 2) * 100;
    const progress = xp - currentLevelThreshold;
    const goal = nextLevelThreshold - currentLevelThreshold;
    return { progress, goal, percentage: Math.min((progress / goal) * 100, 100) };
  };

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', direction: 'rtl' }}>جاري تحميل البيانات...</div>;
  }

  return (
    <GamificationContext.Provider value={{ 
      xp, level, badges, stats, loading,
      addXp, awardBadge, updateStats, getXpToNextLevel 
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => { 
  const ctx = useContext(GamificationContext); 
  if (!ctx) return { xp: 0, level: 1, badges: [], stats: { totalQuizzes: 0, perfectScores: 0, lecturesCompleted: 0 }, getXpToNextLevel: () => 100, updateStats: () => {}, addXp: () => {}, awardBadge: () => {} }; 
  return ctx; 
};
