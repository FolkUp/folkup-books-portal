---
title: "Kapitel 4: Borges zählt Story Points"
description: "Wie Messungen, die Mannschaften beweglicher machen sollen, zur Lotterie werden: vom Spotify Model bis zum OKR-Theater, vom Velocity Gaming bis zum retrospektiven Ritual"
date: 2026-03-28
weight: 50
chapter: 4
act: "I: Ursprünge"
category: analysis
reading_time: "22 min"
tags:
  - borges
  - messungs-paradox
  - agile-kennzahlen
  - spotify-model
  - safe-framework
  - okr-cargo-cult
  - velocity-gaming
  - goodhart-gesetz
  - organisationstheater
related:
  - "/chapters/chapter-0-pilot"
  - "/chapters/chapter-1-jules-verne"
  - "/chapters/chapter-2-frankenstein"
  - "/chapters/chapter-3-holmes"
  - "/chapters/chapter-5-nemo"
sensitive: false
toc: true
draft: false
status: verified
confidence: high
reviewed_by: "Editorial Team"
review_date: "2026-04-21"
---

> **Worüber dieses Kapitel spricht.** Das Paradox agiler Messungen. Wie Kennzahlen, die die Beweglichkeit erhöhen sollten, zur Lotterie werden — zu einem System, so verwickelt, dass niemand mehr weiß, weshalb es begonnen hat. Vom Spotify Model bis SAFe, vom OKR-Theater bis zum Velocity Gaming — die Anatomie des Messwahns.

## Sitzungszimmer Nr. 7, Sprint-Planung

Der Produktverantwortliche eines mobilen Bankings schaut auf die Tafel mit den Story Points und begreift: das System hat die Mannschaft aufgefressen.

Angefangen hatte es einfach. Vor zwei Jahren half die Velocity (*velocity*: Umfang der erledigten Arbeit im Zyklus) beim Planen — 35 Punkte pro Sprint, stabil, vorhersagbar. Jetzt hängen an der Wand vier Diagramme: Velocity nach Mannschaft, Story-Point-Inflation, Kapazitätsplanung, Burndown nach Epic. Die Planung frisst acht Stunden pro Sprint. Für die Entwicklung bleiben zweiunddreißig.

«Was, wenn 5 Punkte?», fragt ein Junior-Entwickler.
«Nein, das sind sicher 8», antwortet der Senior. «Erinnerst du dich an die API-Aufgabe vom letzten Sprint?»
«Welche genau?»
«Na … die komplizierte.»

Der Produktverantwortliche legt die Karten des Planning Poker um und denkt an Jorge Luis Borges.

Borges, 1941: In der Erzählung «Die Lotterie in Babylon» versinkt eine Gesellschaft in einem Spiel, das alle ihre Seiten verschlingt¹. Es begann einfach — Geldgewinne. Dann Strafen. Dann Ämter, Urteile, Ehen. Jede Ziehung brachte Verzweigungen hervor: Nebenlotterien, Lotterien zur Bestimmung der Regeln anderer Lotterien, Lotterien zum Aufheben der Ergebnisse.

Am Ende der Erzählung verdampfte die Grenze, als das ursprünglich als Zufall in der Ordnung gedachte System *zu dieser Ordnung selbst* wurde — das Werkzeug siegte endgültig über den eigenen Zweck.

Der Erzähler Borges' bekennt: Er weiß weder, wie viele Stockwerke die Lotterie hat, noch, welches ihm zugänglich ist. Das Nichtwissen ist hier kein Erinnerungsmangel, sondern ein Symptom eines Systems, das über die Verständnisfähigkeit seiner Teilnehmer hinausgewachsen ist.

Er kennt dieses Gefühl — er weiß nicht mehr, wozu die Mannschaft angefangen hat, Story Points zu zählen. Er weiß nur, dass es jetzt Pflicht ist — für Berichte, für Prognosen, für Kennzahlen. Siebzig Jahre vor der Erscheinung von SAFe hat Borges eine Konzernmethodik genauer beschrieben als jeder heutige Berater.

---

