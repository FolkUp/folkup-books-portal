---
title: "Capítulo 2: Frankenstein gere um projeto"
description: "Como o romance da jovem Mary Shelley, aos dezoito anos, se tornou a análise pós-mortem mais precisa dos fracassos corporativos: do FBI Sentinel ao Healthcare.gov."
date: 2026-03-27
date_created: "2026-03-27"
date_updated: "2026-08-25"
weight: 30
plate: "kn1-02-frankenstein.webp"
chapter: 2
act: "I: Origens"
category: analysis
reading_time: "25 min"
tags:
  - mary-shelley
  - frankenstein
  - project-failure
  - corporate-prometheus
  - technology-hubris
related:
  - "/chapters/chapter-0-pilot"
  - "/chapters/chapter-1-jules-verne"
  - "/chapters/chapter-3-holmes"
  - "/chapters/chapter-4-borges"
sensitive: false
toc: true
draft: false
status: verified
sources:
  - "Aldini, Giovanni. *An Account of the Late Improvements in Galvanism* (1804). London. Demonstrações públicas de galvanismo em 1803."
  - "GAO-05-105. «FBI Trilogy Project», February 2005. Government Accountability Office. Orçamento total do VCF cerca de 170 milhões de dólares."
confidence: high
reviewed_by: "Borges (arquitetura literária), CyberGonzo (verificação OSINT)"
review_date: "2026-08-25"
---

![Gravura do capítulo: Frankenstein gere um projeto](/kn1/images/chapters/agil-chapter-2-plate.webp)

> **De que trata este capítulo.** O lado sombrio da criação. Como o padrão «ideia brilhante → fuga das consequências» atravessa como fio vermelho o romance de Mary Shelley até aos maiores fracassos da transformação digital. Porque os sistemas mais perigosos se criam com as melhores intenções — e o que acontece quando o criador se vai embora.


## A Villa Diodati, 16 de junho de 1816

A chuva não para há três semanas — sobre a Europa paira a cinza do Tambora, o vulcão do outro lado do planeta que lançou para a estratosfera tanto enxofre que o verão foi cancelado para sempre. Os historiadores chamarão a 1816 «o ano sem verão», mas a jovem Mary Godwin, de dezoito anos (ainda não é Shelley), está sentada junto à lareira da Villa Diodati e ouve Byron e Percy discutirem galvanismo com a fervura de cientistas prontos a reescrever as leis da natureza.

Poderá a eletricidade dar vida a tecido morto — pergunta que já recebera resposta sinistra nas demonstrações londrinas de Giovanni Aldini: os membros de criminosos executados estremeciam, as mandíbulas abriam-se¹. Os espectadores caíam desmaiados de horror. Os mortos não ressuscitavam, mas as fronteiras do possível deslocaram-se para sempre.

Byron propõe uma aposta — cada um escreverá uma história de terror nesta villa amaldiçoada, onde a chuva apagou o verão do mapa do mundo. Percy e Polidori compõem as suas histórias e abandonam-nas ao fim de poucos dias, Byron também recuará, mas a jovem Mary, de dezoito anos, criará um romance que sobreviverá a todos eles e se tornará texto profético para uma época ainda por nascer.

Duzentos e oito anos mais tarde, este romance descreve uma em cada duas crises corporativas com mais precisão do que a McKinsey descreve as suas recomendações. Só os ingredientes mudaram; a estrutura permaneceu a mesma.

Em vez do galvanismo, usa-se a transformação digital. Em vez de tecido morto, reanimam-se processos herdados. Em vez de descarga elétrica, aplica-se o «Big Bang do lançamento»¹⁵. Em vez de uma criatura que vagueia pelo Ártico à procura do criador, obtemos um sistema de catorze quadros Jira, sete espaços Confluence e três definições mutuamente exclusivas da palavra «pronto». Um monstro que ninguém se atreve a desligar, porque ninguém compreende até ao fim como está feito.

---

O capítulo anterior mostrou o lado luminoso da criação — como Verne e Hetzel inventaram o protótipo do desenvolvimento iterativo através de incrementos, ciclos de feedback e decisões orientadas por dados, criando literatura capaz de dar vida a um padrão que transformaria toda uma indústria.

Frankenstein representa o lado sombrio da mesma medalha — a história do que acontece quando o criador abdica da responsabilidade por como a sua criação vive e se desenvolve depois do lançamento em produção.

Se o capítulo 1 foi sobre o nascimento do projeto, o capítulo 2 é sobre o que acontece quando o pai se vai embora, deixando a sua obra à mercê da sorte.

## Anatomia da fuga

*Frankenstein ou o Prometeu Moderno* é a história de um cientista que criou um ser dotado de razão, se horrorizou com o resultado e fugiu do laboratório — e não porque o ser fosse mau por natureza, mas porque Victor Frankenstein não pensou nem no modelo operacional, nem na estratégia de apoio ao que iria acontecer após o lançamento.

