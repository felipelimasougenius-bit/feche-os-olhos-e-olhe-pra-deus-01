// Padrão Oficial de Imagens - Obra "FECHE OS OLHOS E OLHE PARA DEUS" de Felipe Lima
// Estilo: 3D Pixar / Disney animação de alta qualidade, iluminação dourada volumétrica suave,
// personagens expressivos, Jesus afetuoso e acolhedor, crianças felizes em trajes em linho/terra,
// cestos artesanais, pães dourados, atmosfera de aconchego, reverência e paz interior.

export interface ApprovedArtScene {
  id: string;
  filename: string;
  title: string;
  subtitle: string;
  themeCategory: 'capa' | 'oracao' | 'milagre' | 'comunhao' | 'familia' | 'aprendizado';
  description: string;
  promptDescription: string;
  // SVG Renderer that produces a high-fidelity vector illustration matching this scene
  renderSvg: (options?: { width?: number; height?: number; title?: string }) => string;
}

// Helper to create clean data URI for SVG
function toDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 1. Capa Oficial Aprovada ("09-capa-aprovada.png")
export function renderCapaAprovadaSvg(title = 'FECHE OS OLHOS E OLHE PARA DEUS', author = 'Felipe Lima'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%">
    <defs>
      <linearGradient id="skyGradCapa" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="25%" stop-color="#312e81"/>
        <stop offset="50%" stop-color="#7c2d12"/>
        <stop offset="75%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#fef3c7"/>
      </linearGradient>
      <linearGradient id="goldGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <radialGradient id="sunBurst" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
        <stop offset="30%" stop-color="#fef08a" stop-opacity="0.6"/>
        <stop offset="65%" stop-color="#f59e0b" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="16" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Fundo Céu Dourado de Pôr do Sol Bíblico -->
    <rect width="800" height="1200" fill="url(#skyGradCapa)"/>
    <circle cx="400" cy="520" r="380" fill="url(#sunBurst)"/>

    <!-- Raios de Luz Divina / Volumetric Rays -->
    <g opacity="0.25">
      <polygon points="400,350 150,1200 250,1200" fill="#fef08a"/>
      <polygon points="400,350 350,1200 450,1200" fill="#fef08a"/>
      <polygon points="400,350 550,1200 650,1200" fill="#fef08a"/>
      <polygon points="400,350 720,1200 800,1200" fill="#fef08a"/>
    </g>

    <!-- Montanhas Suaves da Galileia / Colinas -->
    <path d="M-100,750 Q180,620 400,680 T900,640 L900,1200 L-100,1200 Z" fill="#78350f" opacity="0.85"/>
    <path d="M-100,800 Q250,710 500,760 T900,730 L900,1200 L-100,1200 Z" fill="#451a03" opacity="0.95"/>
    <path d="M-100,870 Q200,820 420,860 T900,840 L900,1200 L-100,1200 Z" fill="#291305"/>

    <!-- Vegetação / Oliveira e Folhagens -->
    <circle cx="120" cy="740" r="90" fill="#14532d" opacity="0.7"/>
    <circle cx="160" cy="720" r="70" fill="#166534" opacity="0.8"/>
    <circle cx="680" cy="750" r="85" fill="#14532d" opacity="0.7"/>
    <circle cx="640" cy="730" r="65" fill="#166534" opacity="0.8"/>

    <!-- Pássaros no Horizonte -->
    <path d="M320,380 Q328,373 336,380 Q344,373 352,380" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M380,360 Q386,354 392,360 Q398,354 404,360" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
    <path d="M440,385 Q447,378 454,385 Q461,378 468,385" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>

    <!-- CENA CENTRAL 3D PIXAR: JESUS COM AS CRIANÇAS -->
    <!-- Aura Dourada ao Redor de Jesus -->
    <ellipse cx="400" cy="620" rx="140" ry="160" fill="#fef08a" opacity="0.35" filter="url(#softGlow)"/>

    <!-- Jesus - Figura Central de Paz -->
    <g transform="translate(400, 680)">
      <!-- Sombra no chão -->
      <ellipse cx="0" cy="220" rx="170" ry="35" fill="#000000" opacity="0.45"/>
      
      <!-- Manto e Túnica (Linho Texturizado e Terracota Suave) -->
      <path d="M-85,90 Q-100,210 -70,220 L70,220 Q100,210 85,90 Z" fill="#fafaf9"/>
      <!-- Manto drapeado terracota/azul celeste -->
      <path d="M-85,90 Q-40,60 0,65 Q40,60 85,90 Q60,180 75,220 L-75,220 Q-60,180 -85,90 Z" fill="#b45309" opacity="0.85"/>
      
      <!-- Braços acolhedores abertos em abraço e proteção -->
      <path d="M-75,95 Q-140,110 -150,150 Q-140,175 -105,150 Q-70,120 -60,110 Z" fill="#fafaf9"/>
      <path d="M75,95 Q140,110 150,150 Q140,175 105,150 Q70,120 60,110 Z" fill="#fafaf9"/>
      <!-- Mãos acolhedoras -->
      <circle cx="-145" cy="155" r="16" fill="#fed7aa"/>
      <circle cx="145" cy="155" r="16" fill="#fed7aa"/>

      <!-- Cabeça de Jesus - 3D Pixar Acolhedor -->
      <ellipse cx="0" cy="15" rx="36" ry="44" fill="#fed7aa"/>
      <!-- Cabelos castanhos ondulados acolhedores -->
      <path d="M-40,-5 Q-45,60 -30,85 Q-20,40 -25,10 Z" fill="#451a03"/>
      <path d="M40,-5 Q45,60 30,85 Q20,40 25,10 Z" fill="#451a03"/>
      <path d="M-40,-5 Q0,-35 40,-5 Q20,-15 -20,-15 Z" fill="#451a03"/>
      <!-- Barba suave aparada -->
      <path d="M-28,25 Q0,65 28,25 Q15,45 0,48 Q-15,45 -28,25 Z" fill="#5c2605"/>
      <!-- Sorriso terno e sereno -->
      <path d="M-14,24 Q0,36 14,24" fill="none" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
      <!-- Olhos cheios de ternura e amor -->
      <ellipse cx="-13" cy="8" rx="5" ry="4" fill="#451a03"/>
      <ellipse cx="13" cy="8" rx="5" ry="4" fill="#451a03"/>
      <circle cx="-11" cy="6" r="1.5" fill="#ffffff"/>
      <circle cx="15" cy="6" r="1.5" fill="#ffffff"/>
      <!-- Bochechas com tom caloroso -->
      <circle cx="-22" cy="16" r="6" fill="#fb7185" opacity="0.4"/>
      <circle cx="22" cy="16" r="6" fill="#fb7185" opacity="0.4"/>

      <!-- Criança à esquerda no colo / abraço (Menininho com olhos fechados de oração) -->
      <g transform="translate(-85, 120)">
        <ellipse cx="0" cy="50" rx="28" ry="40" fill="#38bdf8"/>
        <circle cx="0" cy="0" r="22" fill="#ffedd5"/>
        <path d="M-22,-6 Q0,-25 22,-6 Q10,-12 -10,-12 Z" fill="#78350f"/>
        <!-- Olhinhos fechados em paz profunda -->
        <path d="M-10,0 Q-5,6 0,0" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
        <path d="M5,0 Q10,6 15,0" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
        <path d="M-4,8 Q3,14 10,8" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
      </g>

      <!-- Criança à direita olhando para Jesus com sorriso radiante -->
      <g transform="translate(85, 120)">
        <ellipse cx="0" cy="50" rx="28" ry="40" fill="#f472b6"/>
        <circle cx="0" cy="0" r="22" fill="#ffedd5"/>
        <path d="M-22,-6 Q0,-25 22,-6 Q10,-12 -10,-12 Z" fill="#92400e"/>
        <!-- Olhos abertos felizes -->
        <circle cx="-6" cy="1" r="3.5" fill="#451a03"/>
        <circle cx="8" cy="1" r="3.5" fill="#451a03"/>
        <circle cx="-5" cy="0" r="1" fill="#ffffff"/>
        <circle cx="9" cy="0" r="1" fill="#ffffff"/>
        <path d="M-4,9 Q2,16 8,9" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
      </g>

      <!-- Cestinho de Pães e Peixes em Primeiro Plano -->
      <g transform="translate(0, 195)">
        <ellipse cx="0" cy="10" rx="42" ry="18" fill="#78350f"/>
        <path d="M-40,10 Q0,45 40,10 Q20,3 0,5 Q-20,3 -40,10 Z" fill="#92400e" stroke="#78350f" stroke-width="2"/>
        <!-- Textura do trançado de vime -->
        <path d="M-25,18 L-20,32 M-10,22 L-5,35 M5,22 L10,35 M20,18 L25,32" stroke="#b45309" stroke-width="2"/>
        <!-- Pães dourados e brilhantes -->
        <ellipse cx="-15" cy="5" rx="14" ry="9" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
        <ellipse cx="12" cy="4" rx="15" ry="9" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
        <ellipse cx="0" cy="-2" rx="13" ry="8" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
        <!-- Brilho de bênção no pão -->
        <circle cx="-1" cy="-3" r="2" fill="#ffffff"/>
      </g>
    </g>

    <!-- CABEÇALHO DA CAPA COM TIPOGRAFIA PREMIUM -->
    <!-- Faixa sutil no topo -->
    <rect x="0" y="0" width="800" height="280" fill="url(#skyGradCapa)" opacity="0.6"/>

    <!-- TÍTULO PRINCIPAL (Em Destaque Dourado e Branco) -->
    <g filter="url(#goldShadow)" text-anchor="middle">
      <text x="400" y="110" font-family="'Cinzel', 'Trajan Pro', 'Georgia', serif" font-size="34" font-weight="900" fill="#fef3c7" letter-spacing="4">
        FECHE OS OLHOS E
      </text>
      <text x="400" y="170" font-family="'Cinzel', 'Trajan Pro', 'Georgia', serif" font-size="44" font-weight="900" fill="url(#goldGlow)" letter-spacing="6">
        OLHE PARA DEUS
      </text>
    </g>

    <!-- Subtítulo Poético -->
    <text x="400" y="215" font-family="'Nunito', 'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle" letter-spacing="2">
      HISTÓRIAS ILUSTRADAS INFANTIS DE AMOR E FÉ
    </text>

    <!-- Linha Divisória Dourada Elegante -->
    <g stroke="url(#goldGlow)" stroke-width="2" opacity="0.8">
      <line x1="220" y1="235" x2="370" y2="235"/>
      <circle cx="400" cy="235" r="4" fill="#fbbf24"/>
      <line x1="430" y1="235" x2="580" y2="235"/>
    </g>

    <!-- Selo do Autor Felipe Lima -->
    <g transform="translate(400, 1110)" filter="url(#goldShadow)">
      <rect x="-180" y="-35" width="360" height="52" rx="26" fill="#0f172a" fill-opacity="0.9" stroke="#f59e0b" stroke-width="2"/>
      <text x="0" y="-8" font-family="'Cinzel', 'Georgia', serif" font-size="12" font-weight="bold" fill="#94a3b8" text-anchor="middle" letter-spacing="3">
        OBRA CRIADA POR
      </text>
      <text x="0" y="12" font-family="'Cinzel', 'Georgia', serif" font-size="18" font-weight="900" fill="#fef08a" text-anchor="middle" letter-spacing="3">
        FELIPE LIMA
      </text>
    </g>

    <!-- Moldura Decorativa Clássica de Livro -->
    <rect x="25" y="25" width="750" height="1150" rx="16" fill="none" stroke="#f59e0b" stroke-width="3" opacity="0.5"/>
    <rect x="35" y="35" width="730" height="1130" rx="12" fill="none" stroke="#fde68a" stroke-width="1" opacity="0.3"/>
    <!-- Cantoneiras ornamentais -->
    <circle cx="35" cy="35" r="6" fill="#fbbf24"/>
    <circle cx="765" cy="35" r="6" fill="#fbbf24"/>
    <circle cx="35" cy="1165" r="6" fill="#fbbf24"/>
    <circle cx="765" cy="1165" r="6" fill="#fbbf24"/>
  </svg>`;
  return svg;
}

// 2. Cena: Oração Íntima com Jesus ("02-oracao.png")
export function renderOracaoSvg(title = 'O Momento Sagrado da Oração'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="warmAmber" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#451a03"/>
        <stop offset="50%" stop-color="#b45309"/>
        <stop offset="100%" stop-color="#fef3c7"/>
      </linearGradient>
      <radialGradient id="holyGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
        <stop offset="40%" stop-color="#fef08a" stop-opacity="0.7"/>
        <stop offset="80%" stop-color="#f59e0b" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="glowFilt">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <rect width="800" height="500" fill="#180e06"/>
    <!-- Céu noturno aconchegante com estrelas cintilantes -->
    <g fill="#fef08a" opacity="0.8">
      <circle cx="120" cy="80" r="2.5"/><circle cx="240" cy="50" r="1.5"/><circle cx="680" cy="90" r="3"/><circle cx="720" cy="160" r="2"/>
      <circle cx="350" cy="70" r="2"/><circle cx="580" cy="60" r="1.8"/>
    </g>

    <!-- Foco Luminoso Central -->
    <circle cx="400" cy="270" r="260" fill="url(#holyGlow)"/>

    <!-- Jesus e a Criança em Oração com Olhos Fechados -->
    <g transform="translate(400, 260)">
      <!-- Jesus à esquerda se inclinando carinhosamente -->
      <g transform="translate(-80, 0)">
        <!-- Manto em tom terra suave -->
        <path d="M-60,70 Q-70,180 -40,190 L50,190 Q60,180 50,70 Z" fill="#92400e"/>
        <path d="M-40,70 Q0,50 30,70 L40,190 L-50,190 Z" fill="#fef3c7" opacity="0.9"/>
        <!-- Cabeça inclinada com reverência e ternura -->
        <ellipse cx="0" cy="0" rx="32" ry="40" fill="#fed7aa"/>
        <!-- Cabelos castanhos ondulados -->
        <path d="M-36,-15 Q-40,40 -25,65 Q-15,30 -20,10 Z" fill="#451a03"/>
        <path d="M36,-15 Q40,40 25,65 Q15,30 20,10 Z" fill="#451a03"/>
        <path d="M-36,-15 Q0,-38 36,-15 Q15,-25 -15,-25 Z" fill="#451a03"/>
        <path d="M-22,20 Q0,55 22,20 Q12,38 0,40 Q-12,38 -22,20 Z" fill="#5c2605"/>
        <!-- Olhos suavemente fechados em oração -->
        <path d="M-15,6 Q-8,14 -1,6" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M7,6 Q14,14 21,6" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M-8,24 Q0,30 8,24" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
        <!-- Mão de Jesus pousada com ternura e bênção -->
        <ellipse cx="50" cy="70" rx="16" ry="12" fill="#fed7aa"/>
      </g>

      <!-- Criança à direita de olhos fechados, mãos postas em oração -->
      <g transform="translate(60, 30)">
        <!-- Roupinha suave azul pastel -->
        <path d="M-30,60 Q-40,150 -20,160 L40,160 Q50,150 40,60 Z" fill="#38bdf8"/>
        <!-- Cabeça da criança -->
        <circle cx="5" cy="0" r="26" fill="#ffedd5"/>
        <!-- Cabelinhos cacheados -->
        <path d="M-20,-12 Q5,-35 30,-12 Q15,-20 -5,-20 Z" fill="#78350f"/>
        <!-- Bochechas rosadas de aconchego -->
        <circle cx="-6" cy="10" r="6" fill="#fb7185" opacity="0.45"/>
        <circle cx="20" cy="10" r="6" fill="#fb7185" opacity="0.45"/>
        <!-- Olhinhos fechados em prece pura -->
        <path d="M-12,0 Q-5,8 2,0" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M10,0 Q17,8 24,0" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Sorriso de paz absoluta -->
        <path d="M-2,14 Q6,22 14,14" fill="none" stroke="#78350f" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Mãozinhas postas juntas em oração -->
        <g transform="translate(6, 65)">
          <ellipse cx="-4" cy="0" rx="8" ry="14" fill="#ffedd5" transform="rotate(-15)"/>
          <ellipse cx="6" cy="0" rx="8" ry="14" fill="#fed7aa" transform="rotate(15)"/>
          <!-- Brilho dourado entre as mãos -->
          <circle cx="1" cy="0" r="8" fill="#fef08a" opacity="0.8" filter="url(#glowFilt)"/>
        </g>
      </g>
    </g>

    <!-- Faixa Inferior de Título do Padrão -->
    <rect x="0" y="445" width="800" height="55" fill="#0f172a" opacity="0.9"/>
    <text x="400" y="478" font-family="'Cinzel', 'Georgia', serif" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle" letter-spacing="2">
      PADRÃO OFICIAL • ORAÇÃO: FECHE OS OLHOS E OLHE PARA DEUS
    </text>
  </svg>`;
  return svg;
}

