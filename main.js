const { app, ipcMain, dialog, Menu } = require('electron');
const isDev = require('electron-is-dev');
const AppWindow = require('./src/AppWindow');
const path = require('path');
const QiniuManager = require('./src/utils/QiniuManager');
const menuTemplate = require('./src/menuTemplate');
const { join } = require('path'); 
let mainWindow, editListWindow;

const createManager = () => {
    const accessKey = 'kHVZiWzamFPSsRy0m125y-pOudOSqGIT7hALwpQg';
    const secretKey = '3TsizFfGqmrFV9QDcl8J9karORRnJroTDgNyNtxe';
    const bucketName = 'wunderlist';
    return new QiniuManager(accessKey, secretKey, bucketName);
}

const savedLocation = app.getPath('documents');

ipcMain.on('download-file', () => {
    const manager = createManager();
    manager.getStat('wunderlist.json').then((resp)=> {
        //这儿的逻辑较为粗暴，默认云端的文件相比本地的更新（若是加上了时间戳等属性，可以进行对比）
        manager.downloadFile('wunderlist.json', join(savedLocation, 'wunderlist.json')).then(() => {
            mainWindow.webContents.send('file-downloaded', {status: 'success'});
        })
    }, (error) => {
        if (error.statusCode === 612) {
            mainWindow.webContents.send('file-downloaded', {status: 'fail'});
        }
    });
});


app.on('ready', () => {
    require('devtron').install();

    const mainWindowConfig = {
        width: 1024,
        height: 580,
    };
    const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl';

    mainWindow = new AppWindow(mainWindowConfig, urlLocation);
    // set the menu
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

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
        const manager = createManager();
        manager.uploadFile(data.key, data.path).then(data => {
            mainWindow.webContents.send('file-uploaded');
        }).catch(() => {
            dialog.showErrorBox('同步失败','请检查网络是否可用');
        })
    });
    
    /* ipcMain.on('download-file', (event, data) => {
        dialog.showMessageBox({
            type: 'info',
            title: 'to download file',
            message:'开始下载文件'
        });
        const manager = createManager();
        manager.getStat(data.key).then((resp) => {
            manager.downloadFile(data.key, data.path).then((file) => {
                console.log(file);
                dialog.showMessageBox({      
                    type: 'info',
                    title: 'Synced!',
                    message:'已从云端同步至本地'
                });
                mainWindow.webContents.send('file-downloaded', file);
            })
        }, (error) => {
            console.error(error);
            if ( error.statusCode === 612 ) {
                console.error('no such file on the cloud.')
                const savedLocation = join(remote.app.getPath('documents'));
                let file = [];
                fileHelper.readFile(savedLocation, 'wunderlist.json').then( value => {
                    file = JSON.parse(value);
                });
                mainWindow.webContents.send('file-downloaded', file);
            }
        })
    }) */
    /* ipcMain.on('message', (event, arg) => {
        console.log(arg);
        event.reply('reply', 'hello from main process');
      })  */
})