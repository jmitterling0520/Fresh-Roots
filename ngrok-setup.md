# Ngrok Setup Guide - Expose Your Local Server

This guide will help you expose your Fresh Roots website (running on port 8080) to the internet using ngrok.

---

## Step 1: Install Ngrok

### Option A: Using Homebrew (macOS - Recommended)
```bash
brew install ngrok/ngrok/ngrok
```

### Option B: Direct Download
1. Visit: https://ngrok.com/download
2. Download for macOS
3. Extract and place in your PATH or use directly

### Option C: Using npm (if you have npm)
```bash
npm install -g ngrok
```

---

## Step 2: Sign Up for Ngrok Account (Free)

1. **Create Account:**
   - Visit: https://dashboard.ngrok.com/signup
   - Sign up with email or GitHub account
   - Free tier includes: 1 tunnel, random URLs, HTTP/HTTPS

2. **Get Your Authtoken:**
   - After signing up, go to: https://dashboard.ngrok.com/get-started/your-authtoken
   - Copy your authtoken

3. **Configure Ngrok:**
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
   ```
   Replace `YOUR_AUTHTOKEN_HERE` with your actual authtoken from the dashboard.

---

## Step 3: Start Your Local Server

First, make sure your Next.js development server is running on port 8080:

```bash
cd "/Users/James/Documents/Fresh Roots"
./start-server.sh
```

Or manually:
```bash
cd "/Users/James/Documents/Fresh Roots/Website"
npm run dev -- -p 8080
```

**Keep this terminal window open** - your server must be running for ngrok to work.

---

## Step 4: Start Ngrok Tunnel

### Option A: Basic Tunnel (Random URL Each Time)

Open a **new terminal window** and run:

```bash
ngrok http 8080
```

This will:
- Create a tunnel to your local port 8080
- Display a forwarding URL (like `https://abc123.ngrok-free.app`)
- Show a web interface at `http://127.0.0.1:4040` to monitor requests

### Option B: Custom Domain (Requires Paid Plan)

If you have a paid ngrok account:
```bash
ngrok http 8080 --domain=your-custom-domain.ngrok-free.app
```

---

## Step 5: Access Your Website

Once ngrok is running, you'll see output like:

```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:8080
```

**Copy the HTTPS URL** and share it with others or access it yourself!

**Important Notes:**
- The free tier gives you a **random URL each time** you start ngrok
- URL is active as long as ngrok is running
- Anyone with the URL can access your local server
- Stop ngrok (Ctrl+C) when you're done

---

## Using the Script

I've created a script (`start-ngrok.sh`) that makes this easier. See that file for automated setup.

---

## Troubleshooting

### Port Already in Use
If you see "address already in use":
- Make sure nothing else is using port 8080
- Check: `lsof -i :8080`

### Ngrok Not Found
If you get "command not found":
- Make sure ngrok is installed and in your PATH
- Try using full path: `/path/to/ngrok http 8080`

### Authtoken Error
If you see authtoken errors:
- Run: `ngrok config add-authtoken YOUR_TOKEN`
- Check your token at: https://dashboard.ngrok.com/get-started/your-authtoken

### Connection Refused
If ngrok can't connect:
- Make sure your local server is running on port 8080
- Check the server is accessible locally at: http://localhost:8080

---

## Ngrok Web Interface

While ngrok is running, visit:
- **URL:** http://127.0.0.1:4040
- Shows: Request inspector, response headers, replay requests, and more

---

## Security Considerations

⚠️ **Important:**
- **Anyone with your ngrok URL can access your site**
- Don't expose sensitive data without authentication
- Stop ngrok when not in use
- Consider password protection for development

### Add Password Protection (Optional):
```bash
ngrok http 8080 --basic-auth="username:password"
```

---

## Stopping Ngrok

- Press **Ctrl+C** in the terminal where ngrok is running
- This closes the tunnel and makes the URL inaccessible

---

## Quick Reference

**Start local server:**
```bash
cd "/Users/James/Documents/Fresh Roots"
./start-server.sh
```

**Start ngrok (in new terminal):**
```bash
ngrok http 8080
```

**Check if server is running:**
```bash
curl http://localhost:8080
```

**View ngrok web interface:**
Open browser to: http://127.0.0.1:4040

---

## Helpful Links

- **Ngrok Dashboard:** https://dashboard.ngrok.com
- **Ngrok Documentation:** https://ngrok.com/docs
- **Ngrok Pricing:** https://ngrok.com/pricing

---

**Last Updated:** January 2025
