---
title: "Capítulo 4: Borges conta story points"
description: "Como as medições, destinadas a tornar as equipas mais ágeis, se transformam em lotaria: da Spotify Model ao teatro OKR, do jogo com a velocity ao ritual retrospetivo."
date: 2026-03-28
date_created: "2026-03-28"
date_updated: "2026-08-25"
weight: 50
plate: "kn1-04-borges.webp"
chapter: 4
act: "I: Origens"
category: "analysis"
tags:
  - "borges"
  - "measurement-paradox"
  - "agile-metrics"
  - "spotify-model"
  - "safe-framework"
  - "okr-cargo-cult"
  - "velocity-gaming"
  - "goodharts-law"
  - "organizational-theater"
related:
  - "/chapters/chapter-0-pilot"
  - "/chapters/chapter-1-jules-verne"
  - "/chapters/chapter-2-frankenstein"
  - "/chapters/chapter-3-holmes"
  - "/chapters/chapter-5-nemo"
  - "/chapters/chapter-6-mina-harker"
  - "/chapters/chapter-6-jekyll-hyde"
  - "/chapters/chapter-7-don-quixote"
sensitive: false
toc: true
draft: false
status: verified
sources:
  - "Borges, Jorge Luis. «La lotería en Babilonia» (1941). Em *Ficciones* (1944). Editorial Sur, Buenos Aires."
  - "Goodhart, Charles A.E. «Problems of Monetary Management: The U.K. Experience.» *Papers in Monetary Economics*, Reserve Bank of Australia, 1975."
confidence: high
reviewed_by: "Editorial Team"
review_date: "2026-08-25"
---

![Gravura do capítulo: Borges conta story points](/kn1/images/chapters/agil-chapter-4-plate.webp)

> **De que trata este capítulo.** O paradoxo das medições Agile. Como as métricas destinadas a aumentar a flexibilidade se tornam lotaria — sistema tão complexo que ninguém se lembra para que começou. Da Spotify Model ao SAFe, do teatro OKR ao velocity gaming — anatomia da loucura métrica.

## Sala de reuniões n.º 7, planeamento de sprint

O product manager de mobile banking olha para o quadro dos story points e percebe: o sistema devorou a equipa.

Começou de forma simples. Há dois anos, a velocity ajudava a planear — 35 points por sprint, estável, previsível. Agora na parede pendem quatro diagramas: *velocity by team*, *story point inflation*, *capacity planning*, *burndown by epic*. O planeamento consome oito horas por sprint. Para o desenvolvimento restam trinta e duas.

— E se forem 5 points? — pergunta um programador júnior.
— Não, isto é seguramente 8 — responde o sénior. — Lembras-te daquela tarefa da API no sprint passado?
— Qual exatamente?
— Bem… complicada.

O product manager remexe as cartas de planning poker e pensa em Jorge Luis Borges.

Borges, 1941: no conto «A Lotaria em Babilónia», a sociedade mergulha num jogo que absorve todos os seus aspetos¹. Começou de forma simples — prémios em dinheiro. Depois — multas. A seguir — cargos, sentenças, casamentos. Cada sorteio produziu ramificações: lotarias secundárias, lotarias para determinar as regras de outras lotarias, lotarias para anular resultados.

No fim do conto, a fronteira evaporou-se, quando o sistema, inicialmente concebido como aleatoriedade dentro da ordem, *tornou-se* a própria ordem — o instrumento derrotou definitivamente o próprio objetivo.

O narrador borgesiano confessa: não sabe nem quantos andares tem a lotaria, nem que andar lhe é acessível. A ignorância aqui não é falha de memória, mas sintoma de um sistema que cresceu para além da compreensão dos próprios participantes.

Ele conhece esta sensação — não se lembra para que a equipa começou a contar story points. Lembra-se apenas de que agora é obrigatório — para a reportagem, para a previsão, para os KPI. Setenta anos antes do aparecimento do SAFe, Borges descreveu a metodologia corporativa com mais precisão do que qualquer consultor contemporâneo.

---

Holmes (capítulo 3) deu-nos o método — sete sinais da doença do projeto, mas trabalha com prov*as*, sem colocar a questão de princípio: *e se o próprio instrumento de observação distorcer o observado?*

