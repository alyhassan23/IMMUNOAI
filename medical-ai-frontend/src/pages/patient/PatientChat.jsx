import React, { useState, useEffect, useRef } from "react";
import { Send, Video, User } from "lucide-react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const PatientChat = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const currentUserId = parseInt(localStorage.getItem("user_id"));

  // 1. Load Contacts on Mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/chat/contacts/");
        setContacts(res.data);
        if (res.data.length > 0) setSelectedContact(res.data[0]); // Auto-select first
      } catch (e) {
        console.error(e);
      }
    };
    fetchContacts();
  }, []);

  // 2. Poll for Messages (Every 3 seconds)
  useEffect(() => {
    if (!selectedContact) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/history/${selectedContact.id}/`);
        setMessages(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 3000); // Poll
    return () => clearInterval(interval);
  }, [selectedContact]);

  // 3. Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post("/chat/send/", {
        receiver_id: selectedContact.id,
        content: newMessage,
      });
      setNewMessage("");
      // Optimistic update: fetch immediately
      const res = await api.get(`/chat/history/${selectedContact.id}/`);
      setMessages(res.data);
    } catch (e) {
      alert("Failed to send");
    }
  };

  const startVideoCall = () => {
    // Generate a unique room ID based on the two user IDs sorted (so it's same for both)
    const ids = [currentUserId, selectedContact.id].sort();
    const roomId = `room_${ids[0]}_${ids[1]}`;
    // Send a link message automatically?
    navigate(`/video-call/${roomId}`);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-gray-100 p-4 bg-gray-50">
        <h3 className="font-bold text-gray-700 mb-4">Conversations</h3>
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${selectedContact?.id === contact.id ? "bg-blue-100 border border-blue-200" : "hover:bg-white"}`}
            >
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700">
                {contact.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">
                  {contact.name}
                </p>
                <p className="text-xs text-gray-500">{contact.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                  {selectedContact.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900">
                  {selectedContact.name}
                </h3>
              </div>
              <button
                onClick={startVideoCall}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Start Video Call"
              >
                <Video className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 bg-gray-50 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isMe = msg.sender === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"}`}
                    >
                      {msg.content}
                      <div
                        className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-200" : "text-gray-400"}`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <User className="w-16 h-16 mb-4 opacity-20" />
            <p>Select a contact to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientChat;
