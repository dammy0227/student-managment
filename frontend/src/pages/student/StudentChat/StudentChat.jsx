import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
} from '../../../features/message/messageThunks';
import { selectCurrentProject } from '../../../features/project/projectSlice';
import io from 'socket.io-client';
import { FaArrowDown } from 'react-icons/fa';

import './StudentChat.css';

const socket = io('http://localhost:5000'); // Replace with your deployed URL if necessary

const StudentChat = () => {
  const dispatch = useDispatch();
  const chatBoxRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { messages, loading, error } = useSelector((state) => state.chat || {});
  const project = useSelector(selectCurrentProject);
  const currentUser = useSelector((state) => state.auth.user);
  const supervisor = project?.supervisor;

  const [newMessage, setNewMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);

  // ✅ Join student's room (one-time)
  useEffect(() => {
    if (currentUser?._id) {
      socket.emit('joinRoom', String(currentUser._id));
      console.log('✅ Student joined room:', currentUser._id);
    }

    // Cleanup only disconnect listeners, not the entire socket
    return () => {
      socket.off('newMessage');
    };
  }, [currentUser?._id]);

  // ✅ Fetch messages when supervisor changes
  useEffect(() => {
    if (supervisor?._id) {
      dispatch(fetchMessages(supervisor._id));
      dispatch(markMessagesAsRead(supervisor._id));
    }
  }, [dispatch, supervisor?._id]);

  // ✅ Scroll to bottom on messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Socket listener for new messages
  useEffect(() => {
    if (!currentUser?._id || !supervisor?._id) return;

    const handleNewMessage = (msg) => {
      console.log('📩 New message received in student chat:', msg);
      const isChatRelated =
        (msg.sender === currentUser._id && msg.receiver === supervisor._id) ||
        (msg.sender === supervisor._id && msg.receiver === currentUser._id);

      if (isChatRelated) {
        dispatch(fetchMessages(supervisor._id));
        dispatch(markMessagesAsRead(supervisor._id));
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [currentUser?._id, supervisor?._id, dispatch]);

  // ✅ Show scroll button when not at bottom
  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (!chatBox) return;

    const handleScroll = () => {
      const nearBottom =
        chatBox.scrollTop + chatBox.clientHeight >= chatBox.scrollHeight - 100;
      setShowScrollButton(!nearBottom);
    };

    chatBox.addEventListener('scroll', handleScroll);
    return () => chatBox.removeEventListener('scroll', handleScroll);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    dispatch(sendMessage({ receiverId: supervisor._id, content: newMessage }));
    setNewMessage('');
  };

  if (!supervisor) {
    return (
      <p className="error">⚠️ Please select a project with an assigned supervisor.</p>
    );
  }

  return (
    <div className="chat-container">

      {loading && <p>Loading messages...</p>}
      {error && <p className="error">{error}</p>}

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => {
          const isSender = msg.sender === currentUser._id;
          return (
            <div
              key={idx}
              className={`chat-message ${isSender ? 'student' : 'supervisor'}`}
            >
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
      </div>

      {showScrollButton && (
         <button className="scroll-button" onClick={scrollToBottom}>
            <FaArrowDown />
          </button>
      )}

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

export default StudentChat;
