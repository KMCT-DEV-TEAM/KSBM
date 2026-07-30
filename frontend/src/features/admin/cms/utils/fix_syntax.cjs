const fs = require('fs');
const path = 'd:/KMCT/Projects/KSBM/frontend/src/features/admin/cms/ManageAdmissionsPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Fix Elite
const eliteStart = content.indexOf('onChange={(e) => setEliteDesc(e.target.value)}');
const nextClassName = content.indexOf('className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-semibold"', eliteStart);
if (eliteStart !== -1 && nextClassName !== -1) {
    const toReplace = content.substring(eliteStart, nextClassName);
    content = content.replace(toReplace, 'onChange={(e) => setEliteDesc(e.target.value)}\n                ');
}

// Fix CTA
const ctaStart = content.indexOf('onChange={(e) => setCtaEnquiryBtnUrl(e.target.value)}');
const nextCtaClass = content.indexOf('className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"', ctaStart);
if (ctaStart !== -1 && nextCtaClass !== -1) {
    const toReplace = content.substring(ctaStart, nextCtaClass);
    content = content.replace(toReplace, 'onChange={(e) => setCtaEnquiryBtnUrl(e.target.value)}\n                  ');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done replacement');
