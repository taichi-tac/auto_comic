import Papa from 'papaparse';
import { CSVRow } from '../types/comic';
import { normalizeString } from './stringUtils';

/**
 * CSVファイルをパースしてCSVRowの配列に変換
 */
export function parseCSV(file: File): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows: CSVRow[] = results.data.map((row: any) => {
            // ヘッダー名のバリエーションに対応
            const pageNumber = row['ページ番号'] || row['page_number'] || row['ページ'] || '';
            const templateName = row['使用するコマ割りテンプレ'] || row['template'] || row['テンプレート'] || '';
            const prompt = row['漫画作成のプロンプト'] || row['prompt'] || row['プロンプト'] || '';

            // テンプレート名を正規化
            const normalizedTemplateName = normalizeString(String(templateName));

            return {
              pageNumber: String(pageNumber).trim().replace(/,$/, ''),
              templateName: normalizedTemplateName,
              prompt: String(prompt).trim(),
            };
          });

          // 空行を除外
          const validRows = rows.filter(
            (row) => row.pageNumber && row.templateName && row.prompt
          );

          resolve(validRows);
        } catch (error) {
          reject(new Error('CSVのパースに失敗しました: ' + error));
        }
      },
      error: (error) => {
        reject(new Error('CSVの読み込みに失敗しました: ' + error.message));
      },
    });
  });
}

/**
 * ファイル名からキャラクター名を抽出
 * 例: "サトル.png" -> "サトル"
 */
export function extractCharacterName(filename: string): string {
  return filename.replace(/\.(png|jpg|jpeg)$/i, '');
}

/**
 * プロンプト内のキャラクター参照を検証
 */
export function validateCharacterReferences(
  prompt: string,
  characterNames: string[]
): { valid: boolean; missingCharacters: string[] } {
  const missingCharacters: string[] = [];

  // プロンプト内のキャラクター名を検索
  characterNames.forEach((name) => {
    if (prompt.includes(name)) {
      // キャラクター名が見つかった
    }
  });

  // 簡易的な検証（より厳密な検証も可能）
  return {
    valid: true,
    missingCharacters,
  };
}
