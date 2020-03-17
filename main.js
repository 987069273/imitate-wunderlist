const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const AppWindow = require('./src/AppWindow');
const path = require('path');
let mainWindow, editListWindow;

app.on('ready', () => {
    require('devtron').install();

    const mainWindowConfig = {
        width: 1024,
        height: 580,
    };
    const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl';

    console.log(ipcMain);

    mainWindow = new AppWindow(mainWindowConfig, urlLocation);
    mainWindow.on('closed', () => {
        mainWindow = null;
    })
    
    //hook up main events
    ipcMain.on('open-editList-window', () => {
        const editListWindowConfig = {
            width: 500,
            height: 400,
            parent: mainWindow
        };
        const editListFileLocation = `file://${path.join(__dirname, './Modify/editList.html')}`;
        editListWindow = new AppWindow(editListWindowConfig, editListFileLocation);
        editListWindow.on('closed', () => {
            editListWindow = null;
        })

    })
    
    
    /* ipcMain.on('message', (event, arg) => {
        console.log(arg);
        event.reply('reply', 'hello from main process');
      })  */
})