import { NextResponse } from 'next/server';
import { REACT_APP_API_URL } from '../../../secrets';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiResponse = await fetch(`${REACT_APP_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: data.error || 'Login failed' },
        { status: apiResponse.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
