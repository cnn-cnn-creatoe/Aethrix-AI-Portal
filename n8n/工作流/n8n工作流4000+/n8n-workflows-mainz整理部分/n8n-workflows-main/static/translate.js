// 翻译函数 - 将英文工作流名称和描述翻译成中文
const categoryTranslations={
  'AI':'AI 人工智能',
  'Social Media':'社交媒体',
  'Email Marketing':'邮件营销',
  'CRM & Sales':'CRM & 销售',
  'Project Management':'项目管理',
  'E-commerce':'电子商务',
  'Database':'数据库',
  'Cloud Storage':'云存储',
  'Spreadsheets & Docs':'表格 & 文档',
  'Calendar & Scheduling':'日历 & 日程',
  'DevOps & Development':'开发运维',
  'Communication':'通讯',
  'Forms & Surveys':'表单 & 调查',
  'Automation & Utilities':'自动化 & 工具',
  'Media & Design':'媒体 & 设计',
  'Analytics & Monitoring':'分析 & 监控',
  'Events & Webinars':'活动 & 会议',
  'CMS & Content':'内容管理',
  'RSS & News':'RSS & 新闻',
  'Logistics':'物流配送',
  'Finance & Crypto':'金融 & 加密',
  'Uncategorized':'未分类',
  // 旧分类兼容
  'Automation':'自动化',
  'Communication':'通讯',
  'CRM':'客户关系管理',
  'Data':'数据处理',
  'DevOps':'开发运维',
  'Email':'邮件',
  'Finance':'财务',
  'Forms':'表单',
  'HR':'人力资源',
  'Integration':'集成',
  'IoT':'物联网',
  'Marketing':'营销',
  'Media':'媒体',
  'Monitoring':'监控',
  'Notification':'通知',
  'Productivity':'生产力',
  'Sales':'销售',
  'Security':'安全',
  'Support':'客服支持',
  'Utility':'实用工具',
  'Web Scraping':'网页抓取',
  'Webhook':'网络钩子',
  'Workflow':'工作流',
  'Analytics':'数据分析',
  'API':'API 接口',
  'Backup':'备份',
  'Calendar':'日历',
  'Chat':'聊天',
  'Cloud':'云服务',
  'Content':'内容',
  'Customer Service':'客户服务',
  'Document':'文档',
  'Education':'教育',
  'Event':'事件',
  'File':'文件',
  'Gaming':'游戏',
  'Health':'健康',
  'Image':'图像',
  'Invoice':'发票',
  'Lead':'线索',
  'Legal':'法律',
  'Machine Learning':'机器学习',
  'News':'新闻',
  'Payment':'支付',
  'PDF':'PDF',
  'Phone':'电话',
  'Reporting':'报表',
  'Research':'研究',
  'Scheduling':'日程安排',
  'SEO':'SEO 优化',
  'Shipping':'物流配送',
  'SMS':'短信',
  'Spreadsheet':'电子表格',
  'Storage':'存储',
  'Survey':'调查',
  'Task':'任务',
  'Testing':'测试',
  'Text':'文本',
  'Time Tracking':'时间追踪',
  'Translation':'翻译',
  'Travel':'旅行',
  'Video':'视频',
  'Voice':'语音',
  'Weather':'天气'
};

const triggerTranslations={'Webhook':'网络钩子','Scheduled':'定时任务','Manual':'手动触发','Complex':'复合触发'};

const complexityTranslations={'low':'简单','medium':'中等','high':'复杂'};

