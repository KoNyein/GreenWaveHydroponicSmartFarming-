"use client";

import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSettingsStore, useAuthStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockConversations, mockMessages, mockMemberProfiles } from "@/lib/mock-data";
import type { ChatMessage, MessageType } from "@/types/database";
import {
  Send,
  Image,
  Mic,
  MapPin,
  Search,
  Phone,
  Video,
  MoreVertical,
  Smile,
  ArrowLeft,
  MicOff,
  X,
} from "lucide-react";

export default function MessengerPage() {
  const { locale } = useSettingsStore();
  const { user } = useAuthStore();
  const tr = (key: string) => t(key, locale);

  const currentUserId = user?.id ?? "00000000-0000-0000-0000-000000000001";
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversationId]);

  const getOtherParticipant = (participants: string[]) => {
    const otherId = participants.find((p) => p !== currentUserId);
    return mockMemberProfiles.find((p) => p.id === otherId);
  };

  const filteredConversations = mockConversations.filter((conv) => {
    const other = getOtherParticipant(conv.participants);
    if (!other) return false;
    if (!searchQuery) return true;
    return other.full_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const conversationMessages = selectedConversationId
    ? messages.filter((m) => m.conversation_id === selectedConversationId)
    : [];

  const selectedConversation = mockConversations.find((c) => c.id === selectedConversationId);
  const chatPartner = selectedConversation ? getOtherParticipant(selectedConversation.participants) : null;

  const handleSendMessage = (type: MessageType = "text", content?: string) => {
    const text = content || messageText.trim();
    if (!text || !selectedConversationId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: selectedConversationId,
      sender_id: currentUserId,
      sender_name: user?.email?.split("@")[0] ?? "You",
      type,
      content: text,
      photo_url: type === "photo" ? "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400" : null,
      audio_url: type === "audio" ? "/audio/voice-note.mp3" : null,
      location: type === "location" ? { lat: 16.8661, lng: 96.1951, name: "Yangon, Myanmar" } : null,
      read: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageText("");
  };

  const handlePhotoUpload = () => {
    handleSendMessage("photo", "Shared a photo");
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      handleSendMessage("audio", "Voice message (0:05)");
    } else {
      setIsRecording(true);
    }
  };

  const handleSendLocation = () => {
    handleSendMessage("location", "Shared location");
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString();
  };

  const renderMessage = (msg: ChatMessage) => {
    const isMine = msg.sender_id === currentUserId;
    return (
      <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}>
        <div className={`max-w-[70%] ${isMine ? "order-2" : "order-1"}`}>
          <div
            className={`rounded-2xl px-4 py-2.5 ${
              isMine
                ? "bg-primary text-white rounded-br-md"
                : "bg-card-bg border border-card-border text-foreground rounded-bl-md"
            }`}
          >
            {msg.type === "text" && <p className="text-sm">{msg.content}</p>}

            {msg.type === "photo" && (
              <div>
                {msg.photo_url && (
                  <img
                    src={msg.photo_url}
                    alt={msg.content}
                    className="rounded-lg max-w-full h-auto mb-1"
                    style={{ maxHeight: 200 }}
                  />
                )}
                <p className="text-xs opacity-80">{msg.content}</p>
              </div>
            )}

            {msg.type === "audio" && (
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isMine ? "bg-white/20" : "bg-primary/10"
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isMine ? "text-white" : "text-primary"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-0.5 rounded-full ${isMine ? "bg-white/60" : "bg-primary/40"}`}
                        style={{ height: Math.random() * 16 + 4 }}
                      />
                    ))}
                  </div>
                  <p className="text-xs opacity-70 mt-1">{msg.content}</p>
                </div>
              </div>
            )}

            {msg.type === "location" && msg.location && (
              <div>
                <div className="bg-green-900/30 rounded-lg p-3 mb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{msg.location.name}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${msg.location.lat},${msg.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs underline ${isMine ? "text-white/80" : "text-primary"}`}
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
          <p className={`text-[10px] text-muted mt-1 ${isMine ? "text-right" : "text-left"}`}>
            {formatTime(msg.created_at)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">{tr("messenger.title")}</h1>
          <p className="text-muted text-sm">{tr("messenger.subtitle")}</p>
        </div>

        <div className="flex-1 flex bg-card-bg border border-card-border rounded-xl overflow-hidden min-h-0">
          {/* Conversation List */}
          <div
            className={`w-full md:w-80 border-r border-card-border flex flex-col ${
              showMobileChat ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-3 border-b border-card-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder={tr("messenger.searchMembers")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-hover-bg border border-card-border text-sm text-foreground"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-muted text-sm">
                  {tr("messenger.noConversations")}
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const other = getOtherParticipant(conv.participants);
                  if (!other) return null;
                  const isSelected = conv.id === selectedConversationId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversationId(conv.id);
                        setShowMobileChat(true);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected ? "bg-primary/10" : "hover:bg-hover-bg"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          {other.full_name.charAt(0)}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card-bg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-foreground truncate">{other.full_name}</span>
                          <span className="text-[10px] text-muted flex-shrink-0">
                            {formatDate(conv.last_message_time)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-muted truncate pr-2">{conv.last_message}</p>
                          {conv.unread_count > 0 && (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={`flex-1 flex flex-col ${
              !showMobileChat ? "hidden md:flex" : "flex"
            }`}
          >
            {!selectedConversationId ? (
              <div className="flex-1 flex items-center justify-center text-muted text-sm">
                {tr("messenger.selectConversation")}
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-card-border">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden text-muted hover:text-foreground"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {chatPartner?.full_name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card-bg" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-foreground">{chatPartner?.full_name}</h3>
                    <p className="text-xs text-green-500">{tr("messenger.online")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-hover-bg text-muted hover:text-foreground transition">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-hover-bg text-muted hover:text-foreground transition">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-hover-bg text-muted hover:text-foreground transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {conversationMessages.map((msg) => renderMessage(msg))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-card-border p-3">
                  {isRecording && (
                    <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-red-500/10 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm text-red-500 font-medium">{tr("messenger.recording")}</span>
                      <button
                        onClick={() => setIsRecording(false)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePhotoUpload}
                      className="p-2 rounded-lg hover:bg-hover-bg text-muted hover:text-primary transition"
                      title={tr("messenger.attachPhoto")}
                    >
                      <Image className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleRecording}
                      className={`p-2 rounded-lg transition ${
                        isRecording
                          ? "bg-red-500/20 text-red-500"
                          : "hover:bg-hover-bg text-muted hover:text-primary"
                      }`}
                      title={isRecording ? tr("messenger.stopRecording") : tr("messenger.audio")}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleSendLocation}
                      className="p-2 rounded-lg hover:bg-hover-bg text-muted hover:text-primary transition"
                      title={tr("messenger.sendLocation")}
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder={tr("messenger.typeMessage")}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-full bg-hover-bg border border-card-border text-sm text-foreground pr-10"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!messageText.trim()}
                      className="p-2.5 rounded-full bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
