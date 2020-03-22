import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const MenuBars = ({ collapsed, onCollapsePanel }) => {
    return (
        <div className='my-auto align-items-center' style={{height: '26px'}}>
            <FontAwesomeIcon 
                title='汉堡菜单'
                icon={faBars}
                onClick={() => {onCollapsePanel(!collapsed)}}
            />
        </div>
    )
}

MenuBars.propTypes = {
    collapsed: PropTypes.bool,
    onCollapsePanel: PropTypes.func,
};

export default MenuBars;