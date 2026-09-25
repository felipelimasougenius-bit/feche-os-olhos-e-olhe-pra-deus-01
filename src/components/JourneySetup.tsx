import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  BookOpen,
  Plus,
  Trash2,
  Smile,
  Wand2,
  CheckCircle2,
  Compass,
  Baby,
  Star,
  Shield,
  Lightbulb,
  Printer,
  Tablet,
  Palette,
} from 'lucide-react';
import { StoryPreferences, ChildProfile } from '../types/story';

interface JourneySetupProps {
  onStartStory: (prefs: StoryPreferences) => void;
  isLoading: boolean;
}

// Botões com aprendizados rápidos comuns que os pais costumam buscar
const COMMON_LEARNING_PILLS = [
  {
    title: 'Dividir & Compartilhar',
    desc: 'Aprender a emprestar brinquedos e brincar junto com alegria',
    icon: '🧸',
  },
  {
    title: 'Lidar com a Raiva & Frustração',
    desc: 'Respirar fundo e falar o que sente em vez de bater ou gritar',
    icon: '🧘',
  },
  {
    title: 'Paciência & Saber Esperar',
    desc: 'Entender que cada coisa tem o seu momento certo',
    icon: '⏳',
  },
  {
    title: 'Dizer a Verdade com Coragem',
    desc: 'Honestidade e confiança com os pais mesmo após um erro',
    icon: '🌟',
  },
  {
    title: 'Amor & Cuidado entre Irmãos',
    desc: 'Apoiar, proteger e ser amigo do irmão ou irmã',
    icon: '🤝',
  },
  {
    title: 'Coragem para Dormir no Próprio Quarto',
    desc: 'Superar o medo do escuro sabendo que está protegido',
    icon: '🌙',
  },
  {
    title: 'Experimentar Comidas Novas',
    desc: 'Provar legumes e frutas coloridas sem fazer birra',
    icon: '🥦',
  },
  {
    title: 'Empatia & Respeito aos Amigos',
    desc: 'Colocar-se no lugar do colega e nunca fazer bullying',
    icon: '💛',
  },
];

const SETTING_OPTIONS = [
  { id: 'floresta', name: 'Floresta Encantada', icon: '🌲', desc: 'Árvores falantes, cogumelos brilhantes e animais fofos' },
  { id: 'espaco', name: 'Planeta das Estrelas', icon: '🚀', desc: 'Foguetes, constelações coloridas e pequenos alienígenas amigos' },
  { id: 'fundo_mar', name: 'Reino do Fundo do Mar', icon: '🐬', desc: 'Golfinhos brincalhões, recifes de corais e conchas mágicas' },
  { id: 'castelo', name: 'Reino dos Animais Guardiões', icon: '🏰', desc: 'Castelos amigáveis, pontes de arco-íris e banquetes de frutas' },
  { id: 'dia_a_dia', name: 'Cidadezinha & Escola Mágica', icon: '🏫', desc: 'Parquinho, escola e casa com pequenas surpresas fantásticas' },
];

const THEME_OPTIONS = [
  { label: 'Animais falantes e fofinhos', icon: '🦊' },
  { label: 'Pequenos super-heróis em treinamento', icon: '🦸' },
  { label: 'Dinossauros amigáveis', icon: '🦕' },
  { label: 'Fadas, duendes e seres da natureza', icon: '🧚' },
  { label: 'Detetives curiosos e inventores', icon: '🔍' },
];

