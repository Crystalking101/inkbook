# InkBook 墨书 — GitHub Copilot Skill

## Overview
InkBook (墨书) is a Mandarin Chinese tone ear training web app with a Chinese junk journal aesthetic. Built for learners who want to go beyond flashcards, InkBook uses Azure Speech Services to score Mandarin tone pronunciation in real time and gives AI-powered coaching feedback after every attempt.

Every screen should feel like a page torn from a personal study journal set in imperial China — layered, warm, culturally rich, and feminine. Built by a learner, for learners.

**Live:** https://inkbook-three.vercel.app
**Repo:** https://github.com/Crystalking101/inkbook

---

## Tech Stack
- Next.js 14 with TypeScript
- Inline styles (no Tailwind — all styling via style props)
- Azure Speech Services — pronunciation assessment, East US, Free F0
- OpenRouter API — Llama 3.1 8B Instruct for name generation and AI coach feedback
- Web Speech API — browser-native TTS for zh-CN voice
- Vercel for deployment with CI/CD on every GitHub push
- GitHub Copilot used throughout development

---

## Design System

### Core Colors
- Background: #FFF8F0 (warm cream)
- Primary red: #8B0000 (deep red)
- Gold: #D4AF37 (imperial gold)
- Paper: #F5E8C8 (aged parchment)
- Text: #3A2A1A (dark brown)

### Dynasty Color Palettes
Each of the 5 Mandarin tones maps to a dynasty:

**Tang Dynasty — Tone 1 (flat, ā)**
- color: #E8E4B8 / deepColor: #8A7B2D
- Mood: High and level, golden, scholarly

**Han Dynasty — Tone 2 (rising, á)**
- color: #7BA888 / deepColor: #3D6B4F
- Mood: Rising energy, sage green, nature

**Ming Dynasty — Tone 3 (dipping, ǎ)**
- color: #E8654A / deepColor: #9E3520
- Mood: Dipping then rising, warm coral, dramatic

**Qing Dynasty — Tone 4 (falling, à)**
- color: #C41E1E / deepColor: #8B0000
- Mood: Sharp falling, deep crimson, commanding

**Song Dynasty — Tone 5 (neutral, a)**
- color: #D4849A / deepColor: #9C4660
- Mood: Light and quick, dusty rose, gentle

### Typography
- Headings: Playfair Display (elegant, literary)
- Chinese characters: Noto Serif SC (authentic)
- Body: Playfair Display serif
- Ransom letters: Mixed colored tiles, each letter rotated slightly

### Texture & Aesthetic
- Background: Repeating-linear-gradient lined paper (rgba(139,0,0,0.06))
- Cards: Physical paper feel with offset box shadows matching dynasty color
- Buttons: Rounded pill shapes or full-width stamped buttons
- Decorative: Ink stains, washi tape, sticky notes, SVG butterflies, hanfu girl, lantern polaroid
- Junk journal: Nothing perfectly centered — layered, rotated, personal

---

## App Structure — 12 Pages

### Screen 1 — Book Cover (`app/page.tsx`)
- Animated journal book that flips open on tap/click
- Front cover: pink gradient, fan SVG, fish lantern, flowers, INKBOOK ransom title, three hanging lanterns, wax seal, dumplings, teacup, spine chains with charms
- Back of cover (left page when open): lined cream paper, ink stains, hanfu girl SVG, 3 butterflies, 5 sticky notes (你好 加油 美丽 谢谢 好运), 墨书 tag, practice ticket 一二三四五, lantern Polaroid, washi tape strip, gold stars, 福 wax seal
- Right page when open: name generator with OpenRouter AI, routes to /learn

### Screen 2 — Learn Hub (`app/learn/page.tsx`)
- Checklist hub with ransom-style Chinese name display
- 7 module cards with dynasty colors, checkmarks via localStorage
- Progress bar showing completed modules
- Routes to all 7 learning modules

### Screen 3 — Dynasty Selector (`app/dynasty/page.tsx`)
- 5 dynasty cards mapping to tones
- Each card uses dynasty color palette
- Routes to /tones with dynasty context

### Screen 4 — Tone Introduction (`app/tones/page.tsx`)
- Animated ink brushstroke tone curve SVG
- RansomTitle component using dynasty colors
- Dynasty story, example words, cultural context
- Routes to /practice

### Screen 5 — Tone Practice (`app/practice/page.tsx`)
- MediaRecorder records audio (WebM format)
- Audio converted to WAV PCM 16bit 16kHz mono before sending to Azure
- Azure Speech Services scores pronunciation accuracy
- OpenRouter AI coach gives personalized feedback
- Progress dots, record/stop button, score display

### Screen 6 — Results (`app/results/page.tsx`)
- Animated score ring
- Dynasty-themed rank titles
- Fireworks animation for scores 85%+
- Routes back to learn hub or retry

### Modules 7-12
- `/pinyin` — Initials, Tricky Sounds, Finals with flip cards and 🔊 audio
- `/greetings` — 10 greetings with expandable cards, Got it! progress tracker
- `/numbers` — Learn tab + Number Match mini-game (8 rounds)
- `/pronouns` — Pronoun cards + sentence patterns tab
- `/verbs` — 8 verbs with expandable cards and usage tips
- `/questions` — 8 question words with quick tap bar

---

## Key Technical Patterns

### All pages must include:
```typescript
"use client";
export const dynamic = "force-dynamic";
```

### Routing pattern:
All routes pass name and english params:
```
/learn?name=美丽&english=Crystal
/dynasty?name=美丽&english=Crystal
/practice?dynasty=tang&name=美丽
/results?dynasty=tang&name=美丽&score=85
```

### Azure Speech WAV conversion:
MediaRecorder captures WebM → convert to WAV PCM 16bit 16kHz mono before sending to Azure SDK. Raw WebM returns 0% score.

### OpenRouter API headers:
```
Authorization: Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}
HTTP-Referer: https://inkbook-three.vercel.app
X-Title: InkBook
model: meta-llama/llama-3.1-8b-instruct
```

### Web Speech TTS pattern:
```typescript
function speak(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-CN";
  utter.rate = 0.75;
  const zhVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith("zh"));
  if (zhVoice) utter.voice = zhVoice;
  window.speechSynthesis.speak(utter);
}
```

---

## GitHub Copilot Rules
- Always use `"use client"` and `export const dynamic = "force-dynamic"` on every page
- Apply dynasty color palette (color + deepColor) to all components on active dynasty screens
- Never use generic blue or gray — every color must come from the design system
- All cards must have offset box shadows: `boxShadow: \`3px 4px 0 ${dynasty.color}\``
- Chinese characters must always display alongside Pinyin and English meaning
- All pages need a fixed `← Back` button at bottom left routing to the previous screen with name params preserved
- Keep all components mobile responsive — test at 375px width
- Never use Tailwind — use inline styles only
- Never use `<form>` tags — use onClick handlers
- Use Suspense wrapper with fallback on every page that uses useSearchParams
