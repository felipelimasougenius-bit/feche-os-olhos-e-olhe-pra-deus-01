export interface StoryChoice {
  id: string;
  text: string;
  lessonFocus?: string;
}

export interface Chapter {
  chapterNumber: number;
  chapterTitle: string;
  narrative: string;
  moralLesson: string; // O ensinamento / reflexão para a criança
  illustrationPrompt: string; // Descrição da cena para ilustração
  illustrationUrl?: string; // Imagem SVG/ilustrada gerada
  isFinal: boolean;
  choices: StoryChoice[];
  chosenAction?: string;
}

export interface ChildProfile {
  name: string;
  age?: string;
}

export interface StoryPreferences {
  children: ChildProfile[];
  learningGoal: string; // O aprendizado que os pais querem transmitir (ex: compartilhar brinquedos, lidar com a raiva, paciência, honestidade, amor entre irmãos)
  setting: string; // Onde se passa (Floresta Mágica, Espaço sideral, Fundo do Mar, Reino dos Animais, Cidade Encantada, etc.)
  favoriteTheme: string; // Animais falantes, super-heróis, dinossauros fofos, astronautas, magia e fadas, etc.
  storyTone: 'divertido' | 'doce_para_dormir' | 'aventura' | 'poetico';
}

export interface SavedStory {
  id: string;
  title: string;
  date: string;
  preferences: StoryPreferences;
  chapters: Chapter[];
  isCompleted: boolean;
}

export type ReadingTheme = 'daylight' | 'bedtime' | 'enchanted';
