export type Skill =
  | 'Atenção'
  | 'Flexibilidade'
  | 'Visuoespacial'
  | 'Verbal'
  | 'Criatividade'
  | 'Programação';

export const skills: {
  name: Skill;
  short: string;
  color: string;
  priority: string;
}[] = [
  { name: 'Atenção', short: 'C', color: '#c8ff4d', priority: 'PRIORIDADE' },
  {
    name: 'Flexibilidade',
    short: 'H',
    color: '#68e7ff',
    priority: 'PRIORIDADE',
  },
  {
    name: 'Visuoespacial',
    short: 'B',
    color: '#a88cff',
    priority: 'PRIORIDADE',
  },
  { name: 'Verbal', short: 'V', color: '#ffb454', priority: 'SECUNDÁRIA' },
  {
    name: 'Criatividade',
    short: 'R',
    color: '#ff6f91',
    priority: 'SECUNDÁRIA',
  },
  { name: 'Programação', short: 'P', color: '#65f2b1', priority: 'SECUNDÁRIA' },
];

const phases = [
  {
    name: 'Calibrar',
    range: 'Semanas 1–4',
    detail: 'Precisão antes da velocidade. Descubra seu ritmo-base.',
  },
  {
    name: 'Construir',
    range: 'Semanas 5–9',
    detail: 'Aumente regras, ângulos e extensão dos textos.',
  },
  {
    name: 'Alternar',
    range: 'Semanas 10–14',
    detail: 'Troque de regra sob pressão e conecte modalidades.',
  },
  {
    name: 'Transferir',
    range: 'Semanas 15–20',
    detail: 'Use as habilidades em histórias, código e desenho.',
  },
  {
    name: 'Integrar',
    range: 'Semanas 21–24',
    detail: 'Missões compostas com decisões e restrições.',
  },
  {
    name: 'Consolidar',
    range: 'Semanas 25–26',
    detail: 'Refaça a linha de base e feche seu relatório.',
  },
];

export const getPhase = (week: number) =>
  phases.find((_, i) => week <= [4, 9, 14, 20, 24, 26][i]) ?? phases[5];

const dailyTemplates = [
  [
    ['Radar de sinais', 'Atenção', 12],
    ['Giro orbital', 'Visuoespacial', 12],
    ['Diário de bordo', 'Verbal', 14],
    ['Fechamento', 'Flexibilidade', 5],
  ],
  [
    ['Troca de comando', 'Flexibilidade', 12],
    ['Vocabulário Solaris', 'Verbal', 13],
    ['Desenho: formas-base', 'Visuoespacial', 15],
    ['Revisão', 'Atenção', 5],
  ],
  [
    ['Radar de sinais', 'Atenção', 14],
    ['Código: primeira missão', 'Programação', 16],
    ['Rotas alternativas', 'Flexibilidade', 10],
    ['Fechamento', 'Verbal', 5],
  ],
  [
    ['Giro orbital', 'Visuoespacial', 15],
    ['Argumento alienígena', 'Verbal', 14],
    ['Troca de comando', 'Flexibilidade', 11],
    ['Revisão', 'Atenção', 5],
  ],
  [
    ['Radar de sinais', 'Atenção', 12],
    ['Desenho: perspectiva', 'Visuoespacial', 15],
    ['Microconto Clarke', 'Criatividade', 13],
    ['Fechamento', 'Flexibilidade', 5],
  ],
  [
    ['Desafio da semana', 'Flexibilidade', 15],
    ['Arena de palavras', 'Verbal', 12],
    ['Padrões de colônia', 'Visuoespacial', 13],
    ['Debrief', 'Atenção', 5],
  ],
] as const;

export function getSession(week: number, day: number) {
  const scale =
    week <= 4 ? 0 : week <= 9 ? 1 : week <= 14 ? 2 : week <= 20 ? 3 : 4;
  return dailyTemplates[day].map(([title, skill, minutes], i) => ({
    id: `w${week}d${day + 1}a${i + 1}`,
    title,
    skill: skill as Skill,
    minutes,
    level: Math.min(10, 1 + scale + Math.floor(week / 6)),
  }));
}

export const gamePrompts = {
  attention: `Crie um jogo HTML/CSS/JS em arquivo único, responsivo e acessível, chamado “Radar de Sinais”. Exiba uma grade de símbolos espaciais e peça para tocar apenas no alvo indicado. Rodadas de 60–120 s, dificuldade adaptativa por tamanho da grade, similaridade dos distratores e tempo. Registre acurácia, omissões, falsos positivos e tempo de reação mediano. Inclua pausa, teclado, vibração opcional e exportação JSON. Visual escuro sci-fi, sem bibliotecas externas.`,
  flexibility: `Crie um jogo HTML/CSS/JS em arquivo único chamado “Troca de Comando”. Mostre cartas com cor, forma e número. Uma regra no topo muda periodicamente: responder pela cor, forma, paridade ou pela regra oposta. Aumente a frequência das trocas de forma adaptativa. Registre acertos, erros perseverativos, custo de troca e sequência máxima. Responsivo, acessível por teclado/toque, sem bibliotecas externas.`,
  spatial: `Crie um jogo HTML/CSS/JS em arquivo único chamado “Giro Orbital”. Mostre uma figura geométrica 2D assimétrica e quatro alternativas; o jogador escolhe a mesma figura após rotação, nunca reflexão. Comece com 90° e avance para ângulos variados, figuras compostas e limite de tempo. Registre acurácia por ângulo e tempo mediano. Use Canvas ou SVG, responsivo e sem bibliotecas externas.`,
  verbal: `Crie um jogo HTML/CSS/JS em arquivo único chamado “Arena de Palavras”. Em rodadas temáticas de ficção científica, apresente uma palavra e peça sinônimo, antônimo, definição curta ou uso em microconto. Inclua banco editável de palavras, repetição espaçada simples e pontuação por variedade e recuperação. Permita autoavaliação 0–3, histórico local e exportação JSON. Responsivo, acessível e sem bibliotecas externas.`,
};
