import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { TEMPLATE_CONTENTS } from '../data/templateContents';
import { REGULATORY_RESOURCES } from '../data/resourcesAndTemplates';

const S = {
  navy: '#0f2557',
  navyDk: '#0d1f4a',
  navyMid: '#1a3a7a',
  teal: '#00d4aa',
  tealDk: '#00b892',
  gold: '#d4af37',
  bg: '#f0f2f7',
  card: '#0d1f38',
  border: 'rgba(0, 212, 170, 0.2)',
  text: '#1a2a4a',
  sub: '#64748b',
};

const GMP_TEMPLATES = [
  { id: 'capa', key: 'capa', icon: '🔧', color: '#e11d48',
    title: 'CAPA Template', titleAr: 'قالب CAPA — الإجراءات التصحيحية والوقائية',
    description: 'Complete CAPA investigation and root cause analysis template.',
    descriptionAr: 'قالب شامل للتحقيق وتحليل السبب الجذري وفق ICH Q10 و FDA CAPA Guidelines.' },
  { id: 'bmr_bpr', key: 'bmr_bpr', icon: '📋', color: '#0ea5e9',
    title: 'BMR/BPR Template', titleAr: 'قالب سجل دفعة التصنيع/الإنتاج',
    description: 'Batch Manufacturing Record and Batch Production Record template.',
    descriptionAr: 'قالب سجل دفعة التصنيع والإنتاج — موثق وفق GMP.' },
  { id: 'iq_oq_pq', key: 'iq_oq_pq', icon: '✅', color: '#10b981',
    title: 'IQ/OQ/PQ Template', titleAr: 'قالب التأهيل IQ/OQ/PQ',
    description: 'Installation, Operational and Performance Qualification template.',
    descriptionAr: 'قالب تأهيل التركيب والتشغيل والأداء للمعدات والأنظمة.' },
  { id: 'oot_oos', key: 'oot_oos', icon: '⚠️', color: '#f59e0b',
    title: 'OOS/OOT Template', titleAr: 'قالب نتائج OOS/OOT',
    description: 'Out of Specification and Out of Trend investigation template.',
    descriptionAr: 'قالب التحقيق في النتائج خارج المواصفات وخارج الاتجاه.' },
  { id: 'internal_audit', key: 'internal_audit', icon: '🔍', color: '#8b5cf6',
    title: 'Internal Audit Template', titleAr: 'قالب التدقيق الداخلي',
    description: 'GMP internal audit checklist and findings report template.',
    descriptionAr: 'قائمة مراجعة التدقيق الداخلي وقالب تقرير النتائج وفق GMP.' },
  { id: 'quality_policy', key: 'quality_policy', icon: '🏆', color: '#06b6d4',
    title: 'Quality Policy Template', titleAr: 'قالب سياسة الجودة',
    description: 'Pharmaceutical quality policy document template.',
    descriptionAr: 'قالب وثيقة سياسة الجودة الصيدلانية وفق ISO 9001 و GMP.' },
];

function downloadTemplate(key, titleEn) {
  const mdContent = TEMPLATE_CONTENTS[key];
  if (!mdContent) return;

  const htmlContent = mdContent
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$2</h2>'.replace('$2','$1'))
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- \[ \] (.+)$/gm, '<div class="cb">☐ $1</div>')
    .replace(/^- (.+)$/gm, '<div class="li">• $1</div>')
    .replace(/^([^<\n].+)$/gm, '<p>$1</p>');

  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:794px;padding:40px;background:white;font-family:Cairo,Arial,sans-serif;font-size:13px;line-height:1.7;color:#1a2a4a;direction:rtl;text-align:right;';
  div.innerHTML = `<style>h1{color:#0f2557;font-size:20px;border-bottom:3px solid #00d4aa;padding-bottom:8px;margin-bottom:16px}h2{color:#00b892;font-size:15px;margin:16px 0 8px}h3{color:#1a3a7a;font-size:13px;margin:12px 0 6px}hr{border:none;border-top:1px solid #ddd;margin:12px 0}p{margin:4px 0}.cb,.li{margin:2px 0;padding-right:8px}strong{font-weight:700}.footer{margin-top:30px;padding-top:10px;border-top:1px solid #ddd;font-size:10px;color:#888;display:flex;justify-content:space-between}</style><div style="background:linear-gradient(135deg,#0f2557,#1a3a7a);color:white;padding:20px 24px;border-radius:8px;margin-bottom:24px"><div style="font-size:18px;font-weight:700">${titleEn}</div><div style="font-size:11px;margin-top:4px;opacity:0.8">منصة السودان للجودة — Sudan Quality Platform</div></div>${htmlContent}<div class="footer"><span>Sudan Quality Platform — منصة السودان للجودة</span><span>GMP Template</span></div>`;
  document.body.appendChild(div);

  Promise.all([import('html2canvas'), import('jspdf')]).then(([h2c, { jsPDF }]) => {
    h2c.default(div, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgData = canvas.toDataURL('image/png');
      const imgH = (canvas.height * pdfW) / canvas.width;
      let heightLeft = imgH;
      let pos = 0;
      pdf.addImage(imgData, 'PNG', 0, pos, pdfW, imgH);
      heightLeft -= pdfH;
      while (heightLeft > 0) {
        pos -= pdfH;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, pos, pdfW, imgH);
        heightLeft -= pdfH;
      }
      pdf.save(`${key}-template.pdf`);
      document.body.removeChild(div);
    });
  });
}


