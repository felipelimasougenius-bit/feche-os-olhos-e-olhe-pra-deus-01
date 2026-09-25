import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  PlusCircle,
  BookmarkCheck,
  Music,
  CloudRain,
  Feather,
} from 'lucide-react';
import { soundService } from '../services/soundService';

interface HeaderProps {
  activeTab: 'reader' | 'setup' | 'library';
  onTabChange: (tab: 'reader' | 'setup' | 'library') => void;
  hasActiveStory: boolean;
  savedStoriesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  hasActiveStory,
  savedStoriesCount,
}) => {
  const [soundMode, setSoundMode] = useState<string>('none');
  const [volume, setVolume] = useState<number>(0.3);
  const [showSoundMenu, setShowSoundMenu] = useState<boolean>(false);

  const toggleSound = (mode: 'sanctuary' | 'rain' | 'none') => {
    if (mode === 'none' || soundMode === mode) {
      soundService.stopAmbient();
      setSoundMode('none');
    } else if (mode === 'sanctuary') {
      soundService.playSanctuaryChords();
      setSoundMode('sanctuary');
    } else if (mode === 'rain') {
      soundService.playGentleRain();
      setSoundMode('rain');
    }
    setShowSoundMenu(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundService.setVolume(val);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Felipe Lima branding */}
          <div
            onClick={() => onTabChange(hasActiveStory ? 'reader' : 'setup')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 p-[2px] shadow-lg shadow-amber-900/40 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-2xl bg-[#090d16] flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-wide text-white group-hover:text-amber-300 transition-colors uppercase font-sacred">
                  FECHE OS OLHOS E OLHE PARA DEUS
                </span>
              </div>
              <p className="text-xs text-amber-400 font-reading italic flex items-center gap-1">
                <Feather className="w-3 h-3 inline text-amber-400" />
                Histórias Ilustradas Infantis • Por Felipe Lima
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            {hasActiveStory && (
              <button
                onClick={() => onTabChange('reader')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'reader'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                História Aberta
              </button>
            )}

            <button
              onClick={() => onTabChange('setup')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'setup'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Novo Aprendizado
            </button>

            <button
              onClick={() => onTabChange('library')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              Estante da Família
              {savedStoriesCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-amber-300 font-black">
                  {savedStoriesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Ambient Audio Controls */}
          <div className="relative">
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                soundMode !== 'none'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Música ambiente para a leitura"
            >
              {soundMode !== 'none' ? (
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {soundMode === 'sanctuary' ? 'Acordes de Paz' : soundMode === 'rain' ? 'Chuva Serena' : 'Som Ambiente'}
              </span>
            </button>

            {showSoundMenu && (
              <div className="absolute right-0 mt-2 w-52 p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Trilha Suave de Paz
                </div>
                <div className="space-y-1 mb-3">
                  <button
                    onClick={() => toggleSound('sanctuary')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      soundMode === 'sanctuary'
                        ? 'bg-amber-500/30 text-amber-200 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Music className="w-3.5 h-3.5 text-amber-400" />
                      Acordes Calmos
                    </span>
                  </button>
                  <button
                    onClick={() => toggleSound('rain')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      soundMode === 'rain'
                        ? 'bg-amber-500/30 text-amber-200 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                      Chuva Serena
                    </span>
                  </button>
                  <button
                    onClick={() => toggleSound('none')}
                    className="w-full flex items-center px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 cursor-pointer"
                  >
                    Silêncio
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Volume</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex sm:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          {hasActiveStory && (
            <button
              onClick={() => onTabChange('reader')}
              className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
                activeTab === 'reader' ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>História</span>
            </button>
          )}
          <button
            onClick={() => onTabChange('setup')}
            className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'setup' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar</span>
          </button>
          <button
            onClick={() => onTabChange('library')}
            className={`flex items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'library' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Estante ({savedStoriesCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
