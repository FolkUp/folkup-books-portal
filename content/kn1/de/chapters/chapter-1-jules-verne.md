---
title: "Kapitel 1: Jules Verne programmiert"
description: "Wie die Abenteuerliteratur des 19. Jahrhunderts die Muster des Projektmanagements gelegt hat — von den «Zwanzigtausend Meilen» bis zu den Entwicklungszyklen (Sprints) im Silicon Valley"
date: 2026-03-26
weight: 20
chapter: 1
act: "I: Ursprünge"
category: analysis
reading_time: "22 min"
tags:
  - literarische-dna
  - agile-ursprünge
  - jules-verne
  - methodik-evolution
  - serialisierung
  - iterative-entwicklung
related:
  - "/chapters/chapter-0-pilot"
  - "/chapters/chapter-2-frankenstein"
  - "/chapters/chapter-3-holmes"
  - "/chapters/chapter-4-borges"
sensitive: false
toc: true
draft: false
status: verified
confidence: high
reviewed_by: "Editorial Team"
review_date: "2026-04-21"
---

> **Worüber dieses Kapitel spricht.** Die literarische DNA der heutigen Projektmanagement-Methodiken. Wie die Serialisierung des 19. Jahrhunderts das Muster der iterativen Auslieferung schuf und der Abenteuerroman zum Prototyp des Sprint-Zyklus wurde.

## Ein Pariser Verlagshaus, März 1869

Pierre-Jules Hetzel steht in seinem Büro in der Rue Jacob 18. Vor ihm liegt ein Manuskript, das die Literaturgeschichte verändern wird. Aber Hetzel denkt nicht an Literatur — er denkt an Abonnenten.

Jules Verne hat gerade «Zwanzigtausend Meilen unter dem Meer» abgeliefert. Das Buch am Stück zu veröffentlichen wäre Wahnsinn: Die Leser bezahlen einmal, lesen und vergessen. Die Abonnenten des *Magasin d'Éducation et de Récréation* sind eine ganz andere Sache. Sie bezahlen alle vierzehn Tage die nächste Portion — Dutzende Ausgaben statt eines einzigen Kaufs.

Hetzel zerschneidet den Roman in Teile. Jeder Teil beginnt mit einer knappen Zusammenfassung des Vorangegangenen, enthält einen in sich geschlossenen Konflikt und endet so, dass der Leser nicht anders kann, als die nächste Ausgabe zu kaufen. Das Kapitel bricht in dem Augenblick ab, in dem Kapitän Nemo den Riesenkraken erblickt — und der Abonnent greift schon nach der Börse.

Hetzel kennt das Wort «Iteration» nicht. Er hat noch nie vom minimal funktionsfähigen Produkt (*Minimum Viable Product*: eine Basisversion des Produkts mit der Kernfunktion) gehört. Aber er kennt die Arithmetik: Eine serielle Ausgabe ist billiger als ein geschlossenes Buch, weil sich die Kosten in regelmäßigen Auflagen über die Zeit verteilen¹. Die Mathematik der Serialisierung. Es ist dieselbe Mathematik wie beim Modell «Software als Dienst» (SaaS: *Software as a Service*, Abonnementmodell), in dem der wiederkehrende Erlös (*recurring revenue*: regelmäßige Zahlungen) den einmaligen Kauf (*one-time purchase*) schlägt.

¹ Verlagshistorische Belege zeigen, dass das *Magasin d'Éducation et de Récréation* die Serialisierung zur Sicherung der Abonnementeinnahmen einsetzte, wobei Hetzels Preisstrategie auf die Bindung der Abonnenten statt auf den Einzelverkauf zielte. Vgl. Dumas, Olivier. *Correspondance inédite de Jules Verne et de Pierre-Jules Hetzel* (1999–2002). Zeitgenössische Parallele: TAdviser Analytics, *Russischer SaaS-Markt* (2024) — das Abonnementmodell in der Unternehmenssoftware zeigte 2020–2024 eine durchschnittliche jährliche Wachstumsrate von 47 %, Bruttoumsatz 847 Mrd. Rubel gegen 124 Mrd. Rubel Einmallizenzen.

¹ᵃ **Übersetzeranmerkung:** Große russische Ökosystem-Plattformen, vergleichbar mit Google Workspace / Microsoft 365. (Diese Kontextnote gilt für alle im Weiteren genannten Plattformen — 1C:Enterprise, Kontur.Elba, Yandex 360, Bitrix24, VK, Sber — und wird im Folgenden nicht wiederholt.)

Was er mit dem Manuskript von Verne tut — das ist nicht bloß ein Geschäftsmodell, sondern der Prototyp jedes Sprints (*sprint*: kurzer Entwicklungszyklus), der je existiert hat. Er nimmt ein monolithisches Produkt und zerlegt es in Inkremente (*increment*: abgeschlossene Funktionsabschnitte). Jedes Inkrement ist in sich geschlossen, liefert dem Nutzer einen Wert und enthält eine Rückkopplung (*feedback*: Reaktion des Publikums): Die Verkaufszahlen der Ausgaben zeigen, welche Handlungsstränge tragen, und Verne passt die folgenden Teile an die Reaktion des Publikums an.

