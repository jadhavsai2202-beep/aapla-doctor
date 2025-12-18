
import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, Leaf, HeartPulse, Salad } from 'lucide-react';
import { getDailyWellness } from '../geminiService';
import { UI_STRINGS } from '../constants';
import { Language, DailyTip } from '../types';

interface Props {
  lang: Language;
}

const DailyWellness: React.FC<Props> = ({ lang }) => {
  const [tips, setTips] = useState<DailyTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const data = await getDailyWellness(lang);
        setTips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [lang]);

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Yoga': return <Leaf className="w-6 h-6 text-emerald-600" />;
      case 'Diet': return <Salad className="w-6 h-6 text-orange-600" />;
      default: return <HeartPulse className="w-6 h-6 text-blue-600" />;
    }
  };

  const getColorClass = (cat: string) => {
    switch (cat) {
      case 'Yoga': return 'bg-emerald-50 border-emerald-100';
      case 'Diet': return 'bg-orange-50 border-orange-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-blue-600" />
        <h3 className="text-3xl font-bold text-slate-800">{UI_STRINGS[lang].wellnessTips}</h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border ${getColorClass(tip.category)} shadow-sm hover:shadow-md transition-all animate-in zoom-in duration-500 delay-[${idx * 100}ms]`}
            >
              <div className="mb-6">{getIcon(tip.category)}</div>
              <span className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2 block">
                {tip.category}
              </span>
              <h4 className="text-xl font-bold text-slate-800 mb-4 leading-tight">{tip.title}</h4>
              <p className="text-slate-600 leading-relaxed">{tip.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyWellness;
