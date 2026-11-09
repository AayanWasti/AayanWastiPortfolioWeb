# Run the latest portfolio on Windows

This ZIP contains the complete portfolio source, including the latest local HealthBot case study, its two historical screenshots, the press feature, all other pages, and the binary galaxy. It does not change the deployed website.

## 1. Install Node.js

Install Node.js **24 LTS** for Windows from https://nodejs.org/ and reopen your terminal after installation. Node includes npm.

## 2. Extract the ZIP

Right-click the downloaded ZIP and choose **Extract All**. Open the extracted `aayan-wasti-portfolio` folder. It must contain `package.json`, `package-lock.json`, `src`, and `public`.

Do not run the project while it is still inside the ZIP.

## 3. Open a terminal in that folder

In File Explorer, right-click inside the project folder and choose **Open in Terminal**. Alternatively, type `powershell` in File Explorer's address bar and press Enter.

Check Node is available:

```powershell
node --version
npm.cmd --version
```

## 4. Install and run

```powershell
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort --force
```

Using `npm.cmd` works in PowerShell without changing its script execution policy. The first command installs the exact dependency versions in `package-lock.json`, including Windows-compatible native packages. An internet connection is needed for this install.

Keep this terminal running. Open:

**http://localhost:5173/#projects/healthbot**

The homepage is **http://localhost:5173/#home**.

This local preview does not use Codex's preview relay. The hosted `chatgpt.site` portfolio remains the previous published version.

## If you see an old page or a port error

- Use the exact `localhost` address above, not the hosted portfolio URL.
- Stop any older server on port 5173 in its terminal using **Ctrl+C**, then rerun the command from this newly extracted folder. `--strictPort` prevents accidentally starting on a different port.
- Hard-refresh with **Ctrl+Shift+R**.
- The current HealthBot draft ends with one box titled **Editorial follow-up — two details still need my input**. It covers the unverified response-cutoff fix and later individual team responsibilities. The medical scope is normal prose, not another placeholder box.

## Check the build

In another terminal opened in the same project folder:

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
```

## Editing content

- HealthBot: `src/content/projects/healthbot.md`
- HealthBot images: `public/projects/healthbot/`
- Other project write-ups: `src/content/projects/`
- Perspectives: `src/content/perspectives.ts`
- Ideas, notes and exploration entries: `src/content/collections.ts`

No API keys, database, backend service, Python, or cloud hosting account are needed to run the portfolio. This is the portfolio and case study, not the separate HealthBot assistant application. Optional Python utilities are for regenerating source archives or auditing the site; they are not part of the viewing or build steps.

The ZIP includes dependency configuration and lockfiles. It deliberately excludes `node_modules`, generated build output, Git history, cloud hosting identity, and environment files. Do not copy Linux `node_modules` onto Windows; use `npm.cmd ci` as above.