// 3. Cena: Cestos e Partilha ("03-cestos.png")
export function renderCestosSvg(title = 'A Generosidade dos Pequenos Cestos'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="warmSunCestos" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="60%" stop-color="#fed7aa"/>
        <stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#warmSunCestos)"/>
    <circle cx="400" cy="180" r="160" fill="#ffffff" opacity="0.5"/>

    <!-- Menino entregando o cestinho para Jesus -->
    <g transform="translate(300, 270)">
      <!-- Menino -->
      <circle cx="0" cy="0" r="32" fill="#ffedd5"/>
      <path d="M-25,-15 Q0,-42 25,-15" fill="#92400e"/>
      <circle cx="-8" cy="2" r="4" fill="#451a03"/><circle cx="12" cy="2" r="4" fill="#451a03"/>
      <path d="M-5,16 Q4,26 13,16" fill="none" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
      <path d="M-30,40 Q0,160 30,40" fill="#10b981"/>

      <!-- Cestinho com os 5 pães dourados e 2 peixinhos -->
      <g transform="translate(85, 40)">
        <ellipse cx="0" cy="15" rx="55" ry="24" fill="#78350f"/>
        <path d="M-50,15 Q0,60 50,15 Z" fill="#b45309"/>
        <!-- Pães apetitosos -->
        <circle cx="-25" cy="5" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
        <circle cx="0" cy="-2" r="16" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
        <circle cx="25" cy="5" r="14" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
        <circle cx="-10" cy="12" r="12" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
        <circle cx="12" cy="12" r="12" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
        <!-- Peixinho prateado suave -->
        <path d="M-32,18 Q-22,12 -12,18 L-8,14 L-8,22 Z" fill="#93c5fd"/>
        <path d="M12,18 Q22,12 32,18 L36,14 L36,22 Z" fill="#93c5fd"/>
      </g>
    </g>

    <!-- Mãos acolhedoras de Jesus recebendo a oferta -->
    <g transform="translate(480, 310)">
      <path d="M40,0 Q-20,10 -60,0 Q-20,-15 40,-10 Z" fill="#fed7aa"/>
      <path d="M40,40 Q-10,25 -50,15" stroke="#fed7aa" stroke-width="14" stroke-linecap="round"/>
      <!-- Manga da túnica branca -->
      <path d="M40,-30 L100,-40 L100,60 L40,50 Z" fill="#fef3c7"/>
    </g>

    <rect x="0" y="445" width="800" height="55" fill="#0f172a" opacity="0.9"/>
    <text x="400" y="478" font-family="'Cinzel', 'Georgia', serif" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle" letter-spacing="2">
      PADRÃO OFICIAL • CESTOS: A BELEZA DA GENEROSIDADE E PARTILHA
    </text>
  </svg>`;
  return svg;
}

// 4. Cena: O Milagre e a Multiplicação ("04-milagre.png")
export function renderMilagreSvg(title = 'O Milagre da Graça Multiplicada'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="skyMilagre" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#451a03"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#skyMilagre)"/>
    <!-- Raios de bênção -->
    <g opacity="0.35">
      <polygon points="400,0 200,500 280,500" fill="#fef08a"/>
      <polygon points="400,0 360,500 440,500" fill="#fef08a"/>
      <polygon points="400,0 520,500 600,500" fill="#fef08a"/>
    </g>

    <!-- Grande Cesto Transbordando de Pães Frescos Dourados -->
    <g transform="translate(400, 310)">
      <ellipse cx="0" cy="50" rx="160" ry="40" fill="#000000" opacity="0.4"/>
      <!-- Cesto -->
      <path d="M-130,10 Q0,110 130,10 Q70,-10 0,-5 Q-70,-10 -130,10 Z" fill="#92400e" stroke="#78350f" stroke-width="4"/>
      <!-- Pães dourados empilhados em fartura -->
      <circle cx="-60" cy="-20" r="32" fill="#fbbf24" stroke="#d97706" stroke-width="3"/>
      <circle cx="60" cy="-20" r="32" fill="#fbbf24" stroke="#d97706" stroke-width="3"/>
      <circle cx="-20" cy="-40" r="35" fill="#f59e0b" stroke="#d97706" stroke-width="3"/>
      <circle cx="25" cy="-35" r="35" fill="#fde68a" stroke="#d97706" stroke-width="3"/>
      <circle cx="0" cy="-65" r="38" fill="#fef08a" stroke="#f59e0b" stroke-width="3"/>
      <!-- Brilhos de luz -->
      <circle cx="0" cy="-70" r="6" fill="#ffffff"/>
      <circle cx="-22" cy="-45" r="4" fill="#ffffff"/>
      <circle cx="28" cy="-40" r="4" fill="#ffffff"/>
    </g>

    <rect x="0" y="445" width="800" height="55" fill="#0f172a" opacity="0.9"/>
    <text x="400" y="478" font-family="'Cinzel', 'Georgia', serif" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle" letter-spacing="2">
      PADRÃO OFICIAL • MILAGRE: A FARTURA E O AMOR DE DEUS
    </text>
  </svg>`;
  return svg;
}

