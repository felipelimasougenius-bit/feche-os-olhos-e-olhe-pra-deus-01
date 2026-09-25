import jsPDF from 'jspdf';
import { SavedStory, Chapter, StoryPreferences } from '../types/story';
import {
  APPROVED_ART_STANDARD_GALLERY,
  renderCapaAprovadaSvg,
  getStandardIllustrationForChapter,
} from '../data/approvedArtStandard';

// Convert an SVG string or SVG dataURI to a high-res PNG dataURI via offscreen canvas
export function svgToPngDataUrl(svgOrUri: string, width = 800, height = 500): Promise<string> {
  return new Promise((resolve, reject) => {
    let src = svgOrUri;
    if (!svgOrUri.startsWith('data:image/svg+xml')) {
      src = `data:image/svg+xml;utf8,${encodeURIComponent(svgOrUri)}`;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(src);
        }
        // Smooth background fill
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png', 0.95));
      } catch (err) {
        console.warn('Canvas conversion fallback:', err);
        resolve(src);
      }
    };

    img.onerror = () => {
      // Fallback
      resolve(src);
    };

    img.src = src;
  });
}

export interface BookPdfOptions {
  authorName?: string;
  customDedication?: string;
  coverImageUri?: string;
  chapterImages?: Record<number, string>; // map of chapterIndex -> imageUri
  includeColorBoxes?: boolean;
}

/**
 * 1. GERAÇÃO DE PDF PARA IMPRESSÃO (Formato A4 - 210 x 297 mm)
 * Diagramação completa pronta para gráfica rápida, impressora caseira ou encadernação.
 */
