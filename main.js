const { app, ipcMain } = require('electron');
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

    mainWindow = new AppWindow(mainWindowConfig, urlLocation);
    mainWindow.on('closed', () => {
        mainWindow = null;
    })
    
    //hook up main events
    ipcMain.on('open-editList-window', (event, arg) => {
        const editListWindowConfig = {
            width: 500,
            height: 400,
            parent: mainWindow,
            title: 'edit list',
            modal: true, //禁用父窗口
        };
        const editListFileLocation = `file://${path.join(__dirname, './src/Modify/editList.html')}`;
        editListWindow = new AppWindow(editListWindowConfig, editListFileLocation);
        editListWindow.removeMenu();
        editListWindow.webContents.on('did-finish-load', () => {
            //将获得的旧标题传给渲染进程
            editListWindow.webContents.send('old-title', arg ? arg : '' );
        });
        
        editListWindow.on('closed', () => {
            editListWindow = null;
        })
    });

    ipcMain.on('new-title-created',() => {
        mainWindow.webContents.send('refresh');
    })
    
    /* ipcMain.on('message', (event, arg) => {
        console.log(arg);
        event.reply('reply', 'hello from main process');
      })  */
})