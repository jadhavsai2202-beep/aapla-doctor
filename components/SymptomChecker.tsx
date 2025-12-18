
import React, { useState, useEffect } from 'react';
import { Send, Loader2, HeartPulse, Activity } from 'lucide-react';
import { getSymptomAdvice } from '../geminiService';
import { UI_STRINGS } from '../constants';
import { Language, SymptomAdvice } from '../types';

interface Props {
  lang: Language;
}

const SymptomChecker: React.FC<Props> = ({ lang }) => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<SymptomAdvice | null>(null);

  const s = UI_STRINGS[lang];

  useEffect(() => {
    setAdvice(null);
  }, [lang]);

  const handleSymptomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      const data = await getSymptomAdvice(symptoms, lang);
      setAdvice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          {s.symptomChecker}
        </h3>
        <form onSubmit={handleSymptomSubmit} className="space-y-4">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={s.symptomSearchLabel}
            rows={3}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none transition-all resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <HeartPulse className="w-5 h-5" />}
            {s.symptomSearchBtn}
          </button>
        </form>
      </div>

      {advice && (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-red-600">
            <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-red-100 rounded-lg"><Activity className="w-5 h-5 text-red-600" /></span>
              {s.firstAidLabel}
            </h4>
            <div className="space-y-4">
              {advice.firstAid.map((step, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full font-bold text-sm">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-800 mb-1">{step.step}</h5>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-slate-800">
            <h4 className="text-xl font-bold text-slate-800 mb-4">{s.otcLabel}</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {advice.otcSuggestions.map((med, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700 bg-slate-50 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  {med}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-800 text-slate-100 rounded-xl text-center text-sm">
            {advice.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
