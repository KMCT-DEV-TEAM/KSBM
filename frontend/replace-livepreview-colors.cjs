const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src/features/admin', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace indigo classes in the Live Preview button
    content = content.replace(/bg-indigo-50/g, 'bg-primary/10');
    content = content.replace(/text-indigo-600/g, 'text-primary');
    content = content.replace(/border-indigo-100/g, 'border-primary/20');
    content = content.replace(/hover:bg-indigo-100/g, 'hover:bg-primary/20');
    content = content.replace(/hover:border-indigo-200/g, 'hover:border-primary/30');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated Live Preview Button in: ' + filePath);
    }
  }
});
