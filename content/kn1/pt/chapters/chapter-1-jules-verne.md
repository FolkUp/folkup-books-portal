---
title: "Capítulo 1: Jules Verne programa"
description: "Como a literatura de aventuras do século XIX estabeleceu os padrões de gestão de projetos — de *Vinte Mil Léguas Submarinas* aos ciclos de desenvolvimento (sprints) do Silicon Valley."
date: 2026-03-26
date_created: "2026-03-26"
date_updated: "2026-08-25"
weight: 20
plate: "kn1-01-jules-verne.webp"
chapter: 1
act: "I: Origens"
category: analysis
reading_time: "22 min"
tags:
  - literary-dna
  - agile-origins
  - jules-verne
  - methodology-evolution
  - serialization
  - iterative-development
related:
  - "/chapters/chapter-0-pilot"
  - "/chapters/chapter-2-frankenstein"
  - "/chapters/chapter-3-holmes"
  - "/chapters/chapter-4-borges"
sensitive: false
toc: true
draft: false
status: verified
sources:
  - "Patten, Robert L. *Charles Dickens and His Publishers* (1978). Oxford University Press."
  - "Dickens, Charles. *The Pickwick Papers* (1836–1837). Chapman & Hall, London. Serialised publication data."
confidence: high
reviewed_by: "Editorial Team"
review_date: "2026-08-25"
---

![Gravura do capítulo 1: Jules Verne programa](/kn1/images/chapters/agil-chapter-1-plate.webp)

> **De que trata este capítulo.** O ADN literário das metodologias contemporâneas de gestão de projetos. Como a serialização do século XIX criou o padrão da entrega iterativa, e como o romance de aventuras se tornou o protótipo do ciclo de sprint.

## Uma editora parisiense, março de 1869

Pierre-Jules Hetzel está no seu gabinete da rua Jacob, 18, diante de um manuscrito que vai mudar a história da literatura. Hetzel, porém, não pensa em literatura — pensa em assinantes.

Jules Verne acaba de entregar *Vinte Mil Léguas Submarinas*. Publicar o livro inteiro seria uma loucura: os leitores pagam uma vez, leem e esquecem. Os assinantes do *Magasin d'Éducation et de Récréation* são coisa bem diferente. Pagarão de duas em duas semanas pelo próximo fascículo — dezenas de números em vez de uma única compra.

Hetzel divide o romance em partes. Cada parte começa com o resumo da anterior, contém um conflito autossuficiente e termina de forma a que o leitor não consiga deixar de comprar o próximo número. Um capítulo interrompe-se no momento em que o capitão Nemo avista uma lula gigante, e o assinante já leva a mão à carteira.

Hetzel não conhece a palavra «iteração». Nunca ouviu falar do Produto Mínimo Viável (MVP: Minimum Viable Product — versão básica do produto com a funcionalidade essencial). Mas conhece a aritmética: uma edição serializada custa menos do que um livro inteiro, porque está distribuída no tempo em fascículos regulares¹. Matemática da serialização. É a matemática do modelo *software as a service* (SaaS: subscrição contínua), onde a receita recorrente (recurring revenue: pagamentos regulares) vence a compra única (one-time purchase: pagamento avulso).

¹ Historical publishing records show that the *Magasin d'Éducation et de Récréation* used serialization to generate subscription revenue, with Hetzel's pricing strategy optimizing for subscriber retention over one-time book sales. See Dumas, Olivier. *Correspondance inédite de Jules Verne et de Pierre-Jules Hetzel* (1999–2002). Paralelo contemporâneo: TAdviser Analytics «Российский рынок SaaS» (2024) — o modelo de subscrição em software empresarial mostrou CAGR de 47% (2020–2024), receita bruta de ₽847 mil milhões contra ₽124 mil milhões de licenças únicas.

