import express, { Request, Response } from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

interface StoryChoice {
  id: string;
  text: string;
  lessonFocus?: string;
}

interface ChapterPayload {
  chapterNumber: number;
  chapterTitle: string;
  narrative: string;
  moralLesson: string;
  illustrationPrompt: string;
  illustrationUrl?: string;
  isFinal: boolean;
  choices: StoryChoice[];
}

// Generates illustrations following the approved 3D Pixar / Biblical style standard of "FECHE OS OLHOS E OLHE PARA DEUS" by Felipe Lima
function generateStorybookSvg(prompt: string, title: string, chapterNum: number): string {
  const isFinal = chapterNum >= 3;
  const isFirst = chapterNum === 1;

  if (isFinal) {
    // Milagre e Celebração Final (Padrão 04-milagre)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
      <defs>
        <linearGradient id="skyMilagre" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="40%" stop-color="#7c2d12"/>
          <stop offset="75%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#fef3c7"/>
        </linearGradient>
        <radialGradient id="sunBurst" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="30%" stop-color="#fef08a" stop-opacity="0.7"/>
          <stop offset="70%" stop-color="#f59e0b" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="480" fill="url(#skyMilagre)"/>
      <circle cx="400" cy="180" r="300" fill="url(#sunBurst)"/>
      <g opacity="0.3">
        <polygon points="400,100 150,480 250,480" fill="#fef08a"/>
        <polygon points="400,100 350,480 450,480" fill="#fef08a"/>
        <polygon points="400,100 550,480 650,480" fill="#fef08a"/>
      </g>
      <path d="M-50,340 Q200,280 450,330 T850,310 L850,480 L-50,480 Z" fill="#78350f" opacity="0.9"/>
      <path d="M-50,380 Q150,330 400,370 T850,360 L850,480 L-50,480 Z" fill="#451a03"/>
      <g transform="translate(400, 310)">
        <ellipse cx="0" cy="45" rx="140" ry="35" fill="#000000" opacity="0.45"/>
        <path d="M-110,10 Q0,95 110,10 Q60,-10 0,-5 Q-60,-10 -110,10 Z" fill="#92400e" stroke="#78350f" stroke-width="3"/>
        <path d="M-90,20 L-80,45 M-50,25 L-40,55 M0,28 L0,60 M50,25 L40,55 M90,20 L80,45" stroke="#b45309" stroke-width="3"/>
        <circle cx="-50" cy="-15" r="28" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
        <circle cx="50" cy="-15" r="28" fill="#fbbf24" stroke="#d97706" stroke-width="2.5"/>
        <circle cx="-15" cy="-30" r="30" fill="#f59e0b" stroke="#d97706" stroke-width="2.5"/>
        <circle cx="20" cy="-28" r="30" fill="#fde68a" stroke="#d97706" stroke-width="2.5"/>
        <circle cx="0" cy="-55" r="32" fill="#fef08a" stroke="#f59e0b" stroke-width="2.5"/>
        <circle cx="-2" cy="-60" r="5" fill="#ffffff"/>
      </g>
      <rect x="180" y="16" width="440" height="42" rx="21" fill="rgba(15, 23, 42, 0.85)" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="400" y="42" font-family="'Cinzel', 'Georgia', serif" font-size="14" font-weight="bold" fill="#fef08a" text-anchor="middle" letter-spacing="1">
        Capítulo ${chapterNum} • Padrão Oficial: O Milagre e a Celebração
      </text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  if (isFirst) {
    // Capítulo 1: Os Cestos e a Oferta Inicial (Padrão 03-cestos)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
      <defs>
        <linearGradient id="skyFirst" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="50%" stop-color="#bae6fd"/>
          <stop offset="85%" stop-color="#fde68a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="480" fill="url(#skyFirst)"/>
      <circle cx="400" cy="180" r="160" fill="#ffffff" opacity="0.6"/>
      <path d="M-50,330 Q250,270 500,320 T850,300 L850,480 L-50,480 Z" fill="#84cc16"/>
      <path d="M-50,370 Q200,330 450,360 T850,350 L850,480 L-50,480 Z" fill="#4d7c0f"/>
      <g transform="translate(400, 270)">
        <ellipse cx="0" cy="90" rx="140" ry="30" fill="#000000" opacity="0.25"/>
        <g transform="translate(0, 30)">
          <ellipse cx="0" cy="15" rx="55" ry="24" fill="#78350f"/>
          <path d="M-50,15 Q0,65 50,15 Z" fill="#b45309" stroke="#78350f" stroke-width="2"/>
          <circle cx="-25" cy="5" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <circle cx="0" cy="-2" r="16" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
          <circle cx="25" cy="5" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
          <circle cx="-10" cy="12" r="12" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
          <circle cx="12" cy="12" r="12" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
          <path d="M-32,18 Q-22,12 -12,18 L-8,14 L-8,22 Z" fill="#93c5fd"/>
          <path d="M12,18 Q22,12 32,18 L36,14 L36,22 Z" fill="#93c5fd"/>
        </g>
      </g>
      <rect x="180" y="16" width="440" height="42" rx="21" fill="rgba(15, 23, 42, 0.85)" stroke="#fbbf24" stroke-width="1.5"/>
      <text x="400" y="42" font-family="'Cinzel', 'Georgia', serif" font-size="14" font-weight="bold" fill="#fef08a" text-anchor="middle" letter-spacing="1">
        Capítulo ${chapterNum} • Padrão Oficial: O Desafio e a Partilha
      </text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Capítulo 2: Oração / Feche os Olhos e Olhe para Deus (Padrão 02-oracao)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
    <defs>
      <linearGradient id="skyOracao" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="45%" stop-color="#431407"/>
        <stop offset="80%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#fef3c7"/>
      </linearGradient>
      <radialGradient id="holyGlowMid" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
        <stop offset="45%" stop-color="#fef08a" stop-opacity="0.7"/>
        <stop offset="80%" stop-color="#f59e0b" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="480" fill="url(#skyOracao)"/>
    <circle cx="400" cy="240" r="260" fill="url(#holyGlowMid)"/>
    <g transform="translate(400, 240)">
      <ellipse cx="0" cy="110" rx="150" ry="30" fill="#000000" opacity="0.3"/>
      <g transform="translate(-75, 10)">
        <path d="M-50,60 Q-60,160 -30,170 L40,170 Q50,160 40,60 Z" fill="#92400e"/>
        <ellipse cx="0" cy="0" rx="30" ry="38" fill="#fed7aa"/>
        <path d="M-32,-14 Q0,-35 32,-14" fill="#451a03"/>
        <path d="M-20,18 Q0,50 20,18" fill="#5c2605"/>
        <path d="M-12,5 Q-6,12 0,5" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M6,5 Q12,12 18,5" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g transform="translate(60, 35)">
        <path d="M-25,50 Q-35,140 -15,150 L35,150 Q45,140 35,50 Z" fill="#38bdf8"/>
        <circle cx="5" cy="0" r="24" fill="#ffedd5"/>
        <path d="M-18,-10 Q5,-30 26,-10" fill="#78350f"/>
        <path d="M-10,0 Q-4,7 2,0" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M8,0 Q14,7 20,0" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="6" cy="55" r="9" fill="#fef08a" opacity="0.9"/>
      </g>
    </g>
    <rect x="180" y="16" width="440" height="42" rx="21" fill="rgba(15, 23, 42, 0.85)" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="400" y="42" font-family="'Cinzel', 'Georgia', serif" font-size="14" font-weight="bold" fill="#fef08a" text-anchor="middle" letter-spacing="1">
      Capítulo ${chapterNum} • Padrão Oficial: Feche os Olhos e Olhe para Deus
    </text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Curated child-friendly fallback generator if AI key is unavailable or fails
function generateFallbackChildChapter(
  childrenNames: string,
  learningGoal: string,
  setting: string,
  chapterIndex: number,
  previousChoice?: string
): ChapterPayload {
  const kids = childrenNames || "nossos pequenos heróis";
  
  if (chapterIndex === 1) {
    const title = "O Começo da Grande Aventura";
    const prompt = `${kids} em ${setting}, descobrindo uma surpresa com cores alegres`;
    return {
      chapterNumber: 1,
      chapterTitle: title,
      narrative: `Era uma manhã ensolarada e mágica quando ${kids} chegaram a ${setting}. Seus olhos brilhavam de curiosidade ao ver flores que cantavam e passarinhos coloridos acenando com as asinhas!\n\nDe repente, eles encontraram um pequeno esquilinho chamado Pipoca, que parecia meio chateado porque não conseguia alcançar as nozes no alto da árvore e não sabia como pedir ajuda. ${kids} sabiam que aquele momento era especial para colocar em prática algo muito importante: ${learningGoal.toLowerCase()}.\n\nCom um sorriso doce no rosto, eles deram um passo à frente. O que será que eles decidem fazer para ajudar o amigo?`,
      moralLesson: `Quando aprendemos sobre ${learningGoal.toLowerCase()}, nosso coração fica leve e espalhamos carinho por onde passamos!`,
      illustrationPrompt: prompt,
      illustrationUrl: generateStorybookSvg(prompt, title, 1),
      isFinal: false,
      choices: [
        {
          id: "choice-1",
          text: `Conversar com calma e gentileza com o esquilinho Pipoca.`,
          lessonFocus: "Paciência e Empatia",
        },
        {
          id: "choice-2",
          text: `Dar as mãos e pensar juntos numa solução criativa para alcançar a noz.`,
          lessonFocus: "Cooperação e União",
        },
      ],
    };
  }

  if (chapterIndex >= 3) {
    const title = "A Festa do Coração Contente";
    const prompt = `${kids} comemorando com amigos animais em ${setting}, cheios de alegria e amor`;
    return {
      chapterNumber: chapterIndex,
      chapterTitle: title,
      narrative: `Depois de escolherem "${previousChoice || "ajudar com todo carinho"}", um brilho dourado e acolhedor se espalhou por toda a ${setting}!\n\nTodos os animaizinhos se reuniram para aplaudir ${kids}. Eles perceberam que o maior tesouro daquela jornada não era nenhum brinquedo ou magia, mas a beleza de ${learningGoal.toLowerCase()}.\n\nAo final do dia, com o sol se pondo em tons de laranja e rosa, ${kids} deram um abraço bem apertado, sentindo a alegria pura de fazer o bem. E assim, guardaram essa linda lição no coração para sempre!`,
      moralLesson: `Lembre-se sempre: praticar ${learningGoal.toLowerCase()} faz o mundo mais bonito e nos enche de orgulho e amor.`,
      illustrationPrompt: prompt,
      illustrationUrl: generateStorybookSvg(prompt, title, chapterIndex),
      isFinal: true,
      choices: [
        {
          id: "final-1",
          text: "Dar um super abraço em família e guardar este ensinamento com amor.",
          lessonFocus: "Gratidão e Amor",
        },
      ],
    };
  }

  const title = `A Lição no Coração — Parte ${chapterIndex}`;
  const prompt = `${kids} aprendendo a lição de ${learningGoal} com animais mágicos em ${setting}`;
  return {
    chapterNumber: chapterIndex,
    chapterTitle: title,
    narrative: `Depois da decisão de "${previousChoice || "seguir com carinho"}", ${kids} continuaram a caminhar por ${setting}.\n\nLogo encontraram uma ponte brilhante de arco-íris. Para atravessá-la em segurança, o sábio Guarda Coruja explicou que era preciso demonstrar ${learningGoal.toLowerCase()}.\n\n${kids} olharam um para o outro, lembrando do quanto é bom agir com amor e paciência. Eles estavam prontos para mostrar o quanto já aprenderam!`,
    moralLesson: `Cada pequena escolha boa nos torna mais fortes e sábios!`,
    illustrationPrompt: prompt,
    illustrationUrl: generateStorybookSvg(prompt, title, chapterIndex),
    isFinal: false,
    choices: [
      {
        id: `choice-${chapterIndex}-1`,
        text: `Agir com paciência e respirar fundo antes de dar o próximo passo.`,
        lessonFocus: "Autocontrole e Paciência",
      },
      {
        id: `choice-${chapterIndex}-2`,
        text: `Dividir os recursos e ajudar quem está mais cansado.`,
        lessonFocus: "Generosidade e Cuidado",
      },
    ],
  };
}

// System Instruction for Children's Storyteller
function buildChildrenStorytellerInstruction(): string {
  return `Você é a voz narrativa da obra infantil "FECHE OS OLHOS E OLHE PARA DEUS", criada pelo autor Felipe Lima.
Seu estilo é caloroso, poético, lúdico, afetuoso, seguro e edificante, despertando a paz interior, o amor a Deus, virtudes do coração e inteligência emocional em crianças e famílias.
A missão ABSOLUTA da história é ensinar e reforçar o aprendizado/valor específico que os pais escolheram ou descreveram para seus filhos (como: honestidade, amor a Deus e ao próximo, dividir brinquedos, saber esperar, ter coragem, gratidão, bondade com irmãos, etc.).
Os personagens principais são os filhos mencionados pelos pais, colocados com muito carinho e protagonismo na narrativa.
A linguagem deve ser cativante para crianças de 2 a 10 anos.
Em cada capítulo, inclua uma "moralLesson" muito clara, afetuosa e reconfortante (com o espírito de fechar os olhos e sentir a paz e a presença de Deus no coração), e um "illustrationPrompt" detalhado descrevendo a cena para ser ilustrada de forma colorida, acolhedora e luminosa.`;
}

// Endpoint: Generate first chapter or next chapter of the children's story
app.post("/api/stories/generate-chapter", async (req: Request, res: Response) => {
  try {
    const {
      children = [],
      learningGoal = "Praticar a bondade e a cooperação",
      setting = "Floresta Encantada",
      favoriteTheme = "Animais falantes",
      storyTone = "divertido",
      chapterNumber = 1,
      previousChapters = [],
      selectedChoiceText = "",
      isFinalChapter = false,
    } = req.body;

    const kidsNames = children.map((c: { name: string; age?: string }) => c.name + (c.age ? ` (${c.age} anos)` : "")).join(" e ") || "Nossos pequeninos";
    const currentNum = parseInt(chapterNumber, 10) || 1;
    const isFinal = isFinalChapter || currentNum >= 3;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured. Serving curated child chapter.");
      const fallback = generateFallbackChildChapter(
        kidsNames,
        learningGoal,
        setting,
        currentNum,
        selectedChoiceText
      );
      return res.json({ chapter: fallback, source: "curated" });
    }

    const previousContext = previousChapters
      .map(
        (ch: { chapterNumber: number; chapterTitle: string; narrative: string; chosenAction?: string }) =>
          `Capítulo ${ch.chapterNumber}: "${ch.chapterTitle}". Acontecimento: ${ch.narrative.slice(0, 200)}... As crianças escolheram: "${ch.chosenAction || 'Avançar com bondade'}".`
      )
      .join("\n\n");

    const prompt = `
Crie o ${currentNum}º capítulo de uma linda história infantil ilustrada personalizada.

DADOS DA HISTÓRIA:
- Criança(s) protagonista(s): ${kidsNames}
- APRENDIZADO / VALOR ESPECÍFICO QUE OS PAIS QUEREM ENSINAR: "${learningGoal}" (ATENÇÃO: Toda a aventura deve girar em torno deste ensinamento!)
- Cenário da história: ${setting}
- Tema favorito das crianças: ${favoriteTheme}
- Tom da história: ${storyTone}
- Escolha feita no capítulo anterior: "${selectedChoiceText || 'Início da aventura'}"
- É o capítulo final? ${isFinal ? "SIM, conclua a aventura com uma celebração emocionante onde as crianças aplicam com sucesso a lição de vida e todos comemoram." : "NÃO, continue a jornada com um desafio divertido que teste a lição."}

Histórico dos capítulos anteriores:
${previousContext || "Este é o primeiro capítulo da história."}

DIRETRIZES:
1. "narrative": Escreva 2 a 3 parágrafos muito lúdicos, vivos, cheios de afeto e diálogos doces, colocando ${kidsNames} como protagonistas.
2. "chapterTitle": Um título alegre e divertido.
3. "moralLesson": 1 a 2 frases claras, afetuosas e fáceis de a criança entender sobre "${learningGoal}".
4. "illustrationPrompt": Descrição visual no PADRÃO OFICIAL APROVADO de Felipe Lima: estilo 3D Pixar / Disney animação de altíssima qualidade, iluminação volumétrica suave dourada de pôr do sol, Jesus acolhedor com olhar terno e benevolente, crianças expressivas em roupas de linho suave em tons terra, cestos de pães e peixes, clima de paz, oração ("feche os olhos e sinta a presença de Deus no coração") e amor familiar.
5. "choices": Se for o capítulo final, forneça 1 escolha final de celebração em família. Se NÃO for o final, forneça 2 escolhas divertidas onde a criança decide o que fazer em seguida, sempre estimulando a reflexão sobre o aprendizado.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: buildChildrenStorytellerInstruction(),
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chapterNumber: { type: Type.INTEGER },
            chapterTitle: { type: Type.STRING },
            narrative: { type: Type.STRING },
            moralLesson: { type: Type.STRING },
            illustrationPrompt: { type: Type.STRING },
            isFinal: { type: Type.BOOLEAN },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  lessonFocus: { type: Type.STRING },
                },
                required: ["id", "text"],
              },
            },
          },
          required: [
            "chapterNumber",
            "chapterTitle",
            "narrative",
            "moralLesson",
            "illustrationPrompt",
            "isFinal",
            "choices",
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Resposta vazia do Gemini");
    }

    const chapterData: ChapterPayload = JSON.parse(textOutput);
    // Attach illustration image
    chapterData.illustrationUrl = generateStorybookSvg(
      chapterData.illustrationPrompt || learningGoal,
      chapterData.chapterTitle,
      chapterData.chapterNumber
    );

    return res.json({ chapter: chapterData, source: "gemini" });
  } catch (error: any) {
    console.error("Erro ao gerar capítulo infantil:", error?.message || error);
    const kidsNames = (req.body?.children || []).map((c: any) => c.name).join(" e ") || "Nossos pequeninos";
    const currentNum = parseInt(req.body?.chapterNumber, 10) || 1;
    const fallback = generateFallbackChildChapter(
      kidsNames,
      req.body?.learningGoal || "Bondade e respeito",
      req.body?.setting || "Floresta Encantada",
      currentNum,
      req.body?.selectedChoiceText
    );
    return res.json({ chapter: fallback, source: "curated-fallback", error: error?.message });
  }
});

// Endpoint: Suggest/expand learning goals based on parents' needs
app.post("/api/parents/suggest-learning", async (req: Request, res: Response) => {
  try {
    const { rawInput } = req.body;
    if (!apiKey || !rawInput) {
      return res.json({
        suggestions: [
          "Aprender a compartilhar brinquedos e revezar a vez com os amigos",
          "Identificar a raiva ou frustração e respirar fundo em vez de gritar",
          "Dizer a verdade com coragem mesmo quando der medo",
          "Dormir sozinho no próprio quarto sabendo que está protegido",
          "Comer alimentos saudáveis e experimentar novos sabores",
          "Cuidar e ser carinhoso com os irmãos ou amigos mais novos",
        ],
      });
    }

    const prompt = `Um pai ou mãe descreveu a seguinte situação ou aprendizado que deseja para o(s) filho(s): "${rawInput}".
Gere uma lista em JSON com 3 a 5 variações pedagógicas e carinhosas de aprendizados focados em valores positivos para histórias infantis.
Retorne um objeto JSON com o campo "suggestions" contendo um array de strings.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um pedagogo e especialista em educação socioemocional infantil.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["suggestions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error) {
    return res.json({
      suggestions: [
        "Aprender a dividir e cooperar com alegria",
        "Acalmar o coração quando sentir frustração",
        "Respeitar o momento de guardar os brinquedos",
      ],
    });
  }
});

// Mount Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor infantil rodando em http://localhost:${port}`);
  });
}

startServer();
