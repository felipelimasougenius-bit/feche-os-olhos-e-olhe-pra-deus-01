import React, { useState } from 'react';
import {
  BookMarked,
  BookOpen,
  Calendar,
  Trash2,
  Download,
  Plus,
  Heart,
  Sparkles,
  Baby,
  Printer,
  Tablet,
} from 'lucide-react';
import { SavedStory } from '../types/story';
import { BookProductionModal } from './BookProductionModal';

interface GraceNotebookProps {
  savedStories: SavedStory[];
  onOpenStory: (story: SavedStory) => void;
  onDeleteStory: (id: string) => void;
  onStartNewStory: () => void;
}

export const GraceNotebook: React.FC<GraceNotebookProps> = ({
  savedStories,
  onOpenStory,
  onDeleteStory,
  onStartNewStory,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(
    savedStories.length > 0 ? savedStories[0].id : null
  );
  const [storyToProduce, setStoryToProduce] = useState<SavedStory | null>(null);

  const currentStory = savedStories.find((s) => s.id === selectedStoryId);

  const exportStoryText = (story: SavedStory) => {
    const kidsNames = story.preferences.children.map((c) => c.name).join(' e ');
    let content = `FECHE OS OLHOS E OLHE PARA DEUS — FELIPE LIMA\n`;
    content += `Biblioteca e Estante da Família\n`;
    content += `Criança(s): ${kidsNames}\n`;
    content += `Aprendizado / Valor: ${story.preferences.learningGoal}\n`;
    content += `Data de Criação: ${story.date}\n`;
    content += `Cenário: ${story.preferences.setting}\n\n=========================================\n\n`;

    story.chapters.forEach((ch) => {
      content += `CAPÍTULO ${ch.chapterNumber}: ${ch.chapterTitle}\n\n`;
      content += `${ch.narrative}\n\n`;
      content += `Lição do Coração: ${ch.moralLesson}\n`;
      if (ch.chosenAction) {
        content += `Decisão Escolhida: ${ch.chosenAction}\n`;
      }
      content += `\n-----------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Historia-${kidsNames.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <BookMarked className="w-4 h-4" />
            Biblioteca Pessoal da Família
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Estante de Histórias dos Meus Filhos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Todas as histórias ilustradas criadas com os aprendizados dos seus filhos guardadas em um só lugar.
          </p>
        </div>

        <button
          onClick={onStartNewStory}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar com Novo Aprendizado</span>
        </button>
      </div>

      {savedStories.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Sua estante de histórias ainda está vazia
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Diga qual aprendizado você deseja transmitir hoje para seu(s) filho(s) e crie a primeira história ilustrada personalizada!
          </p>
          <button
            onClick={onStartNewStory}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Criar Minha Primeira História
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Saved Stories */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              Histórias Salvas ({savedStories.length})
            </div>

            {savedStories.map((story) => {
              const isSelected = selectedStoryId === story.id;
              const kids = story.preferences.children.map((c) => c.name).join(' e ');
              return (
                <div
                  key={story.id}
                  onClick={() => setSelectedStoryId(story.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-amber-400/80 mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {story.date}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      {story.chapters.length} capítulo(s)
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {story.title}
                  </h4>

                  <div className="flex items-center gap-1 text-xs text-amber-300 font-medium mt-1">
                    <Baby className="w-3 h-3" />
                    <span>{kids}</span>
                  </div>

                  <p className="text-xs text-slate-400 italic line-clamp-2 mt-1">
                    Aprendizado: {story.preferences.learningGoal}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed View */}
          {currentStory && (
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                      Para: {currentStory.preferences.children.map((c) => c.name).join(' e ')}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {currentStory.title}
                    </h3>
                    <p className="text-xs text-amber-200/90 font-medium mt-1">
                      🎯 Aprendizado trabalhado: <strong>{currentStory.preferences.learningGoal}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setStoryToProduce(currentStory)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-md hover:scale-105 transition-all cursor-pointer"
                      title="Produzir livro em formato PDF para Impressão ou Kindle"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Produzir Livro (PDF / Kindle)</span>
                    </button>

                    <button
                      onClick={() => onOpenStory(currentStory)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ler com os Filhos</span>
                    </button>

                    <button
                      onClick={() => exportStoryText(currentStory)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Baixar em texto"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteStory(currentStory.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chapters */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Capítulos da História
                  </h4>

                  <div className="space-y-3">
                    {currentStory.chapters.map((ch) => (
                      <div
                        key={ch.chapterNumber}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300">
                            Capítulo {ch.chapterNumber}: {ch.chapterTitle}
                          </span>
                          {ch.isFinal && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Final Feliz
                            </span>
                          )}
                        </div>

                        {ch.illustrationUrl && (
                          <div className="h-36 rounded-lg overflow-hidden border border-slate-800 my-2">
                            <img src={ch.illustrationUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {ch.narrative}
                        </p>

                        <div className="text-[11px] text-amber-200/90 pt-1 border-t border-slate-800">
                          <strong>Lição:</strong> "{ch.moralLesson}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Book Production Studio Modal (PDF Impressão & Kindle) */}
      {storyToProduce && (
        <BookProductionModal
          story={storyToProduce}
          onClose={() => setStoryToProduce(null)}
        />
      )}
    </div>
  );
};
