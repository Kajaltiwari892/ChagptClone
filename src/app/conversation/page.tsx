"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import Sidebar from "../chat/components/Sidebar";
import { chats } from "@/constant/dummy";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const ConversationContent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("ChatGPT");
  const [messageIdCounter, setMessageIdCounter] = useState(1);
  const hasProcessedInitialMessage = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const models = [
    {
      id: "chatgpt",
      name: "ChatGPT",
      description: "Great for everyday tasks",
      isFree: true,
    },
    {
      id: "chatgpt-go",
      name: "ChatGPT Go",
      description: "Our smartest model & more",
      isFree: false,
    },
  ];

  // Separate function for sending messages that can be called from useEffect
  const handleSendMessage = async (messageToSend: string) => {
    if (!messageToSend.trim()) return;

    const userMessage = messageToSend.trim();
    
    // Generate unique IDs using timestamp + random
    const userMsgId = Date.now();
    const loadingMsgId = Date.now() + 1;
    
    // Add user message immediately
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: userMessage,
    };
    
    // Add loading message
    const loadingMessage: Message = {
      id: loadingMsgId,
      role: "assistant",
      content: "Thinking...",
    };
    
    setMessages((prev) => [...prev, userMsg, loadingMessage]);

    try {
      // Get current messages for conversation history (excluding the loading message we just added)
      setMessages((prevMessages) => {
        const messagesForHistory = prevMessages.filter(msg => msg.id !== loadingMsgId);
        
        // Prepare conversation history
        const conversationHistory = messagesForHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Make API call
        fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            conversationHistory: conversationHistory
          }),
        })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success) {
            // Replace loading message with actual response
            setMessages((prev) => 
              prev.map((msg) => 
                msg.id === loadingMsgId 
                  ? { ...msg, content: data.message }
                  : msg
              )
            );
          } else {
            throw new Error(data.error || 'Unknown error occurred');
          }
        })
        .catch((error) => {
          console.error('Error sending message:', error);
          
          // Replace loading message with error message
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === loadingMsgId 
                ? { ...msg, content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}` }
                : msg
            )
          );
        });
        
        return prevMessages;
      });
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get("session");
    const initialMessage = searchParams.get("msg");
    
    if (sessionId) {
      const sessionChats = chats.filter(
        (chat) => chat.session_id === sessionId
      );
      const formattedMessages: Message[] = sessionChats.map((chat) => ({
        id: parseInt(chat.id.split("-")[1]), // simple id from chat id
        role: chat.role as "user" | "assistant",
        content: chat.content,
      }));
      setMessages(formattedMessages);
      setMessageIdCounter(Math.max(...formattedMessages.map(m => m.id)) + 1);
    } else if (initialMessage && !hasProcessedInitialMessage.current) {
      // Handle initial message from URL parameter (only once)
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: "Hello! How can I help you today?",
        },
      ]);
      setMessageIdCounter(Date.now() + 1);
      hasProcessedInitialMessage.current = true;
      
      // Automatically send the initial message
      setInputValue(initialMessage);
      setTimeout(() => {
        handleSendMessage(initialMessage);
      }, 100);
    } else if (!hasProcessedInitialMessage.current) {
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: "Hello! How can I help you today?",
        },
      ]);
      setMessageIdCounter(Date.now() + 1);
      hasProcessedInitialMessage.current = true;
    }
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const dropdownOptions = [
    { icon: "📄", text: "Document" },
    { icon: "📊", text: "Spreadsheet" },
    { icon: "🎯", text: "Presentation" },
    { icon: "📝", text: "Text" },
  ];

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const messageToSend = inputValue.trim();
    setInputValue("");
    await handleSendMessage(messageToSend);
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between w-full px-4 py-3 bg-[#212121] border-b border-white/10">
          {/* Left: ChatGPT Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <span
                className="font-semibold text-lg"
                style={{ fontSize: "18px" }}
              >
                {selectedModel}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#212121] border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-2">
                  {models.map((model) => (
                    <div
                      key={model.id}
                      className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                        selectedModel === model.name
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                      }`}
                      onClick={() => {
                        setSelectedModel(model.name);
                        setIsOpen(false);
                      }}
                    >
                      {/* Checkbox */}
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
                        {selectedModel === model.name ? (
                          <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                            <Check className="w-3 h-3 text-black" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 border border-white/40 rounded-sm" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">
                            {model.name}
                          </span>
                        </div>
                        <p className="text-white/70 text-xs mt-1">
                          {model.description}
                        </p>
                      </div>

                      {/* Upgrade Button for ChatGPT Go */}
                      {!model.isFree && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle upgrade logic here
                            console.log("Upgrade to ChatGPT Go");
                          }}
                          className="flex-shrink-0 px-3 py-1.5 bg-[#212121] border border-gray-500 text-white text-xs font-medium rounded-2xl hover:bg-[#383838] cursor-pointer transition-opacity"
                        >
                          Upgrade
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Backdrop */}
            {isOpen && (
              <div
                className="fixed inset-0 bg-black/0 z-40"
                onClick={() => setIsOpen(false)}
              />
            )}
          </div>

          {/* Right: Download and More Options */}
          <div className="flex items-center gap-2">
            <button className="p-2 flex gap-2 items-center justify-center text-white hover:bg-white/10 rounded-md transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-label=""
                className="-ms-0.5 icon"
              >
                <path d="M2.66821 12.6663V12.5003C2.66821 12.1331 2.96598 11.8353 3.33325 11.8353C3.70052 11.8353 3.99829 12.1331 3.99829 12.5003V12.6663C3.99829 13.3772 3.9992 13.8707 4.03052 14.2542C4.0612 14.6298 4.11803 14.8413 4.19849 14.9993L4.2688 15.1263C4.44511 15.4137 4.69813 15.6481 5.00024 15.8021L5.13013 15.8577C5.2739 15.9092 5.46341 15.947 5.74536 15.97C6.12888 16.0014 6.62221 16.0013 7.33325 16.0013H12.6663C13.3771 16.0013 13.8707 16.0014 14.2542 15.97C14.6295 15.9394 14.8413 15.8825 14.9993 15.8021L15.1262 15.7308C15.4136 15.5545 15.6481 15.3014 15.802 14.9993L15.8577 14.8695C15.9091 14.7257 15.9469 14.536 15.97 14.2542C16.0013 13.8707 16.0012 13.3772 16.0012 12.6663V12.5003C16.0012 12.1332 16.2991 11.8355 16.6663 11.8353C17.0335 11.8353 17.3313 12.1331 17.3313 12.5003V12.6663C17.3313 13.3553 17.3319 13.9124 17.2952 14.3626C17.2624 14.7636 17.1974 15.1247 17.053 15.4613L16.9866 15.6038C16.7211 16.1248 16.3172 16.5605 15.8215 16.8646L15.6038 16.9866C15.227 17.1786 14.8206 17.2578 14.3625 17.2952C13.9123 17.332 13.3553 17.3314 12.6663 17.3314H7.33325C6.64416 17.3314 6.0872 17.332 5.63696 17.2952C5.23642 17.2625 4.87552 17.1982 4.53931 17.054L4.39673 16.9866C3.87561 16.7211 3.43911 16.3174 3.13501 15.8216L3.01294 15.6038C2.82097 15.2271 2.74177 14.8206 2.70435 14.3626C2.66758 13.9124 2.66821 13.3553 2.66821 12.6663ZM9.33521 12.5003V4.9388L7.13696 7.13704C6.87732 7.39668 6.45625 7.39657 6.19653 7.13704C5.93684 6.87734 5.93684 6.45631 6.19653 6.19661L9.52954 2.86263L9.6311 2.77962C9.73949 2.70742 9.86809 2.66829 10.0002 2.66829C10.1763 2.66838 10.3454 2.73819 10.47 2.86263L13.804 6.19661C14.0633 6.45628 14.0634 6.87744 13.804 7.13704C13.5443 7.39674 13.1222 7.39674 12.8625 7.13704L10.6653 4.93977V12.5003C10.6651 12.8673 10.3673 13.1652 10.0002 13.1654C9.63308 13.1654 9.33538 12.8674 9.33521 12.5003Z"></path>
              </svg>
              <p>Share</p>
            </button>
            <button className="p-2 text-white hover:bg-white/10 rounded-md transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
              >
                <path d="M15.498 8.50159C16.3254 8.50159 16.9959 9.17228 16.9961 9.99963C16.9961 10.8271 16.3256 11.4987 15.498 11.4987C14.6705 11.4987 14 10.8271 14 9.99963C14.0002 9.17228 14.6706 8.50159 15.498 8.50159Z"></path>
                <path d="M4.49805 8.50159C5.32544 8.50159 5.99689 9.17228 5.99707 9.99963C5.99707 10.8271 5.32555 11.4987 4.49805 11.4987C3.67069 11.4985 3 10.827 3 9.99963C3.00018 9.17239 3.6708 8.50176 4.49805 8.50159Z"></path>
                <path d="M10.0003 8.50159C10.8276 8.50176 11.4982 9.17239 11.4984 9.99963C11.4984 10.827 10.8277 11.4985 10.0003 11.4987C9.17283 11.4987 8.50131 10.8271 8.50131 9.99963C8.50149 9.17228 9.17294 8.50159 10.0003 8.50159Z"></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Chat Messages - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-4  bg-[#212121] text-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-2xl max-w-lg ${
                  msg.role === "user" ? "bg-[#303030] text-white" : "text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 bg-[#212121] border-t border-white/10">
          <div
            className="relative w-full max-w-[768px] mx-auto"
            ref={dropdownRef}
          >
            <div className="group relative flex items-center gap-4 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-[#303030] border border-white/10 rounded-3xl hover:bg-white/5  w-full h-14 hover:shadow-lg hover:shadow-black/30">
              {/* Left: Plus Icon */}
              <button
                onClick={toggleDropdown}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg "
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white group-hover:text-white transition-colors"
                >
                  <path d="M9.33496 16.5V10.665H3.5C3.13273 10.665 2.83496 10.3673 2.83496 10C2.83496 9.63273 3.13273 9.33496 3.5 9.33496H9.33496V3.5C9.33496 3.13273 9.63273 2.83496 10 2.83496C10.3673 2.83496 10.665 3.13273 10.665 3.5V9.33496H16.5L16.6338 9.34863C16.9369 9.41057 17.165 9.67857 17.165 10C17.165 10.3214 16.9369 10.5894 16.6338 10.6514L16.5 10.665H10.665V16.5C10.665 16.8673 10.3673 17.165 10 17.165C9.63273 17.165 9.33496 16.8673 9.33496 16.5Z"></path>
                </svg>
              </button>

              {/* Center: Input Field */}
              <div className="flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent border-none outline-none text-white/70 placeholder-white/30 text-sm sm:text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputValue.trim()) {
                      handleSend();
                    }
                  }}
                />
              </div>

              {/* Right: Send/Microphone Icon */}
              <button className="flex-shrink-0">
                {inputValue.trim() ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white/80 hover:text-white transition-colors cursor-pointer"
                    onClick={() => {
                      if (inputValue.trim()) {
                        handleSend();
                      }
                    }}
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className=" transition-colors"
                  >
                    <path d="M15.7806 10.1963C16.1326 10.3011 16.3336 10.6714 16.2288 11.0234L16.1487 11.2725C15.3429 13.6262 13.2236 15.3697 10.6644 15.6299L10.6653 16.835H12.0833L12.2171 16.8486C12.5202 16.9106 12.7484 17.1786 12.7484 17.5C12.7484 17.8214 12.5202 18.0894 12.2171 18.1514L12.0833 18.165H7.91632C7.5492 18.1649 7.25128 17.8672 7.25128 17.5C7.25128 17.1328 7.5492 16.8351 7.91632 16.835H9.33527L9.33429 15.6299C6.775 15.3697 4.6558 13.6262 3.84992 11.2725L3.76984 11.0234L3.74445 10.8906C3.71751 10.5825 3.91011 10.2879 4.21808 10.1963C4.52615 10.1047 4.84769 10.2466 4.99347 10.5195L5.04523 10.6436L5.10871 10.8418C5.8047 12.8745 7.73211 14.335 9.99933 14.335C12.3396 14.3349 14.3179 12.7789 14.9534 10.6436L15.0052 10.5195C15.151 10.2466 15.4725 10.1046 15.7806 10.1963ZM12.2513 5.41699C12.2513 4.17354 11.2437 3.16521 10.0003 3.16504C8.75675 3.16504 7.74835 4.17343 7.74835 5.41699V9.16699C7.74853 10.4104 8.75685 11.418 10.0003 11.418C11.2436 11.4178 12.2511 10.4103 12.2513 9.16699V5.41699ZM13.5814 9.16699C13.5812 11.1448 11.9781 12.7479 10.0003 12.748C8.02232 12.748 6.41845 11.1449 6.41828 9.16699V5.41699C6.41828 3.43889 8.02221 1.83496 10.0003 1.83496C11.9783 1.83514 13.5814 3.439 13.5814 5.41699V9.16699Z"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#2A2A2A] border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="p-2">
                  {dropdownOptions.map((option, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-white/80 hover:text-white"
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-normal">{option.text}</span>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 mx-3"></div>

                {/* Upload Button */}
                <div className="p-2">
                  <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-white/80 hover:text-white">
                    <span className="text-lg">📤</span>
                    <span className="text-sm font-normal">Upload file</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Text */}
        <div className="flex-shrink-0 text-center py-2 text-xs text-gray-400 bg-[#212121]">
          ChatGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </div>
      </div>
    </div>
  );
};

const ConversationPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConversationContent />
    </Suspense>
  );
};

export default ConversationPage;