Releia o romance com atenção — Victor trabalha dois anos no projeto em completo isolamento, sem consultar colegas, sem discutir consequências éticas, sem construir um plano operacional de apoio ao resultado. Está obcecado exclusivamente com a tarefa técnica «pode-se criar vida?». A pergunta «deve-se fazê-lo?» adia-se para depois. A pergunta «o que fazer a seguir com o resultado?» não se coloca de todo.

No momento crítico do lançamento acontece uma catástrofe de perceção. O ser abre um olho amarelo baço, respira com dificuldade, os membros são sacudidos por convulsões — e Victor, em vez do triunfo, é tomado de horror¹⁴: «o sonho belo desvaneceu-se e uma repulsa mortal encheu-me o coração». Comete o ato que determinará toda a tragédia posterior. Foge.

Literalmente foge do laboratório e vai deitar-se, como se o problema se fosse resolver sozinho.

Isto não é gótico — é um protocolo operacional que qualquer funcionário de uma empresa reconhece à primeira vista:

1. **Visionário** vende ao conselho de administração uma ideia revolucionária
2. **Equipa** trabalha em isolamento dois anos sem feedback dos utilizadores
3. **Lançamento**: o sistema tem aspeto completamente diferente do da bonita apresentação
4. **Visionário** recebe uma promoção para «papel estratégico» (forma elegante de fugir e ir deitar-se)
5. **Criação** começa a viver a sua própria vida imprevisível

Mary Shelley não escreveu um terror gótico — criou a primeira análise pós-mortem detalhada da história da literatura de um lançamento fracassado de um sistema complexo.

E como em cada análise pós-mortem de qualidade, a conclusão principal não soa «criámos um monstro por acaso», mas muito mais assustadora: **sabíamos que estávamos a criar um monstro e conscientemente não parámos**.

Parar significaria reconhecer perante os investidores e a equipa a verdade. A ideia inicial não era apenas má, era catastroficamente incompleta ao nível da arquitetura.

Victor Frankenstein é um estudante brilhante com um espírito agudo e conhecimentos profundos. O seu problema fundamental não é a falta de intelecto. Confunde catastroficamente a *capacidade técnica* de criar algo com a *disposição* de assumir responsabilidade pelas consequências.

A diferença entre «eu posso fazer isto» e «eu tenho de manter isto» é uma distância ártica. Nela morrem projetos, carreiras e, como o romance mostra, vidas humanas.

Consideremos agora três histórias documentadas da prática empresarial — todas reais, todas cuidadosamente registadas por auditores estatais, e todas constituem repetições perfeitas do enredo gótico inventado por uma jovem de dezoito anos, junto à lareira da villa amaldiçoada de Diodati.

## FBI Sentinel: um monstro de 451 milhões de dólares

Em 2001, Robert Mueller tornou-se diretor do FBI uma semana antes do 11 de setembro — e a investigação dos atentados expôs um pesadelo tecnológico impossível de ignorar: os agentes trabalhavam com pastas de papel como nos anos 1950, a informação entre departamentos não circulava por causa de sistemas incompatíveis, e o sistema central de gestão de casos «Automated Case Support» fora escrito com tecnologias dos anos 1980 e desmoronava-se à vista².

Mueller — homem de disciplina militar e pensamento estratégico — fez exatamente o que fazem todos os visionários corporativos em momento de crise: anunciou um projeto grandioso de transformação digital completa. O sistema «Virtual Case File» deveria tornar-se o cérebro digital do FBI, plataforma revolucionária de gestão de investigações. O orçamento era de 170 milhões de dólares, o principal prestador de serviços era a Science Applications International Corporation (SAIC), o prazo — três anos ambiciosos.

O resultado ao fim de três anos e 170 milhões de dólares gastos foi assustadoramente simples: absolutamente nada funcional. O Virtual Case File foi considerado um sistema totalmente inutilizável, o Congresso exigiu explicações detalhadas e audiências públicas, e o FBI, com o rosto de pedra, anunciou que ia recomeçar o processo.

O novo projeto recebeu o nome «Sentinel» — o novo orçamento cresceu para 451 milhões de dólares, o novo prazo foi marcado para 2009, o novo prestador de serviços passou a ser a Lockheed Martin, mas o padrão arquitetural do fracasso permaneceu exatamente o mesmo. Victor Frankenstein regressa triunfalmente ao seu laboratório com orçamento ainda maior e planos ainda mais grandiosos de ressurreição dos mortos.

Em 2010, o projeto Sentinel gastara 405 dos 451 milhões planeados e entregara, com orgulho, apenas duas das quatro fases prometidas. A Lockheed Martin entregou solenemente um sistema que os agentes se recusavam categoricamente a usar por razão simples — funcionava mais devagar do que as habituais pastas de papel³.