const wordTranslations={
  'workflow':'工作流','automation':'自动化','trigger':'触发器','triggered':'触发的','manual':'手动','webhook':'网络钩子','scheduled':'定时',
  'create':'创建','update':'更新','delete':'删除','get':'获取','send':'发送','receive':'接收','sync':'同步','import':'导入','export':'导出',
  'new':'新建','add':'添加','remove':'移除','edit':'编辑','modify':'修改','change':'更改','set':'设置','configure':'配置',
  'data':'数据','record':'记录','records':'记录','row':'行','rows':'行','column':'列','field':'字段','value':'值','item':'项目','items':'项目',
  'message':'消息','messages':'消息','notification':'通知','notifications':'通知','alert':'警报','alerts':'警报','email':'邮件','emails':'邮件',
  'user':'用户','users':'用户','customer':'客户','customers':'客户','contact':'联系人','contacts':'联系人','lead':'线索','leads':'线索',
  'order':'订单','orders':'订单','invoice':'发票','invoices':'发票','payment':'支付','payments':'支付','transaction':'交易','transactions':'交易',
  'file':'文件','files':'文件','document':'文档','documents':'文档','image':'图片','images':'图片','video':'视频','videos':'视频',
  'task':'任务','tasks':'任务','project':'项目','projects':'项目','event':'事件','events':'事件','meeting':'会议','meetings':'会议',
  'form':'表单','forms':'表单','submission':'提交','submissions':'提交','response':'响应','responses':'响应','request':'请求','requests':'请求',
  'database':'数据库','table':'表格','sheet':'表格','spreadsheet':'电子表格','calendar':'日历','channel':'频道','chat':'聊天',
  'integration':'集成','connect':'连接','connection':'连接','link':'链接','api':'API接口','endpoint':'端点',
  'process':'处理','processing':'处理中','analyze':'分析','analysis':'分析','generate':'生成','convert':'转换','transform':'转换',
  'backup':'备份','restore':'恢复','archive':'归档','store':'存储','storage':'存储','save':'保存','load':'加载',
  'monitor':'监控','monitoring':'监控','track':'追踪','tracking':'追踪','log':'日志','logging':'日志记录',
  'search':'搜索','filter':'筛选','sort':'排序','query':'查询','fetch':'获取','retrieve':'检索',
  'validate':'验证','check':'检查','test':'测试','verify':'验证','confirm':'确认','approve':'审批',
  'schedule':'计划','scheduler':'调度器','cron':'定时任务','timer':'定时器','delay':'延迟','wait':'等待',
  'error':'错误','warning':'警告','success':'成功','failed':'失败','complete':'完成','pending':'待处理',
  'start':'开始','stop':'停止','pause':'暂停','resume':'恢复','restart':'重启','run':'运行','execute':'执行',
  'input':'输入','output':'输出','result':'结果','results':'结果','report':'报告','reports':'报告',
  'list':'列表','array':'数组','object':'对象','string':'字符串','number':'数字','boolean':'布尔值',
  'orchestrates':'编排','orchestration':'编排','automates':'自动化','handles':'处理','manages':'管理','controls':'控制',
  'uses':'使用','utilizes':'利用','leverages':'利用','employs':'采用','integrates':'集成','combines':'组合',
  'nodes':'节点','node':'节点','steps':'步骤','step':'步骤','stage':'阶段','stages':'阶段','phase':'阶段',
  'template':'模板','templates':'模板','example':'示例','examples':'示例','sample':'样本','demo':'演示',
  'qualify':'筛选','qualifying':'筛选中','qualified':'已筛选','connects':'连接'
};

// 保留的英文软件名称
const preservedTerms = ['Google','Twitter','Facebook','LinkedIn','Slack','Discord','Telegram','WhatsApp','Instagram','YouTube','TikTok','Pinterest','Reddit','GitHub','GitLab','Bitbucket','Jira','Trello','Asana','Monday','Notion','Airtable','Zapier','Make','n8n','OpenAI','GPT','ChatGPT','Claude','Anthropic','Gemini','Mistral','Llama','HuggingFace','AWS','Azure','GCP','Cloudflare','Vercel','Netlify','Heroku','DigitalOcean','Stripe','PayPal','Square','Shopify','WooCommerce','Magento','BigCommerce','Salesforce','HubSpot','Zoho','Pipedrive','Freshsales','Mailchimp','SendGrid','Twilio','Vonage','Plivo','Zendesk','Intercom','Freshdesk','Crisp','Drift','Calendly','Zoom','Teams','Meet','Webex','Dropbox','Box','OneDrive','iCloud','Supabase','Firebase','MongoDB','PostgreSQL','MySQL','Redis','Elasticsearch','Algolia','Pinecone','Weaviate','Qdrant','Milvus','LangChain','AutoGPT','AgentGPT','BabyAGI','SuperAGI','CrewAI','MetaGPT','ChatDev','DALL-E','Midjourney','Stable Diffusion','Leonardo','Runway','Pika','Sora','ElevenLabs','Murf','Descript','Otter','Rev','Deepgram','AssemblyAI','Whisper','Basic LLM','Form Trigger','Openai','Sheets','Twitter/X','HTTP Request','Webhook','Schedule','Cron','Code','Function','IF','Switch','Merge','Split','Loop','Wait','Set','Move','Copy','Delete','Read','Write','Execute','Start','Stop','Pause','Resume'];

function translatePhrase(text) {
  if (!text) return '';
  let result = text;
  // 按长度排序，先替换长的词
  const sortedEntries = Object.entries(wordTranslations).sort((a, b) => b[0].length - a[0].length);
  sortedEntries.forEach(function(entry) {
    const en = entry[0];
    const zh = entry[1];
    const regex = new RegExp('\\b' + en + '\\b', 'gi');
    result = result.replace(regex, zh);
  });
  return result;
}