// 5. Cena: A Refeição em Família e Alegria ("05-refeicao.png")
export function renderRefeicaoSvg(title = 'A Mesa Farta de Amor e Comunhão'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <rect width="800" height="500" fill="#fef3c7"/>
    <!-- Colinas ensolaradas -->
    <path d="M0,250 Q250,180 500,240 T800,200 L800,500 L0,500 Z" fill="#86efac"/>
    <path d="M0,320 Q300,280 600,340 T800,310 L800,500 L0,500 Z" fill="#4ade80"/>

    <!-- Família e Crianças Sentadas na Relva Compartilhando com Alegria -->
    <g transform="translate(400, 360)">
      <!-- Toalha de piquenique estendida -->
      <ellipse cx="0" cy="40" rx="190" ry="45" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3"/>
      <!-- Cesto central e frutas -->
      <ellipse cx="0" cy="30" rx="40" ry="18" fill="#b45309"/>
      <circle cx="-15" cy="25" r="10" fill="#f59e0b"/><circle cx="15" cy="25" r="10" fill="#fbbf24"/>
      <circle cx="0" cy="20" r="12" fill="#ef4444"/>

      <!-- Criança 1 sorrindo com um pedaço de pão -->
      <g transform="translate(-100, 0)">
        <circle cx="0" cy="0" r="24" fill="#ffedd5"/>
        <path d="M-18,-8 Q0,-24 18,-8" fill="#78350f"/>
        <path d="M-6,10 Q0,18 6,10" stroke="#78350f" stroke-width="2" fill="none"/>
        <ellipse cx="18" cy="15" rx="8" ry="6" fill="#f59e0b"/>
      </g>

      <!-- Criança 2 celebrando com os braços abertos -->
      <g transform="translate(100, -10)">
        <circle cx="0" cy="0" r="24" fill="#ffedd5"/>
        <path d="M-18,-8 Q0,-24 18,-8" fill="#92400e"/>
        <path d="M-6,10 Q0,18 6,10" stroke="#78350f" stroke-width="2" fill="none"/>
        <!-- Braços erguidos de alegria -->
        <path d="M-15,10 L-30,-5 M15,10 L30,-5" stroke="#ffedd5" stroke-width="8" stroke-linecap="round"/>
      </g>
    </g>

    <rect x="0" y="445" width="800" height="55" fill="#0f172a" opacity="0.9"/>
    <text x="400" y="478" font-family="'Cinzel', 'Georgia', serif" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle" letter-spacing="2">
      PADRÃO OFICIAL • REFEIÇÃO: GRATIDÃO E COMUNHÃO EM FAMÍLIA
    </text>
  </svg>`;
  return svg;
}

// 6. Cena: Ensinamento e Sabedoria ("06-ensinamento.png")
export function renderEnsinamentoSvg(title = 'O Ensinamento do Mestre'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <rect width="800" height="500" fill="#fde68a"/>
    <circle cx="400" cy="180" r="220" fill="#ffffff" opacity="0.6"/>

    <!-- Jesus sentado sobre uma rocha ensinando com ternura -->
    <g transform="translate(320, 270)">
      <path d="M-50,80 Q-70,180 -40,190 L60,190 Q80,180 60,80 Z" fill="#b45309"/>
      <ellipse cx="0" cy="0" rx="34" ry="42" fill="#fed7aa"/>
      <path d="M-36,-12 Q0,-38 36,-12" fill="#451a03"/>
      <!-- Mão apontando suavemente para o céu / coração -->
      <path d="M45,30 Q90,-20 100,-40" stroke="#fed7aa" stroke-width="12" stroke-linecap="round"/>
      <!-- Olhar caloroso -->
      <circle cx="-12" cy="5" r="4" fill="#451a03"/><circle cx="12" cy="5" r="4" fill="#451a03"/>
      <path d="M-10,22 Q0,32 10,22" stroke="#78350f" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>

    <!-- Crianças atentas ouvindo fascinadas -->
    <g transform="translate(520, 320)">
      <circle cx="0" cy="0" r="26" fill="#ffedd5"/>
      <path d="M-20,-8 Q0,-25 20,-8" fill="#78350f"/>
      <circle cx="-8" cy="2" r="4" fill="#451a03"/><circle cx="8" cy="2" r="4" fill="#451a03"/>
      <path d="M-6,12 Q0,18 6,12" stroke="#78350f" stroke-width="2" fill="none"/>
    </g>

    <rect x="0" y="445" width="800" height="55" fill="#0f172a" opacity="0.9"/>
    <text x="400" y="478" font-family="'Cinzel', 'Georgia', serif" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle" letter-spacing="2">
      PADRÃO OFICIAL • ENSINAMENTO: A PALAVRA QUE EDIFICA O CORAÇÃO
    </text>
  </svg>`;
  return svg;
}

