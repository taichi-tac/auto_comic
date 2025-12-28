import React, { useState } from 'react';
import { generateComicImage } from '../services/nanoBananaApi';
import './ComicGenerator.css';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

function ComicGenerator() {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3'>('16:9');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('プロンプトを入力してください');
      return;
    }

    if (!apiKey.trim()) {
      setError('APIキーを入力してください');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateComicImage({
        prompt,
        apiKey,
        aspectRatio,
        imageSize,
      });

      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt,
        timestamp: Date.now(),
      };

      setGeneratedImages([newImage, ...generatedImages]);
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="comic-generator">
      <div className="generator-card">
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="apiKey">
              Nano Banana Pro APIキー
              <span className="required">*</span>
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Google AI Studioから取得したAPIキーを入力"
              className="input-field"
              disabled={isGenerating}
            />
            <small className="help-text">
              APIキーは{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google AI Studio
              </a>
              {' '}から取得できます
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="prompt">
              コミックプロンプト
              <span className="required">*</span>
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="例: 宇宙を旅する猫の冒険物語、4コマ漫画スタイル"
              className="input-field textarea"
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <div className="options-row">
            <div className="form-group">
              <label htmlFor="aspectRatio">アスペクト比</label>
              <select
                id="aspectRatio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="input-field select"
                disabled={isGenerating}
              >
                <option value="1:1">1:1 (正方形)</option>
                <option value="16:9">16:9 (ワイド)</option>
                <option value="4:3">4:3 (標準)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="imageSize">画像サイズ</label>
              <select
                id="imageSize"
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value as any)}
                className="input-field select"
                disabled={isGenerating}
              >
                <option value="1K">1K ($0.134)</option>
                <option value="2K">2K ($0.134)</option>
                <option value="4K">4K ($0.24)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`generate-button ${isGenerating ? 'generating' : ''}`}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                生成中...
              </>
            ) : (
              '🎨 コミック画像を生成'
            )}
          </button>
        </div>
      </div>

      {generatedImages.length > 0 && (
        <div className="results-section">
          <h2>生成された画像</h2>
          <div className="images-grid">
            {generatedImages.map((image) => (
              <div key={image.timestamp} className="image-card">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="generated-image"
                />
                <div className="image-info">
                  <p className="image-prompt">{image.prompt}</p>
                  <p className="image-timestamp">
                    {new Date(image.timestamp).toLocaleString('ja-JP')}
                  </p>
                  <a
                    href={image.url}
                    download={`comic-${image.timestamp}.png`}
                    className="download-button"
                  >
                    📥 ダウンロード
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ComicGenerator;
