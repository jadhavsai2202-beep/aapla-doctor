
import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { getMedicineInfo } from '../geminiService';
import { UI_STRINGS } from '../constants';
import { Language, MedicineInfo } from '../types';

interface Props {
  lang: Language;
  initialQuery?: string;
}

const MedicineFinder: React.FC<Props> = ({ lang, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MedicineInfo | null>(null);
  const [error, setError] = useState('');

  const s = UI_STRINGS[lang];

  // Clear result when language changes to avoid mixed-language screens
  useEffect(() => {
    setResult(null);
    if (initialQuery) {
      handleSearch(null, initialQuery);
    }
  }, [lang]);

  const handleSearch = async (e: React.FormEvent | null, forcedQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = forcedQuery || query;
    if (!activeQuery.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const info = await getMedicineInfo(activeQuery, lang);
      setResult(info);
    } catch (err) {
      setError(lang === 'EN' ? 'Could not find medicine details.' : lang === 'HI' ? 'दवा का विवरण नहीं मिल सका।' : 'औषधाची माहिती मिळू शकली नाही.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{s.medicineFinder}</h3>
        <form onSubmit={(e) => handleSearch(e)} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={s.medicineSearchLabel}
              className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {s.medicineSearchBtn}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-8">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-blue-600 animate-in slide-in-from-bottom duration-500">
          <h4 className="text-3xl font-bold text-slate-800 mb-6">{result.name}</h4>
          
          <div className="space-y-6">
            <section>
              <h5 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">{s.usageLabel}</h5>
              <p className="text-lg text-slate-700">{result.usage}</p>
            </section>

            <section>
              <h5 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">{s.dosageLabel}</h5>
              <p className="text-lg text-slate-700">{result.dosage}</p>
            </section>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex gap-3 items-start">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 mb-1">{s.warningLabel}</p>
                <p className="text-amber-800">{result.warning}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineFinder;
