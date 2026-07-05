# SUEU Voting System — UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) for syntax tracking.

**Goal:** Replace all legacy UI pages with a consistent, modern Tailwind CSS redesign serving both student voters and admin election officials.

**Architecture:** 10 standalone HTML pages, each self-contained with inline Tailwind config. Tailwind via CDN, no build step. A shared `<script>` block configures the custom brand color palette. Admin pages share a left-sidebar + top-bar layout.

**Tech Stack:** Tailwind CSS 3 (CDN), Inter (Google Fonts), Font Awesome 6 Free (CDN), vanilla JS.

## Global Constraints
- Tailwind via CDN only (`https://cdn.tailwindcss.com`)
- No build step, no npm packages, no bundlers
- Custom brand green palette via `tailwind.config` in each page
- Inter font loaded via Google Fonts `<link>`
- Font Awesome 6 via CDN `<link>`
- Every page must be responsive (mobile-first)
- All legacy pages (`contreg.html`, `voiting.html`, `w3sidebar.html`, `js/home.js`) removed at end
- Existing images preserved (`images/logo.png`, `images/_DSC0497.JPG`, `images/_DSC0909.JPG`)

---

### Task 1: Shared Setup — Admin Directory + Common Snippet Reference

**Files:**
- Create: `admin/` directory
- Create reference snippet to be used across all pages

**Interfaces:**
- Consumes: nothing
- Produces: standard Tailwind config block, admin sidebar HTML pattern

- [ ] **Step 1: Create `admin/` directory**

```bash
mkdir -p admin
```

- [ ] **Step 2: Create the reference config snippet file**

This file is not loaded by pages (pages are self-contained) but serves as the canonical snippet to copy into each task's HTML head.

Write to `docs/superpowers/plans/tailwind-config-snippet.md`:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#28a745',
          600: '#218838',
          700: '#1a6b2e',
          800: '#145224',
          900: '#0f3d1b',
        }
      }
    }
  }
}
</script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
  body { font-family: 'Inter', sans-serif; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add admin/ docs/superpowers/plans/tailwind-config-snippet.md
git commit -m "chore: create admin dir and config snippet reference"
```

---

### Task 2: Login Page

**Files:**
- Create: `login.html`

**Interfaces:**
- Consumes: Task 1 config snippet
- Produces: login page at `/login.html`

- [ ] **Step 1: Write `login.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login | SUEU Voting System</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#28a745', 600: '#218838', 700: '#1a6b2e', 800: '#145224', 900: '#0f3d1b' }
        }
      }
    }
  }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
    <div class="text-center mb-8">
      <img src="images/logo.png" alt="Egerton Logo" class="h-16 mx-auto">
      <h1 class="text-2xl font-extrabold text-brand-600 mt-4">SUEU Voting</h1>
      <p class="text-gray-500 text-sm mt-1">Secure Student Login</p>
    </div>
    <form action="ballot.html" method="post" class="space-y-5">
      <div>
        <label for="reg" class="block text-sm font-semibold text-gray-700 mb-1">Registration Number</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><i class="fa fa-user"></i></span>
          <input type="text" name="regno" id="reg" required placeholder="e.g. S13/12345/21" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition">
        </div>
      </div>
      <div>
        <label for="pas" class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><i class="fa fa-lock"></i></span>
          <input type="password" name="password" id="pas" required placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition">
        </div>
      </div>
      <button type="submit" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:-translate-y-0.5">Login to Vote</button>
      <div class="text-center">
        <a href="forgot.jsp" class="text-sm text-gray-500 hover:text-brand-500 transition">Forgot your password?</a>
      </div>
      <hr class="border-gray-200">
      <p class="text-center text-sm text-gray-500">Don't have an account? <a href="register.html" class="text-brand-600 font-semibold hover:underline">Register Here</a></p>
    </form>
  </div>
