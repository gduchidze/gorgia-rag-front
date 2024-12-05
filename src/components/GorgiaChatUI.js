// GorgiaChatUI.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ProductCarousel from './ProductCarousel';

const GorgiaChatUI = () => {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: 'მოგესალმებით! მე ვარ Gorgia-ს დახმარების ასისტენტი. რით შემიძლია დაგეხმაროთ?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://gorgia-rag-chat-3.onrender.com/api/chat', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: data.error
        }]);
      } else {
        let botMessage = {
          type: 'bot'
        };

        if (typeof data.response === 'object' && data.response.type === 'product_list') {
          botMessage.content = data.response.message;
          botMessage.products = data.response.products;
        } else if (typeof data.response === 'object' && data.response.message) {
          botMessage.content = data.response.message;
        } else {
          botMessage.content = String(data.response);
        }

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: `Error: ${error.message}`
      }]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  const renderMessage = (message) => {
    const isUser = message.type === 'user';

    return (
      <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              <User className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <div
          className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-none'
              : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
          }`}
        >
          <p className="whitespace-pre-wrap">{String(message.content)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center gap-3 shadow-lg">
        <Bot className="w-8 h-8" />
        <div>
          <h1 className="text-2xl font-bold">Gorgia ჩატბოტი</h1>
          <p className="text-sm text-blue-100">24/7 ონლაინ დახმარება</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className="space-y-4">
            {renderMessage(message)}
            {message.products && (
              <div className="mt-4">
                <ProductCarousel products={message.products} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white text-gray-800 shadow-sm border border-gray-100">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="დაწერეთ თქვენი შეკითხვა..."
            className="flex-1 p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-100"
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GorgiaChatUI;