Borges coloca esta pergunta diretamente, mostrando Babilónia não como caos, mas como *ordem crescida até ao caos* — onde a lotaria já não é acaso, mas medição, tendo perdido por completo a ligação com aquilo que se mede.

O capítulo coloca uma pergunta concreta: como é que as métricas Agile — velocity, story points, OKR, burndown charts — instrumentos de flexibilidade — se transformaram numa lotaria babilónica? Um sistema em que as equipas gastam mais horas na sua manutenção do que na criação do produto?

Tese: **a medição, destinada a aumentar a flexibilidade, inevitavelmente a diminui, desde que se torne um objetivo**.

Charles Goodhart (1975) formulou a lei: qualquer regularidade estatística observável tende a desmoronar-se, tão depressa como se começa a pressionar sobre ela para fins de gestão². Vinte e dois anos depois, Marilyn Strathern cunhou o mesmo pensamento numa fórmula curta que desde então se cita em vez de Goodhart: «Quando a medida se torna objetivo, deixa de ser uma boa medida»³ — e mostrou que isto diz respeito não apenas à economia, mas à educação, à saúde, à gestão.

Borges, trinta e quatro anos antes de Goodhart, mostrou a mesma mecânica, apenas lhe chamou lotaria.

## A lotaria das métricas

### Velocidade da equipa (Velocity): o primeiro sorteio da lotaria

O tech lead de uma *startup* fintech lembra-se de como tudo começou. Verão de 2022: equipa de cinco pessoas, velocity 30 points — aritmética pura como instrumento interno de calibração. Se o sprint são 30 points, três funcionalidades levarão três sprints. Simples.

Problema: a lotaria em Babilónia não permanece simples, e a velocity — não permanece interna.

**Outono de 2022 — primeira mutação.** O diretor de desenvolvimento vê o dashboard: Equipa Frontend: 40 points; Equipa Backend: 25 points. A lógica é irrepreensível — o Frontend é mais eficiente. O tech lead tenta explicar: «Estamos a comparar Celsius com Fahrenheit e a declarar a América mais quente». O diretor acena com a cabeça e pede à Backend para «puxar os indicadores».

**Inverno de 2023 — segunda mutação.** A velocity passa a fazer parte dos KPI do departamento. O tech lead observa como a equipa começa a jogar o sistema: a tarefa «Integração com a API bancária» (3 points) transforma-se em «Configuração do ambiente de teste» (2 points) + «Escrita do cliente da API» (2 points) + «Tratamento de erros» (1 point). A velocity cresce de 30 para 45, o volume de trabalho não mudou.

— Excelente dinâmica — diz o diretor na reunião.
— Não acelerámos nada — responde o tech lead.
— Os números dizem o contrário.

A inflação dos points (*story point inflation*) é um problema padrão registado pela Scrum.org, Age of Product, LinearB e outros⁴. Lena leu sobre isto em blogues, mas encontrar-se pessoalmente com o fenómeno é outra experiência.

Borges captou a mecânica: «à medida que a lotaria se ampliava, cada ato livre passava a incluir-se na sua esfera»¹. A velocity cresceu de instrumento para esfera, absorvendo cada ato da equipa. Uma decisão técnica tornou-se ato político.

### Story points: uma língua que perdeu o significado

— E o que significam 5 points? — pergunta um programador novo no seu primeiro planeamento.
— Bem, mais do que 3, mas menos do que 8 — responde o tech lead.
— E o que significa 8?
— Tarefa complicada. Lembras-te daquela migração de base no sprint passado?
— Eu ainda não trabalhava aqui na altura.

Borges, em «A Biblioteca de Babel», descreveu uma biblioteca infinita que contém todos os livros possíveis — todas as combinações de letras. Por isso a biblioteca é inútil: quando existe tudo, encontrar algo concreto torna-se impossível⁵.

Story points é a mesma biblioteca babilónica. Um sistema que, ao significar tudo, é por isso mesmo que significa nada.

Na sala de reuniões está afixado o cartaz «Definition of Done», mas não há cartaz «Definition of Points». O que são 5 points? Para o frontend — um dia; para o backend — uma semana; para o QA — «depende de quantos bugs encontrarmos». Os números de Fibonacci (1, 2, 3, 5, 8, 13) foram escolhidos não pela relação do século XIII com a avaliação de complexidade, mas pela não-linearidade — reflexo da incerteza. Matemática medieval para medir aquilo que não se presta à medição.

