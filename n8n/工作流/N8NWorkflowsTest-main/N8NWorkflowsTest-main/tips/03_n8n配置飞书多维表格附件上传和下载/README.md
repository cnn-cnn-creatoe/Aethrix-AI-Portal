# n8n配置飞书多维表格附件上传和下载

在使用飞书多维表格服务前，需要先完成前期准备工作，具体配置参考如下视频:             

【n8n实战经验小Tip】飞书服务使用前配置｜最小配置颗粒度拆解｜开源可抄作业                   
YouTube频道对应视频: https://youtu.be/GKFtAamUMyQ                 
B站频道对应视频:https://www.bilibili.com/video/BV1Q7qQBpEF8/                
  
本期视频中需要额外使用到的接口如下:                      
下载飞书多维表格中的附件:https://open.feishu.cn/document/server-docs/docs/drive-v1/media/download?appId=cli_a8759c6a213d500e                                                  
分片上传附件到飞书多维表格:https://open.feishu.cn/document/server-docs/docs/drive-v1/media/multipart-upload-media/upload_prepare                                            
多维表格更新记录接口:https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/update?appId=cli_a8759c6a213d500e               

本期视频演示使用的附件素材，大家可自行在网盘下载:                             
链接：https://pan.quark.cn/s/6bd7912ac1fa?pwd=qMvU              
提取码：qMvU                 

在n8n工作流中可以使用 HTTP Request 节点配置飞书服务至少需要两个                                       
第一个 `HTTP Request` 节点用来获取飞书 API 的访问令牌(Access Token)                                   
其他 `HTTP Request` 节点使用上一步获取的令牌，来执行具体操作                     
 
