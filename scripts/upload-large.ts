import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DATA_DIR    = path.join(__dirname, '../server/data');
const UPLOADS_DIR = path.join(__dirname, '../server/uploads');

const largeFailed: string[] = [
  '/uploads/2025/10/DSC07751.jpg',
  '/uploads/2025/10/DSC04359.jpg',
  '/uploads/2026/03/DSC_6347.jpeg',
  '/uploads/2026/03/DSC_6348.jpeg',
];

async function compressAndUpload(uploadPath: string): Promise<string> {
  const localPath = path.join(UPLOADS_DIR, uploadPath.replace('/uploads/', ''));
  const tmpPath   = localPath + '.compressed.jpg';

  await sharp(localPath).jpeg({ quality: 75 }).toFile(tmpPath);

  const publicId = uploadPath.replace('/uploads/', 'bittersweet-lemonade/').replace(/\.[^.]+$/, '');
  const result = await cloudinary.uploader.upload(tmpPath, {
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  });

  fs.unlinkSync(tmpPath);
  return result.secure_url;
}

async function main(): Promise<void> {
  const urlMap: Record<string, string> = {};

  for (const imgPath of largeFailed) {
    process.stdout.write(`Compressing & uploading ${imgPath} ... `);
    try {
      urlMap[imgPath] = await compressAndUpload(imgPath);
      console.log('done');
    } catch (err) {
      console.log(`FAILED: ${(err as Error).message}`);
    }
  }

  const dataFiles = ['gallery.json', 'members.json', 'posts.json'];
  for (const file of dataFiles) {
    const filePath = path.join(DATA_DIR, file);
    let raw = fs.readFileSync(filePath, 'utf8');
    for (const [original, cloudUrl] of Object.entries(urlMap)) {
      raw = raw.split(original).join(cloudUrl);
    }
    fs.writeFileSync(filePath, raw, 'utf8');
  }

  console.log('\nJSON files updated.');
}

main().catch(console.error);