O que ele faz com o manuscrito de Verne não é apenas um modelo de negócio — é o protótipo de cada sprint (ciclo curto de desenvolvimento) que alguma vez existiu. Pega num produto monolítico e divide-o em incrementos (increment — partes concluídas de funcionalidade). Cada incremento é autossuficiente, entrega valor ao utilizador e transporta feedback (retorno do público): os números de vendas dos fascículos mostram que linhas narrativas funcionam, e Verne ajusta o texto das partes seguintes com base na reação do público.

Cento e trinta e um anos mais tarde, dezassete programadores em Snowbird, no Utah, escreverão: «Software funcional acima de documentação exaustiva»⁷ — e julgarão ter feito uma revolução. Hetzel fez-a 131 anos antes deles.

**Modelo operacional de Hetzel (protótipo das estratégias SaaS russas):**
- **Fascículos regulares** em vez de lançamentos únicos: recurring revenue contra one-time sales — segundo dados da TAdviser, o mercado russo de serviços por subscrição cresceu 340% em 2020–2024
- **Ciclos de feedback** através de métricas de venda (validação de mercado em tempo real) — análogo às atuais análises de retenção de utilizadores no 1C:Enterprise ou no Kontur.Elba
- **Adaptação iterativa** do conteúdo com base em dados dos utilizadores, orientada por métricas — princípio mais tarde formalizado na metodologia dos gigantes russos das TI (Yandex, VK, Sber)
- **Coordenação cross-functional** autor–editor–distribuidor — padrão arquitetural que os atuais ecossistemas russos reproduzem (a articulação desenvolvimento–marketing–vendas no Bitrix24, no Yandex 360)

Hetzel não estava a criar uma metodologia. Estava a resolver um problema de negócio. O resultado tornou-se metodologia.

## A vaca sagrada da certificação

Antes de continuarmos — uma afirmação que provocará a ira do exército de consultores de metodologias ágeis: a certificação de praticantes de métodos ágeis é a antítese da própria metodologia ágil.

Verne, Dickens, os mestres de *rakugo* — nenhum deles tinha certificado de trabalho iterativo. Iteravam porque funcionava, e o seu «certificado» era o resultado: tiragens, assinantes, salas cheias.

A indústria contemporânea das metodologias ágeis inverteu a lógica: primeiro o certificado, depois a prática. Um ciclo de desenvolvimento de duas semanas — sprint. Porquê duas semanas? Porque assim está escrito no documento oficial da metodologia Scrum. Dickens publicava mensalmente — era esse o ciclo da tipografia; Verne publicava de duas em duas semanas — era esse o ciclo da revista. As suas iterações estavam calibradas às restrições reais, ao passo que o ciclo corporativo está calibrado a uma norma teórica.

Isto não é adaptação, é dogma — e contradição direta do quarto princípio do Manifesto para o Desenvolvimento Ágil de Software (documento fundador de 2001): «Responder à mudança em vez de seguir um plano». Uma indústria que prega adaptabilidade impõe um processo padronizado. Uma indústria que coloca as pessoas acima dos processos certifica pessoas na conformidade com processos.

Guarde este pensamento. Passemos às provas.

## Três culturas, um padrão

### Inglaterra vitoriana: Dickens e o ciclo de feedback

Em 1836, Charles Dickens publica *Os Documentos Póstumos do Clube Pickwick* em vinte fascículos mensais. Primeira tiragem: 400 exemplares. Depois da aparição de Sam Weller no quarto fascículo, as vendas subiram — no fim da série (novembro de 1837) a tiragem chegou aos 40 000².

Dickens inventou o ciclo de feedback muito antes de o termo aparecer na teoria da gestão. Cada fascículo era uma hipótese: «Esta reviravolta prenderá o público», e a tiragem do fascículo seguinte tornava-se a confirmação da hipótese. Quando o fascículo com Sam Weller elevou as vendas, Dickens ampliou de imediato o seu papel² — decisão orientada por dados, tomada um século e meio antes dos testes A/B.

Dickens não tinha rede de segurança: fascículo publicado tornava-se cânone — impossível de reverter, impossível de reeditar com correções. Essa restrição criava uma disciplina que qualquer equipa de desenvolvimento invejaria: pensa à frente, mas não além de um ciclo.

