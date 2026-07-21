const fs = require('fs');
const path = 'd:/KMCT/KSBM/frontend/src/features/admin/cms/ManageAdmissionsPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove tabs array
content = content.replace(/const tabs = \[\s+.*?\];/gs, '');

// 2. Remove tabs container UI
const tabsUIStart = content.indexOf('{/* Tabs with Scroll Arrows */}');
const tabContentsStart = content.indexOf('{/* Tab Contents */}');
if (tabsUIStart !== -1 && tabContentsStart !== -1) {
  content = content.substring(0, tabsUIStart) + content.substring(tabContentsStart);
}

// 3. Remove tab contents container div
content = content.replace(/{\/\* Tab Contents \*\/}\s*<div className=\"bg-white rounded-2xl p-6 sm:p-8 shadow-\[0_2px_12px_rgba\(43,47,102,0\.06\)\] border border-gray-100\">/gs, '');

// 4. Replace each tab start with <SectionForm>
content = content.replace(/{\/\* TAB 1: HERO \*\/}\s*{activeTab === 'hero' && \(\s*<div className=\"space-y-8 max-w-4xl\">\s*<h2 className=\"text-xl font-bold text-\[#111836\] border-b border-gray-100 pb-4\">Hero Banner Settings<\/h2>/g, '<SectionForm title=\"Hero Banner Settings\">\\n<div className=\"space-y-8\">');

content = content.replace(/\s*\)\}\s*{\/\* TAB 2: ELITE ADVANTAGE \*\/}\s*{activeTab === 'elite' && \(\s*<div className=\"space-y-8 max-w-4xl\">\s*<h2 className=\"text-xl font-bold text-\[#111836\] border-b border-gray-100 pb-4\">Elite Advantage Settings<\/h2>/g, '\\n</div>\\n</SectionForm>\\n\\n<SectionForm title=\"Elite Advantage Settings\">\\n<div className=\"space-y-8\">');

content = content.replace(/\s*\)\}\s*{\/\* TAB 3: JOURNEY \*\/}\s*{activeTab === 'journey' && \(\s*<div className=\"space-y-8 max-w-5xl\">\s*<h2 className=\"text-xl font-bold text-\[#111836\] border-b border-gray-100 pb-4\">Application Journey Settings<\/h2>/g, '\\n</div>\\n</SectionForm>\\n\\n<SectionForm title=\"Application Journey Settings\">\\n<div className=\"space-y-8\">');

content = content.replace(/\s*\)\}\s*{\/\* TAB 4: ELIGIBILITY \*\/}\s*{activeTab === 'eligibility' && \(\s*<div className=\"space-y-8 max-w-5xl\">\s*<h2 className=\"text-xl font-bold text-\[#111836\] border-b border-gray-100 pb-4\">Eligibility & Fees Settings<\/h2>/g, '\\n</div>\\n</SectionForm>\\n\\n<SectionForm title=\"Eligibility & Fees Settings\">\\n<div className=\"space-y-8\">');

content = content.replace(/\s*\)\}\s*{\/\* TAB 5: CTA \*\/}\s*{activeTab === 'cta' && \(\s*<div className=\"space-y-8 max-w-4xl\">\s*<h2 className=\"text-xl font-bold text-\[#111836\] border-b border-gray-100 pb-4\">CTA Section Settings<\/h2>/g, '\\n</div>\\n</SectionForm>\\n\\n<SectionForm title=\"CTA Section Settings\">\\n<div className=\"space-y-8\">');

content = content.replace(/\s*\)\}\s*{\/\* TAB 6: FAQ \*\/}\s*{activeTab === 'faq' && \(\s*<div className=\"space-y-8 max-w-4xl\">\s*<h2 className=\"text-xl font-bold text-\[#111836\] border-b border-gray-100 pb-4\">FAQ Section Settings<\/h2>/g, '\\n</div>\\n</SectionForm>\\n\\n<SectionForm title=\"FAQ Section Settings\">\\n<div className=\"space-y-8\">');

// 5. Replace final tab closing
content = content.replace(/\s*\)\}\s*<\/div>\s*<\/div>\s*\)\;\s*\}\;\s*export default ManageAdmissionsPage;/g, '\\n</div>\\n</SectionForm>\\n</div>\\n);\\n};\\nexport default ManageAdmissionsPage;');

fs.writeFileSync(path, content, 'utf8');
console.log('Transform complete.');
