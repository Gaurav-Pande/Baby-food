import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { createWorker } from 'tesseract.js';
import { Baby, AnalysisResult } from '../types';
import { analyzeIngredients } from '../services/analysisService';

interface Props {
  onStartAnalysis: () => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
  isAnalyzing: boolean;
  babyProfile: Baby;
}

const ImageCapture: React.FC<Props> = ({ 
  onStartAnalysis, 
  onAnalysisComplete, 
  isAnalyzing,
  babyProfile 
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageSrc(URL.createObjectURL(file));
      setExtractedText('');
    }
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc);
      setIsCapturing(false);
      setExtractedText('');
      
      // Convert base64 to File object
      if (imageSrc) {
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "webcam-capture.jpg", { type: "image/jpeg" });
            setImageFile(file);
          });
      }
    }
  };

  const resetImage = () => {
    setImageFile(null);
    setImageSrc(null);
    setExtractedText('');
    setOcrProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile || !imageSrc) return;
    
    onStartAnalysis();
    
    try {
      // 1. Extract text from image using OCR
      const worker = await createWorker({
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(m.progress);
          }
        }
      });
      
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(imageFile);
      await worker.terminate();
      
      setExtractedText(text);
      
      // 2. Analyze ingredients using AI service
      const result = await analyzeIngredients(text, babyProfile);
      
      // 3. Return results
      onAnalysisComplete({
        ...result,
        imageUrl: imageSrc,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      // Handle error state here
      onStartAnalysis(); // Reset analyzing state
    }
  };

  return (
    <div className="card">
      <div className="card-gradient-header">
        <h2 className="text-2xl font-semibold font-display">Analyze Food Ingredients</h2>
        <p className="text-primary-100 text-sm mt-1">
          Upload or capture a photo of any food label to analyze
        </p>
      </div>
      
      <div className="p-6">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary-light border-opacity-25"></div>
              <div 
                className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-t-primary border-r-primary animate-spin"
                style={{ borderTopColor: '#0EA5E9', borderRightColor: '#0EA5E9' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{Math.round(ocrProgress * 100)}%</span>
              </div>
            </div>
            <p className="mt-6 text-lg font-medium">Analyzing ingredients...</p>
            <p className="text-sm text-gray-500 mt-1">Extracting text and checking ingredients</p>
            
            {extractedText && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-gray-500 mb-1">Extracted text:</p>
                <p className="text-xs text-gray-700 font-mono break-words">
                  {extractedText.substring(0, 150)}
                  {extractedText.length > 150 ? '...' : ''}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {isCapturing ? (
              <div className="mb-6">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg border-2 border-primary-light"
                  videoConstraints={{
                    facingMode: "environment"
                  }}
                />
                <div className="flex justify-center mt-4 space-x-4">
                  <button
                    onClick={handleCapture}
                    className="btn-primary"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Capture Photo
                  </button>
                  <button
                    onClick={() => setIsCapturing(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <button
                    onClick={() => setIsCapturing(true)}
                    className="btn-primary flex-1"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take Photo
                  </button>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full btn-outline flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                      Upload Image
                    </button>
                  </div>
                </div>
                
                {imageSrc && (
                  <div className="mt-6 animate-fade-in">
                    <div className="relative">
                      <img
                        src={imageSrc}
                        alt="Captured food ingredients"
                        className="w-full rounded-lg border border-neutral max-h-96 object-contain bg-gray-100"
                      />
                      <button
                        onClick={resetImage}
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-6 flex flex-col items-center">
                      <p className="text-sm text-gray-500 mb-4">
                        Make sure the ingredients list is clearly visible in the image
                      </p>
                      <button
                        onClick={handleAnalyze}
                        className="btn-primary px-8 py-3"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Analyze Ingredients
                      </button>
                    </div>
                  </div>
                )}
                
                {!imageSrc && (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 font-medium">
                        Take a photo or upload an image of the food ingredients label
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        For best results, ensure the text is clear and well-lit
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCapture;
