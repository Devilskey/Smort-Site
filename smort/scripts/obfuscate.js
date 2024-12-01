const fs = require('fs-extra');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Define the directory containing the built JavaScript files
const buildDir = path.join(__dirname, '../build/static/js');

// Obfuscate all .js files in the build directory
fs.readdirSync(buildDir).forEach(file => {
    if (file.endsWith('.js')) {
        const filePath = path.join(buildDir, file);
        const code = fs.readFileSync(filePath, 'utf8');
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
            compact: true, // Minimize the code
            controlFlowFlattening: true, // Adds extra obfuscation logic
        }).getObfuscatedCode();
        fs.writeFileSync(filePath, obfuscatedCode);
        console.log(`Obfuscated: ${file}`);
    }
});