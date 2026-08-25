/**
 * StudentShell.jsx — v2
 * Professional navy/gold sidebar shell.
 * - Academy / Toolkit / Analytics / Certificates all wired to real content
 * - Certificates shown as mini-card grid (not a long list)
 * - Toolkit tools open in full-screen overlay with ← back button
 */

import React, { useState, useEffect } from 'react';
import Dashboard    from './Dashboard';
import Leaderboard  from './Leaderboard';
import ResourcesView from '../components/ResourcesView';
import TemplatesView from '../components/TemplatesView';
import FMEATool     from '../components/FMEATool';
import BatchSignSim from '../components/BatchSignSim';
import StabilityCalculator  from '../components/StabilityCalculator';
import SamplingCalculator   from '../components/SamplingCalculator';
import InspectionChecklist  from '../components/InspectionChecklist';
import pharmaLogo   from '../assets/pharma_logo.png';
import goldSeal     from '../assets/gold_seal.png';
import { QRCodeCanvas } from 'qrcode.react';
import { useLanguage } from '../LanguageContext';
import { useGamification } from '../GamificationContext';
import apiService   from '../services/api';

/* ── design tokens ── */
const S = {
  navy:'#0f2557', navyMid:'#1a3a7a', navyDk:'#0d1f4a',
  gold:'#d4af37', goldLt:'#f0d060',
  green:'#1d9e75', blue:'#185fa5', purple:'#7f77dd',
  bg:'#f0f2f7', card:'white', border:'#e4e8f0',
  text:'#1a2a4a', sub:'#64748b',
};

const UNIT_ICONS = {
  'gmp-intro':'🏭','glp-basics':'🔬','iso-17025':'📊','ich-guidelines':'🌐',
  'validation-qualification':'✅','data-integrity':'🔒','qrm-basics':'⚠️',
  'gdp-basics':'🚚','ich-q10':'🏆','sterile-annex1':'🛡️','gamp5-basics':'💻',
  'batch-records':'📝','nmpb-reg':'🇸🇩','adv-gmp':'🏭','adv-glp':'🔬',
  'adv-iso-17025':'📊','adv-validation':'✅','adv-qrm':'⚠️','adv-gdp':'🚚',
  'cleaning-validation':'🧼','process-validation':'🔄','hold-time-stability':'⏳',
  'method-validation':'🧪','equipment-qualification':'⚙️',
  'capa':'🔧','iso-9001':'📋','qc-lab':'🧫','ipqc':'🏭','capping-lamination':'💊',
};
const UNIT_COLORS = {
  'gmp-intro':'#10b981','glp-basics':'#3b82f6','iso-17025':'#f59e0b',
  'ich-guidelines':'#ef4444','validation-qualification':'#06b6d4',
  'data-integrity':'#8b5cf6','qrm-basics':'#ec4899','gdp-basics':'#f97316',
  'ich-q10':'#0891b2','sterile-annex1':'#64748b','gamp5-basics':'#4a5568',
  'batch-records':'#4c51bf','nmpb-reg':'#059669','adv-gmp':'#059669',
  'adv-glp':'#2563eb','adv-iso-17025':'#d97706','adv-validation':'#0891b2',
  'adv-qrm':'#db2777','adv-gdp':'#ea580c','cleaning-validation':'#17a2b8',
  'process-validation':'#10b981','hold-time-stability':'#f59e0b',
  'method-validation':'#3b82f6','equipment-qualification':'#8b5cf6',
  'capa':'#e11d48','iso-9001':'#0ea5e9','qc-lab':'#10b981','ipqc':'#f59e0b','capping-lamination':'#7c3aed',
};
const UNIT_NAMES = {
  'gmp-intro':'GMP Basics','glp-basics':'GLP Basics','iso-17025':'ISO 17025',
  'ich-guidelines':'ICH Guidelines','validation-qualification':'Validation & Qualification',
  'data-integrity':'Data Integrity','qrm-basics':'QRM Basics','gdp-basics':'GDP Basics',
  'ich-q10':'ICH Q10','sterile-annex1':'Sterile Manufacturing','gamp5-basics':'GAMP5 Basics',
  'batch-records':'Batch Records','nmpb-reg':'NMPB Regulatory','adv-gmp':'Advanced GMP',
  'adv-glp':'Advanced GLP','adv-iso-17025':'Advanced ISO 17025','adv-validation':'Advanced Validation',
  'adv-qrm':'Advanced QRM','adv-gdp':'Advanced GDP','cleaning-validation':'Cleaning Validation',
  'process-validation':'Process Validation','hold-time-stability':'Hold Time Stability',
  'method-validation':'Method Validation','equipment-qualification':'Equipment Qualification',
  'capa':'CAPA Management','iso-9001':'ISO 9001 QMS','qc-lab':'QC Laboratory','ipqc':'IPQC','capping-lamination':'Capping & Lamination',
};

