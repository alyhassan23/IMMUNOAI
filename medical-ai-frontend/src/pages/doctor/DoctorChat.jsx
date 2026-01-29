import React, { useState, useEffect, useRef } from "react";
import { Send, Video, User, Search } from "lucide-react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const DoctorChat = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const currentUserId = parseInt(localStorage.getItem("user_id"));

  // 1. Load Patients (Contacts)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/chat/contacts/");
        setContacts(res.data);
        if (res.data.length > 0) setSelectedContact(res.data[0]);
      } catch (e) {
        console.error("Error loading contacts", e);
      }
    };
    fetchContacts();
  }, []);

  // 2. Poll for Messages
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

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Real-time polling
    return () => clearInterval(interval);
  }, [selectedContact]);

  // Scroll to bottom
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
      const res = await api.get(`/chat/history/${selectedContact.id}/`);
      setMessages(res.data);
    } catch (e) {
      alert("Failed to send");
    }
  };

  const startVideoCall = () => {
    const ids = [currentUserId, selectedContact.id].sort();
    const roomId = `consult_${ids[0]}_${ids[1]}`; // Unique room ID
    navigate(`/video-call/${roomId}`);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Sidebar: Patient List */}
      <div className="w-1/3 border-r border-gray-100 p-4 bg-gray-50 flex flex-col">
        <h3 className="font-bold text-gray-900 mb-4 px-2">
          Active Consultations
        </h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="space-y-1 overflow-y-auto flex-1">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${selectedContact?.id === contact.id ? "bg-blue-600 text-white shadow-md" : "hover:bg-white text-gray-700"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedContact?.id === contact.id ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"}`}
              >
                {contact.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{contact.name}</p>
                <p
                  className={`text-xs truncate ${selectedContact?.id === contact.id ? "text-blue-100" : "text-gray-500"}`}
                >
                  Patient
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                  {selectedContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selectedContact.name}
                  </h3>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>{" "}
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={startVideoCall}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                <Video className="w-4 h-4 mr-2" /> Start Video Call
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
                      className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"}`}
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
                  placeholder="Write a message..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <User className="w-12 h-12 text-gray-300" />
            </div>
            <p>Select a patient to view conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;
