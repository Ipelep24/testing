import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { image } = body;

  if (!image) {
    return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        api_key: process.env.FACEPP_API_KEY!,
        api_secret: process.env.FACEPP_API_SECRET!,
        image_base64: image,
        return_attributes: 'emotion',
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: 'FER proxy failed', details: err.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'FER proxy failed', details: 'Unknown error' },
      { status: 500 }
    )
  }
}
