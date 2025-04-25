import 'dotenv/config'
import OpenAI from 'openai'

async function testOpenAI() {
  try {
    console.log('測試 OpenAI API 連接...')
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    
    // 測試簡單的 API 調用
    const models = await openai.models.list()
    console.log('連接成功! 可用模型數量:', models.data.length)
    console.log('API Key 正常工作')
  } catch (error: any) {
    console.error('連接失敗:', error.message)
    if (error.cause) {
      console.error('原因:', error.cause.message || error.cause)
    }
  }
}

testOpenAI().catch(console.error) 