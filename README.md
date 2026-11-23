# Focus Studio

A personal productivity space built with **React, Vite, and Tailwind CSS**. The project currently centers on customizable focus and break timers, with an inspiration board and session overview. Its name leaves room for future features such as tasks, habits, and planning.

## Features

- Focus, Short Break, Long Break, and Quick Reset modes
- Adjustable timer lengths, pause/reset, and five-minute extension
- Six text-first themes: **Sky Blue**, **NASA Study Mode**, **Matcha Cafe**, **Soft Sunset**, **San Fransokyo Tech**, and **Deep Space Survival**
- Optional button sounds and completion audio
- Inspiration board for uploaded photos
- Simple session completion counter and progress display
- Two immersive sci-fi scenes: a bright robotics city and a dark scanning spacecraft terminal (original SVG/CSS artwork, no external franchise assets)

> Uploaded photos and session counts currently live in memory and reset when you refresh the page. Persistent history can be added later.

## Run locally

Install Node.js **20.19+ or 22.12+**, open a terminal in this folder, then run:

```bash
npm install
npm run dev
```

Open the address printed by Vite (usually http://localhost:5173/).

## Validate

```bash
npm run lint
npm run build
```

## Publish to GitHub

Create a new, empty repository named `focus-studio` on GitHub (do not initialize a README). Then run the following in this folder, replacing `YOUR-USERNAME` with your GitHub username:

```bash
git init
git branch -M main
git add .
git commit -m "Create Focus Studio"
git remote add origin https://github.com/YOUR-USERNAME/focus-studio.git
git push -u origin main
```

Configure your Git identity with an email associated with your GitHub account before committing. `.gitignore` excludes `node_modules`, build output and logs.

If you've already created or pushed a repository for the prior Pomodoro Orbit project, you can copy these updated project files over the original project instead, then commit and push the rename. You do not need to make a second repository.

## Future ideas

- Tasks and goals
- A focus history calendar and weekly stats
- Persist themes and session history to local storage
- GitHub Pages hosting
