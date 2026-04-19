/**
 * auto-translate.mjs
 * Chạy lệnh: npm run translate
 *
 * Script này:
 * 1. Đọc file vi.json (nguồn gốc tiếng Việt)
 * 2. Đọc file en.json (bản tiếng Anh hiện có)
 * 3. Tìm tất cả KEY có trong vi.json nhưng CHƯA CÓ hoặc TRỐNG trong en.json
 * 4. Gọi Google Translate để dịch từng chuỗi tiếng Việt sang tiếng Anh
 * 5. Ghi kết quả mới vào en.json
 */

import { translate } from '@vitalets/google-translate-api';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '../src/shared/locales');
const VI_PATH = join(LOCALES_DIR, 'vi.json');
const EN_PATH = join(LOCALES_DIR, 'en.json');

// Delay để tránh bị Google chặn vì spam request quá nhanh
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Duyệt đệ quy qua object JSON để tìm tất cả các cặp key-value phẳng
function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], fullKey));
    } else {
      acc[fullKey] = obj[key];
    }
    return acc;
  }, {});
}

// Ghi giá trị vào object lồng nhau theo dotted key
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

async function main() {
  console.log('🔍 Đang đọc file ngôn ngữ...');
  const vi = JSON.parse(readFileSync(VI_PATH, 'utf-8'));
  const en = JSON.parse(readFileSync(EN_PATH, 'utf-8'));

  const flatVi = flattenObject(vi);
  const flatEn = flattenObject(en);

  // Tìm các key chưa được dịch
  const missingKeys = Object.keys(flatVi).filter(
    (key) => !flatEn[key] || flatEn[key].trim() === ''
  );

  if (missingKeys.length === 0) {
    console.log('✅ Tất cả đã được dịch! Không có gì cần cập nhật.');
    return;
  }

  console.log(`\n📝 Tìm thấy ${missingKeys.length} key chưa có bản tiếng Anh:`);
  missingKeys.forEach((k) => console.log(`   - ${k}: "${flatVi[k]}"`));
  console.log('\n🌐 Đang dịch, vui lòng chờ...\n');

  let successCount = 0;
  for (const key of missingKeys) {
    const viText = flatVi[key];
    try {
      await sleep(600); // Chờ 600ms giữa mỗi request để tránh bị chặn
      const result = await translate(viText, { from: 'vi', to: 'en' });
      setNestedValue(en, key, result.text);
      console.log(`  ✓ [${key}]`);
      console.log(`    VI: ${viText}`);
      console.log(`    EN: ${result.text}\n`);
      successCount++;
    } catch (err) {
      console.error(`  ✗ Lỗi khi dịch [${key}]: ${err.message}`);
    }
  }

  // Ghi lại file en.json
  writeFileSync(EN_PATH, JSON.stringify(en, null, 2), 'utf-8');
  console.log(`\n🎉 Hoàn tất! Đã dịch thành công ${successCount}/${missingKeys.length} key.`);
  console.log(`📄 File đã được cập nhật: src/shared/locales/en.json`);
}

main().catch(console.error);
