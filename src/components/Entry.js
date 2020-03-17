import React, { useState, useEffect, useRef }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faStar, faStarHalf, faCheckSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';
import useClickOutside from '../hooks/useClickOutside';
import useContextMenu from '../hooks/useContextMenu';
import { getParentNode } from '../utils/helper';

const Entry = ({activeEntryID, entry, onClickSquare, onClickStar, onEditEntry, onDelEntry, onMenuClick}) => {
    const [ value, setValue ] = useState('');

    const node = useRef(null);

    const enterPressed = useKeyPress(13);
    const escPressed = useKeyPress(27);

    const changeHandler = (e) => {
        setValue(e.target.value);
    }

    const quitEditing = () => {
        onMenuClick(false);
    }

    const deleteEntry = (entryID) => {
        onMenuClick(false);
        setValue('');
        onDelEntry(entryID);
    }

    useEffect(() => {
        if ( entry.id === activeEntryID && enterPressed) {
            onEditEntry(entry.id, value);
            onMenuClick(false);
        }
        if ( entry.id === activeEntryID && escPressed) {
            quitEditing();
        }
    });

    //此处遗留一个bug，当界面的entry数量为偶数时，右击只会闪现菜单；当数量为奇数时，菜单才会常驻
    const clickedItem = useContextMenu([
        {
            label: '重命名',
            click : () => {
                const parentElement = getParentNode(clickedItem.current, 'entry');
                if (parentElement) {
                    onMenuClick(parentElement.dataset.id);
                }
            }
        },
        {
            label:'删除',
            click: () => {
                const parentElement = getParentNode(clickedItem.current, 'entry');
                if (parentElement) {
                    onDelEntry(parentElement.dataset.id);
                }
            }
        }
    ], ['.uncompleted-entry-panel', '.completed-entry-panel', '.search-results']);

    useEffect(() => {
        if ( entry.id === activeEntryID) {
            node.current.focus();
        }
    },[activeEntryID]);  
    
     useClickOutside(node, () => {
         if(entry.id === activeEntryID) {
             quitEditing();
         }
     },[activeEntryID]);

    return (
        <>
            <span className='row entry' data-id={entry.id}>
                { !entry.completeAt &&
                    <span className='col-1'>
                        <FontAwesomeIcon 
                            icon={faSquare}
                            size='lg'
                            onClick={() => {onClickSquare(entry)}}
                        />
                    </span>
                }
                { entry.completeAt &&
                    <span className='col-1'>
                        <FontAwesomeIcon 
                            icon={faCheckSquare}
                            size='lg'
                            onClick={() => {onClickSquare(entry)}}
                        />
                    </span>
                }
                { (entry.id !== activeEntryID) &&
                    <span className='col-10' 
                    onDoubleClick={(e) => {onMenuClick(entry.id)}}>{entry.content}</span>
                }
                { (entry.id === activeEntryID) &&
                    <>
                        <span className='col-9'>
                            <input
                                type='text'
                                ref={node}
                                onChange={(e) => {changeHandler(e)}}
                            />
                        </span>
                        <span className='col-1'>
                            <FontAwesomeIcon 
                                title='删除'
                                icon={faTrash}
                                size='lg'
                                onClick={() => {deleteEntry(entry.id)}}
                            />
                        </span>
                    </>
                }
                { entry.completeAt && 
                    <>{ entry.completeAt }</>
                }
            
                { entry.starred &&
                    <span className='col-1'>
                        <FontAwesomeIcon 
                            icon={faStar}
                            size='lg'
                            onClick={() => {onClickStar(entry)}}
                        />
                    </span>
                }
                { !entry.starred &&
                    <span className='col-1'>
                        <FontAwesomeIcon 
                            icon={faStarHalf}
                            size='lg'
                            onClick={() => {onClickStar(entry)}}
                        />
                    </span>
                }
            </span>
        </>
    );
}

Entry.propTypes = {
    entry: PropTypes.object,
    onClickSquare: PropTypes.func,
    onClickStar: PropTypes.func,
}

export default Entry;