</body>
</html>
```

- [ ] **Step 2: Verify page renders**

Open in browser or check HTML is well-formed.

- [ ] **Step 3: Commit**

```bash
git add login.html
git commit -m "feat: redesign login page with Tailwind CSS"
```

---

### Task 3: Register Page

**Files:**
- Modify: `register.html`

- [ ] **Step 1: Overwrite `register.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register | SUEU Voting System</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#28a745',600:'#218838',700:'#1a6b2e',800:'#145224',900:'#0f3d1b'}}}}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>body{font-family:'Inter',sans-serif}</style>
</head>
<body class="bg-gray-50 min-h-screen py-10 px-4">
  <nav class="max-w-2xl mx-auto mb-6 flex items-center justify-between bg-white rounded-xl shadow-sm px-6 py-4">
    <img src="images/logo.png" alt="Egerton Logo" class="h-10">
    <div class="flex gap-4 text-sm text-gray-600">
      <a href="#" class="hover:text-brand-500 transition"><i class="fa fa-home"></i> Home</a>
      <a href="#" class="hover:text-brand-500 transition"><i class="fa fa-refresh"></i> Status</a>
    </div>
  </nav>
  <div class="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-extrabold text-brand-600">Registration</h2>
      <p class="text-gray-500 text-sm mt-1">Create a voting account</p>
    </div>
    <form action="ballot.html" method="post" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
          <input type="text" name="fname" required placeholder="John" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
          <input type="text" name="lname" required placeholder="Doe" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Registration Number</label>
        <input type="text" name="regno" required placeholder="S13/XXXXX/XX" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition">
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Faculty</label>
        <select name="faculty" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition bg-white">
          <option value="" disabled selected>Choose your faculty</option>
          <option value="Science">Science</option>
          <option value="Education">Education</option>
          <option value="Agriculture">Agriculture</option>
          <option value="ferd">Environment and Source Development</option>
          <option value="fass">Faculty of Art and Social Science</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Residence / Hall</label>
        <select name="halls" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition bg-white">
          <option value="" disabled selected>Choose your residence</option>
          <option value="non_res">Non Resident</option>
          <option value="buruburu">Buruburu</option>
          <option value="Maringo">Maringo</option>
          <option value="Tatoon">Tatoon</option>
          <option value="River-side">River Side</option>
          <option value="River_view">River View</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <input type="password" name="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition">
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
        <input type="password" name="confirm_password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition">
      </div>
      <button type="submit" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-lg transition duration-200 transform hover:-translate-y-0.5">Create Account</button>
    </form>
  </div>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add register.html
