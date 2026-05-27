const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard_backup.jsx', 'utf8');

// 1. ADD missing import
if (!content.includes('import apiService')) {
  content = content.replace(
    "import { useGamification } from '../GamificationContext';",
    "import { useGamification } from '../GamificationContext';\nimport apiService from '../services/api';"
  );
}

// 2. signature
content = content.replace(
  'const Dashboard = ({ user, onLogout }) => {', 
  'const Dashboard = ({ user, onLogout, authToken }) => {'
);

// 3. States
content = content.replace(
  'const [currentUnit, setCurrentUnit] = useState(null);',
  `  const [userCertLevel, setUserCertLevel] = useState(1);
  const [certificates, setCertificates] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(null);`
);

// 4. Remote Load
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
            try {
                const certsData = await apiService.getUserCertificates(user.uid, authToken);
                setCertificates(certsData.certificates || []);
            } catch (err) { console.warn('Certs fetch error', err); }`;

content = content.replace(oldEffect, newEffect);

// 5. Level Toggle
content = content.replace(
  'const handleStartUnit = (unitId) => {',
  `  const handleLevelToggle = async () => {
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

  const handleStartUnit = (unitId) => {`
);

// 6. Award Cert
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
          unitName: allUnitsDefinition.find(u => u.id === unitId)?.title?.[language] || unitId,
          score,
          percentage: score
        });
      } catch (e) {
        console.error('Award failed', e);
      }
    }

    // Only update if it's the highest score or if it passes`;

content = content.replace(quizCompleteOld, quizCompleteNew);

// 7. UI Banner
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

fs.writeFileSync('src/pages/Dashboard.jsx', content, 'utf8');
console.log('Done merging clean');
