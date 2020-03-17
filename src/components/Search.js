import React, { useState, useRef, useEffect }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';
import useClickOutSide from '../hooks/useClickOutside';

const Search = ({ toShow, onSearch, onCloseSearch }) => {
    const [ isSearching, setIsSearching ] = useState(false);
    const [ value, setValue ] = useState('');
    const node = useRef(null);

    const enterPressed = useKeyPress(13);
    const escPressed = useKeyPress(27);

    const changeHandler = (e) => {
        setValue(e.target.value);
    };

    const exitSearching = () => {
        onCloseSearch();
        setIsSearching(false);
        setValue('');
    }

    useEffect(() => {
        if(enterPressed && isSearching) {
            onSearch(value);
            setIsSearching(false);
        }
        if(escPressed && isSearching) {
            exitSearching();
        }
    });

    useEffect(() => {
        if(isSearching){
            node.current.focus();
        }
    },[isSearching]);

    useClickOutSide(node,() => {
        if(isSearching){
            exitSearching();
        }
    });

    return (
        <div className={isSearching ? 'input-group mb-3' : ''}>
            { toShow && !isSearching && 
                <>
                    <input
                        type='text'
                        ref={node}
                        onClick={() => setIsSearching(true)}
                        onChange={(e) => changeHandler(e)}
                    />
                    <span
                        onClick={() => setIsSearching(true)}
                    >
                        <FontAwesomeIcon 
                            title='搜索'
                            icon={faSearch}
                            size='lg'
                        />
                    </span>
                </>
            }
            { toShow && isSearching && 
                <>
                    <input
                        type='text'
                        ref={node}
                        onChange={(e) => changeHandler(e)}
                    />
                    <span
                        onClick={() => exitSearching()}
                    >
                        <FontAwesomeIcon 
                            title='关闭'
                            icon={faTimes}
                            size='lg'
                        />
                    </span>
                </>
            }
        </div>

    )
};

Search.propTypes = {
    files: PropTypes.array,
    isCollapsed: PropTypes.bool,
    onSearch: PropTypes.func,
}

export default Search;