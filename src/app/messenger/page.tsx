"use client";

import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSettingsStore, useAuthStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { socialUsers } from "@/lib/social-mock-data";
import { getUserChats, getChatMessages, getChatMembers } from "@/lib/messaging-mock-data";
import { useMessagingStore } from "@/lib/messaging-store";
import type { ChatMessage, GroupChat } from "@/types/messaging";
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
  Users,
  Check,
  CheckCheck,
  Plus,
  Paperclip,
  Reply,
} from "lucide-react";

const CURRENT_USER_ID = "user-001";

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export default function MessengerPage() {
  const { locale } = useSettingsStore();
  const { user } = useAuthStore();
  const tr = (key: string) => t(key, locale);

  const { messages: storeMessages, sendMessage, markAsRead, addReaction } = useMessagingStore();

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userChats = getUserChats(CURRENT_USER_ID);
  const selectedChat = userChats.find((c) => c.id === selectedChatId);
  const chatMembers = selectedChatId ? getChatMembers(selectedChatId) : [];
  const chatMessages = selectedChatId
    ? storeMessages
        .filter((m) => m.chat_id === selectedChatId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : [];

  // Simulate typing indicator
  useEffect(() => {
    if (!selectedChatId) return;
    const members = getChatMembers(selectedChatId);
    const typingMember = members.find((m) => m.is_typing && m.user_id !== CURRENT_USER_ID);
    const timer = setTimeout(() => {
      if (typingMember) {
        setTypingUsers([typingMember.user_id]);
      } else {
        setTypingUsers([]);
      }
    }, 0);
    const clearTimer = typingMember
      ? setTimeout(() => setTypingUsers([]), 3000)
      : undefined;
    return () => {
      clearTimeout(timer);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, [selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length, selectedChatId]);

  // Mark messages as read when opening chat
  useEffect(() => {
    if (selectedChatId) {
      markAsRead(selectedChatId, CURRENT_USER_ID);
    }
  }, [selectedChatId, markAsRead]);

  const getChatDisplayName = (chat: GroupChat) => {
    if (chat.is_group) return chat.name;
    const otherMember = chatMembers.find((m) => m.user_id !== CURRENT_USER_ID);
    return otherMember?.user?.full_name || chat.name;
  };

  const getChatAvatar = (chat: GroupChat) => {
    if (chat.is_group) return null;
    const otherMember = chatMembers.find((m) => m.user_id !== CURRENT_USER_ID);
    return otherMember?.user?.avatar_url || null;
  };

  const getOnlineStatus = (chat: GroupChat) => {
    if (chat.is_group) {
      const onlineCount = chatMembers.filter((m) => m.is_online && m.user_id !== CURRENT_USER_ID).length;
      return onlineCount > 0 ? `${onlineCount} online` : "No one online";
    }
    const otherMember = chatMembers.find((m) => m.user_id !== CURRENT_USER_ID);
    return otherMember?.is_online ? "Online" : "Offline";
  };

  const isOnline = (chat: GroupChat) => {
    if (chat.is_group) return chatMembers.some((m) => m.is_online && m.user_id !== CURRENT_USER_ID);
    const otherMember = chatMembers.find((m) => m.user_id !== CURRENT_USER_ID);
    return otherMember?.is_online || false;
  };

  const filteredChats = userChats.filter((chat) => {
    if (!searchQuery) return true;
    return chat.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSend = () => {
    const text = messageText.trim();
    if (!text || !selectedChatId) return;
    sendMessage(selectedChatId, CURRENT_USER_ID, text, "text", undefined, undefined, undefined, undefined, replyTo?.id);
    setMessageText("");
    setReplyTo(null);
  };

  const handleSendMedia = (type: ChatMessage["message_type"]) => {
    if (!selectedChatId) return;
    if (type === "image") {
      sendMessage(selectedChatId, CURRENT_USER_ID, "Shared a photo", "image", "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400");
    } else if (type === "audio") {
      sendMessage(selectedChatId, CURRENT_USER_ID, "Voice message (0:05)", "audio");
    } else if (type === "location") {
      sendMessage(selectedChatId, CURRENT_USER_ID, "Shared location", "location", undefined, 16.8661, 96.1951, "GreenWave Farm");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      handleSendMedia("audio");
    } else {
      setIsRecording(true);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    addReaction(messageId, CURRENT_USER_ID, emoji);
    setShowReactionPicker(null);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getReadStatus = (msg: ChatMessage) => {
    if (msg.sender_id !== CURRENT_USER_ID) return null;
    const otherMembers = chatMembers.filter((m) => m.user_id !== CURRENT_USER_ID);
    const allRead = otherMembers.every((m) => msg.read_by.includes(m.user_id));
    if (allRead) return "read";
    return "delivered";
  };

  const getSenderName = (senderId: string) => {
    const user = socialUsers.find((u) => u.id === senderId);
    return user?.full_name || "Unknown";
  };

  const getSenderAvatar = (senderId: string) => {
    const user = socialUsers.find((u) => u.id === senderId);
    return user?.avatar_url;
  };

  const renderMessage = (msg: ChatMessage, idx: number) => {
    if (msg.is_deleted) {
      return (
        <div key={msg.id} className="flex justify-center mb-3">
          <span className="text-xs text-muted italic px-3 py-1 bg-hover-bg rounded-full">Message deleted</span>
        </div>
      );
    }

    const isMine = msg.sender_id === CURRENT_USER_ID;
    const showSender = selectedChat?.is_group && !isMine;
    const readStatus = getReadStatus(msg);
    const replyMessage = msg.reply_to_id
      ? chatMessages.find((m) => m.id === msg.reply_to_id)
      : undefined;

    return (
      <div
        key={msg.id}
        className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3 group relative`}
        onMouseLeave={() => setShowReactionPicker(null)}
      >
        {/* Avatar for group chats */}
        {showSender && (
          <div className="flex-shrink-0 mr-2">
            {getSenderAvatar(msg.sender_id) ? (
              <img src={getSenderAvatar(msg.sender_id)!} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {getSenderName(msg.sender_id).charAt(0)}
              </div>
            )}
          </div>
        )}

        <div className={`max-w-[70%] ${isMine ? "order-2" : "order-1"}`}>
          {showSender && (
            <p className="text-xs text-primary font-medium mb-0.5 ml-1">{getSenderName(msg.sender_id)}</p>
          )}

          {/* Reply preview */}
          {replyMessage && (
            <div className={`text-xs px-3 py-1.5 mb-0.5 rounded-t-lg border-l-2 border-primary ${isMine ? "bg-primary/5" : "bg-hover-bg"}`}>
              <span className="font-medium text-primary">{getSenderName(replyMessage.sender_id)}</span>
              <p className="text-muted truncate">{replyMessage.content}</p>
            </div>
          )}

          <div
            className={`rounded-2xl px-4 py-2.5 ${
              isMine
                ? "bg-primary text-white rounded-br-md"
                : "bg-card-bg border border-card-border text-foreground rounded-bl-md"
            }`}
          >
            {msg.message_type === "text" && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}

            {msg.message_type === "image" && (
              <div>
                {msg.media_url && (
                  <img src={msg.media_url} alt="" className="rounded-lg max-w-full h-auto mb-1" style={{ maxHeight: 200 }} />
                )}
                {msg.content && <p className="text-xs opacity-80">{msg.content}</p>}
              </div>
            )}

            {msg.message_type === "audio" && (
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isMine ? "bg-white/20" : "bg-primary/10"}`}>
                  <Mic className={`w-4 h-4 ${isMine ? "text-white" : "text-primary"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className={`w-0.5 rounded-full ${isMine ? "bg-white/60" : "bg-primary/40"}`} style={{ height: Math.random() * 16 + 4 }} />
                    ))}
                  </div>
                  <p className="text-xs opacity-70 mt-1">{msg.content}</p>
                </div>
              </div>
            )}

            {msg.message_type === "location" && (
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${isMine ? "text-white" : "text-primary"}`} />
                <div>
                  <span className="text-sm font-medium">{msg.location_name || "Location"}</span>
                  <a
                    href={`https://www.google.com/maps?q=${msg.location_lat},${msg.location_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-xs underline ${isMine ? "text-white/80" : "text-primary"}`}
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            )}

            {msg.message_type === "file" && (
              <div className="flex items-center gap-2">
                <Paperclip className={`w-4 h-4 ${isMine ? "text-white" : "text-primary"}`} />
                <span className="text-sm">{msg.content}</span>
              </div>
            )}

            {msg.is_edited && (
              <p className="text-[10px] opacity-50 mt-0.5">edited</p>
            )}
          </div>

          {/* Reactions on message */}
          {msg.reactions && msg.reactions.length > 0 && (
            <div className={`flex gap-0.5 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}>
              {Object.entries(
                msg.reactions.reduce<Record<string, number>>((acc, r) => {
                  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                  return acc;
                }, {})
              ).map(([emoji, count]) => (
                <span key={emoji} className="text-xs bg-hover-bg border border-card-border rounded-full px-1.5 py-0.5">
                  {emoji} {count > 1 && count}
                </span>
              ))}
            </div>
          )}

          {/* Time + Read status */}
          <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}>
            <p className="text-[10px] text-muted">{formatTime(msg.created_at)}</p>
            {readStatus === "read" && <CheckCheck className="w-3 h-3 text-blue-500" />}
            {readStatus === "delivered" && <Check className="w-3 h-3 text-muted" />}
          </div>
        </div>

        {/* Hover actions */}
        <div className={`hidden group-hover:flex items-center gap-0.5 self-center mx-1 ${isMine ? "order-1" : "order-2"}`}>
          <button
            onClick={() => setShowReactionPicker(msg.id)}
            className="p-1 rounded hover:bg-hover-bg text-muted"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setReplyTo(msg)}
            className="p-1 rounded hover:bg-hover-bg text-muted"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reaction picker */}
        {showReactionPicker === msg.id && (
          <div className={`absolute ${isMine ? "right-0" : "left-10"} -top-8 bg-card-bg border border-card-border rounded-full shadow-lg px-2 py-1 flex gap-1 z-50`}>
            {EMOJI_REACTIONS.map((emoji) => (
              <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-lg hover:scale-125 transition-transform">
                {emoji}
              </button>
            ))}
          </div>
        )}
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
          {/* Chat List */}
          <div className={`w-full md:w-80 border-r border-card-border flex flex-col ${showMobileChat ? "hidden md:flex" : "flex"}`}>
            <div className="p-3 border-b border-card-border flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder={tr("messenger.searchMembers")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-hover-bg border border-card-border text-sm text-foreground"
                />
              </div>
              <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                const members = getChatMembers(chat.id);
                const otherMember = members.find((m) => m.user_id !== CURRENT_USER_ID);
                const onlineInGroup = chat.is_group
                  ? members.filter((m) => m.is_online && m.user_id !== CURRENT_USER_ID).length
                  : 0;

                return (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChatId(chat.id);
                      setShowMobileChat(true);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isSelected ? "bg-primary/10" : "hover:bg-hover-bg"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {chat.is_group ? (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                      ) : chat.avatar_url ? (
                        <img src={chat.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          {chat.name.charAt(0)}
                        </div>
                      )}
                      {/* Online indicator */}
                      {(chat.is_group ? onlineInGroup > 0 : otherMember?.is_online) && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card-bg" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-foreground truncate">
                          {chat.name}
                          {chat.is_group && <span className="text-muted text-xs ml-1">({members.length})</span>}
                        </span>
                        <span className="text-[10px] text-muted flex-shrink-0">
                          {formatTime(chat.last_message_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-muted truncate pr-2">
                          {chat.last_message?.content || "No messages yet"}
                        </p>
                        {(chat.unread_count || 0) > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                            {chat.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!showMobileChat ? "hidden md:flex" : "flex"}`}>
            {!selectedChatId || !selectedChat ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm">{tr("messenger.selectConversation")}</p>
                <p className="text-xs mt-1">Choose a chat to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-card-border bg-card-bg">
                  <button onClick={() => setShowMobileChat(false)} className="md:hidden text-muted hover:text-foreground">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    {selectedChat.is_group ? (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                    ) : getChatAvatar(selectedChat) ? (
                      <img src={getChatAvatar(selectedChat)!} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {getChatDisplayName(selectedChat).charAt(0)}
                      </div>
                    )}
                    {isOnline(selectedChat) && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card-bg" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-foreground">{getChatDisplayName(selectedChat)}</h3>
                    <p className={`text-xs ${isOnline(selectedChat) ? "text-green-500" : "text-muted"}`}>
                      {getOnlineStatus(selectedChat)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
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
                  {chatMessages.map((msg, idx) => renderMessage(msg, idx))}

                  {/* Typing indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 ml-10">
                      <div className="bg-card-bg border border-card-border rounded-2xl px-4 py-2 rounded-bl-md">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                      <span className="text-xs text-muted">
                        {getSenderName(typingUsers[0])} is typing...
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Reply preview */}
                {replyTo && (
                  <div className="px-4 py-2 border-t border-card-border bg-hover-bg flex items-center gap-3">
                    <div className="w-1 h-8 bg-primary rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary">{getSenderName(replyTo.sender_id)}</p>
                      <p className="text-xs text-muted truncate">{replyTo.content}</p>
                    </div>
                    <button onClick={() => setReplyTo(null)} className="text-muted hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t border-card-border p-3">
                  {isRecording && (
                    <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-red-500/10 rounded-lg">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm text-red-500 font-medium">{tr("messenger.recording")}</span>
                      <button onClick={() => setIsRecording(false)} className="ml-auto text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendMedia("image")}
                      className="p-2 rounded-lg hover:bg-hover-bg text-muted hover:text-primary transition"
                      title="Photo"
                    >
                      <Image className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleRecording}
                      className={`p-2 rounded-lg transition ${isRecording ? "bg-red-500/20 text-red-500" : "hover:bg-hover-bg text-muted hover:text-primary"}`}
                      title="Voice"
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleSendMedia("location")}
                      className="p-2 rounded-lg hover:bg-hover-bg text-muted hover:text-primary transition"
                      title="Location"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-full bg-hover-bg border border-card-border text-sm text-foreground pr-10"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleSend}
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