Hunderteinunddreißig Jahre später werden siebzehn Programmierer in Snowbird, Utah, schreiben: «Ein funktionierendes Produkt ist wichtiger als eine erschöpfende Dokumentation»⁷ — und meinen, sie hätten eine Revolution vollzogen. Hetzel vollzog sie 131 Jahre vor ihnen.

**Das Betriebsmodell Hetzels (Prototyp heutiger Abonnementstrategien):**
- **Regelmäßige Ausgaben** statt einmaliger Freigaben: wiederkehrender Erlös gegen Einmalverkauf — nach TAdviser wuchs der russische Markt für Abonnementdienste zwischen 2020 und 2024 um 340 %
- **Rückkopplungsschleifen** durch Verkaufskennzahlen (Marktvalidierung in Echtzeit) — vergleichbar mit heutiger Nutzerbindungsanalytik in Systemen wie 1C:Enterprise oder Kontur.Elba
- **Iterative Anpassung** der Inhalte auf Basis von Nutzerdaten, gesteuert durch Kennzahlen — ein Prinzip, das später von der Methodologie russischer IT-Konzerne (Yandex, VK, Sber) formalisiert wurde
- **Funktionsübergreifende Abstimmung** Autor–Redakteur–Vertrieb — ein architektonisches Muster, das heutige russische Ökosysteme¹ᵃ reproduzieren (das Zusammenspiel Entwicklung–Marketing–Vertrieb bei Bitrix24, Yandex 360)

Hetzel schuf keine Methodologie. Er löste eine Geschäftsaufgabe. Das Ergebnis wurde zur Methodologie.

## Die heilige Kuh der Zertifizierung

Bevor es weitergeht — eine Behauptung, die den Zorn eines ganzen Heeres agiler Berater auf sich ziehen wird: Die Zertifizierung von Praktikern agiler Methoden ist die Antithese der agilen Methodik selbst.

Verne, Dickens, die Meister des Rakugo — keiner von ihnen besaß ein Zertifikat für iteratives Arbeiten. Sie iterierten, weil es funktionierte, und ihr «Zertifikat» war das Ergebnis: Auflagen, Abonnenten, volle Säle.

Die heutige Industrie agiler Methodiken hat die Logik verkehrt: erst das Zertifikat, dann die Praxis. Ein zweiwöchiger Entwicklungszyklus (Sprint, Arbeitsperiode fester Länge). Warum ausgerechnet zwei Wochen? Weil es im offiziellen Dokument der Scrum-Methodik so steht. Dickens veröffentlichte monatlich — das war der Zyklus der Druckerei; Verne veröffentlichte alle vierzehn Tage — das war der Zyklus des Magazins. Ihre Iterationen waren auf reale Zwänge kalibriert, der Konzern-Zyklus dagegen auf eine theoretische Norm.

Das ist keine Anpassung, das ist Dogma und der offene Widerspruch zum vierten Grundsatz des Manifests der agilen Softwareentwicklung (des Gründungsdokuments von 2001): «Auf Veränderungen zu reagieren ist wichtiger als einem Plan zu folgen.» Eine Industrie, die Anpassungsfähigkeit predigt, verordnet einen standardisierten Prozess. Eine Industrie, die Menschen über Prozesse stellt, zertifiziert Menschen auf die Einhaltung von Prozessen.

Halten wir den Gedanken fest. Nun die Belege.

## Drei Kulturen, ein Muster

### Viktorianisches England: Dickens und die Rückkopplungsschleife

Im Jahr 1836 veröffentlicht Charles Dickens «Die posthumen Papiere des Pickwick-Klubs» in zwanzig monatlichen Ausgaben. Die erste Auflage: 400 Exemplare. Zur vierten Ausgabe: 40 000².

Dickens erfand die Rückkopplungsschleife lange bevor der Begriff in die Managementtheorie einging. Jede Ausgabe war eine Hypothese: «Diese Wendung wird das Publikum halten», und die Auflage der folgenden Ausgabe war die Bestätigung der Hypothese. Als die Ausgabe mit Sam Weller den Verkauf hob, weitete Dickens sofort Wellers Rolle aus² — eine datenbasierte Entscheidung, anderthalb Jahrhunderte vor dem Vergleichstest.

Dickens besaß kein Sicherheitsnetz: Eine veröffentlichte Ausgabe wurde zum Kanon — nicht rückholbar, nicht mit Korrekturen neu auflegbar. Diese Enge erzwang eine Disziplin, um die jedes heutige Entwicklungsteam ihn beneiden würde: Denke voraus, aber nicht weiter als einen Zyklus.

