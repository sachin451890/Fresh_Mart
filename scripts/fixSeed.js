const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'seedProducts.js');
let content = fs.readFileSync(file, 'utf-8');
content = content.replace(/originalPrice"\s*:/g, 'originalPrice:');
fs.writeFileSync(file, content);
console.log('Cleaned seedProducts.js');
