import { getStore } from '@netlify/blobs'

export default async (req) => {
  try {
    const store = getStore('now')

    if (req.method === 'GET') {
      const entry = await store.get('current', { type: 'json' })
      return new Response(JSON.stringify(entry || { text: '', date: '' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'POST') {
      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const allowedUserId = Number(process.env.TELEGRAM_USER_ID)

      if (!botToken || !allowedUserId) {
        return new Response('Not configured', { status: 500 })
      }

      const update = await req.json()
      const message = update?.message

      if (!message?.text || !message?.from) {
        return new Response('OK')
      }

      if (message.from.id !== allowedUserId) {
        return new Response('Forbidden', { status: 403 })
      }

      await store.setJSON('current', {
        text: message.text,
        date: new Date().toISOString(),
      })

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: 'Aktualizováno!',
        }),
      })

      return new Response('OK')
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = {
  path: '/api/now',
}
