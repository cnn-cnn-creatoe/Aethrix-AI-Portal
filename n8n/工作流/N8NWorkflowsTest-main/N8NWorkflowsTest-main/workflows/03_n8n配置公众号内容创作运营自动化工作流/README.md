# n8n配置公众号内容创作运营自动化工作流      

在n8n工作流中可以使用 HTTP Request 节点配置微信公众号服务至少需要两个                               
第一个 `HTTP Request` 节点用来获取微信公众号 API 的访问令牌(Access Token)                             
其他 `HTTP Request` 节点使用上一步获取的令牌，来执行具体操作                            

在n8n工作流中也可以使用社区提供的 n8n-nodes-wechat-offiaccount 节点配置微信公众号服务，需要安装n8n社区的微信公众号节点                 
社区节点链接地址: https://www.npmjs.com/package/n8n-nodes-wechat-offiaccount                          
在n8n平台页面点击用户头像->setting->Community Node->Install Node，选择某个节点后直接安装即可                                                      
安装完成之后，就可以在工作流中直接使用了               

微信公众号服务端API的开发文档地址:                
https://developers.weixin.qq.com/doc/subscription/api/                                            

# 1、在微信服务号平台获取凭证

## 1.1 注册微信公众号

* 访问微信公众平台进行注册 https://mp.weixin.qq.com/                      
* 选择创建 公众号 服务，按照官方步骤操作即可               

## 1.2 登录微信公众号开发后台

* 管理员扫码登录微信公众号开发后台              

## 1.3 获取 AppID 和 AppSecret

* 在设置与开发->开发接口管理中获取到开发者ID(AppID) 和 开发者密码(AppSecret)。请妥善保管这两个值，稍后在N8N中会立刻用到                     

## 1.4 配置IP白名单
在设置与开发->开发接口管理中配置IP白名单（公网IP、本机IP都配置）                       


# 2、核心步骤说明    

## 2.1 AI Agent节点实现写公众号文章标题和正文，以及文生图prompt  

AI Agent 节点是 n8n 中用于实现智能自动化的核心节点之一           
它代表了一个自主的 AI 系统，可以接收数据、做出决策，并通过调用外部工具和 API 来完成特定目标                 
本期视频的工作流使用AI Agent节点会搭配LLM节点，LLM节点的配置涉及到第三方服务的凭证创建，这里使用的大模型代理平台                     
这里使用的大模型代理平台:https://nangeai.top/                
关于大模型代理平台如何使用 大家参考这期视频 https://youtu.be/mTrgVllUl7Y             

1. 在 n8n 工作流中，添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "写公众号文章标题"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点。
 
1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "写公众号文章正文"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点。

## 2.2 获取接口调用 Access Token    

获取全局唯一后台接口调用凭据，需要先用 App ID 和 App Secret 换取这个 token                   
对应开发文档地址:https://developers.weixin.qq.com/doc/subscription/api/base/api_getaccesstoken.html                            

1. 在 n8n 工作流中，添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "获取公众号后台访问token"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点。若成功，则再响应的回复数据中获取到 access_token                                     

## 2.3 HTTP节点实现文生图

这里选择使用火山引擎的豆包文生图大模型       
开发接口: https://www.volcengine.com/docs/82379/1541523               
API接口调试助手： https://api.volcengine.com/api-explorer?action=ImageGenerations&groupName=%E5%9B%BE%E7%89%87%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01                     
首先登陆到火山引擎的火山方舟平台，注册账号并登陆，平台地址: https://console.volcengine.com/ark/region:ark+cn-beijing/overview?briefPage=0&briefType=introduce&type=new             
登陆成功后，进入到平台在左侧菜单栏中进入 API Key管理 创建一个API Key，然后在左侧菜单栏中进入 开通管理 开通你需要使用的视觉模型，本期视频使用的模型是 Doubao-Seedream-3.0-t2i                    

1. 在 n8n 工作流中，添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "文生图"，方便查看和后续引用                          
3. 配置节点参数，按照官方文档要求进行参数配置                       
4. 运行节点。若成功，则再响应的回复数据中获取到以 Base64 编码字符串的 JSON 格式返回图像数据                       

## 2.4 HTTP节点实现上传永久素材
            
对应开发文档地址:https://developers.weixin.qq.com/doc/subscription/api/material/permanent/api_addmaterial.html                                     

1. 在 n8n 工作流中，添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "调用接口上传图片素材"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点。若成功，则再响应的回复数据中获取到永久素材的 media_id                                             

## 2.5 HTTP节点实现上传图文草稿
            
对应开发文档地址:https://developers.weixin.qq.com/doc/subscription/api/draftbox/draftmanage/api_draft_add.html                                                   

1. 在 n8n 工作流中，添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "调用接口上传图文草稿"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点。若成功，则再响应的回复数据中获取到 media_id          

## 2.6 HTTP节点实现获取图文草稿详情
            
对应开发文档地址:https://developers.weixin.qq.com/doc/subscription/api/draftbox/draftmanage/api_getdraft.html                                                                

1. 在 n8n 工作流中，添加一个 HTTP Request 节点                       
2. 给节点重命名或添加备注信息 "调用接口获取图文草稿详情"，方便查看和后续引用                            
3. 配置节点参数，按照官方文档要求进行参数配置                      
4. 运行节点。若成功，则再响应的回复数据中获取到图文草稿详情字段信息                       


