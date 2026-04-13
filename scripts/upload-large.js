const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: 'dx8zth9lo',
  api_key: '851276645764454',
  api_secret: 'bK9bFQs-ykLSb8Lgw-2isrYhMcw',
});

const DATA_DIR = path.join(__dirname, '../server/data');
const UPLOADS_DIR = path.join(__dirname, '../server/uploads');

const largeFailed = [
  '/uploads/2025/10/DSC07751.jpg',
  '/uploads/2025/10/DSC04359.jpg',
  '/uploads/2026/03/DSC_6347.jpeg',
  '/uploads/2026/03/DSC_6348.jpeg',
];

async function compressAndUpload(uploadPath) {
  const localPath = path.join(UPLOADS_DIR, uploadPath.replace('/uploads/', ''));
  const tmpPath = localPath + '.compressed.jpg';

  await sharp(localPath)
    .jpeg({ quality: 75 })
    .toFile(tmpPath);

  const publicId = uploadPath.replace('/uploads/', 'bittersweet-lemonade/').replace(/\.[^.]+$/, '');
  const result = await cloudinary.uploader.upload(tmpPath, {
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  });

  fs.unlinkSync(tmpPath);
  return result.secure_url;
}

async function main() {
  const urlMap = {};

  for (const imgPath of largeFailed) {
    process.stdout.write(`Compressing & uploading ${imgPath} ... `);
    try {
      const url = await compressAndUpload(imgPath);
      urlMap[imgPath] = url;
      console.log('done');
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
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
