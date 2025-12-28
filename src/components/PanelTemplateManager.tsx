import React, { useRef } from 'react';
import { PanelTemplate } from '../types/comic';
import { normalizeString } from '../utils/stringUtils';
import { getAspectRatioName } from '../utils/aspectRatioUtils';

interface PanelTemplateManagerProps {
  templates: PanelTemplate[];
  onAddTemplate: (file: File, templateName: string) => Promise<void>;
  onRemoveTemplate: (id: string) => void;
  disabled?: boolean;
}

function PanelTemplateManager({
  templates,
  onAddTemplate,
  onRemoveTemplate,
  disabled = false,
}: PanelTemplateManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // 複数ファイルを順次処理
      for (const file of Array.from(files)) {
        // ファイル名から拡張子を除去してテンプレート名として使用
        const rawName = file.name.replace(/\.(png|jpg|jpeg)$/i, '');
        // 正規化してスペースなどを除去
        const templateName = normalizeString(rawName);
        await onAddTemplate(file, templateName);
      }
    }

    // リセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="section panel-template-manager">
      <h2>📐 コマ割りテンプレート</h2>
      <p className="section-description">
        コマ割りテンプレート画像をアップロード（最大30枚、推奨サイズ: 896×1200px）
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="upload-button"
        disabled={disabled || templates.length >= 30}
      >
        📁 テンプレートを追加（複数選択可）
      </button>

      <p className="upload-hint">
        ファイル名がテンプレート名として使用されます（例: テンプレ1.png → テンプレ1）
      </p>

      {templates.length > 0 && (
        <div className="template-grid">
          {templates.map((template) => (
            <div key={template.id} className="template-card">
              <img src={template.preview} alt={template.name} className="template-preview" />
              <div className="template-info">
                <div>
                  <p className="template-name">{template.name}</p>
                  <p className="template-details">
                    {template.width}×{template.height} ({getAspectRatioName(template.aspectRatio)})
                  </p>
                </div>
                <button
                  onClick={() => onRemoveTemplate(template.id)}
                  className="remove-button"
                  disabled={disabled}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {templates.length === 0 && (
        <div className="empty-state">
          <p>テンプレートがまだありません</p>
        </div>
      )}
    </div>
  );
}

export default PanelTemplateManager;
