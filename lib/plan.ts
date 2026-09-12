export type Domain =
  | 'Verbal'
  | 'Visuoespacial'
  | 'Memória operacional'
  | 'Raciocínio'
  | 'Executivo';

export type Prescription = {
  domain: Domain;
  title: string;
  subtitle: string;
  minutes: number;
  level: number;
  environment: string;
  rule: string;
  record: string;
  steps: string[];
  prompts?: string[];
  stimulus?: string;
  secondaryDomain?: Domain;
};

type WeekKit = {
  theme: string;
  concept: string;
  words: string[];
  objects: string[];
  sequence: number[];
  reasoning: string;
  transfer: string;
};

const phases = [
  {
    name: 'Baseline',
    range: 'Semanas 1–2',
    detail:
      'Calibrar evocação, representação espacial, memória e raciocínio sem buscar velocidade.',
  },
  {
    name: 'Fundação',
    range: 'Semanas 3–6',
    detail:
      'Criar métodos estáveis e aumentar precisão com tarefas curtas e concretas.',
  },
  {
    name: 'Desenvolvimento',
    range: 'Semanas 7–12',
    detail:
      'Aumentar abstração, interferência e quantidade de informação manipulada.',
  },
  {
    name: 'Integração',
    range: 'Semanas 13–18',
    detail: 'Combinar linguagem, memória, espaço e raciocínio na mesma missão.',
  },
  {
    name: 'Alta complexidade',
    range: 'Semanas 19–23',
    detail: 'Resolver problemas novos com menos apoio e maior transferência.',
  },
  {
    name: 'Desafio final',
    range: 'Semanas 24–25',
    detail:
      'Integrar habilidades em hipóteses, explicações e problemas inéditos.',
  },
  {
    name: 'Avaliação',
    range: 'Semana 26',
    detail:
      'Repetir referências de baseline e medir transferência sem treinar o formato do teste.',
  },
];

export const seasonObjectives = [
  'Priorizar evocação lexical: recuperar palavras e conceitos sem depender de pistas.',
  'Fortalecer raciocínio visuoespacial por rotação, reconstrução e mudança de perspectiva.',
  'Treinar memória operacional: manter e manipular informação mentalmente.',
  'Aprimorar abstração, formulação de hipóteses, lógica e explicação causal.',
  'Melhorar atenção, flexibilidade e precisão executiva em tarefas curtas.',
  'Usar física e ciência como conteúdo progressivo, começando do intuitivo e avançando sem presumir domínio prévio.',
  'Medir transferência com desafios inéditos, em vez de repetir testes de QI como treino.',
];

export function getPhase(week: number) {
  if (week <= 2) return phases[0];
  if (week <= 6) return phases[1];
  if (week <= 12) return phases[2];
  if (week <= 18) return phases[3];
  if (week <= 23) return phases[4];
  if (week <= 25) return phases[5];
  return phases[6];
}

export const domains: Domain[] = [
  'Verbal',
  'Visuoespacial',
  'Memória operacional',
  'Raciocínio',
  'Executivo',
];
const schedule: Domain[] = [
  'Verbal',
  'Visuoespacial',
  'Memória operacional',
  'Raciocínio',
  'Verbal',
];
const levelFor = (week: number) => Math.min(10, 1 + Math.floor((week - 1) / 3));

