const fs = require('fs');
const path = 'd:/KMCT/KSBM/frontend/src/features/admin/cms/ManageAdmissionsPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace literal '\n' string output with actual newlines
content = content.replace(/\\n/g, '\n');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed literal newlines');
