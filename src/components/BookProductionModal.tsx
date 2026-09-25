import React, { useState } from 'react';
import {
  Printer,
  BookOpen,
  Tablet,
  Download,
  X,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Palette,
  FileCheck,
  Send,
  Loader2,
} from 'lucide-react';
import { SavedStory } from '../types/story';
import {
  APPROVED_ART_STANDARD_GALLERY,
  ApprovedArtScene,
  renderCapaAprovadaSvg,
  getStandardIllustrationForChapter,
} from '../data/approvedArtStandard';
import {
  generatePrintablePdf,
  generateKindlePdf,
  generateKindleEpubHtml,
  triggerFileDownload,
} from '../services/bookPdfService';

interface BookProductionModalProps {
  story: SavedStory;
  onClose: () => void;
}

export function BookProductionModal({ story, onClose }: BookProductionModalProps) {
  const [format, setFormat] = useState<'print' | 'kindle_pdf' | 'kindle_ebook'>('print');
  const [authorName, setAuthorName] = useState<string>('Felipe Lima');
  const [dedicationText, setDedicationText] = useState<string>(
    `"Com todo o amor da nossa família para que você sempre lembre de fechar os olhos, respirar com tranquilidade e sentir o abraço amoroso e protetor de Deus no seu coração."`
  );

  // Selected illustrations per chapter (defaults to standard mapping)
  const [chapterImageSelection, setChapterImageSelection] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    story.chapters.forEach((ch) => {
      const standardScene = APPROVED_ART_STANDARD_GALLERY.find((s) => {
        if (ch.isFinal || ch.chapterNumber >= 3) return s.id === '04-milagre';
        if (ch.chapterNumber === 1) return s.id === '03-cestos';
        return s.id === '02-oracao';
      });
      if (standardScene) {
        initial[ch.chapterNumber] = standardScene.id;
      }
    });
    return initial;
  });

  // Active preview page (0 = Capa, 1 = Dedicatória, 2+ = Capítulos, Last = Contracapa)
  const [previewPageIndex, setPreviewPageIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);

  const kidsNames =
    story.preferences.children.map((c) => c.name).join(' e ') || 'Nossos Pequeninos';

  const totalPreviewPages = 2 + story.chapters.length + 1; // Capa + Dedicatória + Capítulos + Contracapa

  // Resolve SVG URI for a given scene ID
  const getSceneSvgUri = (sceneId: string) => {
    const scene = APPROVED_ART_STANDARD_GALLERY.find((s) => s.id === sceneId);
    if (scene) {
      const raw = scene.renderSvg();
      return `data:image/svg+xml;utf8,${encodeURIComponent(raw)}`;
    }
    return getStandardIllustrationForChapter(1, false);
  };

  // Build resolved chapter image URIs map
  const getResolvedChapterImagesMap = () => {
    const map: Record<number, string> = {};
    story.chapters.forEach((ch) => {
      const sceneId = chapterImageSelection[ch.chapterNumber];
      if (sceneId) {
        map[ch.chapterNumber] = getSceneSvgUri(sceneId);
      }
    });
    return map;
  };

  // Export handler
  const handleExport = async () => {
    setIsGenerating(true);
    setGenerateSuccess(null);

    try {
      const options = {
        authorName,
        customDedication: dedicationText,
        coverImageUri: `data:image/svg+xml;utf8,${encodeURIComponent(renderCapaAprovadaSvg(story.title, authorName))}`,
        chapterImages: getResolvedChapterImagesMap(),
      };

      const filenameSafe = `FECHE-OS-OLHOS-E-OLHE-PARA-DEUS-${kidsNames.replace(/\s+/g, '-')}`;

      if (format === 'print') {
        const doc = await generatePrintablePdf(story, options);
        doc.save(`${filenameSafe}-LIVRO-IMPRESSAO-A4.pdf`);
        setGenerateSuccess('PDF para Impressão (A4) gerado e baixado com sucesso!');
      } else if (format === 'kindle_pdf') {
        const doc = await generateKindlePdf(story, options);
        doc.save(`${filenameSafe}-KINDLE-6x9.pdf`);
        setGenerateSuccess('PDF formatado para Amazon Kindle (6x9") gerado com sucesso!');
      } else {
        const html = generateKindleEpubHtml(story, options);
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        triggerFileDownload(blob, `${filenameSafe}-KINDLE-EBOOK.html`);
        setGenerateSuccess('E-book pronto para Send-to-Kindle baixado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao gerar livro:', error);
      alert('Houve um erro ao processar a geração do livro. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090d16] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header da Central de Produção */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-slate-900 to-orange-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-[2px] shadow-lg">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-amber-400">
                <Printer className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-sacred">
                  FECHE OS OLHOS E OLHE PARA DEUS
                </h2>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  Estúdio de Produção de Livros
                </span>
              </div>
              <p className="text-xs text-amber-400/90 font-reading">
                Produção em Formato PDF para Impressão e Exportação para o Kindle • Por Felipe Lima
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo: Duas Colunas (Configurações e Pré-visualização do Livro) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna Esquerda: Configuração de Formato e Opções (5 colunas) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Escolha do Formato de Livro */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                1. Escolha o Formato de Produção
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Opção: PDF para Impressão (A4) */}
                <button
                  type="button"
                  onClick={() => setFormat('print')}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    format === 'print'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-900/20 ring-1 ring-amber-400/50'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 mt-0.5">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">PDF para Impressão (A4)</span>
                      {format === 'print' && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ideal para impressora caseira, gráfica rápida ou encadernação de livro físico com capa de luxo.
                    </p>
                  </div>
                </button>

                {/* Opção: PDF para Kindle (6x9") */}
                <button
                  type="button"
                  onClick={() => setFormat('kindle_pdf')}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    format === 'kindle_pdf'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-900/20 ring-1 ring-amber-400/50'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 mt-0.5">
                    <Tablet className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">PDF para Amazon Kindle (6x9")</span>
                      {format === 'kindle_pdf' && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Proporção oficial KDP (Kindle Direct Publishing), perfeito para telas de Kindle Paperwhite, Scribe, Oasis e app Kindle.
                    </p>
                  </div>
                </button>

                {/* Opção: E-book Kindle (Send-to-Kindle) */}
                <button
                  type="button"
                  onClick={() => setFormat('kindle_ebook')}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    format === 'kindle_ebook'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-900/20 ring-1 ring-amber-400/50'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <Send className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">E-book Kindle (Send-to-Kindle)</span>
                      {format === 'kindle_ebook' && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Arquivo semântico pronto para envio direto via amazon.com/sendtokindle ou email do seu dispositivo Kindle.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Padrão Oficial de Imagens Aprovado */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5 uppercase">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  Padrão Visual Oficial Aprovado
                </span>
                <span className="text-[10px] text-amber-400/80 font-bold">9 Cenas Oficiais</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                As ilustrações seguem o padrão 3D Pixar/Disney caloroso, com iluminação dourada volumétrica suave, Jesus acolhedor, crianças em trajes bíblicos suaves, cestos de pães e atmosfera de paz interior.
              </p>

              {/* Mini Galeria dos 9 Padrões */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {APPROVED_ART_STANDARD_GALLERY.map((scene) => (
                  <div
                    key={scene.id}
                    className="p-1.5 rounded-xl bg-slate-950/80 border border-amber-500/20 hover:border-amber-400 transition-colors text-center group"
                    title={scene.description}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 mb-1 flex items-center justify-center">
                      <img
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(scene.renderSvg())}`}
                        alt={scene.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-amber-200 truncate">{scene.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Customização: Dedicatória e Autoria */}
            <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Personalização do Livro
              </span>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Autor da Obra</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-400" />
                  Dedicatória dos Pais para {kidsNames}
                </label>
                <textarea
                  rows={3}
                  value={dedicationText}
                  onChange={(e) => setDedicationText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Botão Principal de Download / Produção */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExport}
                disabled={isGenerating}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-900/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando Livro em Alta Resolução...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    {format === 'print' && 'Baixar PDF para Impressão (A4)'}
                    {format === 'kindle_pdf' && 'Baixar PDF para o Kindle (6x9")'}
                    {format === 'kindle_ebook' && 'Baixar E-book Kindle (HTML/Send)'}
                  </>
                )}
              </button>

              {generateSuccess && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <FileCheck className="w-4 h-4 flex-shrink-0" />
                  <span>{generateSuccess}</span>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita: Pré-visualizador Interativo de Páginas do Livro (7 colunas) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-between bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-5">
            <div className="w-full flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                Pré-visualização do Livro Diagramado
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 font-bold">
                Página {previewPageIndex + 1} de {totalPreviewPages}
              </span>
            </div>

            {/* Container da Página do Livro */}
            <div className="w-full flex-1 flex items-center justify-center p-2 min-h-[460px]">
              {/* Página 1: Capa Oficial Aprovada */}
              {previewPageIndex === 0 && (
                <div className="w-full max-w-[340px] aspect-[1/1.5] rounded-xl shadow-2xl overflow-hidden border border-amber-500/30 relative">
                  <img
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(renderCapaAprovadaSvg(story.title, authorName))}`}
                    alt="Capa do Livro"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Página 2: Folha de Rosto e Dedicatória */}
              {previewPageIndex === 1 && (
                <div className="w-full max-w-[340px] aspect-[1/1.4] bg-[#fefcf6] text-slate-900 rounded-xl shadow-2xl p-6 border border-amber-400/40 flex flex-col justify-between text-center">
                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-serif font-bold tracking-widest text-amber-800 uppercase">
                      FECHE OS OLHOS E
                    </p>
                    <h3 className="text-xl font-serif font-black text-amber-600 tracking-wider">
                      OLHE PARA DEUS
                    </h3>
                    <p className="text-[10px] text-amber-900 font-sans tracking-wide">
                      HISTÓRIAS ILUSTRADAS INFANTIS DE AMOR E FÉ
                    </p>
                    <div className="w-16 h-0.5 bg-amber-500 mx-auto my-2" />
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 my-3">
                    <p className="text-xs font-serif italic text-amber-800">
                      Este livro foi feito com amor e pertence a:
                    </p>
                    <p className="text-lg font-serif font-bold text-amber-950 my-1">{kidsNames}</p>
                    <p className="text-[11px] font-serif italic text-amber-900 leading-relaxed mt-2">
                      {dedicationText}
                    </p>
                  </div>

                  <div className="text-left text-[10px] text-slate-700 space-y-1 mb-2">
                    <p>
                      <strong>Aprendizado Ensinado:</strong> {story.preferences.learningGoal}
                    </p>
                    <p>
                      <strong>Cenário:</strong> {story.preferences.setting}
                    </p>
                  </div>

                  <p className="text-[9px] text-slate-400 font-serif">
                    Obra e Direção Artística: {authorName}
                  </p>
                </div>
              )}

              {/* Páginas de Capítulos */}
              {previewPageIndex >= 2 && previewPageIndex < totalPreviewPages - 1 && (
                (() => {
                  const chIndex = previewPageIndex - 2;
                  const chapter = story.chapters[chIndex];
                  if (!chapter) return null;

                  const sceneId = chapterImageSelection[chapter.chapterNumber] || '02-oracao';
                  const sceneSvgUri = getSceneSvgUri(sceneId);

                  return (
                    <div className="w-full max-w-[340px] aspect-[1/1.4] bg-[#fffdfa] text-slate-900 rounded-xl shadow-2xl p-5 border border-amber-300/40 flex flex-col justify-between">
                      <div>
                        {/* Header da página */}
                        <div className="flex items-center justify-between text-[8px] font-bold text-amber-700 border-b border-amber-200 pb-1 mb-2">
                          <span>FECHE OS OLHOS E OLHE PARA DEUS • FELIPE LIMA</span>
                          <span>Pág. {previewPageIndex + 1}</span>
                        </div>

                        {/* Título do Capítulo */}
                        <h4 className="text-sm font-serif font-bold text-slate-900 mb-2">
                          Capítulo {chapter.chapterNumber}: {chapter.chapterTitle}
                        </h4>

                        {/* Imagem do Capítulo */}
                        <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-amber-400/50 mb-3 bg-slate-900">
                          <img
                            src={sceneSvgUri}
                            alt={chapter.chapterTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Seletor Rápido da Ilustração do Capítulo */}
                        <div className="flex items-center justify-between gap-1 mb-2 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                          <span className="text-[9px] font-bold text-amber-800">Trocar Ilustração:</span>
                          <select
                            value={sceneId}
                            onChange={(e) =>
                              setChapterImageSelection((prev) => ({
                                ...prev,
                                [chapter.chapterNumber]: e.target.value,
                              }))
                            }
                            className="text-[9px] bg-white border border-amber-300 rounded px-1.5 py-0.5 text-slate-800 font-medium"
                          >
                            {APPROVED_ART_STANDARD_GALLERY.filter((s) => s.id !== '09-capa-aprovada').map(
                              (s) => (
                                <option key={s.id} value={s.id}>
                                  {s.title}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Trecho da Narrativa */}
                        <p className="text-[10px] font-serif text-slate-800 leading-relaxed line-clamp-4">
                          {chapter.narrative}
                        </p>
                      </div>

                      {/* Lição do Coração Box */}
                      <div className="p-2.5 rounded-lg bg-amber-100/70 border border-amber-400/60 mt-2">
                        <span className="text-[9px] font-black text-amber-800 block mb-0.5">
                          ✨ LIÇÃO PARA O CORAÇÃO
                        </span>
                        <p className="text-[10px] font-serif italic text-amber-950">
                          "{chapter.moralLesson}"
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Última Página: Contracapa */}
              {previewPageIndex === totalPreviewPages - 1 && (
                <div className="w-full max-w-[340px] aspect-[1/1.4] bg-[#0f172a] text-white rounded-xl shadow-2xl p-6 border border-amber-500/40 flex flex-col justify-between text-center">
                  <div className="space-y-2 mt-6">
                    <p className="text-xs font-serif font-bold text-amber-200 tracking-widest">
                      FECHE OS OLHOS E
                    </p>
                    <h3 className="text-xl font-serif font-black text-amber-400 tracking-wider">
                      OLHE PARA DEUS
                    </h3>
                    <p className="text-[9px] text-amber-200/80 font-sans tracking-wide">
                      UMA JORNADA DE AMOR, GRAÇA E APRENDIZADO
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 my-4 text-xs font-serif text-slate-200 leading-relaxed italic">
                    "A maior herança que podemos deixar para nossos filhos é a certeza de que eles nunca estão sozinhos e que o coração deles é a morada da paz divina."
                    <p className="text-amber-400 font-sans font-bold not-italic text-[10px] mt-2">
                      — {authorName}
                    </p>
                  </div>

                  <div className="text-[9px] text-slate-400">
                    <p>Produzido com amor para {kidsNames}</p>
                    <p className="mt-1">Padrão Oficial de Imagens e Diagramação Editorial</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controles de Navegação Entre Páginas */}
            <div className="w-full flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewPageIndex((p) => Math.max(0, p - 1))}
                disabled={previewPageIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Página Anterior
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPreviewPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewPageIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      previewPageIndex === idx
                        ? 'bg-amber-400 scale-125'
                        : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Ir para página ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPreviewPageIndex((p) => Math.min(totalPreviewPages - 1, p + 1))}
                disabled={previewPageIndex === totalPreviewPages - 1}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                Próxima Página
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
