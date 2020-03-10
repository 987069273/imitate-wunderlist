import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const CreateList = ({ showAll, onCreateList }) => {

    const [ value, setValue ] = useState('');

    const changeHandler = (value) => {
        setValue(value);
    }
    
    return (
        <div className='d-flex justify-content-between align-items-center mb-0 bottom'>
            <FontAwesomeIcon 
                title='添加'
                icon={faPlus}
            />
            { showAll && 
                <>
                    {/* <span>创建清单</span> */}
                    <input placeholder='创建清单' onChange={(e) => {changeHandler(e.target.value)}} />
                    <button onClick={() => {if (value !== '') {onCreateList(value)}}} >submit</button>
                </>
            }
        </div>
    )
}

CreateList.propTypes = {
    showAll: PropTypes.bool,
    onCreateList: PropTypes.func,
}

export default CreateList;