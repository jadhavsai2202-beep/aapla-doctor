
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { UI_STRINGS } from '../constants';
import { Language } from '../types';

interface DisclaimerProps {
  lang: Language;
  onAccept: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ lang, onAccept }) => {
  const s = UI_STRINGS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <ShieldAlert className="w-8 h-8" />
          <h2 className="text-2xl font-bold">{s.disclaimerTitle}</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-8">
          {s.disclaimerText}
        </p>
        <button
          onClick={onAccept}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
        >
          {s.accept}
        </button>
      </div>
    </div>
  );
};

export default Disclaimer;
