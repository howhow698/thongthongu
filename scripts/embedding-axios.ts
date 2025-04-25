import axios from 'axios'

/**
 * 使用 OpenAI Embedding API 將文字轉換為語意向量 (使用 axios)
 * @param text 需要轉換的文字，例如 "我每天都聽 podcast，感覺很放鬆"
 * @returns 1536 維度的浮點數向量
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    console.log('正在生成文字向量...')
    
    // 使用 axios 直接調用 OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )
    
    // 獲取向量
    const embedding = response.data.data[0].embedding
    
    console.log(`成功生成 ${embedding.length} 維度的向量`)
    return embedding
  } catch (error: any) {
    console.error('生成向量失敗:', error.message)
    if (error.response) {
      console.error('API 回應狀態碼:', error.response.status)
      console.error('API 回應內容:', error.response.data)
    }
    throw error
  }
}

// 緩存功能
const embeddingCache = new Map<string, number[]>()

/**
 * 使用緩存版本的 getEmbedding 函數
 * @param text 需要轉換的文字
 * @returns 向量
 */
export async function getCachedEmbedding(text: string): Promise<number[]> {
  // 如果文本已經在緩存中，直接返回緩存的向量
  if (embeddingCache.has(text)) {
    console.log('從緩存中獲取向量')
    return embeddingCache.get(text)!
  }
  
  // 否則調用 API 獲取向量
  const embedding = await getEmbedding(text)
  
  // 將結果存入緩存
  embeddingCache.set(text, embedding)
  
  return embedding
} 