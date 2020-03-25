import React, { useState, useEffect }from 'react';
import PropTypes from 'prop-types';
import Entry from './Entry';
import useContextMenu from '../hooks/useContextMenu';
import { getParentNode } from '../utils/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const EntryPanel = ({searchMode, selectedListID, collection, onComplete, onUnComplete, onStar, onUnStar, onEditEntry, onDelEntry}) => {
    const [ showCompleted, setShowCompleted ] = useState(false);
    const [ activeEntryID, setActiveEntryID ] = useState(false);

    const clickHandler = () => {
        setShowCompleted(!showCompleted);
    }

    const clickSquare = (entry) => {
        if (entry.completeAt) {
            onUnComplete(entry.id);
        }
        else {
            onComplete(entry.id);
        }
    }

    const clickStar = (entry) => {
        if (entry.starred) {
            onUnStar(entry.id);
        }
        else {
            onStar(entry.id);
        }
    }

    const editEntry = (id, value) => {
        onEditEntry(id, value);
        setActiveEntryID(false);
    };

    const deleteEntry = (entryID) => {
        setActiveEntryID(false);
        onDelEntry(entryID);
    }

    const dblClickHandler = (id) => {
        setActiveEntryID(id);
    }

    const clickedItem = useContextMenu([
        {
            label: '重命名',
            click : () => {
                const parentElement = getParentNode(clickedItem.current, 'list-group-item');
                if (parentElement) {
                    setActiveEntryID(parentElement.dataset.id);
                }
            }
        },
        {
            label:'删除',
            click: () => {
                const parentElement = getParentNode(clickedItem.current, 'list-group-item');
                if (parentElement) {
                    onDelEntry(parentElement.dataset.id);
                }
            }
        }
    ], ['.uncompleted-entry-panel', '.completed-entry-panel', '.search-results'],[collection]);

    useEffect(() => {
        setShowCompleted(false);
    },[selectedListID]);

    const completedEntries = !searchMode ? collection[0].content.filter((entry) => entry.completeAt) : null;

    const unCompletedEntries = !searchMode ? collection[0].content.filter((entry) => !entry.completeAt) : null;

    return (
        <>
        { !searchMode &&
            <div>
                <div className='uncompleted-entry-panel'>
                    <ul className='list-group list-group-flush'>
                        { unCompletedEntries.length !== 0 && unCompletedEntries.map((entry) => {
                            return (
                            <li
                                key={entry.id}
                                className='list-group-item'
                                data-id={entry.id}
                                onDoubleClick={() => dblClickHandler(entry.id)}
                            >
                                <Entry
                                    activeEntryID={activeEntryID}
                                    entry={entry}
                                    onClickStar={clickStar}
                                    onClickSquare={clickSquare}
                                    onSubmitChange={editEntry}
                                    onDeleteEntry={deleteEntry}
                                />
                            </li>)
                        })}
                    </ul>
                </div>
                <div className='py-2' onClick = {() => {clickHandler()}}>显示已完成任务</div>
                { showCompleted &&
                    <div className='completed-entry-panel'>
                        <ul className='list-group  list-group-flush'>
                            { completedEntries.length !==0 && completedEntries.map((entry) => {
                                    return (
                                    <li
                                        key={entry.id}
                                        className='list-group-item'
                                        data-id={entry.id}
                                        onDoubleClick={() => dblClickHandler(entry.id)}
                                    >
                                        <Entry
                                            activeEntryID={activeEntryID}
                                            entry={entry}
                                            onClickStar={clickStar}
                                            onClickSquare={clickSquare}
                                            onSubmitChange={editEntry}
                                            onDeleteEntry={deleteEntry}
                                        />
                                    </li>)
                                })
                            }
                        </ul>
                </div>
                }
            </div>
        }
        { searchMode && collection.length !== 0 && 
            <ul className='list-group list-group-flush search-results'>
                { collection.map((item) => {
                    return (
                        <li key={item.id} className='list-group-item'>
                            {item.title}
                            <ul className='list-group'>
                                { item.entries.map(entry => { return (
                                    <li
                                        key={entry.id}
                                        className='list-group-item'
                                        data-id={entry.id}
                                        onDoubleClick={() => dblClickHandler(entry.id)}
                                    >
                                        <Entry
                                            activeEntryID={activeEntryID}
                                            entry={entry}
                                            onClickStar={clickStar}
                                            onClickSquare={clickSquare}
                                            onSubmitChange={editEntry}
                                            onDeleteEntry={deleteEntry}
                                        />
                                    </li>
                                    )}
                                )}
                            </ul>
                        </li>
                    )
                })}
            </ul>
        }
        { searchMode && collection.length === 0 &&
            <div className='noSearchResult'>
                <span>
                <FontAwesomeIcon 
                    title='搜索'
                    icon={faSearch}
                    size='lg'
                />
                </span>
                <span> 无搜索结果</span>
            </div>
        }
        </>
    )
};

EntryPanel.propTypes = {
    collection: PropTypes.array, 
    onComplete: PropTypes.func, 
    onUnComplete: PropTypes.func, 
    onStar: PropTypes.func,
    onUnStar: PropTypes.func,
}

export default EntryPanel;