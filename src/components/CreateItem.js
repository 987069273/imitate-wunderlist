import React, { useState, useEffect, useRef }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendar, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';

const CreateItem = ({ onSubmit }) => {

    const [ inputActive, setInputActive ] = useState(false);
    const [ value, setValue ] = useState('');
    const [ star, setStar ] = useState(false);
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

    const toStar = (option) => {
        setStar(option);
    }

    useEffect(() => {
        if (enterPressed && inputActive && value !== '') {
            console.log(value);
            console.log(star);
            onSubmit(value, star);
            setInputActive(false);
            setValue('');
            setStar(false);
        }
        if (escPressed && inputActive) {
            quitCreating();
            setStar(false);
        }
    });

    useEffect(() => {
        if (inputActive) {
            node.current.focus();
        }
    },[inputActive, star]);

    return (
        <div className='py-2'>
            <FontAwesomeIcon 
                className='mr-1'
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
                        className='ml-1'
                        title='日历'
                        icon={faCalendar}
                        size='lg'
                    /> */}
                    { !star &&
                        <FontAwesomeIcon 
                            className='ml-1'
                            title='星标'
                            icon={faStar}
                            size='lg'
                            onClick={() => {toStar(true)}}
                        />
                    }
                    { star &&
                        <FontAwesomeIcon 
                            className='ml-1'
                            title='星标'
                            icon={solidStar}
                            size='lg'
                            onClick={() => {toStar(false)}}
                        />
                    }
                </>
            }
        </div>
    )
}

CreateItem.propTypes = {
    onSubmit: PropTypes.func,
}

export default CreateItem;

