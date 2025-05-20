import React, { useState } from "react";
import logo from "../assets/robot.png";

function ChatInrerface() {
   const [message, setMessage] = useState("");
   const [allMessages, setAllMessages] = useState([]);

   const sendMessage = () => {
      if (message.trim() === "") return;

      setAllMessages((prev) => [
         ...prev,
         {
            message: message,
            user: true,
         },
      ]);

      setMessage("");
   };

   return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
         <div className="w-full max-w-4xl h-11/12 bg-white shadow rounded-xl flex flex-col overflow-hidden border border-gray-200">
            {/* header */}
            <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-800 py-5 px-8 flex items-center gap-4 text-white">
               <div className="bg-white p-2 rounded-full shadow-md">
                  <img src={logo} alt="logo" className="w-8 h-8" />
               </div>
               <div className="text-2xl font-medium">Health Care ChatBot</div>
               <div className="ml-auto text-sm px-3 py-1 bg-green-500 rounded-full">
                  Online
               </div>
            </div>
            {/* Chat Body */}

            <div className="w-full flex-grow flex flex-col p-8 overflow-y-auto bg-gray-50">
               {allMessages.map((msg, index) =>
                  msg.user ? (
                     <div key={index} className="flex justify-end mb-6">
                        <div className="bg-purple-600 text-white px-4 py-2 rounded-lg rounded-tr-none max-w-md shadow-sm">
                           {msg.message}
                        </div>
                     </div>
                  ) : (
                     <div key={index} className="flex mb-6">
                        <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg rounded-tl-none max-w-md shadow-sm">
                           {msg.message}
                        </div>
                     </div>
                  )
               )}
            </div>

            {/* Input area */}
            <form
               className="flex w-full py-6 px-8 gap-4 bg-white border-t border-gray-200"
               onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
               }}
            >
               <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Type your message here..."
                  name="message"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
               />
               <button className="bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg flex items-center justify-center text-white px-8 py-3 text-base font-medium">
                  <i className="bi bi-send mr-2"></i> Send
               </button>
            </form>
         </div>
      </div>
   );
}

export default ChatInrerface;
