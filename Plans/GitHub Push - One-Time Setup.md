# One-Time Setup: GitHub Push from Cursor

So that Cursor (and the AI) can run `git push` to GitHub without failing on credentials, do this **once**.

---

## 1. Store your GitHub credentials in the keychain

Your Git is already set to use **osxkeychain** (macOS Keychain). You just need to perform **one successful push** from a place where you can type your credentials; after that, they’re stored and Cursor can use them.

### Option A: Push once from Cursor’s Terminal (recommended)

1. In Cursor, open the **Terminal** (e.g. **Terminal → New Terminal** or `` Ctrl+` ``).
2. In the project root, run:
   ```bash
   cd "/Users/James/Documents/Fresh Roots"
   git push origin main
   ```
3. When Git asks for **Username**, enter your GitHub username (e.g. `jmitterling0520`).
4. When Git asks for **Password**, **do not** use your GitHub account password. Use a **Personal Access Token**:
   - Go to [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens).
   - **Tokens (classic)** → **Generate new token (classic)**.
   - Name it (e.g. “Cursor / Fresh Roots”), choose an expiry, and enable at least **repo**.
   - Generate, copy the token, and paste it when Git asks for the password.
5. After the push succeeds, the token is stored in the Keychain. Future pushes (including when the AI runs `git push` with full permissions) will use it without asking.

### Option B: Use GitHub CLI

If you prefer:

```bash
brew install gh
gh auth login
```

Follow the prompts (browser or token). Then run `git push origin main` once from the Terminal. After that, Cursor’s runs of `git push` (with full permissions) can use the same auth.

---

## 2. Cursor rule (already added)

A project rule in **.cursor/rules/git-push-github.mdc** tells the AI to run `git push` with **full permissions** so it can read the Keychain. No extra setup needed from you.

---

## Summary

| Step | What to do |
|------|------------|
| 1 | Run `git push origin main` once from **Cursor’s Terminal** (or after `gh auth login`). |
| 2 | When prompted, use your GitHub username and a **Personal Access Token** (not your account password). |
| 3 | After that, the AI can run `git push` from Cursor and it should succeed. |

If push still fails when the AI runs it, say so and we can try SSH or another approach.
