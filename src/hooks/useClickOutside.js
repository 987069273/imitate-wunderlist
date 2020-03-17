import { useEffect } from 'react';

const useClickOutside = (node, handler, conditions) => {
    useEffect(()=>{
        document.addEventListener('click',(e) => {if (node.current && e.target !== node.current) { handler()} });
        return () => {document.removeEventListener('click', (e) => { if (node.current && e.target !== node.current) { handler()} })}
    }, conditions)
};

export default useClickOutside;