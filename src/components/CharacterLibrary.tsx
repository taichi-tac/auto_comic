import React, { useRef } from 'react';
import { CharacterImage } from '../types/comic';

interface CharacterLibraryProps {
  characters: CharacterImage[];
  onAddCharacter: (file: File) => void;
  onRemoveCharacter: (index: number) => void;
  disabled?: boolean;
}

function CharacterLibrary({
  characters,
  onAddCharacter,
  onRemoveCharacter,
  disabled = false,
}: CharacterLibraryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        onAddCharacter(file);
      });
    }
    // リセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="section character-library">
      <h2>👤 キャラクターライブラリ</h2>
      <p className="section-description">
        キャラクター画像をアップロード（推奨サイズ: 896×1200px、ファイル名はカタカナ/漢字）
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
        disabled={disabled}
      >
        📁 画像を追加
      </button>

      {characters.length > 0 && (
        <div className="character-grid">
          {characters.map((char, index) => (
            <div key={index} className="character-card">
              <img src={char.preview} alt={char.name} className="character-preview" />
              <div className="character-info">
                <p className="character-name">{char.name}</p>
                <button
                  onClick={() => onRemoveCharacter(index)}
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

      {characters.length === 0 && (
        <div className="empty-state">
          <p>キャラクター画像がまだありません</p>
        </div>
      )}
    </div>
  );
}

export default CharacterLibrary;
