# Property Management App

A property management tool built with Django (backend) and React (frontend).

> **Never coded before? No problem.** Just follow each step in order, copy-paste the commands exactly, and you'll be up and running.

---

## Step 1 — Install Your Tools (One Time Only)

You need to install 3 free programs. Do this once and never again.

**1. VS Code** (where you'll view and edit the project)
- Download at: https://code.visualstudio.com
- Works on Mac and Windows — just run the installer

**2. Miniconda** (manages Python for the backend)
- Download at: https://docs.conda.io/en/latest/miniconda.html
- Pick the version that matches your operating system (Mac or Windows) and run the installer
- When it asks, say **yes** to "Add to PATH"

**3. Node.js** (runs the frontend)
- Download at: https://nodejs.org
- Click the big **LTS** button and run the installer

After installing all three, **restart your computer** before continuing.

---

## Step 2 — Open the Project in VS Code

1. Open VS Code
2. Click **File → Open Folder**
3. Find the `property_management` folder on your computer and select it
4. You should see all the project files appear in the left sidebar

---

## Step 3 — Open Your Terminals Inside VS Code

Here's the trick — you can run terminals right inside VS Code so everything stays in one place.

1. In VS Code, click **Terminal** in the top menu bar → **New Terminal**
2. A terminal panel will open at the bottom of VS Code — this is **Terminal 1**
3. Open a second one: click the **+** icon in the top-right corner of the terminal panel — this is **Terminal 2**
4. You can switch between them by clicking their names at the bottom

You should now have two terminals open side by side. Keep them both open the whole time the app is running.

---

## Step 4 — Start the Backend (Terminal 1)

Click on **Terminal 1** and paste these commands one at a time, pressing Enter after each.

**First time only — set up the environment:**
```bash
conda create -n property_management python=3.10
```
```bash
conda activate property_management
```
```bash
cd backend
```
```bash
pip install -r requirements.txt
```

**Every time you want to run the app:**
```bash
conda activate property_management
cd backend
python manage.py migrate
python manage.py runserver
```

You should see this at the bottom:
```
Starting development server at http://127.0.0.1:8000/
```
**Leave Terminal 1 running. Don't close it or type anything else in it.**

---

## Step 5 — Start the Frontend (Terminal 2)

Click on **Terminal 2** and paste these commands one at a time.

**First time only:**
```bash
cd frontend
npm install
```

**Every time you want to run the app:**
```bash
cd frontend
npm run dev
```

You should see:
```
Local:   http://localhost:3000/
```
**Leave Terminal 2 running too.**

---

## Step 6 — Open the App

Open any browser (Chrome, Safari, Firefox) and go to:
```
http://localhost:3000
```

Log in with:
- **Username:** `bsoto`
- **Password:** `123456`

Click on **7972 Bristol Circle** to see a working example of the app.

---

## Stopping the App

When you're done, click into each terminal and press **Ctrl + C** (or **Cmd + C** on Mac) to stop it. You can just close VS Code after that.

Next time you want to run it again, just repeat Steps 4 and 5 (the "Every time" commands only).

---

## Troubleshooting

**"conda: command not found"**
Restart your computer after installing Miniconda. If it still doesn't work, reinstall Miniconda and make sure you said yes to "Add to PATH."

**"Port 8000 is already in use"**
Run this in Terminal 1, then try `python manage.py runserver` again:
```bash
lsof -ti:8000 | xargs kill -9
```

**"npm: command not found"**
Restart your computer after installing Node.js.

**Frontend loads but shows no data / blank screen**
Terminal 1 (backend) probably stopped running. Go back to Terminal 1 and run `python manage.py runserver` again.

**Still stuck?**
Open the project in VS Code, open a terminal, and ask Claude — paste the error message and it'll walk you through it.

---

## Notes for Developers

- Backend runs at: `http://127.0.0.1:8000`
- Frontend runs at: `http://localhost:3000`
- Django admin panel: `http://127.0.0.1:8000/admin`
- **Before going live:** rotate the Django `SECRET_KEY` — see `CLAUDE.md` for instructions
