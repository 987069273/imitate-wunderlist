import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faSortAlphaDown, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const FunctionBar = ({ searchMode, title, onSortEntries }) => {
    return (
        <div className='d-flex justify-content-between'>
            <h5>{title}</h5>
            <span>
                {/* {
                    !searchMode && 
                    <>
                        <FontAwesomeIcon 
                            title='共享'
                            icon={faShare}
                            size='lg'
                        />
                        <FontAwesomeIcon 
                            title='排序'
                            icon={faSortAlphaDown}
                            size='lg'
                            onClick={() => {onSortEntries('content')}}
                        />
                    </>
                } */}
            <FontAwesomeIcon 
                title='更多'
                icon={faEllipsisH}
                size='lg'
            />
            </span>
        </div>
    )
};

FunctionBar.propTypes = {
    title: PropTypes.string,
    entries: PropTypes.array,
    onSearchEntries: PropTypes.func,
};

export default FunctionBar;