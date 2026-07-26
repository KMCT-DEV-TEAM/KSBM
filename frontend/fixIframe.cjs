const fs = require('fs');
const path = require('path');

const dir = 'd:\\KMCT\\projects\\ksbm\\KSBM\\frontend\\src\\features\\admin\\cms';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

let totalUpdated = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the useEffect block that sends the postMessage
  const regex = /useEffect\(\(\) => \{\s*if \(isPreviewModalOpen && iframeRef\.current\) \{\s*setTimeout\(\(\) => \{\s*if \(iframeRef\.current && iframeRef\.current\.contentWindow\) \{\s*iframeRef\.current\.contentWindow\.postMessage\(\s*(\{\s*type:\s*'[^']+',\s*(?:componentName:\s*'[^']+',\s*)?payload:\s*(?:previewData|pData)\s*\})\s*,\s*'\*'\s*\);\s*\}\s*\},\s*500\);\s*if \(iframeRef\.current\.contentWindow\) \{\s*iframeRef\.current\.contentWindow\.postMessage\(\s*(\{\s*type:\s*'[^']+',\s*(?:componentName:\s*'[^']+',\s*)?payload:\s*(?:previewData|pData)\s*\})\s*,\s*'\*'\s*\);\s*\}\s*\}\s*\},\s*\[([^\]]+)\]\);/g;

  if (regex.test(content)) {
    content = content.replace(regex, (match, msg1, msg2, deps) => {
      return `useEffect(() => {
    let interval;
    if (isPreviewModalOpen && iframeRef.current) {
      const sendData = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(${msg1}, '*');
        }
      };
      
      sendData();
      
      let count = 0;
      interval = setInterval(() => {
        sendData();
        count++;
        if (count > 10) clearInterval(interval);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [${deps}]);`;
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
    totalUpdated++;
  }
});

console.log('Total files updated: ' + totalUpdated);
