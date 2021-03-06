import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const CreateList = ({ showAll, createNewList }) => {

    const clickHandler = () => {
        createNewList();
    }
    
    return (
        <div
            className='d-flex align-items-center my-1 mr-0 bottom'
            style={{height: '26px'}}
            onClick={() => {clickHandler()}}
        >
            <button className='btn px-0 shadow-none'>
                <FontAwesomeIcon 
                    className='mr-1'
                    title='添加'
                    icon={faPlus}
                />
                { showAll && 
                    <>
                        <span>创建清单</span>
                    </>
                }
            </button>
        </div>
    )
}

CreateList.propTypes = {
    showAll: PropTypes.bool,
    onCreateList: PropTypes.func,
}

export default CreateList;