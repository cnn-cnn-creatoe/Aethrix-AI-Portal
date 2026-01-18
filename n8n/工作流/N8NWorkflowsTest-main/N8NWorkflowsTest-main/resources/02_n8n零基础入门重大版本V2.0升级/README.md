# 1、n8n介绍  

n8n官网：https://n8n.io/                                       
n8n Github地址：https://github.com/n8n-io/n8n   星标 162K                                                   
n8n介绍:是一款灵活的工作流自动化平台，为技术团队提供代码的灵活性与无代码的敏捷性                                

n8n 在 2025 年 12 月 8 日发布了 2.0 测试版,这是一个以安全性、可靠性和性能为核心的重大版本更新                       

1.x 版本将在 2.0 发布后继续支持 3 个月,期间仅提供安全和 bug 修复                 

发布时间线:            
- 测试版(2.0.0): 2025年12月8日                  
- 稳定版(2.0.x): 2025年12月15日                          

重大更新说明: https://docs.n8n.io/2-0-breaking-changes/                   

# 2、首次部署2.X版本 和 由1.X升级到2.X 同样适用
  
## 2.1 基础准备             

对n8n使用Docker方式部署不清楚的，大家先观看这期视频：                 

01_n8n零基础入门一次搞定：Docker私有化部署平台 +服务零数据丢失安全升级 + 平台语言汉化 + 快速入门三件法宝             
- 资料在 resource 文件夹中的 01_*** 文件夹，下载即可                      
- YouTube频道对应视频: https://youtu.be/Ldf15CPDY9Y                                    
- B站频道对应视频: https://www.bilibili.com/video/BV1Aq1NBYELp/             

## 2.2 Docker部署n8n 2.X版本  

打开命令行终端，在终端中运行以下n8n部署指令,在运行指令之前请先阅读指令说明部分:             

`docker run -d --name n8n_v2 -p 5678:5678 -e GENERIC_TIMEZONE="Asia/Shanghai" -e TZ="Asia/Shanghai" -e NODES_EXCLUDE="[]" -v /Volumes/Files/n8n:/home/node/.n8n -v /Volumes/Files/n8n-files:/home/node/.n8n-files docker.n8n.io/n8nio/n8n:2.0.1`           

服务部署完成后，执行命令 `docker exec n8n_v2 n8n --version` 验证版本                       
浏览器打开 http://localhost:5678/ 进入到n8n的web端页面，首次需要进行注册和登录                                  

**指令说明:**        
- (1)`--name n8n_v2 -p 5678:5678`               
为设置容器的名称和服务所要运行的端口                       
- (2)`GENERIC_TIMEZONE和TZ`                 
都是设置时区，TZ是 Linux 标准时区变量，所有主流应用都兼容，GENERIC_TIMEZONE 是 n8n 的旧版参数(新版本推荐用TZ)            
- (3)`-e NODES_EXCLUDE="[]"`    
2.X版本中出于安全风险考虑默认禁用了一些节点(如ExecuteCommand、LocalFileTrigger)，如果想要按需启用所有节点或者指定特定节点           
- (4)`-v /Volumes/Files/n8n:/home/node/.n8n`                 
其中，“:”左边的文件夹路径需要提前创建好n8n文件夹并获取其绝对路径(根据自己实际路径，/Volumes/Files/n8n)                             
“:”右边的文件夹路径/home/node/.n8n 是n8n的默认配置文件存储路径(如工作流、凭据和设置等)                       
通过挂载进行数据映射，主机上的/Volumes/Files/n8n文件夹会持久化存储这些数据，即使容器被删除，配置也不会丢失                                                            
- (5)`-v /Volumes/Files/n8n-files:/home/node/.n8n-files`                 
其中，“:”左边的文件夹路径需要提前创建好n8n-files文件夹并获取其绝对路径(根据自己实际路径，/Volumes/Files/n8n-files)                        
“:”右边的文件夹路径/home/node/.n8n-files 是用于存储n8n的额外数据的存储路径(如保存到本地的一些文件等)                 
n8n 会设置一个默认值 N8N_RESTRICT_FILE_ACCESS_TO，以控制文件作的发生位置。这影响了 ReadWriteFile 和 ReadBinaryFiles 这两个节点            
默认情况下，这些节点只能访问 /home/node/.n8n-files 目录中的文件                    
- (6)`docker.n8n.io/n8nio/n8n:版本号`                              
指定n8n的版本，指定最新稳定版本：docker.n8n.io/n8nio/n8n:latest，也可以指定特定的版本：docker.n8n.io/n8nio/n8n:2.0.1                                                                                  
n8n镜像对应版本列表：https://hub.docker.com/r/n8nio/n8n/tags                                 

## 2.3 版本升级

n8n镜像对应版本列表：https://hub.docker.com/r/n8nio/n8n/tags            

先执行命令 `docker pull docker.n8n.io/n8nio/n8n:版本号` 拉取新版本镜像,如2.0.1                                                             

然后，先后执行命令 `docker stop n8n_v2` 和 `docker rm n8n_v2` 停止运行中的容器并清理旧容器                                      

再执行命令 `docker run -d --name n8n_v2 -p 5678:5678 -e GENERIC_TIMEZONE="Asia/Shanghai" -e TZ="Asia/Shanghai" -e NODES_EXCLUDE="[]" -v /Volumes/Files/n8n:/home/node/.n8n -v /Volumes/Files/n8n-files:/home/node/.n8n-files docker.n8n.io/n8nio/n8n:2.0.1`开启新容器                        

最后，服务部署完成后，执行命令 `docker exec n8n_v2 n8n --version` 验证版本                              
浏览器打开 http://localhost:5678/ 进入到n8n的web端页面，刷新后历史数据依然存在                 
  
**注意:注意指定的本地文件夹的绝对路径要和升级前保持一致，否则数据会不同步**                       


