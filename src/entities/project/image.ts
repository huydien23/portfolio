// Resize + JPEG-compress an image and return it as a base64 data URL, sized
// to fit comfortably inside Firestore's 1 MiB document limit.

const DEFAULT_MAX_WIDTH = 800;
const DEFAULT_QUALITY = 0.7;

export interface CompressOptions {
  /** Max width after resize. Default 800px. */
  maxWidth?: number;
  /** JPEG quality (0–1). Default 0.7. */
  quality?: number;
  /** Output MIME type. Default 'image/jpeg'. */
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export interface CompressResult {
  dataUrl: string;
  /** Original file size in bytes. */
  originalSize: number;
  /** Compressed size in bytes (approximate). */
  compressedSize: number;
  width: number;
  height: number;
}

// Base64 encodes 3 bytes into 4 chars; data URLs add ~20–50 bytes of header.
export const dataUrlByteSize = (dataUrl: string): number => {
  const idx = dataUrl.indexOf('base64,');
  const base64 = idx >= 0 ? dataUrl.slice(idx + 7) : dataUrl;
  return Math.floor((base64.length * 3) / 4);
};

export const compressImage = (
  source: File | Blob,
  options: CompressOptions = {},
): Promise<CompressResult> =>
  new Promise((resolve, reject) => {
    const { maxWidth = DEFAULT_MAX_WIDTH, quality = DEFAULT_QUALITY, mimeType = 'image/jpeg' } = options;

    const url = URL.createObjectURL(source);
    const img = new Image();

    img.onload = () => {
      try {
        const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL(mimeType, quality);
        URL.revokeObjectURL(url);

        resolve({
          dataUrl,
          originalSize: source.size,
          compressedSize: dataUrlByteSize(dataUrl),
          width: w,
          height: h,
        });
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err instanceof Error ? err : new Error('Compression failed'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image'));
    };

    img.src = url;
  });

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// Safe upper bound: leaves room for the other project fields in the same doc.
export const MAX_IMAGE_BYTES = 800 * 1024;

export const validateImageData = (
  dataUrl: string,
): { ok: true } | { ok: false; reason: string } => {
  if (!dataUrl.startsWith('data:image/')) {
    return { ok: false, reason: 'Không phải định dạng ảnh hợp lệ' };
  }
  const size = dataUrlByteSize(dataUrl);
  if (size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      reason: `Ảnh quá lớn (${formatBytes(size)}). Giới hạn ${formatBytes(MAX_IMAGE_BYTES)}`,
    };
  }
  return { ok: true };
};
