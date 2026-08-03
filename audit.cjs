const fs = require('fs');

const manageFiles = [
  'ManageHero', 'ManageAbout', 'ManagePrograms', 'ManageAccreditation',
  'ManageManagement', 'ManageFacilities', 'ManagePlacement', 'ManageRecruiters',
  'ManageTestimonials', 'ManageAchievements', 'ManageNews', 'ManageLifeAtKsbm'
];

manageFiles.forEach(f => {
  try {
    const code = fs.readFileSync('frontend/src/features/admin/cms/' + f + '.jsx', 'utf8');
    const hasVisibility = code.includes('Visibility Settings');
    const hasSetShowSection = code.includes('setShowSection');
    const fetchSetsShowSection = code.includes('setShowSection(data.showSection') || code.includes('setShowSection(data?.showSection');
    console.log(f + ': hasVisibilityUI=' + hasVisibility + ', hasSetShowSection=' + hasSetShowSection + ', fetchSetsShowSection=' + fetchSetsShowSection);
  } catch(e) {
    console.log(f + ': ERROR - ' + e.message);
  }
});
