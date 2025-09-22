import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'card' or 'banner'

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    // Создаем уникальное имя файла
    const timestamp = Date.now();
    const folder = type === 'banner' ? 'banners' : 'cards';
    const fileName = `${folder}/${timestamp}_${file.name}`;

    // Конвертируем файл в ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Загружаем файл в Cloudflare R2
    const putCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type,
    });

    await r2Client.send(putCommand);

    // Формируем публичный URL для файла
    const downloadURL = `${R2_PUBLIC_URL}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: downloadURL
    });

  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке файла' },
      { status: 500 }
    );
  }
}