// 7. Cena: A Cestinha de Maravilhas ("07-cestinha.png")
export function renderCestinhaSvg(title = 'A Pequena Cesta de Amor'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <rect width="800" height="500" fill="#fef9c3"/>
    <circle cx="400" cy="230" r="190" fill="#fde047" opacity="0.4"/>

    <!-- Criança segurando a cestinha com os dois bracinhos e sorriso gigante -->
    <g transform="translate(400, 260)">
      <circle cx="0" cy="-60" r="38" fill="#ffedd5"/>
      <path d="M-30,-80 Q0,-115 30,-80" fill="#92400e"/>
      <circle cx="-12" cy="-58" r="5" fill="#451a03"/><circle cx="14" cy="-58" r="5" fill="#451a03"/>
      <circle cx="-10" cy="-60" r="1.5" fill="#ffffff"/><circle cx="16" cy="-60" r="1.5" fill="#ffffff"/>
      <circle cx="-22" cy="-45" r="7" fill="#fb7185" opacity="0.4"/>
      <circle cx="22" cy="-45" r="7" fill="#fb7185" opacity="0.4"/>
      <path d="M-10,-40 Q0,-26 10,-40" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round"/>

      <!-- Cesta erguida nas mãozinhas -->
      <g transform="translate(0, 40)">
        <ellipse cx="0" cy="20" rx="60" ry="24" fill="#78350f"/>
        <path d="M-55,20 Q0,80 55,20 Z" fill="#b45309" stroke="#78350f" stroke-width="3"/>
        <!-- Pães quentinhos -->
        <circle cx="-25" cy="10" r="18" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
        <circle cx="25" cy="10" r="18" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
        <circle cx="0" cy="5" r="22" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
      </g>
    </g>

    <rect x="0" y="445" width="800" height="55" fill="#0f172a" opacity="0.9"/>
    <text x="400" y="478" font-family="'Cinzel', 'Georgia', serif" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle" letter-spacing="2">
      PADRÃO OFICIAL • CESTINHA: O PODER DO QUE TEMOS NAS MÃOS
    </text>
  </svg>`;
  return svg;
}

// 8. Cena: Conversa Afetuosa ("08-conversa.png")
export function renderConversaSvg(title = 'A Conversa de Coração para Coração'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <rect width="800" height="500" fill="#312e81"/>
    <circle cx="400" cy="250" r="240" fill="#fbbf24" opacity="0.25"/>

    <!-- Jesus agachado conversando na mesma altura da criança -->
    <g transform="translate(400, 270)">
      <!-- Jesus à esquerda, mão no ombro da criança -->
      <g transform="translate(-70, 0)">
        <ellipse cx="0" cy="0" rx="34" ry="42" fill="#fed7aa"/>
        <path d="M-36,-12 Q0,-38 36,-12" fill="#451a03"/>
        <circle cx="-12" cy="5" r="4" fill="#451a03"/><circle cx="12" cy="5" r="4" fill="#451a03"/>
        <path d="M-10,22 Q0,32 10,22" stroke="#78350f" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Braço abraçando o ombro -->
        <path d="M25,30 Q65,40 100,50" stroke="#fed7aa" stroke-width="14" stroke-linecap="round"/>
      </g>

      <!-- Criança à direita olhando nos olhos com segurança e confiança -->
      <g transform="translate(60, 20)">
        <circle cx="0" cy="0" r="28" fill="#ffedd5"/>
        <path d="M-22,-10 Q0,-30 22,-10" fill="#78350f"/>
        <circle cx="-8" cy="2" r="4" fill="#451a03"/><circle cx="10" cy="2" r="4" fill="#451a03"/>
        <path d="M-6,14 Q2,22 10,14" stroke="#78350f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    </g>

    <rect x="0" y="445" width="800" height="55" fill="#0f172a" opacity="0.9"/>
    <text x="400" y="478" font-family="'Cinzel', 'Georgia', serif" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle" letter-spacing="2">
      PADRÃO OFICIAL • CONVERSA: ACOLHIMENTO E AMOR INCONDICIONAL
    </text>
  </svg>`;
  return svg;
}

