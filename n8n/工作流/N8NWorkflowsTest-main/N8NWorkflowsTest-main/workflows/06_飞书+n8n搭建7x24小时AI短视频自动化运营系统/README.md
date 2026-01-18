# 飞书+n8n搭建7x24小时AI短视频自动化运营系统

## 1、工作流说明

为大家分享的是一个基于飞书和n8n搭建的7*24小时AI短视频自动化运营系统，从短视频素材准备、生产、审核、修改、发布等一条龙解决方案                 

这里想分享给大家的并不只是最终提供了一个可直接使用的系统这个结果，而是一个完全可复制到其他场景的完全闭环的整套解决方案，一个坚不可摧的组合利器：n8n + AI + X(飞书(Notion) + FastAPI（封装API接口）+ MCP Server + …)                  

主要包含：            
- 运营人员只需要在飞书多维表格中进行日常运营管理，操作简单无门槛                                                       
- AI为你7*24小时进行内容生产:短视频文案创作及短视频生成                                                
- 社交平台(小红书为例)自动发布，支持扩展更多平台           

## 2、准备工作

### 2.1 飞书服务

本期视频会使用飞书的多维表格来搭建AI短视频自动化运营系统以及使用即时群消息来同步生产状态                                         
首先，登陆到飞书官网 https://www.feishu.cn/ 注册并登陆               

本期视频会使用HTTP Request节点来调用飞书的消息服务和多维表格服务，若不清楚这两个服务如何在n8n中使用，建议你先观看如下视频:       

03_【工作流】n8n配置飞书保姆级配置指南：HTTP Request节点 社区飞书节点 云空间 多维表格 群组即时消息 支持文本、图片、富文本、卡片、音视频、文件等                      
- 资料在项目内 workflows 文件夹中的 02_*** 文件夹，下载即可                                                                           
- YouTube频道对应视频: https://youtu.be/zhSKnqJa9to                                                                
- B站频道对应视频: https://www.bilibili.com/video/BV1aD2TBsEkZ/                      

本期视频中需要额外使用到的接口如下:                   
下载飞书多维表格中的附件:https://open.feishu.cn/document/server-docs/docs/drive-v1/media/download?appId=cli_a8759c6a213d500e                                                
分片上传附件到飞书多维表格:https://open.feishu.cn/document/server-docs/docs/drive-v1/media/multipart-upload-media/upload_prepare                                          
多维表格更新记录接口:https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update?appId=cli_a8759c6a213d500e                      

关于飞书的服务使用的情况可以登陆飞书管理后台中的权益数据菜单查看 https://mcn33lfbwjgi.feishu.cn/admin/billing/equity-data            

免费版中使用的几个服务额度说明:           
- 总存储空间 15GB，认证后增加至100GB                 
- 单文件上传大小 20MB，认证后增加至10GB               
- API调用次数 10000次/月                           
- 多维表格自动化流程运行次数 200次/月                  

根据自己的实际需求,进行权益升级(商业标准版 ¥50 人/月、商业专业版 ¥80 人/月、商业旗舰版 ¥120 人/月、企业旗舰版 单独报价)                 

### 2.2 短视频生成工具 MoneyPrinterTurbo

本期视频会使用MoneyPrinterTurbo作为视频生成工具进行演示     

**注意：** 演示当前版本为 1.2.6 请使用相同的版本进行后续的测试，待测试成功后，可针对性的升级版本或替换其他视频生成工具                          

MoneyPrinterTurbo 是一个基于 Python 开发的开源 AI 短视频自动生成工具                  
核心功能是只需提供一个视频主题或关键词，就能全自动生成视频文案、视频素材、视频字幕、视频背景音乐，并将这些元素合成为一个高清短视频            
支持 API 和 Web 界面两种操作方式                               

若不清楚MoneyPrinterTurbo如何部署，建议你先观看如下视频:                 

06_【n8n工作流】从文案到成片只需5分钟？AI全自动短视频生产线，解放90%重复劳动｜文案→素材→成片一条龙【附保姆级指南】                                  
- 资料在项目内 workflows 文件夹中的 05_*** 文件夹，下载即可                                                                     
- YouTube频道对应视频: https://youtu.be/h6DoC92uyYI                                
- B站频道对应视频: https://www.bilibili.com/video/BV1LCSNBAEUs/               

**(1)下载项目**       

项目地址 https://github.com/harry0703/MoneyPrinterTurbo              
命令行终端运行如下指令下载项目或直接download                 
```bash
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
```

**(2)初始化准备**               

