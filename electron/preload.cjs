/**
 * @fileoverview Electron Preload Script
 * 
 * Exposes safe APIs to the renderer process.
 * Currently minimal, but can be extended for native features.
 */

const { contextBridge } = require('electron');

// Expose safe APIs to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    isElectron: true,
});