Em cada segunda quarta-feira — duas horas de planning poker. Sete adultos mostram cartões com números (jogo infantil) para avaliar uma tarefa que ninguém ainda começou. Um mostra 5, outro — 8, outro — 3. Começa a «discussão» — cada um explica o seu número através de uma metáfora tirada da experiência passada, que os restantes não se lembram.

— Aposto 8, porque isto parece àquela tarefa com OAuth…
— Qual exatamente?
— Bem, complicada.

Borges antecipou este absurdo, mas o verdadeiro custo de tal absurdo mede-se em horas da equipa. Segundo as contas do tech lead: 7 pessoas × 2 horas × 26 sprints = 364 horas por ano a adivinhar pelas cartas. Dois meses de desenvolvimento — para avaliar o desenvolvimento.

## Spotify Model: um modelo que não funciona nem sequer na Spotify

A diretora de RH de um grande banco voa para Estocolmo para estudar o «modelo lendário». 2019, delegação com orçamento por que depois não terá vergonha de prestar contas. Objetivo — implementar a Spotify Model na corporação russa.

No avião relê o documento de Kniberg e Ivarsson: Squads, Tribes, Chapters, Guilds⁶. O plano de transformação está pronto — os RH desenharam a nova estrutura organizacional, o IT encomendou o redesenho do escritório sob o modelo «tribal», a direção de topo espera resultado.

Primeiro dia na Spotify. O guia (não Kniberg — este saiu há três anos) mostra o escritório:
— Esta zona era para a Tribe A, mas agora estão aqui equipas mistas.
— E onde está o Chapter Lead da apresentação?
— Ah, esse papel transformou-se. Agora temos outra estrutura.

Ela relê o primeiro parágrafo do documento: «Este artigo é apenas um snapshot da nossa maneira atual de trabalhar… no momento em que estiver a ler isto, tudo já mudou»⁶. Aviso que todos ignoram.

À noite, no hotel, abre a análise de Jeremiah Lee — antigo PM da Spotify: o documento descreve um estado idealizado que a Spotify não atingira sequer no momento da publicação; as próprias squads reorganizavam-se, as tribes mudavam, as guilds perdiam atividade⁷. O próprio Kniberg, durante dez anos após a publicação, repetiu inúmeras vezes: é um snapshot, não um blueprint.

A descoberta mais dolorosa: a Spotify usou silenciosamente o documento como instrumento de recrutamento, apesar de a realidade interna há muito diferir. Ela compreende — estão a copiar um folheto publicitário.

Eis a lotaria babilónica em ação: o snapshot de uma empresa transforma-se em cânone para milhares de outras, o contexto evapora-se, resta apenas a estrutura sem compreensão.

Conway (capítulo 3): a organização reproduz a sua estrutura no produto. A «Spotify Model» é a tentativa inversa: copiar a estrutura e obter o produto alheio. É um erro fundamental. A estrutura da Spotify refletia a cultura da Spotify, o mercado sueco, pessoas concretas, um momento concreto. Copiar a estrutura sem a cultura é o mesmo que copiar um restaurante e esperar comida saborosa.

## SAFe: religião de Estado

Se a «Spotify Model» era uma lotaria ingénua, o SAFe é a sua evolução lógica: uma lotaria que recebeu estatuto oficial de Estado.

SAFe 6.0: quatro configurações (Essential, Large Solution, Portfolio, Full), dezenas de papéis e cerimónias⁹. O «Big Picture» parece um esquema do metro de uma cidade-fantasma. Tudo está ligado, tudo está assinado — e sem sentido sem contexto.

Paradoxo da escala: a metodologia da simplicidade e da auto-organização gera inevitavelmente camadas de gestão¹⁰.

Borges sobre SAFe: «A Lotaria está subordinada à Companhia; sobre a estrutura interna da Companhia correm apenas conjeturas»¹ — substitua «Companhia» por «Scaled Agile, Inc.» e obterá o retrato de milhares de organizações que implementam este framework comercial; adiante Borges afirma: «A Lotaria é uma interpolação do acaso na ordem do mundo»¹.

Pergunta: cria o SAFe valor autêntico — ou marca o caos sob o rótulo de «complexidade gerida»?

