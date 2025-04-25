import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type TranscriptSegment = {
  start_at: number
  end_at: number
  text: string
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<TranscriptSegment[]> {
  const transcription = await openai.audio.transcriptions.create({
    file: audioBuffer as any, // OpenAI SDK 型別限制，實測可接受 Buffer
    model: 'whisper-1',
    response_format: 'verbose_json',
  })

  const segments: TranscriptSegment[] = (transcription as any).segments?.map((seg: any) => ({
    start_at: seg.start,
    end_at: seg.end,
    text: seg.text.trim(),
  })) ?? []

  return segments
}