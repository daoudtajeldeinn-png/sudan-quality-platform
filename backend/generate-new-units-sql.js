const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/data/content_new.js');
const destDemoPath = path.join(__dirname, 'src/data/demoQuestions.js');
const sqlOutputPath = path.join(__dirname, 'insert-new-units.sql');

async function run() {
  try {
    const srcUrl = 'file:///' + srcPath.replace(/\\/g, '/');
    const module = await import(srcUrl);
    const allQuestions = module.educationalContent.allQuestions;
    
    const newUnits = [
      'cleaning-validation', 
      'equipment-qualification', 
      'method-validation', 
      'process-validation', 
      'hold-time-stability'
    ];
    
    // 1. Generate demoQuestions.js additions
    let newQuestionsString = '';
    let sqlQueries = '-- Insert missing new unit questions into Supabase\n-- Run this in the Supabase SQL Editor\n\n';
    
    for (const unit of newUnits) {
      newQuestionsString += `    // --- ${unit.toUpperCase()} ---\n`;
      newQuestionsString += `    '${unit}': [\n`;
      
      const unitData = module.educationalContent.units[unit];
      if (!unitData || !unitData.examQuestionPool) continue;
      
      const unitQuestions = unitData.examQuestionPool.map(id => {
        const q = allQuestions[id];
        return { ...q, unitId: unit, _id: id };
      }).filter(q => q !== undefined);
      
      // Build JS for Demo
      const qStrings = unitQuestions.map(q => {
        return `        ${JSON.stringify(q)}`;
      });
      newQuestionsString += qStrings.join(',\n') + '\n    ],\n';
      
      // Build SQL for Supabase
      sqlQueries += `-- ${unit} questions\n`;
      sqlQueries += `INSERT INTO questions ("unitId", question, options, "correctAnswer", "correctAnswers", type, explanation) VALUES\n`;
      
      const sqlValues = unitQuestions.map(q => {
        const questionText = q.questionText?.ar ? q.questionText.ar.replace(/'/g, "''") : q.questionText.replace(/'/g, "''");
        let optionsStr = 'NULL';
        if (q.options && q.options.ar) {
           optionsStr = `'${JSON.stringify(q.options.ar).replace(/'/g, "''")}'`;
        } else if (q.options) {
           optionsStr = `'${JSON.stringify(q.options).replace(/'/g, "''")}'`;
        }
        
        const correctAns = q.correctAnswer !== undefined ? `'${q.correctAnswer}'` : 'NULL';
        let correctAnswersArr = 'NULL';
        if (q.correctAnswers) {
           const arrStr = q.correctAnswers.map(a => `'${a.replace(/'/g, "''")}'`).join(', ');
           correctAnswersArr = `ARRAY[${arrStr}]`;
        }
        
        const type = `'${q.type === 'mcq' ? 'multiple' : q.type}'`;
        let expStr = 'NULL';
        if (q.explanation && q.explanation.ar) {
           expStr = `'${JSON.stringify(q.explanation.ar).replace(/'/g, "''")}'`;
        } else if (q.explanation) {
           expStr = `'${JSON.stringify(q.explanation).replace(/'/g, "''")}'`;
        }
        
        return `('${unit}', '${questionText}', ${optionsStr}, ${correctAns}, ${correctAnswersArr}, ${type}, ${expStr})`;
      });
      
      sqlQueries += sqlValues.join(',\n') + ';\n\n';
    }
    
    // Update demoQuestions.js
    let demoContent = fs.readFileSync(destDemoPath, 'utf8');
    const insertPoint = demoContent.lastIndexOf('};\n\n// Flatten all categories');
    if (insertPoint !== -1) {
      demoContent = demoContent.slice(0, insertPoint) + ',\n' + newQuestionsString + demoContent.slice(insertPoint);
      fs.writeFileSync(destDemoPath, demoContent);
      console.log('✅ Successfully updated backend/src/data/demoQuestions.js');
    } else {
      console.error('❌ Could not find insert point in demoQuestions.js');
    }
    
    // Write SQL file
    fs.writeFileSync(sqlOutputPath, sqlQueries);
    console.log(`✅ Successfully generated SQL file: ${sqlOutputPath}`);
    console.log('Please run this SQL in your Supabase SQL Editor.');
    
  } catch (err) {
    console.error(err);
  }
}

run();