const TOOLS = [
  { id:'fmea',      label:'FMEA Tool',              labelAr:'أداة FMEA',            icon:'⚠️',  desc:'Failure Mode & Effects Analysis',       descAr:'تحليل أوضاع الفشل وتأثيراتها',    color:'#ef4444', component: FMEATool },
  { id:'batch',     label:'Batch Sign Simulator',   labelAr:'محاكاة توقيع الدفعة', icon:'📝',  desc:'Simulate batch record signatures',       descAr:'محاكاة توقيع سجلات التشغيل',      color:'#4c51bf', component: BatchSignSim },
  { id:'stability', label:'Stability Calculator',   labelAr:'حاسبة الثبات',        icon:'⏳',  desc:'Calculate product stability data',       descAr:'حساب بيانات ثبات المنتج',          color:'#f59e0b', component: StabilityCalculator },
  { id:'sampling',  label:'Sampling Calculator',    labelAr:'حاسبة أخذ العينات',   icon:'🧪',  desc:'AQL-based sampling plan calculator',     descAr:'حاسبة خطة أخذ العينات AQL',       color:'#3b82f6', component: SamplingCalculator },
  { id:'checklist', label:'Inspection Checklist',   labelAr:'قائمة التفتيش',       icon:'✅',  desc:'GMP inspection readiness checklist',     descAr:'قائمة تحقق جاهزية التفتيش GMP',   color:'#1d9e75', component: InspectionChecklist },
];

const NAV = [
  { id:'academy',     icon:'🎓', label:'Academy',      labelAr:'الأكاديمية'  },
  { id:'resources',   icon:'📚', label:'Resources',    labelAr:'المصادر والمراجع' },
  { id:'templates',   icon:'📋', label:'Templates',    labelAr:'القوالب النمطية' },
  { id:'analytics',   icon:'📊', label:'Analytics',    labelAr:'تقدمي'       },
  { id:'certificates',icon:'📜', label:'Certificates', labelAr:'شهاداتي'     },
  { id:'leaderboard', icon:'🏆', label:'Leaderboard',  labelAr:'المتصدرون'   },
  { id:'toolkit',     icon:'🛠️', label:'Toolkit',      labelAr:'الأدوات'     },
];

