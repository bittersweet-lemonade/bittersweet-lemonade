import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'dx8zth9lo',
  api_key: '851276645764454',
  api_secret: 'bK9bFQs-ykLSb8Lgw-2isrYhMcw',
});

const DATA_DIR    = path.join(__dirname, '../server/data');
const UPLOADS_DIR = path.join(__dirname, '../server/uploads');

const dataFiles = ['gallery.json', 'members.json', 'posts.json'];

function collectImagePaths(): string[] {
  const paths = new Set<string>();
  for (const file of dataFiles) {
    const content = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    (JSON.stringify(content).match(/\/uploads\/[^"]+/g) ?? []).forEach(p => paths.add(p));
  }
  return [...paths];
}

async function uploadImage(uploadPath: string): Promise<string | null> {
  const localPath = path.join(UPLOADS_DIR, uploadPath.replace('/uploads/', ''));
  if (!fs.existsSync(localPath)) {
    console.warn(`  MISSING: ${localPath}`);
    return null;
  }
  const publicId = uploadPath.replace('/uploads/', 'bittersweet-lemonade/').replace(/\.[^.]+$/, '');
  const result = await cloudinary.uploader.upload(localPath, {
    public_id: publicId,
    overwrite: false,
    resource_type: 'auto',
  });
  return result.secure_url;
}

async function main(): Promise<void> {
  const imagePaths = collectImagePaths();
  console.log(`Found ${imagePaths.length} unique images to upload.\n`);

  const urlMap: Record<string, string> = {};

  for (const imgPath of imagePaths) {
    process.stdout.write(`Uploading ${imgPath} ... `);
    try {
      const url = await uploadImage(imgPath);
      if (url) {
        urlMap[imgPath] = url;
        console.log('done');
      }
    } catch (err) {
      console.log(`FAILED: ${(err as Error).message}`);
    }
  }

  console.log('\nUpdating JSON files...');
  for (const file of dataFiles) {
    const filePath = path.join(DATA_DIR, file);
    let raw = fs.readFileSync(filePath, 'utf8');
    for (const [original, cloudUrl] of Object.entries(urlMap)) {
      raw = raw.split(original).join(cloudUrl);
    }
    fs.writeFileSync(filePath, raw, 'utf8');
    console.log(`  Updated ${file}`);
  }

  console.log('\nAll done!');
}

main().catch(console.error);
