import React, { useState } from 'react';
import { analyzeRelevance, paraphrase, translate } from '../lib/gemini';

const LANGUAGES = [
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Chinese',
  'Japanese',
  'Russian',
  'Arabic',
  'Portuguese',
  'Italian',
];

interface AIPoweredToolsProps {
  content: string;
  onResult?: (result: string) => void;
}

const Loader = () => (
  <div className="flex items-center gap-2 justify-center py-6">
    <span className="relative flex h-8 w-8">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-8 w-8 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400"></span>
    </span>
    <span className="text-purple-700 font-medium animate-pulse text-lg">AI is thinking...</span>
  </div>
);

const AIPoweredTools: React.FC<AIPoweredToolsProps> = ({ content, onResult }) => {
  const [selectedLang, setSelectedLang] = useState('Spanish');
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading('analyze');
    setResult(null);
    setError(null);
    try {
      const res = await analyzeRelevance(content);
      setResult(res);
      onResult?.(res);
    } catch (e) {
      setError('Failed to get AI response.');
    } finally {
      setLoading(null);
    }
  };

  const handleParaphrase = async () => {
    setLoading('paraphrase');
    setResult(null);
    setError(null);
    try {
      const res = await paraphrase(content);
      setResult(res);
      onResult?.(res);
    } catch (e) {
      setError('Failed to get AI response.');
    } finally {
      setLoading(null);
    }
  };

  const handleTranslate = async () => {
    setLoading('translate');
    setResult(null);
    setError(null);
    try {
      const res = await translate(content, selectedLang);
      setResult(res);
      onResult?.(res);
    } catch (e) {
      setError('Failed to get AI response.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-purple-50/80 via-white to-blue-50/60 shadow-lg p-8 mb-6 animate-fade-in">
      <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2 text-purple-800">
        <span className="inline-block"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#a78bfa"/><path d="M11 17h2v-2h-2v2zm0-4h2V7h-2v6z" fill="#a78bfa"/></svg></span>
        AI-Powered Tools
      </h3>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Analyze Relevance */}
        <div className="flex-1 bg-white/80 rounded-xl border border-gray-200 p-5 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer">
          <div className="font-semibold text-purple-700 flex items-center gap-2 mb-1 group-hover:text-purple-900">
            <span className="inline-block"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#a78bfa"/></svg></span>
            Analyze Relevance
          </div>
          <div className="text-sm text-muted-foreground mb-4">Get AI insights on how relevant this content is to the question</div>
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 font-semibold hover:from-purple-200 hover:to-purple-300 transition-colors text-sm shadow group-hover:scale-105"
            onClick={handleAnalyze}
            disabled={loading === 'analyze'}
          >
            {loading === 'analyze' ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {/* Paraphrase */}
        <div className="flex-1 bg-white/80 rounded-xl border border-gray-200 p-5 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer">
          <div className="font-semibold text-purple-700 flex items-center gap-2 mb-1 group-hover:text-purple-900">
            <span className="inline-block"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            Paraphrase
          </div>
          <div className="text-sm text-muted-foreground mb-4">Rewrite content for better clarity and readability</div>
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 font-semibold hover:from-purple-200 hover:to-purple-300 transition-colors text-sm shadow group-hover:scale-105"
            onClick={handleParaphrase}
            disabled={loading === 'paraphrase'}
          >
            {loading === 'paraphrase' ? 'Paraphrasing...' : 'Paraphrase'}
          </button>
        </div>
        {/* Translate */}
        <div className="flex-1 bg-white/80 rounded-xl border border-gray-200 p-5 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer">
          <div className="font-semibold text-purple-700 flex items-center gap-2 mb-1 group-hover:text-purple-900">
            <span className="inline-block"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
            Translate
          </div>
          <div className="text-sm text-muted-foreground mb-4">Translate content to your preferred language</div>
          <select
            className="mb-2 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white/90 shadow"
            value={selectedLang}
            onChange={e => setSelectedLang(e.target.value)}
            disabled={loading === 'translate'}
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 font-semibold hover:from-purple-200 hover:to-purple-300 transition-colors text-sm shadow group-hover:scale-105"
            onClick={handleTranslate}
            disabled={loading === 'translate'}
          >
            {loading === 'translate' ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>
      {/* Divider */}
      <div className="my-8 border-t border-dashed border-purple-200"></div>
      {/* Result or Loader */}
      {loading && <Loader />}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-900 animate-fade-in shadow">
          <strong>Error:</strong> {error}
        </div>
      )}
      {!loading && result && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 animate-fade-in shadow">
          <strong>AI Result:</strong> {result}
        </div>
      )}
      {/* Demo Notice */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 border border-yellow-300 rounded-xl text-yellow-900 text-sm shadow flex items-center gap-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fde68a"/><path d="M12 8v4m0 4h.01" stroke="#b45309" strokeWidth="2" strokeLinecap="round"/></svg>
        <span><strong>Demo Mode:</strong> This is a simulation of AI features. In production, these would be powered by Google Gemini API.</span>
      </div>
    </div>
  );
};

export default AIPoweredTools; 