Holmes (Kap. 3) gab uns die Methode — sieben Anzeichen der Projektkrankheit; aber er arbeitet mit *Indizien*, ohne die grundsätzliche Frage zu stellen: *Was, wenn das Beobachtungswerkzeug selbst das Beobachtete verzerrt?*

Borges stellt diese Frage direkt und zeigt Babylon nicht als Chaos, sondern als *Ordnung, die zum Chaos herangewachsen ist* — dort, wo die Lotterie kein Zufall mehr ist, sondern eine Messung, die den Zusammenhang mit dem Gemessenen ganz verloren hat.

Das Kapitel stellt eine bestimmte Frage: Wie sind agile Kennzahlen — Velocity, Story Points, OKR, Burndown-Diagramme — Werkzeuge der Beweglichkeit — zur babylonischen Lotterie geworden? Zu einem System, in dem Mannschaften mehr Stunden für seine Pflege aufwenden als für die Herstellung des Produkts?

These: **Eine Messung, die die Beweglichkeit erhöhen soll, verringert sie unausweichlich, sobald sie zum Ziel wird.**

Charles Goodhart (1975) formulierte das Gesetz: Jede beobachtete statistische Gesetzmäßigkeit strebt danach, zu zerbrechen, sobald man auf sie zu Steuerungszwecken drückt². Zweiundzwanzig Jahre später prägte Marilyn Strathern denselben Gedanken zur kurzen Formel, die seither an Goodharts Stelle zitiert wird: «Wenn eine Kennzahl zum Ziel wird, ist sie keine gute Kennzahl mehr»³ — und zeigte, dass dies nicht nur die Wirtschaft betrifft, sondern die Bildung, das Gesundheitswesen, die Verwaltung.

Borges zeigte vierunddreißig Jahre vor Goodhart dieselbe Mechanik, nur nannte er sie Lotterie.

## Die Lotterie der Kennzahlen

### Geschwindigkeit der Mannschaftsarbeit (Velocity): erste Ziehung der Lotterie

Der Teamleiter eines Fintech-Startups erinnert sich, wie alles begann. Sommer 2022: eine Mannschaft von fünf Leuten, Velocity 30 Punkte — reine Arithmetik als inneres Werkzeug der Eichung. Wenn ein Sprint 30 Punkte umfasst, brauchen drei Funktionen drei Sprints. Einfach.

Das Problem: Die Lotterie in Babylon bleibt nicht einfach, und die Velocity — sie bleibt nicht innerlich.

**Herbst 2022 — erste Mutation.** Der Entwicklungsleiter sieht das Steuerpult (*dashboard*: Informationstafel): Mannschaft Frontend 40 Punkte, Mannschaft Backend 25 Punkte. Die Logik ist tadellos — Frontend ist wirksamer. Der Teamleiter versucht zu erklären: «Wir vergleichen Celsius mit Fahrenheit und erklären Amerika für heißer.» Der Leiter nickt und bittet Backend, «die Zahlen aufzuholen».

**Winter 2023 — zweite Mutation.** Velocity wird Teil der Abteilungskennzahlen. Der Teamleiter beobachtet, wie die Mannschaft beginnt, das System zu spielen: die Aufgabe «Anbindung an die Banking-Programmierschnittstelle» (3 Punkte) verwandelt sich in «Einrichten der Testumgebung» (2 Punkte) + «Schreiben des API-Klienten» (2 Punkte) + «Fehlerbehandlung» (1 Punkt). Velocity wächst von 30 auf 45, der Arbeitsumfang hat sich nicht geändert.

«Ausgezeichnete Entwicklung», sagt der Leiter in der Besprechung.
«Wir haben nichts beschleunigt», antwortet der Teamleiter.
«Die Zahlen sagen das Gegenteil.»

Punktinflation (*story point inflation*) — ein Standardproblem, festgehalten bei Scrum.org, Age of Product, LinearB u. a.⁴ Man las darüber in Blogs, doch persönlich zu erleben ist etwas anderes.

Borges fasste die Mechanik: «Mit der Ausdehnung der Lotterie geriet jede freie Handlung in ihre Sphäre.»¹ Velocity wuchs vom Werkzeug zur Sphäre, die jede Handlung der Mannschaft verschluckt. Die technische Entscheidung wurde zur politischen Handlung.

