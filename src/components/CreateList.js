import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const { ipcRenderer } = window.require('electron');

const CreateList = ({ showAll }) => {

    const clickHandler = () => {
        //使用ipcRenderer模块可以向主进程发送信息
        ipcRenderer.send('open-editList-window');
    }
    
    return (
        <div
            className='d-flex justify-content-between align-items-center mb-0 bottom'
            onClick={() => {clickHandler()}}
        >
            <FontAwesomeIcon 
                title='添加'
                icon={faPlus}
            />
            { showAll && 
                <>
                    <span>创建清单</span>
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