// 使用 embedding 相似度进行重排序
export async function rerank(query, chunks, topK, embedChunkFn) {
  if (!embedChunkFn) {
    console.log('Using simple reranking (first N chunks)');
    return chunks.slice(0, topK);
  }

  console.log('Using embedding-based reranking...');
  const queryEmbedding = await embedChunkFn(query);

  const scoredChunks = [];
  for (const chunk of chunks) {
    const chunkEmbedding = await embedChunkFn(chunk);
    const score = cosineSimilarity(queryEmbedding, chunkEmbedding);
    scoredChunks.push({ chunk, score });
  }

  scoredChunks.sort((a, b) => b.score - a.score);
  return scoredChunks.slice(0, topK).map(item => item.chunk);
}

function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
