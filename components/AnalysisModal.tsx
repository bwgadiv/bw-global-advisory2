
import React, { useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { generateAnalysisStream } from '../services/geminiService';
import type { LiveOpportunityItem } from '../types';
import Spinner from './Spinner';
import { CloseIcon, DownloadIcon, NexusLogo } from './Icons';
import Loader from './common/Loader';

interface AnalysisModalProps {
  item: LiveOpportunityItem;
  region: string;
  onClose: () => void;
}

interface ParsedAnalysis {
    title: string;
    subtitle: string;
    sections: { title: string; content: string[] }[];
}

const parseNADL = (nadlString: string): ParsedAnalysis | null => {
    if (!nadlString) return null;

    const titleMatch = nadlString.match(/<nad:report_title title="(.*?)" \/>/);
    const subtitleMatch = nadlString.match(/<nad:report_subtitle subtitle="(.*?)" \/>/);
    
    const sections: { title: string; content: string[] }[] = [];
    const sectionRegex = /<nad:section title="(.*?)">([\s\S]*?)<\/nad:section>/g;
    let match;
    while ((match = sectionRegex.exec(nadlString)) !== null) {
        const sectionTitle = match[1];
        const sectionContent = match[2];
        const paragraphs = (sectionContent.match(/<(nad:paragraph|nad:recommendation)>(.*?)<\/\1>/g) || [])
            .map(p => p.replace(/<[^>]+>/g, '').trim());
        
        sections.push({ title: sectionTitle, content: paragraphs });
    }

    if (!titleMatch || sections.length === 0) return null;

    return {
        title: titleMatch[1],
        subtitle: subtitleMatch ? subtitleMatch[1] : '',
        sections: sections,
    };
};

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ item, region, onClose }) => {
  const [reportText, setReportText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const generateReport = async () => {
      setIsLoading(true);
      setError(null);
      setReportText('');
      try {
        const stream = await generateAnalysisStream(item, region);
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            setReportText((prev) => prev + decoder.decode(value, { stream: true }));
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Failed to generate analysis: ${errorMessage}`);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    generateReport();
  }, [item, region]);

  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById('analysis-report-content');
    if (!reportElement) return;

    setIsDownloading(true);
    try {
        const canvas = await html2canvas(reportElement, {
            scale: 2,
            backgroundColor: '#f9fafb', // Match the document background
            useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }
        pdf.save(`Nexus-Analysis-${item.project_name.replace(/\s+/g, '-')}.pdf`);
    } catch (e) {
        console.error("Failed to generate PDF", e);
        setError("PDF generation failed. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };

  const parsedReport = useMemo(() => parseNADL(reportText), [reportText]);

  const renderContent = () => {
      if (isLoading && !parsedReport) {
          return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
              <Loader message={`Generating Deep-Dive Analysis for ${item.project_name}...`} />
            </div>
          );
      }

      if (error) {
          return (
              <div className="p-8 text-center text-red-400">
                  <h3 className="font-bold text-lg">Analysis Failed</h3>
                  <p>{error}</p>
              </div>
          );
      }
      
      if (!parsedReport) {
          return (
              <div className="flex items-center justify-center h-full min-h-[500px]">
                  <Loader message={isDownloading ? "Preparing PDF..." : "Finalizing report..."} />
              </div>
          );
      }

      return (
          <div id="analysis-report-content" className="report-document p-8 sm:p-12 mx-auto my-6 max-w-4xl">
              <header className="report-page-header text-center">
                  <h1 className="text-3xl font-bold font-sans text-gray-900">{parsedReport.title}</h1>
                  {parsedReport.subtitle && <p className="text-lg text-gray-600 mt-1">{parsedReport.subtitle}</p>}
              </header>
              
              <main>
                  {parsedReport.sections.map((section, index) => (
                      <section key={index}>
                          <h2 className="report-section-title text-2xl mt-8 mb-4 font-bold text-slate-800">{section.title}</h2>
                          <div className="space-y-4">
                              {section.content.map((p, pIndex) => (
                                  <p key={pIndex} className="text-base leading-relaxed text-gray-800">{p}</p>
                              ))}
                          </div>
                      </section>
                  ))}
              </main>

              <footer className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                  <p>BW Nexus AI | Confidential Analysis Document</p>
              </footer>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-slate-200 flex-shrink-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <NexusLogo className="w-8 h-8 text-orange-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Nexus Intelligence Deep-Dive</h2>
              <p className="text-sm text-slate-500 truncate max-w-md">Topic: {item.project_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-