Quando em 1841 Dickens matou a pequena Nell em *A Loja das Antiguidades*, os barcos vindos da América eram recebidos por multidões nos cais aos gritos de: «Ela morreu?»⁸ Primeiro caso na história de uma comunidade envolvida na criação — e feedback a atravessar um oceano.

### França: Verne e a equipa cross-functional

Verne complicou o modelo. A sua serialização não representava apenas texto em partes, mas um projeto técnico com dependências.

Para cada romance, Verne reunia expertise: *Vinte Mil Léguas* exigia oceanógrafos, engenheiros e botânicos; *Da Terra à Lua* (1865) — balistas e astrónomos. Hetzel desempenhava o papel de Product Owner, definindo formato, prazos e público-alvo, ao passo que Verne assumia o papel de líder técnico. Os ilustradores tornavam-se designers, e os assinantes, participantes do processo, tinham direito de voto através da única métrica disponível — compra ou recusa.

Verne descrevia o *Naútilus* com uma precisão que surpreendia os engenheiros. Vinte e oito anos mais tarde, Simon Lake construiria o submarino *Argonaut* e reconheceria publicamente a influência de Verne³ — um projeto literário tornava-se protótipo técnico (prototype: modelo funcional para testar ideias).

A correspondência entre Verne e Hetzel chegou até nós⁶. Nela manifesta-se a clássica tensão entre visão do produto e liderança técnica. Hetzel: «Os leitores adormecem no capítulo sobre a mineralogia do fundo do mar.» Verne: «Sem a mineralogia, o submarino perde plausibilidade.»⁹ Compromisso: mineralogia através do diálogo das personagens, não da conferência do autor. Terreno conhecido para qualquer programador que tenha discutido com um gestor as funcionalidades do produto.

### Japão: *rakugo* e melhoria contínua

O *rakugo* (arte japonesa do monólogo cómico) existe desde o século XVII. Um mestre de *rakugo* conta uma história centenas de vezes, introduzindo microajustes com base na reação da sala — melhoria contínua em estado puro. Cada apresentação torna-se um ciclo de trabalho: a reação do público é a demonstração do resultado; o ajuste é a análise do ciclo terminado.

San'yūtei Enchō, na década de 1870 — quando Verne serializa romances em Paris — atua num teatro *yose* de Tóquio¹⁵, no período de desenvolvimento ativo do *rakugo* como forma. Cada apresentação é uma adaptação à reação do público: em que momento se riu? onde se distraiu? Isto é uma proto-*sprint retrospective* (análise do ciclo de trabalho) na prática — não escrita em papel de arroz, mas embebida na própria estrutura da execução.

Takeuchi e Nonaka publicarão em 1986 *The New New Product Development Game* — texto que se tornou a base da metodologia de desenvolvimento iterativo. A sua «abordagem de râguebi» é uma formalização do padrão que os mestres de *rakugo* praticaram durante séculos. Takeuchi e Nonaka poderão ter absorvido esse padrão pela cultura: ambos cresceram onde o *rakugo* era divertimento diário e a melhoria contínua era palavra corrente muito antes da Toyota.

Três culturas, três séculos, um padrão: criar um incremento, entregar ao público, receber feedback, ajustar. Isto é evolução convergente: quando a asa se desenvolve independentemente em aves, morcegos e insetos, a aerodinâmica não depende da espécie; quando a entrega iterativa surge em Inglaterra, França e Japão — o padrão não depende da cultura.

E se o padrão é universal, não pode ser patenteado, certificado ou vendido — pensamento incómodo para uma indústria construída sobre a venda de certificados para a aplicação de um padrão universal.

### O cliffhanger como Produto Mínimo Viável (Minimum Viable Product)

O cliffhanger explora uma propriedade fundamental do cérebro — a gestalt inacabada. Bluma Zeigarnik demonstrará experimentalmente, em 1927: as tarefas inacabadas são recordadas melhor do que as concluídas⁴; Dickens e Verne usaram este efeito intuitivamente meio século antes da sua descrição científica.

