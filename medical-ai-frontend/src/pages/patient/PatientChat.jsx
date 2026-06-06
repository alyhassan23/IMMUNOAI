import React, { useState, useEffect, useRef } from "react";
import { Send, Search, Phone, Video, MoreVertical } from "lucide-react";
import { api } from "../../services/api";
import { useLocation } from "react-router-dom";

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // 1. Load Contacts (Corrected URL)
  const fetchContacts = async () => {
    try {
      // FIX: Changed from '/contacts/' to '/chat/contacts/' to match backend
      const response = await api.get("/chat/contacts/");
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Initial Load & Polling
  useEffect(() => {
    fetchContacts();

    const interval = setInterval(() => {
      fetchContacts();
      if (activeContact) {
        fetchChat(activeContact.id, false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeContact]);

  // 3. Load Chat History
  const fetchChat = async (userId, markRead = true) => {
    try {
      const response = await api.get(`/chat/${userId}/`);
      setMessages(response.data);

      if (markRead) {
        setContacts((prev) =>
          prev.map((c) => (c.id === userId ? { ...c, unread: 0 } : c)),
        );
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleContactSelect = (contact) => {
    setActiveContact(contact);
    fetchChat(contact.id, true);
    setTimeout(scrollToBottom, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeContact) return;

    const tempMsg = {
      id: Date.now(),
      content: inputMessage,
      sender: "me", // Optimistic
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, tempMsg]);
    setInputMessage("");
    scrollToBottom();

    try {
      await api.post("/chat/send/", {
        receiver_id: activeContact.id,
        content: tempMsg.content,
      });
      fetchChat(activeContact.id, false);
    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-select doctor from URL if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const doctorId = queryParams.get("doctor");
    if (doctorId && contacts.length > 0 && !activeContact) {
      const target = contacts.find((c) => c.id.toString() === doctorId);
      if (target) handleContactSelect(target);
    }
  }, [contacts, location.search]);

  return (
    <div className="h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex">
      {/* Sidebar: Contacts */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="font-bold text-lg text-gray-800 mb-4">
            Conversations
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              Loading...
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              No conversations yet.
            </div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={`w-full p-4 flex items-center gap-3 transition-all hover:bg-gray-50 border-b border-gray-50 last:border-0 ${
                  activeContact?.id === contact.id
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : "border-l-4 border-l-transparent"
                }`}
              >
                <div className="relative">
                  {contact.avatar ? (
                    <img
                      src={`http://127.0.0.1:8000${contact.avatar}`}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        activeContact?.id === contact.id
                          ? "bg-blue-200 text-blue-700"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {contact.name.charAt(0)}
                    </div>
                  )}
                  {/* Online Status (Simulated) */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <h3
                      className={`font-semibold text-sm ${activeContact?.id === contact.id ? "text-blue-900" : "text-gray-900"}`}
                    >
                      {contact.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {contact.role}
                  </p>
                </div>

                {/* UNREAD BADGE */}
                {contact.unread > 0 && (
                  <div className="w-6 h-6 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-sm animate-pulse">
                    {contact.unread}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                  {activeContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {activeContact.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-xs text-green-600 font-medium">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Send className="w-12 h-12 mb-2 opacity-20" />
                  <p>Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMyMessage = msg.sender !== activeContact.id;
                  return (
                    <div
                      key={idx}
                      className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                          isMyMessage
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p
                          className={`text-[10px] mt-1 text-right ${isMyMessage ? "text-blue-100" : "text-gray-400"}`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-gray-100 bg-white"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
            <Send className="w-16 h-16 text-blue-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Your Messages</h3>
            <p className="mt-2 text-sm">Select a contact to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
