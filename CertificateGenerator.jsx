import React from 'react';
import QRCode from 'qrcode.react';

const CertificateGenerator = ({ 
  userName = 'User Name',
  unitTitle = 'Professional Training Unit',
  score = 95,
  certLang = 'en',
  unitId = 'unit-001'
}) => {
  const today = new Date().toLocaleDateString(certLang === 'ar' ? 'ar-EG' : 'en-US');
  const verificationId = `SQP-${unitId.toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const containerStyle = {
    width: '1123px',
    height: '794px',
    position: 'relative',
    background: 'white',
    fontFamily: "'Georgia', 'Amiri', serif",
    color: '#1a202c',
    overflow: 'hidden',
    margin: '0 auto',
    padding: '0',
    boxShadow: '0 0 20px rgba(0,0,0,0.15)',
    border: '3px solid #d4af37',
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    padding: '80px 60px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const headerStyle = {
    marginBottom: '20px',
  };

  const titleStyle = {
    fontSize: '52px',
    fontWeight: 'bold',
    color: '#d4af37',
    margin: '20px 0',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#666',
    margin: '10px 0',
  };

  const nameStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#2c5f7c',
    margin: '30px 0',
    borderBottom: '2px solid #d4af37',
    paddingBottom: '15px',
    display: 'inline-block',
    minWidth: '400px',
  };

  const bodyTextStyle = {
    fontSize: '20px',
    color: '#333',
    margin: '15px 0',
    lineHeight: '1.6',
  };

  const unitStyle = {
    fontSize: '32px',
    fontWeight: '600',
    color: '#d4af37',
    margin: '25px 0',
    padding: '15px 30px',
    background: 'rgba(212, 175, 55, 0.05)',
    borderRadius: '8px',
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '2px solid #d4af37',
  };

  const qrSectionStyle = {
    textAlign: 'center',
  };

  const qrLabelStyle = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '8px',
    marginTop: '8px',
  };

  const dateStyle = {
    fontSize: '14px',
    color: '#888',
    marginTop: '8px',
  };

  const signatureSectionStyle = {
    textAlign: 'center',
  };

  const signatureLineStyle = {
    width: '200px',
    height: '1px',
    background: '#333',
    margin: '30px auto 10px',
  };

  const signerNameStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  };

  const verificationStyle = {
    fontSize: '11px',
    color: '#999',
    fontFamily: 'monospace',
    marginTop: '10px',
  };

  return (
    <div style={containerStyle} id="certificate-to-print">
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔬</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#333' }}>
            Sudan Quality Platform
          </h2>
          <p style={{ fontSize: '14px', color: '#d4af37', margin: '0', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Quality & Accreditation Board
          </p>
        </div>

        {/* Title */}
        <div style={titleStyle}>Certificate of Completion</div>

        {/* Intro */}
        <p style={subtitleStyle}>This is to certify that</p>

        {/* Name */}
        <div style={nameStyle}>{userName}</div>

        {/* Body Text */}
        <p style={bodyTextStyle}>
          Has successfully completed the professional training in:
        </p>

        {/* Unit Title */}
        <div style={unitStyle}>{unitTitle}</div>

        {/* Score */}
        <p style={bodyTextStyle}>
          Final Score: <strong>{score}%</strong>
        </p>

        {/* Footer */}
        <div style={footerStyle}>
          {/* Left: QR Code */}
          <div style={qrSectionStyle}>
            <div style={{ background: 'white', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', display: 'inline-block' }}>
              <QRCode 
                value={`https://decisive-octane-472816-d3.web.app/verify/${verificationId}`}
                size={80}
                level="H"
                includeMargin={false}
              />
            </div>
            <div style={qrLabelStyle}>Certificate Verification</div>
            <div style={verificationStyle}>{verificationId}</div>
            <div style={dateStyle}>Date: {today}</div>
          </div>

          {/* Right: Signature */}
          <div style={signatureSectionStyle}>
            <div style={signatureLineStyle}></div>
            <div style={signerNameStyle}>Dr. Daoud Tajeldeinn Ahmed</div>
            <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>Director</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
