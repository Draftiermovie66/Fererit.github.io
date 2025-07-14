import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const API_URL = 'https://YOUR-BACKEND-URL' // Replace with your deployed backend!

export default function App() {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [chatMsg, setChatMsg] = useState('')
  const [chatMessages, setChatMessages] = useState([])

  useEffect(() => {
    // Fetch posts
    fetch(`${API_URL}/api/posts`)
      .then(res => res.json())
      .then(data => setPosts(data))

    // Setup socket.io
    const socket = io(API_URL)

    socket.on('chat message', msg => {
      setChatMessages(prev => [...prev, msg])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const createPost = async () => {
    await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    setTitle('')
    setContent('')
    // Refresh posts
    const res = await fetch(`${API_URL}/api/posts`)
    const data = await res.json()
    setPosts(data)
  }

  const sendChat = () => {
    const socket = io(API_URL)
    socket.emit('chat message', chatMsg)
    setChatMsg('')
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Forum + Chat</h1>

      {/* Forum */}
      <div>
        <h2 className="text-xl font-bold">Create Post</h2>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 mr-2"
        />
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Content"
          className="border p-2 mr-2"
        />
        <button
          onClick={createPost}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Post
        </button>

        <div className="mt-4">
          <h3 className="text-lg font-bold">Posts</h3>
          {posts.map(p => (
            <div key={p.id} className="border p-2 my-2">
              <h4 className="font-semibold">{p.title}</h4>
              <p>{p.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div>
        <h2 className="text-xl font-bold">Chat</h2>
        <div className="border p-4 h-48 overflow-y-scroll mb-2">
          {chatMessages.map(msg => (
            <div key={msg.id}>{msg.text}</div>
          ))}
        </div>
        <input
          value={chatMsg}
          onChange={e => setChatMsg(e.target.value)}
          placeholder="Type a message"
          className="border p-2 mr-2"
        />
        <button
          onClick={sendChat}
          className="bg-green-500 text-white px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  )
}