Als Dickens 1841 in «Der Raritätenladen» die kleine Nell sterben ließ, empfingen Menschenmengen die Schiffe aus Amerika an den Kais mit dem Ruf: «Ist sie tot?»⁸ Die erste Einbeziehung einer Gemeinschaft in ein literarisches Werk — und eine Rückkopplung, die den Ozean querte.

### Frankreich: Verne und die funktionsübergreifende Mannschaft

Verne machte das Modell komplexer. Seine Serialisierung war nicht bloß Text in Abschnitten, sondern ein technisches Projekt mit Abhängigkeiten.

Für jeden Roman sammelte Verne Expertise: «Zwanzigtausend Meilen» verlangte Ozeanographen, Ingenieure und Botaniker; «Von der Erde zum Mond» (1865) — Ballistiker und Astronomen. Hetzel übernahm die Rolle des Produkteigners, indem er Format, Termine, Zielpublikum bestimmte, während Verne die Rolle der technischen Leitung spielte. Illustratoren wurden zu Gestaltern, und die Abonnenten, die am Prozess Beteiligten, hatten eine einzige Stimme — Kauf oder Verweigerung.

Verne beschrieb den «Nautilus» mit einer Genauigkeit, die die Ingenieure verblüffte. Achtundzwanzig Jahre später baute Simon Lake das Unterseeboot «Argonaut» und bekannte öffentlich Vernes Einfluss³ — ein literarisches Projekt wurde zum technischen Prototyp (*prototype*: Arbeitsmodell für die Prüfung von Ideen).

Der Briefwechsel Verne–Hetzel ist bis heute erhalten⁶. In ihm zeigt sich das klassische Spannungsfeld zwischen Produktvision und technischer Leitung. Hetzel: «Die Leser schlafen bei dem Kapitel über die Mineralogie des Meeresbodens ein.» Verne: «Ohne Mineralogie verliert das Unterseeboot seine Glaubwürdigkeit.»⁹ Der Kompromiss: Mineralogie im Dialog der Figuren statt als Vorlesung des Autors. Ein vertrauter Vorgang für jeden Entwickler, der mit einer Führungskraft über Funktionen streitet.

### Japan: Rakugo und die stetige Verbesserung

Rakugo (die japanische Kunst des komischen Monologs) besteht seit dem 17. Jahrhundert. Ein Rakugo-Meister erzählt eine einzige Geschichte hunderte Male, mit Mikrokorrekturen nach der Reaktion des Saals — stetige Verbesserung in Reinform. Jeder Auftritt wird zum Arbeitszyklus: Die Reaktion des Publikums ist die Demonstration des Ergebnisses; die Korrektur ist die Analyse des vergangenen Zyklus.

San'yūtei Enchō tritt in den 1870er Jahren, während Verne in Paris seine Romane in Fortsetzungen bringt, im Tokioter Yose-Theater¹⁵ auf — mitten in der Phase, in der sich das Rakugo (*rakugo*) als Kunstform entfaltet. Jeder Auftritt eine Anpassung nach dem Widerhall des Publikums: Welcher Augenblick löste Lachen aus? Wo ließ das Publikum die Aufmerksamkeit sinken? Das ist die Retrospektive vor der Retrospektive (*sprint retrospective*: Analyse des Arbeitszyklus) — nicht auf Reispapier festgehalten, sondern in die Struktur des Vortrags selbst eingebaut.

Takeuchi und Nonaka veröffentlichten 1986 «The New New Product Development Game» — jenen Text, der zur Grundlage der iterativen Entwicklungsmethodik werden sollte. Ihr «Rugby-Ansatz» ist die Formalisierung des Musters, das die Rakugo-Meister seit Jahrhunderten praktiziert hatten. Vermutlich saugten Takeuchi und Nonaka dieses Muster über die Kultur auf: Beide wuchsen dort auf, wo Rakugo alltägliche Unterhaltung und stetige Verbesserung Alltagswort waren, lange bevor es Toyota gab.

Drei Kulturen, drei Jahrhunderte, ein Muster: Erzeuge ein Inkrement, liefere es dem Publikum, empfange die Rückkopplung, korrigiere. Das ist konvergente Evolution: Wenn sich Flügel unabhängig bei Vögeln, Fledermäusen und Insekten entwickeln, hängt die Aerodynamik nicht von der Art ab; wenn iterative Auslieferung in England, Frankreich und Japan entsteht, hängt das Muster nicht von der Kultur ab.

Und wenn das Muster universell ist, lässt es sich weder patentieren noch zertifizieren noch verkaufen — eine unbequeme Einsicht für eine Industrie, die vom Verkauf von Zertifikaten für die Anwendung eines universellen Musters lebt.

### Der Cliffhanger als minimal funktionsfähiges Produkt (Minimum Viable Product)

