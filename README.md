# wunderlist的模仿应用，使用 react+electron+七牛云 实现

## 环境参数
node版本 > 12.13.1  npm版本 > 6.13.6  electron版本 > 8.0.3

## 启动应用

npm install  
npm run dev  
浏览器会自动打开： http://localhost:3000  

## 初版
实现了对网页版wunderlist的最基本功能模仿，包括对清单和清单条目的增删改查，以及交互上的一些效果。

## 2020.03.13 update
实现了文件的本地存储，以及文件的持久化保存（更新界面不会丢失之前的编辑内容）

## 2020.03.19 update
实现弹窗修改list名称的功能

## 2020.03.25 update
实现了保存文件至云端以及从云端同步文件至本地的功能；修改了窗口菜单，添加了一些快捷键

## 功能

### 界面
分为左右两个界面，右侧可以显示清单内容或搜索结果

![image](https://github.com/987069273/imitate-wunderlist/raw/master/images/界面.png)

### 菜单
electron的菜单功能

![image](https://github.com/987069273/imitate-wunderlist/raw/master/images/菜单——文件.png)

### 折叠左侧面板
![image](https://github.com/987069273/imitate-wunderlist/raw/master/images/折叠左侧面板.jpg)

### 搜索
![image](https://github.com/987069273/imitate-wunderlist/raw/master/images/搜索结果--“阅读”.jpg)

### 右键显示上下文
![image](https://github.com/987069273/imitate-wunderlist/raw/master/images/右键显示上下文.png)

### 新建/编辑清单
通过弹窗的形式提供新建或编辑清单的入口

![image](https://github.com/987069273/imitate-wunderlist/raw/master/images/弹窗--新建或编辑清单.png)

### 保存至本地和云端

![image](https://github.com/987069273/imitate-wunderlist/raw/master/images/成功保存至本地和云端.png)
