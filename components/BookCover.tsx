"use client";

import React, { useState } from "react";
import {
  FanSVG,
  FishLanternSVG,
  PeonyFlowerSVG,
  PlumBlossomSVG,
  CherryBlossomSVG,
  RedEnvelopeSVG,
  GoldIngotSVG,
  WaxSealSVG,
  PostageStampSVG,
  FortuneTagSVG,
} from "./SVGDecorations";
import { generateChineseName } from "@/lib/generateChineseName";

interface NameResult {
  chinese: string;
  pinyin: string;
  meaning: string;
  error?: string;
}

function BookCoverFront() {
  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden relative border-8 border-white"
      style={{
        backgroundColor: "#E8A0B8",
        boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Paper stack edge on right */}
      <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-r from-transparent to-tan-gold/30 flex flex-col">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex-1 border-b border-tan-gold/20"
            style={{
              backgroundColor: `rgba(255, 248, 240, ${0.3 + i * 0.05})`,
            }}
          />
        ))}
      </div>

      {/* Dynasty Tabs on right side */}
      <div className="absolute -right-8 top-12 flex flex-col gap-4">
        <div className="w-8 h-12 bg-tang-red rounded-r shadow-md transform rotate-3" title="Tone 4" />
        <div className="w-8 h-12 bg-tan-gold rounded-r shadow-md transform -rotate-2" title="Tone 1" />
        <div className="w-8 h-12 bg-ming-green rounded-r shadow-md transform rotate-1" title="Tone 3" />
        <div className="w-8 h-12 bg-qing-blue rounded-r shadow-md transform -rotate-1" title="Tone 2" />
        <div className="w-8 h-12 bg-tang-peach rounded-r shadow-md transform rotate-2" title="Tone 1" />
      </div>

      {/* Ribbons from top */}
      <div className="absolute -top-12 left-24 w-3 h-32 bg-tang-red shadow-md transform -rotate-6" />
      <div className="absolute -top-12 right-32 w-3 h-28 bg-tan-gold shadow-md transform rotate-3" />

      {/* String binding holes */}
      {[40, 100, 160, 220, 280].map((y) => (
        <div
          key={y}
          className="absolute left-2 w-2 h-2 rounded-full bg-black/20"
          style={{ top: `${y}px` }}
        />
      ))}

      {/* Decorative Elements */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-8">
        <div className="mt-4">
          <FanSVG />
        </div>
        <div className="relative w-full h-32 flex items-center justify-between px-4">
          <div className="absolute left-2"><PeonyFlowerSVG /></div>
          <div className="absolute right-2 top-2"><FishLanternSVG /></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-2">
            <PlumBlossomSVG />
            <CherryBlossomSVG />
          </div>
        </div>
        {[0, 1, 2].map((i) => {
          const colors = ["bg-tan-gold/70", "bg-tang-red/70", "bg-qing-blue/70"];
          const angles = [-2, 1, -1];
          return (
            <div
              key={i}
              className={`absolute w-full h-4 ${colors[i]} shadow-md`}
              style={{
                top: `${80 + i * 40}px`,
                transform: `rotate(${angles[i]}deg) skewY(-2deg)`,
                opacity: 0.85,
              }}
            />
          );
        })}
        <div className="absolute bottom-8 w-full flex justify-around px-4">
          <RedEnvelopeSVG />
          <GoldIngotSVG />
          <WaxSealSVG />
        </div>
      </div>

      {/* Bottom ransom letters */}
      <div className="absolute bottom-2 w-full px-4 flex justify-center items-end gap-2 h-20">
        <div
          className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-white font-noto-serif-sc rounded"
          style={{ backgroundColor: "#E8A0B8", border: "2px solid white", transform: "rotate(-3deg)" }}
        >墨</div>
        <div
          className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-tang-red font-noto-serif-sc rounded"
          style={{ backgroundColor: "#FFF8F0", border: "2px solid #E8A0B8", transform: "rotate(2deg)" }}
        >书</div>
        <span className="text-xl font-bold">•</span>
        {[
          { text: "I", color: "#8B0000", rot: "-5deg" },
          { text: "N", color: "#D4AF37", rot: "3deg" },
          { text: "K", color: "#E8A0B8", rot: "-2deg" },
        ].map((item, i) => (
          <div
            key={i}
            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-white rounded"
            style={{ backgroundColor: item.color, transform: `rotate(${item.rot})` }}
          >{item.text}</div>
        ))}
        <span className="text-xl font-bold">•</span>
        {[
          { text: "B", color: "#8B0000", rot: "4deg" },
          { text: "O", color: "#D4AF37", rot: "-3deg" },
          { text: "O", color: "#2D5016", rot: "2deg" },
          { text: "K", color: "#1B4B7A", rot: "-4deg" },
        ].map((item, i) => (
          <div
            key={i}
            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-white rounded"
            style={{ backgroundColor: item.color, transform: `rotate(${item.rot})` }}
          >{item.text}</div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 transform rotate-12"><PostageStampSVG /></div>
      <div className="absolute bottom-8 right-8"><FortuneTagSVG /></div>
    </div>
  );
}

function BookCoverInner() {
  const [inputName, setInputName] = useState("");
  const [generatedName, setGeneratedName] = useState<NameResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateName = async () => {
    if (!inputName.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateChineseName(inputName);
      setGeneratedName(result);
    } catch (error) {
      console.error("Error generating name:", error);
      setGeneratedName({
        chinese: "",
        pinyin: "",
        meaning: "",
        error: "Failed to generate name",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputName.trim() && !isLoading) {
      handleGenerateName();
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
      style={{
        backgroundColor: "#F5E8C8",
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(139, 0, 0, 0.03) 1px, transparent 1px),
          radial-gradient(circle at 60% 70%, rgba(139, 0, 0, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px, 100px 100px",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-9xl font-bold font-noto-serif-sc opacity-5 pointer-events-none" style={{ color: "#1A1A1A" }}>
        墨书
      </div>

      <div
        className="absolute top-0 left-0 right-0 h-12 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent)",
          borderRadius: "0 0 40px 40px / 0 0 20px 20px",
        }}
      />

      <div
        className="absolute top-8 right-8 w-16 h-16 rounded-full flex items-center justify-center text-4xl font-bold text-white font-noto-serif-sc shadow-lg transform rotate-12"
        style={{
          backgroundColor: "#8B0000",
          opacity: 0.9,
          boxShadow: "0 4px 12px rgba(139, 0, 0, 0.3)",
        }}
      >墨</div>

      <div className="relative z-10 w-full max-w-md text-center">
        <h2 className="font-playfair italic text-3xl mb-8 leading-tight" style={{ color: "#8B0000" }}>
          What is your name?
          <br />
          <span className="text-2xl">We'll write it in Mandarin.</span>
        </h2>

        <div className="mb-10">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your English name..."
            className="w-full bg-transparent border-b-4 border-tan-gold/60 py-3 px-2 text-lg font-jakarta placeholder:text-tan-gold/50 focus:outline-none focus:border-tang-peach transition-all"
            style={{ color: "#1A1A1A" }}
          />
        </div>

        <button
          onClick={handleGenerateName}
          disabled={!inputName.trim() || isLoading}
          className="px-8 py-3 mb-8 rounded-full font-bold uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-paper"
          style={{
            backgroundColor: "#8B0000",
            border: "3px solid #D4AF37",
          }}
        >
          {isLoading ? "Generating..." : "✦ Generate My Chinese Name ✦"}
        </button>

        {generatedName && !generatedName.error && (
          <div className="mt-10 pt-8 border-t-4 border-tan-gold/40 animate-fade-in-up">
            <p className="text-sm text-tan-gold/80 font-jakarta mb-3">Your Mandarin name is:</p>
            <div
              className="text-6xl font-bold font-noto-serif-sc mb-2 animate-brush-write"
              style={{
                color: "#8B0000",
                letterSpacing: "0.2em",
              }}
            >
              {generatedName.chinese}
            </div>
            <p className="text-xl italic font-jakarta mb-4" style={{ color: "#D9759F" }}>
              {generatedName.pinyin}
            </p>
            <p className="text-sm text-tan-gold/70 font-jakarta max-w-xs mx-auto leading-relaxed">
              {generatedName.meaning}
            </p>
          </div>
        )}

        {generatedName?.error && (
          <div className="mt-8 p-4 bg-red-100/50 rounded text-red-700 text-sm">
            {generatedName.error}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookCover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 28px,
            rgba(139, 0, 0, 0.1) 28px,
            rgba(139, 0, 0, 0.1) 30px
          )
        `,
        backgroundColor: "#FFF8F0",
        perspective: "1200px",
      }}
    >
      {!isOpen && (
        <div className="absolute top-8 text-center animate-fade-in-up z-20">
          <h1 className="font-playfair text-4xl font-bold tracking-widest">
            <span className="text-tang-peach">墨</span>
            <span className="text-tang-red">书</span>
            <span className="text-tan-gold ml-4">InkBook</span>
          </h1>
        </div>
      )}

      <div
        className="relative w-80 h-96 cursor-pointer rounded-lg shadow-paper-deep"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {!isOpen && <BookCoverFront />}
        {isOpen && <BookCoverInner />}
      </div>

      <div className="absolute bottom-8 text-center text-tan-gold/60 font-jakarta text-sm animate-pulse">
        <p>{isOpen ? "Click to close" : "Click the book to open"}</p>
      </div>
    </div>
  );
}
