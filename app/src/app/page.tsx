'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Message } from '@/components/Message';
import { ChatInput } from '@/components/ChatInput';
import { generateChatId } from '@/lib/utils';
import { Menu, User, Loader2, Hospital, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useRouter, useSearchParams } from 'next/navigation';

function ChatContent() {
  const { user, isLoggedIn, isLoading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('chatId');

  const [chatId, setChatId] = useState<string | null>(initialChatId);
  const [messages, setMessages] = useState<Array<{ text: string, type: 'sent' | 'received', timestamp: string }>>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    if (isLoggedIn && !initialChatId) {
      const newChatId = generateChatId();
      router.replace(`/?chatId=${newChatId}`);
      setChatId(newChatId);
    } else if (initialChatId) {
      setChatId(initialChatId);
    }
  }, [initialChatId, isLoggedIn, router]);

  useEffect(() => {
    if (chatId && isLoggedIn) {
      loadChatHistory(chatId);
    }
  }, [chatId, isLoggedIn]);

  const loadChatHistory = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/conversations/${id}/messages`);
      if (response.ok) {
        const history = await response.json();
        if (history.length > 0) {
          setMessages(history.map((m: any) => ({
            text: m.text,
            type: m.role === 'user' ? 'sent' : 'received',
            timestamp: new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
          })));
        } else {
          setMessages([
            {
              text: "Hi I am Sushrut, your Chief Medical Officer! How can I help you today?",
              type: 'received',
              timestamp: 'Just now'
            }
          ]);
        }
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    setMessages(prev => [...prev, { text, type: 'sent', timestamp }]);
    setIsResponding(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          userId: (user?.id || user?.user_id || 'anonymous').toString(),
          chatId: chatId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          text: data.text,
          type: 'received',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        }]);
      } else {
        setMessages(prev => [...prev, {
          text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
          type: 'received',
          timestamp: 'Just now'
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        text: "Unable to connect to the medical assistant. Please check your internet connection.",
        type: 'received',
        timestamp: 'Just now'
      }]);
    } finally {
      setIsResponding(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user?.id}/reports`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser);

        handleSendMessage(`Report uploaded: ${file.name}`);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: `I've received your report "${file.name}". I've forwarded this to our EHR Admin.`,
            type: 'received',
            timestamp: 'Just now'
          }]);
        }, 1000);
      } else {
        setModal({
          isOpen: true,
          title: 'Upload Failed',
          description: 'The medical report could not be uploaded. Please check the file format and size.',
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setModal({
        isOpen: true,
        title: 'Connection Error',
        description: 'Could not connect to the medical server for document upload.',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading || !isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden text-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Hospital size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">Sushrut AI</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Medical Assistant</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Watermark Pattern */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.04] z-0 flex flex-col gap-16 py-20 -rotate-12 scale-125">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`flex whitespace-nowrap gap-12 ${i % 2 === 0 ? 'ml-[-100px]' : 'ml-[0px]'}`}>
              {[...Array(6)].map((_, j) => (
                <span key={j} className="text-sm font-semibold uppercase text-slate-900">
                  This is AI Generated Medical advice and <br/> should be always verified with a doctor
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f8fafc]/10 relative z-10">
          <div className="max-w-3xl mx-auto py-4">
            {messages.map((msg, i) => (
              <Message key={i} {...msg} />
            ))}
            {isResponding && (
              <div className="flex justify-start mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm">🏥</div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce delay-150"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce delay-300"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            isResponding={isResponding}
          />
        </div>
      </main>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        description={modal.description}
        type={modal.type}
      />
    </div >
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}

