
import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Menu, 
  X, 
  Languages, 
  Phone, 
  Search,
  Activity,
  MapPin,
  Sparkles,
  Video,
  Globe,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { Language } from './types';
import { UI_STRINGS } from './constants';
import Disclaimer from './components/Disclaimer';
import MedicineFinder from './components/MedicineFinder';
import SymptomChecker from './components/SymptomChecker';
import NearbyFacilities from './components/NearbyFacilities';
import DailyWellness from './components/DailyWellness';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [activeTab, setActiveTab] = useState<'medicine' | 'symptoms' | 'nearby' | 'wellness' | 'home'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [showFloatingLang, setShowFloatingLang] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('disclaimerAccepted');
    if (!accepted) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleDisclaimerAccept = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
  };

  const handleHomeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearchQuery.trim()) {
      setActiveTab('medicine');
    }
  };

  const s = UI_STRINGS[lang];

  const languageOptions: { id: Language; label: string }[] = [
    { id: 'EN', label: 'English' },
    { id: 'HI', label: 'हिंदी' },
    { id: 'MR', label: 'मराठी' }
  ];

  const handleBack = () => {
    setActiveTab('home');
    setHomeSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter',_'Noto_Sans_Devanagari',_sans-serif]">
      {showDisclaimer && <Disclaimer lang={lang} onAccept={handleDisclaimerAccept} />}

      {/* Floating Language Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showFloatingLang && (
          <div className="absolute bottom-16 right-0 bg-white shadow-2xl rounded-2xl p-2 border border-slate-100 flex flex-col gap-1 min-w-[140px] animate-in slide-in-from-bottom-4 fade-in duration-200">
            {languageOptions.map((l) => (
              <button
                key={l.id}
                onClick={() => { setLang(l.id); setShowFloatingLang(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${lang === l.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowFloatingLang(!showFloatingLang)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Globe className="w-6 h-6" />
        </button>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={handleBack}
          >
            <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              {s.title}
            </h1>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {[
                { id: 'medicine', label: s.medicineFinder },
                { id: 'symptoms', label: s.symptomChecker },
                { id: 'nearby', label: s.nearbyFacilities }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`font-semibold transition-all relative py-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <div className="px-2 text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              {languageOptions.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${lang === l.id ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="lg:hidden p-2 text-slate-600 bg-slate-50 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-6 space-y-6 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col gap-4">
              <button onClick={() => {setActiveTab('medicine'); setMobileMenuOpen(false);}} className="text-left py-2 font-bold text-slate-700 border-b border-slate-50">{s.medicineFinder}</button>
              <button onClick={() => {setActiveTab('symptoms'); setMobileMenuOpen(false);}} className="text-left py-2 font-bold text-slate-700 border-b border-slate-50">{s.symptomChecker}</button>
              <button onClick={() => {setActiveTab('nearby'); setMobileMenuOpen(false);}} className="text-left py-2 font-bold text-slate-700 border-b border-slate-50">{s.nearbyFacilities}</button>
            </nav>
            <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl">
              {languageOptions.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { setLang(l.id); setMobileMenuOpen(false); }}
                  className={`px-4 py-3 rounded-xl text-sm font-bold flex-1 transition-all ${lang === l.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-transparent text-slate-500'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pb-12">
        {/* Back Button for specific views */}
        {activeTab !== 'home' && (
          <div className="max-w-7xl mx-auto px-4 pt-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              {s.backToHome}
            </button>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-700">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl -ml-32 -mb-32" />
              
              <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="inline-block px-4 py-1.5 bg-blue-500/30 border border-blue-400/40 rounded-full text-blue-100 text-sm font-bold mb-6 backdrop-blur-sm">
                  ✨ Powered by Google Gemini AI
                </div>
                
                {/* Dashboard Language Switcher */}
                <div className="flex items-center justify-center gap-2 mb-10">
                  <div className="bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/20 flex gap-2">
                    {languageOptions.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLang(l.id)}
                        className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${lang === l.id ? 'bg-white text-blue-700 shadow-xl scale-105' : 'text-white/70 hover:text-white'}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
                  {s.tagline}
                </h2>
                
                {/* Search Bar on Homepage */}
                <form onSubmit={handleHomeSearch} className="max-w-2xl mx-auto mb-12 relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={homeSearchQuery}
                    onChange={(e) => setHomeSearchQuery(e.target.value)}
                    placeholder={s.searchPlaceholder}
                    className="w-full pl-16 pr-32 py-5 bg-white text-slate-800 rounded-2xl shadow-2xl focus:ring-4 focus:ring-blue-400/30 focus:outline-none transition-all text-lg font-medium"
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 inset-y-3 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold text-sm transition-all shadow-lg"
                  >
                    {lang === 'EN' ? 'Search' : lang === 'HI' ? 'खोजें' : 'शोधा'}
                  </button>
                </form>

                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => setActiveTab('medicine')}
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-md border border-white/20 transition-all flex items-center gap-3"
                  >
                    {s.medicineFinder}
                  </button>
                  <button 
                    onClick={() => setActiveTab('symptoms')}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-red-900/20 flex items-center gap-3"
                  >
                    <Activity className="w-5 h-5" />
                    {s.symptomChecker}
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Stats/Features */}
            <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div onClick={() => setActiveTab('nearby')} className="group cursor-pointer bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500">
                  <MapPin className="w-8 h-8 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{s.nearbyFacilities}</h3>
                <p className="text-slate-500 leading-relaxed">Find 24/7 pharmacies and specialist hospitals near you in seconds.</p>
              </div>

              <div onClick={() => setActiveTab('wellness')} className="group cursor-pointer bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-emerald-100 hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-colors duration-500">
                  <Sparkles className="w-8 h-8 text-emerald-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{s.wellnessTips}</h3>
                <p className="text-slate-500 leading-relaxed">Daily diet, yoga, and seasonal wellness tips curated for your lifestyle.</p>
              </div>

              <div className="group cursor-pointer bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-purple-100 hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-600 transition-colors duration-500">
                  <Video className="w-8 h-8 text-purple-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{s.consultDoctor}</h3>
                <p className="text-slate-500 leading-relaxed">Book an instant online consultation with certified doctors anytime.</p>
              </div>
            </section>

            <DailyWellness lang={lang} />
          </div>
        )}

        {activeTab === 'medicine' && <MedicineFinder lang={lang} initialQuery={homeSearchQuery} />}
        {activeTab === 'symptoms' && <SymptomChecker lang={lang} />}
        {activeTab === 'nearby' && <NearbyFacilities lang={lang} />}
        {activeTab === 'wellness' && <DailyWellness lang={lang} />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8 text-white">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black tracking-tight">{s.title}</span>
              </div>
              <p className="max-w-md text-lg leading-relaxed text-slate-400">
                Empowering millions with accurate medical information and emergency aid in their local language. 
                Our AI-driven platform bridges the gap between technology and traditional healthcare.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-xl mb-8">{s.contactUs}</h4>
              <div className="flex items-center gap-3 mb-6 text-emerald-400 font-black text-2xl tracking-tighter">
                <Phone className="w-6 h-6" />
                108
              </div>
              <p className="text-slate-300">Email: help@aapladoctor.com</p>
              <p className="text-slate-500 text-sm mt-4">Available 24/7 for support.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-xl mb-8">Quick Links</h4>
              <ul className="space-y-4 font-medium">
                <li><button onClick={handleBack} className="hover:text-blue-400 transition-colors">Home</button></li>
                <li><button className="hover:text-blue-400 transition-colors">{s.privacyPolicy}</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Grievance Cell</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm font-medium">
              {s.footerCopyright}
            </div>
            <div className="flex gap-6 text-sm">
              <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Multilingual Support Active</span>
              <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> HIPAA Compliant AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