const weekKits: WeekKit[] = [
  {
    theme: 'Movimento, força e energia',
    concept: 'energia',
    words: ['inércia', 'resultante', 'trabalho', 'potência', 'conservação'],
    objects: ['caneca', 'chave', 'moeda'],
    sequence: [7, 2, 9, 4, 1],
    reasoning:
      'Uma bola continua em movimento em uma superfície ideal sem atrito. Por que ela não precisa de uma força contínua para continuar andando?',
    transfer:
      'Explique energia para uma criança de 10 anos e depois para alguém que cursou engenharia.',
  },
  {
    theme: 'Gravidade e órbitas',
    concept: 'órbita',
    words: ['gravidade', 'trajetória', 'aceleração', 'velocidade', 'elipse'],
    objects: ['livro', 'moeda', 'caneta', 'chave'],
    sequence: [4, 8, 1, 6, 3, 9],
    reasoning:
      'Por que um satélite pode estar continuamente caindo em direção à Terra sem atingir o solo?',
    transfer: 'Explique a diferença entre cair e orbitar sem usar fórmulas.',
  },
  {
    theme: 'Ondas e som',
    concept: 'onda',
    words: [
      'frequência',
      'amplitude',
      'comprimento',
      'ressonância',
      'interferência',
    ],
    objects: ['copo', 'colher', 'borracha', 'caneta'],
    sequence: [3, 9, 2, 7, 5, 1],
    reasoning:
      'Duas ondas podem se encontrar e produzir momentaneamente uma amplitude menor. O que isso sugere sobre como ondas se combinam?',
    transfer:
      'Crie uma analogia cotidiana para frequência e outra para amplitude.',
  },
  {
    theme: 'Luz e espectro',
    concept: 'espectro',
    words: ['refração', 'difração', 'espectro', 'fóton', 'comprimento'],
    objects: ['lanterna desligada', 'livro', 'moeda', 'lápis'],
    sequence: [8, 5, 2, 9, 4, 7],
    reasoning: 'Por que um prisma separa a luz branca em cores diferentes?',
    transfer:
      'Explique por que cor não é apenas uma propriedade isolada do objeto.',
  },
  {
    theme: 'Termodinâmica',
    concept: 'entropia',
    words: ['entropia', 'equilíbrio', 'temperatura', 'calor', 'irreversível'],
    objects: ['caneca', 'colher', 'moeda', 'guardanapo'],
    sequence: [6, 1, 8, 3, 9, 2],
    reasoning:
      'Por que café quente tende a esfriar em uma sala, mas o café frio não esquenta espontaneamente retirando energia do ambiente de forma concentrada?',
    transfer: 'Explique por que “entropia = bagunça” é uma simplificação.',
  },
  {
    theme: 'Eletricidade e magnetismo',
    concept: 'campo',
    words: ['carga', 'campo', 'potencial', 'corrente', 'indução'],
    objects: ['pilha', 'moeda', 'chave', 'caneta'],
    sequence: [2, 7, 4, 9, 1, 6, 3],
    reasoning: 'Como um ímã pode exercer força sem encostar no objeto?',
    transfer:
      'Compare a ideia de campo gravitacional e campo elétrico em linguagem simples.',
  },
  {
    theme: 'Relatividade especial: princípios',
    concept: 'referencial',
    words: [
      'referencial',
      'invariância',
      'simultaneidade',
      'relativo',
      'observador',
    ],
    objects: ['relógio', 'caneta', 'moeda', 'livro'],
    sequence: [9, 3, 6, 1, 8, 4, 2],
    reasoning:
      'Se a velocidade da luz é a mesma para observadores em movimento relativo, qual grandeza intuitiva precisa deixar de ser absoluta?',
    transfer: 'Explique “referencial” usando um trem e uma plataforma.',
  },
  {
    theme: 'Relatividade especial: tempo e espaço',
    concept: 'dilatação temporal',
    words: ['dilatação', 'contração', 'evento', 'intervalo', 'causalidade'],
    objects: ['relógio', 'chave', 'moeda', 'copo', 'caneta'],
    sequence: [5, 1, 9, 3, 7, 2, 8],
    reasoning:
      'Por que dois observadores podem discordar sobre a duração entre eventos sem que um deles esteja “errado”?',
    transfer:
      'Explique dilatação temporal sem usar a expressão “o tempo fica mais lento”.',
  },
  {
    theme: 'Espaço-tempo e gravidade',
    concept: 'curvatura',
    words: ['curvatura', 'geodésica', 'massa', 'espaço-tempo', 'equivalência'],
    objects: ['bola', 'livro', 'moeda', 'caneta', 'chave'],
    sequence: [4, 9, 2, 6, 1, 8, 5],
    reasoning:
      'Como a gravidade pode ser descrita como geometria em vez de uma força convencional?',
    transfer:
      'Crie uma analogia para geodésica e depois aponte uma limitação da própria analogia.',
  },
  {
    theme: 'Quântica: fundamentos',
    concept: 'superposição',
    words: ['quântico', 'superposição', 'estado', 'medição', 'probabilidade'],
    objects: ['moeda', 'dado', 'carta', 'caneta'],
    sequence: [8, 2, 5, 9, 1, 4, 7],
    reasoning:
      'Qual a diferença entre “não saber em qual estado o sistema está” e descrever um estado quântico como superposição?',
    transfer: 'Explique superposição sem recorrer ao gato de Schrödinger.',
  },
  {
    theme: 'Dualidade e interferência quântica',
    concept: 'dualidade',
    words: ['dualidade', 'interferência', 'fóton', 'elétron', 'detecção'],
    objects: ['duas moedas', 'caneta', 'livro', 'carta'],
    sequence: [1, 7, 3, 9, 5, 2, 8, 4],
    reasoning:
      'Por que o experimento da dupla fenda é difícil de explicar usando apenas a imagem clássica de partículas como pequenas bolinhas?',
    transfer:
      'Explique o que o padrão de interferência nos obriga a reconsiderar.',
  },
  {
    theme: 'Incerteza e probabilidade',
    concept: 'incerteza',
    words: [
      'incerteza',
      'observável',
      'distribuição',
      'precisão',
      'probabilidade',
    ],
    objects: ['dado', 'moeda', 'carta', 'chave', 'caneta'],
    sequence: [6, 2, 9, 4, 1, 8, 3, 7],
    reasoning:
      'Por que o princípio da incerteza não significa apenas que nossos instrumentos são imperfeitos?',
    transfer: 'Diferencie incerteza quântica de erro de medição.',
  },
  {
    theme: 'Átomos e níveis de energia',
    concept: 'quantização',
    words: ['quantização', 'orbital', 'nível', 'transição', 'emissão'],
    objects: ['três moedas', 'caneta', 'livro'],
    sequence: [3, 8, 1, 6, 9, 2, 7, 4],
    reasoning:
      'Por que átomos emitem linhas espectrais específicas em vez de qualquer frequência possível?',
    transfer:
      'Explique níveis discretos usando uma escada e depois diga onde a analogia falha.',
  },
  {
    theme: 'Partículas fundamentais',
    concept: 'partícula elementar',
    words: ['quark', 'lépton', 'bóson', 'férmion', 'interação'],
    objects: ['seis cartas', 'moeda', 'caneta'],
    sequence: [9, 4, 2, 8, 5, 1, 7, 3],
    reasoning:
      'O que significa dizer que uma partícula é “elementar” no modelo atual?',
    transfer:
      'Organize quarks, léptons e bósons em uma explicação de no máximo 60 segundos.',
  },
  {
    theme: 'Simetrias e conservação',
    concept: 'simetria',
    words: [
      'simetria',
      'invariância',
      'conservação',
      'transformação',
      'momento',
    ],
    objects: ['baralho', 'duas moedas', 'caneta'],
    sequence: [2, 8, 4, 1, 9, 5, 3, 7],
    reasoning:
      'Como uma simetria pode estar relacionada a uma lei de conservação?',
    transfer:
      'Dê um exemplo cotidiano de algo que muda de aparência mas preserva uma propriedade relevante.',
  },
  {
    theme: 'Estrelas e nucleossíntese',
    concept: 'fusão',
    words: ['fusão', 'plasma', 'nucleossíntese', 'pressão', 'equilíbrio'],
    objects: ['bola', 'moeda', 'livro', 'caneta', 'copo'],
    sequence: [7, 1, 9, 3, 8, 2, 6, 4],
    reasoning:
      'Por que uma estrela pode permanecer estável por bilhões de anos sem colapsar imediatamente sob a própria gravidade?',
    transfer:
      'Explique equilíbrio hidrostático como um conflito entre tendências opostas.',
  },
  {
    theme: 'Buracos negros',
    concept: 'horizonte de eventos',
    words: ['horizonte', 'singularidade', 'acreção', 'geodésica', 'maré'],
    objects: ['bola', 'chave', 'moeda', 'relógio', 'caneta'],
    sequence: [5, 9, 2, 7, 1, 8, 4, 3],
    reasoning: 'Por que horizonte de eventos não é uma superfície sólida?',
    transfer:
      'Explique horizonte de eventos sem dizer que é um “buraco que suga tudo”.',
  },
  {
    theme: 'Cosmologia e expansão',
    concept: 'expansão do universo',
    words: ['expansão', 'redshift', 'homogêneo', 'isotrópico', 'escala'],
    objects: ['cinco moedas', 'régua', 'caneta'],
    sequence: [8, 3, 1, 9, 6, 2, 7, 4],
    reasoning:
      'Como galáxias podem se afastar umas das outras sem estarem necessariamente viajando através do espaço a partir de um centro?',
    transfer:
      'Explique expansão cósmica e aponte por que a analogia do balão é útil e limitada.',
  },
  {
    theme: 'Matéria escura',
    concept: 'evidência indireta',
    words: ['matéria', 'halo', 'rotação', 'lente', 'inferência'],
    objects: ['moeda', 'dado', 'chave', 'livro', 'caneta'],
    sequence: [1, 9, 4, 7, 2, 8, 5, 3],
    reasoning:
      'Como cientistas podem inferir a existência de algo que não observam diretamente pela luz?',
    transfer:
      'Liste três tipos de evidência que poderiam sustentar uma entidade não observada diretamente.',
  },
  {
    theme: 'Energia escura',
    concept: 'aceleração cósmica',
    words: ['aceleração', 'densidade', 'vácuo', 'constante', 'cosmológico'],
    objects: ['seis moedas', 'régua', 'caneta'],
    sequence: [6, 9, 2, 5, 8, 1, 7, 3],
    reasoning:
      'O que significa dizer que a expansão do universo está acelerando?',
    transfer:
      'Diferencie “velocidade de expansão” de “aceleração da expansão”.',
  },
  {
    theme: 'Entropia e informação',
    concept: 'informação física',
    words: [
      'informação',
      'microestado',
      'macroestado',
      'entropia',
      'irreversibilidade',
    ],
    objects: ['baralho', 'quatro moedas', 'caneta'],
    sequence: [9, 1, 6, 3, 8, 2, 7, 5],
    reasoning:
      'Por que muitos microestados diferentes podem corresponder ao mesmo estado macroscópico?',
    transfer: 'Relacione informação e entropia sem usar a palavra “bagunça”.',
  },
  {
    theme: 'Sistemas complexos',
    concept: 'emergência',
    words: [
      'emergência',
      'auto-organização',
      'não-linear',
      'retroalimentação',
      'coletivo',
    ],
    objects: ['dez moedas', 'dado', 'caneta'],
    sequence: [4, 8, 1, 9, 3, 7, 2, 6],
    reasoning:
      'Como regras locais simples podem produzir um comportamento global difícil de prever?',
    transfer:
      'Explique emergência para uma criança e depois para um pesquisador.',
  },
  {
    theme: 'Astrobiologia',
    concept: 'habitabilidade',
    words: [
      'habitabilidade',
      'biossinal',
      'metabolismo',
      'extremófilo',
      'homeostase',
    ],
    objects: ['copo', 'pedra', 'folha', 'moeda', 'caneta'],
    sequence: [7, 2, 9, 1, 5, 8, 3, 6],
    reasoning:
      'Por que “estar na zona habitável” não basta para concluir que um planeta pode sustentar vida?',
    transfer:
      'Crie uma lista de cinco variáveis que você investigaria antes de chamar um planeta de habitável.',
  },
  {
    theme: 'Atmosferas de exoplanetas',
    concept: 'assinatura espectral',
    words: ['atmosfera', 'absorção', 'espectroscopia', 'pressão', 'composição'],
    objects: [
      'prisma ou objeto transparente',
      'lanterna desligada',
      'moeda',
      'caneta',
    ],
    sequence: [3, 9, 5, 1, 8, 4, 7, 2],
    reasoning:
      'Como a luz de uma estrela atravessando uma atmosfera pode revelar quais moléculas existem nela?',
    transfer: 'Explique espectroscopia como uma investigação indireta.',
  },
  {
    theme: 'Síntese e hipótese científica',
    concept: 'modelo',
    words: ['hipótese', 'modelo', 'previsão', 'falsificável', 'evidência'],
    objects: ['baralho', 'dado', 'três moedas', 'caneta'],
    sequence: [8, 1, 7, 3, 9, 2, 6, 4],
    reasoning:
      'O que torna uma hipótese científica mais forte do que uma explicação que acomoda qualquer resultado?',
    transfer:
      'Proponha duas explicações concorrentes para um mesmo fenômeno e diga que observação distinguiria as duas.',
  },
  {
    theme: 'Avaliação e transferência',
    concept: 'transferência',
    words: [
      'inferência',
      'causalidade',
      'parcimônia',
      'contingente',
      'subjacente',
    ],
    objects: ['caneca', 'chave', 'moeda', 'carta', 'dado', 'caneta'],
    sequence: [9, 2, 7, 4, 1, 8, 5, 3],
    reasoning:
      'Diante de um problema totalmente novo, como separar o que você sabe, o que está inferindo e o que ainda precisa testar?',
    transfer:
      'Escolha um conceito da temporada e explique-o sem reutilizar a analogia treinada anteriormente.',
  },
];