A Nokia (capítulo 2) perdeu o mercado dos smartphones por medo e, simultaneamente (2008–2010), implementava uma transformação Agile em larga escala. Laanti, Salo, Abrahamsson (2011) descrevem a perceção desta transformação pelos próprios funcionários — resposta geralmente positiva¹¹. A queda da quota de mercado dos mesmos anos está documentada no cap. 2 (Vuori, Huy, 2016) — embora não seja causalidade, tal coincidência mina a promessa de «Agile at scale salva».

## OKR: culto cargo

O CPO de uma empresa de e-commerce senta-se sobre os OKR trimestrais e sente-se um xamã melanésio a construir um avião de palha.

Q1 2024. O CPO lê o manual de John Doerr: OKR é um instrumento de foco (Intel, Google)¹², sendo precisamente um *instrumento*, não uma religião. Mas o que acontece na empresa lembra mais um culto cargo.

**Janeiro — cerimónia trimestral.** O CPO escreve no modelo Confluence:
- O1: «Tornar-se líder no segmento *fashion e-commerce*»
- KR1: «Aumentar a quota de mercado até 15%»
- KR2: «Elevar o NPS até 75»

Texto bonito, ambicioso, completamente desligado da realidade. O CPO sabe: abrirão o documento em março (review) e em junho (planeamento seguinte). Entre esses momentos — trabalho normal por tarefas normais.

**Fevereiro — cascatas.** Cadeia de transformações: «liderança em fashion» → «melhoria de conversão» → «otimização do catálogo» → «refactoring da pesquisa» → ticket JIRA-15247 «Reparar a ordenação por preço». O programador olha para este ticket e pensa: que relação tem um bugfix com a liderança de mercado?

— É uma tarefa estrategicamente importante — explica o CPO.
— Mas é apenas um bug normal…
— Tudo está ligado ao OKR.

**Março — avaliação.** O CPO atribui-se 0,4 em 1,0. Segundo Doerr, bom resultado é 0,7, e 1,0 significa falta de ambição¹². Paradoxo «êxito = falhanço parcial». Como explicar ao diretor-geral que 40% de cumprimento do objetivo é normal?

— Temos problemas de execução — diz o diretor-geral.
— Não, é ambição propositadamente incorporada…
— Soa a desculpa de fracasso.

Wodtke (2016): OKR funciona em culturas que aceitam o fracasso¹³. A maioria das corporações não possui tal cultura — e em ambiente semelhante o OKR transforma-se numa lotaria com multas.

Borges avisava: alguns — com uma teimosia digna de melhor uso — acreditam que a lotaria não existe de todo.

## O teatro retrospetivo

A Scrum Master de um estúdio de gamedev espalha stickers e pensa no teatro do absurdo. Sexta-feira, 16h00, sala de reuniões «Mario». Sétima retrospetiva seguida com o mesmo final.

A retrospetiva em teoria é análise de êxitos e fracassos. Reflexão que Hetzel e Verne (1870, capítulo 1) conheciam como conversa sobre a tiragem ao almoço. Na prática — um teatro com repertório imutável.

**Ato I — Liturgia dos stickers.** A Scrum Master desenha no flipchart três colunas: 😊 / 😐 / 😞. A equipa preenche obedientemente:
- Sticker verde do sénior: «Bom trabalho no sistema de inventário»
- Sticker vermelho da programadora: «Demasiadas reuniões»
- Coluna amarela vazia (como sempre)

— Porque ninguém escreve momentos neutros? — pergunta o novo.
— E o que escrever? — encolhe os ombros o sénior. — O que correu normalmente, correu normalmente.

**Ato II — Leitura.** A programadora lê o seu sticker vermelho:
— Outra vez demasiadas reuniões. Planeamento, grooming, stand-ups, retrospetivas…
Acenos de compreensão. Mesmo sticker esteve lá em setembro, outubro, novembro, dezembro.
— E que reuniões concretamente são supérfluas? — precisa a Scrum Master.
— Bem… variadas. No fundo, muitas.

**Ato III — Action items como lotaria.** A Scrum Master anota no quadro: «Reduzir o número de reuniões». Responsável: por atribuir. Prazo: por definir. Critérios de sucesso: difusos.
— Combinado, planearemos o tempo com mais eficiência — resume a Scrum Master.

