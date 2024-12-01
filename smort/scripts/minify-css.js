const fs = require('fs-extra');
const path = require('path');
const cssnano = require('cssnano');
const postcss = require('postcss');

const cssDir = path.join(__dirname, '../build/static/css');

fs.readdirSync(cssDir).forEach(async file => {
    if (file.endsWith('.css')) {
        const filePath = path.join(cssDir, file);
        const css = fs.readFileSync(filePath, 'utf8');

        const result = await postcss([cssnano]).process(css, { from: undefined });
        fs.writeFileSync(filePath, result.css);

        console.log(`Minified: ${file}`);
    }
});