O Inspetor-Geral do Departamento de Justiça (OIG) publicou uma auditoria burocrática seca, com as formulações clássicas: «O projeto sofreu de ausência de abordagem disciplinada à gestão de requisitos, controlo de qualidade insuficiente e coordenação fraca entre participantes»⁴ (tradução do autor) — o que, em tradução do burocratês para o gótico, significa uma verdade simples e terrível: o criador coseu metodicamente um ser técnico a partir de membros dispersos alheios, fê-lo passar por uma corrente potente de dinheiro público e horrorizou-se quando o monstro se mexeu de forma completamente distinta da que fora belamente desenhada nos diagramas arquiteturais.

Só em 2012 é que o FBI finalmente fez aquilo que devia ter feito ainda em 2001: retirou o projeto ao prestador externo, reduziu radicalmente a equipa para quarenta pessoas, passou ao desenvolvimento iterativo com ciclos de duas semanas e, num ano, completou todo o trabalho restante, gastando menos de 30 milhões de dólares⁴.

Total: treze anos de sofrimento, mais de seiscentos milhões de dólares gastos, dois projetos completamente falhados — e no final revelou-se que a solução que verdadeiramente funcionou (pequena equipa interna, iterações curtas, ausência total de plano grandioso) custou menos do que o orçamento anual do Virtual Case File inicial.

Hetzel assente sabiamente do longínquo 1870 — incrementos, feedback constante, calibração contínua pelos resultados; e Mary Shelley acena tristemente do ainda mais longínquo 1818 com uma verdade simples mas vital: não abandonem à mercê da sorte aquilo que criaram.

Mas o pormenor mais impressionante desta história não reside na dimensão do fracasso, mas na natureza da solução que acabou por funcionar. Quando Chad Fulgham chefiou a equipa interna do Sentinel, não contratou mais programadores — retirou as pessoas em excesso; não escreveu uma especificação técnica mais detalhada — abdicou completamente dos planos a favor de iterações de duas semanas; não comprou tecnologia mais cara — utilizou ao máximo o que já estava à disposição do FBI.

A equipa de quarenta pessoas fez num ano aquilo que centenas de especialistas não conseguiram realizar em doze anos de luta dramática — e isso aconteceu não porque a nova equipa fosse mais inteligente ou mais talentosa do que as anteriores, mas exclusivamente porque tomaram uma decisão fundamentalmente diferente: ficaram no laboratório e assumiram responsabilidade pelo resultado.

## Healthcare.gov: um lançamento que o mundo inteiro ouviu

A 1 de outubro de 2013, a administração de Barack Obama lança com grande pompa o Healthcare.gov — portal federal de seguro de saúde e elemento tecnológico central da revolucionária Affordable Care Act (Lei dos Cuidados Acessíveis), um sistema que deveria permitir a milhões de americanos escolher e adquirir facilmente um plano de seguro.

Nas primeiras horas após o lançamento, o site não apenas abranda — cai por completo sob a carga de milhões de utilizadores. De milhões de tentativas desesperadas de registo nos primeiros dias, consegue-o literalmente uma mão-cheia de pessoas. Segundo dados apresentados nas dramáticas audiências do Comité da Energia e do Comércio da Câmara dos Representantes, o número de registos bem sucedidos no primeiro dia de funcionamento do sistema media-se em unidades — soava o número inacreditável «seis pessoas em todo o país»⁵ (tradução do autor), embora a metodologia exata de contagem viesse a ser posteriormente contestada.

A investigação minuciosa do Comité da Câmara dos Representantes estabeleceu um facto impressionante: o projeto grandioso era gerido simultaneamente por «55 prestadores diferentes sem um único integrador de sistemas coordenador»⁶ (tradução do autor), e ao mesmo tempo os Centers for Medicare & Medicaid Services (CMS) tentavam heroicamente desempenhar papéis incompatíveis de cliente, gestor de projeto e integrador de sistemas — sem terem, para esta última função, a menor experiência nem os recursos necessários.

Victor Frankenstein no seu laboratório gótico trabalhava pelo menos em orgulhosa solidão e assumia responsabilidade pessoal pelo resultado — o Healthcare.gov, por seu lado, tinha 55 pares de mãos trabalhadoras espalhadas por diferentes prestadores, e ao mesmo tempo nenhuma cabeça coordenadora que visse a imagem no seu todo.

O GAO, no seu relatório detalhado de 2015, documentou três erros críticos de arquitetura: «os requisitos técnicos-chave continuaram a mudar radicalmente até às últimas semanas antes do lançamento solene, um teste de carga completo do sistema sob carga real de utilizadores nunca foi realizado, e a decisão final sobre o lançamento a 1 de outubro foi tomada exclusivamente por razões políticas»⁷ (tradução do autor), ignorando completamente as recomendações técnicas.

