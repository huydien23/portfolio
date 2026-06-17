// Re-export of project/image utilities for site content (logo upload, etc.).
export {
  compressImage,
  validateImageData,
  dataUrlByteSize,
  formatBytes,
  MAX_IMAGE_BYTES,
} from '../project/image';
export type { CompressOptions, CompressResult } from '../project/image';
