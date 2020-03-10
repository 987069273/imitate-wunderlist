const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
let mainWindow, settingWindow;

app.on('ready', () => {
    require('devtron').install();
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 580,
        webPreferences: {
            nodeIntegration: true,
        }
    })
    const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl';
    mainWindow.loadURL(urlLocation);

    mainWindow.on('close', () => {
        mainWindow = null;
    });

    
    
    /* ipcMain.on('message', (event, arg) => {
        console.log(arg);
        event.reply('reply', 'hello from main process');
      })  */
})