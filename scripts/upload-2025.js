const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: 'dx8zth9lo',
  api_key: '851276645764454',
  api_secret: 'bK9bFQs-ykLSb8Lgw-2isrYhMcw',
});

const UPLOADS_DIR = path.join(__dirname, '../server/uploads/2025');

// Patterns that indicate a resized variant
const RESIZE_PATTERN = /-\d+x\d+\.|(-scaled)\./;

function getLocalFiles() {
  const results = [];
  function walk(dir) {
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

async function getExistingPublicIds() {
  const existing = new Set();
  let nextCursor = null;
  do {
    const opts = { type: 'upload', max_results: 500, prefix: 'bittersweet-lemonade/2025' };
    if (nextCursor) opts.next_cursor = nextCursor;
    const res = await cloudinary.api.resources(opts);
    for (const r of res.resources) existing.add(r.public_id);
    nextCursor = res.next_cursor || null;
  } while (nextCursor);
  return existing;
}

function toPublicId(localPath) {
  // server/uploads/2025/07/foo.jpg → bittersweet-lemonade/2025/07/foo
  const rel = path.relative(path.join(__dirname, '../server/uploads'), localPath);
  return 'bittersweet-lemonade/' + rel.replace(/\\/g, '/').replace(/\.[^.]+$/, '');
}

async function main() {
  console.log('Fetching existing Cloudinary assets...');
  const existing = await getExistingPublicIds();
  console.log(`  ${existing.size} already uploaded.\n`);

  const local = getLocalFiles();
  const toUpload = local.filter(f => !existing.has(toPublicId(f)));

  console.log(`Local originals: ${local.length}`);
  console.log(`To upload:       ${toUpload.length}\n`);

  let ok = 0, fail = 0;
  for (const file of toUpload) {
    const publicId = toPublicId(file);
    process.stdout.write(`Uploading ${path.basename(file)} ... `);
    try {
      await cloudinary.uploader.upload(file, {
        public_id: publicId,
        overwrite: false,
        resource_type: 'auto',
      });
      console.log('done');
      ok++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone. ${ok} uploaded, ${fail} failed.`);
}

main().catch(console.error);
