import fs from 'fs';
import { embedChunk, embedChunks } from './embed.js';
import { saveEmbeddings, retrieve } from './store.js';
import { rerank } from './retrieve.js';
import { generate } from './generate.js';

// Step 1: 文档分块
function splitIntoChunks(docFile) {
    const content = fs.readFileSync(docFile, 'utf-8');
    return content.split('\n\n').filter(chunk => chunk.trim());
}

async function main() {
    console.log('=== Step 1: 文档分块 ===\n');
    const chunks = splitIntoChunks('doc.md');
    for (let i = 0; i < chunks.length; i++) {
        console.log(`[${i}] ${chunks[i]}\n`);
    }

    console.log('=== Step 2: 生成 Embedding ===\n');
    const testEmbedding = await embedChunk('测试内容');
    console.log(`Embedding 维度: ${testEmbedding.length}`);

    console.log('\n=== Step 3: 为所有分块生成 Embedding ===\n');
    const embeddings = await embedChunks(chunks);
    console.log(`生成了 ${embeddings.length} 个 embeddings`);

    console.log('\n=== Step 4: 存储到向量数据库 ===\n');
    await saveEmbeddings(chunks, embeddings);

    console.log('\n=== Step 5: 检索相关文档 ===\n');
    const query = '桃园三结义三位主角都是谁，各自分别使用什么兵器？';
    const queryEmbedding = await embedChunk(query);
    const retrievedChunks = await retrieve(queryEmbedding, 5);

    console.log('检索到的文档片段:');
    for (let i = 0; i < retrievedChunks.length; i++) {
        console.log(`[${i}] ${retrievedChunks[i]}\n`);
    }

    console.log('\n=== Step 6: 重排序 ===\n');
    const rerankedChunks = await rerank(query, retrievedChunks, 3, embedChunk);

    console.log('重排序后的文档片段:');
    for (let i = 0; i < rerankedChunks.length; i++) {
        console.log(`[${i}] ${rerankedChunks[i]}\n`);
    }

    console.log('\n=== Step 7: 生成回答 ===\n');
    const answer = await generate(query, rerankedChunks);
    console.log(answer);

}

main();