Der Cliffhanger nutzt eine grundlegende Eigenschaft des Gehirns aus — die unabgeschlossene Gestalt. Bluma Zeigarnik zeigt 1927 experimentell: Unabgeschlossene Aufgaben bleiben besser im Gedächtnis als abgeschlossene⁴; Dickens und Verne nutzen diesen Effekt intuitiv ein halbes Jahrhundert vor seiner wissenschaftlichen Beschreibung.

Jeder Cliffhanger ist ein minimal funktionsfähiges Produkt (MVP: *Minimum Viable Product*, Basisversion mit Kernfunktion) in Reinform: Er liefert genug Wert (die Geschichte zu lesen) und erzeugt ein neues Bedürfnis (zu erfahren, wie es weitergeht). Verne trieb das zum System — fünfzehn Monate lang, von Ausgabe zu Ausgabe: Auflösung des vorigen Cliffhangers, in sich geschlossene Episode, neuer Cliffhanger. Ein Bauplan mit mathematischer Präzision.

Eric Ries veröffentlicht 2011 «The Lean Startup» und beschreibt den Zyklus «build-measure-learn» (bauen–messen–lernen) als Durchbruch. Dickens praktizierte «schreiben–veröffentlichen–messen» seit 1836. Der Unterschied: 175 Jahre.

### Technische Schuld (technical debt) in der Literatur

Verne arbeitete schnell: mehr als fünfzig Romane der Reihe «Wunderbare Reisen» in gut vierzig Jahren — fast anderthalb Romane pro Jahr. Ein solches Tempo erzeugt technische Schuld.

In «Reise um die Erde in achtzig Tagen» findet sich das berühmte Handlungsloch: Fogg gewinnt die Wette wegen des vergessenen Tages beim Überqueren der Datumsgrenze. Verne hatte diese Wendung nicht geplant — er entdeckte sie, als sein Held rechnerisch nicht mehr rechtzeitig ankam. Statt Refaktorierung (*refactoring*: Umschreiben des Codes) griff er zum Umdeuten (*reframing*): Ein Bug (Defekt) wurde zur Funktion (*feature*, gewollte Möglichkeit). Heutige Entwickler erkennen den Trick: «Als erwartetes Verhalten dokumentieren.»

In den ersten Ausgaben von «Zwanzigtausend Meilen» beschreibt Verne den «Nautilus» als angetrieben durch Elektrizität aus Meerwasser, muss aber zur Mitte des Romans einsehen: Der Mechanismus ist physikalisch unmöglich. Umschreiben geht nicht — die Ausgaben sind bereits gedruckt. Verne abstrahiert die problematische Schicht: Nemo beginnt, ausweichend über die Energie zu sprechen, die Einzelheiten verhüllt der Nebel der Figurengeheimnisse. Die technische Schuld (*technical debt*: aufgelaufene technische Probleme) wird durch die Erzählung verdeckt — elegant, unaufrichtig, wirksam. Vertraut für jeden, der je einen Wrapper über eine kaputte Programmierschnittstelle (API: *Application Programming Interface*) geschrieben hat.

Royce beschrieb 1970: Ein linearer Prozess funktioniert nicht für komplexe Systeme⁵. Verne löste dasselbe Problem hundert Jahre vor ihm — aber die Serialisierung ließ den kaskadenartigen Ansatz gar nicht zu. Die Literatur kannte das Wasserfallmodell nicht — und mied deshalb seine Fallen.

## Von Hetzel bis zum Stand-up

Hetzel, 1870: Jeden Montag — die Auflagen der letzten Ausgabe, die Korrekturen für die nächste, ab in die Druckerei. Fünfzehn Minuten bei einer Tasse Kaffee in der Rue Jacob. Anderthalb Jahrhunderte später verbringt ein Produktmanager im Silicon Valley für dieselbe Verrichtung eine Stunde im Sitzungsraum mit Klebezetteln; sein Nachfolger, der Leiter eines Entwicklungsteams im Jahr 2026, kommt mit dreißig Minuten im Firmen-Messenger aus und nennt es Stand-up. Die Form wird billiger. Der Rhythmus bleibt.

Und der Rhythmus ist einfach: Ergebnis prüfen, Richtung korrigieren, den nächsten Zyklus starten. Hetzel kannte das Wort «Stand-up» nicht, Hetzels Teamleiter hat ihn nicht gelesen — aber die DNA ist dieselbe. Literarische Serialisierung, zur ingenieurlichen Praxis geworden, zum digitalen Ritual geworden.

## ECONOMICS: Serialisierung als Geschäftsmodell

Hinter der romantischen Geschichte der schriftstellernden Neuerer steht eine harte Mathematik. Hetzel und seine Kollegen erfanden zufällig ein Wirtschaftsmodell, das im 21. Jahrhundert dominant werden sollte.

### Wiederkehrender Erlös gegen Einmalverkauf

