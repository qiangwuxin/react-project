import { useEffect, useRef, useState } from 'react';
import { 
  Button, 
  Input, 
  Loading,
} from 'react-vant'; 
import { ChatO, UserO } from '@react-vant/icons';
import useTitle from '@/hooks/useTitle';
import { chat } from '@/llm';
import styles from './aichat.module.css';

const AIChat = () => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatAreaRef = useRef(null);
  const [error, setError] = useState('');  

  useTitle('AI聊天');

  const [message, setMessage] = useState([
    { id: 2, content: 'hello~', role: 'user' },
    { id: 1, content: 'hello, I am your assistant~~', role: 'assistant' }
  ]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [message]);
  
  const showTempError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 2000); // 2秒后自动清除
  };

  const handleChat = async () => {
    if (text.trim() === '') {
      showTempError('内容不能为空'); 
      return;
    }

    setIsSending(true);
    const sendText = text;
    setText('');
    setError(''); 

    setMessage((prev) => [
      ...prev,
      { id: Date.now(), content: sendText, role: 'user' }
    ]);

    try {
      const newMessage = await chat([{ role: 'user', content: sendText }]);
      setMessage((prev) => [
        ...prev,
        { id: Date.now() + 1, ...newMessage.data }
      ]);
    } catch (error) {
      showTempError('发送失败，请重试');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 添加错误提示显示区域 - 固定在顶部 */}
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-10">
          {error}
        </div>
      )}
      
      <div ref={chatAreaRef} className={`flex-1 ${styles.chatArea}`}>
        {message.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.role === 'user' ? styles.messageRight : styles.messageLeft
            }
          >
            {msg.role === 'assistant' ? <ChatO /> : <UserO />}
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className={`flex ${styles.inputArea}`}>
        <Input
          value={text}
          onChange={(e) => setText(e)}
          placeholder="请输入消息"
          className={`flex-1 ${styles.input}`}
        />
        <Button disabled={isSending} type="primary" onClick={handleChat}>
          {isSending ? '发送中...' : '发送'}
        </Button>
      </div>
      
      {isSending &&  (<div className="fixed-loading"><Loading type="ball"/></div>) }
    </div>
  );
};

export default AIChat;