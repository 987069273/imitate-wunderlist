import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import uuidv4 from 'uuid/v4';
//import classNames from 'classnames';

import defaultFiles from './utils/defaultFiles';
import MenuBars from './components/MenuBars';
import Search from './components/Search';
import Folders from './components/FoldersPanel';
import CreateList from './components/CreateList';
import FunctionBar from './components/FunctionBar';
import CreateItem from './components/CreateItem';
import EntryPanel from './components/EntryPanel';


function App() {

  const [ files, setFiles ] = useState(defaultFiles);
  const [ searchKeyword, setSearchKeyword ] = useState(false);
  const [ selectedListID, setSelectedListID ] = useState('0-1');
  const [ foldersPanelCollapsed, setFoldersPanelCollapsed] = useState(false);

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
    setSearchKeyword(value);
  };

  const closeSearch = () => {
    setSearchKeyword(false);
  }

  const sortEntries = (sortby) => {
    if (sortby === 'content') {
      sortedList.content.sort((a, b) => a.content - b.content )
      console.log(sortedList);
    }
    else if (sortby === 'createdAt') {
      sortedList.content.sort((a, b) => a.createdAt - b.createdAt )
    }
    else if (sortby === 'starred') {
      sortedList.content.sort((a, b) => b.starred - a.starred )
    }
  };

  const submitEntry = (value) => {
    const newEntry = {
      id: uuidv4(),
      type: 'entry',
      content: value,
      createdAt: (new Date()).getTime(),
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
    setFiles(newFiles);
  };

  const collapsePanel = (toCollapse) => {
    setFoldersPanelCollapsed(toCollapse);
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
  }

/*   const createList = (title) => {
    remote.dialog.showOpenDialog({
      type: 'info',
      message: `create a list titled ${title}`,
    });
  }; */

  const editList = (title) => {
    const newFiles = files;
    if (sortedList.folderID) {
      newFiles.find((item) => item.id === sortedList.folderID)
      .content.find((list) => list.id === selectedListID)
      .title = title;
    }
    else {
      newFiles.find((item) => item.id === selectedListID)
      .title = title;
    }
    setFiles(newFiles);
  }

  const createList = (title) => {
    const newList = {
      id: uuidv4(),
      type: 'list',
      title: title,
      content: [],
      createdAt: (new Date()).getTime(),
    }
    const newFiles = files;
    newFiles.push(newList);
    setFiles(newFiles);
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
  }

  return (
    <div className="App container-fluid">
      <div className='row'>
        <div className={foldersPanelCollapsed ? 'col-1 bg-light fullHeight' : 'col-3 bg-light fullHeight'}>
          <div className='d-flex'>
            <MenuBars
              collapsed={foldersPanelCollapsed}
              onCollapsePanel={collapsePanel}
            />
            <Search
              toShow={!foldersPanelCollapsed}
              files={files}
              onSearch={toSearch}
              onCloseSearch={closeSearch}
            />
          </div>
          <Folders
            searchMode={!!searchKeyword}
            showAll={!foldersPanelCollapsed}
            files={files}
            onCloseSearch={closeSearch}
            onSelectList={setSelectedListID}
            onEditList={editList}
            onCollapsePanel={collapsePanel}
          />
          <CreateList
            showAll={!foldersPanelCollapsed}
            onCreateList={createList}
          />
        </div>
        <div className={foldersPanelCollapsed ? 'col-11 bg-light' : 'col-9 bg-light'}>
          <FunctionBar
            searchMode={!!searchKeyword}
            title={!searchKeyword ? sortedList.title : searchKeyword}
            onSortEntries={sortEntries}
          />
          { !searchKeyword && 
            <CreateItem
              onSubmit={submitEntry}
            />
          }
          <EntryPanel
            searchMode={!!searchKeyword}
            collection={ !searchKeyword ? [sortedList] : searchResult}
            onComplete={completeEntry}
            onUnComplete={unCompleteEntry}
            onStar={starEntry}
            onUnStar={unStarEntry}
            onEditEntry={editEntry}
            onDelEntry={delEntry}
          />
          {/* <button id='createList' onClick={() => {console.log('打开新窗口')}}>打开新窗口</button> */}
        </div>
      </div>
    </div>
  );
}

export default App;