### Story Points: die Sprache, die den Sinn verloren hat

«Und was heißen 5 Punkte?», fragt der neue Entwickler bei seiner ersten Planungssitzung.
«Na, mehr als 3, aber weniger als 8», antwortet der Teamleiter.
«Und 8?»
«Eine schwierige Aufgabe. Erinnerst du dich an die Datenbankmigration vom letzten Sprint?»
«Ich hatte damals noch nicht angefangen.»

Borges beschrieb in der «Bibliothek von Babel» eine unendliche Bibliothek, die alle möglichen Bücher enthält — jede Kombination von Buchstaben. Eben deshalb ist die Bibliothek nutzlos: Wenn alles existiert, kann man nichts Bestimmtes finden⁵.

Story Points sind dieselbe babylonische Bibliothek. Ein System, das gerade dadurch, dass es alles bedeutet, nichts bedeutet.

Im Sitzungszimmer hängt das Plakat «Definition of Done», aber kein Plakat «Definition of Points». Was sind 5 Punkte? Fürs Frontend ein Tag, fürs Backend eine Woche, für QA — «hängt davon ab, wie viele Fehler wir finden». Die Fibonacci-Zahlen (1, 2, 3, 5, 8, 13) sind nicht wegen des Verhältnisses des dreizehnten Jahrhunderts zur Aufwandsschätzung gewählt, sondern wegen ihrer Nichtlinearität — als Widerspiegelung der Ungewissheit. Mittelalterliche Mathematik zum Messen dessen, was sich nicht messen lässt.

Jeden zweiten Mittwoch — zwei Stunden Planning Poker. Sieben erwachsene Menschen zeigen Karten mit Zahlen (ein Kinderspiel), um eine Aufgabe einzuschätzen, die noch niemand begonnen hat. Einer zeigt 5, ein anderer 8, ein dritter 3. Es beginnt die «Aussprache» — jeder erklärt seine Zahl durch eine Metapher aus vergangener Erfahrung, an die die übrigen sich nicht erinnern.

«Ich setze 8, weil das aussieht wie die Aufgabe mit OAuth …»
«Welche genau?»
«Na, die schwierige.»

Borges nahm diese Absurdität vorweg, doch der tatsächliche Preis solcher Absurdität wird in Mannschaftsstunden gemessen. Nach der Berechnung des Teamleiters: 7 Personen × 2 Stunden × 26 Sprints = 364 Stunden im Jahr fürs Kartenraten. Zwei Monate Entwicklung — für die Schätzung von Entwicklung.

## Spotify Model: das Modell, das nicht einmal bei Spotify funktioniert

Die Personalleiterin einer großen Bank fliegt nach Stockholm, um das «legendäre Modell» zu studieren. 2019, eine Delegation mit einem Budget, für das man sich hinterher nicht schämen muss. Ziel — das Spotify Model in einem russischen Konzern einzuführen.

Im Flugzeug liest sie das Dokument von Kniberg und Ivarsson noch einmal: Squads, Tribes, Chapters, Guilds⁶. Der Umbauplan liegt schon fertig — HR hat eine neue Organisationsstruktur gezeichnet, IT hat die Neugestaltung des Büros nach dem «Stammes»-Modell in Auftrag gegeben, die Spitze wartet auf das Ergebnis.

Der erste Tag bei Spotify. Der Begleiter der Delegation (nicht Kniberg — er ist vor drei Jahren gegangen) zeigt das Büro:
«Diese Zone war für Tribe A, jetzt sind hier gemischte Mannschaften.»
«Und wo ist der Chapter Lead aus der Präsentation?»
«Ach, diese Rolle hat sich gewandelt. Wir haben jetzt eine andere Struktur.»

Sie liest den ersten Absatz des Dokuments noch einmal: «Dieser Artikel ist nur eine Momentaufnahme unserer gegenwärtigen Arbeitsweise … zu dem Zeitpunkt, an dem Sie dies lesen, hat sich schon alles geändert.»⁶ Eine Warnung, die alle übersehen.

