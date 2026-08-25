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

function downloadTemplate(key, title) {
  const mdContent = TEMPLATE_CONTENTS[key];
  if (!mdContent) return;

  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // RTL + Arabic font support via built-in
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxW = pageW - margin * 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 37, 87);
    doc.text(title, margin, 20);

    doc.setDrawColor(0, 212, 170);
    doc.setLineWidth(0.8);
    doc.line(margin, 24, pageW - margin, 24);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);

    const lines = mdContent.split('\n');
    let y = 32;

    lines.forEach(line => {
      if (y > 270) { doc.addPage(); y = 20; }

      if (line.startsWith('# ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 37, 87);
        const wrapped = doc.splitTextToSize(line.replace('# ', ''), maxW);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 7 + 3;
      } else if (line.startsWith('## ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 184, 146);
        const wrapped = doc.splitTextToSize(line.replace('## ', ''), maxW);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 6 + 2;
      } else if (line.startsWith('### ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const wrapped = doc.splitTextToSize(line.replace('### ', ''), maxW);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 5 + 2;
      } else if (line.startsWith('---')) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 4;
      } else if (line.trim() === '') {
        y += 3;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(40, 40, 40);
        const wrapped = doc.splitTextToSize(line, maxW);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 5 + 1;
      }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Sudan Quality Platform — منصة السودان للجودة', margin, 290);
      doc.text(`${i} / ${pageCount}`, pageW - margin, 290, { align: 'right' });
    }

    doc.save(`${key}-template.pdf`);
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
