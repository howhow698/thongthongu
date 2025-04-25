import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 5,
  timeout: 120000,
})

export type TranscriptSegment = {
  start_at: number
  end_at: number
  text: string
}

export async function transcribeAudio(filePath: string): Promise<TranscriptSegment[]> {
  try {
    console.log('開始處理音頻文件:', path.basename(filePath))
    
    const file = fs.createReadStream(filePath)
    
    console.log('發送請求到 OpenAI API...')
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      response_format: 'verbose_json',
    })
    
    console.log('接收到 API 回應')
    
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
    if (error.cause) {
      console.error('原因:', error.cause.message || error.cause)
    }
    throw error
  }
}