Abends im Hotel öffnet sie die Analyse von Jeremiah Lee — dem ehemaligen PM bei Spotify: Das Dokument beschreibt einen idealisierten Zustand, den Spotify nicht einmal im Augenblick der Veröffentlichung erreicht hatte; die Squads reorganisierten sich, die Tribes veränderten sich, die Guilds verloren an Aktivität⁷. Kniberg selbst hat in den zehn Jahren nach der Veröffentlichung wiederholt daran erinnert: Es handle sich um eine Momentaufnahme, keine Blaupause.

Die schmerzlichste Erkenntnis: Spotify hat das Dokument stillschweigend als Werkzeug der Personalgewinnung genutzt, obwohl die innere Wirklichkeit längst eine andere war. Sie versteht — sie kopieren eine Werbebroschüre.

Da ist die babylonische Lotterie in Aktion: eine Momentaufnahme eines Unternehmens verwandelt sich in einen Kanon für tausend andere, der Kontext verdampft, es bleibt nur die Struktur ohne Verständnis.

Conway (Kap. 3): Die Organisation bildet ihre Struktur im Produkt nach. Das «Spotify-Modell» ist der Versuch des Umgekehrten: die Struktur zu kopieren und ein fremdes Produkt zu erhalten. Das ist ein grundsätzlicher Fehler. Die Struktur von Spotify spiegelte die Kultur von Spotify, den schwedischen Markt, bestimmte Menschen, einen bestimmten Augenblick. Die Struktur ohne die Kultur zu kopieren, ist wie ein Restaurant zu kopieren und auf gutes Essen zu warten.

## SAFe: die Staatsreligion

War das «Spotify-Modell» eine naive Lotterie, so ist SAFe ihre folgerichtige Weiterentwicklung: eine Lotterie mit offiziellem staatlichem Status.

SAFe 6.0: vier Konfigurationen (Essential, Large Solution, Portfolio, Full), Dutzende von Rollen und Zeremonien⁹. «Big Picture» ähnelt dem Streckenplan der U-Bahn einer Geisterstadt. Alles verbunden, alles beschriftet — und ohne Kontext sinnlos.

Das Paradox des Skalierens: eine Methodik der Einfachheit und Selbstorganisation bringt unausweichlich Verwaltungsebenen hervor¹⁰.

Borges über SAFe: «Die Lotterie ist der Firma unterstellt; über den inneren Aufbau der Firma kursieren nur Vermutungen.»¹ Man ersetze «Firma» durch «Scaled Agile, Inc.» und erhält das Bildnis Tausender Organisationen, die ein kommerzielles Rahmenwerk einführen; weiter sagt Borges: «Die Lotterie ist eine Einschaltung des Zufalls in die Ordnung der Welt.»¹

Frage: Erzeugt SAFe tatsächlichen Wert — oder etikettiert es Chaos als «beherrschte Komplexität»?

Nokia (Kap. 2) verlor den Smartphone-Markt aus Angst und führte gleichzeitig (2008–2010) eine große Agile-Transformation ein. Laanti, Salo, Abrahamsson (2011) beschreiben die Wahrnehmung dieser Transformation durch die Beschäftigten selbst — überwiegend positiv¹¹. Der Marktanteilsverlust derselben Jahre ist in Kap. 2 dokumentiert (Vuori, Huy, 2016) — obwohl es keine Ursächlichkeit ist, untergräbt dieses Zusammentreffen das Versprechen «Agile at scale rettet».

## OKR: der Cargo-Kult

Der Chief Product Officer eines E-Commerce-Unternehmens sitzt über den Quartalszielen (*OKR — Objectives and Key Results*: Ziele und Schlüsselergebnisse) und fühlt sich wie ein melanesischer Schamane, der ein Strohflugzeug baut.

Q1 2024. Der CPO liest das Handbuch John Doerrs: OKR seien ein Werkzeug der Fokussierung (Intel, Google)¹², nämlich ein *Werkzeug*, keine Religion. Doch was im Unternehmen geschieht, ähnelt eher einem Cargo-Kult.

