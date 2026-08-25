import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, target = 'ar', source = 'en' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Using the Chrome Extension translation endpoint which supports POST and has better rate limits
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${source}&tl=${target}&dt=t`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `q=${encodeURIComponent(text)}`
    });
    
    if (response.status === 429) {
      return NextResponse.json({ error: 'Google Translate rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    
    if (!response.ok) {
      throw new Error(`Translation API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // This endpoint returns a simple array: ["translated text"]
    let translatedText = '';
    if (Array.isArray(data) && data.length > 0) {
      translatedText = data.join(' ');
    }

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}