export default function ResourcesView() {
  const { lang, isRtl } = useLanguage();
  const [selectedAgency, setSelectedAgency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const agencies = ['ALL', 'FDA', 'WHO', 'ICH', 'ISO', 'EMA', 'Videos', 'Templates'];

  const filteredResources = REGULATORY_RESOURCES.filter((res) => {
    const matchesAgency = selectedAgency === 'ALL' || res.agency === selectedAgency;
    const query = searchQuery.toLowerCase().trim();
    const title = (lang === 'ar' ? res.titleAr : res.title).toLowerCase();
    const desc = (lang === 'ar' ? res.descriptionAr : res.description).toLowerCase();
    const badge = res.badge.toLowerCase();
    const matchesSearch = !query || title.includes(query) || desc.includes(query) || badge.includes(query);
    return matchesAgency && matchesSearch;
  });

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Cairo', 'Inter', sans-serif",
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${S.navyDk}, ${S.navyMid})`,
          borderRadius: '16px',
          padding: '32px 24px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(15, 37, 87, 0.2)',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '32px' }}>📚</span>
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, color: 'white' }}>
              {isRtl ? 'المصادر الرسمية والمراجع التنظيمية' : 'Official Regulatory & Guidance Resources'}
            </h1>
          </div>
          <p style={{ color: '#8ba3c4', fontSize: '14px', maxWidth: '750px', margin: 0, lineHeight: 1.6 }}>
            {isRtl
              ? 'دليل مرجعي شامل للتشريعات والإرشادات الرسمية الصادرة من المنظمات والهيئات التنظيمية العالمية (FDA, WHO, ICH, ISO, EMA).'
              : 'Comprehensive database of official guidelines, standards, and training webinars from global regulatory bodies.'}
          </p>
        </div>
      </div>

      {/* Controls: Search & Category Filter */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {agencies.map((agency) => {
            const isActive = selectedAgency === agency;
            const labelAr =
              agency === 'ALL'
                ? 'الكل'
                : agency === 'Videos'
                ? '🎥 فيديوهات تدريبية'
                : agency === 'Templates' ? '📄 قوالب GMP' : agency;
            const labelEn = agency === 'ALL' ? 'All' : agency === 'Videos' ? '🎥 Webinars' : agency === 'Templates' ? '📄 GMP Templates' : agency;

            return (
              <button
                key={agency}
                onClick={() => setSelectedAgency(agency)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '20px',
                  border: isActive ? `2px solid ${S.teal}` : `1px solid ${S.sub}33`,
                  background: isActive ? `linear-gradient(135deg, ${S.navy}, ${S.navyMid})` : 'white',
                  color: isActive ? S.teal : S.text,
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 212, 170, 0.2)' : 'none',
                }}
              >
                {isRtl ? labelAr : labelEn}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            placeholder={isRtl ? 'بحث في المصادر والمراجع...' : 'Search resources...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              paddingRight: isRtl ? '36px' : '16px',
              paddingLeft: isRtl ? '16px' : '36px',
              borderRadius: '12px',
              border: `1px solid ${S.sub}44`,
              background: 'white',
              fontSize: '13px',
              color: S.text,
              outline: 'none',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [isRtl ? 'right' : 'left']: '12px',
              color: S.sub,
              fontSize: '14px',
            }}
          >
            🔍
          </span>
        </div>
      </div>

      {/* Templates Section */}
      {selectedAgency === 'Templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {GMP_TEMPLATES.map(tpl => (
            <div key={tpl.id} style={{ background: '#0d1f38', borderRadius: '14px', border: '1px solid rgba(0,212,170,0.2)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ background: 'rgba(0,212,170,0.12)', color: '#00d4aa', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(0,212,170,0.3)' }}>GMP Template</span>
                  <span style={{ fontSize: '24px' }}>{tpl.icon}</span>
                </div>
                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{isRtl ? tpl.titleAr : tpl.title}</h3>
                <p style={{ color: '#8ba3c4', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>{isRtl ? tpl.descriptionAr : tpl.description}</p>
              </div>
              <button
                onClick={() => downloadTemplate(tpl.key, tpl.title)}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', background: `linear-gradient(135deg, ${tpl.color}, ${tpl.color}cc)`, color: 'white', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                <span>⬇️</span>
                <span>{isRtl ? 'تحميل القالب' : 'Download Template'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Grid of Cards */}
      {selectedAgency !== 'Templates' && filteredResources.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            color: S.sub,
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
          <div style={{ fontWeight: '700', fontSize: '16px', color: S.text }}>
            {isRtl ? 'لم يتم العثور على مصادر تطابق البحث' : 'No matching resources found'}
          </div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>
            {isRtl ? 'جرب البحث بكلمات أخرى أو اختر فئة مختلفة' : 'Try adjusting your search or filters.'}
          </div>
        </div>
      ) : selectedAgency !== 'Templates' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredResources.map((res) => (
            <div
              key={res.id}
              style={{
                background: S.card,
                borderRadius: '14px',
                border: `1px solid ${S.border}`,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              }}
            >
              <div>
                {/* Header Tag & Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span
                    style={{
                      background: 'rgba(0, 212, 170, 0.12)',
                      color: S.teal,
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: `1px solid rgba(0, 212, 170, 0.3)`,
                    }}
                  >
                    {res.badge}
                  </span>
                  <span style={{ fontSize: '24px' }}>{res.icon}</span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    lineHeight: '1.4',
                  }}
                >
                  {isRtl ? res.titleAr : res.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: '#8ba3c4',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                  }}
                >
                  {isRtl ? res.descriptionAr : res.description}
                </p>
              </div>

              {/* Action Button Link */}
              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${S.teal}, ${S.tealDk})`,
                  color: '#0a1628',
                  fontWeight: '700',
                  fontSize: '13px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <span>{isRtl ? 'زيارة المصدر الرسمي' : 'Visit Official Source'}</span>
                <span>{isRtl ? '←' : '→'}</span>
              </a>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
