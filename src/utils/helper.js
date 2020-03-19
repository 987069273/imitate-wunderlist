//一种响应不断上浮的效果
export const getParentNode = (node, parentClassName) => {
    let current = node;
    while(current !== null) {
        if (current.classList.contains(parentClassName)) { //classList有较多的方法
            return current;
        }
        current = current.parentNode;
    }
    return false;
}