**Januar — die Quartalszeremonie.** Der CPO schreibt in die Confluence-Vorlage:
- O1: «Führend werden im Segment Fashion-E-Commerce»
- KR1: «Marktanteil auf 15 % steigern»
- KR2: «Weiterempfehlungsindex (*NPS: Net Promoter Score*) auf 75 heben»

Der Text ist schön, ehrgeizig, vollkommen von der Wirklichkeit gelöst. Der CPO weiß: Das Dokument wird im März (Halbzeitprüfung) und im Juni (nächste Planung) geöffnet. Dazwischen — die gewöhnliche Arbeit an gewöhnlichen Aufgaben.

**Februar — das Kaskadieren.** Die Kette der Verwandlungen: «Führung im Fashion» → «Verbesserung der Konversion» → «Optimierung des Katalogs» → «Refaktorierung der Suche» → JIRA-Ticket 15247 «Sortierung nach Preis reparieren». Der Entwickler schaut auf dieses Ticket und denkt: In welchem Verhältnis steht die Fehlerbehebung zur Marktführerschaft?

«Das ist eine strategisch wichtige Aufgabe», erklärt der CPO.
«Aber das ist doch nur ein Fehler …»
«Alles hängt mit den OKR zusammen.»

**März — die Bewertung.** Der CPO gibt sich 0,4 von 1,0. Nach Doerr ist ein gutes Ergebnis 0,7; 1,0 bedeutet einen Mangel an Ehrgeiz¹². Das Paradox «Erfolg = teilweiser Misserfolg». Wie erklärt man dem Vorstandsvorsitzenden, dass 40 % Zielerreichung normal seien?

«Wir haben Ausführungsprobleme», sagt der Vorstandsvorsitzende.
«Nein, das ist absichtlich angesetzter Ehrgeiz …»
«Klingt wie eine Rechtfertigung für Misserfolg.»

Wodtke (2016): OKR funktioniert in Kulturen, die den Misserfolg zulassen¹³. Die meisten Konzerne besitzen eine solche Kultur nicht — und in einem solchen Umfeld verwandelt sich OKR in eine Lotterie mit Strafen.

Borges hat gewarnt: Manche behaupten — mit einer Beharrlichkeit, die einer besseren Sache würdig wäre —, dass die Lotterie gar nicht bestehe.

## Das retrospektive Theater

Die Scrum-Masterin eines Spieleentwicklungsstudios legt die Klebezettel aus und denkt an das Theater des Absurden. Freitag, 16:00, Sitzungszimmer «Mario». Die siebte Retrospektive hintereinander mit demselben Ausgang.

Die Retrospektive ist in der Theorie eine Analyse der Erfolge und Misserfolge. Ein Nachdenken, das Hetzel und Verne (1870, Kap. 1) als Gespräch über die Auflage beim Mittagessen kannten. In der Praxis — ein Theater mit unverändertem Spielplan.

**Akt I — die Klebezettel-Liturgie.** Die Scrum-Masterin zeichnet auf das Flipchart drei Spalten: 😊 / 😐 / 😞. Die Mannschaft füllt gehorsam aus:
- Ein grüner Zettel vom Senior: «Gut am Inventarsystem gearbeitet»
- Ein roter Zettel von der Entwicklerin: «Zu viele Besprechungen»
- Die gelbe Spalte bleibt leer (wie immer)

«Warum schreibt niemand neutrale Punkte?», fragt der Neuling.
«Und was sollen wir schreiben?», zuckt der Senior mit den Achseln. «Was normal gelaufen ist, ist eben normal gelaufen.»

**Akt II — das Vorlesen.** Die Entwicklerin liest ihren roten Zettel vor:
«Wieder zu viele Besprechungen. Planung, Grooming, Kurztreffen, Retrospektiven …»
Nicken des Verständnisses. Denselben Zettel gab es im September, Oktober, November, Dezember.
«Welche Besprechungen sind konkret überflüssig?», hakt die Scrum-Masterin nach.
«Na … verschiedene. Insgesamt zu viele.»

**Akt III — Action Items (Aktionspunkte) als Lotterie.** Die Scrum-Masterin schreibt an die Tafel: «Zahl der Besprechungen verringern». Verantwortlich: nicht benannt. Frist: nicht bestimmt. Erfolgskriterien: verschwommen.
«Einigen wir uns darauf, die Zeit wirksamer zu planen», fasst die Scrum-Masterin zusammen.

