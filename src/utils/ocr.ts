import { createWorker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

export async function extractTextFromImage(file: File): Promise<OCRResult> {
  try {
    const worker = await createWorker('fra+eng');
    
    const { data: { text, confidence } } = await worker.recognize(file);
    
    await worker.terminate();
    
    return {
      text: text.trim(),
      confidence: confidence || 0
    };
  } catch (error) {
    console.error('Erreur OCR:', error);
    return {
      text: '',
      confidence: 0
    };
  }
}