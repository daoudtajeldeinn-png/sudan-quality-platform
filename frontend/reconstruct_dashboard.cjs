const fs = require('fs');

// Read the clean backup
let content = fs.readFileSync('src/pages/Dashboard_backup.jsx', 'utf8');

// Fix encoding issues in backup (Arabic characters got corrupted)
const encodingFixes = [
  ['ظ…ظ‚ط¯ظ…ط©', 'مقدمة'],
  ['ظپظ‰', 'في'],
  ['ط§ظ„ظ…ط®طھط¨ط±', 'المختبر'],
  ['ط¥ط±ط´ط§ط¯ط§طھ', 'إرشادات'],
  ['ط§ظ„طھط­ظ‚ظ‚', 'التحقق'],
  ['طµظ„ط§ط­ظٹط©', 'صلاحية'],
  ['ط§ظ„ط£ط¯ط§ط¡', 'الأداء'],
  ['ط³ظ„ط§ظ…ط©', 'سلامة'],
  ['ظˆظ†ط²ط§ظ‡ط©', 'ونزاهة'],
  ['ط§ظ„ط¨ظٹط§ظ†ط§طھ', 'البيانات'],
  ['ط¥ط¯ط§ط±ط©', 'إدارة'],
  ['ظ…ط®ط§ط·ط±', 'مخاطر'],
  ['ط§ظ„ط¬ظˆط¯ط©', 'الجودة'],
  ['ظ…ظ…ط§ط±ط³ط§طھ', 'ممارسات'],
  ['ط§ظ„طھظˆط²ظٹط¹', 'التوزيع'],
  ['ط§ظ„ط¬ظٹط¯ط©', 'الجيدة'],
  ['ظ†ط¸ط§ظ…', 'نظام'],
  ['ط§ظ„طµظٹط¯ظ„ط§ظ†ظٹ', 'الصيدلاني'],
  ['ط§ظ„طھطµظ†ظٹط¹', 'التصنيع'],
  ['ط§ظ„ظ…ط¹ظ‚ظ…', 'المعقم'],
  ['ط³ط¬ظ„ط§طھ', 'سجلات'],
  ['ط§ظ„طھط´ط؛ظٹظ„', 'التشغيل'],
  ['ط§ظ„ط±ظ‚ط§ط¨ط©', 'الرقابة'],
  ['ط§ظ„ط¯ظˆط§ط¦ظٹط©', 'الدوائية'],
  ['ظ…طھظ‚ط¯ظ…ط©', 'المتقدمة'],
  ['طªط­ظ„ظٹظ„', 'تحليل'],
  ['ط¨ظٹط§ظ†ط§طھ', 'بيانات'],
  ['ط§ظ„طھط·ط¨ظٹظ‚', 'التطبيق'],
  ['ط§ظ„ط¹ظ…ظ„ظ‰', 'العملي'],
  ['طھط·ط¨ظٹظ‚ط§طھ', 'تطبيقات'],
  ['ط³ظ„ط³ظ„ط©', 'سلسلة'],
  ['ط§ظ„طھط¨ط±ظٹط¯', 'التبريد'],
  ['ط§ظ„ظ…ط³ط§ط±ط§طھ', 'المسارات'],
  ['ط§ظ„ط§ط­طھط±ط§ظپظٹط©', 'الاحترافية'],
  ['ط§ظ„ط¹ظˆط¯ط©', 'العودة'],
  ['ظ„ظ„ظ…ط³ط§ط±ط§طھ', 'للمسارات'],
  ['ظˆط­ط¯ط§طھ', 'وحدات'],
  ['ظ…ظƒطھظ…ظ„', 'مكتمل'],
  ['ظ„ظ…', 'لم'],
  ['ظٹط¨ط¯ط£', 'يبدأ'],
  ['ط­ط§ظ„ط©', 'حالة'],
  ['ط§ظ„ط´ظ‡ط§ط¯ط©', 'الشهادة'],
  ['ظ…ظƒطھظ…ظ„ط©', 'مكتملة'],
  ['ظ‚ظٹط¯', 'قيد'],
  ['ط§ظ„طھظ‚ط¯ظ…', 'التقدم'],
  ['طھظپط§طµظٹظ„', 'تفاصيل'],
  ['ط§ظ„ط¯ط±ط¬ط§طھ', 'الدرجات'],
  ['ظ„ظƒظ„', 'لكل'],
  ['ظˆط­ط¯ط©', 'وحدة'],
  ['ط¬ط§ط±ظٹ', 'جاري'],
  ['طھط­ظ…ظٹظ„', 'تحميل'],
  ['ط§ظ„ظ…طھطµط¯ط±ظٹظ†', 'المتصدرين'],
  ['ظ†طھط§ط¦ط¬', 'نتائج'],
  ['ط¨ظ‚ظٹط©', 'بقية'],
  ['ط§ظ„ظ…طھط¯ط±Ш¨ЩЉЩ†', 'المتدربين'],
  ['ШЄШёЩ‡Ш±', 'تظهر'],
  ['Щ‡Щ†Ш§', 'هنا'],
  ['ШЁЩ†Ш§ШЎЩ‹', 'بناءً'],
  ['Ш№Щ„Щ‰', 'على'],
  ['ШЈШЇШ§Ш¦Щ‡Щ…', 'أدائهم'],
  ['Ш§Щ„ЩЃШ№Щ„ЩЉ', 'الفعلي'],
  ['Щ…ШЄШ®ШµШµ', 'متخصص'],
  ['Ш§Щ„ШЄШЇШ±ЩЉШЁ', 'التدريب'],
  ['Щ€Ш§Щ„ШЄШЈЩ‡ЩЉЩ„', 'والتأهيل'],
  ['Ш§Щ„ШЇЩ€Ш§Ш¦ЩЉ', 'الدوائي'],
  ['Щ…Ш¤ШіШі', 'مؤسس'],
  ['Ш§Щ„Ш№Ш±ШЁЩЉШ©', 'العربية'],
  ['ЩЉШЁШЇШЈ', 'يبدأ'],
  ['Щ…ШЄШµШЇШ±', 'متصدر'],
  ['ШЄЩ' , 'ت'],
];

