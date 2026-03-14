# My RAG

一个基于 Node.js 的 RAG (Retrieval-Augmented Generation) 系统，实现文档检索增强生成的完整流程。

## 功能特性

- 文档分块处理
- 多语言文本 Embedding (使用 Transformers.js)
- 内存向量存储与相似度检索
- 基于 Embedding 的重排序
- 使用 Google Gemini 生成回答

## 技术栈

- **Node.js** - ES Module 模式
- **@xenova/transformers** - 本地运行 Embedding 模型
- **@google/genai** - Google Gemini API
- **dotenv** - 环境变量管理

## 项目结构

```
my-rag/
├── src/
│   ├── index.js      # 主程序入口，RAG 完整流程
│   ├── embed.js      # Embedding 生成模块
│   ├── store.js      # 内存向量存储
│   ├── retrieve.js   # 重排序模块
│   └── generate.js   # LLM 生成模块
├── doc.md            # 示例文档
├── .env              # 环境变量配置
└── package.json
```

## RAG 流程

1. **文档分块** - 将文档按段落 (`\n\n`) 分割
2. **生成 Embedding** - 使用 `Xenova/paraphrase-multilingual-MiniLM-L12-v2` 模型
3. **向量存储** - 存储到内存向量数据库
4. **检索** - 基于余弦相似度检索 Top-K 相关片段
5. **重排序** - 对检索结果进行二次排序
6. **生成** - 将相关片段作为上下文，调用 LLM 生成答案

## 安装

```bash
npm install
```

## 配置

创建 `.env` 文件并配置 Gemini API Key：

```
GEMINI_API_KEY=your_api_key_here
```

## 运行

```bash
npm start
```

## 示例

项目包含三国演义"桃园三结义"片段作为示例文档。运行后会针对问题：

> "桃园三结义三位主角都是谁，各自分别使用什么兵器？"

进行完整的 RAG 流程演示，输出检索到的文档片段和最终生成的答案。

## 依赖说明

| 包名 | 用途 |
|------|------|
| @xenova/transformers | 本地运行 Transformer 模型生成 Embedding |
| @google/genai | 调用 Google Gemini API 生成文本 |
| dotenv | 加载环境变量 |

## License

ISC
