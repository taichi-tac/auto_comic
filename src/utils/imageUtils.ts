/**
 * 画像をBase64エンコード
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 画像のサイズを検証（896×1200pxを推奨）
 */
export function validateImageSize(
  file: File
): Promise<{ valid: boolean; width: number; height: number; message?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;

      if (width === 896 && height === 1200) {
        resolve({ valid: true, width, height });
      } else {
        resolve({
          valid: false,
          width,
          height,
          message: `推奨サイズは896×1200pxです。現在: ${width}×${height}px`,
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        width: 0,
        height: 0,
        message: '画像の読み込みに失敗しました',
      });
    };

    img.src = url;
  });
}

/**
 * ファイル名の検証（カタカナ・漢字のみ）
 */
export function validateCharacterFileName(filename: string): {
  valid: boolean;
  message?: string;
} {
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg)$/i, '');

  // カタカナ・漢字のチェック（ひらがなはNG）
  const hasHiragana = /[\u3041-\u3096]/.test(nameWithoutExt);
  const hasKatakanaOrKanji = /[\u30A0-\u30FF\u4E00-\u9FAF]/.test(nameWithoutExt);

  if (hasHiragana) {
    return {
      valid: false,
      message: 'ファイル名にひらがなは使用できません。カタカナまたは漢字を使用してください。',
    };
  }

  if (!hasKatakanaOrKanji) {
    return {
      valid: false,
      message: 'ファイル名はカタカナまたは漢字で指定してください。',
    };
  }

  return { valid: true };
}
