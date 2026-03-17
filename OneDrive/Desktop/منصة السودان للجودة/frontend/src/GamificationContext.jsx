import React, { createContext, useState, useContext, useEffect } from 'react';

const GamificationContext = createContext();

export const GamificationProvider = ({ children, userEmail }) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    perfectScores: 0,
    lecturesCompleted: 0
  });

  // Load state from localStorage on mount
  useEffect(() => {
    if (!userEmail) return;
    const savedData = localStorage.getItem(`sqp_gamify_${userEmail}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setXp(parsed.xp || 0);
        setLevel(parsed.level || 1);
        setBadges(parsed.badges || []);
        setStats(parsed.stats || { totalQuizzes: 0, perfectScores: 0, lecturesCompleted: 0 });
      } catch (e) {
        console.error('Error loading gamification data', e);
      }
    }
  }, [userEmail]);

  // Save state whenever it changes
  useEffect(() => {
    if (!userEmail) return;
    const dataToSave = { xp, level, badges, stats };
    localStorage.setItem(`sqp_gamify_${userEmail}`, JSON.stringify(dataToSave));
  }, [xp, level, badges, stats, userEmail]);

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

  return (
    <GamificationContext.Provider value={{ 
      xp, level, badges, stats, 
      addXp, awardBadge, updateStats, getXpToNextLevel 
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);
