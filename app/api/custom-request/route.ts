import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { z } from 'zod'

const customRequestSchema = z.object({
  name: z.string().min(2),
  contact: z.string().min(5),
  description: z.string().min(10),
  referenceImagesUrls: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json()

    // Server-side Validation
    const validationResult = customRequestSchema.safeParse(rawData)

    if (!validationResult.success) {
      console.error('Validation Error (Custom Request):', validationResult.error)
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    const { name, contact, description, referenceImagesUrls } = validationResult.data

    // 1. Save to Firestore `custom_requests` collection
    const docRef = await addDoc(collection(db, 'custom_requests'), {
      name,
      contact,
      description,
      referenceImagesUrls: referenceImagesUrls || [],
      status: 'new',
      createdAt: serverTimestamp()
    })

    // 2. Send Telegram Notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const channelId = process.env.TELEGRAM_CHANNEL_ID

    if (botToken && channelId) {
      const escapedName = name.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
      const escapedContact = contact.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
      const escapedDescription = description.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')

      const referenceText = referenceImagesUrls && referenceImagesUrls.length > 0
        ? `\n*Референсы:* [Ссылка](${referenceImagesUrls[0].replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')})`
        : ''

      const message = `🔴 *НОВАЯ КАСТОМНАЯ ЗАЯВКА* \\(\\#${docRef.id}\\)\n\n👤 *Имя:* \`${escapedName}\`\n📞 *Контакт:* \`${escapedContact}\`\n\n📝 *Описание идеи:*\n_${escapedDescription}_${referenceText}`

      const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

      const telegramResponse = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: channelId,
          text: message,
          parse_mode: 'MarkdownV2',
          disable_web_page_preview: false,
        }),
      })

      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json()
        console.error('Telegram API error (Custom Request):', errorData)
        // We don't fail the request if TG fails, but log it
      }
    } else {
      console.warn('Telegram credentials not configured for Custom Requests')
    }

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 })
  } catch (error) {
    console.error('Error processing custom request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