Aqui é criticamente importante não descer à polémica política — isso escapa em muito ao alcance da nossa análise e distrai da lição principal. É importante ver a estrutura arquitetural do fracasso, que se revela goticamente arrepiante — os mesmos corredores abobadados do castelo de Frankenstein, apenas forrados com gesso cartonado moderno e iluminados por painéis LED:

**Visionário** (iniciativa legislativa) → **Ideia grandiosa** (portal único para todo o país) → **Equipa em isolamento** (55 prestadores sem coordenação) → **Lançamento por calendário** (prazo político) → **Fuga** (ninguém pessoalmente respondia pelo funcionamento do sistema).

Mary Shelley poderia ter escrito este enredo sem alterar uma única linha da estrutura do romance. Victor monta o ser a partir de partes dispersas retiradas de diferentes fontes. Cada parte é funcional isoladamente. Juntas — monstro. E o criador não fica para lhe ensinar a andar.

O Healthcare.gov foi por fim reparado, mas isso exigiu dois meses de trabalho intenso de uma «unidade tecnológica de choque» especial (surge team) de especialistas de topo trazidos da Google, Oracle e Red Hat, e ainda a reconstrução completa da arquitetura do sistema a partir do zero. A ironia amarga da situação estava em que as pessoas que repararam com sucesso o Healthcare.gov agiram exatamente segundo os princípios descritos no primeiro capítulo deste livro: pequena equipa focada, ciclos iterativos curtos, feedback diário com os utilizadores — metodologia que o velho Hetzel certamente aprovaria.

Mas a reparação técnica do Healthcare.gov custou não apenas dinheiro orçamental e esforço humano — custou a confiança pública insubstituível, essa moeda que não se pode reescrever através de refactor (reestruturação do código sem alterar funcionalidade) ou otimização sistémica. E aqui reside, talvez, a lição mais importante do romance Frankenstein para o mundo corporativo: os problemas técnicos são quase sempre tecnicamente solúveis através de suficientes recursos e expertise, mas as ruínas reputacionais são irreversíveis. Ao ser de Frankenstein teoricamente podia ensinar-se, educar-se, encaminhar-se em rumo construtivo — mas apenas enquanto não matasse William, Justine e Clerval, após o que o ponto de não-retorno foi definitivamente atravessado. Não porque o monstro se tornasse incorrigível por natureza, mas exclusivamente porque Victor demorou demasiado tempo a esperar e adiar a aceitação de responsabilidade.

## BBC Digital Media Initiative: o monstro silencioso

Longe de todos os monstros de Frankenstein organizarem espetáculos teatrais barulhentos com destruição de mobílias e escândalos públicos — alguns preferem devorar recursos silenciosa e metodicamente na cave corporativa, crescendo lentamente na escuridão até alguém, por acaso, lá espreitar com uma lanterna.

Em 2008, a BBC lançou a Digital Media Initiative (DMI), sistema que deveria modernizar a produção e a gestão de conteúdos. Um workflow (fluxo de trabalho) totalmente digital: da rodagem à emissão. Orçamento: 98 milhões de libras esterlinas⁸.

Inicialmente o projeto foi confiado à Siemens IT Solutions. Em 2009, a BBC rescindiu o contrato e decidiu fazer o sistema com meios próprios. Decisão conhecida: o FBI faria o mesmo com o Sentinel três anos depois, e ali funcionaria. Mas o FBI reduziu a equipa e passou a iterações. A BBC não o fez.

Em vez disso, a BBC continuou a construir o monólito. A equipa interna herdou a ideia grandiosa e não se atreveu a revê-la.

O National Audit Office do Reino Unido publicou o relatório em janeiro de 2014. As conclusões foram devastadoras: «No momento do encerramento do projeto, a DMI não entregara nenhum dos resultados anunciados»⁸ (tradução do autor).

Zero. Noventa e oito milhões de libras. Zero resultado.

O NAO estabeleceu: o projeto sofreu de «supervisão insuficiente por parte da direção da BBC, ausência de clareza nos papéis e responsabilidades, e gestão fraca dos riscos»⁸ (tradução do autor). O relatório observou que a direção da BBC «não recebia informação adequada sobre o estado do projeto»⁹ (tradução do autor) e que os problemas técnicos eram sistematicamente subestimados na reportagem.

### O monstro que ninguém viu

A DMI representa o caso mais puro e clinicamente preciso da síndrome de Frankenstein na prática corporativa contemporânea. Aqui nem sequer ocorreu um lançamento catastrófico dramático com escândalos públicos — o monstro não se libertou para destruir a cidade, mas morreu silenciosa e imperceptivelmente na cave, tendo previamente devorado metodicamente todo o orçamento atribuído. Os criadores, entretanto, não fugiram em pânico do laboratório — apenas gradualmente deixaram de lá espreitar, esperando que o problema se resolvesse de alguma maneira sozinho.

