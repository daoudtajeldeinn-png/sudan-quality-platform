const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../../src/data/content_new.js');
const destPath = path.join(__dirname, 'src/data/demoQuestions.js');

try {
  // We can't simply require content_new.js because it uses ES module exports.
  // Instead, let's just parse it using regex or build a string.
  
  // Since we are running in Node, let's just create the string manually from content_new.js if we can read it.
  const content = fs.readFileSync(srcPath, 'utf8');
  
  // Actually, we can dynamically import it since node supports dynamic import for ES modules.
  (async () => {
    try {
      const module = await import('file:///' + srcPath.replace(/\\/g, '/'));
      const allQuestions = module.educationalContent.allQuestions;
      
      const newUnits = ['cleaning-validation', 'equipment-qualification', 'method-validation', 'process-validation', 'hold-time-stability'];
      
      let newQuestionsString = '';
      
      for (const unit of newUnits) {
        newQuestionsString += `    // --- ${unit.toUpperCase()} ---\n`;
        newQuestionsString += `    '${unit}': [\n`;
        
        const unitQuestions = Object.values(allQuestions).filter(q => q.unitId === unit);
        const qStrings = unitQuestions.map(q => {
          return `        ${JSON.stringify(q)}`;
        });
        
        newQuestionsString += qStrings.join(',\n') + '\n';
        newQuestionsString += `    ],\n`;
      }
      
      // read demoQuestions.js
      let demoContent = fs.readFileSync(destPath, 'utf8');
      
      // insert before "}; // Flatten all categories"
      const insertPoint = demoContent.lastIndexOf('};\n\n// Flatten all categories');
      
      if (insertPoint !== -1) {
        demoContent = demoContent.slice(0, insertPoint) + ',\n' + newQuestionsString + demoContent.slice(insertPoint);
        fs.writeFileSync(destPath, demoContent);
        console.log('Successfully updated demoQuestions.js');
      } else {
        console.log('Could not find insert point in demoQuestions.js');
      }
    } catch (err) {
      console.error(err);
    }
  })();
} catch (err) {
  console.error(err);
}