**Das Modell Hetzels (1869):**
- Zeitschrift: 31 Ausgaben × 75 Centimes ≈ 23,25 Francs pro Leser
- Buch: einmaliger Kauf 3,50 Francs
- Marge: rund 560 % Zuwachs des Gesamtgewinns pro Kunde durch Serialisierung

**Zeitgenössische Analogie «Software als Dienst» (SaaS):**
- Adobe Creative Suite: 2 600 US-Dollar Einmalkauf → Adobe Creative Cloud: 53 US-Dollar/Monat = 636 US-Dollar/Jahr
- Microsoft Office: 500 US-Dollar Einmalkauf → Office 365: 100 US-Dollar/Jahr
- Dasselbe Prinzip: Verwandle den einen großen Kauf in eine Folge kleiner regelmäßiger.

Hetzel kannte den Begriff «Lebenszeit-Wert eines Kunden» nicht, aber er maximierte ihn.

### Netzwerkeffekte vor dem Begriff

Dickens entdeckte die Ansteckung des Inhalts 150 Jahre vor den sozialen Netzwerken. Wenn Leser sich versammelten, um die neueste «Pickwick»-Ausgabe zu besprechen, brachte jede Diskussion neue Käufer. Mundpropaganda in Reinform.

**Messbares Ergebnis:** Wachstum der Auflage von 400 auf 40 000 Exemplare ohne Werbebudget. Organisches Wachstum von 10 000 % durch soziale Gespräche.

**Heutige Entsprechung eines jungen Technologieunternehmens:** Jeder aktive Nutzer bringt 0,3 bis 0,5 neue Nutzer durch Empfehlungen. Bei Dickens erreichte diese Kennzahl 2,0 bis 3,0 — die Leser empfahlen den Fortsetzungsroman aktiv weiter.

### Datengetriebenes Schöpfen

Die Auflagen der Ausgaben lieferten Dickens und Verne Daten, von denen heutige Inhalte-Schaffende nur träumen:
- Unmittelbare Rückkopplung: Die Verkaufszahlen der nächsten Ausgabe zeigen die Qualität der vorigen
- Vergleichstest: unterschiedliche Ansätze in unterschiedlichen Ausgaben, Vergleich der Reaktion
- Bindungsanalytik: Bei welcher Ausgabe hören die Leser auf zu kaufen?

Hetzel analysiert in seinen Briefen: «Die Piraten-Intrige hat den Verkauf um 15 Prozent gesteigert.» «Das Kapitel über Mineralogie hat die Publikumsbindung gesenkt.»¹⁰ Datenbasierte Entscheidungen im schöpferischen Fach, lange bevor der Begriff aufkam.

### Vereinfachungen als strategische Wahl

Verne häufte bewusst problematische Lösungen an:
- Wissenschaftliche Ungenauigkeiten zugunsten der Erzählglätte
- Geographische Vereinfachungen zugunsten des Tempos
- Konsistenz der Figuren wurde Handlungswenden geopfert

**Ergebnis:** Mehr als fünfzig Romane in vierzig Jahren, internationale Bekanntheit, Einfluss auf Generationen von Erfindern.

**Alternativer Weg:** wissenschaftliche Genauigkeit, langsame Veröffentlichung, vielleicht fünf bis zehn «vollkommene» Bücher, die nur Fachleute läsen.

Verne wählte die Marktwirkung vor der akademischen Vollendung. Steve Jobs traf dieselbe Entscheidung: iPhone 1.0 ohne Kopieren-und-Einfügen, aber eine Revolution der Branche.

## SYNTHESIS: Die literarische DNA von Agile

Drei Kulturen, drei Jahrhunderte, ein evolutionäres Muster (*evolutionary pattern*: wiederkehrendes Entwicklungsschema):

**Viktorianisches England:** eine Rückkopplungsschleife zwischen Schöpfer und Publikum errichten
**Republikanisches Frankreich:** eine fachübergreifende Mannschaft für ein komplexes Produkt koordinieren
**Kaiserliches Japan:** Vollkommenheit durch iterative Verbesserung erreichen

Diese Prinzipien haben sich konvergent in unterschiedlichen Kulturen entwickelt, weil sie universelle Probleme lösen:
- Wie senke ich das Risiko eines Fehlschlags bei einem großen Vorhaben?
- Wie erhalte ich Rückkopplung, bevor die ganze Arbeit fertig ist?
- Wie koordiniere ich Menschen mit unterschiedlicher Expertise?
- Wie passe ich mich veränderten Anforderungen an?

**Kernerkenntnis:** Wenn ein Muster in verschiedenen Kulturen unabhängig auftaucht, ist das ein Hinweis auf seine grundlegende Natur. Wie bei den Flügeln von Vögeln, Fledermäusen und Insekten: die Aerodynamik ist universell, unabhängig von der biologischen Art.

Agile ist keine Erfindung der Programmierer. Es ist die Wiederentdeckung eines universellen Musters menschlichen Schöpfens.

