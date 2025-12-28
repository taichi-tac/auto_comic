import React, { useRef } from 'react';

interface CSVUploaderProps {
  onUpload: (file: File) => void;
  onStartGeneration: () => void;
  disabled?: boolean;
  canStart?: boolean;
}

function CSVUploader({
  onUpload,
  onStartGeneration,
  disabled = false,
  canStart = false,
}: CSVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="section csv-uploader">
      <h2>📊 CSV一括生成</h2>
      <p className="section-description">
        CSVファイルをアップロードして複数ページを一括生成
      </p>

      <div className="csv-format-info">
        <h4>CSVフォーマット:</h4>
        <pre>
          {`ページ番号,使用するコマ割りテンプレ,漫画作成のプロンプト
1,テンプレ1,◆【絶対最優先】キャラクター外見: ...
2,テンプレ2,◆【絶対最優先】キャラクター外見: ...`}
        </pre>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <div className="button-group">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="upload-button"
          disabled={disabled}
        >
          📁 CSVファイルを選択
        </button>

        {canStart && (
          <button
            onClick={onStartGeneration}
            className="generate-button primary"
            disabled={disabled}
          >
            🚀 バッチ生成開始
          </button>
        )}
      </div>
    </div>
  );
}

export default CSVUploader;