/* ══════════════════════════════════════════════
   FULL-SCREEN OVERLAY WRAPPER
   shown when a tool is opened from toolkit
══════════════════════════════════════════════ */
const FullScreenOverlay = ({ title, titleAr, icon, onBack, isRtl, children }) => (
  <div style={{
    position:'fixed', inset:0, zIndex:2000, background:S.bg,
    display:'flex', flexDirection:'column', fontFamily:"'Inter','Segoe UI',sans-serif",
    direction: isRtl ? 'rtl' : 'ltr',
  }}>
    {/* Overlay top bar */}
    <div style={{
      padding:'0 24px', height:'56px', background:S.card,
      borderBottom:`1px solid ${S.border}`, display:'flex',
      alignItems:'center', gap:'16px', flexShrink:0,
      boxShadow:'0 2px 8px rgba(0,0,0,0.07)'
    }}>
      <button onClick={onBack} style={{
        display:'flex', alignItems:'center', gap:'8px',
        padding:'8px 16px', borderRadius:'10px',
        background:`linear-gradient(135deg,${S.navy},${S.navyMid})`,
        color:'white', border:'none', cursor:'pointer',
        fontSize:'13px', fontWeight:'600', flexShrink:0,
      }}>
        {isRtl ? '→' : '←'} {isRtl ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
      </button>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <span style={{ fontSize:'22px' }}>{icon}</span>
        <div>
          <div style={{ fontSize:'15px', fontWeight:'700', color:S.text }}>
            {isRtl ? titleAr : title}
          </div>
          <div style={{ fontSize:'11px', color:S.sub }}>Sudan Quality Platform — Toolkit</div>
        </div>
      </div>
    </div>
    {/* Tool content */}
    <div style={{ flex:1, overflow:'auto', padding:'24px' }}>
      {children}
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   CERTIFICATES GRID VIEW
══════════════════════════════════════════════ */
const CertificatesView = ({ user, authToken, isRtl, onViewCert }) => {
  const [certs, setCerts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    apiService.getUserCertificates(user.uid, authToken)
      .then(data => {
        const arr = Array.isArray(data) ? data : (data?.certificates || []);
        alert('Certs loaded: ' + arr.length + ' | ' + JSON.stringify(data).substring(0,100));
        setCerts(arr);
      })
      .catch(err => {
        alert('Certs ERROR: ' + err.message);
        console.error('Certs fetch error', err);
      })
      .finally(() => setLoading(false));
  }, [user?.uid]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'300px' }}>
      <div style={{ textAlign:'center', color:S.sub }}>
        <div style={{ fontSize:'36px', marginBottom:'12px' }}>⌛</div>
        <div>{isRtl ? 'جاري تحميل الشهادات...' : 'Loading certificates...'}</div>
      </div>
    </div>
  );

  if (certs.length === 0) return (
    <div style={{ textAlign:'center', padding:'80px 40px' }}>
      <div style={{ fontSize:'64px', marginBottom:'16px' }}>🎓</div>
      <div style={{ fontSize:'18px', fontWeight:'700', color:S.text, marginBottom:'10px' }}>
        {isRtl ? 'لا توجد شهادات بعد' : 'No certificates yet'}
      </div>
      <div style={{ fontSize:'14px', color:S.sub }}>
        {isRtl ? 'أكمل الكورسات بنسبة 80%+ لتحصل على شهاداتك' : 'Complete courses with 80%+ score to earn certificates'}
      </div>
    </div>
  );

  return (
    <div style={{ padding:'28px' }}>
      {/* Header */}
      <div style={{ marginBottom:'24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <div style={{ fontSize:'20px', fontWeight:'800', color:S.text }}>
            {isRtl ? '🏅 شهاداتك المكتسبة' : '🏅 Your Earned Certificates'}
          </div>
          <div style={{ fontSize:'13px', color:S.sub, marginTop:'4px' }}>
            {certs.length} {isRtl ? 'شهادة مكتسبة' : 'certificates earned'}
          </div>
        </div>
        <div style={{ padding:'10px 20px', borderRadius:'12px', background:`linear-gradient(135deg,${S.gold},${S.goldLt})`, color:S.navy, fontWeight:'700', fontSize:'14px' }}>
          ⭐ {Math.round((certs.length / 24) * 100)}% {isRtl ? 'مكتمل' : 'Complete'}
        </div>
      </div>

      {/* Certificate Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px' }}>
        {certs.map((cert, i) => {
          const unitId   = cert.unitId || '';
          const unitName = cert.unitName || UNIT_NAMES[unitId] || 'Certificate';
          const icon     = UNIT_ICONS[unitId]  || '🎓';
          const color    = UNIT_COLORS[unitId] || S.blue;
          const score    = cert.score || cert.percentage || 0;
          const date     = cert.issueDate
            ? new Date(cert.issueDate?.toDate?.() || cert.issueDate).toLocaleDateString('en-GB')
            : '—';

          return (
            <div key={cert.id || cert.verificationId || i}
              onClick={() => onViewCert && onViewCert(cert)}
              style={{
                background:S.card, borderRadius:'16px', overflow:'hidden',
                border:`1px solid ${S.border}`, cursor:'pointer',
                boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
                transition:'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 28px rgba(0,0,0,0.12)`; }}
              onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)'; }}
            >
              {/* Mini certificate header strip */}
              <div style={{
                height:'80px', background:`linear-gradient(135deg, ${S.navy}, ${S.navyMid})`,
                display:'flex', alignItems:'center', justifyContent:'center',
                position:'relative', overflow:'hidden',
              }}>
                {/* gold border decoration */}
                <div style={{ position:'absolute', inset:'6px', border:`2px solid rgba(212,175,55,0.35)`, borderRadius:'8px', pointerEvents:'none' }} />
                <div style={{ fontSize:'36px', position:'relative', zIndex:1 }}>{icon}</div>
                {/* score badge */}
                {score > 0 && (
                  <div style={{
                    position:'absolute', top:'8px', right:'8px',
                    background: score >= 80 ? S.green : '#f59e0b',
                    color:'white', fontSize:'10px', fontWeight:'700',
                    padding:'3px 8px', borderRadius:'10px',
                  }}>
                    {score}%
                  </div>
                )}
              </div>

              {/* Card body */}
              <div style={{ padding:'14px' }}>
                <div style={{ fontSize:'13px', fontWeight:'700', color:S.text, marginBottom:'6px', lineHeight:'1.3' }}>
                  {unitName}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'10px' }}>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:color, flexShrink:0 }} />
                  <span style={{ fontSize:'11px', color:S.sub }}>{date}</span>
                </div>
                {/* Verification ID */}
                {(cert.verificationId || cert.certNumber) && (
                  <div style={{ fontSize:'9px', color:S.sub, fontFamily:'monospace', background:S.bg, padding:'4px 8px', borderRadius:'6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {(cert.verificationId || cert.certNumber)?.substring(0, 20)}...
                  </div>
                )}
                {/* View button */}
                <button style={{
                  width:'100%', marginTop:'10px', padding:'7px',
                  background:`linear-gradient(135deg,${S.navy},${S.navyMid})`,
                  color:'white', border:'none', borderRadius:'8px',
                  fontSize:'11px', fontWeight:'600', cursor:'pointer',
                }}>
                  {isRtl ? '👁️ عرض الشهادة' : '👁️ View Certificate'}
                </button>
              </div>
            </div>
          );
        })}

        {/* Locked placeholders for remaining courses */}
        {Array.from({ length: Math.max(0, 24 - certs.length) }).slice(0, 8).map((_, i) => (
          <div key={`locked-${i}`} style={{
            background:S.bg, borderRadius:'16px', border:`1px dashed ${S.border}`,
            overflow:'hidden', opacity:0.5,
          }}>
            <div style={{ height:'80px', background:'#e8eaf0', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:'30px' }}>🔒</span>
            </div>
            <div style={{ padding:'14px' }}>
              <div style={{ height:'12px', background:'#d0d5e0', borderRadius:'6px', marginBottom:'8px' }} />
              <div style={{ height:'10px', background:'#d0d5e0', borderRadius:'6px', width:'60%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ANALYTICS VIEW  (progress bars, stats)
══════════════════════════════════════════════ */
const AnalyticsView = ({ user, isRtl }) => {
  const allUnits = Object.keys(UNIT_NAMES);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sqp_progress_${user.email}`);
      if (saved) setProgress(JSON.parse(saved));
    } catch(e){}
  }, [user.email]);

  const passed  = allUnits.filter(id => (progress[id]||0) >= 80).length;
  const avg     = allUnits.length
    ? Math.round(allUnits.reduce((a,id) => a+(progress[id]||0), 0) / allUnits.length)
    : 0;

  return (
    <div style={{ padding:'28px' }}>
      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'16px', marginBottom:'28px' }}>
        {[
          { label: isRtl?'وحدات مكتملة':'Units Completed', value:passed,     icon:'✅', color:S.green  },
          { label: isRtl?'متوسط الدرجات':'Average Score',   value:`${avg}%`, icon:'📊', color:S.blue   },
          { label: isRtl?'ساعات الدراسة':'Study Hours',     value:`${passed*2}h`, icon:'⏱️', color:S.purple },
          { label: isRtl?'نسبة الإتمام':'Completion',       value:`${Math.round(passed/allUnits.length*100)}%`, icon:'🎯', color:S.gold },
        ].map(s => (
          <div key={s.label} style={{ background:S.card, borderRadius:'16px', border:`1px solid ${S.border}`, padding:'20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize:'28px', marginBottom:'8px' }}>{s.icon}</div>
            <div style={{ fontSize:'26px', fontWeight:'800', color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:'11px', color:S.sub, marginTop:'6px', fontWeight:'500' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div style={{ background:S.card, borderRadius:'16px', border:`1px solid ${S.border}`, padding:'24px' }}>
        <div style={{ fontSize:'14px', fontWeight:'700', color:S.text, marginBottom:'20px' }}>
          📈 {isRtl ? 'الأداء لكل وحدة' : 'Performance by Unit'}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {allUnits.map(id => {
            const score    = progress[id] || 0;
            const isPassed = score >= (id==='adv-iso-17025' ? 80 : 90);
            return (
              <div key={id}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px', alignItems:'center' }}>
                  <span style={{ fontSize:'12px', fontWeight:'600', color:S.text, display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'15px' }}>{UNIT_ICONS[id]||'📄'}</span>
                    {UNIT_NAMES[id]}
                  </span>
                  <span style={{
                    fontSize:'11px', fontWeight:'700', padding:'3px 10px', borderRadius:'10px',
                    background: isPassed ? 'rgba(29,158,117,0.1)' : score>0 ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)',
                    color: isPassed ? S.green : score>0 ? '#ba7517' : S.sub,
                  }}>
                    {score > 0 ? `${score}%` : (isRtl?'لم يبدأ':'Not Started')}
                  </span>
                </div>
                <div style={{ height:'8px', background:S.bg, borderRadius:'6px', overflow:'hidden' }}>
                  <div style={{
                    height:'8px', borderRadius:'6px', width:`${score}%`,
                    background: isPassed
                      ? `linear-gradient(90deg,${S.green},#5dcaa5)`
                      : score>0 ? `linear-gradient(90deg,#f59e0b,#fbbf24)` : 'transparent',
                    transition:'width 0.8s ease',
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   TOOLKIT GRID
══════════════════════════════════════════════ */
const ToolkitGrid = ({ isRtl, onOpen }) => (
  <div style={{ padding:'28px' }}>
    <div style={{ marginBottom:'24px' }}>
      <div style={{ fontSize:'20px', fontWeight:'800', color:S.text }}>
        🛠️ {isRtl ? 'أدوات الجودة الدوائية' : 'Pharmaceutical Quality Toolkit'}
      </div>
      <div style={{ fontSize:'13px', color:S.sub, marginTop:'4px' }}>
        {isRtl ? 'انقر على أي أداة لفتحها في نافذة كاملة' : 'Click any tool to open it in full screen'}
      </div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'20px' }}>
      {TOOLS.map(tool => (
        <div key={tool.id} onClick={() => onOpen(tool)}
          style={{
            background:S.card, borderRadius:'18px', padding:'28px 22px',
            border:`1px solid ${S.border}`, cursor:'pointer',
            boxShadow:'0 2px 8px rgba(0,0,0,0.05)', transition:'all 0.22s',
            display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
          }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow=`0 14px 32px rgba(0,0,0,0.12)`; e.currentTarget.style.borderColor=tool.color; }}
          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor=S.border; }}
        >
          <div style={{
            width:'64px', height:'64px', borderRadius:'18px', marginBottom:'16px',
            background:`${tool.color}18`, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'32px', border:`2px solid ${tool.color}33`,
          }}>
            {tool.icon}
          </div>
          <div style={{ fontSize:'15px', fontWeight:'700', color:S.text, marginBottom:'8px' }}>
            {isRtl ? tool.labelAr : tool.label}
          </div>
          <div style={{ fontSize:'12px', color:S.sub, lineHeight:'1.5', marginBottom:'18px' }}>
            {isRtl ? tool.descAr : tool.desc}
          </div>
          <div style={{
            padding:'9px 22px', borderRadius:'10px', fontSize:'12px', fontWeight:'600',
            background:`linear-gradient(135deg,${tool.color},${tool.color}cc)`,
            color:'white', width:'100%',
          }}>
            {isRtl ? '▶ فتح الأداة' : '▶ Open Tool'}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   MAIN SHELL
══════════════════════════════════════════════ */
export default function StudentShell({ user, onLogout, authToken, onSwitchView, isAdmin }) {
  const { language, toggleLanguage, theme, toggleTheme } = useLanguage();
  const { xp, level, getXpToNextLevel } = useGamification();
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activePage, setActivePage]     = useState('academy');
  const [openTool, setOpenTool]         = useState(null);
  const [certToOpen, setCertToOpen] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;
  const isRtl = language === 'ar';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If a tool is open, show full-screen overlay
  if (openTool) {
    const ToolComponent = openTool.component;
    return (
      <FullScreenOverlay
        title={openTool.label}
        titleAr={openTool.labelAr}
        icon={openTool.icon}
        isRtl={isRtl}
        onBack={() => setOpenTool(null)}
      >
        <ToolComponent />
      </FullScreenOverlay>
    );
  }

  /* ── sidebar ── */
  const Sidebar = () => (
    <div
      className={`sidebar${mobileSidebarOpen ? ' mobile-open' : ''}`}
      style={{
        width: sidebarOpen ? '230px' : '62px',
        background:`linear-gradient(180deg,${S.navy} 0%,${S.navyMid} 55%,${S.navyDk} 100%)`,
        display: isMobile ? 'none' : 'flex', flexDirection:'column', flexShrink:0,
        transition:'width 0.22s ease, transform 0.3s ease', overflow:'hidden',
        boxShadow: isRtl ? '-4px 0 20px rgba(0,0,0,0.18)' : '4px 0 20px rgba(0,0,0,0.18)',
        zIndex:10,
      }}>
      {/* Logo */}
      <div style={{ padding:'18px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:'12px', justifyContent: sidebarOpen?'flex-start':'center' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'10px', overflow:'hidden', flexShrink:0, background:'white', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 0 2px ${S.gold}` }}>
          <img src={pharmaLogo} alt="logo" style={{ width:'36px', height:'36px', objectFit:'contain' }}/>
        </div>
        {sidebarOpen && (
          <div style={{ overflow:'hidden' }}>
            <div style={{ fontSize:'13px', fontWeight:'700', color:'white', whiteSpace:'nowrap' }}>
              {isRtl ? 'منصة السودان للجودة' : 'Sudan Quality'}
            </div>
            <div style={{ fontSize:'10px', color:S.gold, fontWeight:'600', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>
              {isRtl ? 'بوابة المتدرب' : 'LEARNER PORTAL'}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding:'10px 8px', flex:1 }}>
        {sidebarOpen && (
          <div style={{ fontSize:'9px', color:'rgba(255,255,255,0.3)', padding:'8px 10px 6px', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:'700' }}>
            {isRtl ? 'التنقل' : 'Navigation'}
          </div>
        )}
        {NAV.map(item => {
          const active = activePage === item.id;
          return (
            <div key={item.id} onClick={() => { setActivePage(item.id); setMobileSidebarOpen(false); }} style={{
              display:'flex', alignItems:'center', gap:'10px',
              padding: sidebarOpen ? '11px 12px' : '11px',
              borderRadius:'10px', marginBottom:'4px',
              color: active ? S.gold : 'rgba(255,255,255,0.55)',
              background: active ? 'rgba(212,175,55,0.13)' : 'transparent',
              borderLeft:  (!isRtl && active) ? `3px solid ${S.gold}` : '3px solid transparent',
              borderRight: ( isRtl && active) ? `3px solid ${S.gold}` : '3px solid transparent',
              cursor:'pointer', justifyContent: sidebarOpen ? 'flex-start' : 'center',
              transition:'all 0.15s',
            }}
              onMouseOver={e => { if(!active) e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
              onMouseOut={e => { if(!active) e.currentTarget.style.background='transparent'; }}
            >
              <span style={{ fontSize:'17px', flexShrink:0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize:'13px', fontWeight: active?'600':'400' }}>{isRtl ? item.labelAr : item.label}</span>}
            </div>
          );
        })}
      </nav>

      {/* XP bar */}
      {sidebarOpen && (
        <div style={{ margin:'0 10px 12px', padding:'14px', background:'rgba(255,255,255,0.05)', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', fontWeight:'600' }}>
              {isRtl ? `المستوى ${level}` : `Level ${level}`}
            </span>
            <span style={{ fontSize:'11px', color:S.gold, fontWeight:'700' }}>{xp} XP</span>
          </div>
          <div style={{ height:'6px', background:'rgba(255,255,255,0.1)', borderRadius:'4px', overflow:'hidden' }}>
            <div style={{ height:'6px', width:`${getXpToNextLevel().percentage}%`, background:`linear-gradient(90deg,${S.gold},${S.goldLt})`, borderRadius:'4px', transition:'width 0.5s' }}/>
          </div>
        </div>
      )}

      {/* User footer */}
      <div style={{ padding:'14px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', justifyContent: sidebarOpen?'flex-start':'center' }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" style={{ width:'34px', height:'34px', borderRadius:'50%', flexShrink:0, border:`2px solid ${S.gold}` }}/>
          ) : (
            <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:`linear-gradient(135deg,${S.gold},${S.goldLt})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', color:S.navy, flexShrink:0 }}>
              {user.displayName?.[0] || 'S'}
            </div>
          )}
          {sidebarOpen && (
            <>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'12px', fontWeight:'600', color:'white', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user.displayName || user.email?.split('@')[0]}
                </div>
                <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)' }}>{isRtl?'متدرب':'Student'}</div>
              </div>
              <button onClick={onLogout} title="Logout" style={{ background:'rgba(220,38,38,0.15)', border:'1px solid rgba(220,38,38,0.25)', borderRadius:'8px', padding:'6px 8px', cursor:'pointer', color:'#f87171', fontSize:'12px', flexShrink:0 }}>
                🚪
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  /* ── top bar (desktop only) ── */
  const TopBar = () => (
    <div style={{ padding:'0 20px', height:'52px', background:S.card, borderBottom:`1px solid ${S.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 1px 6px rgba(0,0,0,0.05)', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
        {/* Desktop collapse */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:S.bg, border:`1px solid ${S.border}`, borderRadius:'8px', padding:'6px 10px', fontSize:'15px', cursor:'pointer', color:S.sub }}>☰</button>
        <div style={{ fontSize:'14px', fontWeight:'700', color:S.text }}>
          {isRtl ? NAV.find(n=>n.id===activePage)?.labelAr : NAV.find(n=>n.id===activePage)?.label}
        </div>
      </div>
      <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
        <button onClick={toggleTheme} style={{ background:S.bg, border:`1px solid ${S.border}`, borderRadius:'8px', padding:'6px 10px', cursor:'pointer', fontSize:'14px' }}>
          {theme==='dark'?'☀️':'🌙'}
        </button>
        {isAdmin && onSwitchView && (
          <button onClick={onSwitchView} style={{ background:`linear-gradient(135deg,#1a3a7a,#0f2557)`, border:'none', color:'white', borderRadius:'8px', padding:'6px 14px', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>
            ⚙️ Admin
          </button>
        )}
        <button onClick={toggleLanguage} style={{ background:S.navyMid, border:'none', color:'white', borderRadius:'8px', padding:'6px 14px', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>
          {language==='ar'?'EN':'AR'}
        </button>
      </div>
    </div>
  );

  /* ── mobile wallet bar (replaces sidebar wallet on mobile) ── */
  const MobileWalletBar = () => (
    <div style={{
      background:`linear-gradient(135deg,${S.navy},${S.navyMid})`,
      padding:'12px 16px', flexShrink:0,
      borderBottom:`2px solid ${S.gold}`,
      boxShadow:'0 2px 12px rgba(0,0,0,0.2)',
    }}>
      {/* Row 1: Avatar + Name + Controls */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" style={{ width:'36px', height:'36px', borderRadius:'50%', border:`2px solid ${S.gold}`, flexShrink:0 }}/>
          ) : (
            <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`linear-gradient(135deg,${S.gold},${S.goldLt})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'700', color:S.navy, flexShrink:0 }}>
              {user.displayName?.[0] || 'S'}
            </div>
          )}
          <div>
            <div style={{ fontSize:'13px', fontWeight:'700', color:'white', lineHeight:1.2 }}>
              {user.displayName || user.email?.split('@')[0]}
            </div>
            <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.5)', marginTop:'1px' }}>
              {isRtl ? `المستوى ${level}` : `Level ${level}`}
            </div>
          </div>
        </div>
        {/* Controls */}
        <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
          <button onClick={toggleTheme} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'8px', padding:'5px 9px', cursor:'pointer', fontSize:'13px', color:'white' }}>
            {theme==='dark'?'☀️':'🌙'}
          </button>
          <button onClick={toggleLanguage} style={{ background:'rgba(212,175,55,0.2)', border:`1px solid ${S.gold}`, color:S.gold, borderRadius:'8px', padding:'5px 10px', cursor:'pointer', fontSize:'11px', fontWeight:'700' }}>
            {language==='ar'?'EN':'AR'}
          </button>
          {isAdmin && onSwitchView && (
            <button onClick={onSwitchView} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', color:'white', borderRadius:'8px', padding:'5px 9px', cursor:'pointer', fontSize:'11px', fontWeight:'600' }}>
              ⚙️
            </button>
          )}
          <button onClick={onLogout} title="Logout" style={{ background:'rgba(220,38,38,0.2)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:'8px', padding:'5px 9px', cursor:'pointer', color:'#f87171', fontSize:'13px' }}>
            🚶
          </button>
        </div>
      </div>
      {/* Row 2: XP bar */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
          <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.5)', fontWeight:'600' }}>
            {isRtl ? `نقاط للمستوى التالي` : `XP to next level`}
          </span>
          <span style={{ fontSize:'10px', color:S.gold, fontWeight:'700' }}>{xp} XP</span>
        </div>
        <div style={{ height:'5px', background:'rgba(255,255,255,0.1)', borderRadius:'4px', overflow:'hidden' }}>
          <div style={{ height:'5px', width:`${getXpToNextLevel().percentage}%`, background:`linear-gradient(90deg,${S.gold},${S.goldLt})`, borderRadius:'4px', transition:'width 0.5s' }}/>
        </div>
      </div>
    </div>
  );


  /* ── render active page ── */
  const renderContent = () => {
    switch(activePage) {
      case 'academy':
        // Pass activeTab='academy' so Dashboard shows academy view
        return <Dashboard user={user} onLogout={onLogout} authToken={authToken} activeTab="academy" certToOpen={certToOpen} onCertClosed={() => setCertToOpen(null)} />;
      case 'resources':
        return <ResourcesView />;
      case 'templates':
        return <TemplatesView />;
      case 'toolkit':
        return <ToolkitGrid isRtl={isRtl} onOpen={setOpenTool} />;
      case 'analytics':
        return <AnalyticsView user={user} authToken={authToken} isRtl={isRtl} />;
      case 'leaderboard':
        return <Leaderboard user={user} isRtl={isRtl} />;
      case 'certificates':
        return <CertificatesView user={user} authToken={authToken} isRtl={isRtl} onViewCert={(cert) => { setCertToOpen(cert); setActivePage('academy'); }} />;
      default:
        return <Dashboard user={user} onLogout={onLogout} authToken={authToken} activeTab="academy" certToOpen={certToOpen} onCertClosed={() => setCertToOpen(null)} />;
    }
  };



  /* ── mobile bottom nav ── */
  const MobileBottomNav = () => (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:200,
      background:`linear-gradient(135deg,${S.navy},${S.navyMid})`,
      display:'flex', justifyContent:'space-around', alignItems:'center',
      padding:'8px 0 10px', borderTop:`2px solid ${S.gold}`,
      boxShadow:'0 -4px 20px rgba(0,0,0,0.3)',
    }}>
      {NAV.map(item => {
        const active = activePage === item.id;
        return (
          <button key={item.id} onClick={() => setActivePage(item.id)} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
            background:'none', border:'none', cursor:'pointer', padding:'4px 6px',
            color: active ? S.gold : 'rgba(255,255,255,0.5)',
            minWidth:'40px',
          }}>
            <span style={{ fontSize:'19px' }}>{item.icon}</span>
            <span style={{ fontSize:'9px', fontWeight: active ? '700' : '400', whiteSpace:'nowrap' }}>
              {isRtl ? item.labelAr : item.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'Inter','Segoe UI',sans-serif", direction: isRtl?'rtl':'ltr' }}>
      <Sidebar />
      <div style={{ flex:1, overflow:'auto', background:S.bg, display:'flex', flexDirection:'column' }}>
        {/* Desktop: show normal TopBar. Mobile: show wallet bar instead */}
        {isMobile ? <MobileWalletBar /> : <TopBar />}
        <div style={{ flex:1, overflow:'auto', paddingBottom: isMobile ? '72px' : '0' }}>
          {renderContent()}
        </div>
      </div>
    </div>
    {/* Mobile bottom nav */}
    {isMobile && <MobileBottomNav />}
    </>
  );
}
