const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace hex colors in tailwind brackets
    content = content.replace(/\[#696CFF\]/g, 'primary');
    content = content.replace(/\[#E7E7FF\]/g, 'primary/10');
    
    // Replace standalone hex (like in sweetalert confirmButtonColor)
    content = content.replace(/'#696CFF'/g, "'var(--color-primary)'");
    
    // Replace arbitrary rgba shadow
    content = content.replace(/rgba\(105,108,255,0\.4\)/g, 'var(--color-primary)');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