function translateDescription(desc) {
  if (!desc) return '';
  
  // 描述模式匹配 - 修复正则表达式以匹配完整的描述格式
  const patterns = [
    // Manual workflow that orchestrates X to Y. Uses N nodes and integrates with M services.
    { regex: /^Manual workflow that orchestrates (.+?) to (.+?)\. Uses (\d+) nodes and integrates with (\d+) services?\.?/i, 
      fn: function(m) { return '手动工作流，编排 ' + m[1] + ' 来' + translatePhrase(m[2]) + '。使用 ' + m[3] + ' 个节点，集成 ' + m[4] + ' 个服务'; } },
    // Manual workflow that orchestrates X to Y. Uses N nodes.
    { regex: /^Manual workflow that orchestrates (.+?) to (.+?)\. Uses (\d+) nodes\.?/i, 
      fn: function(m) { return '手动工作流，编排 ' + m[1] + ' 来' + translatePhrase(m[2]) + '。使用 ' + m[3] + ' 个节点'; } },
    // Webhook-triggered automation that X. Uses N nodes and integrates with M services.
    { regex: /^Webhook-triggered automation that (.+?)\. Uses (\d+) nodes and integrates with (\d+) services?\.?/i, 
      fn: function(m) { return '网络钩子触发的自动化流程，' + translatePhrase(m[1]) + '。使用 ' + m[2] + ' 个节点，集成 ' + m[3] + ' 个服务'; } },
    // Webhook-triggered automation that X. Uses N nodes.
    { regex: /^Webhook-triggered automation that (.+?)\. Uses (\d+) nodes\.?/i, 
      fn: function(m) { return '网络钩子触发的自动化流程，' + translatePhrase(m[1]) + '。使用 ' + m[2] + ' 个节点'; } },
    // Scheduled automation that X. Uses N nodes and integrates with M services.
    { regex: /^Scheduled automation that (.+?)\. Uses (\d+) nodes and integrates with (\d+) services?\.?/i, 
      fn: function(m) { return '定时自动化流程，' + translatePhrase(m[1]) + '。使用 ' + m[2] + ' 个节点，集成 ' + m[3] + ' 个服务'; } },
    // Scheduled automation that X. Uses N nodes.
    { regex: /^Scheduled automation that (.+?)\. Uses (\d+) nodes\.?/i, 
      fn: function(m) { return '定时自动化流程，' + translatePhrase(m[1]) + '。使用 ' + m[2] + ' 个节点'; } },
    // Complex workflow that X. Uses N nodes and integrates with M services.
    { regex: /^Complex workflow that (.+?)\. Uses (\d+) nodes and integrates with (\d+) services?\.?/i, 
      fn: function(m) { return '复杂工作流，' + translatePhrase(m[1]) + '。使用 ' + m[2] + ' 个节点，集成 ' + m[3] + ' 个服务'; } },
    // Complex workflow that X. Uses N nodes.
    { regex: /^Complex workflow that (.+?)\. Uses (\d+) nodes\.?/i, 
      fn: function(m) { return '复杂工作流，' + translatePhrase(m[1]) + '。使用 ' + m[2] + ' 个节点'; } },
    // Generic: X automation that Y. Uses N nodes.
    { regex: /^(.+?) automation that (.+?)\. Uses (\d+) nodes/i, 
      fn: function(m) { return translatePhrase(m[1]) + '自动化流程，' + translatePhrase(m[2]) + '。使用 ' + m[3] + ' 个节点'; } },
    // Generic: X workflow that Y. Uses N nodes.
    { regex: /^(.+?) workflow that (.+?)\. Uses (\d+) nodes/i, 
      fn: function(m) { return translatePhrase(m[1]) + '工作流，' + translatePhrase(m[2]) + '。使用 ' + m[3] + ' 个节点'; } },
    // Uses N nodes and integrates with M services.
    { regex: /Uses (\d+) nodes and integrates with (\d+) services?\.?/i, 
      fn: function(m) { return '使用 ' + m[1] + ' 个节点，集成 ' + m[2] + ' 个服务'; } },
    // Uses N nodes.
    { regex: /Uses (\d+) nodes/i, 
      fn: function(m) { return '使用 ' + m[1] + ' 个节点'; } }
  ];
  
  for (var i = 0; i < patterns.length; i++) {
    var match = desc.match(patterns[i].regex);
    if (match) {
      return patterns[i].fn(match);
    }
  }
  
  return translatePhrase(desc);
}

function translateName(name) {
  if (!name) return name;
  
  var result = name;
  var placeholders = {};
  var idx = 0;
  
  // 保留英文软件名称
  preservedTerms.forEach(function(term) {
    var lowerResult = result.toLowerCase();
    var lowerTerm = term.toLowerCase();
    var pos = lowerResult.indexOf(lowerTerm);
    
    while (pos !== -1) {
      var key = '__P' + idx + '__';
      var matched = result.substring(pos, pos + term.length);
      placeholders[key] = matched;
      result = result.substring(0, pos) + key + result.substring(pos + term.length);
      idx++;
      lowerResult = result.toLowerCase();
      pos = lowerResult.indexOf(lowerTerm);
    }
  });
  
  // 翻译其他词汇
  result = translatePhrase(result);
  
  // 恢复保留的英文名称
  Object.keys(placeholders).forEach(function(k) {
    result = result.split(k).join(placeholders[k]);
  });
  
  return result;
}

function translateCategory(c) {
  if (!c) return '未分类';
  return categoryTranslations[c] || c;
}

function translateTrigger(t) {
  return triggerTranslations[t] || t;
}

function translateComplexity(c) {
  return complexityTranslations[c] || c;
}

// 导出到全局
window.translateName = translateName;
window.translateDescription = translateDescription;
window.translateCategory = translateCategory;
window.translateTrigger = translateTrigger;
window.translateComplexity = translateComplexity;