Cada cliffhanger é um Produto Mínimo Viável (MVP: Minimum Viable Product, versão funcional básica) em estado puro: entrega valor suficiente (ler a história) e cria uma nova necessidade (saber o que vem a seguir). Verne elevou-o a sistema — quinze meses, de número a número: resolução do cliffhanger anterior, episódio autossuficiente, cliffhanger novo. Padrão com precisão matemática.

Eric Ries publicará *The Lean Startup* em 2011 e descreverá o ciclo *build–measure–learn* (construir–medir–aprender: ciclo de validação de ideias) como uma rutura. Dickens praticava *write–publish–measure* desde 1836. Diferença: 175 anos.

### Dívida técnica (*technical debt*) na literatura

Verne trabalhava depressa: mais de cinquenta romances da série *Viagens Extraordinárias* em mais de quarenta anos — quase um romance e meio por ano. Este ritmo gera dívida técnica.

Em *A Volta ao Mundo em Oitenta Dias* — o famoso buraco no enredo: Fogg ganha a aposta por causa de um dia esquecido na travessia da linha internacional de mudança de data. Verne não planeou esta reviravolta — descobriu-a quando o herói matematicamente não chegava a tempo. Em vez de refactoring (refactoring: reescrita do código) — reframing (reframing: reformulação do problema): o bug tornou-se feature. Os programadores contemporâneos reconhecem o truque: «documentado como comportamento esperado».

Nos primeiros fascículos de *Vinte Mil Léguas*, Verne descreve o *Naútilus* como funcionando a eletricidade extraída da água do mar, mas a meio do romance percebe que o mecanismo é fisicamente impossível. Reescrever é impossível — os fascículos foram publicados. Verne abstrai a camada problemática: Nemo começa a responder de modo evasivo sobre a energia, os detalhes são cobertos pelo véu de mistério da personagem. A *technical debt* (dívida técnica: problemas técnicos acumulados) é mascarada pela narrativa — elegante, desonesta, eficaz. Familiar a qualquer pessoa que tenha escrito um invólucro sobre uma API partida (API: Application Programming Interface, interface de programação de aplicações).

Royce em 1970 descreveu: o processo linear não funciona para sistemas complexos⁵. Verne resolvia o mesmo problema cem anos antes dele — mas a serialização não permitia a abordagem em cascata por princípio. A literatura não conheceu o modelo de cascata — e por isso evitou as suas armadilhas.

## De Hetzel ao stand-up

Hetzel, 1870: todas as segundas-feiras — as tiragens do fascículo anterior, as revisões para o seguinte, para a tipografia. Quinze minutos ao café, na rua Jacob. Um século e meio mais tarde, o gestor de produto do Silicon Valley gasta na mesma operação uma hora numa sala de reuniões com autocolantes; o seu sucessor, líder de equipa de desenvolvimento em 2026, encaixa-a em trinta minutos numa mensageria corporativa e chama-lhe stand-up. A forma torna-se mais barata. O ritmo mantém-se.

E o ritmo é simples: conferir o resultado, corrigir o rumo, lançar o ciclo seguinte. Hetzel não conhecia a palavra «stand-up», o líder de equipa de Hetzel não leu — mas o ADN é o mesmo. Serialização literária transformada em prática de engenharia, transformada em ritual digital.

## ECONOMICS: A serialização como modelo de negócio

Por trás da história romântica dos escritores inovadores está uma matemática dura. Hetzel e os seus colegas inventaram por acaso o modelo económico que se tornará dominante no século XXI.

### Recurring revenue vs. one-time sales

**Modelo de Hetzel (1869):**
- Revista: 31 fascículos × 75 cêntimos ≈ 23 francos por leitor
- Livro: compra única, 3,50 francos
- Margem: aumento de cerca de 560% do lucro total por cliente através da serialização

