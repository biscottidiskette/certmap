# CertMap — Development Environment Setup
> Ubuntu 22.04 LTS — clean install assumed. Git and VSCode assumed installed.

---

## Step 1 — Install nvm (Node Version Manager)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Close and reopen your terminal after this completes, then verify:
```bash
nvm --version
```

---

## Step 2 — Install Node.js 20 LTS
```bash
nvm install 20
nvm use 20
nvm alias default 20
```

Verify:
```bash
node --version   # should say v20.x.x
npm --version    # should say 10.x.x
```

---

## Step 3 — Install VSCode Extensions

Open VSCode and install the following. You can paste each ID into the Extensions panel search bar or run the commands below:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
code --install-extension PKief.material-icon-theme
code --install-extension christian-kohler.path-intellisense
code --install-extension usernamehw.errorlens
```

| Extension | Purpose |
|---|---|
| ESLint | Catches JS/React errors as you type |
| Prettier | Auto formats on save |
| ES7 React Snippets | Shorthand for React boilerplate |
| Tailwind IntelliSense | Autocomplete (future proofing) |
| Material Icon Theme | File tree icons, easier navigation |
| Path Intellisense | Autocompletes import paths |
| Error Lens | Surfaces errors inline instead of hover |

---

## Step 4 — Create the project folder
```bash
mkdir certmap
cd certmap
git init
```

---

## Step 5 — Create the monorepo structure
```bash
mkdir -p server/routes server/lib client/src/components client/src/data client/src/store client/src/api
```

Verify the structure looks right:
```bash
find . -type d | sort
```

Expected output:
```
.
./client
./client/src
./client/src/api
./client/src/components
./client/src/data
./client/src/store
./server
./server/lib
./server/routes
```

---

## Step 6 — Create the .env file
```bash
touch .env
echo "GROQ_API_KEY=your_key_here" >> .env
```

Get your Groq API key at: https://console.groq.com

---

## Step 7 — Install dependencies (after PR-01 scaffold is in place)

From the project root:
```bash
npm install
```

This installs everything — root, server, and client — in one command via the root package.json workspaces config.

---

## Step 8 — Run the dev server (after all PRs are merged)
```bash
npm run dev
```

This starts both the Express backend (port 3001) and Vite frontend (port 5173) concurrently. Open your browser at `http://localhost:5173`.

---

## Notes

- Never commit `.env` — it is in `.gitignore` by default from PR-01
- The `.env.example` file in the repo shows the required keys without values — update it if new env vars are added
- Node version is pinned in `.nvmrc` — if you ever reinstall, run `nvm use` from the project root and it will restore the correct version
