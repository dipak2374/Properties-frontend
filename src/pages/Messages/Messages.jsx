import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../../styles/pages.css';
import { sendMessage, fetchMessages } from '../../services/messageService';
import { fetchAdmins } from '../../services/userService';
import { showToast } from '../../utils/featureState';

const defaultConversations = [
  { name: 'Michael Johnson', topic: 'Viewing request', preview: 'I can schedule a walkthrough for Saturday morning.', time: '10 min ago' },
  { name: 'PropertyHub Support', topic: 'Booking update', preview: 'Your appointment request has been received.', time: '1 hr ago' },
];

const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

export default function Messages() {
  const shouldReduceMotion = useReducedMotion();
  const { user } = useSelector((state) => state.auth || {});
  const [conversations, setConversations] = useState(defaultConversations);
  const [selectedConvIdx, setSelectedConvIdx] = useState(0);
  const [draft, setDraft] = useState('');
  const [draftTouched, setDraftTouched] = useState(false);
  const [draftError, setDraftError] = useState('');
  const [sending, setSending] = useState(false);
  const [receiverId, setReceiverId] = useState('');

  // Map messages into grouped conversation threads
  const [threads, setThreads] = useState({
    'Michael Johnson': [
      { sender: 'Michael Johnson', content: 'Hi, is the Modern Family Apartment still available for viewing?', time: '20 min ago' },
      { sender: 'You', content: 'Yes, it is! Would you prefer a morning or afternoon slot?', time: '15 min ago' },
      { sender: 'Michael Johnson', content: 'I can schedule a walkthrough for Saturday morning.', time: '10 min ago' }
    ],
    'PropertyHub Support': [
      { sender: 'PropertyHub Support', content: 'Your account registration has been successfully verified.', time: '2 hr ago' },
      { sender: 'PropertyHub Support', content: 'Your appointment request has been received.', time: '1 hr ago' }
    ]
  });

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        const nextMessages = Array.isArray(data?.messages) ? data.messages : [];
        if (nextMessages.length > 0) {
          // Group incoming API messages into threads
          const newThreads = { ...threads };
          nextMessages.forEach((msg) => {
            const senderName = msg?.sender?.name || 'PropertyHub Support';
            if (!newThreads[senderName]) {
              newThreads[senderName] = [];
            }
            newThreads[senderName].push({
              sender: senderName,
              content: msg.content,
              time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
            });
          });
          setThreads(newThreads);
          
          const uniqueSenders = Object.keys(newThreads);
          setConversations(uniqueSenders.map((name) => {
            const lastMsg = newThreads[name][newThreads[name].length - 1];
            return {
              name,
              topic: 'Direct Message',
              preview: lastMsg?.content || 'No messages yet',
              time: lastMsg?.time || 'Just now'
            };
          }));
        }
      } catch {
        // Fallback to static mock data
      }
    };

    loadMessages();
  }, []);

  useEffect(() => {
    const loadSupportReceiver = async () => {
      try {
        const admins = await fetchAdmins();
        const adminUser = Array.isArray(admins) ? admins[0] : null;
        if (adminUser) {
          setReceiverId(adminUser.id || adminUser._id || '');
        }
      } catch {
        // silently fall back
      }
    };

    loadSupportReceiver();
  }, []);

  const validateDraft = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Message is required.';
    if (trimmed.length < MIN_LENGTH) return `Message must be at least ${MIN_LENGTH} characters.`;
    if (trimmed.length > MAX_LENGTH) return `Message must be at most ${MAX_LENGTH} characters.`;
    return '';
  };

  const handleDraftChange = (event) => {
    const value = event.target.value;
    setDraft(value);
    if (draftTouched) {
      setDraftError(validateDraft(value));
    }
  };

  const handleDraftBlur = () => {
    setDraftTouched(true);
    setDraftError(validateDraft(draft));
  };

  const handleSend = async (event) => {
    event.preventDefault();
    setDraftTouched(true);

    const error = validateDraft(draft);
    setDraftError(error);
    if (error) {
      showToast(error, 'error');
      return;
    }

    setSending(true);
    try {
      const senderId = user?.id || user?._id;
      if (!senderId) {
        throw new Error('You must be signed in to send messages.');
      }

      await sendMessage({
        content: draft.trim(),
        sender: senderId,
        receiver: receiverId || senderId,
      });

      const currentConvName = conversations[selectedConvIdx]?.name || 'PropertyHub Support';
      
      // Update thread state immediately
      setThreads((prev) => ({
        ...prev,
        [currentConvName]: [
          ...(prev[currentConvName] || []),
          { sender: 'You', content: draft.trim(), time: 'Just now' }
        ]
      }));

      // Update conversations preview
      setConversations((prevConvs) => {
        const updated = [...prevConvs];
        if (updated[selectedConvIdx]) {
          updated[selectedConvIdx].preview = draft.trim();
          updated[selectedConvIdx].time = 'Just now';
        }
        return updated;
      });

      setDraft('');
      setDraftTouched(false);
      setDraftError('');
      showToast('Message sent.', 'success');
    } catch (error) {
      showToast(error?.response?.data?.message || error?.message || 'Unable to send message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const trimmedLen = draft.trim().length;
  const counterClass = trimmedLen > MAX_LENGTH
    ? 'char-counter char-over'
    : trimmedLen > MAX_LENGTH * 0.85
      ? 'char-counter char-warn'
      : 'char-counter';

  const activeConvName = conversations[selectedConvIdx]?.name || '';
  const currentChatMessages = threads[activeConvName] || [];

  return (
    <div className="page-shell">
      <main className="page-content messages-page-container">
        <motion.section className="page-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="breadcrumb">Home / Messages</p>
            <h1>Your Messages</h1>
            <p>Keep your conversations with agents and support in one place.</p>
          </div>
          <Link to="/contact" className="button button-secondary">Contact Support</Link>
        </motion.section>

        <div className="messages-layout-split" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', marginTop: '2rem', minHeight: '500px' }}>
          {/* Left conversations list */}
          <div className="conversations-sidebar-list" style={{ borderRight: '1px solid #e2e8f0', paddingRight: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.5rem 0' }}>Recent Chats</h3>
            {conversations.map((conversation, index) => (
              <button
                key={`${conversation.name}-${index}`}
                onClick={() => setSelectedConvIdx(index)}
                style={{
                  background: selectedConvIdx === index ? '#f1f5f9' : 'transparent',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedConvIdx === index ? 'none' : '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{conversation.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{conversation.time}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {conversation.preview}
                </p>
              </button>
            ))}
          </div>

          {/* Right chat detail view */}
          <div className="chat-thread-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {activeConvName ? (
              <>
                <div className="chat-thread-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>{activeConvName}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Conversation history</span>
                </div>

                <div className="chat-messages-history" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '1rem', marginBottom: '1.5rem' }}>
                  {currentChatMessages.map((msg, i) => {
                    const isCurrentUser = msg.sender === 'You';
                    return (
                      <div
                        key={i}
                        style={{
                          alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          background: isCurrentUser ? 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary-dark))' : '#f1f5f9',
                          color: isCurrentUser ? '#ffffff' : '#0f172a',
                          borderRadius: '16px',
                          padding: '0.75rem 1.1rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                        }}
                      >
                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{msg.content}</p>
                        <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '0.25rem' }}>{msg.time}</span>
                      </div>
                    );
                  })}
                </div>

                <form className="card-panel appointment-form" onSubmit={handleSend} noValidate style={{ marginTop: 'auto', padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                  <label htmlFor="messages-draft-textarea" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                    Reply to {activeConvName}
                  </label>
                  <textarea
                    id="messages-draft-textarea"
                    value={draft}
                    onChange={handleDraftChange}
                    onBlur={handleDraftBlur}
                    placeholder="Type your message here..."
                    aria-describedby={draftError ? 'draft-error' : 'draft-counter'}
                    aria-invalid={Boolean(draftError)}
                    className={draftError ? 'input-invalid' : draftTouched && trimmedLen >= MIN_LENGTH ? 'input-valid' : ''}
                    style={{ width: '100%', minHeight: '80px', borderRadius: '8px', padding: '0.75rem', border: '1px solid #cbd5e1', resize: 'vertical', fontSize: '0.9rem' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span id="draft-counter" className={counterClass}>{trimmedLen} / {MAX_LENGTH}</span>
                    {draftError && (
                      <span id="draft-error" className="field-error" role="alert" style={{ fontSize: '0.8rem', color: '#ef4444' }}>{draftError}</span>
                    )}
                    <button type="submit" className="button button-primary" disabled={sending} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                      {sending ? 'Sending…' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                <p>Select a chat conversation from the sidebar to view history</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
