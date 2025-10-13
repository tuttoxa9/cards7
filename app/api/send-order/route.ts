import { NextRequest, NextResponse } from 'next/server'

interface OrderItem {
  title: string
  quantity: number
  price: number
}

interface OrderData {
  name: string
  phone: string
  items: OrderItem[]
  total: number
  discount: number
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()

    const { name, phone, items, total, discount } = orderData

    // Получение переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const channelId = process.env.TELEGRAM_CHANNEL_ID

    if (!botToken || !channelId) {
      console.error('Telegram credentials not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Формирование сообщения
    const itemsList = items
      .map(
        (item) =>
          `- ${item.title} (${item.quantity} шт\\.) \\- ${item.price.toLocaleString()} BYN`
      )
      .join('\n')

    const message = `📦 *Новый заказ\\!*

*Контактные данные:*
👤 Имя: \`${name.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}\`
📞 Телефон: \`${phone.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')}\`

*Состав заказа:*
${itemsList}

*\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-*
${discount > 0 ? `Скидка: \\-${discount.toLocaleString()} BYN\n` : ''}*Итого к оплате: ${total.toLocaleString()} BYN*`

    // Отправка в Telegram
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
      return NextResponse.json(
        { error: 'Failed to send order to Telegram' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
