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
    // Read as binary to detect encoding issues
    const raw = fs.readFileSync(file, 'utf8');
    const hasCarriageReturn = raw.includes('\r\n');
    
    // Check if showSection check is on the SAME LINE as a \r
    const hasMixedNewline = /\r  if \(.*showSection/.test(raw);
    
    console.log(`${name}: CRLF=${hasCarriageReturn}, showSection_on_same_line_as_CR=${hasMixedNewline}`);
  } catch(e) {
    console.log(`${name}: ERROR - ${e.message}`);
  }
});
