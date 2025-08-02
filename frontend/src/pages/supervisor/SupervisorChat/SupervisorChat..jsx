import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, markMessagesAsRead } from '../../../features/message/messageThunks';
import './SupervisorChat.css';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // ✅ Replace with your backend URL if deployed

const SupervisorChat = () => {
  const dispatch = useDispatch();
  const { studentId } = useParams();
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  const { messages, loading, error } = useSelector((state) => state.chat || {});
  const currentUser = useSelector((state) => state.auth.user);

  const [newMessage, setNewMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);

  // ✅ Join socket room and listen for messages
  useEffect(() => {
    if (currentUser?._id) {
      socket.emit('joinRoom', currentUser._id);

      socket.on('newMessage', (msg) => {
        const isRelated =
          (msg.sender === studentId && msg.receiver === currentUser._id) ||
          (msg.receiver === studentId && msg.sender === currentUser._id);

        if (isRelated) {
          dispatch(fetchMessages(studentId));
          dispatch(markMessagesAsRead(studentId));
        }
      });
    }

    return () => {
      socket.off('newMessage');
    };
  }, [currentUser?._id, studentId, dispatch]);

  // ✅ Fetch messages immediately when chat opens
  useEffect(() => {
    if (studentId) {
      dispatch(fetchMessages(studentId));
      dispatch(markMessagesAsRead(studentId));
    }
  }, [dispatch, studentId]);

  // ✅ Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Show scroll button only when not at bottom
  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (!chatBox) return;

    const handleScroll = () => {
      const nearBottom = chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 100;
      setShowScrollButton(!nearBottom);
    };

    chatBox.addEventListener('scroll', handleScroll);
    return () => chatBox.removeEventListener('scroll', handleScroll);
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    dispatch(sendMessage({ receiverId: studentId, content: newMessage }));
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      {loading && <p>Loading messages...</p>}
      {error && <p className="error">{error}</p>}

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => {
          const isSender = msg.sender === currentUser._id;
          return (
            <div key={idx} className={`chat-message ${isSender ? 'own' : 'other'}`}>
              <div className="message-bubble">
                <p>{msg.content}</p>
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
        {showScrollButton && (
          <button className="scroll-button" onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            ⬇️
          </button>
        )}
      </div>

      <form onSubmit={handleSend} className="chat-form">
        <div className="chat-flex">
          <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!newMessage.trim()} className='btn-chat'>
          Send
        </button>
        </div>
      </form>
    </div>
  );
};

export default SupervisorChat;
