import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileToBase64 } from '../utils/imageUtils';

export interface AdvancedGenerateImageOptions {
  prompt: string;
  apiKey: string;
  characterImages?: File[]; // キャラクター参照画像
  panelTemplate?: File; // コマ割りテンプレート
  aspectRatio?: '1:1' | '16:9' | '4:3' | '9:16' | '3:4';
  imageSize?: '1K' | '2K' | '4K';
}

/**
 * 高度な画像生成（キャラクター参照、コマ割りテンプレート対応）
 */
export async function generateComicImageAdvanced(
  options: AdvancedGenerateImageOptions
): Promise<string> {
  const {
    prompt,
    apiKey,
    characterImages = [],
    panelTemplate,
    aspectRatio = '16:9',
    imageSize = '2K',
  } = options;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-image-preview',
    });

    // プロンプトパーツを構築
    const parts: any[] = [{ text: prompt }];

    // キャラクター参照画像を追加
    for (const charImage of characterImages) {
      const base64Data = await fileToBase64(charImage);
      const mimeType = charImage.type;
      const base64WithoutPrefix = base64Data.split(',')[1];

      parts.push({
        inlineData: {
          mimeType,
          data: base64WithoutPrefix,
        },
      });
    }

    // コマ割りテンプレートを追加
    if (panelTemplate) {
      const base64Data = await fileToBase64(panelTemplate);
      const mimeType = panelTemplate.type;
      const base64WithoutPrefix = base64Data.split(',')[1];

      parts.push({
        inlineData: {
          mimeType,
          data: base64WithoutPrefix,
        },
      });
    }

    // 画像生成リクエスト
    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        responseModalities: ['Image'],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize,
        },
      } as any,
    } as any);

    const response = result.response;

    // 画像データを抽出
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('画像の生成に失敗しました：レスポンスが空です');
    }

    const candidate = response.candidates[0];
    if (!candidate.content || !candidate.content.parts) {
      throw new Error('画像の生成に失敗しました：コンテンツが見つかりません');
    }

    // 画像パートを探す
    for (const part of candidate.content.parts) {
      if ((part as any).inlineData && (part as any).inlineData.data) {
        const mimeType = (part as any).inlineData.mimeType || 'image/png';
        const base64Data = (part as any).inlineData.data;
        return `data:${mimeType};base64,${base64Data}`;
      }
    }

    throw new Error('画像の生成に失敗しました：画像データが見つかりません');
  } catch (error) {
    console.error('Nano Banana Pro API エラー:', error);

    if (error instanceof Error) {
      // エラーメッセージの処理
      if (error.message.includes('API key')) {
        throw new Error('APIキーが無効です');
      }
      if (error.message.includes('billing') || error.message.includes('quota')) {
        throw new Error('APIの利用制限に達しています');
      }
      if (error.message.includes('overloaded') || error.message.includes('503')) {
        throw new Error('サーバーが混雑しています。しばらく待ってから再試行してください');
      }
      if (error.message.includes('No text response')) {
        throw new Error(
          'コンテンツポリシー違反の可能性があります。プロンプトを修正してください'
        );
      }
      throw new Error(`画像生成エラー: ${error.message}`);
    }

    throw new Error('予期しないエラーが発生しました');
  }
}

/**
 * バッチ生成用のラッパー（遅延とリトライ機能付き）
 */
export async function generateWithRetry(
  options: AdvancedGenerateImageOptions,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateComicImageAdvanced(options);
    } catch (error) {
      lastError = error as Error;

      // 503エラーの場合は待機時間を長くする
      if (error instanceof Error && error.message.includes('503')) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt * 2));
      } else if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError || new Error('リトライ回数を超過しました');
}
