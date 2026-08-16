const fs = require('fs');

const dashboardPath = process.argv[2];
if (!dashboardPath) {
  console.error('Usage: node fix-dashboard.js <path-to-Dashboard.jsx>');
  process.exit(1);
}

let content = fs.readFileSync(dashboardPath, 'utf8');
const original = content;

// Fix: Ensure certProgressForDisplay merges reconciledProgress
// Replace the useMemo block for certProgressForDisplay
const oldPattern = /const\s+certProgressForDisplay\s*=\s*useMemo\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[^\]]*\]\s*\);?/;

const newCode = `const certProgressForDisplay = useMemo(() => {
    // FIX: Merge reconciled progress to prevent empty display after RetroAward sync
    const source = (reconciledProgress && Object.keys(reconciledProgress).length > 0)
      ? { ...certProgress, ...reconciledProgress }
      : certProgress;
    const result = Object.fromEntries(
      Object.entries(source).filter(([id, cert]) => cert && (cert.score > 0 || cert.percentage > 0 || cert.completed))
    );
    console.log('[Dashboard] certProgressForDisplay keys count:', Object.keys(result).length);
    return result;
  }, [certProgress, reconciledProgress]);`;

if (oldPattern.test(content)) {
  content = content.replace(oldPattern, newCode);
  fs.writeFileSync(dashboardPath, content);
  console.log('✅ Fixed certProgressForDisplay successfully!');
  console.log('🔄 Restart your dev server: npm run dev');
} else {
  console.log('⚠️ Could not find certProgressForDisplay useMemo block.');
  console.log('   You may need to apply the fix manually.');
}
