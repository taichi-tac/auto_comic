/**
 * 文字列の正規化：すべての空白文字（全角・半角）を削除、Unicode正規化
 */
export function normalizeString(str: string): string {
  return str
    .normalize('NFC') // Unicode正規化（濁点・半濁点を統一）
    .trim() // 前後の空白を削除
    .replace(/[\s\u3000]/g, '') // 全角・半角スペース、タブ、改行などを削除
    .replace(/^["']+|["']+$/g, '') // 前後の引用符を削除
    .replace(/,+$/g, ''); // 末尾のカンマを削除
}

/**
 * デバッグ用：文字列の各文字の情報を表示
 */
export function debugString(str: string): string {
  const chars = Array.from(str);
  const charInfo = chars.map((char, i) => {
    const code = char.charCodeAt(0);
    return `[${i}]='${char}'(${code})`;
  });
  return charInfo.join(' ');
}
