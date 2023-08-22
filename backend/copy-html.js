const fs = require('fs-extra');


const srcPath = 'public/'; 
const destPath = 'dist/public/'; 

// Copy the HTML file
fs.copySync(srcPath, destPath);

console.log(`Copied ${srcPath} to ${destPath}`);
