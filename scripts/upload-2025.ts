import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'dx8zth9lo',
  api_key: '851276645764454',
  api_secret: 'bK9bFQs-ykLSb8Lgw-2isrYhMcw',
});

const UPLOADS_DIR   = path.join(__dirname, '../server/uploads/2025');
const RESIZE_PATTERN = /-\d+x\d+\.|(-scaled)\./;

function getLocalFiles(): string[] {
  const results: string[] = [];
  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(entry) && !RESIZE_PATTERN.test(entry)) {
        results.push(full);
      }
    }
  }
  walk(UPLOADS_DIR);
  return results;
}

async function getExistingPublicIds(): Promise<Set<string>> {
  const existing = new Set<string>();
  let nextCursor: string | null = null;
  do {
    const opts: Record<string, unknown> = { type: 'upload', max_results: 500, prefix: 'bittersweet-lemonade/2025' };
    if (nextCursor) opts.next_cursor = nextCursor;
    const res = await cloudinary.api.resources(opts);
    for (const r of res.resources) existing.add(r.public_id as string);
    nextCursor = (res.next_cursor as string) ?? null;
  } while (nextCursor);
  return existing;
}

function toPublicId(localPath: string): string {
  const rel = path.relative(path.join(__dirname, '../server/uploads'), localPath);
  return 'bittersweet-lemonade/' + rel.replace(/\\/g, '/').replace(/\.[^.]+$/, '');
}

async function main(): Promise<void> {
  console.log('Fetching existing Cloudinary assets...');
  const existing = await getExistingPublicIds();
  console.log(`  ${existing.size} already uploaded.\n`);

  const local    = getLocalFiles();
  const toUpload = local.filter(f => !existing.has(toPublicId(f)));

  console.log(`Local originals: ${local.length}`);
  console.log(`To upload:       ${toUpload.length}\n`);

  let ok = 0, fail = 0;
  for (const file of toUpload) {
    const publicId = toPublicId(file);
    process.stdout.write(`Uploading ${path.basename(file)} ... `);
    try {
      await cloudinary.uploader.upload(file, { public_id: publicId, overwrite: false, resource_type: 'auto' });
      console.log('done');
      ok++;
    } catch (err) {
      console.log(`FAILED: ${(err as Error).message}`);
      fail++;
    }
  }

  console.log(`\nDone. ${ok} uploaded, ${fail} failed.`);
}

main().catch(console.error);
