// // components/chatbot/ChatBot.tsx
// import React, { useState, useRef, useEffect } from "react";
// import {
//   Send,
//   X,
//   MessageCircle,
//   Loader2,
//   Sparkles,
//   MapPin,
//   Minimize2,
//   Maximize2,
//   Trash2,
// } from "lucide-react";
// import axios from "../../../api/axios";
// import { useMapStore } from "../../../store/mapstore";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
//   relevantPlaces?: any[];
//   timestamp?: Date;
// }

// const ChatBot: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: "assistant",
//       content:
//         "Xin chào! 👋 Tôi là trợ lý du lịch AI cho khu vực Phan Thiết - Mũi Né.\n\n🔍 Tìm địa điểm\n🏖️ Gợi ý resort\n🗺️ Lên hành trình\n⭐ So sánh đánh giá",
//       timestamp: new Date(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const { filteredPlaces, setSelectedPlace } = useMapStore();

//   /** 🧠 Focus input khi mở */
//   useEffect(() => {
//     if (isOpen && !isMinimized) inputRef.current?.focus();
//   }, [isOpen, isMinimized]);

//   /** 🔔 Reset unread khi mở */
//   useEffect(() => {
//     if (isOpen) setUnreadCount(0);
//   }, [isOpen]);

//   /** 🔽 Scroll khi có tin mới */
//   useEffect(() => {
//     if (!isLoading) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isLoading]);

//   /** 🆕 Unread khi nhận tin mới từ assistant */
//   useEffect(() => {
//     if (!isOpen && messages.length > 1) {
//       const last = messages[messages.length - 1];
//       if (last.role === "assistant") setUnreadCount((n) => n + 1);
//     }
//   }, [messages, isOpen]);

//   /* -------------------------------------------------------------------------- */
//   /* 📍 Chọn địa điểm từ chat                                                  */
//   /* -------------------------------------------------------------------------- */
//   const handlePlaceClick = (placeId: number) => {
//     const place = filteredPlaces.find((p) => p.id === placeId);
//     if (!place) return;
//     setSelectedPlace(place);
//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "assistant",
//         content: `✅ Đã chọn "${place.name}" trên bản đồ!`,
//         timestamp: new Date(),
//       },
//     ]);
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 🚀 Gửi tin nhắn                                                          */
//   /* -------------------------------------------------------------------------- */
//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;
//     const currentInput = input.trim();
//     const userMessage: Message = {
//       role: "user",
//       content: currentInput,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const recent = messages.slice(-10);
//       const res = await axios.post("/chat", {
//         question: currentInput,
//         conversationHistory: recent.map(({ role, content }) => ({ role, content })),
//       });

//       const data = res.data;
//       if (data.success) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content: data.data.answer,
//             relevantPlaces: data.data.relevantPlaces,
//             timestamp: new Date(),
//           },
//         ]);
//       } else throw new Error(data.message);
//     } catch (err) {
//       console.error("Chat error:", err);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "❌ Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   /** 🗑️ Xóa toàn bộ chat */
//   const handleClearChat = () => {
//     if (window.confirm("Xóa toàn bộ cuộc trò chuyện?")) {
//       setMessages([
//         {
//           role: "assistant",
//           content:
//             "Xin chào! 👋 Tôi là trợ lý du lịch AI cho khu vực Phan Thiết - Mũi Né.\n\n🔍 Tìm địa điểm\n🏖️ Gợi ý resort\n🗺️ Lên hành trình\n⭐ So sánh đánh giá",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   };

//   /** 💡 Gợi ý nhanh */
//   const quickSuggestions = [
//     { icon: "🏖️", text: "Resort gần biển", query: "Resort gần biển view đẹp" },
//   ];
//   const handleQuickSuggestion = (query: string) => {
//     setInput(query);
//     inputRef.current?.focus();
//   };

