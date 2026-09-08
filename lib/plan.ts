export type Domain = 'Atenção' | 'Flexibilidade' | 'Visuoespacial' | 'Raciocínio' | 'Verbal' | 'Matemática' | 'Criatividade' | 'Ciência';

export type Prescription = { domain: Domain; title: string; subtitle: string; minutes: number; level: number; environment: string; rule: string; record: string; steps: string[] };

const phases = [
  { name: 'Baseline', range: 'Semanas 1–2', detail: 'Descobrir seu ponto de partida e construir consistência sem buscar velocidade.' },
  { name: 'Fundação', range: 'Semanas 3–6', detail: 'Fixar métodos, aumentar precisão e criar hábitos de observação e explicação.' },
  { name: 'Desenvolvimento', range: 'Semanas 7–12', detail: 'Aumentar complexidade, número de restrições e necessidade de planejamento.' },
  { name: 'Integração', range: 'Semanas 13–18', detail: 'Combinar duas ou mais capacidades na mesma missão.' },
  { name: 'Alta complexidade', range: 'Semanas 19–23', detail: 'Trabalhar problemas abertos com menos instrução e mais autonomia.' },
  { name: 'Desafio final', range: 'Semanas 24–25', detail: 'Resolver e produzir algo complexo, transferindo habilidades para situações novas.' },
  { name: 'Avaliação', range: 'Semana 26', detail: 'Revisar resultados, repetir referências de baseline e fechar o relatório da temporada.' },
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

const domains: Domain[] = ['Visuoespacial','Flexibilidade','Atenção','Ciência','Verbal','Raciocínio'];
const levelFor = (week:number) => Math.min(10, 1 + Math.floor((week - 1) / 3));

export function getPrescription(week:number, day:number): Prescription {
  const domain = domains[(week + day - 2) % domains.length];
  const level = levelFor(week);
  const base = { domain, level, minutes: 45 };
  if (domain === 'Visuoespacial') return { ...base,
    title: level < 4 ? 'Reconstrução espacial no Minecraft' : level < 8 ? 'Do 2D ao 3D no Minecraft' : 'Inferência espacial com informação incompleta',
    subtitle: 'Use um ambiente que você já gosta como laboratório de representação espacial.',
    environment: 'Minecraft no computador + papel e lápis.',
    rule: level < 4 ? 'Observe antes, reconstrua depois sem consultar o original durante a execução.' : level < 8 ? 'Planeje em 2D antes de construir e compare plano e resultado.' : 'Trabalhe com vistas parciais e evite retornar à referência até o fim.',
    record: 'Tempo, consultas à referência, erros de proporção/orientação e uma foto do resultado.',
    steps: level < 4 ? ['Escolha uma construção pequena e observe-a por 5 minutos.','Afaste-se e reconstrua em outro local sem retornar ao original.','Ao terminar, compare e anote pelo menos três diferenças.'] : level < 8 ? ['Escolha uma estrutura e faça uma planta 2D simples antes de construir.','Construa seguindo principalmente sua planta.','Compare a representação 2D com o volume final e marque erros de escala.'] : ['Registre apenas duas ou três vistas de uma estrutura complexa.','Sem acessar novamente o original, infira as partes ocultas e reconstrua.','Compare hipótese e original e classifique os erros.']
  };
  if (domain === 'Flexibilidade') return { ...base,
    title: 'Estratégia adaptativa em Age of Empires IV', subtitle: 'Treine mudança de plano sem transformar a sessão em uma partida comum.',
    environment: 'Age of Empires IV ou Age of Mythology no computador.',
    rule: 'O objetivo não é vencer. É perceber quando a estratégia deixou de fazer sentido e mudar conscientemente.',
    record: 'Plano inicial, mudanças relevantes, motivo de cada mudança, resultado e maior erro de adaptação.',
    steps: ['Escolha uma civilização ou estilo que você usa pouco.',`Antes da partida, escreva ${level < 5 ? 'três' : 'cinco'} objetivos iniciais.`,'Identifique toda situação que exigir abandonar ou alterar o plano.','No final, explique qual adaptação ajudou e qual aconteceu tarde demais.']
  };
  if (domain === 'Atenção') return { ...base,
    title: 'Leitura científica com atenção sustentada', subtitle: 'Uma sessão de foco real, com produção ao final e sem jogo de atenção.',
    environment: 'Material técnico sobre física/astrofísica; celular fora do alcance.',
    rule: `Faça um bloco contínuo de ${Math.min(35, 20 + level*2)} minutos sem alternar aplicativos ou assuntos.`,
    record: 'Tempo sem interrupção, distrações percebidas e qualidade da explicação final.',
    steps: ['Escolha um tema de física que ainda não domine completamente.','Estude sem multitarefa e marque em papel cada impulso de interromper.','Feche o material e explique o conceito em voz alta por 3 a 5 minutos.','Reabra a fonte e liste o que esqueceu ou explicou incorretamente.']
  };
  if (domain === 'Ciência') return { ...base,
    title: level < 4 ? 'Entender e representar um problema físico' : level < 8 ? 'Modelar um problema físico' : 'Criar e defender um modelo físico',
    subtitle: 'Aprender física por compreensão, representação, modelagem e explicação.',
    environment: 'Fontes confiáveis na web, papel, calculadora e, quando fizer sentido, planilha ou software de modelagem.',
    rule: level < 4 ? 'Primeiro entenda qualitativamente; fórmulas vêm depois.' : 'Crie sua hipótese antes de consultar uma solução pronta.',
    record: 'Hipótese inicial, desenho/modelo, fontes consultadas, erros encontrados e versão corrigida.',
    steps: level < 4 ? ['Pesquise transferência orbital de Hohmann ou problema semelhante.','Explique por que o fenômeno ocorre sem usar fórmulas.','Desenhe o sistema e identifique as variáveis relevantes.','Confira em fonte confiável e corrija sua representação.'] : level < 8 ? ['Escolha um problema orbital, relativístico ou de física de partículas que possa ser modelado.','Defina variáveis, condições iniciais e o que deseja prever.','Faça uma modelagem simplificada e registre suas suposições.','Compare com uma referência confiável e revise o modelo.'] : ['Escolha um problema aberto de astrofísica ou exploração espacial.','Proponha um modelo antes de pesquisar abordagens existentes.','Defenda suposições, limitações e como testar a proposta.','Compare com literatura confiável e escreva uma revisão crítica.']
  };
  if (domain === 'Verbal') return { ...base,
    title: 'Leitura + explicação sem apoio', subtitle: 'Use ficção científica e divulgação científica para treinar compreensão e expressão.',
    environment: 'Livro físico/Kindle + gravador de voz opcional.', rule: 'A parte importante é recuperar e organizar ideias sem olhar novamente para o texto.',
    record: 'Resumo, conceitos esquecidos, palavras novas e pontos em que a explicação perdeu clareza.',
    steps: ['Leia um trecho de ficção científica ou divulgação científica por 20 a 25 minutos.','Feche o texto e escreva um resumo curto sem consultar.','Escolha ideias centrais e explique como se falasse com alguém que não leu o texto.','Compare com o original e marque omissões, distorções e palavras novas.']
  };
  return { ...base,
    title: 'Problema de planejamento em Cities: Skylines', subtitle: 'Use sistemas complexos para raciocinar sobre restrições, consequências e alternativas.',
    environment: 'Cities: Skylines ou No Man’s Sky + bloco de notas.', rule: 'Defina o problema antes de agir e gere alternativas antes de escolher uma solução.',
    record: 'Problema, hipóteses, solução escolhida, resultado observado e o que faria diferente.',
    steps: ['Escolha um problema real do seu save: trânsito, recursos, expansão, logística ou organização de base.',`Escreva ${level < 5 ? 'três' : 'cinco'} soluções possíveis antes de mexer no jogo.`,'Escolha uma solução usando critérios explícitos e implemente-a.','Observe consequências inesperadas e explique por que ocorreram.']
  };
}
