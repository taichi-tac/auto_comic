/**
 * コミック生成に関する型定義
 */

export interface CharacterImage {
  name: string;
  file: File;
  preview: string;
}

export interface PanelTemplate {
  id: string;
  name: string;
  file: File;
  preview: string;
  width: number;
  height: number;
  aspectRatio: '1:1' | '16:9' | '4:3' | '9:16' | '3:4';
}

export interface CSVRow {
  pageNumber: string;
  templateName: string;
  prompt: string;
}

export interface GenerationTask {
  pageNumber: number;
  templateName: string;
  prompt: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  imageUrl?: string;
  error?: string;
}

export type GenerationMode = 'csv' | 'manual';
