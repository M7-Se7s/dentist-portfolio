const fs = require('fs');
const file = 'src/app/[locale]/admin/dashboard/cases/page.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove buttons from header
const headerButtonsRegex = /\{\/\*\s*Desktop Buttons - Hidden on Mobile\s*\*\/\}.*?<\/div>\s*<\/div>/s;
content = content.replace(headerButtonsRegex, '</div>');

// 2. Insert buttons into the Filters Wrapper
// The filters wrapper ends with:
//                         {option === "All" ? "All Categories" : option}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//
//         <div className={styles.caseCardGrid}>

const targetSearch = '                  ))}\n                </div>\n              )}\n            </div>\n          </div>';
const replacement = targetSearch + '\n\n          {/* Action Buttons */}\n          <div className={${styles.desktopBtn} } style={{ flex: "1 1 auto", justifyContent: "flex-end" }}>\n            <Link href="/admin/dashboard/create-case?type=detailed" className={styles.newCaseBtn} style={{ border: "none", cursor: "pointer", textDecoration: "none" }}>\n              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>\n              <span className={styles.newCaseBtnText}>Add Detailed Case</span>\n            </Link>\n            <Link href="/admin/dashboard/create-case?type=light" className={styles.newCaseBtn} style={{ border: "none", cursor: "pointer", textDecoration: "none", backgroundColor: "var(--bg-secondary)", color: "var(--primary-color)" }}>\n              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>\n              <span className={styles.newCaseBtnText}>Add Simple Case</span>\n            </Link>\n          </div>';

content = content.replace(targetSearch, replacement);

fs.writeFileSync(file, content, 'utf8');
