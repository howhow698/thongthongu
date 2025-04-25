import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'

export type TranscriptSegment = {
  start_at: number
  end_at: number
  text: string
}

export async function transcribeAudio(filePath: string): Promise<TranscriptSegment[]> {
  try {
    console.log('開始處理音頻文件:', path.basename(filePath))
    
    // 創建表單數據
    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath))
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'verbose_json')
    
    console.log('發送請求到 OpenAI API...')
    
    // 設置更長的超時時間和額外的請求配置
    const config = {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      timeout: 180000, // 3分鐘超時
      maxContentLength: Infinity, // 允許任意大小的請求
      maxBodyLength: Infinity, // 允許任意大小的請求体
    }
    
    // 發送請求
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      config
    )
    
    console.log('接收到 API 回應')
    
    const transcription = response.data
    
    if (!transcription.segments || transcription.segments.length === 0) {
      console.warn('API 回應沒有包含段落信息')
      return []
    }

    const segments: TranscriptSegment[] = transcription.segments.map((seg: any) => ({
      start_at: seg.start,
      end_at: seg.end,
      text: seg.text.trim(),
    }))

    console.log(`成功轉錄 ${segments.length} 個段落`)
    return segments
  } catch (error: any) {
    console.error('音頻轉錄失敗:', error.message)
    if (error.response) {
      // 服務器回應了錯誤
      console.error('服務器回應狀態碼:', error.response.status)
      console.error('服務器回應數據:', error.response.data)
    } else if (error.request) {
      // 請求已發送但沒有收到回應
      console.error('請求已發送但沒有收到回應')
    } else {
      // 請求設置時出錯
      console.error('請求設置錯誤:', error.message)
    }
    throw error
  }
} 