- 大模型设置                     
这里使用的大模型代理平台:https://nangeai.top/                      
关于大模型代理平台如何使用 大家参考这期视频 https://youtu.be/mTrgVllUl7Y                       

- 视频素材源设置           
这里使用Pexels免费素材 https://www.pexels.com/api/ 申请API KEY                 
 
- TTS服务设置                     
这里默认使用的是硅基流动的语音合成 https://cloud.siliconflow.cn/me/account/ak 申请API KEY                    
语音测试及音色的选择 https://cloud.siliconflow.cn/me/playground/text-to-speech/17885302679                   

**(3)修改配置文件**            

将源码中的 config.example.toml 文件复制一份，命名为 config.toml                                         
按照 config.toml 文件中的说明配置配置好Pexels、LLM、TTS                             

进入到MoneyPrinterTurbo，在 docker-compose.yml 文件内添加一行代码                                          
  `- /Volumes/Files/n8n-files/mpt/storage:/MoneyPrinterTurbo/storage`                  
其中，/Volumes/Files/n8n-files/mpt/storage 替换成自己的实际的文件夹绝对路径            

**(4)构建项目**      

命令行终端运行如下指令启动服务容器                
```bash
docker compose up -d
```

**注意:**   

若中间出现 `ERROR [api internal] load metadata for docker.io/library/python:3.11-slim-bullseye` 报错                
可按如下顺序依次运行          

```bash 
docker pull python:3.11-slim-bullseye

docker compose up -d
```

**(5)容器启动成功后访问**            

访问 http://localhost:8501 服务Web端界面                            
访问 http://127.0.0.1:8080/docs API接口Web端页面                  

**(6)API接口调用**             

使用 http://host.docker.internal:8080/api/v1/videos 接口请求制作视频               

### 2.3 在外网通过域名访问本地n8n服务

本期视频会在n8n工作流中使用Webhook来接收飞书多维表格中的按钮触发和日期定时触发(发送HTTP请求)，因此需要配置让本地部署的n8n服务，在外网通过域名就可以访问                               

这里推荐大家使用 frp + Nginx 组合方案实现内网穿透，让本地部署的n8n服务，在外网通过域名就可以访问，安全可靠                          

整体流程为:        
```
HTTPS请求 → ECS服务器Nginx(443端口,处理SSL) → frps(7171端口,HTTP转发) → 本地frpc → 本地n8n(5678端口) 
```

若不清楚如何部署，建议你先观看如下视频:                         
我切断了向Zapier的“数据进贡” | 本地n8n全球直连方案，打造生产级私人自动化中枢，是数字自治的唯一门票。让本地部署的n8n服务，在外网通过域名安全访问              
- 资料在 resource 文件夹中的 03_*** 文件夹，下载即可                        
- YouTube频道对应视频: https://youtu.be/F6LcNx7TpYU                                                                     
- B站频道对应视频: https://www.bilibili.com/video/BV1e5mQBDEbf/                 

### 2.4 小红书自动发布

#### 2.4.1 开源的小红书MCP服务 xiaohongshu-mcp

本期视频使用的小红书自动发布方案是开源的小红书MCP服务 xiaohongshu-mcp，底层技术使用的是playwright              

Github地址为:https://github.com/xpzouying/xiaohongshu-mcp                            

**注意:** 在n8n中使用AI Agent节点挂载MCP Client节点调用发布服务时，需要将AI Agent节点当前的 typeVersion 要由 3 改为 1.7 才可用，登陆状态检测不需要更改typeVersion                                     

**(1)部署MCP Server**        
根据自己的操作系统，选择合适的部署方式即可              
本期视频使用MAC系统，因此我选择直接下载适合MAC系统及M芯片的预编译二进制文件                                               

**(2)运行启动MCP Server**               
打开命令行终端，进入到对应的文件夹，直接运行文件启动MCP Server                 
首先运行登录工具，进行账号的登陆                                                

```bash 
./xiaohongshu-login-darwin-arm64 
```

然后启动 MCP 服务                              
                        
```bash 
./xiaohongshu-mcp-darwin-arm64 
```

对于 MCP Server 不熟悉的，大家可以看我往期的系列视频: https://github.com/NanGePlus/MCPServerTest                                  

## 3、测试   

### 3.1 导入系统多维表格       

打开飞书云文档->云盘中，选择文件夹导入 AI短视频自动化运营系统.base 导入成功后即可进入到系统                       

系统内置了几条测试数据提供测试，也可自行创建测试                                       

### 3.2 激活运行工作流   
                  
将提供的所有的工作流配置文件分别导入到n8n平台并发布上线运行             
