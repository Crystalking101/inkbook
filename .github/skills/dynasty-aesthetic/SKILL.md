# InkBook Dynasty Aesthetic — GitHub Copilot Skill

## Overview
InkBook (墨书) is a Mandarin tone ear training web app with a junk journal meets Chinese dynasty aesthetic. Every screen should feel like a page torn from a personal study journal set in imperial China — layered, warm, culturally rich, and feminine.

## Design System

### Color Palettes by Dynasty
Each of the 4 Mandarin tones maps to a dynasty theme:

**Tang Dynasty — Tone 1 (flat tone, māma)**
- Primary: #F4A7B9 (peach pink)
- Secondary: #FAD4A6 (warm gold)
- Accent: #8B0000 (deep red)
- Background: #FFF8F0 (warm cream)
- Mood: Warm, floral, romantic, garden morning

**Han Dynasty — Tone 2 (rising tone, máma)**
- Primary: #8B0000 (deep crimson)
- Secondary: #D4AF37 (imperial gold)
- Accent: #1A1A1A (ink black)
- Background: #FDF0E0 (aged parchment)
- Mood: Bold, dramatic, powerful, rising energy

**Ming Dynasty — Tone 3 (dipping tone, mǎma)**
- Primary: #2D5016 (sage green)
- Secondary: #1A1A1A (ink black)
- Accent: #D4AF37 (gold)
- Background: #F5F0E8 (candlelight cream)
- Mood: Mysterious, refined, candlelit, court intrigue

**Qing Dynasty — Tone 4 (falling tone, mà)**
- Primary: #1B4B7A (royal blue)
- Secondary: #6B2D8B (imperial purple)
- Accent: #D4AF37 (gold)
- Background: #F0EEF8 (soft lavender white)
- Mood: Commanding, royal, authoritative, jewel-toned

### Typography
- Headings: Playfair Display (elegant, literary)
- Chinese characters: Noto Serif SC (authentic, beautiful)
- Body text: Plus Jakarta Sans (clean, readable)
- Accent/labels: Ransom font style — mixed sizes, cut-and-paste feeling

### Texture & Aesthetic
- Background texture: Lined paper or aged parchment feel
- Borders: Torn paper edges, irregular and organic
- Decorative elements: Ink splatters, washi tape strips, stamp marks, pressed flowers
- Cards: Look like journal pages with slight rotation and shadow
- Buttons: Stamped or wax seal aesthetic
- Icons: Brush stroke style, hand-drawn feeling

### Layout Principles
- Nothing is perfectly centered or rigidly aligned — junk journal layouts feel collected and personal
- Layer elements slightly — text over texture over background
- Use generous whitespace between sections
- Mobile first — all screens must work on 375px width and above

## Component Guidelines

### Tone Cards
Each tone card should look like a journal page spread:
- Dynasty color palette applied to background
- Tone mark displayed large (ā á ǎ à) in Playfair Display
- Chinese character displayed in Noto Serif SC
- Pinyin below the character
- Visual tone curve SVG showing pitch contour
- Cultural context card styled like a torn note or ticket stub
- Record button styled as a wax seal or ink stamp

### Chinese Name Generator Screen
- Full page background in warm cream #FFF8F0
- Input field styled like a journal entry line
- Generated Chinese name displayed large in Noto Serif SC
- Characters animate in one by one like being written with a brush
- Audio playback button styled as an ink stamp
- Welcoming message in both English and Mandarin

### Navigation
- No traditional navbar — use a journal ribbon or bookmark tab style
- Dynasty selector styled as four decorated journal tabs

## Tech Stack
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Azure Speech Services for Mandarin tone recognition and TTS
- OpenRouter LLM API for AI coaching responses
- Supabase for data storage
- Vercel for deployment
- Web Speech API for microphone recording

## Tone Training Flow
1. User selects a dynasty theme on onboarding
2. User sees tone introduction with visual curve and audio example
3. User presses record button and speaks the tone
4. Azure Speech scores the pronunciation
5. AI Tone Coach explains what went wrong and how to fix it
6. User can re-record as many times as needed
7. Score of 80+ triggers success state with dynasty-themed celebration

## Cultural Context Cards
Each tone has a drama-inspired cultural memory hook:
- Tone 1 (Tang/flat): "Like the calm voice of a Tang court lady reading poetry in the garden at dawn"
- Tone 2 (Han/rising): "Like the rising intensity of a Han empress defending her position before the emperor"
- Tone 3 (Ming/dipping): "Like the conspiratorial whisper of a Ming court official planning in candlelight"
- Tone 4 (Qing/falling): "Like the commanding decree of a Qing empress dowager ending an audience"

## Important Rules for GitHub Copilot
- Always apply the active dynasty color palette to all components on screen
- Never use generic blue or gray default colors — every color must come from the dynasty palette
- All cards must have slight box shadow and feel like physical paper objects
- Chinese characters must always display alongside Pinyin
- Every interaction should feel tactile and personal — like touching a real journal
- Keep all components mobile responsive
- Never use harsh borders — prefer soft edges, torn paper effects, or brush stroke borders