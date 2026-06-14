"use client";

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className='flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors'>
      {copied ? <Check className='w-3 h-3 text-green-500' /> : <Copy className='w-3 h-3' />}{copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export interface PromptItem {
  id?: string;
  tool_id?: string;
  title: string;
  prompt_text: string;
  use_case: string;
  best_model?: string | null;
  copy_count?: number;
}

export function PromptSection({ prompt, index }: { prompt: PromptItem; index: number }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <div className='border border-gray-200 rounded-xl p-4 bg-gray-50'>
      <div className='flex items-center justify-between mb-2'>
        <h4 className='font-semibold text-sm text-gray-800'>{index + 1}. {prompt.title}</h4>
        <CopyButton text={prompt.prompt_text} />
      </div>
      <div className='text-xs text-gray-500 mb-2'>{prompt.use_case}{prompt.best_model ? ' - Best model: ' + prompt.best_model : ''}</div>
      <button onClick={() => setExpanded(!expanded)} className='flex items-center gap-1 text-xs text-blue-600 hover:underline'>
        {expanded ? <ChevronUp className='w-3 h-3' /> : <ChevronDown className='w-3 h-3' />}{expanded ? 'Hide prompt' : 'Show prompt'}
      </button>
      {expanded && <div className='mt-3 p-3 bg-white border border-gray-200 rounded-lg'><pre className='text-xs text-gray-700 whitespace-pre-wrap font-mono select-all'>{prompt.prompt_text}</pre></div>}
    </div>
  );
}