//   const formatTime = (date?: Date) =>
//     date
//       ? new Date(date).toLocaleTimeString("vi-VN", {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "";
//   return (
//     <>
//        {/* ✨ Floating Button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-24 right-5 z-[1000] group"
//           aria-label="Open chat"
//         >
//           <div className="relative">
//             {unreadCount > 0 && (
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-75"></div>
//             )}
//             <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-3.5 shadow-xl transition-all duration-300 group-hover:scale-110">
//               <MessageCircle className="w-5 h-5" />
//             </div>
//             {unreadCount > 0 && (
//               <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1 animate-bounce">
//                 {unreadCount > 9 ? "9+" : unreadCount}
//               </div>
//             )}
//             {unreadCount === 0 && (
//               <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
//                 AI
//               </div>
//             )}
//           </div>
//         </button>
//       )}

//       {/* 💬 Chat Window */}
//       {isOpen && (
//         <div
//           className="fixed bottom-24 right-5 z-[100] flex flex-col overflow-hidden rounded-xl shadow-2xl border border-gray-200 bg-white transition-all duration-300"
//           style={{
//             width: isMinimized ? "300px" : "360px",
//             height: isMinimized ? "auto" : "520px",
//           }}
//         >
//           {/* 🎨 Header */}
//           <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-2.5">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="relative">
//                   <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
//                     <Sparkles className="w-4 h-4" />
//                   </div>
//                   <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-sm">Trợ lý Du lịch AI</h3>
//                   <p className="text-[10px] text-white/90 flex items-center gap-0.5">
//                     <MapPin className="w-2.5 h-2.5" />
//                     Phan Thiết - Mũi Né
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-0.5">
//                 {messages.length > 1 && !isMinimized && (
//                   <button
//                     onClick={handleClearChat}
//                     className="hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
//                     title="Xóa"
//                   >
//                     <Trash2 className="w-3.5 h-3.5" />
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setIsMinimized(!isMinimized)}
//                   className="hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
//                   title={isMinimized ? "Mở" : "Thu"}
//                 >
//                   {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
//                 </button>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="hover:bg-white/20 rounded-full p-1.5 transition-all duration-200 hover:rotate-90"
//                   title="Đóng"
//                 >
//                   <X className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* 🗨️ Content */}
//           {!isMinimized && (
//             <>
//               <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
//                 {messages.map((msg, i) => (
//                   <div key={i} className="animate-fadeIn">
//                     <div
//                       className={`flex ${
//                         msg.role === "user" ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-[85%] rounded-xl p-2.5 shadow-sm ${
//                           msg.role === "user"
//                             ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm"
//                             : "bg-white border border-gray-200 rounded-bl-sm"
//                         }`}
//                       >
//                         <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
//                           {msg.content}
//                         </p>
//                         {msg.timestamp && (
//                           <p
//                             className={`text-[9px] mt-1 ${
//                               msg.role === "user"
//                                 ? "text-white/70 text-right"
//                                 : "text-gray-400"
//                             }`}
//                           >
//                             {formatTime(msg.timestamp)}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* 📍 Relevant places - Compact */}
//                     {msg.relevantPlaces && msg.relevantPlaces.length > 0 && (
//                       <div className="mt-2 space-y-1.5 pl-0.5">
//                         <p className="text-[10px] text-gray-600 font-semibold flex items-center gap-1">
//                           <MapPin className="w-3 h-3 text-blue-600" />
//                           Gợi ý ({msg.relevantPlaces.length})
//                         </p>
//                         <div className="space-y-1.5">
//                           {msg.relevantPlaces.slice(0, 3).map((place, idx) => (
//                             <button
//                               key={place.id}
//                               onClick={() => handlePlaceClick(place.id)}
//                               className="w-full bg-white border border-gray-200 rounded-lg p-2 hover:border-blue-400 hover:shadow-md transition-all duration-200 text-left group"
//                             >
//                               <div className="flex items-start gap-2">
//                                 <div className="relative flex-shrink-0">
//                                   {place.image ? (
//                                     <img
//                                       src={place.image}
//                                       alt={place.name}
//                                       className="w-12 h-12 rounded-md object-cover group-hover:scale-105 transition-transform"
//                                     />
//                                   ) : (
//                                     <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
//                                       <MapPin className="w-5 h-5 text-blue-500" />
//                                     </div>
//                                   )}
//                                   <div className="absolute -top-1 -left-1 w-4 h-4 bg-blue-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
//                                     {idx + 1}
//                                   </div>
//                                 </div>
//                                 <div className="flex-1 min-w-0">
//                                   <h4 className="font-bold text-[12px] text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
//                                     {place.name}
//                                   </h4>
//                                   <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
//                                     📍 {place.address}
//                                   </p>
//                                   <div className="flex items-center gap-1 mt-1">
//                                     {place.rating && (
//                                       <span className="text-[9px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-medium">
//                                         ⭐ {place.rating}
//                                       </span>
//                                     )}
//                                     <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-medium">
//                                       {place.similarity}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {isLoading && (
//                   <div className="flex justify-start animate-fadeIn">
//                     <div className="bg-white border border-gray-200 rounded-xl rounded-bl-sm p-3 shadow-sm">
//                       <div className="flex items-center gap-2">
//                         <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
//                         <div className="flex gap-1">
//                           <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
//                           <div
//                             className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"
//                             style={{ animationDelay: "150ms" }}
//                           ></div>
//                           <div
//                             className="w-1.5 h-1.5 bg-pink-600 rounded-full animate-bounce"
//                             style={{ animationDelay: "300ms" }}
//                           ></div>
//                         </div>
//                         <span className="text-[10px] text-gray-500">
//                           Đang suy nghĩ...
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* 💡 Quick Suggestions - Single column */}
//               {messages.length === 1 && (
//                 <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
//                   <p className="text-[10px] text-gray-600 font-semibold mb-1.5">
//                     💡 Gợi ý nhanh
//                   </p>
//                   <div className="space-y-1.5">
//                     {quickSuggestions.map((s, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => handleQuickSuggestion(s.query)}
//                         className="w-full text-[11px] bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 rounded-lg px-2.5 py-1.5 transition-all text-left font-medium hover:shadow-sm group"
//                       >
//                         <span className="text-sm mr-1">{s.icon}</span>
//                         <span className="text-gray-700 group-hover:text-blue-600">
//                           {s.text}
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ⌨️ Input - Compact */}
//               <div className="p-2.5 border-t border-gray-200 bg-white">
//                 <div className="flex gap-1.5">
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     placeholder="Hỏi về địa điểm..."
//                     disabled={isLoading}
//                     className={`flex-1 px-3 py-2 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all ${
//                       isLoading
//                         ? "opacity-60 cursor-not-allowed bg-gray-50"
//                         : "bg-white"
//                     }`}
//                   />
//                   <button
//                     onClick={handleSend}
//                     disabled={!input.trim() || isLoading}
//                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-all hover:shadow-md disabled:shadow-none active:scale-95"
//                     title="Gửi (Enter)"
//                   >
//                     <Send className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <p className="text-[9px] text-gray-400 mt-1.5 text-center">
//                   💡 Enter để gửi
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       <style>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(8px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.25s ease-out;
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: linear-gradient(to bottom, #3b82f6, #9333ea);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(to bottom, #2563eb, #7c3aed);
//         }
//       `}</style>
//     </>
//   );
// };

// export default ChatBot;
// components/chatbot/ChatBot.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  MessageCircle,
  Loader2,
  Sparkles,
  MapPin,
  Minimize2,
  Maximize2,
  Trash2,
} from "lucide-react";
import axios from "../../../api/axios";
import { useMapStore } from "../../../store/mapstore";

interface Message {
  role: "user" | "assistant";
  content: string;
  relevantPlaces?: any[];
  timestamp?: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Xin chào! 👋 Tôi là trợ lý du lịch AI cho khu vực Phan Thiết - Mũi Né.\n\n🔍 Tìm địa điểm\n🏖️ Gợi ý resort\n🗺️ Lên hành trình\n⭐ So sánh đánh giá",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { filteredPlaces, setSelectedPlace } = useMapStore();

  /** 🧠 Focus input khi mở */
  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  /** 🔔 Reset unread khi mở */
  useEffect(() => {
    if (isOpen) setUnreadCount(0);
  }, [isOpen]);

  /** 🔽 Scroll khi có tin mới */
  useEffect(() => {
    if (!isLoading) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /** 🆕 Unread khi nhận tin mới từ assistant */
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") setUnreadCount((n) => n + 1);
    }
  }, [messages, isOpen]);

  /* -------------------------------------------------------------------------- */
  /* 📍 Chọn địa điểm từ chat                                                  */
  /* -------------------------------------------------------------------------- */
  const handlePlaceClick = (placeId: number) => {
    const place = filteredPlaces.find((p) => p.id === placeId);
    if (!place) return;
    setSelectedPlace(place);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `✅ Đã chọn "${place.name}" trên bản đồ!`,
        timestamp: new Date(),
      },
    ]);
  };

  /* -------------------------------------------------------------------------- */
  /* 🚀 Gửi tin nhắn                                                          */
  /* -------------------------------------------------------------------------- */
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const currentInput = input.trim();
    const userMessage: Message = {
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const recent = messages.slice(-10);
      const res = await axios.post("/chat", {
        question: currentInput,
        conversationHistory: recent.map(({ role, content }) => ({ role, content })),
      });

      const data = res.data;
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.data.answer,
            relevantPlaces: data.data.relevantPlaces,
            timestamp: new Date(),
          },
        ]);
      } else throw new Error(data.message);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /** 🗑️ Xóa toàn bộ chat */
  const handleClearChat = () => {
    if (window.confirm("Xóa toàn bộ cuộc trò chuyện?")) {
      setMessages([
        {
          role: "assistant",
          content:
            "Xin chào! 👋 Tôi là trợ lý du lịch AI cho khu vực Phan Thiết - Mũi Né.\n\n🔍 Tìm địa điểm\n🏖️ Gợi ý resort\n🗺️ Lên hành trình\n⭐ So sánh đánh giá",
          timestamp: new Date(),
        },
      ]);
    }
  };

  /** 💡 Gợi ý nhanh */
  const quickSuggestions = [
    { icon: "🏖️", text: "Resort gần biển", query: "Resort gần biển view đẹp" },
  ];
  const handleQuickSuggestion = (query: string) => {
    setInput(query);
    inputRef.current?.focus();
  };

  const formatTime = (date?: Date) =>
    date
      ? new Date(date).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  return (
    <>
       {/* ✨ Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-24 sm:right-5 z-[1000] group"
          aria-label="Open chat"
        >
          <div className="relative">
            {unreadCount > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-75"></div>
            )}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-3.5 shadow-xl transition-all duration-300 group-hover:scale-110">
              <MessageCircle className="w-5 h-5" />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1 animate-bounce">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
            {unreadCount === 0 && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                AI
              </div>
            )}
          </div>
        </button>
      )}

      {/* 💬 Chat Window */}
      {isOpen && (
        <div
          className="fixed z-[1000] flex flex-col overflow-hidden rounded-xl shadow-2xl border border-gray-200 bg-white transition-all duration-300
                     bottom-2 right-2 left-2 sm:bottom-24 sm:right-5 sm:left-auto
                     max-w-[320px] sm:w-auto mx-auto sm:mx-0"
          style={{
            width: isMinimized ? "280px" : undefined,
            height: isMinimized ? "auto" : "min(480px, calc(100vh - 120px))",
          }}
        >
          {/* 🎨 Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-2 sm:p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 sm:p-1.5">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm">Trợ lý Du lịch AI</h3>
                  <p className="text-[9px] sm:text-[10px] text-white/90 flex items-center gap-0.5">
                    <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                    <span className="hidden xs:inline">Phan Thiết - </span>Mũi Né
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                {messages.length > 1 && !isMinimized && (
                  <button
                    onClick={handleClearChat}
                    className="hover:bg-white/20 rounded-full p-1 sm:p-1.5 transition-all duration-200"
                    title="Xóa"
                  >
                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/20 rounded-full p-1 sm:p-1.5 transition-all duration-200 hidden sm:flex"
                  title={isMinimized ? "Mở" : "Thu"}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 rounded-full p-1 sm:p-1.5 transition-all duration-200 hover:rotate-90"
                  title="Đóng"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 🗨️ Content */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className="animate-fadeIn">
                    <div
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl p-2 sm:p-2.5 shadow-sm ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm"
                            : "bg-white border border-gray-200 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        {msg.timestamp && (
                          <p
                            className={`text-[9px] mt-1 ${
                              msg.role === "user"
                                ? "text-white/70 text-right"
                                : "text-gray-400"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 📍 Relevant places - Compact */}
                    {msg.relevantPlaces && msg.relevantPlaces.length > 0 && (
                      <div className="mt-2 space-y-1.5 pl-0.5">
                        <p className="text-[10px] text-gray-600 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          Gợi ý 
                        </p>
                        <div className="space-y-1.5">
                          {msg.relevantPlaces.slice(0, 3).map((place, idx) => (
                            <button
                              key={place.id}
                              onClick={() => handlePlaceClick(place.id)}
                              className="w-full bg-white border border-gray-200 rounded-lg p-1.5 sm:p-2 hover:border-blue-400 hover:shadow-md transition-all duration-200 text-left group"
                            >
                              <div className="flex items-start gap-1.5 sm:gap-2">
                                <div className="relative flex-shrink-0">
                                  {place.image ? (
                                    <img
                                      src={place.image}
                                      alt={place.name}
                                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover group-hover:scale-105 transition-transform"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                    </div>
                                  )}
                                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-blue-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                                    {idx + 1}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-[11px] sm:text-[12px] text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {place.name}
                                  </h4>
                                  <p className="text-[9px] sm:text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                    📍 {place.address}
                                  </p>
                                  <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                                    {place.rating && (
                                      <span className="text-[8px] sm:text-[9px] bg-yellow-100 text-yellow-800 px-1 sm:px-1.5 py-0.5 rounded-full font-medium">
                                        ⭐ {place.rating}
                                      </span>
                                    )}
                                    <span className="text-[8px] sm:text-[9px] bg-blue-100 text-blue-800 px-1 sm:px-1.5 py-0.5 rounded-full font-medium">
                                      {place.similarity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="bg-white border border-gray-200 rounded-xl rounded-bl-sm p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-pink-600 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-gray-500">
                          Đang suy nghĩ...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 💡 Quick Suggestions - Single column */}
              {messages.length === 1 && (
                <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
                  <p className="text-[10px] text-gray-600 font-semibold mb-1.5">
                    💡 Gợi ý nhanh
                  </p>
                  <div className="space-y-1.5">
                    {quickSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickSuggestion(s.query)}
                        className="w-full text-[11px] bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 rounded-lg px-2.5 py-1.5 transition-all text-left font-medium hover:shadow-sm group"
                      >
                        <span className="text-sm mr-1">{s.icon}</span>
                        <span className="text-gray-700 group-hover:text-blue-600">
                          {s.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ⌨️ Input - Compact */}
              <div className="p-2.5 border-t border-gray-200 bg-white">
                <div className="flex gap-1.5">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Hỏi về địa điểm..."
                    disabled={isLoading}
                    className={`flex-1 px-3 py-2 text-[13px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all ${
                      isLoading
                        ? "opacity-60 cursor-not-allowed bg-gray-50"
                        : "bg-white"
                    }`}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-all hover:shadow-md disabled:shadow-none active:scale-95"
                    title="Gửi (Enter)"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[9px] text-gray-400 mt-1.5 text-center">
                  💡 Enter để gửi
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #9333ea);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </>
  );
};


export default ChatBot;
