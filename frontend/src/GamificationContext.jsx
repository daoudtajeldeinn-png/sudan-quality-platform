import React, { createContext, useState, useContext, useEffect } from 'react';

import { apiService } from './services/api';
const GamificationContext = createContext();

<<<<<<< HEAD
export const GamificationProvider = ({ children, userId, userEmail, authToken, loading: parentLoading = false }) => {
  const [loading, setLoading] = useState(true);
  const isLoading = parentLoading || loading;
=======
export const GamificationProvider = ({ children, userId, userEmail }) => {
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
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
<<<<<<< HEAD
      setLoading(true);
      if (userId && authToken) {
        try {
          const profile = await apiService.getUserProfile(userId, authToken);
=======
      if (userId) {
        try {
          const profile = await apiService.getUserProfile(userId);
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
          if (profile) {
            setXp(profile.xp || 0);
            setLevel(profile.level || 1);
            setBadges(profile.badges || []);
            setStats(profile.stats || { totalQuizzes: 0, perfectScores: 0, lecturesCompleted: 0 });
<<<<<<< HEAD
            setLoading(false);
=======
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
            return; // Exit if backend load successful
          }
        } catch (error) {
          console.warn('Backend profile fetch failed, using localStorage fallback', error);
<<<<<<< HEAD
          console.warn('Backend profile fetch failed, using localStorage fallback', error);
=======
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
        }
      }

      // Fallback to localStorage if no userId or backend fails
      if (userEmail) {
        const savedData = localStorage.getItem(`sqp_gamify_${userEmail}`);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            setXp(parsed.xp || 0);
            setLevel(parsed.level || 1);
            setBadges(parsed.badges || []);
            setStats(parsed.stats || { totalQuizzes: 0, perfectScores: 0, lecturesCompleted: 0 });
          } catch (e) { console.error('Error loading gamification data', e); }
        }
      }
    };

<<<<<<< HEAD
    loadInitialStats().finally(() => setLoading(false));
=======
    loadInitialStats();
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
  }, [userId, userEmail]);

  // Sync state to local and backend whenever it changes
  useEffect(() => {
    if (!userEmail) return;
    const dataToSave = { xp, level, badges, stats };
    
    // Always save locally for offline responsiveness
    localStorage.setItem(`sqp_gamify_${userEmail}`, JSON.stringify(dataToSave));

    // Sync to backend if logged in
    const syncToBackend = async () => {
<<<<<<< HEAD
      if (userId && authToken) {
        try {
          await apiService.syncUserStats(userId, dataToSave, authToken);
=======
      if (userId) {
        try {
          await apiService.syncUserStats(userId, dataToSave);
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
        } catch (error) {
          console.error('Failed to sync to backend', error);
        }
      }
    };

    // Debounce sync slightly to avoid excessive calls
    const timeoutId = setTimeout(syncToBackend, 2000);
    return () => clearTimeout(timeoutId);
  }, [xp, level, badges, stats, userEmail, userId]);

  // Level logic: Level = floor(sqrt(XP / 100)) + 1
  useEffect(() => {
    const newLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
    if (newLevel > level) {
      // Level up! (Could trigger an animation/modal in the UI)
      setLevel(newLevel);
    }
  }, [xp, level]);

  const addXp = (amount) => {
    setXp(prev => prev + amount);
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

<<<<<<< HEAD
  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', direction: 'rtl' }}>جاري تحميل البيانات...</div>;
  }

  return (
    <GamificationContext.Provider value={{ 
      xp, level, badges, stats, loading,
=======
  return (
    <GamificationContext.Provider value={{ 
      xp, level, badges, stats, 
>>>>>>> 4b7a20e946e57a19d6e3dd5af9abbec206e3e211
      addXp, awardBadge, updateStats, getXpToNextLevel 
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);
