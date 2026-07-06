const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(file, 'utf8');
            let originalContent = content;
            
            // Replace any number of ../ that lead to lib, components, or styles with @/
            content = content.replace(/(['"])((?:\.\.\/)+)(lib|components|styles)\//g, "$1@/$3/");

            if (content !== originalContent) {
                fs.writeFileSync(file, content, 'utf8');
                console.log('Updated to aliases: ' + file);
            }
        }
    });
    return results;
}

walk('l:/sites/mohamed-shabaan/src/app/[locale]');
