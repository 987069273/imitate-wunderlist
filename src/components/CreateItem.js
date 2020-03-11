import React, { useState, useEffect, useRef }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendar, faStar, } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';

const CreateItem = ({ onSubmit }) => {

    const [ inputActive, setInputActive ] = useState(false);
    const [ value, setValue ] = useState('');
    const node = useRef(null);

    const enterPressed = useKeyPress(13);
    const escPressed = useKeyPress(27);

    const startCreating = () => {
        setInputActive(true);
    }

    const quitCreating = () => {
        setInputActive(false);
        setValue('');
    }

    const changeHandler = (e) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        if (enterPressed && inputActive && value !== '') {
            onSubmit(value);
            setInputActive(false);
            setValue('');
        }
        if (escPressed && inputActive) {
            quitCreating();
        }
    });

    useEffect(() => {
        if (inputActive) {
            node.current.focus();
        }
    },[inputActive]);

    return (
        <div>
            <FontAwesomeIcon 
                title='添加'
                icon={faPlus}
                size='lg'
            />
            { !inputActive && 
                <>
                    <input
                        type='text'
                        ref={node}
                        value={value}
                        placeholder='添加任务...'
                        onClick={() => {startCreating()}}
                        onChange={(e) => {changeHandler(e)}}
                    />
                    <div>

                    </div>
                </>
            }
            { inputActive && 
                <>
                    <input
                        type='text'
                        ref={node}
                        value={value}
                        placeholder='添加任务...'
                        onChange={(e) => {changeHandler(e)}}
                    />
                    {/* <FontAwesomeIcon 
                        title='日历'
                        icon={faCalendar}
                        size='lg'
                    /> */}
                    <FontAwesomeIcon 
                        title='星标'
                        icon={faStar}
                        size='lg'
                    />
                </>
            }
        </div>
    )
}

CreateItem.propTypes = {
    onSubmit: PropTypes.func,
}

export default CreateItem;

