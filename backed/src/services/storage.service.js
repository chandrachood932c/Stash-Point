import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(process.env.LOCAL_STORAGE_PATH || './storage');

export async function upload(buffer, originalName) {
  await fs.mkdir(root, { recursive: true });
  const ext = path.extname(originalName).toLowerCase();
  const key = `${crypto.randomUUID()}${ext}`;
  const target = path.join(root, key);
  await fs.writeFile(target, buffer);
  return { key, url: `${process.env.PUBLIC_FILE_BASE_URL || 'http://localhost:5000/api/files/download'}/${key}` };
}

export async function remove(key) {
  const safe = path.basename(key);
  await fs.rm(path.join(root, safe), { force: true });
}

export function absolutePath(key) { return path.join(root, path.basename(key)); }
