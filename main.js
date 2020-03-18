const { app, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const AppWindow = require('./src/AppWindow');
const path = require('path');
const Store = require('electron-store');
const fileStore = new Store({'name': 'Files Data'});
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
    ipcMain.on('open-editList-window', (event) => {
        const editListWindowConfig = {
            width: 500,
            height: 400,
            parent: mainWindow,
            title: 'edit list',
            modal: true, //禁用父窗口
        };
        const editListFileLocation = `file://${path.join(__dirname, './Modify/editList.html')}`;
        console.log(editListFileLocation);
        editListWindow = new AppWindow(editListWindowConfig, editListFileLocation);
        editListWindow.on('closed', () => {
            editListWindow = null;
        })
    })

    /* ipcMain.on('send-list-title',(event, arg1, arg2) => {
        console.log(arg1);
        console.log(arg2);
        const files = fileStore.get('files') || [];
        

    }) */
    
    
    /* ipcMain.on('message', (event, arg) => {
        console.log(arg);
        event.reply('reply', 'hello from main process');
      })  */
})