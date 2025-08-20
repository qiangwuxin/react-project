import { useEffect, useRef, useState } from 'react';
import {
  Loading,
} from 'react-vant';
// 不需要圖標庫，使用文字符號
import useTitle from '@/hooks/useTitle';
import { chat } from '@/llm';
import styles from './aichat.module.css';

const AIChat = () => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatAreaRef = useRef(null);
  const [error, setError] = useState('');
  const errorTimerRef = useRef(null);
  const mountedRef = useRef(true);

  useTitle('AI聊天');

  const [message, setMessage] = useState([
    { id: 2, content: 'How are you today?', role: 'user', timestamp: new Date() },
    { id: 1, content: 'Hey. I\'m sorry I did not answer yesterday. You\'re not offended?', role: 'assistant', timestamp: new Date() }
  ]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [message]);

  const showTempError = (msg) => {
    setError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setError('');
    }, 3000);
  };

  const handleChat = async () => {
    if (text.trim() === '') {
      showTempError('请输入消息');
      return;
    }

    setIsSending(true);
    const sendText = text;
    setText('');
    setError('');

    setMessage((prev) => [
      ...prev,
      { id: Date.now(), content: sendText, role: 'user', timestamp: new Date() }
    ]);

    try {
      const newMessage = await chat([{ role: 'user', content: sendText }]);
      if (!mountedRef.current) return;
      setMessage((prev) => [
        ...prev,
        { id: Date.now() + 1, ...newMessage.data, timestamp: new Date() }
      ]);
    } catch (error) {
      showTempError('发送失败，请重试');
    } finally {
      if (mountedRef.current) setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'TODAY';
    }
    return messageDate.toLocaleDateString();
  };

  const shouldShowDateSeparator = (currentIndex) => {
    if (currentIndex === 0) return true;

    const currentMessage = message[currentIndex];
    const previousMessage = message[currentIndex - 1];

    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();

    return currentDate !== previousDate;
  };

  return (
    <div className={styles.container}>
      {/* 錯誤提示 */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* 聊天區域 */}
      <div ref={chatAreaRef} className={styles.chatArea}>
        {message.map((msg, index) => (
          <div key={msg.id}>
            {shouldShowDateSeparator(index) && (
              <div className={styles.dateSeparator}>
                <span>{formatDate(msg.timestamp)}</span>
              </div>
            )}
            <div
              className={
                msg.role === 'user' ? styles.messageRight : styles.messageLeft
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* 輸入區域 */}
      <div className={styles.inputArea}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Your message"
          className={styles.input}
          disabled={isSending}
        />
        <button
          className={styles.sendButton}
          onClick={handleChat}
          disabled={isSending || !text.trim()}
        >
          <span className={styles.sendIcon}>↗</span>
        </button>
      </div>

      {/* 加載指示器 */}
      {isSending && (
        <div className={styles.loadingContainer}>
          <Loading type="ball" />
        </div>
      )}
    </div>
  );
};

export default AIChat;