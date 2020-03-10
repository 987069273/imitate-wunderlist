import React, { useState, useEffect }from 'react';
import PropTypes from 'prop-types';
import Entry from './Entry';
import useForceUpdate from 'use-force-update';

const EntryPanel = ({searchMode, collection, onComplete, onUnComplete, onStar, onUnStar, onEditEntry, onDelEntry}) => {
    const [ showCompleted, setShowCompleted ] = useState(false);

    const forceUpdate = useForceUpdate();

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
        forceUpdate();
    }

    const clickStar = (entry) => {
        if (entry.starred) {
            onUnStar(entry.id);
        }
        else {
            onStar(entry.id);
        }
        forceUpdate();
    }

    const clickTrash = (entryID) => {
        onDelEntry(entryID);
        forceUpdate();
    }

    const completedEntries = !searchMode ? collection[0].content.filter((entry) => entry.completeAt) : null;

    const unCompletedEntries = !searchMode ? collection[0].content.filter((entry) => !entry.completeAt) : null;

    useEffect(() => {
        setShowCompleted(false);
    },[collection]);

    return (
        <>
        { !searchMode &&
            <div>
                <ul className='list-group list-group-flush'>
                    { unCompletedEntries.length !== 0 && unCompletedEntries.map((entry) => {
                        return (
                        <li
                            key={entry.id}
                            className='list-group-item'
                        >
                            <Entry
                                entry={entry}
                                onClickStar={clickStar}
                                onClickSquare={clickSquare}
                                onEditEntry={onEditEntry}
                                onDelEntry={clickTrash}
                            />
                        </li>)
                    })}
                </ul>
                <span onClick = {() => {clickHandler()}}>显示已完成任务</span>
                { showCompleted &&
                    <ul className='list-group'>
                        { completedEntries.length !==0 && completedEntries.map((entry) => {
                                return (
                                <li key={entry.id} className='list-group-item'>
                                    <Entry
                                        entry={entry}
                                        onClickStar={clickStar}
                                        onClickSquare={clickSquare}
                                        onEditEntry={onEditEntry}
                                        onDelEntry={clickTrash}
                                    />
                                </li>)
                            })
                        }
                    </ul>
                }
            </div>
        }
        { searchMode && 
            <ul className='list-group'>
                { collection.map((item) => {
                    return (
                        <li key={item.id} className='list-group-item'>
                            {item.title}
                            <ul className='list-group'>
                                { item.entries.map(entry => { return (
                                    <li key={entry.id} className='list-group-item'>
                                        <Entry
                                            entry={entry}
                                            onClickStar={clickStar}
                                            onClickSquare={clickSquare}
                                            onEditEntry={onEditEntry}
                                            onDelEntry={clickTrash}
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