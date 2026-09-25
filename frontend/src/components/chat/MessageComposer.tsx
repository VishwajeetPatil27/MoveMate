import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageComposerProps {
  onSendMessage: (text: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending || disabled) return;

    const content = text.trim();
    setText('');
    try {
      setSending(true);
      await onSendMessage(content);
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <textarea
        className="form-control"
        rows={1}
        placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || sending}
        style={{
          flex: 1,
          borderRadius: '24px',
          padding: '0.625rem 1.15rem',
          fontSize: '0.875rem',
          resize: 'none',
          maxHeight: '120px',
          backgroundColor: 'var(--color-bg-page, #F8FAFC)',
          border: '1px solid var(--color-border-subtle, #E2E8F0)'
        }}
      />
      <button
        type="submit"
        disabled={!text.trim() || sending || disabled}
        className="btn btn-accent"
        style={{
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        title="Send Message"
        aria-label="Send Message"
      >
        <Send size={17} />
      </button>
    </form>
  );
};
