import React, { useState, useEffect, useRef }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faStar as solidStar, faTrash} from '@fortawesome/free-solid-svg-icons';
import { faSquare, faStar, }  from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';
import useClickOutside from '../hooks/useClickOutside';

const Entry = ({activeEntryID, entry, onClickSquare, onClickStar, onSubmitChange, onDeleteEntry/* , onDblClick */}) => {
    const [ value, setValue ] = useState('');

    const node = useRef(null);

    const enterPressed = useKeyPress(13);
    const escPressed = useKeyPress(27);

    const getStandardTime = (millisec) => {
        const d = new Date();
        d.setTime(millisec);
        const months = {0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec'};
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    };

    const changeHandler = (e) => {
        setValue(e.target.value);
    }

    const quitEditing = () => {
        onSubmitChange(entry.id, entry.content);
        setValue('');
    }

    const deleteEntry = (entryID) => {
        setValue('');
        onDeleteEntry(entryID);
    }

    useEffect(() => {
        if ( entry.id === activeEntryID && enterPressed) {
            onSubmitChange(entry.id, value);
        }
        if ( entry.id === activeEntryID && escPressed) {
            quitEditing();
        }
    });

    useEffect(() => {
        if ( entry.id === activeEntryID ) {
            node.current.value = entry.content;
            node.current.focus();
        }
    },[activeEntryID]);
    
     useClickOutside(node, () => {
         if( entry.id === activeEntryID ) {
             quitEditing();
         }
     },[activeEntryID]);

    return (
            <span className='row justify-content-between align-items-center'>
                <span className='row px-3'>
                    { !entry.completeAt &&
                        <span className='mx-2'>
                            <FontAwesomeIcon 
                                icon={faSquare}
                                size='lg'
                                onClick={() => {onClickSquare(entry)}}
                            />
                        </span>
                    }
                    { entry.completeAt &&
                        <span className='mx-2'>
                            <i className='fa fa-square-o'></i>
                            <FontAwesomeIcon 
                                icon={faCheckSquare}
                                size='lg'
                                onClick={() => {onClickSquare(entry)}}
                            />
                        </span>
                    }
                    { (entry.id !== activeEntryID) &&
                        <span
                            /* onDoubleClick={(e) => {onDblClick(entry.id)}} */
                        >
                            {entry.completeAt &&
                                <div
                                    className='py-0 my-n3 align-items-center'  //my-n3为纵向margin为-0.75rem
                                > 
                                    <del className='d-block my-0'>{entry.content}</del>
                                    <small className='d-block my-0'>{ getStandardTime(entry.completeAt) }</small>
                                </div>
                            }
                            {!entry.completeAt &&
                                <div className='py-auto'>{entry.content}</div>
                            }
                        </span>
                    }
                    { (entry.id === activeEntryID) &&
                        <span className='my-n1'>
                            <input
                                type='text'
                                ref={node}
                                onChange={(e) => {changeHandler(e)}}
                            />
                        </span>
                    }
                </span>
                <span>
                    { (entry.id === activeEntryID) &&
                        <span>
                        <FontAwesomeIcon 
                            className='mx-2'
                            title='删除'
                            icon={faTrash}
                            size='lg'
                            onClick={() => {deleteEntry(entry.id)}}
                        />
                    </span>
                    }      
                    { !entry.starred &&
                        <span>
                            <FontAwesomeIcon 
                                className='mx-2'
                                icon={faStar}
                                size='lg'
                                onClick={() => {onClickStar(entry)}}
                            />
                        </span>
                    }
                    { entry.starred &&
                        <span>
                            <FontAwesomeIcon 
                                className='mx-2'
                                icon={solidStar}
                                size='lg'
                                onClick={() => {onClickStar(entry)}}
                            />
                        </span>
                    }
                </span>
            </span>
    );
}

Entry.propTypes = {
    entry: PropTypes.object,
    onClickSquare: PropTypes.func,
    onClickStar: PropTypes.func,
}

export default Entry;