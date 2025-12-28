import React from 'react';
import { PanelTemplate } from '../types/comic';
import { debugString } from '../utils/stringUtils';

interface TemplateDebuggerProps {
  templates: PanelTemplate[];
  csvTemplateNames: string[];
}

function TemplateDebugger({ templates, csvTemplateNames }: TemplateDebuggerProps) {
  return (
    <div style={{
      background: '#0a0f1a',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      color: '#9ca3af',
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <h3 style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>🐛 デバッグ情報</h3>

      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ color: '#10b981' }}>登録済みテンプレート ({templates.length}件):</strong>
        {templates.map((t, i) => (
          <div key={i} style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
            [{i}] "{t.name}" (長さ: {t.name.length})
            <br />
            <span style={{ color: '#6b7280' }}>文字: {debugString(t.name)}</span>
          </div>
        ))}
      </div>

      {csvTemplateNames.length > 0 && (
        <div>
          <strong style={{ color: '#f59e0b' }}>CSVのテンプレート名 ({csvTemplateNames.length}件):</strong>
          {csvTemplateNames.map((name, i) => (
            <div key={i} style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
              [{i}] "{name}" (長さ: {name.length})
              <br />
              <span style={{ color: '#6b7280' }}>文字: {debugString(name)}</span>
              <br />
              <span style={{
                color: templates.some(t => t.name === name) ? '#10b981' : '#ef4444'
              }}>
                マッチ: {templates.some(t => t.name === name) ? '✓ 見つかった' : '✗ 見つからない'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplateDebugger;
