import 'dotenv/config'
import { getEmbedding, getCachedEmbedding } from './embedding-axios'

/**
 * 計算兩個向量的餘弦相似度
 * @param vec1 第一個向量
 * @param vec2 第二個向量
 * @returns 餘弦相似度 (0-1 之間，1 表示完全相同，0 表示完全不同)
 */
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('向量維度不一致')
  }
  
  // 計算點積
  let dotProduct = 0
  // 計算向量大小
  let magnitude1 = 0
  let magnitude2 = 0
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    magnitude1 += vec1[i] * vec1[i]
    magnitude2 += vec2[i] * vec2[i]
  }
  
  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }
  
  return dotProduct / (magnitude1 * magnitude2)
}

async function testEmbedding() {
  try {
    // 測試一些句子
    const sentence1 = '我每天都聽 podcast，感覺很放鬆'
    const sentence2 = '聆聽廣播節目讓我心情愉悅'
    const sentence3 = '股票市場今天上漲了三個百分點'
    
    console.log('句子1:', sentence1)
    console.log('句子2:', sentence2)
    console.log('句子3:', sentence3)
    
    // 獲取嵌入向量
    const embedding1 = await getCachedEmbedding(sentence1)
    const embedding2 = await getCachedEmbedding(sentence2)
    const embedding3 = await getCachedEmbedding(sentence3)
    
    // 顯示向量的前 5 個元素作為示例
    console.log('句子1向量（前5個元素）:', embedding1.slice(0, 5))
    
    // 計算相似度
    const similarity12 = cosineSimilarity(embedding1, embedding2)
    const similarity13 = cosineSimilarity(embedding1, embedding3)
    const similarity23 = cosineSimilarity(embedding2, embedding3)
    
    console.log('句子1和2的相似度:', similarity12.toFixed(4))
    console.log('句子1和3的相似度:', similarity13.toFixed(4))
    console.log('句子2和3的相似度:', similarity23.toFixed(4))
    
    // 測試緩存功能
    console.log('\n測試緩存...')
    console.time('第二次調用')
    await getCachedEmbedding(sentence1)
    console.timeEnd('第二次調用')
  } catch (error: any) {
    console.error('測試時發生錯誤:', error.message)
  }
}

testEmbedding() 