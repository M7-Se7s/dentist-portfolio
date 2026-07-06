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
            
            // Adjust imports for files that moved one level deeper
            content = content.replace(/from '\.\.\/\.\.\/\.\.\/lib\//g, "from '../../../../lib/");
            content = content.replace(/from '\.\.\/\.\.\/\.\.\/components\//g, "from '../../../../components/");

            content = content.replace(/from '\.\.\/\.\.\/lib\//g, "from '../../../lib/");
            content = content.replace(/from '\.\.\/\.\.\/components\//g, "from '../../../components/");
            
            content = content.replace(/from '\.\.\/lib\//g, "from '../../lib/");
            content = content.replace(/from '\.\.\/components\//g, "from '../../components/");

            if (content !== originalContent) {
                fs.writeFileSync(file, content, 'utf8');
                console.log('Updated: ' + file);
            }
        }
    });
    return results;
}

walk('l:/sites/mohamed-shabaan/src/app/[locale]');