function previousWords(week: number) {
  if (week <= 1) return ['causalidade', 'analogia'];
  const prev = weekKits[week - 2].words;
  return [prev[1], prev[3]];
}

export function getPrescription(week: number, day: number): Prescription {
  const kit = weekKits[Math.max(0, Math.min(25, week - 1))],
    level = levelFor(week);
  const base = {
    domain: schedule[Math.max(0, Math.min(4, day - 1))],
    level,
    minutes: 20,
    environment:
      'Responda aqui na plataforma ou use uma folha e uma caneta. Se fizer no papel, registre um resumo por etapa.',
    rule: 'Faça a tentativa antes de consultar. O objetivo é clareza e precisão, sem pressão de velocidade.',
  };
  if (day === 1)
    return {
      ...base,
      title: `Evocação lexical · ${kit.theme}`,
      subtitle: `Conceito central: ${kit.concept}. Recuperar, explicar e aplicar.`,
      record:
        'Palavras lembradas sem pista (0–5), definições e explicação final.',
      stimulus: `Palavras da semana: ${kit.words.join(', ')}.`,
      steps: [
        '4 min · Abra o material de consulta, leia as cinco palavras por 60 segundos e feche-o. Escreva as palavras que conseguir lembrar, sem voltar ao material.',
        '4 min · Defina cada palavra recuperada em uma linha. Marque com um ponto de interrogação as que ainda não conhece.',
        `4 min · Explique, em até cinco frases, o que você entende por ${kit.concept}. Você pode escrever ou formular em silêncio antes de registrar.`,
        '4 min · Confira o material e, se necessário, consulte uma das fontes indicadas. Corrija uma definição e diga o que mudou.',
        `4 min · ${kit.transfer} Registre sua resposta em até cinco linhas.`,
      ],
      prompts: [
        'Palavras lembradas sem consultar e total (0–5).',
        'Uma definição por palavra; indique suas dúvidas.',
        'Minha explicação inicial.',
        'Correção e motivo da mudança.',
        'Minha aplicação do conceito.',
      ],
    };
  if (day === 2) {
    const positions =
      level < 4
        ? 'A em (1,1); B em (3,1); C em (2,3)'
        : level < 7
          ? 'A em (1,1); B em (4,2); C em (2,3); D em (3,4)'
          : 'A em (1,2); B em (4,1); C em (2,4); D em (3,2); E em (1,4)';
    return {
      ...base,
      title: 'Representação espacial · mapa de letras',
      subtitle: 'Uma grade simples, em papel ou descrita por coordenadas.',
      stimulus: `Grade 4 × 4. Coordenadas (coluna, linha), começando no canto superior esquerdo. ${positions}.`,
      record: 'Posições recordadas, transformação e erros encontrados.',
      rule: 'Feche o material antes de reconstruir. A representação por coordenadas vale tanto quanto o desenho.',
      steps: [
        '4 min · Abra o material, observe as posições por 30 segundos e feche. Memorize a relação entre as letras.',
        '4 min · Reconstrua a grade no papel ou digite as coordenadas de cada letra sem consultar.',
        `4 min · Imagine a grade girada ${level < 4 ? '90° no sentido horário' : level < 7 ? '180°' : '90° no sentido anti-horário'}. Desenhe ou escreva as novas coordenadas.`,
        `4 min · Abra o material e confira. Regra de conferência: ${level < 4 ? '(coluna, linha) vira (5 − linha, coluna)' : level < 7 ? '(coluna, linha) vira (5 − coluna, 5 − linha)' : '(coluna, linha) vira (linha, 5 − coluna)'}. Liste cada diferença.`,
        '4 min · Feche o material e descreva a posição de duas letras em relação às outras. Termine com a estratégia que mais ajudou.',
      ],
      prompts: [
        'Estratégia de observação (sem copiar o modelo).',
        'Reconstrução: A=(...), B=(...), C=(...).',
        'Coordenadas ou descrição após girar.',
        'Erros de posição/orientação e correções.',
        'Descrição e estratégia para a próxima tentativa.',
      ],
    };
  }
  if (day === 3)
    return {
      ...base,
      secondaryDomain: 'Executivo',
      title: 'Memória operacional + troca de regra',
      subtitle: 'Manter números na memória e mudar a forma de organizá-los.',
      stimulus: `Sequência: ${kit.sequence.join(' – ')}.`,
      record: 'Respostas direta, inversa, por regra e cálculo final.',
      rule: 'Feche o material antes de responder. Use o papel ou o campo de resposta somente depois de manipular mentalmente.',
      steps: [
        '4 min · Observe a sequência no material por 20 segundos. Feche e reproduza na ordem original.',
        '4 min · Sem reabrir o material, escreva a sequência na ordem inversa.',
        '4 min · Troque a regra: escreva os pares em ordem crescente e depois os ímpares em ordem decrescente. Refaça mentalmente antes de registrar.',
        `4 min · Calcule mentalmente: comece em ${kit.sequence[0] * 3}; depois subtraia ${kit.sequence[1]}, some ${kit.sequence[2]}, subtraia ${kit.sequence[3]} e some ${kit.sequence[4]}. Registre o resultado e três palavras do tema da semana.`,
        '4 min · Abra o material para conferir. Classifique os erros em memória, troca de regra ou cálculo e registre o que faria diferente.',
      ],
      prompts: [
        'Sequência na ordem original.',
        'Sequência inversa.',
        'Pares crescentes; ímpares decrescentes.',
        'Resultado do cálculo e três palavras.',
        'Conferência e estratégia.',
      ],
    };
  if (day === 4)
    return {
      ...base,
      title: `Raciocínio científico · ${kit.concept}`,
      subtitle: 'Um problema pronto para pensar, explicar e revisar.',
      record: 'Hipótese inicial, premissas e resposta final.',
      steps: [
        `4 min · Leia o problema: ${kit.reasoning} Registre uma hipótese inicial em até três frases.`,
        '4 min · Separe sua hipótese em duas listas: o que sei e o que estou inferindo.',
        `4 min · Represente ${kit.concept} com um diagrama no papel ou com uma sequência escrita: causa → mecanismo → consequência.`,
        '4 min · Consulte a referência da semana e uma das fontes indicadas se precisar. Identifique um acerto e uma correção na hipótese inicial.',
        '4 min · Reescreva a explicação em no máximo três frases e formule uma pergunta que ainda ficou aberta.',
      ],
      prompts: [
        'Minha hipótese inicial.',
        'O que sei / o que estou inferindo.',
        'Diagrama descrito ou sequência causal.',
        'Um acerto e uma correção.',
        'Explicação revisada e dúvida restante.',
      ],
    };
  return {
    ...base,
    secondaryDomain: 'Executivo',
    title: 'Evocação tardia + síntese da semana',
    subtitle: 'Recuperação de palavras e mudança de audiência.',
    record: 'Palavras lembradas sem pista e clareza de duas explicações.',
    stimulus: `Conferência, somente depois de responder: ${kit.words.join(', ')}. Revisão anterior: ${previousWords(week).join(', ')}.`,
    steps: [
      '4 min · Sem rever as sessões ou o material, escreva as cinco palavras da semana e duas palavras que lembrar da semana anterior.',
      '4 min · Escolha duas palavras lembradas. Para cada uma, escreva um contraste, uma definição curta e uma frase original.',
      `4 min · Explique ${kit.concept} para uma criança de 10 anos, em até três frases.`,
      '4 min · Explique o mesmo conceito para um universitário de exatas, com até três frases e maior precisão.',
      `4 min · ${kit.transfer} Depois confira o material e anote palavras esquecidas e uma meta simples para a próxima semana.`,
    ],
    prompts: [
      'Palavras recuperadas antes de consultar.',
      'Duas palavras, definições, contrastes e frases.',
      'Explicação para uma criança.',
      'Explicação para um universitário.',
      'Transferência, conferência e próxima meta.',
    ],
  };
}
export function seasonDistribution() {
  const counts = Object.fromEntries(domains.map((d) => [d, 0])) as Record<
    Domain,
    number
  >;
  for (let w = 1; w <= 26; w++)
    for (let d = 1; d <= 5; d++) {
      const p = getPrescription(w, d);
      counts[p.domain]++;
      if (p.secondaryDomain) counts[p.secondaryDomain]++;
    }
  return counts;
}
