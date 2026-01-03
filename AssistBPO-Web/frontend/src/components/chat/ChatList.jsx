import React, { useRef, useEffect } from 'react'
import { ChatMessage } from './ChatMessage'

export function ChatList({ messages }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <main className="pt-4 pb-24 overflow-y-auto h-full">
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} />
        ))}
        <div ref={endRef} />
      </div>
    </main>
  )
}
