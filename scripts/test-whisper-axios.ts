import 'dotenv/config'
import path from 'path'
import { transcribeAudio } from './whisper-axios'

async function test() {
  const filePath = path.resolve(__dirname, '../audio/audio.mp3')

  try {
    const segments = await transcribeAudio(filePath)

    segments.forEach((seg, i) => {
      console.log(`[${i}] (${seg.start_at}s → ${seg.end_at}s): ${seg.text}`)
    })
  } catch (error) {
    console.error('測試過程中發生錯誤:', error)
  }
}

test() 