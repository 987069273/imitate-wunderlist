import React, { useState, useEffect, useRef }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faAngleDown, faAngleLeft, faEllipsisH, faEllipsisV, faPencilAlt, faListUl } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';

const FoldersPanel = ({ searchMode, showAll, files, onCloseSearch, onSelectList, onEditList, onCollapsePanel }) => {
    const [ collapsedFolderIDs, setCollapsedFolderIDs ] = useState([]);
    const [ listIDSelected, setListIDSelected ] = useState(false);
    const [ editStatus, setEditStatus ] = useState(false);
    const [ value, setValue ] = useState('');

    const node = useRef(null);

    const enterPressed = useKeyPress(13);
    const escPressed = useKeyPress(27);

    const clickList = (id) => {
        if (searchMode) {
            onCloseSearch();
        }
        setListIDSelected(id);
        onSelectList(id);
    };

    const quitEditing = () => {
        setEditStatus(false);
        setValue('');
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

    useEffect(() => {
        if(enterPressed && editStatus) {
            onEditList(value);
            setEditStatus(false);
        }
        if(escPressed && editStatus) {
            quitEditing();
        }
    });

    useEffect(() => {
        if(editStatus){
            node.current.focus();
        }
    },[editStatus]);

    useEffect(() => {
        let file = files.find( file => file.id === listIDSelected );
        file = file ? file : files.find( file => file.content.some( list => list.id === listIDSelected ));
        if( file ) {
            const listTitle =  file.title;
            document.title = listTitle;
        }
    }, [ listIDSelected ]);

    return (
        <>
            <ul className='list-group'>
            { showAll && files.map((file) => {
                return (
                    <li key={file.id} className='list-group-item'>
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
                                return (
                                    <li key={list.id} className='list-group-item'>
                                    { list.id !== listIDSelected && 
                                        <div
                                            className='d-flex justify-content-between'
                                            onClick={() => clickList(list.id)}
                                        >
                                            <span>
                                                <FontAwesomeIcon 
                                                icon={faListUl}
                                            />
                                            {list.title}
                                            </span>
                                            <span>{list.content.length}</span>
                                        </div>
                                    }
                                    {
                                        list.id === listIDSelected && 
                                        <div className='d-flex justify-content-between selectedEntry' onClick={() => clickList(list.id)}>
                                            { list.id !== editStatus &&
                                                <>
                                                    <span>
                                                        <FontAwesomeIcon 
                                                            icon={faListUl}
                                                        />
                                                        {list.title}
                                                    </span>
                                                    <span>
                                                        {list.content.length}
                                                        <FontAwesomeIcon 
                                                            icon={faPencilAlt}
                                                            onClick={() => {setEditStatus(list.id)}}
                                                        />
                                                    </span>
                                                </>
                                            }
                                            { list.id === editStatus &&
                                            <>
                                                <FontAwesomeIcon 
                                                    icon={faListUl}
                                                />
                                                <input
                                                    ref={node}
                                                    onChange={(e) => {setValue(e.target.value)}}
                                                />
                                            </>
                                            }
                                            
                                        </div>
                                    }
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
                    { file.type === 'list' && file.id === listIDSelected &&
                        <div
                            className='d-flex justify-content-between selectedEntry'
                            onClick={() => clickList(file.id)}
                        >
                            
                            { file.id !== editStatus &&
                                <>
                                    <span>
                                        <FontAwesomeIcon 
                                        icon={faListUl}
                                        />
                                        {file.title}
                                    </span>
                                    <span>
                                        {file.content.length}
                                        <FontAwesomeIcon 
                                            icon={faPencilAlt}
                                            onClick={() => {setEditStatus(file.id)}}
                                        />
                                    </span>
                                </>
                            }
                            { file.id === editStatus &&
                                <>
                                    <FontAwesomeIcon 
                                    icon={faListUl}
                                    />
                                    <input
                                        ref={node}
                                        onChange={(e) => {setValue(e.target.value)}}
                                    />
                                </>
                            }
                        </div>
                    }
                    { file.type === 'list' && file.id !== listIDSelected &&
                        <div
                            className='d-flex justify-content-between'
                            onClick={() => clickList(file.id)}
                        >
                            <span>
                                <FontAwesomeIcon 
                                    icon={faListUl}
                                />
                                {file.title}
                            </span>
                            {file.content.length}
                        </div>
                    }
                    </li>
                )
            })}
        </ul>
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