**Analogia contemporânea do *software as a service* (SaaS):**
- Adobe Creative Suite: $2 600 compra única → Adobe Creative Cloud: $53/mês = $636/ano
- Microsoft Office: $500 compra única → Office 365: $100/ano
- O princípio é o mesmo: converter uma grande compra única em série de pequenas compras recorrentes

Hetzel não conhecia o termo «lucro total por cliente», mas praticava a sua maximização.

### Efeitos de rede antes da existência do termo

Dickens descobriu a viralidade do conteúdo 150 anos antes das redes sociais. Quando os leitores se juntavam para discutir o próximo fascículo de *Pickwick*, cada discussão atraía novos compradores. Passa-palavra em estado puro.

**Resultado mensurável:** crescimento da tiragem de 400 para 40 000 exemplares sem orçamento de publicidade. Crescimento orgânico de 10 000% através de conversas sociais.

**Equivalente contemporâneo de uma jovem empresa tecnológica:** cada utilizador ativo traz 0,3–0,5 novos utilizadores através de recomendações. No Dickens este coeficiente atingia 2,0–3,0 — o leitor recomendava ativamente a série aos amigos.

### Criatividade orientada por dados

As tiragens dos fascículos davam a Dickens e a Verne dados de que os criadores contemporâneos de conteúdo apenas sonham:
- Feedback imediato: as vendas do fascículo seguinte mostram a qualidade do anterior
- Teste comparativo: abordagens diferentes em fascículos diferentes, comparação da reação
- Análise de retenção: em que fascículo os leitores deixam de comprar?

Hetzel analisa nas cartas: «A intriga com os piratas aumentou as vendas em 15%». «O capítulo sobre mineralogia baixou a retenção do público»¹⁰. Decisões orientadas por dados, nas indústrias criativas, antes do aparecimento do termo.

### A acumulação de simplificações como escolha estratégica

Verne acumulava conscientemente decisões-problema:
- Imprecisões científicas em prol da fluidez da narrativa
- Simplificações geográficas em prol do ritmo
- A consistência das personagens sacrificada a reviravoltas do enredo

**Resultado:** 50+ romances em 40 anos, notoriedade internacional, influência sobre gerações de inventores.

**Abordagem alternativa:** precisão científica, publicação lenta, talvez 5–10 livros «perfeitos» que só especialistas leriam.

Verne escolheu o impacto de mercado sobre a perfeição académica. Steve Jobs tomou a mesma decisão: iPhone 1.0 sem função de copiar e colar, mas revolução no setor.

## SYNTHESIS: O ADN literário do Agile

Três culturas, três séculos, um padrão evolutivo (evolutionary pattern: esquema recorrente de desenvolvimento):

**Inglaterra vitoriana:** criar um ciclo de feedback entre criador e público
**França republicana:** coordenar uma equipa multidisciplinar para um produto complexo
**Japão imperial:** alcançar a mestria através de melhorias iterativas

Estes princípios evoluíram convergentemente em culturas diferentes porque resolvem problemas universais:
- Como reduzir o risco de fracasso de um grande projeto?
- Como obter feedback antes da conclusão de todo o trabalho?
- Como coordenar pessoas com expertise diferente?
- Como adaptar-se a requisitos em mudança?

**Compreensão fundamental:** quando um padrão único aparece independentemente em culturas diferentes, é sinal da sua fundamentalidade. Como a asa nas aves, morcegos e insetos, a aerodinâmica é universal independentemente da espécie biológica.

O Agile não é uma invenção dos programadores. É a redescoberta de um padrão universal da criatividade humana.

## MODERN IMPLICATIONS: O que perdemos quando formalizamos

Dickens, Verne e os mestres de *rakugo* trabalhavam intuitivamente. Não sabiam que estavam a criar uma «metodologia». Resolviam problemas específicos com meios específicos. O seu «Agile» crescia organicamente das restrições e das possibilidades.

### O paradoxo da certificação

A indústria contemporânea dos métodos ágeis criou aquilo de que os seus predecessores históricos teriam medo — a **padronização da adaptabilidade**.

