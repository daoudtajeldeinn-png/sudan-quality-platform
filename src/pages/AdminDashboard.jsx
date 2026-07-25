import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production'
  ? 'https://backend-lime-gamma-gf9yal9mmd.vercel.app/api'
  : 'http://localhost:5000/api');
import pharmaLogo from '../assets/pharma_logo.png';

const ADMIN_EMAILS = [
  'daoudtajeldeinn113@gmail.com',
  'daoudtajeldeinn@gmail.com'
];

const UNIT_NAMES = {
  'gmp-intro': 'GMP Basics', 'glp-basics': 'GLP Basics', 'iso-17025': 'ISO 17025',
  'ich-guidelines': 'ICH Guidelines', 'validation-qualification': 'Validation & Qualification',
  'data-integrity': 'Data Integrity', 'qrm-basics': 'QRM Basics', 'gdp-basics': 'GDP Basics',
  'ich-q10': 'ICH Q10', 'sterile-annex1': 'Sterile Manufacturing', 'gamp5-basics': 'GAMP5 Basics',
  'batch-records': 'Batch Records', 'nmpb-reg': 'NMPB Regulatory', 'adv-gmp': 'Advanced GMP',
  'adv-glp': 'Advanced GLP', 'adv-iso-17025': 'Advanced ISO 17025', 'adv-validation': 'Advanced Validation',
  'adv-qrm': 'Advanced QRM', 'adv-gdp': 'Advanced GDP', 'cleaning-validation': 'Cleaning Validation',
  'process-validation': 'Process Validation', 'hold-time-stability': 'Hold Time Stability',
  'method-validation': 'Method Validation', 'equipment-qualification': 'Equipment Qualification',
};

const NAV_ITEMS = [
  { id: 'overview',      icon: '📊', label: 'Overview'      },
  { id: 'users',         icon: '👥', label: 'Users'         },
  { id: 'certificates',  icon: '🎓', label: 'Certificates'  },
  { id: 'analytics',     icon: '📈', label: 'Analytics'     },
  { id: 'questions',     icon: '❓', label: 'Questions'     },
  { id: 'settings',      icon: '⚙️', label: 'Settings'     },
];

const S = {
  navy:    '#0f2557',
  navyMid: '#1a3a7a',
  navyDk:  '#0d1f4a',
  gold:    '#d4af37',
  goldLt:  '#f0d060',
  green:   '#1d9e75',
  blue:    '#185fa5',
  purple:  '#7f77dd',
  danger:  '#dc2626',
  bg:      '#f0f2f7',
  card:    'white',
  border:  '#e4e8f0',
  text:    '#1a2a4a',
  sub:     '#64748b',
};

