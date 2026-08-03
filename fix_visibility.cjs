const fs = require('fs');

const componentMap = [
  { name: 'About', file: 'frontend/src/features/home/components/AboutSection.jsx', stateVar: 'cmsData' },
  { name: 'Accreditation', file: 'frontend/src/features/home/components/AccreditationSection.jsx', stateVar: 'settings' },
  { name: 'Facilities', file: 'frontend/src/features/home/components/FacilitiesSection.jsx', stateVar: 'settings' },
  { name: 'Placement', file: 'frontend/src/features/home/components/PlacementSection.jsx', stateVar: 'data' },
  { name: 'Recruiters', file: 'frontend/src/features/home/components/RecruitersSection.jsx', stateVar: 'data' },
  { name: 'Achievements', file: 'frontend/src/features/home/components/AchievementsSection.jsx', stateVar: 'data' },
  { name: 'News', file: 'frontend/src/features/home/components/NewsSection.jsx', stateVar: 'data' },
];

componentMap.forEach(({ name, file, stateVar }) => {
  try {
    let raw = fs.readFileSync(file, 'utf8');
    
    // Fix: Replace "\r  if (X?.showSection === false) {\n    return null;\n  }\n" 
    // which is broken (on same line as \r) with proper "\n\n  if (X?.showSection === false) {\n    return null;\n  }\n"
    const broken = new RegExp(`\\r  if \\(${stateVar}\\?\\.showSection === false\\) \\{\\n    return null;\\n  \\}\\n`, 'g');
    const fixed = `\r\n\n  if (${stateVar}?.showSection === false) {\n    return null;\n  }\n`;
    
    const before = raw;
    raw = raw.replace(broken, fixed);
    
    if (raw !== before) {
      fs.writeFileSync(file, raw, 'utf8');
      console.log(`${name}: FIXED`);
    } else {
      console.log(`${name}: no change (pattern not found) - trying alternate pattern`);
      
      // Try alternate: look for the exact broken sequence
      const broken2 = `\r  if (${stateVar}?.showSection === false) {\n    return null;\n  }\n`;
      if (raw.includes(broken2)) {
        raw = raw.replace(broken2, `\r\n\n  if (${stateVar}?.showSection === false) {\n    return null;\n  }\n`);
        fs.writeFileSync(file, raw, 'utf8');
        console.log(`  -> ${name}: FIXED with alternate pattern`);
      } else {
        console.log(`  -> ${name}: pattern not found, logging context...`);
        const idx = raw.indexOf('showSection');
        while (idx !== -1) {
          const ctx = raw.substring(Math.max(0, idx-20), idx+80);
          console.log('  ctx:', JSON.stringify(ctx));
          break;
        }
      }
    }
  } catch(e) {
    console.log(`${name}: ERROR - ${e.message}`);
  }
});
