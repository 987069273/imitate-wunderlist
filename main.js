const { app, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');
const AppWindow = require('./src/AppWindow');
const path = require('path');
const QiniuManager = require('./src/utils/QiniuManager');
let mainWindow, editListWindow;

const createManager = () => {
    const accessKey = 'kHVZiWzamFPSsRy0m125y-pOudOSqGIT7hALwpQg';
    const secretKey = '3TsizFfGqmrFV9QDcl8J9karORRnJroTDgNyNtxe';
    const bucketName = 'wunderlist';
    return new QiniuManager(accessKey, secretKey, bucketName);
}

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
            autoHideMenuBar: true, //按了alt键之后才可以显示菜单栏
        };
        const editListFileLocation = `file://${path.join(__dirname, './src/Modify/editList.html')}`;
        editListWindow = new AppWindow(editListWindowConfig, editListFileLocation);
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

    ipcMain.on('upload-file', (event, data) => {
        console.log('send to cloud')
        const manager = createManager();
        manager.uploadFile(data.key, data.path).then(data => {
            console.log('上传成功', data);
            mainWindow.webContents.send('file-uploaded');
        }).catch(() => {
            dialog.showErrorBox('同步失败','请检查网络是否可用');
        })
    });
    
    /* ipcMain.on('message', (event, arg) => {
        console.log(arg);
        event.reply('reply', 'hello from main process');
      })  */
})