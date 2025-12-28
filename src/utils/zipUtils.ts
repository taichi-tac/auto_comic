import JSZip from 'jszip';

/**
 * 複数の画像をZIPファイルとしてダウンロード
 */
export async function downloadImagesAsZip(
  images: Array<{ url: string; filename: string }>,
  zipFilename: string = 'comic_pages.zip'
): Promise<void> {
  const zip = new JSZip();

  // 各画像をZIPに追加
  for (const { url, filename } of images) {
    try {
      if (url.startsWith('data:')) {
        // Data URLの場合
        const base64Data = url.split(',')[1];
        zip.file(filename, base64Data, { base64: true });
      } else {
        // 通常のURLの場合
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(filename, blob);
      }
    } catch (error) {
      console.error(`Failed to add ${filename} to zip:`, error);
    }
  }

  // ZIPファイルを生成してダウンロード
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);

  const link = document.createElement('a');
  link.href = url;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
