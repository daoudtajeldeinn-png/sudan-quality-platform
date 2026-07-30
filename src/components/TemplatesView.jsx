import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { GMP_TEMPLATES } from '../data/resourcesAndTemplates';

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

export default function TemplatesView() {
  const { lang, isRtl } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [editorMode, setEditorMode] = useState('interactive'); // 'interactive' | 'markdown'
  const [formData, setFormData] = useState({});
  const [copiedNotification, setCopiedNotification] = useState(false);

  const categories = ['ALL', 'GMP', 'CAPA', 'Validation', 'Lab Quality', 'QMS'];

  const filteredTemplates = GMP_TEMPLATES.filter(
    (tpl) => selectedCategory === 'ALL' || tpl.category === selectedCategory
  );

  const openTemplate = (template) => {
    setActiveTemplate(template);
    setEditorMode('interactive');

    // Load initial defaults for interactive form
    const initial = {};
    template.fields.forEach((field) => {
      initial[field.name] = field.default || '';
    });
    setFormData(initial);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const copyMarkdown = () => {
    if (!activeTemplate) return;
    navigator.clipboard.writeText(activeTemplate.markdownContent);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const downloadMarkdown = () => {
    if (!activeTemplate) return;
    const blob = new Blob([activeTemplate.markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTemplate.id}_template.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadHtmlDocument = () => {
    if (!activeTemplate) return;
    const title = isRtl ? activeTemplate.titleAr : activeTemplate.title;

    let fieldsHtml = '';
    activeTemplate.fields.forEach((f) => {
      const val = formData[f.name] || '—';
      const label = isRtl ? f.label : f.labelEn;
      fieldsHtml += `
        <div style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #0f2557; display: block; font-size: 13px;">${label}:</strong>
          <span style="color: #2d3748; font-size: 14px; margin-top: 4px; display: block;">${val}</span>
        </div>
      `;
    });

    const fullHtml = `<!DOCTYPE html>
<html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: #f8fafc; color: #1e293b; line-height: 1.6; }
    .doc-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; border: 1px solid #cbd5e1; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 2px solid #00d4aa; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #0f2557; margin: 0 0 8px 0; font-size: 24px; }
    .header p { color: #64748b; margin: 0; font-size: 13px; }
    .footer { margin-top: 40px; pt-20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 11px; }
  </style>
</head>
<body>
  <div class="doc-container">
    <div class="header">
      <h1>${title}</h1>
      <p>Sudan Quality Platform — Official GMP Documentation</p>
    </div>
    ${fieldsHtml}
    <div class="footer">
      Generated via Sudan Quality Platform (${new Date().toLocaleDateString()}) — Compliant with WHO & FDA Standards
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTemplate.id}_export.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '32px' }}>📋</span>
          <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, color: 'white' }}>
            {isRtl ? 'مركز القوالب الصيدلانية والنماذج' : 'Pharmaceutical Templates & Form Builder'}
          </h1>
        </div>
        <p style={{ color: '#8ba3c4', fontSize: '14px', maxWidth: '750px', margin: 0, lineHeight: 1.6 }}>
          {isRtl
            ? 'مجموعة كاملة من النماذج والقوالب المعيارية التفاعلية لتوثيق إجراءات GMP، الانحرافات CAPA، والتحقق IQ/OQ/PQ مع إمكانية التعبئة والتصدير.'
            : 'Interactive forms and downloadable Markdown templates for GMP Batch Records, CAPA, Validation (IQ/OQ/PQ), and QMS Quality Policies.'}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const labelAr = cat === 'ALL' ? 'الكل' : cat;
          const labelEn = cat === 'ALL' ? 'All' : cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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
              }}
            >
              {isRtl ? labelAr : labelEn}
            </button>
          );
        })}
      </div>

      {/* Templates Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => openTemplate(tpl)}
            style={{
              background: S.card,
              borderRadius: '14px',
              border: `1px solid ${S.border}`,
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justify-content: 'space-between',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            <div>
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
                  {tpl.badge}
                </span>
                <span style={{ fontSize: '26px' }}>{tpl.icon}</span>
              </div>

              <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                {isRtl ? tpl.titleAr : tpl.title}
              </h3>

              <p style={{ color: '#8ba3c4', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
                {isRtl ? tpl.descriptionAr : tpl.description}
              </p>
            </div>

            <button
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${S.navyMid}, ${S.navy})`,
                color: S.teal,
                border: `1px solid ${S.teal}55`,
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify-content: 'center',
                gap: '8px',
              }}
            >
              <span>{isRtl ? 'فتح وتعبئة القالب' : 'Open & Fill Template'}</span>
              <span>⚡</span>
            </button>
          </div>
        ))}
      </div>

      {/* FULL TEMPLATE EDITOR MODAL / OVERLAY */}
      {activeTemplate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(10, 22, 40, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justify-content: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: S.card,
              border: `1px solid ${S.border}`,
              borderRadius: '16px',
              width: '100%',
              maxWidth: '1050px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${S.border}`,
                display: 'flex',
                justify-content: 'space-between',
                alignItems: 'center',
                background: S.navyDk,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{activeTemplate.icon}</span>
                <div>
                  <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                    {isRtl ? activeTemplate.titleAr : activeTemplate.title}
                  </h2>
                  <div style={{ color: S.teal, fontSize: '12px', fontWeight: '600' }}>
                    {activeTemplate.badge} • {activeTemplate.category}
                  </div>
                </div>
              </div>

              {/* Mode Toggle Buttons & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    background: S.navy,
                    borderRadius: '8px',
                    padding: '3px',
                    display: 'flex',
                    border: `1px solid ${S.border}`,
                  }}
                >
                  <button
                    onClick={() => setEditorMode('interactive')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: editorMode === 'interactive' ? S.teal : 'transparent',
                      color: editorMode === 'interactive' ? S.navyDk : S.sub,
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {isRtl ? '📝 نموذج تفاعلي' : '📝 Interactive Form'}
                  </button>
                  <button
                    onClick={() => setEditorMode('markdown')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: editorMode === 'markdown' ? S.teal : 'transparent',
                      color: editorMode === 'markdown' ? S.navyDk : S.sub,
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {isRtl ? '📄 النص الخام (MD)' : '📄 Raw Markdown'}
                  </button>
                </div>

                <button
                  onClick={() => setActiveTemplate(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8ba3c4',
                    fontSize: '22px',
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {editorMode === 'interactive' ? (
                /* INTERACTIVE FORM BUILDER MODE */
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                  }}
                >
                  {/* Left Column: Input Form */}
                  <div
                    style={{
                      background: S.navy,
                      borderRadius: '12px',
                      padding: '20px',
                      border: `1px solid ${S.border}`,
                    }}
                  >
                    <h3 style={{ color: S.teal, fontSize: '15px', fontWeight: '700', marginTop: 0, marginBottom: '16px' }}>
                      {isRtl ? 'تعبئة البيانات' : 'Fill Form Fields'}
                    </h3>

                    <form onSubmit={(e) => e.preventDefault()}>
                      {activeTemplate.fields.map((field) => (
                        <div key={field.name} style={{ marginBottom: '14px' }}>
                          <label
                            style={{
                              display: 'block',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginBottom: '6px',
                            }}
                          >
                            {isRtl ? field.label : field.labelEn} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                          </label>

                          {field.type === 'select' ? (
                            <select
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                borderRadius: '6px',
                                background: S.card,
                                border: `1px solid ${S.border}`,
                                color: 'white',
                                fontSize: '13px',
                                outline: 'none',
                              }}
                            >
                              {field.options.map((opt) => (
                                <option key={opt} value={opt} style={{ background: S.navy, color: 'white' }}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              rows={3}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                borderRadius: '6px',
                                background: S.card,
                                border: `1px solid ${S.border}`,
                                color: 'white',
                                fontSize: '13px',
                                outline: 'none',
                                resize: 'vertical',
                              }}
                            />
                          ) : (
                            <input
                              type={field.type}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                borderRadius: '6px',
                                background: S.card,
                                border: `1px solid ${S.border}`,
                                color: 'white',
                                fontSize: '13px',
                                outline: 'none',
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </form>
                  </div>

                  {/* Right Column: Live Document Preview */}
                  <div
                    style={{
                      background: S.navy,
                      borderRadius: '12px',
                      padding: '20px',
                      border: `1px solid ${S.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <h3 style={{ color: S.teal, fontSize: '15px', fontWeight: '700', marginTop: 0, marginBottom: '16px' }}>
                      {isRtl ? 'معاينة الوثيقة المنشأة' : 'Live Document Preview'}
                    </h3>

                    <div
                      style={{
                        flex: 1,
                        background: 'white',
                        color: '#1a2a4a',
                        borderRadius: '8px',
                        padding: '24px',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        overflowY: 'auto',
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      <div style={{ textAlign: 'center', borderBottom: '2px solid #00d4aa', paddingBottom: '12px', marginBottom: '20px' }}>
                        <div style={{ fontWeight: '800', fontSize: '18px', color: '#0f2557' }}>
                          {isRtl ? activeTemplate.titleAr : activeTemplate.title}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>
                          Sudan Quality Platform — Official GMP Record
                        </div>
                      </div>

                      {activeTemplate.fields.map((f) => (
                        <div key={f.name} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                          <strong style={{ color: '#0f2557', display: 'block', fontSize: '12px' }}>
                            {isRtl ? f.label : f.labelEn}:
                          </strong>
                          <span style={{ color: '#334155', marginTop: '2px', display: 'block' }}>
                            {formData[f.name] || '—'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button
                        onClick={downloadHtmlDocument}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          background: S.teal,
                          color: S.navyDk,
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        {isRtl ? '📥 تصدير وثيقة HTML' : '📥 Export Formatted HTML'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* MARKDOWN RAW VIEW MODE */
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <span style={{ color: '#8ba3c4', fontSize: '13px' }}>
                      {isRtl ? 'صيغة Markdown القياسية المعتمدة' : 'Standard Markdown Document'}
                    </span>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={copyMarkdown}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          background: S.teal,
                          color: S.navyDk,
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        {copiedNotification ? (isRtl ? '✅ تم النسخ!' : '✅ Copied!') : isRtl ? '📋 نسخ النص' : '📋 Copy Text'}
                      </button>

                      <button
                        onClick={downloadMarkdown}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          background: S.navy,
                          color: 'white',
                          border: `1px solid ${S.border}`,
                          fontWeight: '700',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        {isRtl ? '📥 تحميل .md' : '📥 Download .md'}
                      </button>
                    </div>
                  </div>

                  <textarea
                    readOnly
                    value={activeTemplate.markdownContent}
                    style={{
                      width: '100%',
                      height: '420px',
                      background: S.navyDk,
                      color: S.teal,
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      padding: '16px',
                      borderRadius: '8px',
                      border: `1px solid ${S.border}`,
                      outline: 'none',
                      lineHeight: '1.6',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
