import React, { useState, useEffect }from 'react';
import PropTypes from 'prop-types';
import Entry from './Entry';

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

    const clickTrash = (entryID) => {
        onDelEntry(entryID);
    }

    const selectMenuItem = (id) => {
        setActiveEntryID(id);
    }

    useEffect(() => {
        setShowCompleted(false);
    },[selectedListID]);

    const completedEntries = !searchMode ? collection[0].content.filter((entry) => entry.completeAt) : null;

    const unCompletedEntries = !searchMode ? collection[0].content.filter((entry) => !entry.completeAt) : null;

    return (
        <div>
        { !searchMode &&
            <div>
                <div className='uncompleted-entry-panel'>
                    <ul className='list-group list-group-flush'>
                        { unCompletedEntries.length !== 0 && unCompletedEntries.map((entry) => {
                            return (
                            <li
                                key={entry.id}
                                className='list-group-item'
                            >
                                <Entry
                                    activeEntryID={activeEntryID}
                                    entry={entry}
                                    onClickStar={clickStar}
                                    onClickSquare={clickSquare}
                                    onEditEntry={onEditEntry}
                                    onDelEntry={clickTrash}
                                    onMenuClick={selectMenuItem}
                                />
                            </li>)
                        })}
                    </ul>
                </div>
                <span onClick = {() => {clickHandler()}}>显示已完成任务</span>
                { showCompleted &&
                    <div className='completed-entry-panel'>
                        <ul className='list-group'>
                            { completedEntries.length !==0 && completedEntries.map((entry) => {
                                    return (
                                    <li key={entry.id} className='list-group-item'>
                                        <Entry
                                            activeEntryID={activeEntryID}
                                            entry={entry}
                                            onClickStar={clickStar}
                                            onClickSquare={clickSquare}
                                            onEditEntry={onEditEntry}
                                            onDelEntry={clickTrash}
                                            onMenuClick={selectMenuItem}
                                        />
                                    </li>)
                                })
                            }
                        </ul>
                </div>
                }
            </div>
        }
        { searchMode && 
            <ul className='list-group search-results'>
                { collection.map((item) => {
                    return (
                        <li key={item.id} className='list-group-item'>
                            {item.title}
                            <ul className='list-group'>
                                { item.entries.map(entry => { return (
                                    <li key={entry.id} className='list-group-item'>
                                        <Entry
                                            activeEntryID={activeEntryID}
                                            entry={entry}
                                            onClickStar={clickStar}
                                            onClickSquare={clickSquare}
                                            onEditEntry={onEditEntry}
                                            onDelEntry={clickTrash}
                                            onMenuClick={selectMenuItem}
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
        </div>
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