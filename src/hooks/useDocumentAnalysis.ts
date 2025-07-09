import { useState } from 'react';
import { extractTextFromImage, OCRResult } from '@/utils/ocr';
import { classifyDocument, ClassificationResult } from '@/utils/documentClassifier';
import { DocumentCategory } from '@/types';

export interface DocumentAnalysis {
  ocrResult: OCRResult | null;
  classification: ClassificationResult | null;
  isAnalyzing: boolean;
  error: string | null;
}

export function useDocumentAnalysis() {
  const [analysis, setAnalysis] = useState<DocumentAnalysis>({
    ocrResult: null,
    classification: null,
    isAnalyzing: false,
    error: null
  });

  const analyzeDocument = async (file: File): Promise<{
    text: string;
    suggestedCategory: DocumentCategory;
    suggestedName: string;
    confidence: number;
  }> => {
    setAnalysis(prev => ({
      ...prev,
      isAnalyzing: true,
      error: null
    }));

    try {
      // Extraire le texte avec OCR
      const ocrResult = await extractTextFromImage(file);
      
      // Classifier le document
      const classification = classifyDocument(ocrResult.text);

      setAnalysis({
        ocrResult,
        classification,
        isAnalyzing: false,
        error: null
      });

      return {
        text: ocrResult.text,
        suggestedCategory: classification.category,
        suggestedName: classification.suggestedName || `Document - ${new Date().toLocaleDateString('fr-FR')}`,
        confidence: classification.confidence
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'analyse';
      
      setAnalysis(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage
      }));

      throw error;
    }
  };

  const resetAnalysis = () => {
    setAnalysis({
      ocrResult: null,
      classification: null,
      isAnalyzing: false,
      error: null
    });
  };

  return {
    analysis,
    analyzeDocument,
    resetAnalysis
  };
}