Noventa e oito milhões de libras equivalem a dois mil e duzentos salários anuais de um jornalista principiante da BBC. Ou ao orçamento de várias temporadas de «Doctor Who». Ou (para traduzir na língua de Mary Shelley) eletricidade suficiente para reanimar um cemitério inteiro, e não apenas um monstro.

Mary Shelley descreveu também isto. No romance há um momento que frequentemente se perde: Victor não apenas foge do ser. Evita ativamente a informação sobre ele. Não pergunta. Não procura. Espera que o problema desapareça por si. A BBC agiu de forma análoga: a direção não queria saber o estado real do projeto (porque o conhecimento obriga a agir).

## Frankenstein como metodologia

Agora a tese que enraivecerá os consultores de implementação de métodos ágeis: a implementação de métodos ágeis em grandes organizações é uma tentativa de dar vida a tecido morto pelo galvanismo.

A formulação é provocadora. Vejamos por partes.

A implementação clássica de métodos ágeis assenta numa lógica sedutoramente simples: pega-se numa organização existente, com hierarquia consolidada, processos formais e cultura conservadora — e «transforma-se» numa estrutura ágil, adaptativa e cross-functional (transversal) através de uma série de rituais mágicos. Contrata-se um exército de coaches externos, realizam-se formações inspiradoras, renomeiam-se cerimonialmente os gestores em Scrum Masters, introduzem-se solenemente cerimónias sagradas com belos nomes.

Três problemas.

**Problema primeiro: o eletrochoque não cria vida.** Aldini fazia estremecer membros mortos. Os espectadores tomavam isto por reanimação. O corpo estremecia, mas não vivia. Uma organização que passou por «transformação» estremece — faz stand-ups, preenche quadros, vai a retrospetivas. Mas se a cultura não mudou, isto é galvanismo: aparência de movimento sem vida.

**Problema segundo: o criador foge solenemente após a cerimónia.** A empresa de consultoria realiza uma implementação em grande escala em seis a doze meses, recebe agradecimentos e o cheque, após o que desaparece elegantemente do horizonte. A organização fica sozinha com processos brilhantes e novos que nenhum dos funcionários compreende com profundidade suficiente para os adaptar às condições reais de trabalho. Victor Frankenstein em fato corporativo, saindo solenemente do laboratório com as palavras: «Demos à sua empresa nova vida, agora desenvolvam-se sozinhos».

**Problema terceiro: o monstro vinga-se.** O ser de Frankenstein não nasce mau. Torna-se destrutivo pelo abandono. Os processos-zombie — procedimentos formalmente cumpridos mas desprovidos de conteúdo — surgem não porque os métodos ágeis sejam maus. Surgem porque os criadores se foram embora. Os stand-ups transformam-se em relatórios à chefia. As retrospetivas transformam-se em formalidade. Os sprints — em cascatas rigidamente planeadas de duas semanas. O monstro está vivo, mas não é essa a vida que o criador imaginou.

O ser no romance de Shelley aprende a falar lendo Milton, Plutarco e Goethe — furtivamente, ouvindo por trás da parede da cabana. Os processos-zombie aprendem a falar ouvindo os verdadeiros métodos ágeis através da parede da sala de reuniões: apropriam-se das palavras («sprint», «backlog», «velocity»), mas não compreendem o sentido. O resultado é idêntico: um ser que fala língua humana mas não é compreendido pelos humanos. E não se compreende a si próprio.

## Nokia: quando o criador se recusa a ver o monstro

A história da Nokia representa um exemplo de tipo fundamentalmente diferente de monstro corporativo — aqui a força destrutiva não foi um projeto concreto fracassado, mas a recusa coletiva da organização de ver a realidade em mudança e reconhecer factos incómodos.

Em 2007, a Nokia controlava mais de 50% do mercado mundial de smartphones (cerca de 51% no Q4 2007)¹⁰. Em 2013 — menos de 3%¹⁰. Os investigadores Vuori e Huy do INSEAD publicaram na *Administrative Science Quarterly* uma análise detalhada baseada em 76 entrevistas com gestores da Nokia. A sua conclusão: «O medo organizacional paralisou a capacidade da Nokia de reagir à ameaça do iPhone»¹¹ (tradução do autor).

Não ausência de tecnologias. Não falta de recursos. Medo.

Os gestores intermédios conheciam os problemas do Symbian — sistema operativo que não podia competir com o iOS. Mas tinham medo de comunicar más notícias à direção. A direção, por sua vez, transmitia otimismo, sem ter a imagem completa. A informação era filtrada em cada nível da hierarquia. Cada nível via a sua versão do ser, e nenhuma coincidia com a realidade¹¹.

Isto não é Victor a fugir do laboratório, é Victor perante o ser convencendo-se de que vê um anjo.

