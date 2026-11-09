"""Regenerate the footer's source download with Python's standard library."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
archive = root / 'public' / 'aayan-wasti-source.zip'
root_files = [
    '.gitignore', 'README.md', 'WINDOWS-START-HERE.md', 'AGENTS.md', 'CLAUDE.md', 'index.html', 'contrast-audit.py',
    'package.json', 'package-lock.json', 'pnpm-lock.yaml',
    'tsconfig.json', 'vite.config.ts',
]
files = [root / name for name in root_files if (root / name).is_file()]
for directory in ['src', 'public', 'scripts']:
    files.extend(path for path in (root / directory).rglob('*')
                 if path.is_file() and path != archive and '__pycache__' not in path.parts)
with ZipFile(archive, 'w', ZIP_DEFLATED) as bundle:
    for path in sorted(files):
        bundle.write(path, 'aayan-wasti-portfolio/' + path.relative_to(root).as_posix())
print(f'Source download: {archive.name} ({len(files)} files)')
