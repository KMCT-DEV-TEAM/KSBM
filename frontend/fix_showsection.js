const fs = require('fs');
const path = require('path');
const componentsDir = 'd:/KMCT/KSBM/frontend/src/features/home/components';

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Find if there is a 'return null' for showSection hidden inside the map or elsewhere
  // and remove it. We'll be a bit more flexible with whitespace.
  const regex = /^\s*if\s*\(\s*(?:settings|data|cmsData|displayData)\?\.showSection\s*===\s*false\s*\)\s*return\s*null;\s*\n/gm;
  if (regex.test(content)) {
    content = content.replace(regex, '');
    changed = true;
  }

  // 2. We need to add the early return just before the main 'return (' of the component.
  if (changed || content.includes('showSection')) {
    const returnRegex = /^  return \(/m;
    if (returnRegex.test(content) && !content.includes('?.showSection === false')) {
      let varName = 'settings';
      if (content.includes('const [data, setData]')) varName = 'data';
      else if (content.includes('const [cmsData, setCmsData]')) varName = 'cmsData';
      else if (content.includes('const [displayData, setDisplayData]')) varName = 'displayData';

      content = content.replace(returnRegex, `  if (${varName}?.showSection === false) {\n    return null;\n  }\n\n  return (`);
      changed = true;
    }
  }

  // 3. Ensure fetchSettings captures showSection
  const setSettingsRegex = /(set(?:Settings|Data|CmsData|DisplayData)\(\{[\s\S]*?)(?=\}\);)/g;
  content = content.replace(setSettingsRegex, (match, p1) => {
    // Check if it already has showSection
    if (!match.includes('showSection:') && !match.includes('showSection,')) {
      changed = true;
      let newStr = p1.replace(/,\s*$/, '');
      return newStr + ',\n              showSection: data.showSection';
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed frontend:', file);
  }
}

// 4. Fix backend updateHeroSettings in cms.controller.js
const backendCtrlPath = 'd:/KMCT/KSBM/backend/src/modules/cms/cms.controller.js';
let backendContent = fs.readFileSync(backendCtrlPath, 'utf8');
if (backendContent.includes('export const updateHeroSettings = async (req, res) => {') && !backendContent.includes('settings.showSection = showSection;')) {
  // Add showSection to req.body destructuring
  backendContent = backendContent.replace(
    /const { pillText, headingLine1, headingLine2, description, primaryButton, secondaryButton, bannerImages, statsCard } = req\.body;/,
    'const { pillText, headingLine1, headingLine2, description, primaryButton, secondaryButton, bannerImages, statsCard, showSection } = req.body;'
  );
  // Add settings.showSection assignment
  backendContent = backendContent.replace(
    /if \(statsCard !== undefined\) settings\.statsCard = statsCard;/,
    'if (statsCard !== undefined) settings.statsCard = statsCard;\n    if (showSection !== undefined) settings.showSection = showSection;'
  );
  fs.writeFileSync(backendCtrlPath, backendContent);
  console.log('Fixed backend: cms.controller.js');
}
