
import React, { useState, useEffect, useCallback } from 'react';
import useEscapeKey from '../hooks/useEscapeKey.ts';
import { CloseIcon, LetterIcon } from './Icons.tsx';
import Spinner from './Spinner.tsx';

interface LetterGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Modified: Pass reportContent and reportParameters to onGenerate
  onGenerate: (reportContent: string, reportParameters: any) => Promise<string>;
  reportContent: string; // New prop
  reportParameters: any; // New prop
}

export const LetterGeneratorModal: React.FC<LetterGeneratorModalProps> = ({ isOpen, onClose, onGenerate, reportContent, reportParameters }) => {
  useEscapeKey(onClose);
  const [letterContent, setLetterContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState('');
 
  const handleGenerate = useCallback(async () => {
      setIsGenerating(true);
      setError(null);
      setLetterContent('');
      setCopySuccess('');
      try { 
        const content = await onGenerate(reportContent, reportParameters);
        setLetterContent(content);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Failed to generate letter: ${errorMessage}`);
        console.error(e);
      } finally {
        setIsGenerating(false);
      }
  }, [onGenerate, reportContent, reportParameters]);
  
  useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
  }, [isOpen, handleGenerate]);
  
  const handleCopyToClipboard = () => {
    if (!letterContent) return;
    navigator.clipboard.writeText(letterContent).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, (err) => {
      setCopySuccess('Failed to copy.');
      console.error('Could not copy text: ', err);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <LetterIcon className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Outreach Letter Generator</h2>
              <p className="text-sm text-gray-500">AI-drafted introductory letter</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900"><CloseIcon className="w-6 h-6"/></button>
        </header>

        <main className="flex-grow p-6 overflow-y-auto">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Spinner />
              <p className="mt-4">Drafting outreach letter...</p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                <p className="font-bold">An error occurred</p>
                <p className="text-sm">{error}</p>
            </div>
          )}
          {!isGenerating && !error && letterContent && (
            <textarea
                readOnly
                value={letterContent}
                className="w-full h-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Letter content will appear here..."
            />
          )}
        </main>

        <footer className="p-4 border-t border-gray-200 flex-shrink-0 flex justify-end items-center gap-4">
            {copySuccess && <span className="text-sm text-green-600">{copySuccess}</span>}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={handleCopyToClipboard}
              disabled={isGenerating || !!error || !letterContent}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Copy to Clipboard
            </button>
        </footer>
      </div>
    </div>
  );
};
