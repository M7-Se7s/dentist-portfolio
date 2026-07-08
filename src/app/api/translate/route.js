import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, target = 'ar', source = 'en' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Using the free public Google Translate API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Translation API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // The API returns a nested array where the first element is an array of sentence translations.
    // data[0] looks like: [ ["translated sentence 1", "original sentence 1", ...], ["translated sentence 2", "original sentence 2", ...] ]
    let translatedText = '';
    if (data && data[0]) {
      data[0].forEach((item) => {
        if (item[0]) {
          translatedText += item[0];
        }
      });
    }

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}