Duas semanas depois, na nova retrospetiva, aparece o já conhecido sticker vermelho: «Demasiadas reuniões». A Scrum Master olha para as suas notas — o action item da retro anterior foi esquecido por todos, incluindo ela própria.

Assim a retrospetiva transforma-se em ritual em vez de reflexão — não final, mas infinita. Nada carrega responsabilidade, criando um ciclo fechado: stickers → action items → novas retrospetivas → stickers frescos. A lotaria que Borges descreveu também estava assim construída, de forma a nunca ser a última.

Weinberg (capítulo 3) observa: quando os programadores perdem contacto com os utilizadores, começam a projetar o sistema para si próprios — exatamente do mesmo modo as retrospetivas, tendo deixado de mudar seja o que for, realizam-se para autoconsolação.

## Contra as medições

**A maioria das métricas dos métodos ágeis causa mais mal do que bem.**

Muller, 2018: as métricas de produtividade levam inevitavelmente à manipulação dos indicadores — os hospitais começam a recusar pacientes graves, as escolas excluem alunos fracos, a polícia reclassifica crimes¹⁴.

Donald Campbell, em 1979, formulou a lei que mais tarde se passou a chamar pelo seu nome: quanto mais amplamente um indicador quantitativo é utilizado para decisões sociais, mais sujeito está à pressão que distorce o próprio processo que devia medir¹⁵. Velocity gaming, story point inflation e OKR cascading — esta lei em ação.

Se Holmes (capítulo 3) via nas medições sintomas da doença, Borges vai mais longe — os próprios instrumentos de observação tornam-se a doença.

DORA (Google Cloud, 2023) evita velocity, story points e OKR, propondo em vez disso quatro métricas de resultado¹⁶ — frequência de deploys, lead time (do commit à produção), tempo de recuperação após falha, percentagem de alterações falhadas. As quatro estão ligadas à realidade objetiva (o sistema ou está implantado ou não está) — o gaming é dificultado.

DORA funciona precisamente porque exclui medições secundárias, cascatas e cerimónias, deixando quatro números objetivos e sem ambiguidade — Brooks (capítulo 3) aprovaria tal simplificação: n(n-1)/2 canais de comunicação reduzem-se a quatro indicadores.

## O padrão da lotaria: instrumento → instituição

Borges descreve um padrão universal de degradação através de quatro fases com transições impercetíveis.

**Fase 1: instrumento útil.** A velocity ajuda, os story points simplificam, os OKR focam — enquanto funciona, tudo é valioso, mas depois vem a institucionalização, quando «usam a velocity» se transforma em «todos são obrigados a prestar contas de velocity», «é preciso retrospetiva» — em «de duas em duas semanas», ou seja, o útil torna-se obrigatório.

**Fase 2: a métrica torna-se objetivo.** A velocity transforma-se em KPI, o OKR — em base de avaliação, a retrospetiva — em reportagem, confirmando a lei de Goodhart: os instrumentos começam a otimizar-se a si próprios.

**Fase 3: lotaria.** O sistema de métricas torna-se tão complexo que ninguém se lembra para que começou. Gastam-se horas em avaliação, grooming, planning poker, alinhamento de objetivos, construção de diagramas — e sob o sticker 😞 aparece o já conhecido «demasiadas reuniões».

Borges não nega a lotaria — apenas lembra que sobre a sua mecânica interna sabemos exatamente o mesmo que sobre qualquer outro grande sistema colocado por cima da nossa vida. Aplicada à realidade corporativa, esta descrição revela-se precisa.

## Da medição à prática

O product manager acaba mais um planeamento de sprint às 19h15. A equipa dispersa-se pelas casas; no quadro ficam os números: 42 story points, velocity planeada 38, confidence level 0,7.

Desliga o projetor e pensa em Borges. O primeiro ato encerra-se: Verne mostrou a criação, Shelley — o preço do esquecimento, Holmes — o diagnóstico, Borges — como **o aparelho de observação se torna ele próprio doença**. Quando a medição-objetivo destrói aquilo que se mede.

Fora dos escritórios dos concorrentes, as luzes apagaram-se. Algures há equipas que escrevem código em vez de avaliar código. Que resolvem problemas dos utilizadores em vez de otimizar métricas. Que não se afogaram na sua própria lotaria.

