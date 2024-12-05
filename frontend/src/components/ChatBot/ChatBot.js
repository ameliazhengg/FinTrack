import React, { useState } from 'react';
import { generateResponse } from './chatbotUtils';
import './ChatBot.css';

function ChatBot({ transactions }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      console.log('Sending question:', userMessage);
      console.log('With transactions:', transactions);
      
      const response = await generateResponse(userMessage, transactions);
      
      if (response.startsWith('Error:')) {
        setMessages(prev => [...prev, { 
          type: 'error', 
          content: response 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: response 
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        type: 'error', 
        content: `Error: ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.content}
          </div>
        ))}
        {isLoading && <div className="message bot">Thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your transactions..."
          className="chat-input"
        />
        <button type="submit" disabled={isLoading} className="chat-submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBot;