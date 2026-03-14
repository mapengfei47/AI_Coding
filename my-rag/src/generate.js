import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generate(query, chunks) {
  const prompt = `你是一位知识助手，请根据用户的问题和下列片段生成准确的回答。

用户问题: ${query}

相关片段:
${chunks.join('\n\n')}

请基于上述内容作答，不要编造信息。`;

  console.log(`${prompt}\n\n---\n`);

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text;
}
