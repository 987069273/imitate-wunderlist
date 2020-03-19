import React, { useState, useEffect}from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faAngleDown, faAngleLeft, faEllipsisH, faEllipsisV, faPencilAlt, faListUl } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useContextMenu from '../hooks/useContextMenu';
import {getParentNode} from '../utils/helper';
import classNames from 'classnames';

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
    }, [ selectedListID ]);

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
        <>
            { !!files.length && 
                <ul className='list-group folders-panel'>
                    { showAll && files.map((file) => {
                        let listStyle = file.type === 'list' ? classNames(
                            'd-flex',
                            'justify-content-between',
                            {'selectedList': file.id === selectedListID}
                        ) : undefined;
                        return (
                            <li key={file.id} className='list-group-item' data-id={file.type === 'list' ? file.id : undefined}>
                            { file.type === 'folder' && !collapsedFolderIDs.includes(file.id) &&
                                <>
                                    <div
                                        className='d-flex justify-content-between'
                                        onClick={ () => {troggleCollapse(file.id)} }
                                    >
                                        <span>
                                            <FontAwesomeIcon 
                                                icon={faFolder}
                                            />
                                            {file.title}
                                        </span>
                                        <span>
                                            <FontAwesomeIcon 
                                                icon={faEllipsisH}
                                            />
                                            <FontAwesomeIcon 
                                                icon={faAngleDown}
                                            />
                                        </span>
                                    </div>
                                    <ul className = 'list-group list-group-flush'>
                                    {file.content.map(list => {
                                        listStyle = classNames(
                                            'd-flex',
                                            'justify-content-between',
                                            {'selectedList': list.id === selectedListID}
                                        );
                                        return (
                                            <li key={list.id} className='list-group-item' data-id={list.id}>
                                                <div
                                                    className={listStyle}
                                                    onClick={() => clickList(list.id)}
                                                >
                                                    <span>
                                                        <FontAwesomeIcon 
                                                            icon={faListUl}
                                                        />
                                                        {list.title}
                                                    </span>
                                                    <span>
                                                        {list.content.filter( entry => !entry.completeAt ).length}
                                                        {   list.id === selectedListID &&
                                                            <FontAwesomeIcon 
                                                                icon={faPencilAlt}
                                                                onClick={() => {renameList(list.id)}}
                                                            />
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
                                            icon={faFolder}
                                        />
                                        {file.title}
                                    </span>
                                    <FontAwesomeIcon 
                                        icon={faAngleLeft}
                                    />
                                </div>  
                            }
                            { file.type === 'list' &&
                                <div
                                    className={listStyle}
                                    data-id={file.id}
                                    onClick={() => clickList(file.id)}
                                >
                                    <span>
                                        <FontAwesomeIcon 
                                        icon={faListUl}
                                        />
                                        {file.title}
                                    </span>
                                    <span>
                                        {file.content.filter( entry => !entry.completeAt ).length}
                                        {   file.id === selectedListID &&
                                            <FontAwesomeIcon 
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
                <FontAwesomeIcon 
                    className = 'align-left'
                    icon={faEllipsisV}
                    size='lg'
                    onClick={() => {onCollapsePanel(false)}}
                />
            }
        </>
    );
};

FoldersPanel.propTypes = {
    showAll: PropTypes.bool,
    files: PropTypes.array,
    onEditList: PropTypes.func,
    onCollapsePanel: PropTypes.func,
};

export default FoldersPanel;