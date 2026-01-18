# n8n配置飞书云文档和消息服务工作流      

在n8n工作流中可以使用 HTTP Request 节点配置飞书服务至少需要两个                               
第一个 `HTTP Request` 节点用来获取飞书 API 的访问令牌(Access Token)                            
其他 `HTTP Request` 节点使用上一步获取的令牌，来执行具体操作                          

在n8n工作流中也可以使用社区提供的第三方 feishu 节点配置飞书服务，需要安装n8n社区的飞书节点               
社区节点链接地址: https://www.npmjs.com/package/n8n-nodes-feishu-lite             
在n8n平台页面点击用户头像->setting->Community Node->Install Node，选择某个节点后直接安装即可                                                    
安装完成之后，就可以在工作流中直接使用了          

飞书服务端API的开发文档地址:            
https://open.feishu.cn/document/server-docs/docs/docs-overview                    

# 1、在飞书开放平台创建应用并获取凭证

## 1.1 注册飞书帐号

* 访问飞书平台 https://www.feishu.cn/          
* 注册成功后可登陆到飞书管理后台进行管理，并下载飞书客户端进行登陆                              

## 1.2 登录飞书开放平台

* 访问飞书开放平台 (https://open.feishu.cn/)
* 使用你的飞书账号登录

## 1.3 创建企业自建应用

* 进入“开发者后台”，点击“创建应用”，然后选择“企业自建应用”
* 填写应用的名称（“n8n数据同步应用”）和描述，然后点击“创建”

## 1.4 获取 App ID 和 App Secret

* 创建成功后，在应用详情页的左侧菜单中，点击 “凭证与基础信息”
* 在这里就能看到 App ID 和 App Secret。请妥善保管这两个值，稍后在N8N中会立刻用到

## 1.5 开通接口权限

* 这是决定应用“能做什么”的一步。在左侧菜单中，点击“权限管理”
* 根据你自己的需要开通相应的功能权限，可以在使用调试接口页面去开通相应的应用身份权限            

## 1.6 发布应用

* 在左侧菜单中，点击“版本管理与发布”               
* 点击“创建新版本”，然后按照提示填写信息并“保存”                  
* 保存后，点击“申请线上发布”。这通常需要企业管理员审核，如果是你自己，可以立即通过。应用只有在发布后，权限才会生效                      

## 1.7 开通云文档文件权限 

1. 在飞书客户端云盘-我的文件夹下创建一个新的文件夹 test                                   
2. 将test文件夹的操作权限赋给创建的企业应用（“n8n数据同步应用”）                                       
* 通过在应用中新建一个机器人应用能力，再在飞书客户端消息中创建一个群组并且加入该机器人，最后将文件夹分享给该群组                                   
* 参考如下官方说明开通文件夹权限: https://open.feishu.cn/document/faq/trouble-shooting/how-to-add-permissions-to-app               


# 2、n8n配置飞书服务工作流编排

## 2.1 获取 tenant_access_token    

对飞书 API 进行调用需要获取一个自建应用的 tenant_access_token，需要先用 App ID 和 App Secret 换取这个 token                  
对应开发文档地址:https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal               

1. 在 n8n 工作流中，添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "获取飞书token"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点。若成功，则再响应的回复数据中获取到 tenant_access_token                        

## 2.2 n8n使用飞书云文档服务

### 2.2.1 使用 HTTP Request 节点编排其他节点

**创建文件夹:**            
参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/drive-v1/folder/create_folder?appId=cli_a8759c6a213d500e       

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "创建文件夹"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点                                   

**创建多维表格:**          

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/create             

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "创建多维表格"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

**列出数据表字段:**          

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/list         

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "列出数据表字段"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

**更新字段:**  

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/update          

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "更新字段"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

**新增字段:**     

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/create         

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "新增字段"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

**新增记录到表格:**        

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create            

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "新增记录到表格"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

### 2.2.2 使用社区提供的 feishu 节点编排其他节点

**创建多维表格:**      

1. 在 n8n 工作流中，再添加一个 feishu 节点，功能选择创建多维表格                              
2. 给节点重命名或添加备注信息 "创建多维表格"，方便查看和后续引用                        
3. 配置节点参数，按照官方文档要求进行参数配置                     
4. 运行节点      

**列出数据表字段:**      

1. 在 n8n 工作流中，再添加一个 feishu 节点，功能选择列出字段                            
2. 给节点重命名或添加备注信息 "列出数据表字段"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

**更新字段:**      

1. 在 n8n 工作流中，再添加一个 feishu 节点，功能选择更新字段                             
2. 给节点重命名或添加备注信息 "更新字段"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

**新增字段:**      

1. 在 n8n 工作流中，再添加一个 feishu 节点，功能选择新增字段                                      
2. 给节点重命名或添加备注信息 "新增字段"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

**新增记录到表格:**      

1. 在 n8n 工作流中，再添加一个 feishu 节点，功能选择新增记录                                      
2. 给节点重命名或添加备注信息 "新增记录到表格"，方便查看和后续引用                         
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     


## 2.3、应用案例2:n8n配置飞书消息服务工作流

## 3.1 开通消息权限 
         
通过在应用中新建一个机器人应用能力，再在飞书客户端消息中创建一个群组并且加入该机器人                                    
参考如下官方说明开通文件夹权限: https://open.feishu.cn/document/faq/trouble-shooting/how-to-add-permissions-to-app           

## 3.2 获取 tenant_access_token    

对飞书 API 进行调用需要获取一个自建应用获取 tenant_access_token，需要先用 App ID 和 App Secret 换取这个 token                 
对应开发文档地址:https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal              

1. 在 n8n 工作流中，添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "获取飞书token"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点。若成功，则再响应的回复数据中获取到 tenant_access_token                      

## 2.3 n8n使用飞书消息服务

参考发送消息接口说明: https://open.feishu.cn/document/server-docs/im-v1/message/create                 

**向群组发送文本消息:**
1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "向群组发送文本消息"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点    

**向群组发送图片:**            
1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "向群组发送图片"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点    

**向群组发送富文本:**       
1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "向群组发送富文本"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点    

**向群组发送消息卡片:**           
1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "向群组发送消息卡片"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点    

**向群组发送群名片:**     
1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "向群组发送群名片"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点    

**向群组发送语音:**            
1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "向群组发送语音"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点    

**向群组发送视频:**            
1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "向群组发送视频"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点    

**向群组发送文件:**            
1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "向群组发送文件"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点    
