/**
 * 画像のサイズを取得
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('画像の読み込みに失敗しました'));
    };

    img.src = url;
  });
}

/**
 * 幅と高さから最適なアスペクト比を計算
 */
export function calculateAspectRatio(
  width: number,
  height: number
): '1:1' | '16:9' | '4:3' | '9:16' | '3:4' {
  const ratio = width / height;

  // 正方形に近い（0.9～1.1）
  if (ratio >= 0.9 && ratio <= 1.1) {
    return '1:1';
  }

  // 縦長
  if (ratio < 0.9) {
    // 9:16に近い（0.5～0.6）
    if (ratio >= 0.5 && ratio <= 0.6) {
      return '9:16';
    }
    // 3:4に近い（0.7～0.8）
    return '3:4';
  }

  // 横長
  // 16:9に近い（1.7～1.9）
  if (ratio >= 1.7 && ratio <= 1.9) {
    return '16:9';
  }

  // 4:3に近い（1.2～1.4）
  return '4:3';
}

/**
 * アスペクト比の名前を取得
 */
export function getAspectRatioName(aspectRatio: string): string {
  const names: Record<string, string> = {
    '1:1': '正方形',
    '16:9': 'ワイド（横長）',
    '4:3': '標準（横長）',
    '9:16': 'ポートレート（縦長）',
    '3:4': '標準（縦長）',
  };
  return names[aspectRatio] || aspectRatio;
}
