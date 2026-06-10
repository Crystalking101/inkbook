"use client";

import React, { useState } from "react";

export default function ChineseNameGenerator() {
  const [name, setName] = useState("");
  const [generatedName, setGeneratedName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to generate Chinese name
      // For now, using placeholder logic
      const mockChineseName = generateMockChineseName(name);
      setGeneratedName(mockChineseName);
    } catch (error) {
      console.error("Error generating name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim()) {
      handleGenerate();
    }
  };

  const generateMockChineseName = (englishName: string): string => {
    // Placeholder: combine first letter + random Chinese characters
    const chineseCharacters = ["墨", "书", "音", "琴", "诗", "月", "云", "风", "雨", "春"];
    const char1 = chineseCharacters[Math.floor(Math.random() * chineseCharacters.length)];
    const char2 = chineseCharacters[Math.floor(Math.random() * chineseCharacters.length)];
    return `${char1}${char2}`;
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8"
      style={{
        background: `
          linear-gradient(135deg, rgba(244, 167, 185, 0.08) 0%, rgba(250, 212, 166, 0.08) 100%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: "#FFF8F0",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Main Card Container - Journal Page Style */}
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Decorative Top Ribbon */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-1 bg-tang-gold/50 rounded-full shadow-sm"></div>
        </div>

        {/* Logo/Title - Ransom Style */}
        <div className="text-center mb-12">
          <div className="text-ransom text-2xl sm:text-3xl tracking-widest mb-2 inline-block">
            <span className="text-tang-peach">墨</span>
            <span className="text-tang-red">书</span>
            <span className="text-tang-gold ml-4">Ink</span>
            <span className="text-tang-peach">Book</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div
          className="bg-white/60 backdrop-blur-sm p-8 sm:p-10 shadow-paper border border-tang-gold/20"
          style={{
            borderRadius: "2px 8px 3px 7px",
            background: `
              linear-gradient(to bottom, transparent 0%, transparent calc(100% - 1px), rgba(212, 175, 55, 0.05) calc(100% - 1px), rgba(212, 175, 55, 0.05) 100%),
              rgba(255, 248, 240, 0.9)
            `,
          }}
        >
          {/* Headline */}
          <h1
            className="heading-playfair text-2xl sm:text-3xl md:text-4xl text-tang-gold
              mb-2 text-center leading-tight"
          >
            What's your name?
          </h1>
          <p className="text-center text-tang-gold text-sm sm:text-base mb-8 font-jakarta">
            We'll write it in Mandarin.
          </p>

          {/* Input Field - Journal Entry Style */}
          <div className="mb-8">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your English name..."
              className="w-full bg-transparent border-b-2 border-tang-gold/40
                py-4 px-0 text-lg sm:text-xl font-jakarta text-han-black
                placeholder:text-tang-gold/50 focus:outline-none focus:border-tang-peach
                focus:border-b-4 transition-all duration-200"
            />
          </div>

          {/* Generate Button - Ink Stamp Style */}
          <button
            onClick={handleGenerate}
            disabled={!name.trim() || isLoading}
            className="ink-stamp w-full py-3 sm:py-4 px-6 mb-6
              bg-gradient-to-br from-tang-red to-tang-peach
              text-white font-bold rounded-full
              shadow-paper hover:shadow-paper-deep
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {isLoading ? "Generating..." : "✦ Generate My Chinese Name ✦"}
          </button>

          {/* Generated Name Display */}
          {generatedName && (
            <div
              className="mt-10 pt-8 border-t-2 border-tang-gold/30 animate-fade-in-up"
            >
              <p className="text-center text-sm text-tang-gold/70 font-jakarta mb-3">
                Your Mandarin name is:
              </p>
              <div
                className="text-center text-6xl sm:text-7xl chinese-char
                  text-tang-peach font-noto-serif-sc mb-3
                  animate-brush-write"
              >
                {generatedName}
              </div>
              <p className="text-center text-xs text-tang-gold/60 font-jakarta">
                [pínyīn coming soon]
              </p>
            </div>
          )}
        </div>

        {/* Decorative Bottom Element */}
        <div className="flex justify-center mt-8">
          <div className="w-8 h-8 border-2 border-tang-gold/30 rounded-full flex items-center justify-center">
            <span className="text-tang-gold text-xs">✦</span>
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements - Mobile Responsive */}
      <div
        className="fixed top-12 right-8 text-6xl opacity-10 pointer-events-none
          hidden sm:block"
      >
        ✦
      </div>
      <div
        className="fixed bottom-20 left-8 text-5xl opacity-10 pointer-events-none
          hidden sm:block"
      >
        ✧
      </div>
    </div>
  );
}
