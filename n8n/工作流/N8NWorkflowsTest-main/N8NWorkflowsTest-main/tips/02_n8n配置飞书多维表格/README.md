# n8n配置飞书多维表格      

在使用飞书多维表格服务前，需要先完成前期准备工作，具体配置参考如下视频:             

【n8n实战经验小Tip】飞书服务使用前配置｜最小配置颗粒度拆解｜开源可抄作业                   
YouTube频道对应视频: https://youtu.be/GKFtAamUMyQ                 
B站频道对应视频:https://www.bilibili.com/video/BV1Q7qQBpEF8/                

## 1、多维表格概述

多维表格（Base）是全新的业务管理工具               
帮助用户重构工作应用和团队协同模式，高效在线协同数据，随心构建个性化应用，轻松掌控全盘业务数据，和团队一起创造效率的无限可能               
多维表格可以是一个表格，也可以是无数个应用                
它拥有强大的底层开放能力，你可以通过多维表格 API 轻松打通内部其他业务系统，让业务数据通畅流转，实时同步               

飞书开放平台服务端API地址: https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview          

## 2、n8n配置HTTP Request节点使用多维表格服务

在n8n工作流中可以使用 HTTP Request 节点配置飞书服务至少需要两个                                  
第一个 `HTTP Request` 节点用来获取飞书 API 的访问令牌(Access Token)                               
其他 `HTTP Request` 节点使用上一步获取的令牌，来执行具体操作                   

### 2.1 获取 tenant_access_token    

对飞书 API 进行调用需要获取一个自建应用的 tenant_access_token，需要先用 App ID 和 App Secret 换取这个 token                  
对应开发文档地址:https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal               

1. 在 n8n 工作流中，添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "获取飞书token"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点。若成功，则再响应的回复数据中获取到 tenant_access_token                        

### 2.2 创建多维表格

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/create             

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "创建多维表格"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

### 2.3 列出数据表字段      

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/list         

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "列出数据表字段"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

### 2.4 更新字段

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/update          

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "更新字段"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

### 2.5 新增字段 

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/create         

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "新增字段"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     

### 2.6 新增记录到表格    

参考如下官方说明: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/create            

1. 在 n8n 工作流中，再添加一个 HTTP Request 节点                     
2. 给节点重命名或添加备注信息 "新增记录到表格"，方便查看和后续引用                       
3. 配置节点参数，按照官方文档要求进行参数配置                    
4. 运行节点     