Zwei Wochen später erscheint in der neuen Retrospektive der vertraute rote Zettel: «Zu viele Besprechungen». Die Scrum-Masterin schaut in ihre Notizen — die Action Items der vorigen Retro sind allen entfallen, sie selbst eingeschlossen.

So verwandelt sich die Retrospektive in ein Ritual statt in Reflexion — nicht abschließend, sondern endlos. Nichts trägt Verantwortung, und es entsteht ein geschlossener Kreis: Zettel → Action Items → neue Retrospektiven → frische Zettel. Auch die Lotterie, die Borges beschrieb, war so eingerichtet, dass sie niemals die letzte war.

Weinberg (Kap. 3) hält fest: Wenn Entwickler den Kontakt zum Anwender verlieren, beginnen sie das System für sich selbst zu entwerfen — ebenso werden Retrospektiven, die nichts mehr verändern, zur Selbsttröstung abgehalten.

## Gegen die Messungen

**Die meisten Kennzahlen agiler Methoden schaden mehr, als sie nützen.**

Muller, 2018: Leistungskennzahlen führen unausweichlich zur Manipulation der Zahlen — Krankenhäuser weisen Schwerkranke ab, Schulen schließen schwache Schüler aus, die Polizei ordnet Straftaten neu ein¹⁴.

Donald Campbell formulierte 1979 das Gesetz, das später seinen Namen trägt: Je breiter eine quantitative Kennzahl für gesellschaftliche Entscheidungen verwendet wird, desto stärker gerät sie unter Druck, der genau den Vorgang verzerrt, den sie messen sollte¹⁵. Velocity Gaming, Story-Point-Inflation und OKR-Kaskadieren sind dieses Gesetz in Aktion.

Sah Holmes (Kap. 3) in den Messungen die Krankheitszeichen, so geht Borges weiter — die Werkzeuge der Beobachtung werden selbst zur Krankheit.

DORA (Google Cloud, 2023) meidet Velocity, Story Points und OKR und schlägt stattdessen vier Ergebniskennzahlen vor¹⁶ — Häufigkeit der Ausrollungen, Vorlaufzeit (von der Übergabe bis zur Produktivumgebung), Zeit der Wiederherstellung nach einer Störung, Anteil der fehlgeschlagenen Änderungen. Alle vier sind an eine objektive Wirklichkeit gebunden (das System ist ausgerollt oder nicht) — das Spielen der Zahlen ist erschwert.

DORA funktioniert gerade deshalb, weil es Nebenkennzahlen, Kaskadierungen und Zeremonien ausschließt und vier objektive, eindeutige Zahlen belässt — Brooks (Kap. 3) hätte diese Vereinfachung gebilligt: die n·(n−1)/2-Kommunikationskanäle werden auf vier Anzeiger zurückgeführt.

## Das Lotterie-Muster: Werkzeug → Institution

Borges beschreibt ein universelles Muster der Entartung durch vier Phasen mit unmerklichen Übergängen.

**Phase 1: Nützliches Werkzeug.** Velocity hilft, Story Points vereinfachen, OKR fokussieren — solange es funktioniert, ist alles wertvoll; dann setzt die Institutionalisierung ein: «man nutzt Velocity» wird zu «alle müssen mit Velocity berichten», «eine Retrospektive ist nötig» — zu «alle zwei Wochen»; das heißt, das Nützliche wird zur Pflicht.

**Phase 2: Die Kennzahl wird zum Ziel.** Velocity wird zur Kennzahl, OKR zur Grundlage der Bewertung, die Retrospektive zur Berichterstattung — was Goodharts Gesetz bestätigt: die Werkzeuge beginnen, sich selbst zu optimieren.

**Phase 3: Lotterie.** Das Kennzahlensystem wird so verwickelt, dass niemand mehr weiß, warum es begonnen hat. Stunden vergehen mit Schätzen, Grooming, Planning Poker, Zielabgleich, Diagrammbau — und unter dem 😞-Zettel taucht das vertraute «zu viele Besprechungen» auf.

