const { remote, ipcRenderer } = require('electron');
const Store = require('electron-store');
const settingsStore = new Store({name: 'list'})

const $ = (selector) => {
    const result = document.querySelectorAll(selector);
    return result.length > 1 ? result: result[0];
}

document.addEventListener('DOMContentLoaded', () => {
    let listTitle;

    $('#list-title').addEventListener('change', (e) => {
        listTitle = e.target.value;
    })

    $('#submit').addEventListener('click', () => {
        ipcRenderer.send('send-list-title', listTitle);
    })
    
})