O tech lead da fintech no edifício ao lado também pensa nisto, fechando a sala de reuniões após a retrospetiva. A diretora de RH volta a casa de Estocolmo com a compreensão: copiavam a instrução para um avião que já não existe. O CPO acaba os OKR para o próximo trimestre e sabe — é teatro, mas há que representar.

Armadilha: a velocity transforma-se em otimização de velocity, os OKR — em ritual, os story points — em disputa filosófica. Resultado — lotaria babilónica em que o instrumento devora o objetivo.

Existe saída: equipas que medem sem se submeterem às medições. Que aplicam processos sem os divinizar.

---

*Continua. No próximo capítulo:* um capitão que não realizou uma única entrevista pelo regulamento — e reuniu a melhor tripulação do oceano mundial. Um submarino contra um porta-aviões no valor de dois biliões; seleção pela capacidade contra seleção pela concordância; e uma organização que não precisa de Companhia. A lotaria fica em Babilónia. *O Naútilus* mergulha em profundidade.

---

**Footnotes:**

¹ Borges, Jorge Luis. «La lotería en Babilonia» (1941). Em *Ficciones* (1944). Editorial Sur, Buenos Aires (tradução do autor). Título canónico PT: «A Lotaria em Babilónia» / *Ficções* (Presença/Assírio & Alvim).

² Goodhart, Charles A.E. «Problems of Monetary Management: The U.K. Experience.» *Papers in Monetary Economics*, Reserve Bank of Australia, 1975 (tradução do autor).

³ Strathern, Marilyn. «Improving Ratings: Audit in the British University System.» *European Review*, Vol. 5, No. 3, 1997, pp. 305-321 (tradução do autor).

⁴ Digital.ai. «17th Annual State of Agile Report» (2024) (tradução do autor). 36% das equipas Agile são avaliadas por velocity — o que cria estímulo estrutural para gaming. Análise prática de velocity gaming: Levison, Mark. «Misuse of Velocity in Agile Projects.» AgilePainRelief.com (tradução do autor).

⁵ Borges, Jorge Luis. «La biblioteca de Babel» (1941). Em *Ficciones* (1944) (tradução do autor). Título canónico PT: «A Biblioteca de Babel».

⁶ Kniberg, Henrik & Ivarsson, Anders. «Scaling Agile @ Spotify with Tribes, Squads, Chapters & Guilds.» Spotify Labs whitepaper, October 2012 (tradução do autor).

⁷ Lee, Jeremiah. «Failed #SquadGoals — Spotify doesn't use 'the Spotify model' and neither should you.» jeremiahlee.com, April 2020 (tradução do autor). Lee — antigo PM Spotify.

⁸ Kniberg, Henrik. Múltiplos lembretes públicos do autor ao longo dos anos: whitepaper 2012 — snapshot de um momento concreto, não blueprint. Textos mais conhecidos: entrevista Agile Amsterdam 2015; blog crisp.se; repetições em apresentações 2016–2020. Fontes primárias da citação no corpo — o próprio whitepaper (¹⁶) e entrevistas do autor em grandes conferências Agile.

⁹ Scaled Agile, Inc. SAFe 6.0 Framework. scaledagileframework.com (pseudónimo corporativo).

¹⁰ Rigby, Darrell K.; Sutherland, Jeff; Noble, Andy. «Agile at Scale.» *Harvard Business Review*, May-June 2018 (tradução do autor).

¹¹ Laanti, Marko; Salo, Outi; Abrahamsson, Pekka. «Agile Methods Rapidly Replacing Traditional Methods at Nokia: A Survey of Opinions on Agile Transformation.» *Information and Software Technology*, Vol. 53, Issue 3, 2011, pp. 276-290 (tradução do autor).

¹² Doerr, John. *Measure What Matters* (2018). Portfolio/Penguin (tradução do autor).

¹³ Wodtke, Christina. *Radical Focus* (2016). Cucina Media (tradução do autor).

¹⁴ Muller, Jerry Z. *The Tyranny of Metrics* (2018). Princeton University Press (tradução do autor).

¹⁵ Campbell, Donald T. «Assessing the Impact of Planned Social Change.» *Evaluation and Program Planning*, Vol. 2, No. 1, 1979, pp. 67-90 (tradução do autor).

¹⁶ Accelerate: State of DevOps Report. Google Cloud / DORA, 2023 (tradução do autor).
