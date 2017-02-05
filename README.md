# node-pub-server
nodejs 一键上传发布工具
## 简介 ##
node-pub-server是一款简洁、方便的部署工具，可以对打包后的项目进行一键部署。

该工具是由基于[nodejs](https://nodejs.org/en/)的[gulp](http://www.gulpjs.com.cn/)搭建。

## 功能 ##
- 一键支持服务器留存版本
- 一键支持服务器发布版本
- 记录留存版本和其他信息

## 使用 ##
工作目录为
    
	/
	|——dist/ 需要部署项目的打包目录
	|——node-pub-server/ 一键部署工具置放目录
		|——cnpm_install.bat 点击安装本项目的依赖
		|——server.json 服务器配置信息
		|——server_pub.bat 一键发布
		|——server_release.bat 一键留存
		|——gulpfile.js
		|——package.json 




1. 安装[nodejs](https://nodejs.org/en/)、[gulpjs](http://www.gulpjs.com.cn/)和[cnpm](https://npm.taobao.org/)
2. 初始化：切到node-pub-server根目录运行`cnpm install`或者点击cnpm_install.bat文件
3. 编写server.json即服务器配置信息文件，参照注释
4. 项目留存点击*server_release.bat*文件
5. 项目发布点击*server_pub.bat*文件

具体工作流程请参照**gulpfile.js**文件






 