for (const [bad, good] of encodingFixes) {
  content = content.split(bad).join(good);
}

// 1. Update component signature
content = content.replace(
  'const Dashboard = ({ user, onLogout }) => {', 
  'const Dashboard = ({ user, onLogout, authToken }) => {'
);

// 2. Add new states after Gamification hook
const stateInsertion = `  const [userCertLevel, setUserCertLevel] = useState(1);
  const [certificates, setCertificates] = useState([]);`;
content = content.replace(
  'const [currentUnit, setCurrentUnit] = useState(null);', 
  stateInsertion + '\n  const [currentUnit, setCurrentUnit] = useState(null);'
);

// 3. Update useEffect to use authToken and load certificates/leaderboard
const oldEffect = `      // 2. Remote Backend Load (Reliability)
      if (user.uid) {
        try {
          const profile = await apiService.getUserProfile(user.uid);
          if (profile && profile.progress) {
            // Reconcile: High-score wins
            const remoteProgress = profile.progress.unitScores || {};
            setUserProgress(prev => {
              const reconciled = { ...prev };
              Object.keys(remoteProgress).forEach(unitId => {
                reconciled[unitId] = Math.max(prev[unitId] || 0, remoteProgress[unitId]);
              });
              return reconciled;
            });`;

const newEffect = `      // 2. Remote Backend Load (Reliability)
      if (user?.uid && authToken) {
        try {
          const profile = await apiService.getUserProfile(user.uid, authToken);
          if (profile && profile.progress) {
            // Reconcile: High-score wins
            const remoteProgress = profile.progress.unitScores || {};
            setUserProgress(prev => {
              const reconciled = { ...prev };
              Object.keys(remoteProgress).forEach(unitId => {
                reconciled[unitId] = Math.max(prev[unitId] || 0, remoteProgress[unitId]);
              });
              return reconciled;
            });
            setUserCertLevel(profile.progress.level || 1);
            if (profile.progress.unitStates) setUnitStates(profile.progress.unitStates);
            try {
                const certsData = await apiService.getUserCertificates(user.uid, authToken);
                setCertificates(certsData.certificates || []);
            } catch (err) { console.warn('Certs fetch error', err); }
            
            try {
                const leaderboardData = await apiService.getLeaderboard(authToken);
                if (leaderboardData && Array.isArray(leaderboardData)) {
                    setLeaderboard(leaderboardData);
                }
            } catch (err) { console.warn('Leaderboard fetch error', err); }`;

content = content.replace(oldEffect, newEffect);