git commit -m "feat: redesign registration page with Tailwind CSS"
```

---

### Task 4: Ballot Page

**Files:**
- Modify: `ballot.html` (overwrite existing voting.html content into ballot.html, or keep voting.html→ballot.html redirect)

Note: The old `voting.html` and `voiting.html` both exist. The ballot page was `voting.html`. We'll keep `ballot.html` as the primary file and remove `voiting.html` later.

- [ ] **Step 1: Write `ballot.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Ballot | SUEU</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#28a745',600:'#218838',700:'#1a6b2e',800:'#145224',900:'#0f3d1b'}}}}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    body{font-family:'Inter',sans-serif;background:#f0f2f5;padding-top:80px}
    input[type="radio"]:checked+div{border-color:#28a745;background:#f8fff9}
  </style>
</head>
<body>
  <nav class="fixed top-0 left-0 right-0 bg-white shadow-sm px-6 py-3 flex items-center gap-3 z-50">
    <img src="images/logo.png" alt="logo" class="h-9">
    <span class="font-bold text-brand-600 text-lg tracking-wide">SUEU DIGITAL BALLOT</span>
  </nav>
  <div class="max-w-6xl mx-auto px-4 pb-12">
    <form action="confirm.html">
      <div class="bg-brand-500 text-white px-5 py-3 rounded-lg font-bold uppercase tracking-wider text-sm mt-4">Chairman</div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        <label class="cursor-pointer">
          <input type="radio" name="chairman" value="Evans" class="hidden" required>
          <div class="bg-white rounded-xl p-4 text-center border-2 border-transparent transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <img src="images/_DSC0909.JPG" class="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-4 border-gray-100">
            <span class="font-bold text-gray-800 block">Evans</span>
            <span class="text-xs text-gray-400">Select Candidate</span>
          </div>
        </label>
        <label class="cursor-pointer">
          <input type="radio" name="chairman" value="Collins" class="hidden">
          <div class="bg-white rounded-xl p-4 text-center border-2 border-transparent transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <img src="images/_DSC0497.JPG" class="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-4 border-gray-100">
            <span class="font-bold text-gray-800 block">Collins</span>
            <span class="text-xs text-gray-400">Select Candidate</span>
          </div>
        </label>
      </div>
      <div class="bg-brand-500 text-white px-5 py-3 rounded-lg font-bold uppercase tracking-wider text-sm mt-8">Vice Chairman</div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        <label class="cursor-pointer">
          <input type="radio" name="vice_chairman" value="Evans_V" class="hidden" required>
          <div class="bg-white rounded-xl p-4 text-center border-2 border-transparent transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <img src="images/_DSC0909.JPG" class="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-4 border-gray-100">
            <span class="font-bold text-gray-800 block">Evans</span>
            <span class="text-xs text-gray-400">Select Candidate</span>
          </div>
        </label>
        <label class="cursor-pointer">
          <input type="radio" name="vice_chairman" value="Collins_V" class="hidden">
          <div class="bg-white rounded-xl p-4 text-center border-2 border-transparent transition-all duration-200 hover:shadow-md hover:-translate-y-1">
            <img src="images/_DSC0497.JPG" class="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-4 border-gray-100">
            <span class="font-bold text-gray-800 block">Collins</span>
            <span class="text-xs text-gray-400">Select Candidate</span>
          </div>
        </label>
      </div>
      <div class="text-center mt-8">
        <button type="submit" class="bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 px-12 rounded-full text-lg shadow-lg transition duration-200 transform hover:-translate-y-0.5">Review &amp; Cast Vote</button>
      </div>
    </form>
  </div>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add ballot.html
git commit -m "feat: redesign ballot page with Tailwind CSS"
```

---

### Task 5: Confirm Page

**Files:**
- Modify: `confirm.html`

- [ ] **Step 1: Overwrite `confirm.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Ballot | SUEU</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#28a745',600:'#218838',700:'#1a6b2e',800:'#145224',900:'#0f3d1b'}}}}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>body{font-family:'Inter',sans-serif;background:#f4f7f6}</style>
</head>
<body class="min-h-screen py-10 px-4">
  <nav class="max-w-2xl mx-auto mb-6 bg-white rounded-xl shadow-sm px-6 py-4 flex items-center justify-between">
    <img src="images/logo.png" alt="Egerton Logo" class="h-10">
    <span class="text-sm text-gray-500 font-semibold">Step 2: Final Confirmation</span>
  </nav>
  <div class="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
    <div class="bg-brand-50 px-8 py-6 text-center border-b-2 border-brand-500">
      <i class="fa-solid fa-circle-check text-brand-500 text-3xl"></i>
      <h3 class="text-xl font-extrabold text-brand-600 mt-2">Review Your Ballot</h3>
      <p class="text-sm text-gray-500">Please ensure these are your final choices.</p>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <th class="px-6 py-4 font-semibold">Position</th>
            <th class="px-6 py-4 font-semibold">Chosen Candidate</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr><td class="px-6 py-4 text-gray-600">Chairman</td><td class="px-6 py-4 font-bold text-gray-800">Collins</td></tr>
          <tr><td class="px-6 py-4 text-gray-600">Vice Chairman</td><td class="px-6 py-4 font-bold text-gray-800">Evans</td></tr>
          <tr><td class="px-6 py-4 text-gray-600">Secretary General</td><td class="px-6 py-4 font-bold text-gray-800">Mavin</td></tr>
          <tr><td class="px-6 py-4 text-gray-600">Academics</td><td class="px-6 py-4 font-bold text-gray-800">Shaddy</td></tr>
        </tbody>
      </table>
    </div>
    <div class="px-8 py-5 bg-gray-50 flex items-center justify-between">
      <a href="ballot.html" class="text-gray-500 hover:text-red-500 transition text-sm font-medium"><i class="fa fa-arrow-left"></i> Edit Choices</a>
      <button onclick="document.getElementById('confirmModal').classList.remove('hidden')" class="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition">Cast Vote</button>
    </div>
  </div>
  <div id="confirmModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl">
      <i class="fa-solid fa-shield-halved text-yellow-500 text-5xl mb-4"></i>
      <h4 class="text-lg font-extrabold text-gray-800 mb-2">Final Submission</h4>
      <p class="text-sm text-gray-600 mb-6">Once you click <strong>Confirm</strong>, your vote will be encrypted and submitted. This action cannot be undone.</p>
      <div class="flex gap-3 justify-center">
        <button onclick="document.getElementById('confirmModal').classList.add('hidden')" class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition">Go Back</button>
        <a href="success.html" class="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg transition">Confirm &amp; Submit</a>
      </div>
    </div>
  </div>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add confirm.html
git commit -m "feat: redesign confirm ballot page with Tailwind CSS"
```

---

### Task 6: Success Page

**Files:**
- Create: `success.html`

- [ ] **Step 1: Write `success.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vote Submitted | SUEU</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#28a745',600:'#218838',700:'#1a6b2e',800:'#145224',900:'#0f3d1b'}}}}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>body{font-family:'Inter',sans-serif;background:#f0f2f5}</style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center">
    <div class="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <i class="fa-solid fa-check text-brand-500 text-4xl"></i>
    </div>
    <h1 class="text-2xl font-extrabold text-gray-800">Vote Recorded!</h1>
    <p class="text-gray-500 mt-2">Your vote has been successfully encrypted and submitted.</p>
    <div class="bg-gray-50 rounded-lg px-4 py-3 mt-6 text-sm text-gray-600">
      <span class="font-semibold">Receipt:</span> SUEU-2026-<span class="font-mono">A7X3K9</span>
    </div>
    <p class="text-xs text-gray-400 mt-2">Keep this receipt for your records.</p>
    <div class="mt-8 space-y-3">
      <a href="results.html" class="block w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-lg transition">View Live Results</a>
      <a href="login.html" class="block w-full border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-3 rounded-lg transition">Logout</a>
    </div>
  </div>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add success.html
git commit -m "feat: create success page with Tailwind CSS"
```

---

### Task 7: Results Page

**Files:**
- Modify: `results.html`

- [ ] **Step 1: Overwrite `results.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Results | SUEU Voting System</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#28a745',600:'#218838',700:'#1a6b2e',800:'#145224',900:'#0f3d1b'}}}}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>body{font-family:'Inter',sans-serif;background:#f3f4f6}</style>
</head>
<body class="min-h-screen">
  <nav class="bg-white shadow-sm py-4 px-6">
    <div class="max-w-5xl mx-auto flex justify-between items-center">
      <img src="images/logo.png" alt="Egerton logo" class="h-10">
      <span class="text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Live Results</span>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 pb-12 mt-8">
    <div class="flex gap-6 justify-center mb-8">
      <div class="flex items-center gap-2"><div class="w-4 h-4 bg-green-500 rounded"></div><span class="text-sm font-medium text-gray-600">Winner</span></div>
      <div class="flex items-center gap-2"><div class="w-4 h-4 bg-blue-500 rounded"></div><span class="text-sm font-medium text-gray-600">Runners Up</span></div>
    </div>
    <div class="space-y-10">
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span class="w-2 h-6 bg-brand-500 rounded-full"></span>Chairman</h2>
        <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table class="w-full text-left">
            <thead><tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider"><th class="px-6 py-3 font-semibold">Rank</th><th class="px-6 py-3 font-semibold">Candidate Name</th><th class="px-6 py-3 font-semibold text-right">Votes</th></tr></thead>
            <tbody class="divide-y divide-gray-100">
              <tr class="bg-green-50/50"><td class="px-6 py-4"><span class="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">1</span></td><td class="px-6 py-4 font-bold text-green-900 text-lg">Collins</td><td class="px-6 py-4 text-right text-green-700 font-bold">2,500</td></tr>
              <tr class="bg-blue-50/30"><td class="px-6 py-4"><span class="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">2</span></td><td class="px-6 py-4 font-semibold text-blue-900">Rono</td><td class="px-6 py-4 text-right text-blue-700 font-semibold">2,600</td></tr>
              <tr class="hover:bg-gray-50"><td class="px-6 py-4 text-gray-400 font-medium">3</td><td class="px-6 py-4 text-gray-700">Omondi</td><td class="px-6 py-4 text-right text-gray-500">2,600</td></tr>
              <tr class="hover:bg-gray-50"><td class="px-6 py-4 text-gray-400 font-medium">4</td><td class="px-6 py-4 text-gray-700">Brian</td><td class="px-6 py-4 text-right text-gray-500">2,600</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span class="w-2 h-6 bg-brand-500 rounded-full"></span>Vice Chairman</h2>
        <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table class="w-full text-left">
            <tbody class="divide-y divide-gray-100">
              <tr class="bg-green-50/50"><td class="px-6 py-4"><span class="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">1</span></td><td class="px-6 py-4 font-bold text-green-900 text-lg">Evans</td><td class="px-6 py-4 text-right font-bold text-green-700">2,800</td></tr>
              <tr class="bg-blue-50/30"><td class="px-6 py-4"><span class="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">2</span></td><td class="px-6 py-4 font-semibold text-blue-900">Mavin</td><td class="px-6 py-4 text-right font-semibold text-blue-700">2,100</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
  <footer class="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm pb-12">Total Registered Voters: 12,450 | Total Votes Cast: 10,200 (81.9%)</footer>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add results.html
git commit -m "feat: redesign results page with Tailwind CSS"
```

---

### Task 8: Admin Layout Component + Dashboard

**Files:**
- Create: `admin/dashboard.html`

This establishes the shared admin sidebar layout pattern used by all admin pages.

- [ ] **Step 1: Write `admin/dashboard.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard | SUEU</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#28a745',600:'#218838',700:'#1a6b2e',800:'#145224',900:'#0f3d1b'}}}}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>body{font-family:'Inter',sans-serif;background:#f3f4f6}*{margin:0;padding:0;box-sizing:border-box}</style>
</head>
<body class="flex min-h-screen">
  <aside class="w-64 bg-brand-800 text-white flex-shrink-0 flex flex-col">
    <div class="p-5 border-b border-brand-700">
      <img src="../images/logo.png" alt="Egerton" class="h-10 brightness-0 invert">
      <p class="text-xs text-brand-200 mt-1 font-semibold">Admin Panel</p>
    </div>
    <nav class="flex-1 p-4 space-y-1">
      <a href="dashboard.html" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-700 text-white font-medium"><i class="fa-solid fa-gauge w-5"></i> Dashboard</a>
      <a href="contestants.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-users w-5"></i> Contestants</a>
      <a href="voters.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-user-check w-5"></i> Voters</a>
      <a href="results-admin.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-chart-bar w-5"></i> Results</a>
    </nav>
    <div class="p-4 border-t border-brand-700">
      <a href="../login.html" class="flex items-center gap-3 px-4 py-3 text-brand-200 hover:text-white transition text-sm"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>
    </div>
  </aside>
  <main class="flex-1 p-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-extrabold text-gray-800">Dashboard</h1>
      <span class="text-sm text-gray-500">Election Officer</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><i class="fa-solid fa-users text-blue-600 text-xl"></i></div><div><p class="text-sm text-gray-500">Total Voters</p><p class="text-2xl font-extrabold text-gray-800">12,450</p></div></div></div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><i class="fa-solid fa-check-circle text-green-600 text-xl"></i></div><div><p class="text-sm text-gray-500">Votes Cast</p><p class="text-2xl font-extrabold text-gray-800">10,200</p></div></div></div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><i class="fa-solid fa-briefcase text-purple-600 text-xl"></i></div><div><p class="text-sm text-gray-500">Positions</p><p class="text-2xl font-extrabold text-gray-800">8</p></div></div></div>
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><i class="fa-solid fa-percentage text-orange-600 text-xl"></i></div><div><p class="text-sm text-gray-500">Turnout</p><p class="text-2xl font-extrabold text-gray-800">81.9%</p></div></div></div>
    </div>
    <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="font-bold text-gray-800 mb-4">Recent Activity</h2>
      <ul class="space-y-3 text-sm text-gray-600">
        <li class="flex items-center gap-3"><span class="w-2 h-2 bg-green-500 rounded-full"></span> Voter S13/12345/21 cast their vote</li>
        <li class="flex items-center gap-3"><span class="w-2 h-2 bg-green-500 rounded-full"></span> New contestant registered: Evans (Chairman)</li>
        <li class="flex items-center gap-3"><span class="w-2 h-2 bg-green-500 rounded-full"></span> Voter S13/67890/21 cast their vote</li>
        <li class="flex items-center gap-3"><span class="w-2 h-2 bg-blue-500 rounded-full"></span> Admin updated election schedule</li>
      </ul>
    </div>
  </main>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add admin/dashboard.html
git commit -m "feat: create admin dashboard with sidebar layout"
```

---

### Task 9: Admin Contestants Page

**Files:**
- Create: `admin/contestants.html`

- [ ] **Step 1: Write `admin/contestants.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contestants | SUEU Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#28a745',600:'#218838',700:'#1a6b2e',800:'#145224',900:'#0f3d1b'}}}}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>body{font-family:'Inter',sans-serif;background:#f3f4f6}</style>
</head>
<body class="flex min-h-screen">
  <aside class="w-64 bg-brand-800 text-white flex-shrink-0 flex flex-col">
    <div class="p-5 border-b border-brand-700"><img src="../images/logo.png" alt="Egerton" class="h-10 brightness-0 invert"><p class="text-xs text-brand-200 mt-1 font-semibold">Admin Panel</p></div>
    <nav class="flex-1 p-4 space-y-1">
      <a href="dashboard.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-gauge w-5"></i> Dashboard</a>
      <a href="contestants.html" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-700 text-white font-medium"><i class="fa-solid fa-users w-5"></i> Contestants</a>
      <a href="voters.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-user-check w-5"></i> Voters</a>
      <a href="results-admin.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-chart-bar w-5"></i> Results</a>
    </nav>
    <div class="p-4 border-t border-brand-700"><a href="../login.html" class="flex items-center gap-3 px-4 py-3 text-brand-200 hover:text-white transition text-sm"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></div>
  </aside>
  <main class="flex-1 p-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-extrabold text-gray-800">Contestants</h1>
      <button onclick="document.getElementById('addModal').classList.remove('hidden')" class="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 px-5 rounded-lg transition text-sm"><i class="fa-solid fa-plus"></i> Add Contestant</button>
    </div>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left">
        <thead><tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider"><th class="px-6 py-4 font-semibold">Photo</th><th class="px-6 py-4 font-semibold">Name</th><th class="px-6 py-4 font-semibold">Position</th><th class="px-6 py-4 font-semibold">Faculty</th><th class="px-6 py-4 font-semibold text-right">Actions</th></tr></thead>
        <tbody class="divide-y divide-gray-100">
          <tr class="hover:bg-gray-50"><td class="px-6 py-4"><img src="../images/_DSC0497.JPG" class="w-10 h-10 rounded-full object-cover"></td><td class="px-6 py-4 font-medium text-gray-800">Collins</td><td class="px-6 py-4 text-gray-600">Chairman</td><td class="px-6 py-4 text-gray-600">Science</td><td class="px-6 py-4 text-right"><button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fa-solid fa-pen"></i></button><button class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button></td></tr>
          <tr class="hover:bg-gray-50"><td class="px-6 py-4"><img src="../images/_DSC0909.JPG" class="w-10 h-10 rounded-full object-cover"></td><td class="px-6 py-4 font-medium text-gray-800">Evans</td><td class="px-6 py-4 text-gray-600">Vice Chairman</td><td class="px-6 py-4 text-gray-600">Education</td><td class="px-6 py-4 text-right"><button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fa-solid fa-pen"></i></button><button class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button></td></tr>
        </tbody>
      </table>
    </div>
  </main>
  <div id="addModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
      <h3 class="text-lg font-extrabold text-gray-800 mb-4">Add Contestant</h3>
      <form class="space-y-4">
        <div><label class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label><input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"></div>
        <div><label class="block text-sm font-semibold text-gray-700 mb-1">Position</label><select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"><option>Chairman</option><option>Vice Chairman</option><option>Secretary General</option></select></div>
        <div><label class="block text-sm font-semibold text-gray-700 mb-1">Faculty</label><select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"><option>Science</option><option>Education</option><option>Agriculture</option></select></div>
        <div class="flex gap-3 justify-end pt-2">
          <button type="button" onclick="document.getElementById('addModal').classList.add('hidden')" class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50">Cancel</button>
          <button type="submit" class="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg">Save</button>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add admin/contestants.html
git commit -m "feat: create admin contestants page"
```

---

### Task 10: Admin Voters Page

**Files:**
- Create: `admin/voters.html`

- [ ] **Step 1: Write `admin/voters.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voters | SUEU Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#28a745',600:'#218838',700:'#1a6b2e',800:'#145224',900:'#0f3d1b'}}}}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>body{font-family:'Inter',sans-serif;background:#f3f4f6}</style>
</head>
<body class="flex min-h-screen">
  <aside class="w-64 bg-brand-800 text-white flex-shrink-0 flex flex-col">
    <div class="p-5 border-b border-brand-700"><img src="../images/logo.png" alt="Egerton" class="h-10 brightness-0 invert"><p class="text-xs text-brand-200 mt-1 font-semibold">Admin Panel</p></div>
    <nav class="flex-1 p-4 space-y-1">
      <a href="dashboard.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-gauge w-5"></i> Dashboard</a>
      <a href="contestants.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-users w-5"></i> Contestants</a>
      <a href="voters.html" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-700 text-white font-medium"><i class="fa-solid fa-user-check w-5"></i> Voters</a>
      <a href="results-admin.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-chart-bar w-5"></i> Results</a>
    </nav>
    <div class="p-4 border-t border-brand-700"><a href="../login.html" class="flex items-center gap-3 px-4 py-3 text-brand-200 hover:text-white transition text-sm"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></div>
  </aside>
  <main class="flex-1 p-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-extrabold text-gray-800">Voters</h1>
      <button class="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 px-5 rounded-lg transition text-sm"><i class="fa-solid fa-plus"></i> Add Voter</button>
    </div>
    <div class="mb-6"><input type="text" placeholder="Search by registration number or name..." class="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"></div>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left">
        <thead><tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider"><th class="px-6 py-4 font-semibold">Reg No</th><th class="px-6 py-4 font-semibold">Name</th><th class="px-6 py-4 font-semibold">Faculty</th><th class="px-6 py-4 font-semibold">Hall</th><th class="px-6 py-4 font-semibold">Status</th><th class="px-6 py-4 font-semibold text-right">Actions</th></tr></thead>
        <tbody class="divide-y divide-gray-100">
          <tr class="hover:bg-gray-50"><td class="px-6 py-4 font-mono text-sm text-gray-800">S13/12345/21</td><td class="px-6 py-4 font-medium text-gray-800">John Doe</td><td class="px-6 py-4 text-gray-600">Science</td><td class="px-6 py-4 text-gray-600">Tatoon</td><td class="px-6 py-4"><span class="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Voted</span></td><td class="px-6 py-4 text-right"><button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fa-solid fa-pen"></i></button><button class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button></td></tr>
          <tr class="hover:bg-gray-50"><td class="px-6 py-4 font-mono text-sm text-gray-800">S13/67890/21</td><td class="px-6 py-4 font-medium text-gray-800">Jane Smith</td><td class="px-6 py-4 text-gray-600">Education</td><td class="px-6 py-4 text-gray-600">Non Resident</td><td class="px-6 py-4"><span class="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">Pending</span></td><td class="px-6 py-4 text-right"><button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fa-solid fa-pen"></i></button><button class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button></td></tr>
        </tbody>
      </table>
    </div>
  </main>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add admin/voters.html
git commit -m "feat: create admin voters page"
```

---

### Task 11: Admin Results Page

**Files:**
- Create: `admin/results-admin.html`

- [ ] **Step 1: Write `admin/results-admin.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Results | SUEU Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{brand:{50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#28a745',600:'#218838',700:'#1a6b2e',800:'#145224',900:'#0f3d1b'}}}}}</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>body{font-family:'Inter',sans-serif;background:#f3f4f6}</style>
</head>
<body class="flex min-h-screen">
  <aside class="w-64 bg-brand-800 text-white flex-shrink-0 flex flex-col">
    <div class="p-5 border-b border-brand-700"><img src="../images/logo.png" alt="Egerton" class="h-10 brightness-0 invert"><p class="text-xs text-brand-200 mt-1 font-semibold">Admin Panel</p></div>
    <nav class="flex-1 p-4 space-y-1">
      <a href="dashboard.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-gauge w-5"></i> Dashboard</a>
      <a href="contestants.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-users w-5"></i> Contestants</a>
      <a href="voters.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-brand-200 hover:bg-brand-700 hover:text-white transition"><i class="fa-solid fa-user-check w-5"></i> Voters</a>
      <a href="results-admin.html" class="flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-700 text-white font-medium"><i class="fa-solid fa-chart-bar w-5"></i> Results</a>
    </nav>
    <div class="p-4 border-t border-brand-700"><a href="../login.html" class="flex items-center gap-3 px-4 py-3 text-brand-200 hover:text-white transition text-sm"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></div>
  </aside>
  <main class="flex-1 p-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-extrabold text-gray-800">Election Results</h1>
      <div class="flex gap-3">
        <select class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"><option>All Positions</option><option>Chairman</option><option>Vice Chairman</option></select>
        <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg text-sm transition"><i class="fa-solid fa-download"></i> Export</button>
      </div>
    </div>
    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span class="w-2 h-6 bg-brand-500 rounded-full"></span>Chairman</h2>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="w-full text-left">
            <thead><tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider"><th class="px-6 py-4 font-semibold">Rank</th><th class="px-6 py-4 font-semibold">Candidate</th><th class="px-6 py-4 font-semibold">Votes</th><th class="px-6 py-4 font-semibold">Percentage</th></tr></thead>
            <tbody class="divide-y divide-gray-100">
              <tr class="bg-green-50/50"><td class="px-6 py-4"><span class="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">1</span></td><td class="px-6 py-4 font-bold text-green-900">Collins</td><td class="px-6 py-4 font-bold text-green-700">2,500</td><td class="px-6 py-4 text-green-700 font-medium">48.1%</td></tr>
              <tr class="bg-blue-50/30"><td class="px-6 py-4"><span class="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">2</span></td><td class="px-6 py-4 font-semibold text-blue-900">Rono</td><td class="px-6 py-4 font-semibold text-blue-700">2,600</td><td class="px-6 py-4 text-blue-700">46.2%</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span class="w-2 h-6 bg-brand-500 rounded-full"></span>Vice Chairman</h2>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="w-full text-left">
            <thead><tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider"><th class="px-6 py-4 font-semibold">Rank</th><th class="px-6 py-4 font-semibold">Candidate</th><th class="px-6 py-4 font-semibold">Votes</th><th class="px-6 py-4 font-semibold">Percentage</th></tr></thead>
            <tbody class="divide-y divide-gray-100">
              <tr class="bg-green-50/50"><td class="px-6 py-4"><span class="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">1</span></td><td class="px-6 py-4 font-bold text-green-900">Evans</td><td class="px-6 py-4 font-bold text-green-700">2,800</td><td class="px-6 py-4 text-green-700 font-medium">57.1%</td></tr>
              <tr class="bg-blue-50/30"><td class="px-6 py-4"><span class="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">2</span></td><td class="px-6 py-4 font-semibold text-blue-900">Mavin</td><td class="px-6 py-4 font-semibold text-blue-700">2,100</td><td class="px-6 py-4 text-blue-700">42.9%</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add admin/results-admin.html
git commit -m "feat: create admin results page"
```

---

### Task 12: Cleanup Legacy Files

**Files:**
- Delete: `contreg.html`, `voiting.html`, `w3sidebar.html`, `js/home.js`
- Remove: `css/bootstrap.min.css`, `css/w3.css`, `js/jquery.js`, `js/bootstrap.min.js`, `js/angular.min.js`, `css/style.css` (only if unused by remaining pages)
- Keep: `voting.html` (rename to ballot? or delete since ballot.html is the new one)

Since the old login/registration/voting pages referenced these files but the new pages are self-contained with CDN Tailwind, these legacy CSS/JS files are no longer needed.

- [ ] **Step 1: Remove legacy HTML files**

```bash
git rm contreg.html voiting.html w3sidebar.html
```

- [ ] **Step 2: Remove legacy JS files**

```bash
git rm js/home.js js/jquery.js js/bootstrap.min.js js/angular.min.js
```

- [ ] **Step 3: Remove legacy CSS files**

```bash
git rm css/bootstrap.min.css css/w3.css
```

- [ ] **Step 4: Remove or replace old `voting.html`**

`voting.html` is the old ballot page. Since we now have `ballot.html`, remove it:

```bash
git rm voting.html
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove legacy files (contreg, voiting, w3sidebar, old JS/CSS)"
```

---

## Spec Coverage Check
- Login page: Task 2
- Register page: Task 3
- Ballot page: Task 4
- Confirm page: Task 5
- Success page: Task 6
- Results page (public): Task 7
- Admin dashboard: Task 8
- Admin contestants: Task 9
- Admin voters: Task 10
- Admin results: Task 11
- Legacy cleanup: Task 12
- Shared design system: Tasks 1-12 all use the same Tailwind config snippet
