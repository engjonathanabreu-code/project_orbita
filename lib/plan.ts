export type Domain = 'Verbal' | 'Visuoespacial' | 'Memória operacional' | 'Raciocínio' | 'Executivo';

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
  { name: 'Baseline', range: 'Semanas 1–2', detail: 'Calibrar evocação, representação espacial, memória e raciocínio sem buscar velocidade.' },
  { name: 'Fundação', range: 'Semanas 3–6', detail: 'Criar métodos estáveis e aumentar precisão com tarefas curtas e concretas.' },
  { name: 'Desenvolvimento', range: 'Semanas 7–12', detail: 'Aumentar abstração, interferência e quantidade de informação manipulada.' },
  { name: 'Integração', range: 'Semanas 13–18', detail: 'Combinar linguagem, memória, espaço e raciocínio na mesma missão.' },
  { name: 'Alta complexidade', range: 'Semanas 19–23', detail: 'Resolver problemas novos com menos apoio e maior transferência.' },
  { name: 'Desafio final', range: 'Semanas 24–25', detail: 'Integrar habilidades em hipóteses, explicações e problemas inéditos.' },
  { name: 'Avaliação', range: 'Semana 26', detail: 'Repetir referências de baseline e medir transferência sem treinar o formato do teste.' },
];

export const seasonObjectives = [
  'Priorizar evocação lexical: recuperar palavras e conceitos sem depender de pistas.',
  'Fortalecer raciocínio visuoespacial por rotação, reconstrução e mudança de perspectiva.',
  'Treinar memória operacional: manter e manipular informação mentalmente.',
  'Aprimorar abstração, formulação de hipóteses, lógica e explicação causal.',
  'Melhorar atenção, flexibilidade e precisão executiva em tarefas curtas.',
  'Usar física e ciência como conteúdo progressivo, começando do intuitivo e avançando sem presumir domínio prévio.',
  'Medir transferência com desafios inéditos, em vez de repetir testes de QI como treino.'
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

export const domains: Domain[] = ['Verbal','Visuoespacial','Memória operacional','Raciocínio','Executivo'];
const schedule: Domain[] = ['Verbal','Visuoespacial','Memória operacional','Raciocínio','Verbal','Executivo'];
const levelFor = (week:number) => Math.min(10, 1 + Math.floor((week - 1) / 3));

const weekKits: WeekKit[] = [
  {theme:'Movimento, força e energia',concept:'energia',words:['inércia','resultante','trabalho','potência','conservação'],objects:['caneca','chave','moeda'],sequence:[7,2,9,4,1],reasoning:'Uma bola continua em movimento em uma superfície ideal sem atrito. Por que ela não precisa de uma força contínua para continuar andando?',transfer:'Explique energia para uma criança de 10 anos e depois para alguém que cursou engenharia.'},
  {theme:'Gravidade e órbitas',concept:'órbita',words:['gravidade','trajetória','aceleração','velocidade','elipse'],objects:['livro','moeda','caneta','chave'],sequence:[4,8,1,6,3,9],reasoning:'Por que um satélite pode estar continuamente caindo em direção à Terra sem atingir o solo?',transfer:'Explique a diferença entre cair e orbitar sem usar fórmulas.'},
  {theme:'Ondas e som',concept:'onda',words:['frequência','amplitude','comprimento','ressonância','interferência'],objects:['copo','colher','borracha','caneta'],sequence:[3,9,2,7,5,1],reasoning:'Duas ondas podem se encontrar e produzir momentaneamente uma amplitude menor. O que isso sugere sobre como ondas se combinam?',transfer:'Crie uma analogia cotidiana para frequência e outra para amplitude.'},
  {theme:'Luz e espectro',concept:'espectro',words:['refração','difração','espectro','fóton','comprimento'],objects:['lanterna desligada','livro','moeda','lápis'],sequence:[8,5,2,9,4,7],reasoning:'Por que um prisma separa a luz branca em cores diferentes?',transfer:'Explique por que cor não é apenas uma propriedade isolada do objeto.'},
  {theme:'Termodinâmica',concept:'entropia',words:['entropia','equilíbrio','temperatura','calor','irreversível'],objects:['caneca','colher','moeda','guardanapo'],sequence:[6,1,8,3,9,2],reasoning:'Por que café quente tende a esfriar em uma sala, mas o café frio não esquenta espontaneamente retirando energia do ambiente de forma concentrada?',transfer:'Explique por que “entropia = bagunça” é uma simplificação.'},
  {theme:'Eletricidade e magnetismo',concept:'campo',words:['carga','campo','potencial','corrente','indução'],objects:['pilha','moeda','chave','caneta'],sequence:[2,7,4,9,1,6,3],reasoning:'Como um ímã pode exercer força sem encostar no objeto?',transfer:'Compare a ideia de campo gravitacional e campo elétrico em linguagem simples.'},
  {theme:'Relatividade especial: princípios',concept:'referencial',words:['referencial','invariância','simultaneidade','relativo','observador'],objects:['relógio','caneta','moeda','livro'],sequence:[9,3,6,1,8,4,2],reasoning:'Se a velocidade da luz é a mesma para observadores em movimento relativo, qual grandeza intuitiva precisa deixar de ser absoluta?',transfer:'Explique “referencial” usando um trem e uma plataforma.'},
  {theme:'Relatividade especial: tempo e espaço',concept:'dilatação temporal',words:['dilatação','contração','evento','intervalo','causalidade'],objects:['relógio','chave','moeda','copo','caneta'],sequence:[5,1,9,3,7,2,8],reasoning:'Por que dois observadores podem discordar sobre a duração entre eventos sem que um deles esteja “errado”?',transfer:'Explique dilatação temporal sem usar a expressão “o tempo fica mais lento”.'},
  {theme:'Espaço-tempo e gravidade',concept:'curvatura',words:['curvatura','geodésica','massa','espaço-tempo','equivalência'],objects:['bola','livro','moeda','caneta','chave'],sequence:[4,9,2,6,1,8,5],reasoning:'Como a gravidade pode ser descrita como geometria em vez de uma força convencional?',transfer:'Crie uma analogia para geodésica e depois aponte uma limitação da própria analogia.'},
  {theme:'Quântica: fundamentos',concept:'superposição',words:['quântico','superposição','estado','medição','probabilidade'],objects:['moeda','dado','carta','caneta'],sequence:[8,2,5,9,1,4,7],reasoning:'Qual a diferença entre “não saber em qual estado o sistema está” e descrever um estado quântico como superposição?',transfer:'Explique superposição sem recorrer ao gato de Schrödinger.'},
  {theme:'Dualidade e interferência quântica',concept:'dualidade',words:['dualidade','interferência','fóton','elétron','detecção'],objects:['duas moedas','caneta','livro','carta'],sequence:[1,7,3,9,5,2,8,4],reasoning:'Por que o experimento da dupla fenda é difícil de explicar usando apenas a imagem clássica de partículas como pequenas bolinhas?',transfer:'Explique o que o padrão de interferência nos obriga a reconsiderar.'},
  {theme:'Incerteza e probabilidade',concept:'incerteza',words:['incerteza','observável','distribuição','precisão','probabilidade'],objects:['dado','moeda','carta','chave','caneta'],sequence:[6,2,9,4,1,8,3,7],reasoning:'Por que o princípio da incerteza não significa apenas que nossos instrumentos são imperfeitos?',transfer:'Diferencie incerteza quântica de erro de medição.'},
  {theme:'Átomos e níveis de energia',concept:'quantização',words:['quantização','orbital','nível','transição','emissão'],objects:['três moedas','caneta','livro'],sequence:[3,8,1,6,9,2,7,4],reasoning:'Por que átomos emitem linhas espectrais específicas em vez de qualquer frequência possível?',transfer:'Explique níveis discretos usando uma escada e depois diga onde a analogia falha.'},
  {theme:'Partículas fundamentais',concept:'partícula elementar',words:['quark','lépton','bóson','férmion','interação'],objects:['seis cartas','moeda','caneta'],sequence:[9,4,2,8,5,1,7,3],reasoning:'O que significa dizer que uma partícula é “elementar” no modelo atual?',transfer:'Organize quarks, léptons e bósons em uma explicação de no máximo 60 segundos.'},
  {theme:'Simetrias e conservação',concept:'simetria',words:['simetria','invariância','conservação','transformação','momento'],objects:['baralho','duas moedas','caneta'],sequence:[2,8,4,1,9,5,3,7],reasoning:'Como uma simetria pode estar relacionada a uma lei de conservação?',transfer:'Dê um exemplo cotidiano de algo que muda de aparência mas preserva uma propriedade relevante.'},
  {theme:'Estrelas e nucleossíntese',concept:'fusão',words:['fusão','plasma','nucleossíntese','pressão','equilíbrio'],objects:['bola','moeda','livro','caneta','copo'],sequence:[7,1,9,3,8,2,6,4],reasoning:'Por que uma estrela pode permanecer estável por bilhões de anos sem colapsar imediatamente sob a própria gravidade?',transfer:'Explique equilíbrio hidrostático como um conflito entre tendências opostas.'},
  {theme:'Buracos negros',concept:'horizonte de eventos',words:['horizonte','singularidade','acreção','geodésica','maré'],objects:['bola','chave','moeda','relógio','caneta'],sequence:[5,9,2,7,1,8,4,3],reasoning:'Por que horizonte de eventos não é uma superfície sólida?',transfer:'Explique horizonte de eventos sem dizer que é um “buraco que suga tudo”.'},
  {theme:'Cosmologia e expansão',concept:'expansão do universo',words:['expansão','redshift','homogêneo','isotrópico','escala'],objects:['cinco moedas','régua','caneta'],sequence:[8,3,1,9,6,2,7,4],reasoning:'Como galáxias podem se afastar umas das outras sem estarem necessariamente viajando através do espaço a partir de um centro?',transfer:'Explique expansão cósmica e aponte por que a analogia do balão é útil e limitada.'},
  {theme:'Matéria escura',concept:'evidência indireta',words:['matéria','halo','rotação','lente','inferência'],objects:['moeda','dado','chave','livro','caneta'],sequence:[1,9,4,7,2,8,5,3],reasoning:'Como cientistas podem inferir a existência de algo que não observam diretamente pela luz?',transfer:'Liste três tipos de evidência que poderiam sustentar uma entidade não observada diretamente.'},
  {theme:'Energia escura',concept:'aceleração cósmica',words:['aceleração','densidade','vácuo','constante','cosmológico'],objects:['seis moedas','régua','caneta'],sequence:[6,9,2,5,8,1,7,3],reasoning:'O que significa dizer que a expansão do universo está acelerando?',transfer:'Diferencie “velocidade de expansão” de “aceleração da expansão”.'},
  {theme:'Entropia e informação',concept:'informação física',words:['informação','microestado','macroestado','entropia','irreversibilidade'],objects:['baralho','quatro moedas','caneta'],sequence:[9,1,6,3,8,2,7,5],reasoning:'Por que muitos microestados diferentes podem corresponder ao mesmo estado macroscópico?',transfer:'Relacione informação e entropia sem usar a palavra “bagunça”.'},
  {theme:'Sistemas complexos',concept:'emergência',words:['emergência','auto-organização','não-linear','retroalimentação','coletivo'],objects:['dez moedas','dado','caneta'],sequence:[4,8,1,9,3,7,2,6],reasoning:'Como regras locais simples podem produzir um comportamento global difícil de prever?',transfer:'Explique emergência para uma criança e depois para um pesquisador.'},
  {theme:'Astrobiologia',concept:'habitabilidade',words:['habitabilidade','biossinal','metabolismo','extremófilo','homeostase'],objects:['copo','pedra','folha','moeda','caneta'],sequence:[7,2,9,1,5,8,3,6],reasoning:'Por que “estar na zona habitável” não basta para concluir que um planeta pode sustentar vida?',transfer:'Crie uma lista de cinco variáveis que você investigaria antes de chamar um planeta de habitável.'},
  {theme:'Atmosferas de exoplanetas',concept:'assinatura espectral',words:['atmosfera','absorção','espectroscopia','pressão','composição'],objects:['prisma ou objeto transparente','lanterna desligada','moeda','caneta'],sequence:[3,9,5,1,8,4,7,2],reasoning:'Como a luz de uma estrela atravessando uma atmosfera pode revelar quais moléculas existem nela?',transfer:'Explique espectroscopia como uma investigação indireta.'},
  {theme:'Síntese e hipótese científica',concept:'modelo',words:['hipótese','modelo','previsão','falsificável','evidência'],objects:['baralho','dado','três moedas','caneta'],sequence:[8,1,7,3,9,2,6,4],reasoning:'O que torna uma hipótese científica mais forte do que uma explicação que acomoda qualquer resultado?',transfer:'Proponha duas explicações concorrentes para um mesmo fenômeno e diga que observação distinguiria as duas.'},
  {theme:'Avaliação e transferência',concept:'transferência',words:['inferência','causalidade','parcimônia','contingente','subjacente'],objects:['caneca','chave','moeda','carta','dado','caneta'],sequence:[9,2,7,4,1,8,5,3],reasoning:'Diante de um problema totalmente novo, como separar o que você sabe, o que está inferindo e o que ainda precisa testar?',transfer:'Escolha um conceito da temporada e explique-o sem reutilizar a analogia treinada anteriormente.'}
];

function previousWords(week:number){
  if(week <= 1) return ['causalidade','analogia'];
  const prev = weekKits[week-2].words;
  return [prev[1],prev[3]];
}

export function getPrescription(week:number, day:number): Prescription {
  const kit = weekKits[Math.max(0, Math.min(25, week-1))];
  const domain = schedule[Math.max(0, Math.min(5, day-1))];
  const level = levelFor(week);
  const base = { domain, level, minutes: 20 };
  const words = kit.words.join(', ');
  const objects = kit.objects.join(', ');

  if (day === 1) return {...base,
    title:`Evocação lexical · ${kit.theme}`,
    subtitle:`Conceito central: ${kit.concept}. Cinco palavras já definidas para hoje.`,
    environment:'Caderno Órbita, papel e caneta. Sem pesquisa durante os primeiros 15 minutos.',
    rule:'Recupere antes de consultar. A dificuldade de lembrar faz parte do treino.',
    record:'Palavras evocadas X/5, palavras usadas corretamente X/5 e a palavra mais difícil.',
    steps:[
      `Escreva uma vez e leia em voz alta: ${words}. Vire a folha após 60 segundos.`,
      'Sem consultar, escreva as cinco palavras e dê uma definição de uma linha para cada uma.',
      `Explique ${kit.concept} em voz alta por 90 segundos sem ler nada. Se não souber, formule primeiro sua melhor hipótese.`,
      'Consulte uma fonte confiável por no máximo 3 minutos, corrija sua explicação e marque em outra cor o que mudou.',
      `Feche tudo e execute a transferência: ${kit.transfer}`
    ]
  };

  if (day === 2) return {...base,
    title:`Reconstrução espacial · ${kit.objects.length} objetos`,
    subtitle:`Objetos de hoje: ${objects}.`,
    environment:`Mesa, folha A4 e estes objetos: ${objects}.`,
    rule:'Observe por pouco tempo e depois trabalhe sem olhar novamente até concluir o desenho.',
    record:'Erros de posição, orientação e distância; anote também se precisou espiar.',
    steps:[
      `Disponha ${objects} em uma configuração irregular, sem formar uma linha. Observe por ${Math.max(15,30-level*2)} segundos.`,
      'Cubra ou afaste os objetos e desenhe a configuração vista de cima, incluindo orientação aproximada.',
      `Ao lado, redesenhe mentalmente a mesma configuração rotacionada ${level < 4 ? '90° no sentido horário' : level < 7 ? '180°' : '90° no sentido anti-horário e depois espelhada horizontalmente'}.`,
      'Descubra os objetos e compare. Circule cada erro em vez de apenas corrigir.',
      'Feche os olhos por 30 segundos e descreva verbalmente onde cada objeto estava em relação aos demais.'
    ]
  };

  if (day === 3) return {...base,
    title:'Memória operacional · manter e transformar',
    subtitle:`Sequência-base de hoje: ${kit.sequence.join(' – ')}.`,
    environment:'Papel, caneta e cronômetro opcional. Faça a manipulação mental antes de escrever.',
    rule:'Não vale copiar a sequência e manipulá-la olhando. O papel entra apenas depois da resposta mental.',
    record:'Acertos em ordem direta, inversa e transformada; registre onde perdeu a sequência.',
    steps:[
      `Leia por 20 segundos: ${kit.sequence.join(' – ')}. Cubra a sequência e repita-a de trás para frente.`,
      `Agora diga apenas os números ${level < 4 ? 'pares em ordem original' : level < 7 ? 'em ordem crescente' : 'ímpares em ordem inversa e depois os pares em ordem crescente'}.`,
      `Faça mentalmente: comece em ${kit.sequence[0] * 3} e aplique sucessivamente −${kit.sequence[1]}, +${kit.sequence[2]}, −${kit.sequence[3]}, +${kit.sequence[4]}. Só escreva o resultado final.`,
      `Sem consultar a sessão anterior, recorde pelo menos três palavras do tema “${kit.theme}”.`,
      'Confira tudo no final e diferencie erro de memória, erro de regra e erro de cálculo.'
    ]
  };

  if (day === 4) return {...base,
    title:`Raciocínio científico · ${kit.concept}`,
    subtitle:'Você recebe o problema pronto; primeiro raciocina, só depois consulta.',
    environment:'Caderno Órbita. Consulta externa somente após registrar sua hipótese.',
    rule:'Uma hipótese incompleta escrita antes da consulta vale mais para o treino do que uma resposta perfeita copiada depois.',
    record:'Hipótese inicial, premissas, mudança após consulta e uma dúvida que permaneceu.',
    steps:[
      `Problema de hoje: ${kit.reasoning}`,
      'Escreva sua resposta inicial em até cinco linhas. Separe explicitamente: “o que sei” e “o que estou inferindo”.',
      `Desenhe um diagrama simples que represente o conceito de ${kit.concept}, mesmo que imperfeito.`,
      'Consulte uma fonte confiável por até 5 minutos e identifique exatamente um acerto e um erro da sua hipótese.',
      'Reescreva a resposta em no máximo três frases, agora com maior precisão.'
    ]
  };

  if (day === 5) return {...base,
    title:'Evocação tardia + flexibilidade verbal',
    subtitle:'Recuperação espaçada sem aviso e mudança de audiência.',
    environment:'Caderno e voz. Não reveja a semana antes de começar.',
    rule:'Não force a lembrança consultando. Marque a falha e siga; a recuperação tardia é a medida.',
    record:'Palavras recuperadas sem pista, tempo até lembrar e qualidade das duas explicações.',
    steps:[
      `Sem olhar sessões anteriores, escreva as cinco palavras desta semana. Depois tente recuperar também: ${previousWords(week).join(' e ')}.`,
      `Escolha duas das palavras recuperadas e produza um sinônimo aproximado, um contraste e uma frase original para cada uma.`,
      `Explique ${kit.concept} por 60 segundos para uma criança de 10 anos.`,
      `Explique o mesmo conceito por 60 segundos para um universitário de exatas, usando vocabulário mais preciso.`,
      `Finalize com a tarefa de transferência: ${kit.transfer}`
    ]
  };

  return {...base,
    title:'Executivo · atenção, regra e troca consciente',
    subtitle:'Uma sessão curta sem tela para treinar foco e flexibilidade, sem virar “joguinho obrigatório”.',
    environment:'Baralho comum (ou 20 cartas de papel numeradas), papel e caneta.',
    rule:'Velocidade só importa depois da precisão. Quando a regra mudar, diga em voz alta qual regra abandonou e qual passou a usar.',
    record:'Erros por regra, correções impulsivas, distrações percebidas e estratégia que funcionou melhor.',
    steps:[
      `Separe ${Math.min(24,12+level)} cartas. Primeira regra: agrupe por cor; faça uma única passagem sem voltar atrás.`,
      `Misture. Segunda regra: agrupe por valor ${level < 5 ? '(baixo/alto)' : '(pares/ímpares quando aplicável, figuras separadas)'}.`,
      'Misture novamente. Agora alterne a regra a cada quatro cartas: cor → valor → cor → valor. Diga “troca” em voz alta.',
      `Sem olhar suas anotações, resuma em 45 segundos o problema científico desta semana sobre ${kit.concept}.`,
      'Escreva uma frase: “Hoje perdi precisão quando…”. Essa frase é o dado executivo principal da sessão.'
    ]
  };
}

export function seasonDistribution(){
  const counts = Object.fromEntries(domains.map(d=>[d,0])) as Record<Domain,number>;
  for(let w=1;w<=26;w++) for(let d=1;d<=6;d++) counts[getPrescription(w,d).domain]++;
  return counts;
}
