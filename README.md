# Mac Desktop Assistant

A lightweight Electron desktop assistant for macOS with a floating, animated worm avatar that lives on top of your screen.

![platform](https://img.shields.io/badge/platform-macOS-blue) ![electron](https://img.shields.io/badge/electron-31-informational)

## Features

- **Floating avatar window** – a small, frameless, always-on-top, transparent window that follows you across every Space and full-screen app.
- **Multiple characters** – choose between Space Worm, Wizard Worm, and Viking Worm, each with its own colors and animations.
- **Avatar states** – idle, thinking, speaking, error, and happy, each with a distinct bobbing/shaking animation.
- **Tray menu** – open the assistant, open settings, or quit from the macOS menu bar.
- **Global shortcut** – toggle the assistant window with `Cmd+Alt+Space` from anywhere.
- **Settings window** – pick your character and preview avatar states; your choice is saved automatically and restored on next launch.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- macOS (the app is packaged and tested for macOS only)

### Install

```bash
npm install
```

### Run in development

```bash
npm start
```

### Package a macOS build

```bash
npm run package:mac
```

This produces a `.dmg` and `.zip` in the `dist/` folder using [electron-builder](https://www.electron.build/).

## Project structure

```
src/
  main.js             # Electron main process: windows, tray, shortcuts, IPC
  preload.js          # Secure bridge exposing electronAPI to the renderer
  avatar-config.js    # Character definitions (name, image, accent color, animations)
  index.html          # Floating avatar window
  settings.html        # Character picker / settings window
assets/                # Character artwork and app icon
```

## How it works

The main process (`src/main.js`) creates a small transparent, always-on-top `BrowserWindow` that renders the current character and its animation state. Settings (selected character, avatar state) are persisted to a JSON file in the app's user data directory and restored on launch. The settings window lets you switch characters live via IPC calls exposed through `preload.js`.

## License

No license has been chosen yet — all rights reserved by default until one is added.
