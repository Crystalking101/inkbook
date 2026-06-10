// API utility for generating Chinese names using OpenRouter
interface ChineseNameResult {
  chinese: string;
  pinyin: string;
  meaning: string;
  error?: string;
}

export async function generateChineseName(
  englishName: string
): Promise<ChineseNameResult> {
  if (!englishName.trim()) {
    return {
      chinese: '',
      pinyin: '',
      meaning: '',
      error: 'Please enter a name',
    };
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return {
      chinese: '墨书',
      pinyin: 'mò shū',
      meaning: 'Ink Book - Using default name as API key is not configured',
      error: 'API key not configured',
    };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        'X-Title': 'InkBook - Mandarin Tone Training',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'user',
            content: `Generate a culturally appropriate Mandarin Chinese name for someone named "${englishName}". 
            
Please respond in exactly this format:
CHINESE: [two Chinese characters]
PINYIN: [pinyin with tone marks, e.g., "Zhāng Wěi"]
MEANING: [one sentence explaining the name meaning and cultural significance]

Examples:
CHINESE: 张伟
PINYIN: Zhāng Wěi
MEANING: A common name combining "Zhang" (a traditional surname) with "Wei" meaning great or powerful.

Generate the name for: ${englishName}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenRouter API error:', error);
      return {
        chinese: '',
        pinyin: '',
        meaning: '',
        error: `API Error: ${error.error?.message || 'Unknown error'}`,
      };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse the response
    const chineseMatch = content.match(/CHINESE:\s*(.+?)(?:\n|$)/);
    const pinyinMatch = content.match(/PINYIN:\s*(.+?)(?:\n|$)/);
    const meaningMatch = content.match(/MEANING:\s*(.+?)(?:\n|$)/);

    const result: ChineseNameResult = {
      chinese: chineseMatch ? chineseMatch[1].trim() : '',
      pinyin: pinyinMatch ? pinyinMatch[1].trim() : '',
      meaning: meaningMatch ? meaningMatch[1].trim() : '',
    };

    if (!result.chinese || !result.pinyin) {
      return {
        ...result,
        error: 'Failed to parse API response',
      };
    }

    return result;
  } catch (error) {
    console.error('Error generating Chinese name:', error);
    return {
      chinese: '',
      pinyin: '',
      meaning: '',
      error: error instanceof Error ? error.message : 'Failed to generate name',
    };
  }
}