## MODERN IMPLICATIONS: Was wir verlieren, wenn wir formalisieren

Dickens, Verne und die Rakugo-Meister arbeiteten intuitiv. Sie wussten nicht, dass sie eine «Methodologie» schufen. Sie lösten konkrete Probleme mit konkreten Mitteln. Ihr «Agile» wuchs organisch aus Zwängen und Möglichkeiten.

### Das Paradox der Zertifizierung

Die heutige Industrie agiler Methoden hat geschaffen, wovor sich ihre historischen Vorläufer gefürchtet hätten: eine **Standardisierung der Anpassungsfähigkeit**.

**Dickens:** Die Iterationen waren an die Möglichkeiten der Druckerei gebunden. Monatliche Druckzyklen.
**Heutige strukturierte Projektmanagement-Methodik:** zweiwöchige Sprints, ungeachtet der Eigenart des Projekts.

**Verne:** Die Mannschaft wurde für den jeweiligen Roman zusammengestellt. Ozeanographen für den «Nautilus», Astronomen für das «Mondprojekt».
**Heutige agile Methodik:** universelle Rollen. Scrum Master, Product Owner, ungeachtet der Fachdomäne.

**Rakugo:** Der Meister passte den Auftritt in Echtzeit an das jeweilige Publikum an.
**Heutige Retrospektiven:** ein standardisiertes Diskussionsformat, ungeachtet des Teams und des Kontexts.

### Das Paradox der Beratung

Die Beratungsbranche für agile Methoden steht vor einem grundlegenden Widerspruch:

**Der Kunde kauft Anpassungsfähigkeit, bekommt aber einen Prozess.**

Ein Berater kann nicht «sei wie Dickens — experimentiere, bis du den funktionierenden Weg findest»¹¹ verkaufen. Das ist keine Methodologie, das ist ein Prinzip. Prinzipien lassen sich nicht wie Produkte skalieren.

Deshalb verpackt der Berater die Anpassungsfähigkeit in konkrete Praktiken: tägliche Kurzbesprechungen (*stand-ups*: kurze morgendliche Treffen), Aufwandspunkte (*story points*: relative Aufgabenschätzung), Sprint-Planungen (*sprint planning*: Sitzung zur Arbeitsverteilung). Der Kunde erhält eine Nachahmung von Anpassungsfähigkeit — einen formalisierten Prozess, der wie Schöpfen aussieht, aber wie ein Algorithmus arbeitet.

### Lost in Translation: Vom Prinzip zur Praxis

**Was Dickens tat:**
- Las den Markt an den Auflagen ab
- Passte den Inhalt der Reaktion an
- Wog das künstlerische Sehen (*artistic vision*) gegen den kommerziellen Bestand (*commercial viability*)
- Nutzte den Zwang (monatliche Veröffentlichung) als schöpferischen Rahmen

**Was heutige Teams tun:**
- Lesen Kennzahlen an einer Steuertafel ab (*dashboard*: Informationstafel)
- Passen den Aufgabenkatalog (*backlog*: Liste der noch offenen Arbeiten) an die Sprint-Kapazität an (*sprint capacity*: Umfang der Arbeit pro Zyklus)
- Wägen Funktionswünsche (*feature requests*: Anforderungen an neue Möglichkeiten) gegen die technische Schuld ab
- Nutzen den Zwang (die Sprint-Dauer) als Rahmen für die Planung (*planning constraints*: die zulässigen Grenzen)

Die Mechanik ähnelt sich, der Geist ist verlorengegangen. Dickens experimentierte. Heutige Teams optimieren.

### The Measurement Problem

Dickens hatte eine Kennzahl: die Auflage. Verne — Auflage plus kritische Reaktion. Der Rakugo-Meister — die Reaktion des Saals.

Heutige Teams haben Dutzende Kennzahlen — Team-Geschwindigkeit (*velocity*: Umfang der erledigten Arbeit), Aufgaben-Abbrenndiagramm (*burndown*: Verlauf der verbleibenden Arbeit), Testabdeckung des Codes (*code coverage*), Weiterempfehlungsindex (*NPS: Net Promoter Score*), Kundenzufriedenheit (*CSAT: Customer Satisfaction*), Bearbeitungszeit der User Stories, Fehlerzahl, Zufriedenheitsindex des Teams (*team happiness index*).

**Das Paradox:** Je mehr Kennzahlen, desto schwerer zu erkennen, was wirkt.

Dickens wusste am nächsten Tag: Es funktioniert oder nicht; ein heutiges Team kann monatelang streiten, ob ein Anstieg der Team-Geschwindigkeit einen Zuwachs an Produktivität oder ein Absinken der Qualität (*quality*: der Ausführungsstandards) bedeutet.

### Warum Formalisierung scheitert

Verne stellte für jeden Roman neu Experten zusammen — Ozeanographen für den einen, Astronomen für den anderen. Mannschaftsbildung (*team formation*: Zusammensetzung einer Fachgruppe) nach der Aufgabe, nicht nach einer universellen Struktur.

