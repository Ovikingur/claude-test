const { app, BrowserWindow, Tray, Menu, ipcMain, globalShortcut, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { characters, defaultCharacterId, getCharacterById } = require('./avatar-config');

let mainWindow = null;
let settingsWindow = null;
let tray = null;
let currentCharacterId = defaultCharacterId;
let avatarState = 'idle';

const settingsFilePath = path.join(app.getPath('userData'), 'assistant-settings.json');
const assetsDirectory = path.join(__dirname, '..', 'assets');

function loadSettings() {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const saved = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
      if (saved.characterId) currentCharacterId = saved.characterId;
      if (saved.avatarState) avatarState = saved.avatarState;
    }
  } catch (error) {
    console.error('Unable to load settings:', error);
  }
}

function saveSettings() {
  fs.writeFileSync(settingsFilePath, JSON.stringify({ characterId: currentCharacterId, avatarState }, null, 2));
}

function getAppIcon() {
  return nativeImage.createFromPath(path.join(assetsDirectory, 'app-icon.png'));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 180,
    height: 180,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    movable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setIgnoreMouseEvents(false);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    broadcastAvatarState();
  });
}

function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 480,
    height: 560,
    title: 'Assistant Settings',
    show: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  settingsWindow.loadFile(path.join(__dirname, 'settings.html'));
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });

  settingsWindow.once('ready-to-show', () => {
    settingsWindow.show();
    settingsWindow.focus();
  });
}

function showMainWindow() {
  if (!mainWindow) {
    createMainWindow();
  }
  mainWindow.show();
  mainWindow.focus();
}

function hideMainWindow() {
  if (mainWindow) {
    mainWindow.hide();
  }
}

function toggleMainWindow() {
  if (!mainWindow) {
    createMainWindow();
  }

  if (mainWindow.isVisible()) {
    hideMainWindow();
  } else {
    showMainWindow();
  }
}

function broadcastAvatarState() {
  const payload = {
    characterId: currentCharacterId,
    avatarState,
    character: getCharacterById(currentCharacterId),
    characters
  };

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('avatar:update', payload);
  }

  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.webContents.send('avatar:update', payload);
  }
}

function createTray() {
  const icon = getAppIcon();
  tray = new Tray(icon.resize({ width: 24, height: 24 }));
  tray.setToolTip('MyAI Assistant');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Assistant', click: showMainWindow },
    { label: 'Open Settings', click: createSettingsWindow },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]));
  tray.on('click', () => {
    toggleMainWindow();
  });
}

ipcMain.handle('settings:get', () => ({
  characterId: currentCharacterId,
  avatarState,
  characters,
  defaultCharacterId,
  character: getCharacterById(currentCharacterId)
}));

ipcMain.handle('settings:save', (_event, payload) => {
  currentCharacterId = payload.characterId;
  avatarState = payload.avatarState;
  saveSettings();
  broadcastAvatarState();
  return { success: true };
});

ipcMain.handle('avatar:set-state', (_event, nextState) => {
  avatarState = nextState;
  broadcastAvatarState();
  return { success: true };
});

ipcMain.on('settings:open', createSettingsWindow);

app.whenReady().then(() => {
  loadSettings();
  createTray();
  createMainWindow();
  globalShortcut.register('CommandOrControl+Alt+Space', toggleMainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
