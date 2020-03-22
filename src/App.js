import React, { useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import uuidv4 from 'uuid/v4';

import defaultFiles from './utils/defaultFiles';
import MenuBars from './components/MenuBars';
import Search from './components/Search';
import FoldersPanel from './components/FoldersPanel';
import CreateList from './components/CreateList';
import FunctionBar from './components/FunctionBar';
import CreateItem from './components/CreateItem';
import EntryPanel from './components/EntryPanel';
import fileHelper from './utils/fileHelper';

const { join } = window.require('path'); 
const { remote, ipcRenderer } = window.require('electron');
const Store = window.require('electron-store');

const savedLocation = remote.app.getPath('documents');
const fileStore = new Store({'name': 'Files Data'});

const saveFilesToStore = (files) => {
  fileStore.set('files', files);
}

let initFiles = fileStore.get('files') || [];

const initState = {
  files: initFiles,
  searchKeyword: false,
  selectedListID: initFiles[0] ? (initFiles[0].type === 'folder' ? initFiles[0].content[0].id : initFiles[0].id) : false,
  foldersPanelCollapsed: false,
};

const appReducer = (state, action) => {
  switch(action.type) {
    case 'changeFiles':
      return {
        ...state,
        files: action.payload ? action.payload.files : state.files,
      }
    case 'search':
      return {
        ...state,
        searchKeyword: action.payload.value,
      }
    case 'selectList':
      return {
        ...state,
        selectedListID: action.payload.id,
      }
    case 'collapseFolersPanel':
      return {
        ...state,
        foldersPanelCollapsed: !state.foldersPanelCollapsed,
      }
    default: 
        return state;
  }
};

function App() {

  const [state, dispatch] = useReducer(appReducer, initState);
  
  ipcRenderer.on('refresh',(event, arg) => {
    initFiles = fileStore.get('files') || [];
    dispatch({type: 'changeFiles', payload: {files: initFiles}})
  })

  const { files, searchKeyword, selectedListID, foldersPanelCollapsed } = state;

  const allLists = files.reduce((acc, cur) => { //将所有条目整理出来，添加了folder和list的信息
    if (cur.type === 'folder'){
      const lists = cur.content.map((list) => {
        return { ...list, folderID: cur.id };
      });
      return [ ...acc, ...lists ];
    }
    else if (cur.type === 'list') {
      const list = cur;
      list.folderID = null;
      return [ ...acc, list ]
    }
  },[]);

  const sortedList = allLists.find((list) => list.id === selectedListID);

  const searchResult = allLists.map((list) => {
    const filteredEntries = list.content.filter((entry) => !entry.completeAt && entry.content.includes(searchKeyword));
    if ( filteredEntries.length !== 0) {
      return {id: list.id, title: list.title, folderID: list.folderID, entries: filteredEntries};
    }
    else {
      return ;
    }
  }).filter(list => list !== undefined);

  const toSearch = (value) => {
    dispatch({ type: 'search', payload: { value: value} });
  };

  const closeSearch = () => {
    dispatch({ type: 'search', payload: { value: false} });
  }

  const sortEntries = (sortby) => {
    if (sortby === 'content') {
      sortedList.content.sort((a, b) => a.content - b.content )
    }
    else if (sortby === 'createdAt') {
      sortedList.content.sort((a, b) => a.createdAt - b.createdAt )
    }
    else if (sortby === 'starred') {
      sortedList.content.sort((a, b) => b.starred - a.starred )
    }
  };

  const submitEntry = (value, starred) => {
    const newEntry = {
      id: uuidv4(),
      type: 'entry',
      content: value,
      createdAt: (new Date()).getTime(),
      starred: starred,
    };
    const newFiles = files;
    if (sortedList.folderID) {
      newFiles.find((item) => item.id === sortedList.folderID)
      .content.find((list) => list.id === selectedListID)
      .content.unshift(newEntry);
    }
    else {
      newFiles.find((item) => item.id === selectedListID)
      .content.unshift(newEntry);
    }
    dispatch({ type: 'changeFiles', payload: { files: newFiles} });
    saveFilesToStore(newFiles);
  };

  const collapsePanel = (toCollapse) => {
    dispatch({ type: 'collapseFolersPanel'});
  }

  const completeEntry = (id) => {
    if( !searchKeyword ) {
      const entry = sortedList.content.find((entry) => entry.id === id);
      entry.completeAt = new Date().getTime();
    }
    else {
      const list = searchResult.find(list => list.entries.find( entry => entry.id === id));
      const entry = list.entries.find( entry => id === entry.id );
      entry.completeAt = new Date().getTime();
    }
    dispatch({type: 'changeFiles'});
    saveFilesToStore(files);
  };

  const unCompleteEntry = (id) => {
    if( !searchKeyword ) {
      const entry = sortedList.content.find((entry) => entry.id === id);
      delete entry.completeAt;
    }
    else {
      const list = searchResult.find(list => list.entries.find( entry => entry.id === id));
      const entry = list.entries.find( entry => id === entry.id );
      delete entry.completeAt;
    }
    dispatch({type: 'changeFiles'});
    saveFilesToStore(files);
  }

  const selectList = (id) => {
    if (!!searchKeyword) {
      closeSearch();
    }
    dispatch({ type: 'selectList', payload: {id: id} });
  };

  const activateList = (id) => {
    dispatch({ type: 'activateList', payload: {id: id}});
  }

  const delList = (id) => {
    let file = files.find(file => file.content.some(list => list.id === id));
    if (file) {
      file.splice(file.findIndex(list => list.id === id), 1);
    }
    else {
      const listIdx = files.findIndex(list => list.id === id);
      files.splice(listIdx, 1);
    }
    dispatch({type: 'changeFiles'});
    if ( id === selectedListID ) {
      dispatch({type: 'selectList' , payload: {id: false}})
    }
    saveFilesToStore(files);
  }

  const starEntry = (id) => {
    if( !!searchKeyword ) {
      const list = searchResult.find(list => list.entries.find( entry => entry.id === id));
      const entry = list.entries.find( entry => id === entry.id );
      entry.starred = true;
    }
    else {
      sortedList.content.find((entry) => id === entry.id).starred = true;
    }
    dispatch({type: 'changeFiles'});
    saveFilesToStore(files);
  }

  const unStarEntry = (id) => {
    if( !!searchKeyword ) {
      const list = searchResult.find(list => list.entries.find( entry => entry.id === id));
      const entry = list.entries.find( entry => id === entry.id );
      delete entry.starred;
    }
    else {
      delete sortedList.content.find((entry) => id === entry.id).starred;
    }
    dispatch({type: 'changeFiles'});
    saveFilesToStore(files);
  }

  const editEntry = (entryID, value) => {
    if( !searchKeyword ) {
      const entry = sortedList.content.find(entry => entry.id === entryID);
      entry.content = value;
    }
    else {
      const list = searchResult.find(list => list.entries.find( entry => entry.id === entryID));
      const entry = list.entries.find( entry => entryID === entry.id );
      entry.content = value;
    }
    dispatch({type: 'changeFiles'});
    saveFilesToStore(files);
  };

  const delEntry = (entryID) => {
    if( !searchKeyword ) {
      const entryIdx = sortedList.content.findIndex(entry => entry.id === entryID);
      sortedList.content.splice(entryIdx,1);
    }
    else {
      const listIdx = allLists.findIndex(list => list.content.find( entry => entry.id === entryID ));
      allLists[listIdx].content.splice(allLists[listIdx].content.findIndex(entry => entry.id === entryID), 1);
      const listID = allLists[listIdx].id;
      const searchedListIdx = searchResult.findIndex(list => list.id === listID);
      const searchedEntryIdx = searchResult[searchedListIdx].entries.findIndex(entry => entry.id === entryID);
      searchResult[searchedListIdx].entries.splice(searchedEntryIdx , 1);
      if (searchResult[searchedListIdx].entries.length === 0) {
        searchResult.splice(searchedListIdx,1);
      }
    }
    dispatch({type: 'changeFiles' });
    saveFilesToStore(files);
  }

  const saveCurrentFile = () => {
    fileHelper.writeFile(join(savedLocation, 'wunderlist.json'), JSON.stringify(files));
    remote.dialog.showMessageBox( {
      type: 'info',
      title: 'Saved!',
      message:'保存成功',
    } );
  }

  return (
    <div className="App container-fluid">
      <div className='row'>
        <div className={foldersPanelCollapsed ? 'col-md-auto bg-light fullHeight pl-2' : 'col-3 bg-light fullHeight pl-2'}>
          {/* 此处的格式col-md-auto可以跟随内容进行宽度调整，搭配下面的col使用 */}
          <div className='d-flex my-1'>
            <MenuBars
              collapsed={foldersPanelCollapsed}
              onCollapsePanel={collapsePanel}
            />
            <Search
              toShow={!foldersPanelCollapsed}
              onSearch={toSearch}
              onCloseSearch={closeSearch}
            />
          </div>
          <FoldersPanel
            showAll={!foldersPanelCollapsed}
            selectedListID={selectedListID}
            files={files}
            onSelectList={selectList}
            onCollapsePanel={collapsePanel}
            onDelList={delList}
            onActivateList={activateList}
          />
          <CreateList
            showAll={!foldersPanelCollapsed}
          />
        </div>
        <div className={foldersPanelCollapsed ? 'col bg-light pl-0 py-1' : 'col-9 bg-light pl-0 py-1'}>
          {/* 此处的格式col可以填充剩余的宽度，搭配上面的col-md-auto使用 */}
          <FunctionBar
            searchMode={!!searchKeyword}
            title={ searchKeyword ? searchKeyword : (sortedList && !sortedList.length ? sortedList.title: '')}
            onSortEntries={sortEntries}
          />
          <div className='verticalScroll'>
          { !searchKeyword && selectedListID &&
            <CreateItem
              onSubmit={submitEntry}
            />
          }
          { sortedList && !sortedList.length &&
            <EntryPanel
              selectedListID={selectedListID}
              searchMode={!!searchKeyword}
              collection={ !searchKeyword ? [sortedList] : searchResult}
              onComplete={completeEntry}
              onUnComplete={unCompleteEntry}
              onStar={starEntry}
              onUnStar={unStarEntry}
              onEditEntry={editEntry}
              onDelEntry={delEntry}
            />
          }
          </div>
          <button className='bottom w-100 border-0 btn outline shadow-none' onClick={saveCurrentFile}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