Vuori e Huy descreveram um mecanismo a que chamaram «distributed attention»¹¹ (tradução do autor): quando a organização é tão grande que ninguém vê a imagem completa, a responsabilidade dissolve-se. Cada um responde pelo seu fragmento, ninguém — pelo todo. O monstro de Frankenstein tinha pelo menos um criador a quem podia perguntar: «Porque me criaste?»²⁸ A Nokia — organismo sem autor único, onde não há a quem colocar esta pergunta.

A Nokia não perdeu a revolução dos smartphones por burrice. A empresa perdeu-a porque a estrutura da organização tornou a verdade impossível. O monstro estava na sala, e todos combinaram não o notar.

## O Ártico da dívida técnica

Para onde vão os projetos abandonados? No romance de Mary Shelley — para o Ártico. O ser de Frankenstein foge para o Polo Norte, para o vazio, onde não há pessoas. Victor persegue-o e morre nos gelos.

O Ártico da dívida técnica: espaço para onde vão os sistemas de que se desistiu mas que é impossível desligar.

Cada empresa com mais de dez anos tem o seu Ártico. Sistemas COBOL em bancos, escritos por pessoas já reformadas. Configurações ERP que ninguém compreende no seu todo. Ferramentas internas escritas por um estagiário em 2009 e tornadas infraestrutura crítica (infrastructure — sistemas tecnológicos básicos que asseguram o funcionamento da organização).

Criados com as melhores intenções. Abandonados pelos criadores. A vaguear pelo deserto gelado da infraestrutura corporativa — odiados e insubstituíveis. Seres de Frankenstein no sentido mais exato.

Frederick Brooks em *The Mythical Man-Month* descreveu uma lei que poderia estar pendurada sobre a entrada do laboratório de Victor: «acrescentar pessoas a um projeto atrasado torna-o ainda mais atrasado»¹² (tradução do autor). O projeto-monstro não se torna mais obediente pela quantidade de pessoas que se lhe atribuem. Torna-se mais complexo e mais perigoso.

Segundo dados de investigação da indústria (Standish Group, CHAOS Report 2018), os projetos que adiaram a tomada de decisões-chave («decision latency») têm um índice de sucesso duas vezes menor¹³. A fuga da decisão não é ato neutro. É ato de destruição alongado no tempo.

Victor poderia ter salvo a si e ao ser, se tivesse ficado. Não fugido. Não adiado. Não «delegado» a outra equipa. Ficado e assumido responsabilidade pelo que criou.

Cada um dos exemplos deste capítulo (FBI, Healthcare.gov, BBC, Nokia) repete um padrão: fuga da responsabilidade pelo criado. E de cada vez a solução chega da mesma forma: alguém para de fugir e começa a entender.

Há uma ironia amarga em que a indústria que prega «fail fast, learn fast»²⁶ tenha pânico de reconhecer fracassos. *Fail fast* — enquanto se trata de um teste A/B de botão de landing page. Quando se trata de um sistema de quinhentos milhões de dólares: fail quietly, blame vendor, restructure leadership²⁷. Mary Shelley foi mais honesta: no seu romance Victor paga pela fuga com a vida. O Victor corporativo paga pela fuga com uma transferência para outro departamento e com opções sobre ações.

## As cinco fases do luto corporativo

Antes de passarmos à estrutura: uma observação que não se encontra em relatórios de auditores, mas que conhece cada um que viveu um grande fracasso de projeto.

Quando o monstro corporativo começa finalmente a partir mobílias abertamente e a quebrar montras, qualquer organização atingida atravessa inevitavelmente cinco fases clássicas do luto, que se podem observar com precisão de cronómetro:

**Negação da realidade.** *O sistema funciona perfeitamente, os utilizadores é que não estão suficientemente formados nos novos procedimentos*¹⁵. A Nokia afirmava com rosto de pedra: «O Symbian mantém-se plataforma competitiva»¹⁶. A administração do Healthcare.gov insistia: «São problemas temporários de escala que se resolverão sozinhos»¹⁷. Victor Frankenstein convencia-se: «O ser foi para longe, nas montanhas, nunca mais regressará»¹⁸.

**Ira.** *A culpa é do prestador / do vendor / da equipa anterior*¹⁹. FBI: «A SAIC falhou no Virtual Case File»²⁰. BBC: «A Siemens não geriu a DMI»²¹. Victor: «Este ser é um monstro, não sou eu»²².

**Negociação com a realidade.** *Se acrescentarmos mais 200 milhões ao orçamento, ou contratarmos mais um integrador de sistemas, ou fizermos mais uma transformação global — aí sim, tudo se resolverá magicamente*²³. É a fase mais dispendiosa de todas as possíveis, em que as organizações estão dispostas a pagar qualquer dinheiro para não reconhecerem o erro fundamental na arquitetura. O FBI negociou com o destino durante treze anos, a BBC alongou esta fase por seis anos.