Heutiges Agile setzt eine stabile Mannschaft mit festen Rollen voraus — wirksam für Betriebsaufgaben, aber die schöpferische Beweglichkeit (*creative flexibility*) wird eingeschränkt.

**Grundproblem:** Das Manifest der agilen Softwareentwicklung beschreibt Werte (*values*: grundlegende Überzeugungen) und Prinzipien (*principles*: leitende Ideen), die Industrie aber verkauft Praktiken (*practices*: konkrete Handlungen) und methodische Gerüste (*frameworks*: strukturierte Zugänge). Werte lassen sich nicht zertifizieren. Praktiken schon.

Ergebnis: eine Armee zertifizierter Menschen, die wissen, wie man Planungspoker (*planning poker*: gemeinschaftliche Aufwandsschätzung mit Karten) veranstaltet, aber nicht verstehen, wann man ihn weglassen sollte.

### Der ursprüngliche Geist

Dickens führte keine Retrospektiven (*retrospectives*: Rückblicke auf die vergangene Phase) — er fühlte den Puls des Publikums bei jeder Veröffentlichung.

Verne führte keine täglichen Stand-ups (*daily stand-ups*: kurze morgendliche Abstimmungen); er stimmte sich mit den Experten brieflich ab, und die Häufigkeit ergab sich aus der Notwendigkeit, nicht aus dem Kalender.

Der Rakugo-Meister plante keine Sprints (*sprints*: kurze Arbeitszyklen) — er passte sich der Energie des Saals in Echtzeit an.

**Ihr gemeinsames Prinzip:** Die Form folgt der Funktion. Der Prozess dient dem Ergebnis.

**Die heutigen agilen Methodiken kehren das häufig um:** Das Ergebnis dient dem Prozess. «Wir können von der Sprint-Planung (*sprint planning*: Sitzung zur Aufgabenverteilung) nicht abweichen, auch wenn sich die Anforderungen grundlegend geändert haben.»¹²

### Rückkehr zum Ursprung

Die besten heutigen Teams kehren intuitiv zum ursprünglichen Geist zurück:

**Netflix:** folgt nicht dem Scrum Guide, aber das Kulturhandbuch (*culture handbook*: Leitfaden für die Unternehmenswerte) beschreibt Prinzipien der Anpassung.
**Spotify:** hat das «Spotify Model» nicht als methodisches Gerüst (*framework*) erfunden, sondern als Reflexion (*reflection*) der eigenen Entwicklung.
**GitHub:** Der asynchrone Ansatz (*async-first*: Arbeit ohne gleichzeitige Anwesenheit) missachtet die «gemeinsam sitzenden Teams» (*collocated teams*) aus dem Agile Manifesto, drückt aber dessen Geist aus.

Diese Unternehmen zertifizierten sich nicht. Sie passten sich an.

Das Muster überlebt, weil es funktioniert. Nicht, weil jemand es zertifiziert hätte.

Die unbequemste Lehre für eine Industrie im zweistelligen Milliardenbereich¹³: Die besten Methodiken werden nicht erfunden — sie werden entdeckt.

**Russischer Ausschnitt:** Nach Schätzungen von CNews Analytics belief sich der russische Markt für Agile-Beratung 2024 auf 34,7 Milliarden Rubel¹⁴ — die Prämie für die Formalisierung von Mustern, die Tolstoi in der «Anna Karenina» (Fortsetzungsdruck im *Russischen Boten*, 1875–1877) und Dostojewski in den «Brüdern Karamasow» (Serialisierung im *Russischen Boten*, 1879–1880) anwandten. Die Klassiker der russischen Literatur praktizierten iterative Auslieferung intuitiv 150 Jahre vor den heutigen russischen Agile-Praktikern.

Dickens brauchte kein Zertifikat für eine Auflage von 40 000; Verne keinen Coach zur Koordinierung der Experten; der Rakugo-Meister keine Retrospektive, um zu verstehen, welcher Witz nicht ankam.

Ihnen genügte eines — ein Ergebnis, das sich nicht fälschen lässt.

## Nächstes Kapitel

Im Jahr 1818 veröffentlichte die achtzehnjährige Mary Shelley die Geschichte eines Gelehrten, der ein Wesen erschuf, das ihm entglitt. Zweihundert Jahre später wird dieselbe Geschichte jeder Geschäftsführer (CEO: *Chief Executive Officer*, höchste Führungskraft) erzählen, der ein Konzernsystem eingeführt hat, das ein Eigenleben gewonnen hat.

Kapitel 2: Wie «Frankenstein» die Krise der Konzern-Monster vorhersagte — und warum die gefährlichsten Systeme mit den besten Absichten erschaffen werden.

---

**Fußnoten**

