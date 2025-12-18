
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2, ExternalLink } from 'lucide-react';
import { findNearbyPlaces } from '../geminiService';
import { UI_STRINGS } from '../constants';
import { Language, GroundingChunk } from '../types';

interface Props {
  lang: Language;
}

const NearbyFacilities: React.FC<Props> = ({ lang }) => {
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<GroundingChunk[]>([]);
  const [summary, setSummary] = useState('');

  const s = UI_STRINGS[lang];

  useEffect(() => {
    setPlaces([]);
    setSummary('');
  }, [lang]);

  const handleFindNearby = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const result = await findNearbyPlaces(pos.coords.latitude, pos.coords.longitude, lang);
          setPlaces(result.chunks);
          setSummary(result.text);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, (err) => {
        alert(lang === 'EN' ? "Location access denied." : lang === 'HI' ? "स्थान की पहुंच अस्वीकृत।" : "स्थान प्रवेश नाकारला.");
        setLoading(false);
      });
    } else {
      alert(lang === 'EN' ? "Geolocation not supported." : "Geolocation समर्थित नहीं है।");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
          <MapPin className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-3xl font-bold text-slate-800 mb-4">{s.nearbyFacilities}</h3>
        <button
          onClick={handleFindNearby}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all mx-auto shadow-xl shadow-blue-200"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Navigation className="w-6 h-6" />}
          {s.nearbyBtn}
        </button>
      </div>

      {(summary || places.length > 0) && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {summary && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {places.filter(p => p.maps).map((place, idx) => (
              <a
                key={idx}
                href={place.maps?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                </div>
                <h5 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {place.maps?.title}
                </h5>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Google Maps
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyFacilities;
