"use client";

import React, { useState } from "react";
import { ChevronDown, Check, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface ChatHeaderProps {
  onHamburgerClick: () => void;
}

const ChatHeader = ({ onHamburgerClick }: ChatHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("ChatGPT");
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/chat" });
  };

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

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-[#212121] ">
      {/* Hamburger Menu for Mobile */}
      <button
        className="md:hidden p-2 mr-4 rounded hover:bg-white/10"
        aria-label="Open sidebar"
        onClick={onHamburgerClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Left: ChatGPT Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-3 py-2 text-white hover:bg-white/10 rounded-md  transition-colors"
        >
          <span className="font-semibold text-lg" style={{ fontSize: "18px" }}>
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

      {/* Center: Upgrade to Go Button */}
      <div className="absolute left-[60%] transform -translate-x-1/2">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#373669] border border-[#414071] text-[#DCDBF6] text-sm font-medium rounded-3xl hover:opacity-90 transition-opacity"
          onClick={() => console.log("Upgrade to Go")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.11523 3.19409C9.15589 2.15344 10.844 2.15363 11.8848 3.19409L16.8057 8.11499C17.8462 9.15575 17.8463 10.8438 16.8057 11.8845L11.8848 16.8054C10.8441 17.8461 9.156 17.846 8.11523 16.8054L3.19434 11.8845C2.15387 10.8438 2.15369 9.15564 3.19434 8.11499L8.11523 3.19409ZM7.96582 7.49976C7.78889 7.49965 7.6396 7.63263 7.61914 7.80835C7.49243 8.90693 6.87202 9.52734 5.77344 9.65405C5.59772 9.67451 5.46474 9.8238 5.46484 10.0007C5.46517 10.1777 5.59859 10.3264 5.77441 10.3464C6.85731 10.4691 7.52042 11.0831 7.61816 12.1824C7.63414 12.3623 7.78525 12.4999 7.96582 12.4998C8.14634 12.4994 8.29693 12.3613 8.3125 12.1814C8.40645 11.0979 9.06302 10.4414 10.1465 10.3474C10.3264 10.3318 10.4645 10.1813 10.4648 10.0007C10.465 9.82016 10.3273 9.66905 10.1475 9.65308C9.04822 9.55533 8.4342 8.89222 8.31152 7.80933C8.29153 7.6335 8.14276 7.50008 7.96582 7.49976Z"
              fill="#5856D6"
            />
          </svg>
          Upgrade to Go
        </button>
      </div>

      {/* Right: SMS Button and Logout Button */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
          onClick={() => console.log("SMS button clicked")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4.52148 15.1664C4.61337 14.8108 4.39951 14.4478 4.04395 14.3559C3.73281 14.2756 3.41605 14.4295 3.28027 14.7074L3.2334 14.8334C3.13026 15.2324 3.0046 15.6297 2.86133 16.0287L2.71289 16.4281C2.63179 16.6393 2.66312 16.8775 2.79688 17.06C2.93067 17.2424 3.14825 17.3443 3.37402 17.3305L3.7793 17.3002C4.62726 17.2265 5.44049 17.0856 6.23438 16.8764C6.84665 17.1788 7.50422 17.4101 8.19434 17.558C8.55329 17.6348 8.9064 17.4062 8.9834 17.0473C9.06036 16.6882 8.83177 16.3342 8.47266 16.2572C7.81451 16.1162 7.19288 15.8862 6.62305 15.5815C6.50913 15.5206 6.38084 15.4946 6.25391 15.5053L6.12793 15.5277C5.53715 15.6955 4.93256 15.819 4.30566 15.9027C4.33677 15.8053 4.36932 15.7081 4.39844 15.6098L4.52148 15.1664Z"></path>
            <path d="M15.7998 14.5365C15.5786 14.3039 15.2291 14.2666 14.9668 14.4301L14.8604 14.5131C13.9651 15.3633 12.8166 15.9809 11.5273 16.2572C11.1682 16.3342 10.9396 16.6882 11.0166 17.0473C11.0936 17.4062 11.4467 17.6348 11.8057 17.558C13.2388 17.2509 14.5314 16.5858 15.5713 15.6645L15.7754 15.477C16.0417 15.2241 16.0527 14.8028 15.7998 14.5365Z"></path>
            <path d="M2.23828 7.58927C1.97668 8.34847 1.83496 9.15958 1.83496 10.0004C1.835 10.736 1.94324 11.4483 2.14551 12.1234L2.23828 12.4106C2.35793 12.7576 2.73588 12.9421 3.08301 12.8227C3.3867 12.718 3.56625 12.4154 3.52637 12.1088L3.49512 11.977C3.2808 11.3549 3.16508 10.6908 3.16504 10.0004C3.16504 9.30977 3.28072 8.64514 3.49512 8.02286C3.61476 7.67563 3.43024 7.2968 3.08301 7.17716C2.73596 7.05778 2.35799 7.24232 2.23828 7.58927Z"></path>
            <path d="M16.917 12.8227C17.2641 12.9421 17.6421 12.7576 17.7617 12.4106C18.0233 11.6515 18.165 10.8411 18.165 10.0004C18.165 9.15958 18.0233 8.34847 17.7617 7.58927C17.642 7.24231 17.264 7.05778 16.917 7.17716C16.5698 7.2968 16.3852 7.67563 16.5049 8.02286C16.7193 8.64514 16.835 9.30977 16.835 10.0004C16.8349 10.6908 16.7192 11.3549 16.5049 11.977C16.3852 12.3242 16.5698 12.703 16.917 12.8227Z"></path>
            <path d="M8.9834 2.95255C8.90632 2.59374 8.55322 2.3651 8.19434 2.44181C6.76126 2.74892 5.46855 3.41405 4.42871 4.33536L4.22461 4.52286C3.95829 4.77577 3.94729 5.19697 4.2002 5.46329C4.42146 5.69604 4.77088 5.73328 5.0332 5.56973L5.13965 5.4877C6.03496 4.63748 7.18337 4.0189 8.47266 3.74259C8.83177 3.66563 9.06036 3.31166 8.9834 2.95255Z"></path>
            <path d="M15.5713 4.33536C14.5314 3.41405 13.2387 2.74892 11.8057 2.44181C11.4468 2.3651 11.0937 2.59374 11.0166 2.95255C10.9396 3.31166 11.1682 3.66563 11.5273 3.74259C12.7361 4.00163 13.8209 4.56095 14.6895 5.33048L14.8604 5.4877L14.9668 5.56973C15.2291 5.73327 15.5785 5.69604 15.7998 5.46329C16.0211 5.23026 16.0403 4.87903 15.8633 4.6254L15.7754 4.52286L15.5713 4.33536Z"></path>
          </svg>
        </button>
        
        {/* Logout Button */}
        {session && (
          <button
            className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;