Borges leugnet die Lotterie nicht — er erinnert nur daran, dass wir von ihrer inneren Mechanik genau so viel wissen wie von jedem anderen großen System, das über unser Leben gelegt worden ist. Auf die Konzernwirklichkeit angewandt erweist sich diese Beschreibung als genau.

## Von der Messung zur Praxis

Der Produktverantwortliche beendet die nächste Sprint-Planung um 19:15. Die Mannschaft geht nach Hause, an der Tafel bleiben die Zahlen: 42 Story Points, geplante Velocity 38, Vertrauensgrad 0,7.

Er schaltet den Beamer aus und denkt an Borges. Der erste Akt ist zu Ende: Verne zeigte das Schaffen, Shelley den Preis des Vergessens, Holmes die Diagnostik, Borges — wie **der Beobachtungsapparat selbst zur Krankheit wird**. Wenn die Messung-Ziel das Gemessene zerstört.

Vor dem Fenster sind die Büros der Wettbewerber erloschen. Irgendwo gibt es Mannschaften, die Code schreiben statt Code zu schätzen. Die die Probleme der Anwender lösen statt die Kennzahlen zu optimieren. Die in der eigenen Lotterie nicht ertrunken sind.

Der Teamleiter aus dem Fintech im Nachbargebäude denkt dasselbe, als er den Besprechungsraum nach der Retrospektive abschließt. Die Personalleiterin fliegt aus Stockholm nach Hause mit dem Verständnis: Sie haben die Betriebsanleitung eines Flugzeugs kopiert, das es nicht mehr gibt. Der CPO schreibt an den OKR fürs nächste Quartal weiter und weiß — es ist Theater, aber spielen muss man.

Die Falle: Velocity verwandelt sich in Velocity-Optimierung, OKR in ein Ritual, Story Points in einen philosophischen Streit. Das Ergebnis — eine babylonische Lotterie, in der das Werkzeug den Zweck verschlingt.

Es gibt einen Ausweg: Mannschaften, die messen, ohne sich den Messungen zu unterwerfen. Die Vorgänge anwenden, ohne sie zu vergöttern.

---

*Fortsetzung folgt. Im nächsten Kapitel:* ein Kapitän, der nicht ein einziges Vorstellungsgespräch nach Regelwerk geführt hat — und die beste Mannschaft des Weltmeers zusammenstellte. Ein Unterseeboot gegen einen Flugzeugträger im Wert von zwei Billionen; Auswahl nach Fähigkeit gegen Auswahl nach Zustimmung; und eine Organisation, die keine Firma braucht. Die Lotterie bleibt in Babylon. Der «Nautilus» geht in die Tiefe.

---

**Fußnoten**

¹ Borges, Jorge Luis. «La lotería en Babilonia» (1941). In der Sammlung *Ficciones* (1944). Editorial Sur, Buenos Aires. Zitate — Autorenübersetzung nach dem RU-Master. **Übersetzeranmerkung:** Die kanonische deutsche Übersetzung von Karl August Horst und Gisbert Haefs (Hanser-Ausgabe der Gesammelten Werke) unterliegt dem geltenden Urheberrecht; die vorliegende Übertragung folgt daher dem RU-Master, nicht dem deutschen Kanontext. Deutsche Erzähltradition kennt den Titel als «Die Lotterie in Babylon».

² Goodhart, Charles A. E. «Problems of Monetary Management: The U.K. Experience.» *Papers in Monetary Economics*, Reserve Bank of Australia, 1975. (Übertragung des Autors nach dem RU-Master.)

³ Strathern, Marilyn. «Improving Ratings: Audit in the British University System.» *European Review*, Bd. 5, Nr. 3, 1997, S. 305–321. (Übertragung des Autors nach dem RU-Master.)

⁴ Digital.ai. «17th Annual State of Agile Report» (2023). 36 % der agilen Mannschaften werden anhand der Velocity bewertet — was einen strukturellen Anreiz zum Gaming schafft. Praktische Analyse des Velocity Gaming: Levison, Mark. «Misuse of Velocity in Agile Projects.» AgilePainRelief.com. (Übertragung des Autors nach dem RU-Master.)