export const JourneySetup: React.FC<JourneySetupProps> = ({ onStartStory, isLoading }) => {
  // Filhos
  const [children, setChildren] = useState<ChildProfile[]>([
    { name: '', age: '' },
  ]);

  // Aprendizado que o usuário escreve ou seleciona
  const [learningGoal, setLearningGoal] = useState<string>('');
  const [selectedPill, setSelectedPill] = useState<string | null>(null);

  // Cenário e tema
  const [selectedSettingId, setSelectedSettingId] = useState<string>('floresta');
  const [customSetting, setCustomSetting] = useState<string>('');
  
  const [selectedThemePreset, setSelectedThemePreset] = useState<string>('Animais falantes e fofinhos');
  const [customTheme, setCustomTheme] = useState<string>('');
  
  const [storyTone, setStoryTone] = useState<'divertido' | 'doce_para_dormir' | 'aventura' | 'poetico'>('divertido');

  // Adicionar outro filho
  const addChild = () => {
    if (children.length < 4) {
      setChildren([...children, { name: '', age: '' }]);
    }
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (index: number, field: 'name' | 'age', value: string) => {
    const next = [...children];
    next[index][field] = value;
    setChildren(next);
  };

  // Quando clica num botão de aprendizado pré-definido
  const handleSelectPill = (pill: typeof COMMON_LEARNING_PILLS[0]) => {
    setSelectedPill(pill.title);
    setLearningGoal(`${pill.title}: ${pill.desc}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filtra filhos com nome preenchido ou atribui padrão
    const validChildren = children
      .filter((c) => c.name.trim().length > 0)
      .map((c) => ({ name: c.name.trim(), age: c.age?.trim() || undefined }));

    const finalChildren: ChildProfile[] =
      validChildren.length > 0 ? validChildren : [{ name: 'Nossos Pequenos', age: '5' }];

    const finalLearningGoal =
      learningGoal.trim() ||
      'Aprender a compartilhar brinquedos, praticar a empatia e respeitar os sentimentos dos outros';

    // Cenário final: usa o texto personalizado se preenchido, ou a opção selecionada
    const selectedSettingObj = SETTING_OPTIONS.find((s) => s.id === selectedSettingId);
    const finalSetting = customSetting.trim()
      ? customSetting.trim()
      : selectedSettingObj
      ? `${selectedSettingObj.name}: ${selectedSettingObj.desc}`
      : 'Floresta Encantada com animais falantes';

    // Tema final: usa o texto personalizado se preenchido, ou o tema selecionado
    const finalFavoriteTheme = customTheme.trim()
      ? customTheme.trim()
      : selectedThemePreset;

    onStartStory({
      children: finalChildren,
      learningGoal: finalLearningGoal,
      setting: finalSetting,
      favoriteTheme: finalFavoriteTheme,
      storyTone,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative text-center rounded-3xl bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-transparent border border-amber-400/30 p-8 sm:p-10 shadow-xl overflow-hidden">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Histórias Infantis Ilustradas para o <span className="text-amber-400">Aprendizado & Coração</span> dos seus Filhos
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Sem opções prontas! Na obra <strong>"FECHE OS OLHOS E OLHE PARA DEUS"</strong>, você descreve o valor, virtude ou aprendizado que deseja ensinar, e Felipe Lima cria um conto infantil ilustrado único onde os seus filhos são os heróis.
        </p>

        {/* Padrão Oficial de Imagens & Produção para Impressão e Kindle */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-3 px-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200">
          <span className="flex items-center gap-1.5 font-bold text-amber-300">
            <Palette className="w-4 h-4 text-amber-400" />
            Padrão de Imagens 3D Pixar Aprovado
          </span>
          <span className="hidden sm:inline text-amber-500/50">•</span>
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Printer className="w-4 h-4 text-amber-400" />
            PDF para Impressão (A4)
          </span>
          <span className="hidden sm:inline text-amber-500/50">•</span>
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Tablet className="w-4 h-4 text-amber-400" />
            Exportação para o Amazon Kindle (6x9")
          </span>
        </div>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
        {/* Step 1: O Aprendizado (The Heart of the Request) */}
        <div className="space-y-4 p-5 sm:p-6 rounded-2xl bg-amber-950/20 border-2 border-amber-500/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                1. Qual aprendizado você quer que seu(s) filho(s) tenham?
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/80">
                Você pode escrever com suas próprias palavras ou clicar em um dos botões abaixo como inspiração.
              </p>
            </div>
          </div>

          {/* Botões com aprendizados comuns */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Sugestões rápidas de valores (clique para aplicar):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COMMON_LEARNING_PILLS.map((pill) => {
                const isSelected = selectedPill === pill.title;
                return (
                  <button
                    type="button"
                    key={pill.title}
                    onClick={() => handleSelectPill(pill)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400 text-amber-100 ring-2 ring-amber-400/30 font-medium'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-amber-500/40 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{pill.icon}</span>
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{pill.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{pill.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo aberto para o usuário escrever exatamente o que quiser */}
          <div className="space-y-2 pt-3">
            <label className="block text-xs sm:text-sm font-bold text-amber-300">
              ✍️ Ou escreva detalhadamente o aprendizado que precisa ensinar hoje:
            </label>
            <textarea
              rows={3}
              value={learningGoal}
              onChange={(e) => {
                setLearningGoal(e.target.value);
                setSelectedPill(null); // Desmarca botão se digitou livremente
              }}
              placeholder="Exemplo: Quero que o Pedro entenda que não precisa chorar quando perde um jogo, e que o mais legal é brincar e se divertir com os amigos..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
              required
            />
            <p className="text-[11px] text-slate-400 italic">
              Dica: Conte uma situação real do dia a dia (birra, ciúme de irmãos, medo de tentar algo novo) que a história abordará com amor e empatia.
            </p>
          </div>
        </div>

        {/* Step 2: Quem são os Pequenos Heróis? */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Baby className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                2. Nome do seu filho ou filhos protagonistas:
              </h2>
            </div>
            {children.length < 4 && (
              <button
                type="button"
                onClick={addChild}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar outro filho
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {children.map((child, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800"
              >
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) => updateChild(index, 'name', e.target.value)}
                    placeholder={`Nome da criança ${children.length > 1 ? `#${index + 1}` : ''} (ex: Sofia)`}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                    required={index === 0}
                  />
                </div>
                <div className="w-24">
                  <input
                    type="text"
                    value={child.age || ''}
                    onChange={(e) => updateChild(index, 'age', e.target.value)}
                    placeholder="Idade (ex: 4)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none text-center"
                  />
                </div>
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(index)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Onde se passa a aventura? */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            3. Cenário onde a magia vai acontecer:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SETTING_OPTIONS.map((opt) => {
              const isSelected = selectedSettingId === opt.id && !customSetting.trim();
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    setSelectedSettingId(opt.id);
                    setCustomSetting(''); // Limpa escrita personalizada ao clicar em sugestão
                  }}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md ring-2 ring-amber-400/30'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{opt.icon}</span>
                  <div className="text-xs font-bold text-white">{opt.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{opt.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Campo para escrita personalizada do Cenário (Campo 3) */}
          <div className="pt-2 space-y-1.5">
            <label className="block text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <span>✍️ Ou descreva um cenário personalizado:</span>
              {customSetting.trim() && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Ativo na história
                </span>
              )}
            </label>
            <input
              type="text"
              value={customSetting}
              onChange={(e) => setCustomSetting(e.target.value)}
              placeholder="Ex: Um sítio aconchegante com cachoeira cristalina e passarinhos cantores..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white placeholder-slate-500 text-xs outline-none transition-all"
            />
            <p className="text-[11px] text-slate-400 italic">
              Ao digitar aqui, a aventura se passará exatamente no lugar que você descreveu.
            </p>
          </div>
        </div>

        {/* Step 4: Tema favorito & Tom da História */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300">
              4. Personagens ou tema que a criança mais ama:
            </label>
            <select
              value={selectedThemePreset}
              onChange={(e) => {
                setSelectedThemePreset(e.target.value);
                setCustomTheme(''); // Limpa se escolheu da lista
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 outline-none"
            >
              {THEME_OPTIONS.map((th) => (
                <option key={th.label} value={th.label}>
                  {th.icon} {th.label}
                </option>
              ))}
            </select>

            {/* Campo para escrita personalizada do Tema/Personagens (Campo 4) */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                <span>✍️ Ou personalize o tema / personagens:</span>
                {customTheme.trim() && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Ativo na história
                  </span>
                )}
              </label>
              <input
                type="text"
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="Ex: O cachorrinho caramelo Bob, naves espaciais e robôs gentis..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white placeholder-slate-500 text-xs outline-none transition-all"
              />
              <p className="text-[11px] text-slate-400 italic">
                Você pode citar brinquedos favoritos, animais de estimação reais ou personagens preferidos.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              5. Ritmo e clima da leitura:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStoryTone('divertido')}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  storyTone === 'divertido'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                😄 Divertido & Alegre
              </button>
              <button
                type="button"
                onClick={() => setStoryTone('doce_para_dormir')}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  storyTone === 'doce_para_dormir'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                🌙 Doce p/ Dormir
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            🎨 A história é gerada com ilustrações exclusivas e escolhas interativas para o seu filho!
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-950/60 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Ilustrando e criando a história...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-slate-950" />
                <span>Criar História Ilustrada Agora</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
