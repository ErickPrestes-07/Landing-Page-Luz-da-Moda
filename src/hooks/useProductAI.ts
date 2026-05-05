import { useState } from 'react';

export interface AIProduct {
  name: string;
  category: string;
  price: string;
  description: string;
  sizes: string[];
}

export const useProductAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha na análise da imagem');
      }

      const data = await response.json();
      return { ok: true, product: data as AIProduct };
    } catch (error: any) {
      console.error('AI Analysis Error:', error);
      return { ok: false, error: error.message };
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeImage, isAnalyzing };
};