// 4. Add handleLevelToggle before handleStartUnit
const lvlToggle = `
  const handleLevelToggle = async () => {
    const newLevel = userCertLevel === 1 ? 2 : 1;
    setUserCertLevel(newLevel);
    if (user?.uid) {
      try {
        await apiService.setUserLevel(user.uid, newLevel);
      } catch (e) {
        console.error('Level toggle failed', e);
      }
    }
  };
`;
content = content.replace(
  'const handleStartUnit = (unitId) => {', 
  lvlToggle + '\n  const handleStartUnit = (unitId) => {'
);

// 5. Add awardCertificate in handleQuizComplete
const quizCompleteOld = `    const { score, unitId } = result;
    logAuditTrail('eventQuiz', unitId);

    // Only update if it's the highest score or if it passes`;

const quizCompleteNew = `    const { score, unitId } = result;
    logAuditTrail('eventQuiz', unitId);

    if (score >= 90 && user?.uid) {
      try {
        apiService.awardCertificate({
          userId: user.uid,
          userName: user.displayName || user.email,
          unitId,
          unitName: allUnitsDefinition.find(u => u.id === unitId)?.title || unitId,
          score,
          percentage: score
        });
      } catch (e) {
        console.error('Award failed', e);
      }
    }

    // Only update if it's the highest score or if it passes`;

content = content.replace(quizCompleteOld, quizCompleteNew);

// 6. Add analytics nav button and view
const oldNav = `        <button 
          onClick={() => { setViewMode('toolkit'); setCurrentTrack(null); }}`;
const newNav = `        <button 
          onClick={() => setViewMode('analytics')} 
          style={{ 
            padding: '12px 35px', 
            borderRadius: '15px', 
            border: 'none', 
            backgroundColor: viewMode === 'analytics' ? 'var(--primary-color)' : 'var(--bg-card)',
            color: viewMode === 'analytics' ? 'white' : 'var(--text-primary)',
            fontWeight: 'bold', 
            cursor: 'pointer', 
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📊 {t('analytics') || 'Analytics'}
        </button>
        <button 
          onClick={() => { setViewMode('toolkit'); setCurrentTrack(null); }}`;

content = content.replace(oldNav, newNav);

// 7. Add the Banner before Gamification Level Bar
const bannerUI = `      {/* PROMINENT BANNER ALWAYS VISIBLE */}
      <div style={{
        background: 'linear-gradient(90deg, #d4edda, #c3e6cb)',
        color: '#155724',
        padding: '20px',
        textAlign: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        borderBottom: '4px solid #28a745',
        boxShadow: '0 2px 10px rgba(40,167,69,0.2)'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📜 <strong>قواعد الشهادات</strong></div>
        <div>
          {userCertLevel === 1 
            ? <span>المستوى الابتدائي: <strong style={{ color: '#28a745' }}>كل 3 كورسات = شهادة مجمعة بتفاصيل الثلاثة</strong></span> 
            : <span>المستوى المتقدم: <strong style={{ color: '#28a745' }}>شهادة لكل كورس على حدة</strong></span>
          }
        </div>
        <button onClick={handleLevelToggle} style={{
          marginTop: '10px',
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          {userCertLevel === 1 ? 'التبديل إلى متقدم' : 'التبديل إلى ابتدائي'}
        </button>
      </div>

      {/* Certificates Section */}
      <section style={{ padding: '30px', borderRadius: '24px', marginBottom: '30px', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#17a2b8' }}>🎯 الشهادات المحقّقة ({certificates.length})</h3>
        <div style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#28a745', fontWeight: 'bold' }}>
          {userCertLevel === 1 ? 'كل 3 كورسات اكتملت بنسبة 90%+ = شهادة' : 'كل كورس اكتمل بنسبة 90%+ = شهادة'}
        </div>
        {certificates.length > 0 ? certificates.map(cert => (
          <div key={cert.certificateId} style={{ padding: '15px', marginBottom: '10px', background: '#d4edda', borderRadius: '10px', borderLeft: '5px solid #28a745' }}>
            {cert.unitType || 'شهادة مجمعة'} - <strong>L{cert.level}</strong> - {cert.score}%
          </div>
        )) : <p style={{ color: '#6c757d' }}>ابدأ الكورسات لتحقيق شهاداتك!</p>}
      </section>

`;

content = content.replace('{/* Gamification Level Bar */}', bannerUI + '      {/* Gamification Level Bar */}');

// 8. Update the viewMode === 'toolkit' conditional to include analytics
const oldViewMode = `        ) : viewMode === 'toolkit' ? (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
            <FMEATool />
            <BatchSignSim />
            <StabilityCalculator />
            <SamplingCalculator />
            <InspectionChecklist />
          </div>
        ) : (`;

