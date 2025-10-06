"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const ChatWindow = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

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

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#212121] text-white p-2 sm:p-4 md:p-6">
      {/* Welcome Message */}
      <div className="text-center mb-2 sm:mb-4 md:mb-6 w-full max-w-2xl -mt-35">
        <h1 className="text-xl sm:text-2xl md:text-[28px] font-normal leading-7 sm:leading-8 md:leading-[34px] tracking-[0.38px] max-w-full md:max-w-[768px] mx-auto">
          Hey, <span className="font-medium">{session?.user?.name || 'there'}</span>. Ready to dive in?
        </h1>
      </div>

      {/* Ask Anything Button with Dropdown */}
      <div className="relative w-full max-w-[768px]" ref={dropdownRef}>
        <div className="group relative flex items-center gap-4 px-3 sm:px-5 md:px-6 py-2 sm:py-3 md:py-4 bg-[#303030] border border-white/10 rounded-3xl hover:bg-white/5  w-full h-14  hover:shadow-lg hover:shadow-black/30">
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
                  router.push(
                    `/conversation?msg=${encodeURIComponent(inputValue.trim())}`
                  );
                  setInputValue("");
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
                    router.push(
                      `/conversation?msg=${encodeURIComponent(
                        inputValue.trim()
                      )}`
                    );
                    setInputValue("");
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
          <div className="absolute top-full left-0 mt-2 w-64 bg-[#2A2A2A] border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
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
  );
};

export default ChatWindow;
