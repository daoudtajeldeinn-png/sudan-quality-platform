const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'content.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add GDP questions to allQuestions section
const gdpQuestions = `
    // GDP Questions
    'gdp_q1': { type: 'mcq', questionText: { ar: 'ماذا يرمز GDP؟', en: 'What does GDP stand for?' }, options: { ar: ['Good Documentation Practice', 'Good Distribution Practice', 'Good Development Practice', 'General Drug Protocol'], en: ['Good Documentation Practice', 'Good Distribution Practice', 'Good Development Practice', 'General Drug Protocol'] }, correctAnswer: 1, explanation: { ar: 'GDP = Good Distribution Practice', en: 'GDP = Good Distribution Practice' } },
    'gdp_q2': { type: 'mcq', questionText: { ar: 'ما هي درجة حرارة التخزين للدواء المبرد؟', en: 'What is the storage temperature for refrigerated drugs?' }, options: { ar: ['15-25C', '2-8C', '-20C', '0-15C'], en: ['15-25C', '2-8C', '-20C', '0-15C'] }, correctAnswer: 1, explanation: { ar: 'الادوية المبردة تخزن في 2-8C', en: 'Refrigerated drugs are stored at 2-8C' } },
    'gdp_q3': { type: 'mcq', questionText: { ar: 'ما هو الغرض من نظام FIFO في التخزين؟', en: 'What is the purpose of FIFO system in storage?' }, options: { ar: ['زيادة الربح', 'منع انتهاء الصلاحية', 'تحسين التنظيم', 'تقليل التكاليف'], en: ['Increase profit', 'Prevent expiration', 'Improve organization', 'Reduce costs'] }, correctAnswer: 1, explanation: { ar: 'FIFO يمنع انتهاء الصلاحية', en: 'FIFO prevents expiration' } },
    'gdp_q4': { type: 'tf', questionText: { ar: 'هل يتطلب GDP مراقبة درجة الحرارة اثناء النقل؟', en: 'Does GDP require temperature monitoring during transport?' }, options: { ar: ['نعم', 'لا'], en: ['Yes', 'No'] }, correctAnswer: 0, explanation: { ar: 'مراقبة درجة الحرارة مطلوبة', en: 'Temperature monitoring is required' } },
    'gdp_q5': { type: 'mcq', questionText: { ar: 'ما هي احدى علامات الادوية المزورة؟', en: 'What is one sign of counterfeit drugs?' }, options: { ar: ['تغليف صحيح', 'تاريخ صالح', 'تغليف غير عادي', 'رقم دفعة موجود'], en: ['Correct packaging', 'Valid date', 'Unusual packaging', 'Batch number present'] }, correctAnswer: 2, explanation: { ar: 'التغليف غير العادي علامة على التزوير', en: 'Unusual packaging is a sign of counterfeiting' } }
`;

// Find the end of the allQuestions object - look for the closing };
// The file should end with };
const endMarker = '};';
const endPosition = content.lastIndexOf(endMarker);

if (endPosition === -1) {
  console.log('Could not find end of file');
  process.exit(1);
}

console.log('Found end at position:', endPosition);

// Insert GDP questions before the closing };
const newContent = content.slice(0, endPosition) + gdpQuestions + '\n' + content.slice(endPosition);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('GDP questions added to end of allQuestions!');

