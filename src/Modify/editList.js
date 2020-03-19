const uuidv4 = require('uuid/v4');

const { remote, ipcRenderer } = require('electron');
const Store = require('electron-store');
const fileStore = new Store({'name': 'Files Data'});

let listTitle, oldListTitle;
const $ = (selector) => {
    const result = document.querySelectorAll(selector);
    return result.length > 1 ? result: result[0];
}

ipcRenderer.on('old-title', (event, arg) => {
    $('#list-title').value = arg;
    oldListTitle = arg;
})

document.addEventListener('DOMContentLoaded', () => {

    const handleSubmit = () => {
        const files = fileStore.get('files') || [];
        if (!oldListTitle) {
            const newList = {
                id: uuidv4(),
                type: 'list',
                title: $('#list-title').value,
                content: [],
                createdAt: (new Date()).getTime(),
            }
            files.push(newList);
        }
        else {
            let list = files.find(file => file.title === oldListTitle);
            if ( !list ) {
                let file = files.find(file => file.content.some(list => list.title === oldListTitle));
                list = file.content.find(list => list.title === oldListTitle);
            }
            list.title = $('#list-title').value;
        }
        fileStore.set('files', files);
        ipcRenderer.send('new-title-created');
        remote.getCurrentWindow().close();
    };

    $('#list-title').focus();

    $('#list-title').addEventListener('change', (e) => {
        listTitle = e.target.value;
    })

    $('#list-title').addEventListener('keydown', (e) => {
        if( e.keyCode === 13 ) {
            handleSubmit();
            $('#list-title').blur();
        }
        if( e.keyCode === 27 ) {
            $('#list-title').value = oldListTitle;
            $('#list-title').blur();
            remote.getCurrentWindow().close();
        }
    })

    $('#submit').addEventListener('click', handleSubmit);
})