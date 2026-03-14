import { pipeline } from '@xenova/transformers';

let embedder = null;

async function initEmbedder() {
  if (!embedder) {
    console.log('Loading embedding model...');
    embedder = await pipeline('feature-extraction',
      'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
    console.log('Embedding model loaded.');
  }
  return embedder;
}

export async function embedChunk(text) {
  const model = await initEmbedder();
  const result = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

export async function embedChunks(chunks) {
  const embeddings = [];
  for (const chunk of chunks) {
    const embedding = await embedChunk(chunk);
    embeddings.push(embedding);
  }
  return embeddings;
}