**Depressão.** *O projeto está morto, o dinheiro foi gasto, nada funciona*²⁴. Nesta fase costuma-se mudar a direção, reestruturar, escrever a análise pós-mortem. Fase útil — se nela não se ficar preso.

**Aceitação.** *Não criámos o que planeámos. Agora há que trabalhar com o que existe*²⁵. Única fase produtiva. O FBI alcançou-a em 2012. O Healthcare.gov — em dois meses. A BBC — nunca (projeto encerrado).

Victor Frankenstein alcança a aceitação demasiado tarde: nos gelos, moribundo. Conta a sua história ao capitão Walton não como justificação, mas como aviso. Análise pós-mortem no sentido literal.

## O ciclo gótico: da criação ao reconhecimento

Mary Shelley — recorde-se, tinha apenas dezoito anos — descreveu um ciclo universal de autodestruição que o mundo corporativo, com precisão maníaca, redescobre a cada década, como se lesse por notas a partitura da tragédia. O ciclo começa invariavelmente com inspiração perfeitamente genuína e motivos nobres: Victor Frankenstein quer vencer a morte, o diretor Mueller — proteger o país do terrorismo, os arquitetos do Healthcare.gov — dar seguro de saúde a milhões de americanos, a direção da BBC — revolucionar a produção televisiva. Em todos os casos o problema é absolutamente real, a solução parece tecnicamente exequível, a ambição é moralmente irrepreensível.

Depois chega inevitavelmente a fase fatal do isolamento — o criador começa a trabalhar em completa desconexão de quem a sua criação diretamente afetará. Victor não se aconselha com a família e colegas, o FBI entrega totalmente o projeto a prestador externo sem participação profunda dos agentes, o Healthcare.gov é construído sem testes abrangentes com utilizadores reais, a BBC deixa gradualmente de informar a própria direção da situação real do projeto. Apenas duas fases, mas já aqui, nesta parte enganadoramente silenciosa do romance gótico, o destino do monstro está definitivamente predeterminado.

Chega inevitavelmente o momento da verdade — lançamento solene em produção. O ser de Frankenstein abre lentamente os olhos amarelos, o sistema corporativo entra oficialmente em ambiente de produção sob rufo de tambores dos comunicados de imprensa, e o resultado não corresponde catastroficamente às belas expectativas. Sempre, sem uma única exceção.

> E é aqui que o criador se parte. Victor vai deitar-se. O prestador entrega a «fase 1» e passa para outro contrato. Os consultores encerram o «projeto de transformação» e vão-se embora. O responsável passa para «papel estratégico». A fuga nunca tem aspeto de fuga — é sempre apresentada como promoção.

A criação abandonada à mercê da sorte torna-se inevitavelmente força destrutiva — e não por maldade inata ou defeitos de arquitetura, mas exclusivamente pelo abandono e ausência de cuidado. Processos-zombie, sistemas herdados que exigem apoio, devorando metodicamente recursos, fracassos épicos destruindo sistematicamente a confiança dos utilizadores — todos estes monstros vingam-se não porque tenham sido inicialmente criados como monstros, mas exclusivamente porque os seus criadores fugiram no momento crítico e os deixaram sem apoio.

A única saída — o que em Mary Shelley se chama reconhecimento, e nos auditores «aceitação de responsabilidade após os primeiros prejuízos». O FBI retirou o Sentinel à Lockheed Martin. O Healthcare.gov reconstruiu-se com uma equipa de resposta rápida. O reconhecimento não garante a salvação — Victor morre nos gelos — mas sem ele é impossível sequer começar a corrigir seja o que for. O ciclo não é metáfora. É modelo operacional do fracasso.

## Do monstro à criança

Mary Shelley, no seu romance gótico, colocou a pergunta fundamental da contemporaneidade: o que acontece quando o criador da tecnologia abandona a sua criação à mercê da sorte? Mas esta pergunta sombria tem um duplo luminoso espelhado, e é precisamente esse que nos deve conduzir mais além pelos labirintos da realidade corporativa: o que acontece nos raros casos em que o criador assume a responsabilidade e permanece ao lado da sua obra?

O capítulo anterior sobre Jules Verne mostrou-nos o exemplo modelar da criação saudável — iterações, feedback constante, adaptação mútua, quando o criador e a sua criação evoluem organicamente juntos como um sistema único. Frankenstein demonstrou as consequências trágicas da rutura catastrófica desta ligação viva. Resta explorar a terceira posição, a mais complexa — não o momento da criação, não o drama da rutura, mas o acompanhamento responsável de longo prazo do projeto. Isto não é instrução técnica, não é certificado administrativo, não é escolha filosófica entre desenvolvimento sequencial e métodos ágeis: é arquétipo literário em que o criador conscientemente não foge das consequências, mas aprende pacientemente a viver e a trabalhar com o que criou.

Para isto é preciso deixar o laboratório e ir a Baker Street.

---

**Footnotes:**