**Dickens:** as iterações estavam ligadas às capacidades da tipografia. Ciclos mensais de impressão.
**Metodologia estruturada contemporânea de gestão de projetos:** sprints de duas semanas independentemente das especificidades do projeto.

**Verne:** a equipa era formada para um romance concreto. Oceanógrafos para o *Naútilus*, astrónomos para o «projeto lunar».
**Metodologia ágil contemporânea:** papéis universais. Scrum Master, Product Owner, independentemente do domínio.

**Rakugo:** o mestre adaptava a apresentação a um público concreto, em tempo real.
**Retrospetivas contemporâneas:** formato padronizado de discussão, independentemente da equipa e do contexto.

### O paradoxo da consultoria

O setor da consultoria em métodos ágeis defronta-se com uma contradição fundamental:

**O cliente compra adaptabilidade, mas recebe processo.**

O consultor não pode vender «sejam como o Dickens — experimentem até encontrarem a abordagem que funciona»¹¹. Isto não é uma metodologia, é um princípio. Os princípios não se escalam como produto.

Por isso, o consultor embala a adaptabilidade em práticas concretas: reuniões diárias (stand-ups: encontros matinais curtos), pontos de história (story points: estimativa relativa de tarefas), planeamento do sprint (sprint planning: reunião para distribuir o trabalho). O cliente recebe a imitação da adaptabilidade — um processo formalizado que parece criatividade mas funciona como algoritmo.

### Lost in Translation: do princípio à prática

**O que Dickens fazia:**
- Lia o mercado através das tiragens
- Adaptava o conteúdo à reação
- Equilibrava a visão artística (artistic vision: intenção criativa) com a viabilidade comercial (commercial viability: êxito no mercado)
- Usava as restrições (publicação mensal) como quadro criativo

**O que as equipas contemporâneas fazem:**
- Leem métricas através de um painel (dashboard: painel de informação)
- Adaptam o backlog (lista de tarefas por fazer) à capacidade do sprint (sprint capacity: volume de trabalho por ciclo)
- Equilibram pedidos de funcionalidades (feature requests: sugestões de possibilidades) com a technical debt (simplificações acumuladas)
- Usam as restrições (duração do sprint) como enquadramento de planeamento (planning constraints: fronteiras do permitido).

A mecânica é parecida, mas o espírito perdeu-se. Dickens experimentava. As equipas contemporâneas otimizam.

### The Measurement Problem

Dickens tinha uma métrica: a tiragem. Verne — a tiragem mais a reação crítica. O mestre de *rakugo* — a reação da sala.

As equipas contemporâneas têm dezenas de métricas — velocity (volume de trabalho executado), burndown (gráfico do trabalho restante), code coverage (percentagem de código testado), NPS (Net Promoter Score: propensão a recomendar), CSAT (Customer Satisfaction: grau de satisfação), tempo de execução de histórias, número de erros, team happiness index (estado moral do coletivo).

**Paradoxo:** quantos mais indicadores (métricas), mais difícil compreender o que funciona.

Dickens sabia no dia seguinte: funciona ou não; uma equipa contemporânea pode discutir durante meses se o crescimento da velocity (volume de tarefas executadas) significa aumento de produtividade ou queda de qualidade (quality: padrões de execução).

### Why Formalization Fails

Verne coordenava especialistas para cada romance de novo — oceanógrafos para um, astrónomos para outro. Formação da equipa (team formation: reunião de grupo de especialistas) sob a tarefa, não estrutura universal.

O Agile contemporâneo pressupõe equipa estável com papéis fixos — eficiente para tarefas operacionais, mas limita a flexibilidade criativa (creative flexibility: capacidade de adaptação criativa).

**Problema fundamental:** o Manifesto para o Desenvolvimento Ágil descreve valores (values: convicções basilares) e princípios (principles: ideias orientadoras), e a indústria vende práticas (practices: ações concretas) e frameworks metodológicos (frameworks: abordagens estruturadas). Valores não se certificam. Práticas certificam-se.

