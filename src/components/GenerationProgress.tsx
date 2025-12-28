import React from 'react';
import { GenerationTask } from '../types/comic';

interface GenerationProgressProps {
  tasks: GenerationTask[];
  onDownloadAll: () => void;
  canDownload?: boolean;
}

function GenerationProgress({
  tasks,
  onDownloadAll,
  canDownload = false,
}: GenerationProgressProps) {
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const total = tasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="section generation-progress">
      <div className="progress-header">
        <h2>📈 生成進捗</h2>
        {canDownload && (
          <button onClick={onDownloadAll} className="download-all-button">
            📦 ZIP一括ダウンロード
          </button>
        )}
      </div>

      <div className="progress-summary">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${percentage}%` }} />
        </div>
        <p className="progress-text">
          {completed} / {total} ページ完了 ({percentage}%)
        </p>
      </div>

      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={index} className={`task-item status-${task.status}`}>
            <div className="task-header">
              <span className="task-number">ページ {task.pageNumber}</span>
              <span className="task-template">{task.templateName}</span>
              <span className={`task-status status-${task.status}`}>
                {task.status === 'pending' && '⏳ 待機中'}
                {task.status === 'generating' && '🔄 生成中...'}
                {task.status === 'completed' && '✅ 完了'}
                {task.status === 'error' && '❌ エラー'}
              </span>
            </div>

            {task.status === 'error' && task.error && (
              <div className="task-error">⚠️ {task.error}</div>
            )}

            {task.status === 'completed' && task.imageUrl && (
              <div className="task-result">
                <img
                  src={task.imageUrl}
                  alt={`Page ${task.pageNumber}`}
                  className="result-image"
                />
                <a
                  href={task.imageUrl}
                  download={`page_${task.pageNumber}.png`}
                  className="download-button"
                >
                  💾 ダウンロード
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenerationProgress;