¹ Giovanni Aldini realizou demonstrações públicas de galvanismo em Londres em 1803, sobre o corpo do executado George Forster. Documentado em *An Account of the Late Improvements in Galvanism* (Aldini, 1804).

² Virtual Case File: GAO-05-105, «FBI Trilogy Project», February 2005. O orçamento total do VCF foi de cerca de 170 milhões de dólares, o projeto foi totalmente cancelado em abril de 2005.

³ Status of Sentinel: DOJ OIG Audit Report 10-03, October 2009. Neste momento o Sentinel gastara $405 milhões dos $451 milhões planeados e entregara apenas 2 de 4 fases.

⁴ DOJ OIG Audit Report 12-08, November 2011. «The FBI's Sentinel Information Technology Project». O relatório documenta tanto os problemas do projeto sob gestão da Lockheed Martin como a conclusão bem sucedida do projeto pela equipa interna do FBI com abordagem Agile. (tradução do autor)

⁵ Depoimentos perante o Congresso, outubro de 2013. Os dados sobre o número de registos bem sucedidos no primeiro dia foram apresentados nas audiências do Comité da Energia e do Comércio da Câmara dos Representantes.

⁶ US House Committee on Energy and Commerce, Majority Staff Report, «Behind the Curtain of the Healthcare.gov Rollout», September 2016. (tradução do autor)

⁷ GAO-15-238, «Healthcare.gov: CMS Has Taken Steps to Address Problems, but Needs to Further Implement Systems Development Best Practices», March 2015. (tradução do autor)

⁸ UK National Audit Office, HC 985, «The BBC's Digital Media Initiative», January 2014. Custo total do projeto estimado em £98,4 milhões, «the BBC has not achieved value for money». (tradução do autor)

⁹ UK National Audit Office, Briefing for the Public Accounts Committee, «Managing the BBC's Digital Media Initiative», Session 2013-14. (tradução do autor)

¹⁰ Dados de quota de mercado da Nokia baseados em investigações da indústria (IDC, Gartner, 2007–2013). Relatórios anuais da Nokia Corporation confirmam a tendência de queda.

¹¹ Vuori, T.O. & Huy, Q.N. «Distributed Attention and Shared Emotions in the Innovation Process: How Nokia Lost the Smartphone Battle.» *Administrative Science Quarterly*, Vol. 61, Issue 1, 2016, pp. 9–51. Investigação baseada em 76 entrevistas com gestores de topo e intermédios da Nokia. (tradução do autor)

¹² Brooks, Frederick P. *The Mythical Man-Month: Essays on Software Engineering* (1975). Addison-Wesley. «Adding manpower to a late software project makes it later» — lei de Brooks. (tradução do autor)

¹³ Standish Group, CHAOS Report 2018. Decision Latency Theory: correlação entre a velocidade de tomada de decisões e o êxito dos projetos. (tradução do autor)

¹⁴ Shelley, Mary. *Frankenstein, or The Modern Prometheus* (1818). Capítulo 5. Momento de reanimação do ser: «by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open… the beauty of the dream vanished, and breathless horror and disgust filled my heart». A célebre frase cinematográfica «It's alive!» — do filme de James Whale de 1931, não do romance de Shelley. (tradução e nota do autor)

¹⁵ Afirmação típica de representantes corporativos na fase de negação — generalização baseada no padrão. (ilustração do autor)

¹⁶ Nokia Corporation. Declarações oficiais 2007–2010 — generalização da comunicação corporativa. (ilustração do autor)

¹⁷ CMS/Healthcare.gov. Declarações oficiais outubro de 2013 — generalização da comunicação em crise. (ilustração do autor)

¹⁸ Shelley, Mary. *Frankenstein, or The Modern Prometheus* (1818). Pensamentos de Victor após a fuga. (tradução do autor)

¹⁹ Formulação típica de transferência de responsabilidade corporativa. (ilustração do autor)

²⁰ FBI. Posição oficial sobre o fracasso do Virtual Case File. (generalização do autor)

²¹ BBC. Posição oficial sobre a DMI. (generalização do autor)

²² Shelley, Mary. *Frankenstein, or The Modern Prometheus* (1818). Atitude de Victor perante a criação. (tradução do autor)

²³ Formulação típica de negociação corporativa em fase de crise. (ilustração do autor)

²⁴ Fase de depressão no ciclo corporativo do luto. (ilustração do autor)

²⁵ Fase de aceitação no ciclo corporativo do luto. (ilustração do autor)

²⁶ Eric Ries. *The Lean Startup* (2011). Princípio de aprendizagem rápida através de fracassos. (tradução do autor)

²⁷ Observação do autor — antipadrão corporativo em grandes fracassos. (ilustração do autor)

²⁸ Shelley, Mary. *Frankenstein, or The Modern Prometheus* (1818). Pergunta do ser ao criador. (tradução do autor)
