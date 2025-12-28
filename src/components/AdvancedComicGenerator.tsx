import React, { useState } from 'react';
import { CharacterImage, PanelTemplate, GenerationTask, GenerationMode } from '../types/comic';
import { parseCSV, extractCharacterName } from '../utils/csvParser';
import { validateImageSize, validateCharacterFileName } from '../utils/imageUtils';
import { downloadImagesAsZip } from '../utils/zipUtils';
import { debugString } from '../utils/stringUtils';
import { getImageDimensions, calculateAspectRatio } from '../utils/aspectRatioUtils';
import { generateWithRetry } from '../services/advancedNanoBananaApi';
import CharacterLibrary from './CharacterLibrary';
import PanelTemplateManager from './PanelTemplateManager';
import CSVUploader from './CSVUploader';
import GenerationProgress from './GenerationProgress';
import './AdvancedComicGenerator.css';

function AdvancedComicGenerator() {
  const [apiKey, setApiKey] = useState('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('csv');

  // キャラクターライブラリ
  const [characters, setCharacters] = useState<CharacterImage[]>([]);

  // コマ割りテンプレート
  const [panelTemplates, setPanelTemplates] = useState<PanelTemplate[]>([]);

  // CSV生成タスク
  const [generationTasks, setGenerationTasks] = useState<GenerationTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // マニュアルモード
  const [manualPageNumber, setManualPageNumber] = useState('1');
  const [manualTemplateName, setManualTemplateName] = useState('');
  const [manualPrompt, setManualPrompt] = useState('');

  const [error, setError] = useState<string | null>(null);

  // キャラクター追加
  const handleAddCharacter = async (file: File) => {
    // ファイル名の検証
    const nameValidation = validateCharacterFileName(file.name);
    if (!nameValidation.valid) {
      setError(nameValidation.message || 'ファイル名が無効です');
      return;
    }

    // 画像サイズの検証
    const sizeValidation = await validateImageSize(file);
    if (!sizeValidation.valid) {
      setError(sizeValidation.message || '画像サイズが不正です');
      // 警告は出すが、処理は続行
    }

    const name = extractCharacterName(file.name);
    const preview = URL.createObjectURL(file);

    setCharacters([...characters, { name, file, preview }]);
    setError(null);
  };

  // キャラクター削除
  const handleRemoveCharacter = (index: number) => {
    URL.revokeObjectURL(characters[index].preview);
    setCharacters(characters.filter((_, i) => i !== index));
  };

  // テンプレート追加
  const handleAddTemplate = async (file: File, templateName: string) => {
    const id = `template-${Date.now()}-${Math.random()}`;
    const preview = URL.createObjectURL(file);

    try {
      // 画像サイズを取得
      const { width, height } = await getImageDimensions(file);
      const aspectRatio = calculateAspectRatio(width, height);

      console.log(`[テンプレート追加] "${templateName}" (長さ: ${templateName.length})`);
      console.log(`  文字詳細: ${debugString(templateName)}`);
      console.log(`  サイズ: ${width}×${height}, アスペクト比: ${aspectRatio}`);

      setPanelTemplates((prev) => [
        ...prev,
        { id, name: templateName, file, preview, width, height, aspectRatio },
      ]);
    } catch (error) {
      console.error('テンプレート追加エラー:', error);
      URL.revokeObjectURL(preview);
      setError('テンプレート画像の読み込みに失敗しました');
    }
  };

  // テンプレート削除
  const handleRemoveTemplate = (id: string) => {
    const template = panelTemplates.find((t) => t.id === id);
    if (template) {
      URL.revokeObjectURL(template.preview);
    }
    setPanelTemplates(panelTemplates.filter((t) => t.id !== id));
  };

  // CSVアップロード
  const handleCSVUpload = async (file: File) => {
    try {
      setError(null);
      const rows = await parseCSV(file);

      if (rows.length === 0) {
        setError('CSVファイルにデータが含まれていません');
        return;
      }

      // GenerationTaskに変換
      const tasks: GenerationTask[] = rows.map((row) => ({
        pageNumber: parseInt(row.pageNumber) || 0,
        templateName: row.templateName,
        prompt: row.prompt,
        status: 'pending',
      }));

      console.log('[CSV読み込み] タスク数:', tasks.length);
      tasks.forEach((task, i) => {
        console.log(`  タスク${i + 1}: ページ${task.pageNumber}, テンプレート="${task.templateName}" (長さ: ${task.templateName.length})`);
        console.log(`    文字詳細: ${debugString(task.templateName)}`);
      });

      setGenerationTasks(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'CSVの解析に失敗しました');
    }
  };

  // バッチ生成開始
  const handleStartBatchGeneration = async () => {
    if (!apiKey) {
      setError('APIキーを入力してください');
      return;
    }

    if (generationTasks.length === 0) {
      setError('生成するタスクがありません');
      return;
    }

    if (panelTemplates.length === 0) {
      setError('コマ割りテンプレートをアップロードしてください');
      return;
    }

    // CSV内のテンプレート名をチェック
    console.log('[バッチ生成開始] 登録済みテンプレート:', panelTemplates.map((t) => t.name));
    console.log('[バッチ生成開始] CSVのテンプレート名:', generationTasks.map((t) => t.templateName));

    const missingTemplates: string[] = [];
    const debugInfo: string[] = [];

    generationTasks.forEach((task) => {
      const template = panelTemplates.find((t) => t.name === task.templateName);
      console.log(`  チェック: CSV="${task.templateName}" → 見つかった:`, !!template);
      if (!template && !missingTemplates.includes(task.templateName)) {
        missingTemplates.push(task.templateName);
        debugInfo.push(`"${task.templateName}" (長さ: ${task.templateName.length})`);
      }
    });

    if (missingTemplates.length > 0) {
      const availableTemplates = panelTemplates.map((t) => `"${t.name}" (長さ: ${t.name.length})`).join(', ');
      setError(
        `以下のテンプレートが見つかりません:\n${debugInfo.join('\n')}\n\n` +
        `登録済みテンプレート:\n${availableTemplates || 'なし'}\n\n` +
        `※ファイル名の拡張子(.png, .jpg)を除いた名前と完全一致する必要があります`
      );
      return;
    }

    setIsGenerating(true);
    setError(null);

    for (let i = 0; i < generationTasks.length; i++) {
      const task = generationTasks[i];

      // ステータスを更新
      setGenerationTasks((prev) =>
        prev.map((t, idx) => (idx === i ? { ...t, status: 'generating' } : t))
      );

      try {
        // テンプレートを探す
        const template = panelTemplates.find((t) => t.name === task.templateName);

        if (!template) {
          throw new Error(`テンプレート "${task.templateName}" が見つかりません`);
        }

        // 画像生成（テンプレートのアスペクト比を使用）
        const imageUrl = await generateWithRetry({
          prompt: task.prompt,
          apiKey,
          characterImages: characters.map((c) => c.file),
          panelTemplate: template.file,
          aspectRatio: template.aspectRatio,
          imageSize: '2K',
        });

        // 成功
        setGenerationTasks((prev) =>
          prev.map((t, idx) =>
            idx === i ? { ...t, status: 'completed', imageUrl } : t
          )
        );
      } catch (err) {
        // エラー
        const errorMessage = err instanceof Error ? err.message : '生成に失敗しました';
        setGenerationTasks((prev) =>
          prev.map((t, idx) =>
            idx === i ? { ...t, status: 'error', error: errorMessage } : t
          )
        );
      }
    }

    setIsGenerating(false);
  };

  // マニュアル生成
  const handleManualGeneration = async () => {
    if (!apiKey) {
      setError('APIキーを入力してください');
      return;
    }

    if (!manualTemplateName || !manualPrompt) {
      setError('テンプレート名とプロンプトを入力してください');
      return;
    }

    const template = panelTemplates.find((t) => t.name === manualTemplateName);
    if (!template) {
      setError(`テンプレート "${manualTemplateName}" が見つかりません`);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 画像生成（テンプレートのアスペクト比を使用）
      const imageUrl = await generateWithRetry({
        prompt: manualPrompt,
        apiKey,
        characterImages: characters.map((c) => c.file),
        panelTemplate: template.file,
        aspectRatio: template.aspectRatio,
        imageSize: '2K',
      });

      // タスクリストに追加
      const newTask: GenerationTask = {
        pageNumber: parseInt(manualPageNumber) || 0,
        templateName: manualTemplateName,
        prompt: manualPrompt,
        status: 'completed',
        imageUrl,
      };

      setGenerationTasks([...generationTasks, newTask]);

      // フォームをリセット
      setManualPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  // ZIP一括ダウンロード
  const handleDownloadAll = async () => {
    const completedTasks = generationTasks.filter((t) => t.status === 'completed' && t.imageUrl);

    if (completedTasks.length === 0) {
      setError('ダウンロードする画像がありません');
      return;
    }

    const images = completedTasks.map((task) => ({
      url: task.imageUrl!,
      filename: `page_${task.pageNumber}.png`,
    }));

    try {
      await downloadImagesAsZip(images, 'comic_pages.zip');
    } catch (err) {
      setError('ZIPファイルの作成に失敗しました');
    }
  };

  return (
    <div className="advanced-comic-generator">
      {/* APIキー入力 */}
      <div className="config-section">
        <h2>⚙️ 基本設定</h2>
        <div className="form-group">
          <label htmlFor="apiKey">Nano Banana Pro APIキー *</label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Google AI Studioから取得したAPIキー"
            className="input-field"
            disabled={isGenerating}
          />
        </div>
      </div>

      {/* キャラクターライブラリ */}
      <CharacterLibrary
        characters={characters}
        onAddCharacter={handleAddCharacter}
        onRemoveCharacter={handleRemoveCharacter}
        disabled={isGenerating}
      />

      {/* コマ割りテンプレート */}
      <PanelTemplateManager
        templates={panelTemplates}
        onAddTemplate={handleAddTemplate}
        onRemoveTemplate={handleRemoveTemplate}
        disabled={isGenerating}
      />

      {/* 生成モード選択 */}
      <div className="mode-section">
        <h2>📋 生成モード</h2>
        <div className="mode-selector">
          <button
            className={`mode-button ${generationMode === 'csv' ? 'active' : ''}`}
            onClick={() => setGenerationMode('csv')}
            disabled={isGenerating}
          >
            CSV一括生成
          </button>
          <button
            className={`mode-button ${generationMode === 'manual' ? 'active' : ''}`}
            onClick={() => setGenerationMode('manual')}
            disabled={isGenerating}
          >
            マニュアル生成
          </button>
        </div>
      </div>

      {/* CSVモード */}
      {generationMode === 'csv' && (
        <CSVUploader
          onUpload={handleCSVUpload}
          disabled={isGenerating}
          onStartGeneration={handleStartBatchGeneration}
          canStart={generationTasks.length > 0 && !isGenerating}
        />
      )}

      {/* マニュアルモード */}
      {generationMode === 'manual' && (
        <div className="manual-generation-section">
          <h2>✏️ マニュアル生成</h2>
          <div className="form-group">
            <label>ページ番号</label>
            <input
              type="text"
              value={manualPageNumber}
              onChange={(e) => setManualPageNumber(e.target.value)}
              className="input-field"
              disabled={isGenerating}
            />
          </div>
          <div className="form-group">
            <label>使用するテンプレート</label>
            <select
              value={manualTemplateName}
              onChange={(e) => setManualTemplateName(e.target.value)}
              className="input-field"
              disabled={isGenerating}
            >
              <option value="">選択してください</option>
              {panelTemplates.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>プロンプト</label>
            <textarea
              value={manualPrompt}
              onChange={(e) => setManualPrompt(e.target.value)}
              className="input-field textarea"
              rows={8}
              disabled={isGenerating}
              placeholder="漫画作成のプロンプトを入力..."
            />
          </div>
          <button
            onClick={handleManualGeneration}
            disabled={isGenerating}
            className="generate-button"
          >
            {isGenerating ? '生成中...' : '🎨 生成'}
          </button>
        </div>
      )}

      {/* エラー表示 */}
      {error && <div className="error-message">⚠️ {error}</div>}

      {/* 生成進捗 */}
      {generationTasks.length > 0 && (
        <GenerationProgress
          tasks={generationTasks}
          onDownloadAll={handleDownloadAll}
          canDownload={generationTasks.some((t) => t.status === 'completed')}
        />
      )}
    </div>
  );
}

export default AdvancedComicGenerator;
