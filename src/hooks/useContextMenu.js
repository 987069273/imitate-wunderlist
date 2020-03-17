import { useEffect, useRef } from "react";
const { remote } = window.require('electron');
const { Menu, MenuItem } = remote;

const useContextMenu = (itemArr, targetSelectors, deps) => {
    //使用useRef可以使当前的这个节点在多次渲染中保持
    let clickedElement = useRef(null);
    useEffect(() => {
        //创建菜单
        const menu = new Menu();
        itemArr.forEach(item => {
            menu.append(new MenuItem(item));
        })
        const handleContextMenu = (e) => {
            //only show the context menu on current dom element or targetSelector contains target
            targetSelectors.forEach(selector => {
                if (document.querySelector(selector) && document.querySelector(selector).contains(e.target)) {
                    //对于每一次contextmenu事件，都可以通过useRef获得当前节点
                    clickedElement.current = e.target;
                    menu.popup({ window: remote.getCurrentWindow() });
                }
            })
        }
        //绑定事件
        window.addEventListener('contextmenu', handleContextMenu);
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
        }
    }, deps)
    return clickedElement;
};

export default useContextMenu;