const newViewMode = `        ) : viewMode === 'toolkit' ? (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
            <FMEATool />
            <BatchSignSim />
            <StabilityCalculator />
            <SamplingCalculator />
            <InspectionChecklist />
          </div>
        ) : (
          /* Analytics View */
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
              <section className="glass-panel" style={{ padding: '30px', borderRadius: '24px' }}>
                <h3 style={{ marginBottom: '25px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>📊</span> {language === 'ar' ? 'تحليل تقدمك' : 'Your Progress Analytics'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid var(--primary-color)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{unitIds.filter(id => (userProgress[id] || 0) >= 90).length}</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'وحدة مكتملة' : 'Units Completed'}</div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '2px solid #ffc107' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffc107' }}>{totalAverage}%</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'متوسط الدرجات' : 'Average Score'}</div>
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: \`2px solid \${allPassed ? '#28a745' : '#6c757d'}\` }}>
                    <div style={{ fontSize: '2.5rem' }}>{allPassed ? '🏆' : '🔒'}</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>{language === 'ar' ? 'حالة الشهادة' : 'Certificate Status'}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: allPassed ? '#28a745' : '#6c757d', marginTop: '4px' }}>{allPassed ? (language === 'ar' ? 'مكتملة ✔' : 'Earned ✔') : (language === 'ar' ? 'قيد التقدم' : 'In Progress')}</div>
                </div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>{language === 'ar' ? '📋 تفاصيل الدرجات لكل وحدة' : '📋 Score Details by Unit'}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {allUnitsDefinition.map(unit => {
                    const unitScore = userProgress[unit.id] || 0;
                    const isPassed = unitScore >= 90;
                    const unitIcon = UNIT_ICONS[unit.id] || { icon: '📖', color: '#28a745' };
                    return (
                      <div key={unit.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ fontWeight: '500', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><span>{unitIcon.icon}</span> {unit.title}</span>
                          <span style={{ fontWeight: 'bold', color: isPassed ? '#28a745' : unitScore > 0 ? '#ffc107' : 'var(--text-secondary)', minWidth: '75px', textAlign: 'right' }}>{unitScore > 0 ? \`\${unitScore}%\` : (language === 'ar' ? 'لم يبدأ' : 'Not Started')}</span>
                        </div>
                        <div style={{ height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ width: \`\${unitScore}%\`, height: '100%', backgroundColor: isPassed ? '#28a745' : unitScore > 0 ? '#ffc107' : 'transparent', borderRadius: '10px', transition: 'width 1.5s cubic-bezier(0.25, 1, 0.5, 1)' }} />
                        </div>
                    );
                  })}
                </div>
              </section>

              {/* Leaderboard Sidebar */}
              <section className="glass-panel" style={{ padding: '25px', borderRadius: '24px' }}>
                <h3 style={{ marginBottom: '20px', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>🥇</span> {t('leaderboard')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leaderboard.length > 0 ? (
                    leaderboard.sort((a, b) => (b.xp || 0) - (a.xp || 0)).map((entry, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        padding: '10px', 
                        borderRadius: '12px',
                        backgroundColor: entry.userId === user.uid ? 'rgba(40,167,69,0.1)' : 'transparent',
                        border: entry.userId === user.uid ? '1px solid #28a745' : '1px solid transparent'
                      }}>
                        <div style={{ fontWeight: 'bold', width: '25px', color: idx === 0 ? '#ffc107' : idx === 1 ? '#adb5bd' : idx === 2 ? '#cd7f32' : 'var(--text-secondary)' }}>#{idx + 1}</div>
                        <div style={{ fontSize: '1.2rem' }}>
                          {entry.photoURL ? (
                            <img src={entry.photoURL} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
                          ) : (
                            <span style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee', fontSize: '1rem' }}>
                              {entry.userId === user.uid ? '⭐' : '👤'}
                            </span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{entry.displayName || (entry.userId === user.uid ? user.displayName || 'You' : 'Trainee')}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('level')} {entry.level || 1} • {entry.xp || 0} XP</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                      {t('loading')}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  💡 {language === 'ar' ? 'نتائج بقية المتدربين تظهر هنا بناءً على أدائهم الفعلي.' : 'Live trainee rankings based on actual platform performance.'}
                </div>
              </section>
            </div>
        ) : (`;

content = content.replace(oldViewMode, newViewMode);

// Write the final clean file
fs.writeFileSync('src/pages/Dashboard.jsx', content, 'utf8');
console.log('Dashboard.jsx reconstructed successfully!');
