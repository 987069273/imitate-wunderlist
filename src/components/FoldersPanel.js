import React, { useState, useEffect}from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faAngleDown, faAngleLeft, faEllipsisH, faEllipsisV, faPencilAlt, faListUl } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useContextMenu from '../hooks/useContextMenu';
import {getParentNode} from '../utils/helper';

const { ipcRenderer } = window.require('electron');

const FoldersPanel = ({ showAll, selectedListID, files, onSelectList, onCollapsePanel, onDelList }) => {
    const [ collapsedFolderIDs, setCollapsedFolderIDs ] = useState([]);

    const clickList = (id) => {
        onSelectList(id);
    };

    const renameList = (id) => {
        let file = files.find( file => file.id === id );
        file = file ? file : files.find( file => file.content.some( list => list.id === id ));
        let listTitle;
        if( file ) {
            listTitle =  file.title;
        }
        ipcRenderer.send('open-editList-window', listTitle);
    };

    const troggleCollapse = (id) => {
        if (collapsedFolderIDs.includes(id)){
            const afterTroggle = collapsedFolderIDs.filter( (folderID) => folderID !== id );
            setCollapsedFolderIDs(afterTroggle);
        }
        else {
            setCollapsedFolderIDs(collapsedFolderIDs.concat(id));
        }
    };

    //保持网页标题与选中的列表名称相同
    useEffect(() => {
        let file = files.find( file => file.id === selectedListID );
        file = file ? file : files.find( file => file.content.some( list => list.id === selectedListID ));
        if( file ) {
            const listTitle =  file.title;
            document.title = listTitle;
        }
        else {
            document.title = 'wunderlist';
        }
    }, [ selectedListID, files ]);

    const clickedList = useContextMenu([
        {
            label: '重命名',
            click : () => {
                const parentElement = getParentNode(clickedList.current, 'list-group-item');
                if (parentElement) {
                    renameList(parentElement.dataset.id);
                }
            }
        },
        {
            label:'删除',
            click: () => {
                const parentElement = getParentNode(clickedList.current, 'list-group-item');
                if (parentElement) {
                    onDelList(parentElement.dataset.id);
                }                
            }
        }
    ], ['.folders-panel'], [files, selectedListID]);

    return (
        <div className='verticalScroll'>
            { !!files.length && 
                <ul className='list-group folders-panel'>
                    { showAll && files.map((file) => {
                        return (
                            <li
                                key={file.id}
                                className={file.id === selectedListID ? 'list-group-item-primary list-group-item' : 'list-group-item'}
                                data-id={file.type === 'list' ? file.id : undefined}
                                onClick={file.type === 'list' ? () => clickList(file.id) : undefined}
                            >
                            { file.type === 'folder' && !collapsedFolderIDs.includes(file.id) &&
                                <>
                                    <div
                                        className='d-flex justify-content-between'
                                        onClick={ () => {troggleCollapse(file.id)} }
                                    >
                                        <span>
                                            <FontAwesomeIcon 
                                                className='mr-1'
                                                icon={faFolder}
                                            />
                                            {file.title}
                                        </span>
                                        <span >
                                            <FontAwesomeIcon 
                                                className='mr-1'
                                                icon={faEllipsisH}
                                            />
                                            <FontAwesomeIcon 
                                                className='mr-1'
                                                icon={faAngleDown}
                                            />
                                        </span>
                                    </div>
                                    <ul className = 'list-group list-group-flush'>
                                    {file.content.map(list => {
                                        return (
                                            <li
                                                key={list.id}
                                                className={list.id === selectedListID ? 'list-group-item-primary list-group-item' : 'list-group-item'}
                                                data-id={list.id}
                                                onClick={() => clickList(file.id)}
                                            >
                                                <div
                                                    className='d-flex justify-content-between'
                                                >
                                                    <span >
                                                        <FontAwesomeIcon 
                                                            className='mr-1'
                                                            icon={faListUl}
                                                        />
                                                        {list.title}
                                                    </span>
                                                    <span>
                                                        {list.content.filter( entry => !entry.completeAt ).length}
                                                        {   list.id === selectedListID &&
                                                            <span>
                                                                <FontAwesomeIcon 
                                                                    className='ml-1'
                                                                    icon={faPencilAlt}
                                                                    onClick={() => {renameList(list.id)}}
                                                                />
                                                            </span>
                                                        }
                                                    </span>                                                    
                                                </div>
                                            </li>
                                        )
                                    })}
                                    </ul>
                                </>    
                            }
                            { file.type === 'folder' && collapsedFolderIDs.includes(file.id) &&
                                <div
                                    className='d-flex justify-content-between'
                                    onClick={ () => {troggleCollapse(file.id)} }
                                >
                                    <span>
                                        <FontAwesomeIcon 
                                            className='mr-1'
                                            icon={faFolder}
                                        />
                                        {file.title}
                                    </span>
                                    <FontAwesomeIcon 
                                        className='mr-1'
                                        icon={faAngleLeft}
                                    />
                                </div>  
                            }
                            { file.type === 'list' &&
                                <div
                                    className='d-flex justify-content-between'
                                    data-id={file.id}
                                >
                                    <span>
                                        <FontAwesomeIcon 
                                        className='mr-1'
                                        icon={faListUl}
                                        />
                                        {file.title}
                                    </span>
                                    <span>
                                        {file.content.filter( entry => !entry.completeAt ).length}
                                        {   file.id === selectedListID &&
                                            <FontAwesomeIcon 
                                                className='ml-1'
                                                icon={faPencilAlt}
                                                onClick={() => { renameList(file.id) }}
                                            />
                                        }
                                    </span>
                                </div>
                            }
                            </li>
                        )
                    })}
                </ul>
            }
            { !showAll && 
                <div className='row justify-content-center'>
                    <FontAwesomeIcon
                        icon={faEllipsisV}
                        size='lg'
                        onClick={() => {onCollapsePanel(false)}}
                    />
                </div>
            }
        </div>
    );
};

FoldersPanel.propTypes = {
    showAll: PropTypes.bool,
    files: PropTypes.array,
    onEditList: PropTypes.func,
    onCollapsePanel: PropTypes.func,
};

export default FoldersPanel;