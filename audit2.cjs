const fs = require('fs');

const componentMap = [
  { name: 'Hero', file: 'frontend/src/features/home/components/Hero.jsx' },
  { name: 'About', file: 'frontend/src/features/home/components/AboutSection.jsx' },
  { name: 'AcademicPrograms', file: 'frontend/src/features/home/components/AcademicPrograms.jsx' },
  { name: 'Accreditation', file: 'frontend/src/features/home/components/AccreditationSection.jsx' },
  { name: 'Management', file: 'frontend/src/features/home/components/ManagementSection.jsx' },
  { name: 'Facilities', file: 'frontend/src/features/home/components/FacilitiesSection.jsx' },
  { name: 'Placement', file: 'frontend/src/features/home/components/PlacementSection.jsx' },
  { name: 'Recruiters', file: 'frontend/src/features/home/components/RecruitersSection.jsx' },
  { name: 'Testimonials', file: 'frontend/src/features/home/components/TestimonialsSection.jsx' },
  { name: 'Achievements', file: 'frontend/src/features/home/components/AchievementsSection.jsx' },
  { name: 'News', file: 'frontend/src/features/home/components/NewsSection.jsx' },
  { name: 'LifeAtKsbm', file: 'frontend/src/features/home/components/LifeAtKSBMSection.jsx' },
];

componentMap.forEach(({ name, file }) => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    const lines = code.split('\n');
    
    // Find all lines with showSection
    const matches = [];
    lines.forEach((line, i) => {
      if (line.includes('showSection')) matches.push(`  L${i+1}: ${line.trim()}`);
    });
    console.log(`\n=== ${name} ===`);
    matches.forEach(m => console.log(m));
    
    // Check what state variable holds the CMS data
    const stateLines = lines.filter(l => l.includes('useState('));
    const dataState = stateLines.filter(l => l.includes('settings') || l.includes('data') || l.includes('cmsData'));
    dataState.forEach(l => console.log('  STATE: ' + l.trim()));
  } catch(e) {
    console.log(`\n=== ${name} === ERROR: ${e.message}`);
  }
});
