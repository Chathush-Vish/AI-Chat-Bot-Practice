import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/robot.png";

function ChatInrerface() {
   const [chatHistory, setChatHistory] = useState([]);
   const inputRef = useRef();
   const chatContainerRef = useRef(null);

   const handelSubmit = () => {
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
            ?.replace(/\*\*(.*?)\*\*/g, "")
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

   useEffect(() => {
      if (chatContainerRef.current) {
         chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
      }
   }, [chatHistory]);

   return (
      <div className="w-full h-screen bg-black flex items-center justify-center p-4">
         <div className="w-full max-w-4xl h-full bg-black flex flex-col overflow-hidden ">
            {/* Chat Area */}
            <div
               ref={chatContainerRef}
               className="w-full flex-grow flex flex-col p-8 overflow-y-auto bg-black"
            >
               <div className="flex mb-6">
                  <div className="bg-black text-gray-300 px-4 py-2 rounded-lg rounded-tl-none max-w-md shadow-sm">
                     Hello! I'm your Health Care AI Chatbot, here to support
                     your well-being. Ask me anything related to health!
                  </div>
               </div>

               {chatHistory.map((msg, index) =>
                  msg.role === "user" ? (
                     <div key={index} className="flex justify-end mb-6">
                        <div className="bg-black text-white border border-gray-500 px-4 py-2 rounded-xl rounded-tr-none max-w-md shadow-sm">
                           {msg.text}
                        </div>
                     </div>
                  ) : (
                     <div key={index} className="flex mb-6">
                        <div className="bg-black text-gray-300 px-4 py-2 rounded-lg rounded-tl-none max-w-md shadow-sm">
                           {msg.text}
                        </div>
                     </div>
                  )
               )}
            </div>

            {/* Input */}
            <form
               className="flex w-full py-6 px-8 gap-4 bg-white border-t border-gray-200"
               onSubmit={(e) => {
                  e.preventDefault();
                  handelSubmit();
               }}
            >
               <input
                  ref={inputRef}
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Type your message here..."
               />
               <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg flex items-center justify-center text-white px-8 py-3 text-base font-medium"
               >
                  <i className="bi bi-send mr-2"></i> Send
               </button>
            </form>
         </div>
      </div>
   );
}

export default ChatInrerface;
