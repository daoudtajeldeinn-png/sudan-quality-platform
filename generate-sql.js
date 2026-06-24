const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'src', 'data', 'content_new.js');

try {
  let contentStr = fs.readFileSync(contentPath, 'utf8');

  // Convert ES module export to CommonJS to load it in Node
  contentStr = contentStr.replace(/export\s+const\s+educationalContent\s*=/, 'const educationalContent =');
  contentStr += '\nmodule.exports = { educationalContent };';

  const tempPath = path.join(__dirname, 'temp_content_parser.js');
  fs.writeFileSync(tempPath, contentStr, 'utf8');

  const { educationalContent } = require('./temp_content_parser.js');
  fs.unlinkSync(tempPath);

  const targetUnits = [
    'cleaning-validation',
    'adv-gmp',
    'adv-glp',
    'adv-iso-17025',
    'adv-validation',
    'adv-qrm',
    'adv-gdp'
  ];

  let sql = '-- SQL Script to insert advanced unit and cleaning validation questions into Supabase\n';
  sql += '-- Copy and run this script in the Supabase SQL Editor\n\n';

  targetUnits.forEach(unitId => {
    sql += `-- Clean old questions for ${unitId}\n`;
    sql += `DELETE FROM questions WHERE "unitId" = '${unitId}';\n\n`;
  });

  targetUnits.forEach(unitId => {
    const unit = educationalContent.units[unitId];
    if (!unit) {
      console.warn(`⚠️ Unit "${unitId}" not found in educationalContent`);
      return;
    }

    const pool = unit.examQuestionPool;
    if (!pool || pool.length === 0) {
      console.warn(`⚠️ No questions in pool for unit "${unitId}"`);
      return;
    }

    sql += `-- -----------------------------------------------------\n`;
    sql += `-- Questions for Unit: ${unitId} (${pool.length} questions)\n`;
    sql += `-- -----------------------------------------------------\n`;
    sql += `INSERT INTO questions ("unitId", question, options, "correctAnswer", correctAnswers, type, explanation) VALUES\n`;

    const values = [];
    pool.forEach(qKey => {
      const q = educationalContent.allQuestions[qKey];
      if (!q) {
        console.warn(`⚠️ Question "${qKey}" not found in allQuestions`);
        return;
      }

      // We prioritize Arabic question text for bilingual matching
      const questionText = q.questionText?.ar || q.questionText?.en || '';
      const escapedQuestion = questionText.replace(/'/g, "''");

      let optionsStr = 'NULL';
      if (q.type === 'mcq' || !q.type) {
        const opts = q.options?.ar || q.options?.en || [];
        optionsStr = `'${JSON.stringify(opts).replace(/'/g, "''")}'`;
      }

      let corrAns = 'NULL';
      if (q.correctAnswer !== undefined) {
        corrAns = `'${String(q.correctAnswer).replace(/'/g, "''")}'`;
      }

      let corrAnss = 'NULL';
      if (q.correctAnswers) {
        const arr = q.correctAnswers.map(ans => `'${ans.replace(/'/g, "''")}'`);
        corrAnss = `ARRAY[${arr.join(', ')}]`;
      }

      const typeStr = q.type === 'mcq' || !q.type ? 'multiple' : q.type;

      const explanationText = q.explanation?.ar || q.explanation?.en || '';
      const escapedExplanation = explanationText ? `'${explanationText.replace(/'/g, "''")}'` : 'NULL';

      values.push(`('${unitId}', '${escapedQuestion}', ${optionsStr}, ${corrAns}, ${corrAnss}, '${typeStr}', ${escapedExplanation})`);
    });

    sql += values.join(',\n') + ';\n\n';
  });

  const outPath = path.join(__dirname, 'insert-advanced-questions.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log('✅ Generated insert-advanced-questions.sql successfully!');
  console.log(`📍 Path: ${outPath}`);

} catch (error) {
  console.error('❌ Error generating SQL:', error);
}
