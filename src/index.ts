import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools({mode: 'detach'});    
  } else {
    mainWindow.setMenu(null);
  }

  /*
  mainWindow.setMaximizable(false);
  mainWindow.on('will-resize', (e) => {
    //prevent resizing even if resizable property is true.
        e.preventDefault();
    });
  */

  mainWindow.setTitle(`${app.getName()} v${app.getVersion()}`);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

  createWindow();
  
  /*
  if (isDev) {
    const devTools = require('electron-devtools-installer');
    const installExtension = devTools.default;
    const REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: any) => console.log(`Added Extension:  ${name}`))
      .catch((error: any) => console.log(`An error occurred: , ${error}`));
  }
  */

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
