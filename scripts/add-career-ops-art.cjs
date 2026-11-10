// Optional one-time patch for the career-ops project card artwork.
// Run from the portfolio root: node scripts/add-career-ops-art.cjs
const fs = require('node:fs');
const path = require('node:path');
const target = path.join(process.cwd(), 'src', 'components', 'ProjectArt.tsx');
if (!fs.existsSync(target)) throw new Error('ProjectArt.tsx not found; run from the portfolio root.');
const code = fs.readFileSync(target, 'utf8');
if (code.includes('key === "career-ops"')) { console.log('Career-Ops artwork already exists.'); process.exit(0); }
const anchor = '  if (key === "carenest") return (';
if (!code.includes(anchor)) throw new Error('Could not find a safe insertion point. Your ProjectArt.tsx may have changed.');
const addition = `  if (key === "career-ops") return (
    <div className="project-art" style={{ background: '#19212d', color: '#e6e4d9' }} aria-hidden="true">
      <svg viewBox="0 0 400 250" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}>
        <rect x="32" y="58" width="145" height="98" rx="7" stroke="currentColor" strokeWidth="0.8" />
        <rect x="226" y="58" width="145" height="98" rx="7" stroke="currentColor" strokeWidth="0.8" />
        <path d="M177 108h49M213 102l13 6-13 6" stroke="#dd7627" strokeWidth="1.2" />
        <path d="M47 79h86M47 90h105M47 101h73M47 112h96M47 123h113" stroke="currentColor" strokeWidth="0.9" strokeOpacity=".3" />
        <path d="M241 84h114M241 98h78M241 112h99" stroke="currentColor" strokeWidth="1" strokeOpacity=".35" />
        <circle cx="241" cy="134" r="3" fill="#dd7627" />
      </svg>
      <span className="art-title">career<span className="italic">-ops</span></span>
    </div>
  )
`;
fs.copyFileSync(target, target+'.backup');
fs.writeFileSync(target, code.replace(anchor, addition + anchor), 'utf8');
console.log('Added Career-Ops artwork. Original backed up to ProjectArt.tsx.backup');