export async function generatePrintablePdf(
  story: SavedStory,
  options: BookPdfOptions = {}
): Promise<jsPDF> {
  const author = options.authorName || 'Felipe Lima';
  const kidsNames =
    story.preferences.children.map((c) => c.name).join(' e ') || 'Nossos Pequeninos';

  // Formato A4 padrão (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // ==========================================
  // PÁGINA 1: CAPA OFICIAL APROVADA
  // ==========================================
  // Renderizar a capa oficial aprovada em alta resolução
  const coverSvg = options.coverImageUri || renderCapaAprovadaSvg(story.title || 'FECHE OS OLHOS E OLHE PARA DEUS', author);
  try {
    const coverPng = await svgToPngDataUrl(coverSvg, 800, 1140);
    doc.addImage(coverPng, 'PNG', 0, 0, pageWidth, pageHeight);
  } catch (e) {
    // Fallback elegante caso a imagem falhe
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  }

  // ==========================================
  // PÁGINA 2: FOLHA DE ROSTO E DEDICATÓRIA
  // ==========================================
  doc.addPage('a4', 'portrait');

  // Fundo suave e bordas decorativas
  doc.setFillColor(254, 252, 246); // Marfim aconchegante de livro
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Moldura dourada elegante
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.8);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2 - 8));
  doc.setLineWidth(0.2);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin * 2 - 4));

  let cursorY = 50;

  // Título da Obra
  doc.setFont('times', 'bold');
  doc.setTextColor(69, 26, 3);
  doc.setFontSize(24);
  doc.text('FECHE OS OLHOS E', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 10;
  doc.setFontSize(30);
  doc.setTextColor(180, 83, 9);
  doc.text('OLHE PARA DEUS', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(120, 53, 15);
  doc.text('HISTÓRIAS ILUSTRADAS INFANTIS DE AMOR E FÉ', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 15;

  // Linha dourada
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.6);
  doc.line(pageWidth / 2 - 40, cursorY, pageWidth / 2 + 40, cursorY);
  cursorY += 25;

  // Box de Dedicatória com Selo
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin + 10, cursorY, contentWidth - 20, 75, 4, 4, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin + 10, cursorY, contentWidth - 20, 75, 4, 4, 'S');

  let dedY = cursorY + 14;
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(120, 53, 15);
  doc.text('Este livro foi feito com amor e pertence a:', pageWidth / 2, dedY, { align: 'center' });
  dedY += 12;

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(69, 26, 3);
  doc.text(kidsNames, pageWidth / 2, dedY, { align: 'center' });
  dedY += 14;

  const defaultDedication =
    options.customDedication ||
    `"Que em cada momento do seu dia, você lembre de fechar os olhos com tranquilidade e sentir o abraço caloroso e protetor de Deus no seu coração."`;

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(113, 63, 18);
  const splitDedication = doc.splitTextToSize(defaultDedication, contentWidth - 40);
  doc.text(splitDedication, pageWidth / 2, dedY, { align: 'center' });

  cursorY += 95;

  // Detalhes do Aprendizado Pedagógico
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(69, 26, 3);
  doc.text('APRENDIZADO CENTRAL DESTA HISTÓRIA:', margin + 15, cursorY);
  cursorY += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 50, 20);
  const splitGoal = doc.splitTextToSize(`"${story.preferences.learningGoal}"`, contentWidth - 30);
  doc.text(splitGoal, margin + 15, cursorY);
  cursorY += splitGoal.length * 6 + 12;

  doc.text(`Cenário da Aventura: ${story.preferences.setting}`, margin + 15, cursorY);
  cursorY += 6;
  doc.text(`Tema Favorito: ${story.preferences.favoriteTheme}`, margin + 15, cursorY);
  cursorY += 6;
  doc.text(`Data de Criação: ${story.date || new Date().toLocaleDateString('pt-BR')}`, margin + 15, cursorY);

  // Rodapé da Folha de Rosto
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Obra e Direção Artística: ${author}`, pageWidth / 2, pageHeight - margin - 4, { align: 'center' });

  // ==========================================
  // PÁGINAS DE CAPÍTULOS (DIAGRAMAÇÃO DE LIVRO ILUSTRADO)
  // ==========================================
  for (let i = 0; i < story.chapters.length; i++) {
    const chapter = story.chapters[i];
    doc.addPage('a4', 'portrait');

    // Fundo marfim suave para leitura descansada
    doc.setFillColor(255, 253, 248);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Cabeçalho superior sutil
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text('FECHE OS OLHOS E OLHE PARA DEUS • POR FELIPE LIMA', margin, margin);
    doc.text(`Página ${i + 3}`, pageWidth - margin, margin, { align: 'right' });

    doc.setDrawColor(254, 215, 170);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 3, pageWidth - margin, margin + 3);

    let chY = margin + 12;

    // Título do Capítulo
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(69, 26, 3);
    doc.text(`Capítulo ${chapter.chapterNumber}: ${chapter.chapterTitle}`, margin, chY);
    chY += 8;

    // Ilustração no Padrão Aprovado (3D Pixar / Bíblico Afetuoso)
    const illustrationRaw =
      options.chapterImages?.[chapter.chapterNumber] ||
      chapter.illustrationUrl ||
      getStandardIllustrationForChapter(chapter.chapterNumber, chapter.isFinal);

    const imgHeight = 85;
    const imgWidth = contentWidth;

    try {
      const pngUri = await svgToPngDataUrl(illustrationRaw, 800, 480);
      // Moldura da imagem
      doc.setDrawColor(217, 119, 6);
      doc.setLineWidth(0.6);
      doc.rect(margin - 0.5, chY - 0.5, imgWidth + 1, imgHeight + 1);
      doc.addImage(pngUri, 'PNG', margin, chY, imgWidth, imgHeight);
    } catch (e) {
      doc.setFillColor(254, 243, 199);
      doc.rect(margin, chY, imgWidth, imgHeight, 'F');
    }

    chY += imgHeight + 10;

    // Texto Narrativo do Capítulo
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);

    const paragraphs = chapter.narrative.split('\n\n').filter((p) => p.trim());
    for (const paragraph of paragraphs) {
      const splitLines = doc.splitTextToSize(paragraph, contentWidth);
      doc.text(splitLines, margin, chY);
      chY += splitLines.length * 6.2 + 3;
    }

    chY += 4;

    // BOX: "Lição para o Coração"
    const boxHeight = 28;
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin, chY, contentWidth, boxHeight, 3, 3, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, chY, contentWidth, boxHeight, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(180, 83, 9);
    doc.text('✨ LIÇÃO PARA O CORAÇÃO', margin + 6, chY + 7);

    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(69, 26, 3);
    const splitLesson = doc.splitTextToSize(`"${chapter.moralLesson}"`, contentWidth - 12);
    doc.text(splitLesson, margin + 6, chY + 15);

    chY += boxHeight + 8;

    // Decisão da Criança (se houver)
    if (chapter.chosenAction) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Escolha de ${kidsNames}: "${chapter.chosenAction}"`, margin, chY);
    }
  }

  // ==========================================
  // PÁGINA FINAL: CONTRACAPA / FECHAMENTO FAMILIAR
  // ==========================================
  doc.addPage('a4', 'portrait');
  doc.setFillColor(15, 23, 42); // Azul escuro sagrado profundo
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Moldura decorativa na contracapa
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);

  let backY = 60;

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(254, 243, 199);
  doc.text('FECHE OS OLHOS E', pageWidth / 2, backY, { align: 'center' });
  backY += 10;
  doc.setFontSize(28);
  doc.setTextColor(251, 191, 36);
  doc.text('OLHE PARA DEUS', pageWidth / 2, backY, { align: 'center' });
  backY += 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(217, 119, 6);
  doc.text('UMA JORNADA DE AMOR, GRAÇA E APRENDIZADO', pageWidth / 2, backY, { align: 'center' });
  backY += 25;

  // Sinopse
  const backText = `Este livro personalizado foi concebido para ensinar valores eternos aos pequenos, mostrando que não importa a situação do dia a dia, sempre podemos encontrar paz, sabedoria e amor quando aprendemos a fechar os olhos e nos conectar com Deus.`;
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(226, 232, 240);
  const splitBack = doc.splitTextToSize(backText, contentWidth - 30);
  doc.text(splitBack, pageWidth / 2, backY, { align: 'center' });
  backY += splitBack.length * 7 + 25;

  // Mensagem do autor Felipe Lima
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin + 15, backY, contentWidth - 30, 45, 4, 4, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 15, backY, contentWidth - 30, 45, 4, 4, 'S');

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(254, 240, 138);
  const quoteAuthor = `"A maior herança que podemos deixar para nossos filhos é a certeza de que eles nunca estão sozinhos e que o coração deles é a morada da paz divina."`;
  const splitQuote = doc.splitTextToSize(quoteAuthor, contentWidth - 45);
  doc.text(splitQuote, pageWidth / 2, backY + 12, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(251, 191, 36);
  doc.text(`— ${author}`, pageWidth / 2, backY + 36, { align: 'center' });

  // Selo de Leitura Familiar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Edição Especial da Família • Produzida para Leitura e Impressão', pageWidth / 2, pageHeight - margin - 15, { align: 'center' });

  return doc;
}

