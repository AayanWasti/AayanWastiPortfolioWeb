CAREER-OPS PORTFOLIO PACKAGE

Includes:
  src/content/projects/career-ops.md
  public/projects/career-ops/cover.png
  scripts/add-career-ops-art.cjs (optional one-time card-art patch)

Use PowerShell to install:

  Expand-Archive -Path "$env:USERPROFILE\Downloads\career-ops-portfolio-ready.zip" -DestinationPath "$env:USERPROFILE\Desktop\AayanWastiPortfolioWeb" -Force

  cd "$env:USERPROFILE\Desktop\AayanWastiPortfolioWeb"

  node scripts/add-career-ops-art.cjs

  npm.cmd run dev

Open: http://localhost:5173/#projects/career-ops

NOTES:
- The one-time script patches ProjectArt.tsx in place and makes a .backup of it.
  It does not overwrite your other project components or content.
- cover.png is an original editorial graphic, NOT a screenshot of the Career-Ops UI.
- This article is about merged PR #6719, not authorship of the Career-Ops project.
- No changes are deployed automatically.
