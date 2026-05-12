# 二年级数学思维练习网站

这是一个可直接部署到 Cloudflare Pages 的静态网站，围绕人教版二年级数学下册目录生成练习题。

## 已包含功能

- 按课本目录选择单元
- 基础巩固、变式提高、思维拓展、综合练习四类出题
- 自动生成裂变题，每次数字和情境会变化
- 每题包含提示、参考答案、分步解析、拓展问法
- 支持记录“做对了 / 还要练”
- 本地错题本，可再次生成相似题
- 家长概览，查看薄弱单元和练习记录
- 打印当前练习题
- 电脑端和手机端自适应

## Cloudflare Pages 部署

如果用 Git 仓库部署：

- Root directory：`math-thinking-site`
- Build command：留空
- Build output directory：`.`

如果用 Pages Direct Upload：

- 直接上传整个 `math-thinking-site` 文件夹里的内容

## 文件说明

- `index.html`：页面结构
- `styles.css`：响应式样式和打印样式
- `data.js`：课本目录、知识点、题型模板、出题逻辑
- `app.js`：练习、错题本、家长概览等交互逻辑
- `_headers`：Cloudflare Pages 响应头配置

## 后续扩展建议

- 在 `data.js` 里继续增加题型模板
- 接入 Cloudflare D1 保存多设备错题和练习记录
- 增加学生账号和家长端报告
- 接入 AI 接口，根据错题自动生成更贴近薄弱点的变式题
- 增加在线答题，提交试卷，得分，满分100分，根据每次出题的数量，平均每题的分值；错题自动加入错题库
