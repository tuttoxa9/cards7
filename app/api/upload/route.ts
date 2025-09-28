import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'card' or 'banner'

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    // Создаем уникальное имя файла с расширением .webp
    const timestamp = Date.now();
    const folder = type === 'banner' ? 'banners' : type === 'background' ? 'backgrounds' : type === 'carousel' ? 'carousel' : type === 'avatar' ? 'avatars' : type === 'review' ? 'reviews' : 'cards';
    const originalName = file.name.split('.')[0]; // убираем расширение
    const fileName = `${folder}/${timestamp}_${originalName}.webp`;

    // Конвертируем файл в ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    let processedBuffer: Buffer;
    let contentType = 'image/webp';

    try {
      // Проверяем, является ли файл уже WebP
      const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');

      if (isWebp) {
        // Если файл уже WebP, используем как есть (без повторной конвертации)
        console.log('Файл уже в формате WebP, пропускаем конвертацию');
        processedBuffer = Buffer.from(fileBuffer);
        contentType = 'image/webp';
      } else {
        // Конвертируем изображение в WebP с оптимизацией
        console.log(`Конвертируем ${file.type} в WebP`);
        processedBuffer = await sharp(Buffer.from(fileBuffer))
          .webp({
            quality: 85, // высокое качество
            effort: 4,   // средний уровень сжатия
            lossless: false
          })
          .toBuffer();
      }
    } catch (error) {
      console.log('Ошибка конвертации в WebP, используем оригинальный файл:', error);
      // Fallback: используем оригинальный файл если конвертация не удалась
      processedBuffer = Buffer.from(fileBuffer);
      contentType = file.type;
    }

    // Загружаем файл в Cloudflare R2
    const putCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: processedBuffer,
      ContentType: contentType,
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
