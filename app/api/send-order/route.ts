import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { collection, addDoc, serverTimestamp, documentId, query, where, getDocs, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const orderItemSchema = z.object({
  cardId: z.string().min(1),
  quantity: z.number().int().positive()
})

const orderRequestSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  items: z.array(orderItemSchema).min(1)
})

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json()

    // 1. Validate incoming data
    const validationResult = orderRequestSchema.safeParse(rawData)

    if (!validationResult.success) {
      console.error('Validation Error (Order):', validationResult.error)
      return NextResponse.json(
        { error: 'Invalid order data format' },
        { status: 400 }
      )
    }

    const { name, phone, items } = validationResult.data

    // 2. Fetch current prices from Firestore (batching by 30 to respect 'in' limits)
    const cardIds = Array.from(new Set(items.map(item => item.cardId)))
    let fetchedCards: any[] = []

    const CHUNK_SIZE = 30
    for (let i = 0; i < cardIds.length; i += CHUNK_SIZE) {
      const chunk = cardIds.slice(i, i + CHUNK_SIZE)
      const q = query(
        collection(db, 'cards'),
        where(documentId(), 'in', chunk)
      )

      const snapshot = await getDocs(q)
      snapshot.forEach(doc => {
        fetchedCards.push({ id: doc.id, ...doc.data() })
      })
    }

    // 3. Calculate total and verify availability on server
    let total = 0
    let discount = 0
    let validatedItemsList: string[] = []
    let orderItemsData: any[] = []

    for (const item of items) {
      const dbCard = fetchedCards.find(c => c.id === item.cardId)

      if (!dbCard) {
        console.error(`Card not found in DB: ${item.cardId}`)
        return NextResponse.json({ error: `Item ${item.cardId} not found` }, { status: 404 })
      }

      if (!dbCard.inStock) {
        return NextResponse.json({ error: `Item ${dbCard.title} is out of stock` }, { status: 400 })
      }

      const itemTotal = Number(dbCard.price) * item.quantity
      total += itemTotal

      if (dbCard.originalPrice && dbCard.originalPrice > dbCard.price) {
         discount += (dbCard.originalPrice - dbCard.price) * item.quantity
      }

      // Prepare data for DB and TG
      orderItemsData.push({
         cardId: item.cardId,
         title: dbCard.title,
         price: dbCard.price,
         quantity: item.quantity
      })

      validatedItemsList.push(
        `- ${dbCard.title} (${item.quantity} шт\\.) \\- ${dbCard.price.toLocaleString()} BYN`
      )
    }

    // 4. Save Order to Firestore `orders` collection
    const orderDocRef = await addDoc(collection(db, 'orders'), {
      customer: { name, phone },
      items: orderItemsData,
      totals: {
        totalAmount: Number(total.toFixed(2)),
        discountAmount: Number(discount.toFixed(2))
      },
      status: 'pending',
      createdAt: serverTimestamp()
    })

    // 5. Send Telegram Notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const channelId = process.env.TELEGRAM_CHANNEL_ID

    if (!botToken || !channelId) {
      console.error('Telegram credentials not configured')
      return NextResponse.json({ success: true, orderId: orderDocRef.id, warn: 'TG not configured' }, { status: 201 })
    }

    const itemsText = validatedItemsList.join('\n')

    const message = `📦 *Новый заказ\\!* \\(\\#${orderDocRef.id}\\)

*Контактные данные:*
👤 Имя: \`${name.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}\`
📞 Телефон: \`${phone.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}\`

*Состав заказа:*
${itemsText}

*\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-*
${discount > 0 ? `Скидка: \\-${Number(discount.toFixed(2)).toLocaleString()} BYN\n` : ''}*Итого к оплате: ${Number(total.toFixed(2)).toLocaleString()} BYN*`

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
      }),
    })

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json()
      console.error('Telegram API error:', errorData)
      // Log error but order is already saved in DB
    }

    return NextResponse.json({ success: true, orderId: orderDocRef.id }, { status: 201 })
  } catch (error) {
    console.error('Error processing checkout:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