export default function AdminDashboard({ user, onLogout, authToken, onSwitchView }) {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers]               = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [windowWidth, setWindowWidth]   = React.useState(window.innerWidth);
  const isMobile = windowWidth < 768;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const headers = { 'Content-Type': 'application/json', 'x-admin-email': user.email };
    try {
      const [statsRes, usersRes, certsRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`,        { headers }),
        fetch(`${API_URL}/admin/users`,        { headers }),
        fetch(`${API_URL}/admin/certificates`, { headers }),
      ]);
      const statsData = statsRes.ok ? await statsRes.json() : {};
      const usersData = usersRes.ok ? await usersRes.json() : { users: [] };
      const certsData = certsRes.ok ? await certsRes.json() : { certificates: [] };

      const userArr = Array.isArray(usersData) ? usersData : (usersData?.users || []);
      const certArr = Array.isArray(certsData) ? certsData : (certsData?.certificates || []);

      setUsers(userArr);
      setCertificates(certArr);
      setStats({
        totalUsers:   statsData.totalUsers   || userArr.length,
        totalCerts:   statsData.totalCerts   || certArr.length,
        avgScore:     statsData.avgXp        || 0,
        totalCourses: 24,
      });
    } catch (err) {
      console.error('Admin fetch error:', err);
      setStats({ totalUsers: 0, totalCerts: 0, avgScore: 0, totalCourses: 24 });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter(u =>
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCerts = (Array.isArray(certificates) ? certificates : []).filter(c =>
    c.unitId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── SIDEBAR ── */
  const Sidebar = () => (
    <div style={{
      width: isMobile ? '0' : sidebarOpen ? '240px' : '64px',
      background: `linear-gradient(180deg, ${S.navy} 0%, ${S.navyMid} 55%, ${S.navyDk} 100%)`,
      display: isMobile ? 'none' : 'flex', flexDirection: 'column', flexShrink: 0,
      transition: 'width 0.22s ease', overflow: 'hidden',
      boxShadow: '4px 0 20px rgba(0,0,0,0.18)'
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 2px ${S.gold}` }}>
          <img src={pharmaLogo} alt="logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
        </div>
        {sidebarOpen && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', whiteSpace: 'nowrap' }}>Sudan Quality</div>
            <div style={{ fontSize: '10px', color: S.gold, fontWeight: '600', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>ADMIN PANEL</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 8px', flex: 1 }}>
        {sidebarOpen && (
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', padding: '8px 10px 6px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
            Management
          </div>
        )}
        {NAV_ITEMS.map(item => {
          const active = activeSection === item.id;
          return (
            <div key={item.id} onClick={() => setActiveSection(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: sidebarOpen ? '10px 12px' : '10px', borderRadius: '10px',
              color: active ? S.gold : 'rgba(255,255,255,0.55)',
              background: active ? 'rgba(212,175,55,0.13)' : 'transparent',
              borderLeft: active ? `3px solid ${S.gold}` : '3px solid transparent',
              cursor: 'pointer', marginBottom: '3px',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              transition: 'all 0.15s',
            }}
              onMouseOver={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '17px', flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: '13px', fontWeight: active ? '600' : '400' }}>{item.label}</span>}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, border: `2px solid ${S.gold}` }} />
          ) : (
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg,${S.gold},${S.goldLt})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: S.navy, flexShrink: 0 }}>
              {user.displayName?.[0] || 'A'}
            </div>
          )}
          {sidebarOpen && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName || 'Admin'}</div>
                <div style={{ fontSize: '10px', color: S.gold }}>Administrator</div>
              </div>
              <button onClick={onLogout} title="Logout" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#f87171', fontSize: '12px' }}>
                🚪
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  /* ── TOP BAR ── */
  const TopBar = () => (
    <div style={{ padding: '12px 24px', background: S.card, borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: '8px', padding: '7px 10px', fontSize: '16px', cursor: 'pointer', color: S.sub }}>☰</button>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: S.text }}>{NAV_ITEMS.find(n => n.id === activeSection)?.label || 'Overview'}</div>
          <div style={{ fontSize: '11px', color: S.sub }}>Sudan Quality Platform</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: S.sub, fontSize: '13px' }}>🔍</span>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users, certs..."
            style={{ padding: '8px 14px 8px 32px', borderRadius: '10px', border: `1px solid ${S.border}`, fontSize: '13px', width: '220px', outline: 'none', background: S.bg, color: S.text }} />
        </div>
        <button onClick={fetchData} style={{ padding: '8px 14px', borderRadius: '10px', background: S.navyMid, color: 'white', border: 'none', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>↻ Refresh</button>
        {onSwitchView && (
          <button onClick={onSwitchView} style={{ padding: '8px 14px', borderRadius: '10px', background: `linear-gradient(135deg,${S.green},#0f6e56)`, color: 'white', border: 'none', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
            👁️ Student View
          </button>
        )}
      </div>
    </div>
  );

  /* ── STAT CARD ── */
  const StatCard = ({ label, value, sub, gradient, icon }) => (
    <div style={{ borderRadius: '16px', padding: '20px', background: gradient, color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.12)' }}>
      <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '8px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '6px' }}>{sub}</div>
      <div style={{ position: 'absolute', right: '16px', top: '16px', fontSize: '36px', opacity: 0.15 }}>{icon}</div>
    </div>
  );

  /* ── OVERVIEW ── */
  const Overview = () => (
    <div style={{ padding: '24px' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${S.navy}, ${S.navyMid})`, borderRadius: '20px', padding: '28px 32px', marginBottom: '24px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 30px rgba(15,37,87,0.3)' }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', background: `rgba(212,175,55,0.07)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)', opacity: 0.08 }}>
          <img src={pharmaLogo} alt="" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
        </div>
        <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
          Welcome back, {user.displayName?.split(' ')[0] || 'Admin'} 👋
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
          Sudan Quality Platform — Admin Control Panel
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: `rgba(212,175,55,0.2)`, color: S.gold, border: `1px solid rgba(212,175,55,0.35)`, fontSize: '11px', padding: '4px 14px', borderRadius: '20px', fontWeight: '600' }}>⭐ Super Admin</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)', fontSize: '11px', padding: '4px 14px', borderRadius: '20px' }}>Full Access</span>
          <span style={{ background: 'rgba(29,158,117,0.2)', color: '#5dcaa5', border: '1px solid rgba(29,158,117,0.3)', fontSize: '11px', padding: '4px 14px', borderRadius: '20px' }}>● Live</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Users"   value={stats?.totalUsers  || 0} sub="registered students"  gradient={`linear-gradient(135deg,${S.green},#0f6e56)`}  icon="👥" />
        <StatCard label="Certificates"  value={stats?.totalCerts  || 0} sub="issued to date"        gradient={`linear-gradient(135deg,${S.blue},#0c447c)`}   icon="🎓" />
        <StatCard label="Avg. Score"    value={`${stats?.avgScore || 0}%`} sub="platform average"  gradient={`linear-gradient(135deg,${S.gold},#a07820)`}    icon="⭐" />
        <StatCard label="Active Courses" value={24}                     sub="pharmaceutical units"  gradient={`linear-gradient(135deg,${S.purple},#3c3489)`}  icon="📚" />
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { id: 'users',        icon: '👥', title: 'Manage Users',    desc: 'View all students and their progress',       bg: '#eef4ff', accent: S.blue   },
          { id: 'certificates', icon: '🎓', title: 'Certificates',    desc: 'View and manage issued certificates',        bg: '#eafaf3', accent: S.green  },
          { id: 'analytics',    icon: '📈', title: 'Analytics',       desc: 'Course pass rates and performance data',     bg: '#f3f0ff', accent: S.purple },
        ].map(item => (
          <div key={item.id} onClick={() => setActiveSection(item.id)} style={{
            background: item.bg, borderRadius: '16px', padding: '20px', cursor: 'pointer',
            border: `1px solid ${item.accent}22`, transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
          >
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>{item.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: item.accent, marginBottom: '5px' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: S.sub }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div style={{ background: S.card, borderRadius: '16px', border: `1px solid ${S.border}`, padding: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: S.text, marginBottom: '14px' }}>🔧 System Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
          {[
            { name: 'Firebase Hosting', status: 'Operational', color: S.green },
            { name: 'Vercel Backend',   status: 'Operational', color: S.green },
            { name: 'Supabase DB',      status: 'Operational', color: S.green },
          ].map(s => (
            <div key={s.name} style={{ padding: '12px 16px', background: S.bg, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: S.text, fontWeight: '500' }}>{s.name}</span>
              <span style={{ fontSize: '11px', color: s.color, fontWeight: '700', background: `${s.color}18`, padding: '3px 10px', borderRadius: '20px' }}>● {s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── USERS ── */
  const Users = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ background: S.card, borderRadius: '16px', border: `1px solid ${S.border}`, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${S.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: S.bg }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: S.text }}>All Students</div>
            <div style={{ fontSize: '12px', color: S.sub }}>{filteredUsers.length} users found</div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: S.navy }}>
                {['#', 'Student', 'Email', 'XP', 'Level', 'Last Login', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: S.sub }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                  <div>No users found</div>
                </td></tr>
              ) : filteredUsers.map((u, i) => (
                <tr key={u.userId || i} style={{ borderBottom: `1px solid ${S.bg}`, transition: 'background 0.1s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f8faff'}
                  onMouseOut={e => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: S.sub }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg,${S.navyMid},${S.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                        {u.displayName?.[0] || '?'}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: S.text }}>{u.displayName || 'Unknown'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: S.sub }}>{u.email || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: S.blue }}>{u.xp || 0} XP</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: `${S.gold}22`, color: '#854f0b', fontWeight: '700' }}>
                      Lv {u.level || 1}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: S.sub }}>
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {(() => {
                      const daysSince = u.lastLogin
                        ? Math.floor((Date.now() - new Date(u.lastLogin)) / 86400000) : 999;
                      const isActive  = daysSince <= 14;
                      return (
                        <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '600',
                          background: isActive ? 'rgba(29,158,117,0.1)' : 'rgba(220,38,38,0.1)',
                          color: isActive ? S.green : S.danger }}>
                          {isActive ? '● Active' : `⚠ ${daysSince}d inactive`}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ── CERTIFICATES ── */
  const Certificates = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ background: S.card, borderRadius: '16px', border: `1px solid ${S.border}`, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${S.border}`, background: S.bg }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: S.text }}>All Certificates</div>
          <div style={{ fontSize: '12px', color: S.sub }}>{filteredCerts.length} certificates issued</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: S.navy }}>
                {['Course / Unit', 'Issue Date', 'Verification ID', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCerts.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: S.sub }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎓</div>
                  <div>No certificates found</div>
                </td></tr>
              ) : filteredCerts.map((c, i) => (
                <tr key={c.id || i} style={{ borderBottom: `1px solid ${S.bg}`, transition: 'background 0.1s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f8faff'}
                  onMouseOut={e => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `linear-gradient(135deg,${S.gold},${S.goldLt})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎓</div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: S.text }}>{UNIT_NAMES[c.unitId] || c.unitId || 'Academy'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: S.sub }}>
                    {c.issueDate ? new Date(c.issueDate?.toDate?.() || c.issueDate).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '11px', color: S.sub, fontFamily: 'monospace' }}>
                    {c.verificationId || c.id?.substring(0, 16) || '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', background: '#eaf3de', color: '#3b6d11', fontWeight: '600' }}>● Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ── ANALYTICS ── */
  const Analytics = () => {
    const courseStats = Object.entries(UNIT_NAMES).map(([id, name]) => ({
      id, name, score: Math.floor(Math.random() * 25) + 75
    }));
    return (
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {[
            { label: 'Pass Rate',       value: '91%',  icon: '✅', color: S.green  },
            { label: 'Active Learners', value: stats?.totalUsers || 0, icon: '👥', color: S.blue   },
            { label: 'Certs Issued',    value: stats?.totalCerts || 0, icon: '🎓', color: S.purple },
          ].map(s => (
            <div key={s.label} style={{ background: S.card, borderRadius: '16px', border: `1px solid ${S.border}`, padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: S.sub, fontWeight: '500' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background: S.card, borderRadius: '16px', border: `1px solid ${S.border}`, padding: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: S.text, marginBottom: '20px' }}>📊 Course Pass Rates</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {courseStats.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '180px', fontSize: '12px', color: S.sub, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div style={{ flex: 1, height: '10px', background: S.bg, borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    height: '10px', borderRadius: '6px', width: `${c.score}%`,
                    background: c.score >= 90
                      ? `linear-gradient(90deg,${S.green},#5dcaa5)`
                      : c.score >= 80
                        ? `linear-gradient(90deg,${S.blue},#378add)`
                        : `linear-gradient(90deg,#ba7517,#ef9f27)`,
                    transition: 'width 0.6s ease'
                  }} />
                </div>
                <div style={{ width: '42px', fontSize: '12px', fontWeight: '700', color: c.score >= 90 ? S.green : c.score >= 80 ? S.blue : '#ba7517', textAlign: 'right', flexShrink: 0 }}>{c.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ── QUESTIONS ── */
  const Questions = () => {
    const UNIT_LIST = [
      {id:'gmp-intro',label:'GMP Basics'},{id:'glp-basics',label:'GLP Basics'},
      {id:'iso-17025',label:'ISO 17025'},{id:'ich-guidelines',label:'ICH Guidelines'},
      {id:'validation-qualification',label:'Validation & Qualification'},{id:'data-integrity',label:'Data Integrity'},
      {id:'qrm-basics',label:'QRM Basics'},{id:'gdp-basics',label:'GDP Basics'},
      {id:'ich-q10',label:'ICH Q10'},{id:'sterile-annex1',label:'Sterile Manufacturing'},
      {id:'gamp5-basics',label:'GAMP5 Basics'},{id:'batch-records',label:'Batch Records'},
      {id:'nmpb-reg',label:'NMPB Regulatory'},{id:'adv-gmp',label:'Advanced GMP'},
      {id:'adv-glp',label:'Advanced GLP'},{id:'adv-iso-17025',label:'Advanced ISO 17025'},
      {id:'adv-validation',label:'Advanced Validation'},{id:'adv-qrm',label:'Advanced QRM'},
      {id:'adv-gdp',label:'Advanced GDP'},{id:'cleaning-validation',label:'Cleaning Validation'},
      {id:'process-validation',label:'Process Validation'},{id:'hold-time-stability',label:'Hold Time Stability'},
      {id:'method-validation',label:'Method Validation'},{id:'equipment-qualification',label:'Equipment Qualification'},
    ];
    const API_URL = 'https://backend-lime-gamma-gf9yal9mmd.vercel.app/api';
    const headers = { 'Content-Type':'application/json', 'x-admin-email': user.email };

    const [selectedUnit, setSelectedUnit] = React.useState('');
    const [questions, setQuestions]       = React.useState([]);
    const [qLoading, setQLoading]         = React.useState(false);
    const [showForm, setShowForm]         = React.useState(false);
    const [editQ, setEditQ]               = React.useState(null);
    const [form, setForm]                 = React.useState({ question:'', options:['','','',''], correctAnswer:0, explanation:'' });
    const [saving, setSaving]             = React.useState(false);
    const [msg, setMsg]                   = React.useState('');

    const loadQuestions = async (unitId) => {
      setQLoading(true);
      try {
        const res  = await fetch(`${API_URL}/admin/questions/${unitId}`, { headers });
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch(e) { console.error(e); }
      setQLoading(false);
    };

    const handleUnitChange = (e) => {
      setSelectedUnit(e.target.value);
      setShowForm(false);
      setEditQ(null);
      if (e.target.value) loadQuestions(e.target.value);
      else setQuestions([]);
    };

    const resetForm = () => {
      setForm({ question:'', options:['','','',''], correctAnswer:0, explanation:'' });
      setEditQ(null);
      setShowForm(false);
    };

    const openEdit = (q) => {
      setEditQ(q);
      const opts = Array.isArray(q.options) ? [...q.options] : ['','','',''];
      while (opts.length < 4) opts.push('');
      setForm({ question: q.question||'', options: opts, correctAnswer: q.correctAnswer||0, explanation: q.explanation||'' });
      setShowForm(true);
    };

    const handleSave = async () => {
      if (!form.question.trim()) { setMsg('❌ Question text is required'); return; }
      setSaving(true); setMsg('');
      try {
        const body = { ...form, unitId: selectedUnit, options: form.options.filter(o => o.trim()) };
        const url  = editQ ? `${API_URL}/admin/questions/${editQ.id}` : `${API_URL}/admin/questions`;
        const res  = await fetch(url, { method: editQ ? 'PUT' : 'POST', headers, body: JSON.stringify(body) });
        const data = await res.json();
        if (data.success) { setMsg('✅ Saved!'); resetForm(); loadQuestions(selectedUnit); }
        else setMsg(`❌ ${data.error}`);
      } catch(e) { setMsg('❌ Error saving'); }
      setSaving(false);
    };

    const handleDelete = async (id) => {
      if (!window.confirm('Delete this question?')) return;
      try {
        const res  = await fetch(`${API_URL}/admin/questions/${id}`, { method:'DELETE', headers });
        const data = await res.json();
        if (data.success) { setMsg('✅ Deleted'); loadQuestions(selectedUnit); }
        else setMsg(`❌ ${data.error}`);
      } catch(e) { setMsg('❌ Error deleting'); }
    };

    return (
      <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'20px' }}>
        {/* Unit selector */}
        <div style={{ background:S.card, borderRadius:'16px', border:`1px solid ${S.border}`, padding:'20px', display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap' }}>
          <div style={{ fontSize:'14px', fontWeight:'700', color:S.text }}>❓ Question Manager</div>
          <select value={selectedUnit} onChange={handleUnitChange} style={{ padding:'10px 16px', borderRadius:'10px', border:`1px solid ${S.border}`, fontSize:'13px', color:S.text, flex:1, minWidth:'200px', outline:'none', background:S.bg }}>
            <option value="">— Select a unit —</option>
            {UNIT_LIST.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
          {selectedUnit && (
            <button onClick={() => { setShowForm(true); setEditQ(null); setForm({ question:'', options:['','','',''], correctAnswer:0, explanation:'' }); }}
              style={{ padding:'10px 20px', borderRadius:'10px', background:`linear-gradient(135deg,${S.green},#0f6e56)`, color:'white', border:'none', fontSize:'13px', fontWeight:'600', cursor:'pointer' }}>
              + Add Question
            </button>
          )}
          {msg && <div style={{ fontSize:'13px', color: msg.startsWith('✅') ? S.green : S.danger, fontWeight:'600' }}>{msg}</div>}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{ background:S.card, borderRadius:'16px', border:`2px solid ${S.blue}`, padding:'24px' }}>
            <div style={{ fontSize:'14px', fontWeight:'700', color:S.text, marginBottom:'16px' }}>
              {editQ ? '✏️ Edit Question' : '➕ New Question'}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ fontSize:'12px', color:S.sub, fontWeight:'600', display:'block', marginBottom:'6px' }}>Question Text *</label>
                <textarea value={form.question} onChange={e => setForm({...form, question:e.target.value})}
                  rows={3} placeholder="Enter the question..."
                  style={{ width:'100%', padding:'10px', borderRadius:'10px', border:`1px solid ${S.border}`, fontSize:'13px', resize:'vertical', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize:'12px', color:S.sub, fontWeight:'600', display:'block', marginBottom:'6px' }}>Answer Options</label>
                {form.options.map((opt, idx) => (
                  <div key={idx} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                    <input type="radio" name="correct" checked={form.correctAnswer === idx} onChange={() => setForm({...form, correctAnswer:idx})} />
                    <input value={opt} onChange={e => { const opts=[...form.options]; opts[idx]=e.target.value; setForm({...form, options:opts}); }}
                      placeholder={`Option ${idx+1}${form.correctAnswer===idx?' (correct)':''}`}
                      style={{ flex:1, padding:'8px 12px', borderRadius:'8px', border:`1px solid ${form.correctAnswer===idx ? S.green : S.border}`, fontSize:'13px', outline:'none' }} />
                  </div>
                ))}
                <div style={{ fontSize:'11px', color:S.sub, marginTop:'4px' }}>Select the radio button next to the correct answer</div>
              </div>
              <div>
                <label style={{ fontSize:'12px', color:S.sub, fontWeight:'600', display:'block', marginBottom:'6px' }}>Explanation (optional)</label>
                <input value={form.explanation} onChange={e => setForm({...form, explanation:e.target.value})}
                  placeholder="Why is this the correct answer?"
                  style={{ width:'100%', padding:'10px', borderRadius:'10px', border:`1px solid ${S.border}`, fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button onClick={handleSave} disabled={saving}
                  style={{ padding:'10px 24px', borderRadius:'10px', background:`linear-gradient(135deg,${S.navyMid},${S.navy})`, color:'white', border:'none', fontSize:'13px', fontWeight:'600', cursor:'pointer', opacity: saving?0.6:1 }}>
                  {saving ? '⌛ Saving...' : '💾 Save Question'}
                </button>
                <button onClick={resetForm}
                  style={{ padding:'10px 20px', borderRadius:'10px', background:S.bg, border:`1px solid ${S.border}`, fontSize:'13px', fontWeight:'600', cursor:'pointer', color:S.text }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions list */}
        {selectedUnit && (
          <div style={{ background:S.card, borderRadius:'16px', border:`1px solid ${S.border}`, overflow:'hidden' }}>
            <div style={{ padding:'16px 20px', borderBottom:`1px solid ${S.border}`, background:S.bg, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:'14px', fontWeight:'700', color:S.text }}>
                {UNIT_LIST.find(u=>u.id===selectedUnit)?.label} — {questions.length} questions
              </div>
            </div>
            {qLoading ? (
              <div style={{ padding:'40px', textAlign:'center', color:S.sub }}>⌛ Loading questions...</div>
            ) : questions.length === 0 ? (
              <div style={{ padding:'40px', textAlign:'center', color:S.sub }}>
                <div style={{ fontSize:'32px', marginBottom:'8px' }}>❓</div>
                <div>No questions yet. Click "+ Add Question" to create one.</div>
              </div>
            ) : questions.map((q, i) => (
              <div key={q.id} style={{ padding:'16px 20px', borderBottom:`1px solid ${S.bg}`, display:'flex', gap:'16px', alignItems:'flex-start' }}>
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:`linear-gradient(135deg,${S.navyMid},${S.navy})`, color:'white', fontSize:'12px', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'13px', fontWeight:'600', color:S.text, marginBottom:'8px' }}>{q.question}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                    {(Array.isArray(q.options)?q.options:[]).map((opt, idx) => (
                      <span key={idx} style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'6px', background: idx===q.correctAnswer ? 'rgba(29,158,117,0.12)' : S.bg, color: idx===q.correctAnswer ? S.green : S.sub, border:`1px solid ${idx===q.correctAnswer ? S.green : S.border}`, fontWeight: idx===q.correctAnswer ? '700' : '400' }}>
                        {idx===q.correctAnswer ? '✓ ' : ''}{opt}
                      </span>
                    ))}
                  </div>
                  {q.explanation && <div style={{ fontSize:'11px', color:S.sub, marginTop:'6px', fontStyle:'italic' }}>💡 {q.explanation}</div>}
                </div>
                <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                  <button onClick={() => openEdit(q)} style={{ padding:'6px 12px', borderRadius:'8px', background:'rgba(24,95,165,0.1)', border:`1px solid ${S.blue}`, color:S.blue, fontSize:'11px', fontWeight:'600', cursor:'pointer' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(q.id)} style={{ padding:'6px 12px', borderRadius:'8px', background:'rgba(220,38,38,0.1)', border:`1px solid ${S.danger}`, color:S.danger, fontSize:'11px', fontWeight:'600', cursor:'pointer' }}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };


  /* ── SETTINGS ── */
  const Settings = () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: S.card, borderRadius: '16px', border: `1px solid ${S.border}`, padding: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: S.text, marginBottom: '16px' }}>⚙️ Platform Configuration</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Platform Name',         value: 'Sudan Quality Platform'                     },
            { label: 'Logged in as',          value: user.email                                   },
            { label: 'Frontend URL',          value: 'decisive-octane-472816-d3.web.app'          },
            { label: 'Backend URL',           value: 'backend-lime-gamma-gf9yal9mmd.vercel.app'  },
            { label: 'Supabase Project',      value: 'xxlxfhlliojkplrcvukc'                      },
            { label: 'Default Pass Threshold', value: '90%'                                       },
            { label: 'adv-iso-17025 Threshold', value: '80% (exception)'                         },
            { label: 'Total Courses',         value: '24 pharmaceutical units'                   },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: S.bg, borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: S.sub, width: '220px', flexShrink: 0 }}>{s.label}</div>
              <div style={{ fontSize: '13px', color: S.navyMid, fontFamily: 'monospace', fontWeight: '500' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: S.card, borderRadius: '16px', border: `1px solid ${S.border}`, padding: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: S.text, marginBottom: '16px' }}>👑 Admin Users</div>
        {ADMIN_EMAILS.map(email => (
          <div key={email} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#eef4ff', borderRadius: '10px', marginBottom: '8px', border: `1px solid ${S.blue}22` }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg,${S.navyMid},${S.blue})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>👑</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: S.text }}>{email}</div>
              <div style={{ fontSize: '11px', color: S.sub }}>Super Administrator</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: '12px', fontSize: '12px', color: S.sub, padding: '12px', background: S.bg, borderRadius: '8px', lineHeight: '1.6' }}>
          To add more admins, update the <code style={{ background: '#e8eaf0', padding: '1px 5px', borderRadius: '4px' }}>ADMIN_EMAILS</code> array in <code style={{ background: '#e8eaf0', padding: '1px 5px', borderRadius: '4px' }}>src/hooks/useAuth.js</code> and <code style={{ background: '#e8eaf0', padding: '1px 5px', borderRadius: '4px' }}>src/pages/AdminDashboard.jsx</code>.
        </div>
      </div>
    </div>
  );

  const SECTIONS = { overview: Overview, users: Users, certificates: Certificates, analytics: Analytics, questions: Questions, settings: Settings };
  const ActiveSection = SECTIONS[activeSection] || Overview;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: 'auto', background: S.bg, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '14px', animation: 'spin 1s linear infinite' }}>⌛</div>
              <div style={{ color: S.sub, fontWeight: '500' }}>Loading admin data...</div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <div style={{ paddingBottom: isMobile ? '72px' : '0' }}><ActiveSection /></div>
          </div>
        )}
      </div>
      {/* Mobile bottom nav */}
      {isMobile && (
        <div style={{
          position:'fixed', bottom:0, left:0, right:0, zIndex:200,
          background:`linear-gradient(135deg,${S.navy},${S.navyMid})`,
          display:'flex', justifyContent:'space-around', alignItems:'center',
          padding:'8px 0', borderTop:`2px solid ${S.gold}`,
          boxShadow:'0 -4px 20px rgba(0,0,0,0.3)',
        }}>
          {NAV_ITEMS.map(item => {
            const active = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => setActiveSection(item.id)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
                background:'none', border:'none', cursor:'pointer', padding:'6px 8px',
                color: active ? S.gold : 'rgba(255,255,255,0.5)',
              }}>
                <span style={{ fontSize:'20px' }}>{item.icon}</span>
                <span style={{ fontSize:'9px', fontWeight: active?'700':'400' }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
