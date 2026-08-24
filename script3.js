const fs = require('fs');
const file = 'src/app/[locale]/admin/dashboard/cases/page.js';
let content = fs.readFileSync(file, 'utf8');

const headerButtonsRegex = /\{\/\*\s*Desktop Buttons - Hidden on Mobile\s*\*\/\}.*?<\/div>\s*<\/div>/s;
content = content.replace(headerButtonsRegex, '</div>');

const insertRegex = /<\/div>\s*<\/div>\s*<div className=\{styles\.caseCardGrid\}>/s;

const replacement = `
          </div>

          {/* Action Buttons */}
          <div className={\`\${styles.desktopBtn} \${styles.caseActionButtons}\`} style={{ flex: "1 1 auto", justifyContent: "flex-end" }}>
            <Link href="/admin/dashboard/create-case?type=detailed" className={styles.newCaseBtn} style={{ border: "none", cursor: "pointer", textDecoration: "none" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              <span className={styles.newCaseBtnText}>Add Detailed Case</span>
            </Link>
            <Link href="/admin/dashboard/create-case?type=light" className={styles.newCaseBtn} style={{ border: "none", cursor: "pointer", textDecoration: "none", backgroundColor: "var(--bg-secondary)", color: "var(--primary-color)" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              <span className={styles.newCaseBtnText}>Add Simple Case</span>
            </Link>
          </div>
        </div>

        <div className={styles.caseCardGrid}>`;

content = content.replace(insertRegex, replacement);

fs.writeFileSync(file, content, 'utf8');
