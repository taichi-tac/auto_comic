import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GenerateImageOptions {
  prompt: string;
  apiKey: string;
  aspectRatio?: '1:1' | '16:9' | '4:3';
  imageSize?: '1K' | '2K' | '4K';
}

/**
 * Nano Banana Pro APIを使用してコミック画像を生成
 */
export async function generateComicImage(
  options: GenerateImageOptions
): Promise<string> {
  const { prompt, apiKey, aspectRatio = '16:9', imageSize = '2K' } = options;

  try {
    // Google Generative AI クライアントを初期化
    const genAI = new GoogleGenerativeAI(apiKey);

    // Nano Banana Pro (Gemini 3 Pro Image) モデルを取得
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-image-preview',
    });

    // 画像生成リクエストを作成
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['Image'],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize,
        },
      } as any, // Nano Banana Pro APIの型定義が不完全なためanyを使用
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
      // @ts-ignore
      if (part.inlineData && part.inlineData.data) {
        // @ts-ignore
        const mimeType = part.inlineData.mimeType || 'image/png';
        // @ts-ignore
        const base64Data = part.inlineData.data;

        // Data URLとして返す
        return `data:${mimeType};base64,${base64Data}`;
      }
    }

    throw new Error('画像の生成に失敗しました：画像データが見つかりません');
  } catch (error) {
    console.error('Nano Banana Pro API エラー:', error);

    if (error instanceof Error) {
      // APIキーエラーの処理
      if (error.message.includes('API key')) {
        throw new Error('APIキーが無効です。Google AI Studioから正しいAPIキーを取得してください。');
      }

      // 課金エラーの処理
      if (error.message.includes('billing') || error.message.includes('quota')) {
        throw new Error('APIの利用制限に達しています。課金設定を確認してください。');
      }

      // その他のエラー
      throw new Error(`画像生成エラー: ${error.message}`);
    }

    throw new Error('予期しないエラーが発生しました');
  }
}