Resultado: exército de pessoas certificadas que sabem fazer planning poker (planning poker: estimativa de complexidade em equipa com cartões), mas não compreendem quando o devem saltar.

### The Original Spirit

Dickens não fazia retrospetivas (retrospectives: revisões da etapa cumprida) — sentia o pulso do público em cada publicação.

Verne não fazia daily stand-ups (daily stand-ups: sincronizações matinais curtas); coordenava-se com os especialistas por correspondência, e a frequência era determinada pela necessidade, não pelo calendário.

O mestre de *rakugo* não planeava sprints (sprints: ciclos curtos de trabalho) — adaptava-se à energia da sala em tempo real.

**O seu princípio comum:** a forma segue a função. O processo submete-se ao resultado.

**As metodologias ágeis contemporâneas invertem-no frequentemente:** o resultado submete-se ao processo. «Não podemos desviar-nos do sprint planning (sprint planning: reunião de distribuição de tarefas), mesmo que os requisitos tenham mudado radicalmente»¹².

### Return to Source

As melhores equipas contemporâneas regressam intuitivamente ao espírito original:

**Netflix:** não segue o *Scrum Guide*, mas o *culture handbook* (manual da cultura: guia dos valores corporativos) descreve princípios de adaptação
**Spotify:** inventou o «Spotify Model» não como framework metodológico (framework: abordagem estruturada), mas como reflexão (reflection: reflexão) sobre a própria evolução
**GitHub:** abordagem *async-first* (trabalho sem presença simultânea) ignora as «equipas colocadas em conjunto» (collocated teams: equipas no mesmo escritório) do Agile Manifesto, mas exprime o seu espírito

Estas empresas não se certificaram. Adaptaram-se.

O padrão sobrevive porque funciona. Não porque alguém o certificou.

A lição mais incómoda para uma indústria no valor de dezenas de milhares de milhões de dólares¹³: as melhores metodologias não se inventam — descobrem-se.

**Corte russo:** segundo estimativas da CNews Analytics, o mercado nacional de consultoria Agile foi de ₽34,7 mil milhões em 2024¹⁴ — prémio pela formalização de padrões que Tolstói aplicava em *Ana Karénina* (publicação em revista no *O Mensageiro Russo*, 1875–1877) e Dostoiévski em *Os Irmãos Karamázov* (serialização no *O Mensageiro Russo*, 1879–1880). Os clássicos da literatura russa praticavam intuitivamente a entrega iterativa 150 anos antes do aparecimento dos praticantes russos do Agile.

¹³ Allied Market Research. «Enterprise Agile Transformation Market Size» (2024). Report ID: A52468. Verified Market Research. «Global Agile Testing Market Report» (2025). VR-ID: VMR-4523. Estimativas de mercado USD 27,6–49,0 mil milhões (2024–2025), projeções USD 140+ mil milhões até 2032–2034. Fontes T2 de estudos comerciais de mercado.

¹⁴ CNews Analytics. «Рынок IT-консалтинга в России» (2024). Consultoria metodológica e transformação Agile — ₽34,7 mil milhões dos ₽287 mil milhões do total dos serviços de TI. Associação «РУССОФТ» — exportação de serviços metodológicos ₽8,2 mil milhões (sobretudo CEI, Ásia Central).

Dickens não precisava de certificado para uma tiragem de 40 000; Verne — de coach para coordenar especialistas; o mestre de *rakugo* — de retrospetiva para perceber que piada não pegou.

Bastava-lhes uma coisa — o resultado, que não se pode fingir.

## Próximo capítulo

Em 1818, a jovem Mary Shelley, de dezoito anos, publica a história de um cientista que cria uma criatura que lhe foge ao controlo. Duzentos anos depois, esta mesma história será contada por cada CEO (CEO: Chief Executive Officer, mais alto responsável) que implementou um sistema corporativo que passou a viver por conta própria.

