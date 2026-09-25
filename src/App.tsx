import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JourneySetup } from './components/JourneySetup';
import { StoryReader } from './components/StoryReader';
import { GraceNotebook } from './components/GraceNotebook';
import { Chapter, StoryPreferences, StoryChoice, SavedStory } from './types/story';

const STORAGE_KEY = 'historias_infantis_aprendizado_saved';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reader' | 'setup' | 'library'>('setup');
  const [isLoadingNextChapter, setIsLoadingNextChapter] = useState<boolean>(false);
  const [isGeneratingFirstChapter, setIsGeneratingFirstChapter] = useState<boolean>(false);

  // Active Story State
  const [currentPreferences, setCurrentPreferences] = useState<StoryPreferences | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);

  // Saved Stories
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);

  // Load saved stories on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedStories(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Erro ao carregar estante de histórias:', e);
    }
  }, []);

  const persistStories = (updated: SavedStory[]) => {
    setSavedStories(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erro ao salvar na estante:', e);
    }
  };

  // Start new child story based on parent's chosen learning goal
  const handleStartStory = async (prefs: StoryPreferences) => {
    setIsGeneratingFirstChapter(true);
    setCurrentPreferences(prefs);

    try {
      const response = await fetch('/api/stories/generate-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          children: prefs.children,
          learningGoal: prefs.learningGoal,
          setting: prefs.setting,
          favoriteTheme: prefs.favoriteTheme,
          storyTone: prefs.storyTone,
          chapterNumber: 1,
          previousChapters: [],
          selectedChoiceText: 'Início da aventura',
          isFinalChapter: false,
        }),
      });

      const data = await response.json();
      const firstChapter: Chapter = data.chapter;

      const storyId = `story-${Date.now()}`;
      setCurrentStoryId(storyId);
      setChapters([firstChapter]);
      setActiveTab('reader');

      // Auto-save to library
      const newStory: SavedStory = {
        id: storyId,
        title: firstChapter.chapterTitle,
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        preferences: prefs,
        chapters: [firstChapter],
        isCompleted: false,
      };

      persistStories([newStory, ...savedStories]);
    } catch (error) {
      console.error('Falha ao gerar primeiro capítulo:', error);
    } finally {
      setIsGeneratingFirstChapter(false);
    }
  };

  // Handle Child Choice & Next Chapter
  const handleSelectChoice = async (choice: StoryChoice) => {
    if (!currentPreferences || chapters.length === 0) return;

    setIsLoadingNextChapter(true);

    const updatedChapters = [...chapters];
    updatedChapters[updatedChapters.length - 1].chosenAction = choice.text;
    setChapters(updatedChapters);

    const nextChapterNumber = chapters.length + 1;
    const isFinal = nextChapterNumber >= 3;

    try {
      const response = await fetch('/api/stories/generate-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          children: currentPreferences.children,
          learningGoal: currentPreferences.learningGoal,
          setting: currentPreferences.setting,
          favoriteTheme: currentPreferences.favoriteTheme,
          storyTone: currentPreferences.storyTone,
          chapterNumber: nextChapterNumber,
          previousChapters: updatedChapters,
          selectedChoiceText: choice.text,
          isFinalChapter: isFinal,
        }),
      });

      const data = await response.json();
      const nextChapter: Chapter = data.chapter;

      const finalChapters = [...updatedChapters, nextChapter];
      setChapters(finalChapters);

      if (currentStoryId) {
        const updatedList = savedStories.map((s) => {
          if (s.id === currentStoryId) {
            return {
              ...s,
              chapters: finalChapters,
              isCompleted: nextChapter.isFinal,
            };
          }
          return s;
        });
        persistStories(updatedList);
      }
    } catch (error) {
      console.error('Erro ao gerar próximo capítulo:', error);
    } finally {
      setIsLoadingNextChapter(false);
    }
  };

  // Save/Bookmark
  const handleSaveToNotebook = () => {
    if (!currentPreferences || chapters.length === 0 || !currentStoryId) return;

    const exists = savedStories.some((s) => s.id === currentStoryId);
    let updated: SavedStory[];

    if (exists) {
      updated = savedStories.map((s) => (s.id === currentStoryId ? { ...s, chapters } : s));
    } else {
      const newStory: SavedStory = {
        id: currentStoryId,
        title: chapters[0]?.chapterTitle || 'Aventura dos Pequenos',
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        preferences: currentPreferences,
        chapters,
        isCompleted: chapters[chapters.length - 1]?.isFinal || false,
      };
      updated = [newStory, ...savedStories];
    }

    persistStories(updated);
  };

  const handleOpenStory = (story: SavedStory) => {
    setCurrentStoryId(story.id);
    setCurrentPreferences(story.preferences);
    setChapters(story.chapters);
    setActiveTab('reader');
  };

  const handleDeleteStory = (id: string) => {
    const filtered = savedStories.filter((s) => s.id !== id);
    persistStories(filtered);
    if (currentStoryId === id) {
      setCurrentStoryId(null);
      setCurrentPreferences(null);
      setChapters([]);
      setActiveTab('setup');
    }
  };

  const currentChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;
  const isCurrentSaved = savedStories.some((s) => s.id === currentStoryId);

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(245,158,11,0.12),rgba(255,255,255,0))]" />

      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasActiveStory={chapters.length > 0}
        savedStoriesCount={savedStories.length}
      />

      <main className="flex-1 relative z-10 pb-16">
        {activeTab === 'setup' && (
          <JourneySetup
            onStartStory={handleStartStory}
            isLoading={isGeneratingFirstChapter}
          />
        )}

        {activeTab === 'reader' && currentChapter && currentPreferences && (
          <StoryReader
            currentChapter={currentChapter}
            allChapters={chapters}
            preferences={currentPreferences}
            onSelectChoice={handleSelectChoice}
            onSaveToNotebook={handleSaveToNotebook}
            isSaved={isCurrentSaved}
            isLoadingNextChapter={isLoadingNextChapter}
            onStartNewJourney={() => setActiveTab('setup')}
          />
        )}

        {activeTab === 'library' && (
          <GraceNotebook
            savedStories={savedStories}
            onOpenStory={handleOpenStory}
            onDeleteStory={handleDeleteStory}
            onStartNewStory={() => setActiveTab('setup')}
          />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-[#050811] py-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-bold text-amber-400 text-sm uppercase tracking-wider font-sacred">
            FECHE OS OLHOS E OLHE PARA DEUS • POR FELIPE LIMA
          </p>
          <p className="text-slate-400">
            Contos e histórias infantis ilustradas sob medida para o coração, virtudes e aprendizado dos seus filhos.
          </p>
        </div>
      </footer>
    </div>
  );
}
