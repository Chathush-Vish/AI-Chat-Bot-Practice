import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/robot.png";

function ChatInterface() {
   const [chatHistory, setChatHistory] = useState([]);
   const inputRef = useRef();
   const chatContainerRef = useRef(null);

   const handleSubmit = () => {
      const userMessage = inputRef.current.value.trim();
      if (!userMessage) return;

      inputRef.current.value = "";

      const newHistory = [
         ...chatHistory,
         { role: "user", text: userMessage },
         { role: "model", text: "Loading..." },
      ];

      setChatHistory(newHistory);
      generateBotResponse(newHistory.slice(0, -1));
   };

   const generateBotResponse = async (history) => {
      const formattedHistory = history.map(({ role, text }) => ({
         role,
         parts: [{ text }],
      }));

      const requestOptions = {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ contents: formattedHistory }),
      };

      try {
         const response = await fetch(
            import.meta.env.VITE_API_URL,
            requestOptions
         );

         if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Something went wrong");
         }

         const data = await response.json();
         const botText = data.candidates?.[0]?.content?.parts?.[0]?.text
            ?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            ?.trim();

         setChatHistory((prev) => [
            ...prev.filter((msg) => msg.text !== "Loading..."),
            {
               role: "model",
               text: botText || "Sorry, I couldn't understand that.",
            },
         ]);
      } catch (error) {
         console.error("Error generating bot response:", error.message);
         setChatHistory((prev) => [
            ...prev.filter((msg) => msg.text !== "Loading..."),
            {
               role: "model",
               text: "An error occurred. Please try again later.",
            },
         ]);
      }
   };

   const formatBotMessage = (text) => {
      if (text === "Loading...") {
         return (
            <div className="flex items-center space-x-2">
               <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                     style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                     style={{ animationDelay: "0.2s" }}
                  ></div>
               </div>
               <span className="text-gray-400">Thinking...</span>
            </div>
         );
      }

      // Format text with basic markdown-like styling
      return (
         <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
               __html: text
                  .replace(
                     /\*\*(.*?)\*\*/g,
                     '<strong class="font-semibold text-white">$1</strong>'
                  )
                  .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                  .replace(
                     /`(.*?)`/g,
                     '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
                  )
                  .replace(/\n\n/g, '</p><p class="mt-4">')
                  .replace(/\n/g, "<br>"),
            }}
         />
      );
   };

   useEffect(() => {
      if (chatContainerRef.current) {
         chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
      }
   }, [chatHistory]);

   return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
         <div className="w-full max-w-4xl h-full bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
               <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                     <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                     </svg>
                  </div>
                  <div>
                     <h1 className="text-white font-semibold">
                        DAY-2-DAY AI Assistant
                     </h1>
                     <p className="text-gray-400 text-sm">
                        Always here to help make your life easier
                     </p>
                  </div>
               </div>
            </div>

            {/* Chat Area */}
            <div
               ref={chatContainerRef}
               className="flex-1 overflow-y-auto bg-gray-900"
            >
               {/* Welcome Message */}
               <div className="border-b border-gray-700 bg-gray-800">
                  <div className="max-w-3xl mx-auto px-6 py-8">
                     <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                           <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <svg
                                 className="w-5 h-5 text-white"
                                 fill="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                           </div>
                        </div>
                        <div className="flex-1">
                           <div className="text-gray-100 leading-relaxed">
                              Hello! I'm your Day2Day AI Assistant, here to
                              support you with everyday tasks and questions.
                              Whether you're looking for quick facts, tips, or
                              guidance on general topics, I'm here to help make
                              your daily life easier.
                              <br />
                              <br />
                              <em className="text-gray-300">
                                 Please note: I'm here to provide helpful
                                 information but cannot replace professional
                                 advice in specialized fields.
                              </em>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Chat Messages */}
               {chatHistory.map((msg, index) => (
                  <div
                     key={index}
                     className={`border-b border-gray-700 ${
                        msg.role === "user" ? "bg-gray-900" : "bg-gray-800"
                     }`}
                  >
                     <div className="max-w-3xl mx-auto px-6 py-8 hide-scrollbar">
                        <div className="flex space-x-4">
                           <div className="flex-shrink-0">
                              {msg.role === "user" ? (
                                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <svg
                                       className="w-5 h-5 text-white"
                                       fill="currentColor"
                                       viewBox="0 0 24 24"
                                    >
                                       <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                 </div>
                              ) : (
                                 <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                    <svg
                                       className="w-5 h-5 text-white"
                                       fill="currentColor"
                                       viewBox="0 0 24 24"
                                    >
                                       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                 </div>
                              )}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="text-gray-100 leading-relaxed">
                                 {msg.role === "user" ? (
                                    <p>{msg.text}</p>
                                 ) : (
                                    formatBotMessage(msg.text)
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Input Area */}
            <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
               <form
                  className="max-w-3xl mx-auto"
                  onSubmit={(e) => {
                     e.preventDefault();
                     handleSubmit();
                  }}
               >
                  <div className="flex space-x-4">
                     <div className="flex-1 relative">
                        <input
                           ref={inputRef}
                           type="text"
                           className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="Ask me anything..."
                        />
                     </div>
                     <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg px-6 py-3 text-white font-medium flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                     >
                        <svg
                           className="w-5 h-5"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                           />
                        </svg>
                        <span>Send</span>
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}

export default ChatInterface;
