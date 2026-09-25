import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  BookmarkCheck,
  Bookmark,
  Share2,
  Download,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Heart,
  Type as TypeIcon,
  Smile,
  BookOpen,
  Image as ImageIcon,
  Printer,
  Tablet,
  Palette,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter, StoryPreferences, StoryChoice, ReadingTheme, SavedStory } from '../types/story';
import { narrationService } from '../services/ttsService';
import { soundService } from '../services/soundService';
import { BookProductionModal } from './BookProductionModal';

interface StoryReaderProps {
  currentChapter: Chapter;
  allChapters: Chapter[];
  preferences: StoryPreferences;
  onSelectChoice: (choice: StoryChoice) => void;
  onSaveToNotebook: () => void;
  isSaved: boolean;
  isLoadingNextChapter: boolean;
  onStartNewJourney: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  currentChapter,
  allChapters,
  preferences,
  onSelectChoice,
  onSaveToNotebook,
  isSaved,
  isLoadingNextChapter,
  onStartNewJourney,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [theme, setTheme] = useState<ReadingTheme>('daylight');
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showBookProductionModal, setShowBookProductionModal] = useState<boolean>(false);

  const kidsNames = preferences.children.map((c) => c.name).join(' e ');

  // Confetti on final celebration
  useEffect(() => {
    if (currentChapter.isFinal) {
      soundService.playCelestialChime();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fb923c', '#ec4899', '#38bdf8', '#a855f7'],
        });
      } catch {
        // ignore
      }
    }
  }, [currentChapter.isFinal]);

  // Sync TTS state
  useEffect(() => {
    narrationService.setOnStateChange((speaking) => {
      setIsNarrating(speaking);
    });
    return () => {
      narrationService.stop();
    };
  }, []);

  const toggleNarration = () => {
    if (isNarrating) {
      narrationService.stop();
      setIsNarrating(false);
    } else {
      const fullText = `${currentChapter.chapterTitle}. ${currentChapter.narrative}. Lição do coração: ${currentChapter.moralLesson}`;
      narrationService.speak(fullText, () => {
        setIsNarrating(false);
      });
      setIsNarrating(true);
    }
  };

  const handleChoiceClick = (choice: StoryChoice) => {
    setSelectedChoiceId(choice.id);
    soundService.playCelestialChime();
    onSelectChoice(choice);
  };

  const exportStoryAsText = () => {
    let content = `FECHE OS OLHOS E OLHE PARA DEUS — FELIPE LIMA\n`;
    content += `Contos e Histórias Infantis Ilustradas Personalizadas\n`;
    content += `Protagonistas: ${kidsNames}\n`;
    content += `Aprendizado / Valor Ensinado: ${preferences.learningGoal}\n`;
    content += `Cenário: ${preferences.setting}\n\n=========================================\n\n`;

    allChapters.forEach((ch) => {
      content += `CAPÍTULO ${ch.chapterNumber}: ${ch.chapterTitle}\n\n`;
      content += `${ch.narrative}\n\n`;
      content += `✨ Lição do Coração: ${ch.moralLesson}\n`;
      if (ch.chosenAction) {
        content += `Decisão das Crianças: "${ch.chosenAction}"\n`;
      }
      content += `\n-----------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Historia-Infantil-${kidsNames.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const text = `Criamos uma história infantil ilustrada para ${kidsNames} sobre: "${preferences.learningGoal}". Uma forma linda de ensinar valores!`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const themeClasses = {
    daylight: 'bg-[#0e1628] border-amber-400/30 text-slate-100',
    bedtime: 'bg-[#090d18] border-indigo-500/30 text-indigo-100',
    enchanted: 'bg-[#141226] border-purple-500/30 text-purple-100',
  };

  const fontSizeClasses = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-loose',
    huge: 'text-xl sm:text-2xl leading-loose',
  };

  const paragraphs = currentChapter.narrative.split('\n\n').filter((p) => p.trim());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Floating Controls Bar */}
      <div className="sticky top-20 z-30 flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/95 border border-amber-400/30 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-black">
            Página {currentChapter.chapterNumber} {currentChapter.isFinal ? '• Final Feliz' : 'de 3'}
          </span>
          <span className="hidden sm:inline text-xs text-amber-300 font-bold">
            Para {kidsNames}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* TTS Audio Narration */}
          <button
            onClick={toggleNarration}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isNarrating
                ? 'bg-amber-400 text-slate-950 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isNarrating ? 'Pausar narração' : 'Ouvir história em voz alta'}
          >
            {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span className="hidden md:inline">{isNarrating ? 'Pausar Voz' : 'Ouvir História'}</span>
          </button>

          {/* Font size toggle */}
          <button
            onClick={() => {
              if (fontSize === 'normal') setFontSize('large');
              else if (fontSize === 'large') setFontSize('huge');
              else setFontSize('normal');
            }}
            className="p-1.5 px-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
            title="Tamanho das letras"
          >
            <TypeIcon className="w-3.5 h-3.5 inline mr-1" />
            {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => {
              if (theme === 'daylight') setTheme('bedtime');
              else if (theme === 'bedtime') setTheme('enchanted');
              else setTheme('daylight');
            }}
            className="p-1.5 px-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
            title="Mudar visual da página"
          >
            {theme === 'daylight' ? '☀️ Dia' : theme === 'bedtime' ? '🌙 Noite' : '✨ Mágico'}
          </button>

          {/* Produzir Livro (PDF / Impressão / Kindle) */}
          <button
            onClick={() => setShowBookProductionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 shadow-md shadow-amber-900/30 hover:scale-105 transition-all cursor-pointer"
            title="Produzir livro oficial em formato PDF para Impressão ou Kindle"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Produzir Livro (PDF / Kindle)</span>
            <span className="sm:hidden">Livro</span>
          </button>

          {/* Save to Notebook */}
          <button
            onClick={onSaveToNotebook}
            className={`flex items-center gap-1 p-1.5 px-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
              isSaved
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Guardar na estante"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden lg:inline">{isSaved ? 'Salvo' : 'Salvar'}</span>
          </button>
        </div>
      </div>

      {/* Main Storybook Card */}
      <article className={`relative rounded-3xl border p-6 sm:p-10 shadow-2xl transition-all duration-300 ${themeClasses[theme]}`}>
        {/* Learning Goal Reminder Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Aprendizado do Dia: {preferences.learningGoal}
          </div>
          <span className="text-xs text-slate-400">
            Personagens: <strong className="text-white">{kidsNames}</strong>
          </span>
        </div>

        {/* Chapter Title */}
        <div className="text-center space-y-3 mb-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            {currentChapter.chapterTitle}
          </h2>
        </div>

        {/* Story Illustration with Approved Standard Badge */}
        {currentChapter.illustrationUrl && (
          <div className="my-6 space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-300">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Padrão de Imagens Oficial • 3D Pixar / Bíblico
              </span>
              <button
                type="button"
                onClick={() => setShowBookProductionModal(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline decoration-amber-500/50 cursor-pointer"
              >
                <Printer className="w-3 h-3" />
                Ver no Formato de Livro (PDF/Kindle)
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl bg-slate-950 aspect-video max-h-[380px] w-full flex items-center justify-center">
              <img
                src={currentChapter.illustrationUrl}
                alt={currentChapter.illustrationPrompt || currentChapter.chapterTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Narrative Prose */}
        <div className={`space-y-6 font-medium text-slate-200 ${fontSizeClasses[fontSize]}`}>
          {paragraphs.map((p, idx) => (
            <p key={idx} className="leading-relaxed first-letter:text-3xl first-letter:font-black first-letter:text-amber-400 first-letter:mr-1">
              {p}
            </p>
          ))}
        </div>

        {/* Moral Lesson / Lição do Coração */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-2 border-amber-400/50 flex items-start gap-4 shadow-lg">
          <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 flex-shrink-0 font-bold">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              💡 Lição do Coração para {kidsNames}:
            </span>
            <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
              "{currentChapter.moralLesson}"
            </p>
          </div>
        </div>

        {/* Climax / Conclusão Final */}
        {currentChapter.isFinal && (
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent border-2 border-amber-400 text-center space-y-6">
            <div className="inline-block p-3.5 rounded-full bg-amber-400 text-slate-950 mb-1">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Parabéns, {kidsNames}! Você(s) aprenderam uma lição incrível!
            </h3>

            <p className="text-sm sm:text-base text-amber-200/90 max-w-xl mx-auto leading-relaxed">
              Essa história foi escrita especialmente para você(s) guardarem no coração o valor de: <strong>{preferences.learningGoal}</strong>. Que orgulho da sua caminhada!
            </p>

            {/* Sharing & Export */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowBookProductionModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-5 h-5 text-slate-950" />
                <span>Produzir Livro Oficial (PDF Impressão & Kindle)</span>
              </button>

              <button
                onClick={exportStoryAsText}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                Baixar História (TXT)
              </button>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                {copiedLink ? 'Copiado para o WhatsApp!' : 'Compartilhar História'}
              </button>

              <button
                onClick={onStartNewJourney}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Criar Outra História
              </button>
            </div>
          </div>
        )}
      </article>

      {/* Interactive Choices Section (If NOT Final) */}
      {!currentChapter.isFinal && (
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              O que acontece agora?
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              O que {kidsNames} decidem fazer?
            </h3>
            <p className="text-xs text-slate-400">
              Escolha o próximo passo da história para ver a lição se desdobrar:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {currentChapter.choices.map((choice, index) => {
              const isSelected = selectedChoiceId === choice.id;
              return (
                <button
                  key={choice.id || index}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={isLoadingNextChapter}
                  className={`group relative text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                      : 'bg-slate-900 border-slate-800 hover:border-amber-400/60 hover:bg-slate-800/80 shadow-md'
                  } disabled:opacity-50`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      {choice.lessonFocus && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {choice.lessonFocus}
                        </span>
                      )}
                      <p className="text-sm sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors leading-relaxed">
                        {choice.text}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-amber-400 group-hover:text-slate-950 text-amber-400 transition-colors flex-shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {isLoadingNextChapter && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-amber-400/40 text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-amber-300">
                Criando e ilustrando o próximo capítulo para {kidsNames}...
              </p>
              <p className="text-xs text-slate-400">
                «Preparando uma cena divertida e cheia de carinho!»
              </p>
            </div>
          )}
        </section>
      )}

      {/* Chapters History */}
      {allChapters.length > 1 && (
        <details className="group rounded-2xl bg-slate-900/60 border border-slate-800 p-4 transition-all">
          <summary className="flex items-center justify-between cursor-pointer text-xs font-bold uppercase tracking-wider text-amber-300 list-none">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Ver Capítulos Anteriores ({allChapters.length - 1})
            </span>
            <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>

          <div className="mt-4 space-y-3 pt-4 border-t border-slate-800">
            {allChapters.slice(0, -1).map((ch) => (
              <div key={ch.chapterNumber} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300">
                    Capítulo {ch.chapterNumber}: {ch.chapterTitle}
                  </span>
                  {ch.chosenAction && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Decisão: {ch.chosenAction.slice(0, 30)}...
                    </span>
                  )}
                </div>
                <p className="text-slate-400 italic line-clamp-2">
                  Lição: {ch.moralLesson}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Book Production Modal (PDF Impressão & Kindle) */}
      {showBookProductionModal && (
        <BookProductionModal
          story={{
            id: 'current-story',
            title: allChapters[0]?.chapterTitle || currentChapter.chapterTitle,
            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            preferences,
            chapters: allChapters,
            isCompleted: currentChapter.isFinal,
          }}
          onClose={() => setShowBookProductionModal(false)}
        />
      )}
    </div>
  );
};