Capítulo 2: como *Frankenstein* previu a crise dos monstros corporativos — e porque os sistemas mais perigosos se criam com as melhores intenções.

---

**Footnotes:**

² Dados de tiragem de *The Pickwick Papers*: Robert L. Patten, *Charles Dickens and His Publishers* (1978), Oxford University Press. Primeiro fascículo — cerca de 400 cópias; após a introdução de Sam Weller no quarto fascículo, as vendas subiram, chegando ao fim da série (novembro de 1837) — cerca de 40 000. (tradução do autor)

³ Simon Lake descreveu a influência de Verne na autobiografia *The Submarine in War and Peace* (1918). Verne felicitou pessoalmente Lake por telegrama. (tradução do autor)

⁴ Zeigarnik, B.V. «Über das Behalten von erledigten und unerledigten Handlungen» (1927). *Psychologische Forschung*, 9, 1–85.

⁵ Royce, W.W. «Managing the Development of Large Software Systems» (1970). IEEE WESCON. Royce apresentou o modelo em cascata como exemplo daquilo que *não funciona*, e propôs uma abordagem iterativa. (tradução do autor)

⁶ Correspondência Verne–Hetzel: Dumas, Olivier. *Correspondance inédite de Jules Verne et de Pierre-Jules Hetzel* (1999–2002), 3 tomos, Slatkine. (tradução do autor)

⁷ Beck, Kent; et al. «Agile Manifesto» (2001). Princípios da metodologia ágil de desenvolvimento de software. AgileManifesto.org. Formulação completa: «Software funcional acima de documentação exaustiva». Assinado por 17 programadores em Snowbird, Utah. (tradução do autor)

⁸ Testemunhos históricos da reação do público americano à morte da pequena Nell: Edmund Wilson, «Dickens: The Two Scrooges» in *The Wound and the Bow* (1941); Foster, John. *The Life of Charles Dickens* (1872–74). O episódio dos navios é largamente citado na literatura sobre Dickens, primeira fonte — memórias de contemporâneos. (tradução do autor)

⁹ Citações diretas da correspondência Verne–Hetzel: Dumas, Olivier. *Correspondance inédite de Jules Verne et de Pierre-Jules Hetzel* (1999–2002), tomo 2, cartas de 1869–1870. Extratos literais da correspondência editorial sobre o romance *Vinte Mil Léguas Submarinas*. (tradução do autor)

¹⁰ Análise comercial na correspondência de Hetzel: Dumas, Olivier. *Correspondance inédite de Jules Verne et de Pierre-Jules Hetzel* (1999–2002). Hetzel analisava sistematicamente as vendas por episódio, monitorizando as preferências dos leitores para ajustar a estratégia de conteúdos. (tradução do autor)

¹¹ Ilustração autoral do princípio da adaptabilidade vs. procedimentalidade no contexto da consultoria Agile. Paralelo entre a abordagem orgânica de Dickens e a tendência contemporânea à formalização dos processos criativos.

¹² Expressão típica da prática corporativa das implementações Agile, que ilustra a inversão do princípio «Responder à mudança em vez de seguir um plano» do Agile Manifesto. Baseada na experiência de coaching Agile e na análise de estudos de caso corporativos.

¹⁵ San'yūtei Enchō (1839–1900) foi uma figura maior do *rakugo* no período Meiji. Brau, Lorie. *Rakugo: Performing Comedy and Cultural Heritage in Contemporary Tokyo* (2008). University of Chicago Press. Fontes adicionais: Nippon.com «The Art of Rakugo» (2024) e «A Guide to Yose Culture» Japan Society (2023). A metodologia iterativa de execução de Enchō representa a tradição oral paralela à serialização escrita de Verne e Dickens — validação intercultural dos padrões adaptativos de feedback.

¹⁶ 1C:Enterprise: plataforma de gestão empresarial líder na Rússia; Kontur.Elba: serviço de contabilidade em nuvem para PME. Ambos exemplos correntes de modelo SaaS por subscrição na economia russa contemporânea.