/**
 * 2. GERAÇÃO DE PDF FORMATADO PARA O AMAZON KINDLE (6 x 9 polegadas / 152.4 x 228.6 mm)
 * Otimizado especificamente para telas e-ink e o leitor de PDF do Kindle (Paperwhite, Oasis, Scribe e App Kindle).
 */
export async function generateKindlePdf(
  story: SavedStory,
  options: BookPdfOptions = {}
): Promise<jsPDF> {
  const author = options.authorName || 'Felipe Lima';
  const kidsNames =
    story.preferences.children.map((c) => c.name).join(' e ') || 'Nossos Pequeninos';

  // Tamanho 6 x 9 polegadas (152.4 mm x 228.6 mm) - Proporção padrão do Kindle KDP
  const kindleWidth = 152.4;
  const kindleHeight = 228.6;
  const margin = 14;
  const contentWidth = kindleWidth - margin * 2;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [kindleWidth, kindleHeight],
  });

  // Capa Kindle
  const coverSvg = options.coverImageUri || renderCapaAprovadaSvg(story.title || 'FECHE OS OLHOS E OLHE PARA DEUS', author);
  try {
    const coverPng = await svgToPngDataUrl(coverSvg, 700, 1050);
    doc.addImage(coverPng, 'PNG', 0, 0, kindleWidth, kindleHeight);
  } catch (e) {
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, kindleWidth, kindleHeight, 'F');
  }

  // Página 2: Folha de Rosto Kindle
  doc.addPage([kindleWidth, kindleHeight], 'portrait');
  doc.setFillColor(255, 255, 255); // Branco puro para máximo contraste em e-ink
  doc.rect(0, 0, kindleWidth, kindleHeight, 'F');

  let curY = 40;
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text('FECHE OS OLHOS E', kindleWidth / 2, curY, { align: 'center' });
  curY += 8;
  doc.setFontSize(24);
  doc.text('OLHE PARA DEUS', kindleWidth / 2, curY, { align: 'center' });
  curY += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Por ${author}`, kindleWidth / 2, curY, { align: 'center' });
  curY += 20;

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin + 10, curY, kindleWidth - margin - 10, curY);
  curY += 20;

  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('Dedicatória Especial para:', kindleWidth / 2, curY, { align: 'center' });
  curY += 8;
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.text(kidsNames, kindleWidth / 2, curY, { align: 'center' });
  curY += 16;

  const dedication =
    options.customDedication ||
    `"Feche os olhos, respire fundo e sinta a paz de Deus guiando o seu coração em cada passo da sua vida."`;
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  const splitDed = doc.splitTextToSize(dedication, contentWidth - 10);
  doc.text(splitDed, kindleWidth / 2, curY, { align: 'center' });

  curY += splitDed.length * 6 + 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('APRENDIZADO CENTRAL:', margin, curY);
  curY += 5;
  doc.setFont('helvetica', 'normal');
  const splitGoal = doc.splitTextToSize(`"${story.preferences.learningGoal}"`, contentWidth);
  doc.text(splitGoal, margin, curY);

  // Capítulos para o Kindle
  for (let i = 0; i < story.chapters.length; i++) {
    const chapter = story.chapters[i];
    doc.addPage([kindleWidth, kindleHeight], 'portrait');
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, kindleWidth, kindleHeight, 'F');

    // Cabeçalho Kindle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('FECHE OS OLHOS E OLHE PARA DEUS', margin, margin);
    doc.text(`${i + 3}`, kindleWidth - margin, margin, { align: 'right' });

    let chY = margin + 10;
    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42);
    doc.text(`Capítulo ${chapter.chapterNumber}: ${chapter.chapterTitle}`, margin, chY);
    chY += 8;

    // Ilustração Otimizada
    const illustrationRaw =
      options.chapterImages?.[chapter.chapterNumber] ||
      chapter.illustrationUrl ||
      getStandardIllustrationForChapter(chapter.chapterNumber, chapter.isFinal);

    const imgHeight = 65;
    try {
      const pngUri = await svgToPngDataUrl(illustrationRaw, 700, 420);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.rect(margin - 0.3, chY - 0.3, contentWidth + 0.6, imgHeight + 0.6);
      doc.addImage(pngUri, 'PNG', margin, chY, contentWidth, imgHeight);
    } catch {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, chY, contentWidth, imgHeight, 'F');
    }

    chY += imgHeight + 8;

    // Texto Narrativo (com tipografia em tamanho perfeito para Kindle)
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    const paragraphs = chapter.narrative.split('\n\n').filter((p) => p.trim());
    for (const p of paragraphs) {
      const split = doc.splitTextToSize(p, contentWidth);
      doc.text(split, margin, chY);
      chY += split.length * 5.4 + 3;
    }

    // Lição do Coração
    chY += 2;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, chY, contentWidth, 22, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, chY, contentWidth, 22, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(180, 83, 9);
    doc.text('LIÇÃO PARA O CORAÇÃO:', margin + 4, chY + 6);

    doc.setFont('times', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    const splitLes = doc.splitTextToSize(`"${chapter.moralLesson}"`, contentWidth - 8);
    doc.text(splitLes, margin + 4, chY + 13);
  }

  // Contracapa Kindle
  doc.addPage([kindleWidth, kindleHeight], 'portrait');
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, kindleWidth, kindleHeight, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(254, 243, 199);
  doc.text('FECHE OS OLHOS E', kindleWidth / 2, 60, { align: 'center' });
  doc.setFontSize(22);
  doc.setTextColor(251, 191, 36);
  doc.text('OLHE PARA DEUS', kindleWidth / 2, 70, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  const endNote = `Histórias que tocam o coração e ensinam virtudes eternas.\n\nEdição E-reader / Kindle Direct Publishing`;
  doc.text(endNote, kindleWidth / 2, 95, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(251, 191, 36);
  doc.text(`Autor: ${author}`, kindleWidth / 2, kindleHeight - 30, { align: 'center' });

  return doc;
}

/**
 * 3. GERAÇÃO DE PACOTE KINDLE / E-BOOK (HTML / EPUB-Ready para Send-to-Kindle)
 * Permite enviar diretamente pelo serviço "Send to Kindle" da Amazon (amazon.com/sendtokindle)
 */
export function generateKindleEpubHtml(
  story: SavedStory,
  options: BookPdfOptions = {}
): string {
  const author = options.authorName || 'Felipe Lima';
  const kidsNames =
    story.preferences.children.map((c) => c.name).join(' e ') || 'Nossos Pequeninos';

  let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>FECHE OS OLHOS E OLHE PARA DEUS - ${kidsNames}</title>
  <style>
    body {
      font-family: "Georgia", "Palatino", serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #faf8f5;
      margin: 0;
      padding: 24px;
    }
    .cover-container {
      text-align: center;
      padding: 40px 20px;
      background: #0f172a;
      color: #fef08a;
      border-radius: 12px;
      margin-bottom: 40px;
    }
    .book-title {
      font-size: 2.2rem;
      font-weight: 900;
      color: #fbbf24;
      margin-bottom: 8px;
    }
    .book-author {
      font-size: 1.1rem;
      color: #cbd5e1;
      font-style: italic;
    }
    .dedication-card {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 40px;
    }
    .chapter-section {
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 2px dashed #e2e8f0;
    }
    .chapter-title {
      font-size: 1.6rem;
      color: #78350f;
      margin-top: 0;
    }
    .chapter-image {
      width: 100%;
      max-width: 600px;
      border-radius: 12px;
      border: 2px solid #f59e0b;
      margin: 16px 0;
    }
    .heart-lesson {
      background: #fef9c3;
      border-left: 6px solid #d97706;
      padding: 16px;
      margin-top: 20px;
      border-radius: 6px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="cover-container">
    <div class="book-title">FECHE OS OLHOS E OLHE PARA DEUS</div>
    <div class="book-author">Por ${author}</div>
    <p style="color: #fde68a; margin-top: 16px;">Edição Dedicada com Amor para <strong>${kidsNames}</strong></p>
  </div>

  <div class="dedication-card">
    <h3 style="color: #92400e; margin-top: 0;">Aprendizado Ensinado nesta História:</h3>
    <p style="font-size: 1.2rem; font-weight: bold; color: #451a03;">"${story.preferences.learningGoal}"</p>
    <p style="color: #78350f;"><em>${options.customDedication || '"Feche os olhos, respire com tranquilidade e sinta a doce presença e proteção de Deus no seu coração."'}</em></p>
  </div>
`;

  story.chapters.forEach((ch) => {
    html += `
  <div class="chapter-section">
    <h2 class="chapter-title">Capítulo ${ch.chapterNumber}: ${ch.chapterTitle}</h2>
    <p>${ch.narrative.replace(/\n\n/g, '</p><p>')}</p>
    <div class="heart-lesson">
      <strong>✨ Lição para o Coração:</strong> "${ch.moralLesson}"
    </div>
    ${ch.chosenAction ? `<p style="font-size: 0.9rem; color: #64748b; margin-top: 12px;"><strong>Decisão de ${kidsNames}:</strong> "${ch.chosenAction}"</p>` : ''}
  </div>`;
  });

  html += `
  <div style="text-align: center; padding: 30px; color: #64748b; font-size: 0.9rem;">
    FECHE OS OLHOS E OLHE PARA DEUS • Obra criada por ${author}<br>
    Arquivo preparado para exportação e leitura no Amazon Kindle.
  </div>
</body>
</html>`;

  return html;
}

// Download helper
export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