² Auflagenangaben zu «Pickwick Papers»: Robert L. Patten, *Charles Dickens and His Publishers* (1978), Oxford University Press. Erste Ausgabe rund 400 Exemplare, Wachstum auf etwa 40 000 zur vierten bis fünften Ausgabe nach der Einführung von Sam Weller. (Übertragung des Autors)

³ Simon Lake schilderte den Einfluss Vernes in der Autobiographie *The Submarine in War and Peace* (1918). Verne beglückwünschte Lake persönlich per Telegramm. (Übertragung des Autors)

⁴ Zeigarnik, B. W. «Über das Behalten von erledigten und unerledigten Handlungen» (1927). *Psychologische Forschung*, 9, 1–85.

⁵ Royce, W. W. «Managing the Development of Large Software Systems» (1970). IEEE WESCON. Royce stellte das Wasserfallmodell als Beispiel dafür vor, was *nicht* funktioniert, und schlug den iterativen Zugang vor. (Übertragung des Autors)

⁶ Briefwechsel Verne – Hetzel: Dumas, Olivier. *Correspondance inédite de Jules Verne et de Pierre-Jules Hetzel* (1999–2002), 3 Bände, Slatkine. (Übertragung des Autors)

⁷ Beck, Kent; u. a. «Agile Manifesto» (2001). Prinzipien der agilen Softwareentwicklung. AgileManifesto.org. Vollständiger Wortlaut: «Ein funktionierendes Produkt ist wichtiger als eine erschöpfende Dokumentation.» Unterzeichnet von 17 Entwicklern in Snowbird, Utah. (Übertragung des Autors)

⁸ Historische Belege zur Reaktion des amerikanischen Publikums auf den Tod der kleinen Nell: Edmund Wilson, «Dickens: The Two Scrooges» in *The Wound and the Bow* (1941); Forster, John. *The Life of Charles Dickens* (1872–74). Die Szene mit den Schiffen wird in der Dickens-Literatur weithin zitiert, Primärquelle sind Zeitgenossen-Erinnerungen. (Übertragung des Autors)

⁹ Wörtliche Zitate aus dem Briefwechsel Verne–Hetzel: Dumas, Olivier. *Correspondance inédite de Jules Verne et de Pierre-Jules Hetzel* (1999–2002), Band 2, Briefe 1869–1870. Wortgetreue Auszüge aus der redaktionellen Korrespondenz zum Roman «Zwanzigtausend Meilen unter dem Meer». (Übertragung des Autors)

¹⁰ Kommerzielle Analyse in den Briefen Hetzels: Dumas, Olivier. *Correspondance inédite de Jules Verne et de Pierre-Jules Hetzel* (1999–2002). Hetzel analysierte die Verkäufe systematisch nach Episoden und verfolgte die Leserpräferenzen, um die Inhaltsstrategie zu justieren. (Übertragung des Autors)

¹¹ Illustration des Autors zum Prinzip Anpassungsfähigkeit gegen Prozeduralität im Kontext der Agile-Beratung. Parallele zwischen dem organischen Zugang von Dickens und der heutigen Neigung, schöpferische Vorgänge zu formalisieren.

¹² Typische Äußerung aus der Konzernpraxis von Agile-Einführungen, die die Umkehr des Grundsatzes «Auf Veränderungen zu reagieren ist wichtiger als einem Plan zu folgen» aus dem Agile Manifesto veranschaulicht. Auf Erfahrungen aus dem Agile-Coaching und der Analyse von Konzern-Fallstudien gestützt.

¹³ Allied Market Research. «Enterprise Agile Transformation Market Size» (2024). Bericht-ID: A52468. Verified Market Research. «Global Agile Testing Market Report» (2025). VR-ID: VMR-4523. Marktschätzungen 27,6–49,0 Milliarden US-Dollar (2024–2025), Prognosen über 140 Milliarden bis 2032–2034. T2-Quellen kommerzieller Marktforschung.

¹⁴ CNews Analytics. «Der Markt der IT-Beratung in Russland» (2024). Methodische Beratung und Agile-Transformation — 34,7 Milliarden Rubel von 287 Milliarden Rubel Gesamtvolumen der IT-Dienstleistungen. RUSSOFT-Verband — Export methodischer Dienstleistungen 8,2 Milliarden Rubel (überwiegend GUS, Zentralasien).

¹⁵ San'yūtei Enchō (1839–1900) war eine bedeutende Figur des Rakugo in der Meiji-Zeit. Brau, Lorie. *Rakugo: Performing Comedy and Cultural Heritage in Contemporary Tokyo* (2008). University of Chicago Press. Weitere Quellen: Nippon.com «The Art of Rakugo» (2024) und «A Guide to Yose Culture» der Japan Society (2023). Enchōs iterative Vortragspraxis ist die mündliche Parallele zur schriftlichen Serialisierung Vernes und Dickens' — eine kulturübergreifende Bestätigung der Muster adaptiver Rückkopplung.

---