// 9. Cena: Família com Jesus ("01-familia-com-jesus.png")
export function renderFamiliaComJesusSvg(title = 'A Família Reunida com Jesus'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="warmFamilySun" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fdba74"/>
        <stop offset="60%" stop-color="#fed7aa"/>
        <stop offset="100%" stop-color="#451a03"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#warmFamilySun)"/>
    <circle cx="400" cy="180" r="180" fill="#ffffff" opacity="0.6"/>

    <!-- Jesus no centro, pai à esquerda, mãe à direita, crianças no colo -->
    <g transform="translate(400, 270)">
      <!-- Jesus Central -->
      <ellipse cx="0" cy="-20" rx="34" ry="42" fill="#fed7aa"/>
      <path d="M-36,-32 Q0,-58 36,-32" fill="#451a03"/>
      <circle cx="-12" cy="-15" r="4" fill="#451a03"/><circle cx="12" cy="-15" r="4" fill="#451a03"/>
      <path d="M-10,2 Q0,12 10,2" stroke="#78350f" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M-50,20 Q0,0 50,20 L60,170 L-60,170 Z" fill="#fafaf9"/>

      <!-- Pai à esquerda sorrindo feliz -->
      <g transform="translate(-130, 20)">
        <circle cx="0" cy="0" r="30" fill="#fed7aa"/>
        <path d="M-25,-12 Q0,-32 25,-12" fill="#3b0764"/>
        <circle cx="-8" cy="2" r="3.5" fill="#1e293b"/><circle cx="8" cy="2" r="3.5" fill="#1e293b"/>
        <path d="M-6,14 Q0,22 6,14" stroke="#1e293b" stroke-width="2.5" fill="none"/>
        <path d="M-30,40 L30,40 L40,140 L-40,140 Z" fill="#0284c7"/>
      </g>

      <!-- Mãe à direita com olhar carinhoso -->
      <g transform="translate(130, 20)">
        <circle cx="0" cy="0" r="28" fill="#ffedd5"/>
        <path d="M-24,-14 Q0,-36 24,-14" fill="#78350f"/>
        <circle cx="-8" cy="2" r="3.5" fill="#1e293b"/><circle cx="8" cy="2" r="3.5" fill="#1e293b"/>
        <path d="M-6,14 Q0,22 6,14" stroke="#1e293b" stroke-width="2.5" fill="none"/>
        <path d="M-30,40 L30,40 L40,140 L-40,140 Z" fill="#e11d48"/>
      </g>

      <!-- Crianças na frente brincando felizes -->
      <g transform="translate(0, 90)">
        <circle cx="-35" cy="0" r="22" fill="#ffedd5"/>
        <circle cx="35" cy="0" r="22" fill="#ffedd5"/>
        <path d="M-40,10 Q-35,16 -30,10" stroke="#78350f" stroke-width="2" fill="none"/>
        <path d="M30,10 Q35,16 40,10" stroke="#78350f" stroke-width="2" fill="none"/>
      </g>
    </g>

    <rect x="0" y="445" width="800" height="55" fill="#0f172a" opacity="0.9"/>
    <text x="400" y="478" font-family="'Cinzel', 'Georgia', serif" font-size="16" font-weight="bold" fill="#fde68a" text-anchor="middle" letter-spacing="2">
      PADRÃO OFICIAL • FAMÍLIA COM JESUS: A PAZ DO LAR PROTEGIDO
    </text>
  </svg>`;
  return svg;
}

// Catálogo com as 9 Imagens Oficiais Aprovadas
export const APPROVED_ART_STANDARD_GALLERY: ApprovedArtScene[] = [
  {
    id: '09-capa-aprovada',
    filename: '09-capa-aprovada.png',
    title: 'Capa Oficial Aprovada',
    subtitle: 'FECHE OS OLHOS E OLHE PARA DEUS • Felipe Lima',
    themeCategory: 'capa',
    description: 'A capa oficial aprovada para o livro, com Jesus acolhendo as crianças em um cenário bíblico iluminado, tipografia em ouro e autoria de Felipe Lima. Formato padrão para impressão e Kindle.',
    promptDescription: 'Official approved book cover layout for "FECHE OS OLHOS E OLHE PARA DEUS" by Felipe Lima. 3D Pixar/Disney style, cinematic golden volumetric light, Jesus with open loving arms, happy expressive children, rolling Galilean hills, woven baskets, bread, rich typography in gold and white.',
    renderSvg: (opts) => renderCapaAprovadaSvg(opts?.title, 'Felipe Lima'),
  },
  {
    id: '01-familia-com-jesus',
    filename: '01-familia-com-jesus.png',
    title: 'Família Reunida com Jesus',
    subtitle: 'Paz e proteção no lar',
    themeCategory: 'familia',
    description: 'Jesus em doce comunhão com o pai, a mãe e os filhos em clima de acolhimento e alegria espiritual.',
    promptDescription: '3D Pixar style scene of Jesus sitting warmly with a family, father, mother, and children smiling peacefully in a sunny biblical countryside, soft golden hour lighting, cinematic ray tracing.',
    renderSvg: (opts) => renderFamiliaComJesusSvg(opts?.title),
  },
  {
    id: '02-oracao',
    filename: '02-oracao.png',
    title: 'Oração com Jesus',
    subtitle: 'Feche os olhos e sinta a presença de Deus',
    themeCategory: 'oracao',
    description: 'Momento íntimo de oração onde Jesus e a criança fecham os olhos com serenidade, iluminados pela luz celestial.',
    promptDescription: 'Close-up 3D Pixar render of Jesus and a young child praying together with closed eyes and joined hands, warm celestial golden glow emanating, peaceful sacred atmosphere, tender expression.',
    renderSvg: (opts) => renderOracaoSvg(opts?.title),
  },
  {
    id: '03-cestos',
    filename: '03-cestos.png',
    title: 'A Oferta dos Cestos',
    subtitle: 'Generosidade e confiança infantil',
    themeCategory: 'aprendizado',
    description: 'Um menino oferecendo com pureza o cestinho de pães e peixes para Jesus, ensinando a beleza de compartilhar.',
    promptDescription: '3D Pixar style scene of a generous young boy offering a small wicker basket containing five loaves of golden bread and two small fish to Jesus, warm ambient light, detailed wicker texture.',
    renderSvg: (opts) => renderCestosSvg(opts?.title),
  },
  {
    id: '04-milagre',
    filename: '04-milagre.png',
    title: 'O Milagre da Multiplicação',
    subtitle: 'A abundância do amor e da partilha',
    themeCategory: 'milagre',
    description: 'Os cestos transbordando de pães dourados e quentinhos, celebrando a providência divina e a alegria compartilhada.',
    promptDescription: '3D Pixar style dramatic miracle of multiplication, baskets overflowing with fresh golden crusty loaves of bread under radiant sunset sky, wonder and joy in the eyes of onlookers.',
    renderSvg: (opts) => renderMilagreSvg(opts?.title),
  },
  {
    id: '05-refeicao',
    filename: '05-refeicao.png',
    title: 'A Grande Refeição em Família',
    subtitle: 'Gratidão em cada pedaço',
    themeCategory: 'comunhao',
    description: 'Crianças e famílias comendo juntos sobre a relva com largos sorrisos, celebrando a bênção da união.',
    promptDescription: '3D Pixar scene of smiling children and families happily eating together on a grassy hill, sharing bread with laughter, warm sunshine, cheerful bright colors, feeling of feast and unity.',
    renderSvg: (opts) => renderRefeicaoSvg(opts?.title),
  },
  {
    id: '06-ensinamento',
    filename: '06-ensinamento.png',
    title: 'O Ensinamento do Mestre',
    subtitle: 'Palavras de sabedoria e amor',
    themeCategory: 'aprendizado',
    description: 'Jesus gesticulando com doçura e sabedoria, explicando lições para o coração das crianças e dos pais.',
    promptDescription: '3D Pixar scene of Jesus gently teaching eager, wide-eyed children sitting around him on a hilltop at sunset, olive trees and soft golden landscape, affectionate storytelling pose.',
    renderSvg: (opts) => renderEnsinamentoSvg(opts?.title),
  },
  {
    id: '07-cestinha',
    filename: '07-cestinha.png',
    title: 'A Cestinha de Maravilhas',
    subtitle: 'O encanto da simplicidade',
    themeCategory: 'aprendizado',
    description: 'Criança segurando sua cestinha com olhos brilhando de encanto e gratidão pelo milagre do dia a dia.',
    promptDescription: '3D Pixar cute render of a child holding up a woven wicker basket filled with small warm breads, eyes sparkling with wonder and innocent joy, rosy cheeks, warm sunlit background.',
    renderSvg: (opts) => renderCestinhaSvg(opts?.title),
  },
  {
    id: '08-conversa',
    filename: '08-conversa.png',
    title: 'Conversa no Olho no Olho',
    subtitle: 'Acolhimento para quando o coração precisa',
    themeCategory: 'oracao',
    description: 'Jesus se abaixa na mesma altura da criança, pousando a mão amiga no ombro e transmitindo segurança e calma.',
    promptDescription: 'Intimate 3D Pixar scene of Jesus kneeling down to eye level with a child, placing a comforting hand on their shoulder, warm smile of deep understanding and love, gentle cinematic lighting.',
    renderSvg: (opts) => renderConversaSvg(opts?.title),
  },
];

// Helper to get image URI for any chapter or scene
export function getStandardIllustrationForChapter(chapterNumber: number, isFinal: boolean): string {
  // Map chapter number to standard approved scenes:
  // Cap 1: 03-cestos (desafio / oferta) or 01-familia-com-jesus
  // Cap 2: 02-oracao (oração / olhar para Deus) or 08-conversa
  // Cap 3: 04-milagre (vitória / milagre) or 05-refeicao (celebração final)
  if (isFinal || chapterNumber >= 3) {
    return toDataUri(renderMilagreSvg());
  }
  if (chapterNumber === 1) {
    return toDataUri(renderCestosSvg());
  }
  return toDataUri(renderOracaoSvg());
}
