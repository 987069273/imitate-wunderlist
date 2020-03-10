import React, { useState, useEffect, useRef }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faStar, faStarHalf, faCheckSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';

const Entry = ({entry, onClickSquare, onClickStar, onEditEntry, onDelEntry}) => {
    const [ inputActive, setInputAcitve ] = useState(false);
    const [ value, setValue ] = useState('');

    const node = useRef(null);

    const enterPressed = useKeyPress(13);
    const escPressed = useKeyPress(27);

    const changeHandler = (e) => {
        setValue(e.target.value);
    }

    const quitEditing = () => {
        setInputAcitve(false);
        setValue('');
    }

    const deleteEntry = (entryID) => {
        quitEditing();
        onDelEntry(entryID);
    }

    useEffect(() => {
        if (inputActive && enterPressed) {
            onEditEntry(entry.id, value);
            setInputAcitve(false);
        }
        if (inputActive && escPressed) {
            quitEditing();
        }
    });

    useEffect(() => {
        if (inputActive) {
            node.current.focus();
        }
    },[inputActive]);
    

    return (
        <>
            <span>
                { !entry.completeAt &&
                    <FontAwesomeIcon 
                        icon={faSquare}
                        size='lg'
                        onClick={() => {onClickSquare(entry)}}
                    />
                }
                { entry.completeAt &&
                    <FontAwesomeIcon 
                        icon={faCheckSquare}
                        size='lg'
                        onClick={() => {onClickSquare(entry)}}
                    />
                }
                { !inputActive &&
                    <span onDoubleClick={() => {setInputAcitve(true)}}>{entry.content}</span>
                }
                { inputActive &&
                    <>
                        <input
                            type='text'
                            ref={node}
                            onChange={(e) => {changeHandler(e)}}
                        />
                        <FontAwesomeIcon 
                            title='删除'
                            icon={faTrash}
                            size='lg'
                            onClick={() => {deleteEntry(entry.id)}}
                        />
                    </>
                }
                { entry.completeAt && 
                    <>{ entry.completeAt }</>
                }
            </span>
            { entry.starred &&
                <FontAwesomeIcon 
                    icon={faStar}
                    size='lg'
                    onClick={() => {onClickStar(entry)}}
                />
            }
            { !entry.starred &&
                <FontAwesomeIcon 
                    icon={faStarHalf}
                    size='lg'
                    onClick={() => {onClickStar(entry)}}
                />
            }
        </>
    );
}

Entry.propTypes = {
    entry: PropTypes.object,
    onClickSquare: PropTypes.func,
    onClickStar: PropTypes.func,
}

export default Entry;