⁵ Borges, Jorge Luis. «La biblioteca de Babel» (1941). In der Sammlung *Ficciones* (1944). **Übersetzeranmerkung:** Die kanonische deutsche Übersetzung von Karl August Horst und Gisbert Haefs (Hanser-Ausgabe) unterliegt dem Urheberrecht; die vorliegende Übertragung folgt dem RU-Master. Deutsche Tradition: «Die Bibliothek von Babel». (Übertragung des Autors nach dem RU-Master.)

⁶ Kniberg, Henrik & Ivarsson, Anders. «Scaling Agile @ Spotify with Tribes, Squads, Chapters & Guilds.» Spotify Labs whitepaper, Oktober 2012. **Übersetzeranmerkung:** Die Fachbegriffe Squads / Tribes / Chapters / Guilds bleiben als eingebürgerte Markenbegriffe des Spotify-Modells englisch stehen; deutsche Entsprechungen (Trupps / Stämme / Kapitel / Gilden) wären zwar formal möglich, würden aber die Referenz auf die konkrete Fallstudie brechen. (Übertragung des Autors nach dem RU-Master.)

⁷ Lee, Jeremiah. «Failed #SquadGoals — Spotify doesn't use 'the Spotify model' and neither should you.» jeremiahlee.com, April 2020. Lee ist ehemaliger PM bei Spotify. (Übertragung des Autors nach dem RU-Master.)

⁸ Kniberg, Henrik. Langjährige öffentliche Erinnerungen des Autors: das Whitepaper von 2012 sei eine **Momentaufnahme** eines bestimmten Augenblicks, keine **Blaupause**. Bekannteste Texte: Interview auf der Agile Amsterdam 2015; Blog crisp.se; Wiederholungen in Präsentationen 2016–2020. Erstquellen des Zitats im Fließtext — das Whitepaper (⁶) und Interviews des Autors auf großen Agile-Konferenzen.

⁹ Scaled Agile, Inc. SAFe 6.0 Framework. scaledagileframework.com. **Übersetzeranmerkung:** SAFe (Scaled Agile Framework) und seine Konfigurationsstufen (Essential, Large Solution, Portfolio, Full) sind eingetragene Marken der Scaled Agile, Inc.; die Namen werden zitiergetreu englisch übernommen.

¹⁰ Rigby, Darrell K.; Sutherland, Jeff; Noble, Andy. «Agile at Scale.» *Harvard Business Review*, Mai–Juni 2018. (Übertragung des Autors nach dem RU-Master.)

¹¹ Laanti, Marko; Salo, Outi; Abrahamsson, Pekka. «Agile Methods Rapidly Replacing Traditional Methods at Nokia: A Survey of Opinions on Agile Transformation.» *Information and Software Technology*, Bd. 53, Ausgabe 3, 2011, S. 276–290. (Übertragung des Autors nach dem RU-Master.)

¹² Doerr, John. *Measure What Matters* (2018). Portfolio/Penguin. Deutsche Ausgabe: «OKR: Objectives & Key Results — Wie Sie Ziele, auf die es wirklich ankommt, entwickeln, messen und umsetzen» (Vahlen). (Übertragung des Autors nach dem RU-Master.)

¹³ Wodtke, Christina. *Radical Focus* (2016). Cucina Media. (Übertragung des Autors nach dem RU-Master.)

¹⁴ Muller, Jerry Z. *The Tyranny of Metrics* (2018). Princeton University Press. (Übertragung des Autors nach dem RU-Master.)

¹⁵ Campbell, Donald T. «Assessing the Impact of Planned Social Change.» *Evaluation and Program Planning*, Bd. 2, Nr. 1, 1979, S. 67–90. (Übertragung des Autors nach dem RU-Master.)

¹⁶ Accelerate: State of DevOps Report. Google Cloud / DORA, 2023. Vier Ergebniskennzahlen: Häufigkeit der Ausrollungen, Vorlaufzeit, Wiederherstellungszeit, Anteil der fehlgeschlagenen Änderungen. (Übertragung des Autors nach dem RU-Master.)

---
