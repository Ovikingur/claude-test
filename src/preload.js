const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (payload) => ipcRenderer.invoke('settings:save', payload),
  setAvatarState: (state) => ipcRenderer.invoke('avatar:set-state', state),
  openSettings: () => ipcRenderer.send('settings:open'),
  onAvatarUpdate: (callback) => {
    ipcRenderer.on('avatar:update', (_event, payload) => callback(payload));
  }
});
