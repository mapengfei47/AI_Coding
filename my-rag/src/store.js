// 内存向量存储实现
class MemoryVectorStore {
  constructor() {
    this.documents = [];
    this.embeddings = [];
    this.ids = [];
  }

  async add({ documents, embeddings, ids }) {
    for (let i = 0; i < documents.length; i++) {
      this.documents.push(documents[i]);
      this.embeddings.push(embeddings[i]);
      this.ids.push(ids[i]);
    }
  }

  async query({ queryEmbeddings, nResults }) {
    const queryEmbedding = queryEmbeddings[0];
    const scores = [];

    for (let i = 0; i < this.embeddings.length; i++) {
      const score = this.cosineSimilarity(queryEmbedding, this.embeddings[i]);
      scores.push({ index: i, score });
    }

    scores.sort((a, b) => b.score - a.score);
    const topResults = scores.slice(0, nResults);

    return {
      documents: [topResults.map(r => this.documents[r.index])],
      ids: [topResults.map(r => this.ids[r.index])]
    };
  }

  cosineSimilarity(a, b) {
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
}

let collection = null;

export async function initChroma() {
  if (!collection) {
    collection = new MemoryVectorStore();
  }
  return { collection };
}

export async function saveEmbeddings(chunks, embeddings) {
  const { collection } = await initChroma();

  for (let i = 0; i < chunks.length; i++) {
    await collection.add({
      documents: [chunks[i]],
      embeddings: [embeddings[i]],
      ids: [String(i)]
    });
  }

  console.log(`Saved ${chunks.length} chunks to vector store.`);
}

export async function retrieve(queryEmbedding, topK) {
  const { collection } = await initChroma();

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK
  });

  return results.documents[0];
}
