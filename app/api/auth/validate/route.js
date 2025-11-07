import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();

    const accessPassword = process.env.ACCESS_PASSWORD;

    if (!accessPassword) {
      return NextResponse.json(
        { valid: false, message: '服务器未配置访问密码' },
        { status: 400 }
      );
    }

    if (password === accessPassword) {
      return NextResponse.json({ valid: true, message: '密码验证成功' });
    }

    return NextResponse.json(
      { valid: false, message: '密码错误' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { valid: false, message: '验证失败' },
      { status: 500 }
    );
  }
}
