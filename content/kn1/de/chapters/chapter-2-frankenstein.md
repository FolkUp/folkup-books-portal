---
title: "Kapitel 2: Frankenstein führt ein Projekt"
description: "Wie der Roman der achtzehnjährigen Mary Shelley zur genauesten Nachbetrachtung (post-mortem) von Konzern-Fehlschlägen wurde: vom FBI Sentinel bis Healthcare.gov"
date: 2026-03-27
weight: 30
chapter: 2
act: "I: Ursprünge"
category: analysis
reading_time: "25 min"
tags:
  - mary-shelley
  - frankenstein
  - projektversagen
  - konzern-prometheus
  - technologische-hybris
related:
  - "/chapters/chapter-0-pilot"
  - "/chapters/chapter-1-jules-verne"
  - "/chapters/chapter-3-holmes"
  - "/chapters/chapter-4-borges"
sensitive: false
toc: true
draft: false
status: verified
confidence: high
reviewed_by: "Borges (literarische Architektur), CyberGonzo (OSINT-Verifikation)"
review_date: "2026-05-13"
---

> **Worüber dieses Kapitel spricht.** Die dunkle Seite des Schöpfens. Wie das Muster «glänzender Einfall → Flucht vor den Folgen» wie ein roter Faden vom Roman Mary Shelleys bis zu den größten Fehlschlägen der digitalen Transformation läuft. Warum die gefährlichsten Systeme mit den besten Absichten erschaffen werden — und was geschieht, wenn der Schöpfer sich davonmacht.

## Villa Diodati, 16. Juni 1816

Der Regen setzt seit drei Wochen nicht aus — über Europa hängt die Asche des Tambora, jenes Vulkans am anderen Ende der Erde, der so viel Schwefel in die Stratosphäre geschleudert hat, dass der Sommer für immer ausfiel. Die Historiker werden 1816 «das Jahr ohne Sommer» nennen, aber die achtzehnjährige Mary Godwin (Shelley wird sie noch nicht heißen) sitzt am Kamin der Villa Diodati und hört zu, wie Byron und Percy sich über den Galvanismus streiten, mit dem Eifer von Gelehrten, die im Begriff sind, die Naturgesetze umzuschreiben.

Kann Elektrizität totes Gewebe wieder beleben — die Frage hat in den Londoner Vorführungen des Giovanni Aldini bereits eine unheilverkündende Antwort gefunden: Die Glieder hingerichteter Verbrecher zuckten, die Kiefer öffneten sich¹. Zuschauer fielen vor Entsetzen in Ohnmacht. Die Toten erwachten nicht, aber die Grenzen des Möglichen verschoben sich für immer.

Byron schlägt eine Wette vor — jeder solle auf dieser verfluchten Villa, auf der der Regen den Sommer aus der Landkarte gewischt hat, eine Schauergeschichte schreiben. Percy und Polidori werden ihre Geschichten in wenigen Tagen entwerfen und dann vergessen, auch Byron wird zurücktreten, aber die achtzehnjährige Mary schafft einen Roman, der sie alle überleben und zum prophetischen Text für eine Epoche werden wird, die noch nicht geboren ist.

Zweihundertacht Jahre später beschreibt dieser Roman jede zweite Konzernkrise genauer, als McKinsey seine eigenen Empfehlungen beschreibt. Nur die Zutaten haben sich geändert, die Struktur ist geblieben.

Statt des Galvanismus wird die digitale Transformation eingesetzt. Statt toten Gewebes werden geerbte Prozesse wiederbelebt. Statt eines elektrischen Schlags wird der «Urknall-Start»¹⁵ angewandt. Statt eines Wesens, das auf der Suche nach dem Schöpfer durch die Arktis streift, bekommen wir ein System aus vierzehn Jira-Boards, sieben Confluence-Räumen und drei einander ausschließenden Definitionen des Wortes «fertig». Ein Ungeheuer, das niemand abzuschalten wagt, weil niemand ganz versteht, wie es gebaut ist.

---

Das vorige Kapitel zeigte die helle Seite des Schöpfens — wie Verne und Hetzel den Prototyp der iterativen Entwicklung erfanden, über Inkremente, Rückkopplungsschleifen und datenbasierte Entscheidungen, und Literatur schufen, die imstande war, einem Muster Leben einzuhauchen, das eine ganze Industrie umgestalten würde.

Frankenstein steht für die dunkle Seite derselben Medaille — für die Geschichte davon, was passiert, wenn ein Schöpfer die Verantwortung dafür ablegt, wie sein Werk nach der Freigabe in die Produktivumgebung lebt und sich entwickelt.

Wenn Kapitel 1 von der Geburt eines Projekts handelte, dann handelt Kapitel 2 davon, was geschieht, wenn der Elternteil geht und sein Werk der Willkür überlässt.

## Anatomie der Flucht

«Frankenstein oder Der moderne Prometheus» ist die Geschichte eines Gelehrten, der ein vernunftbegabtes Wesen erschuf, vor dem Ergebnis erschrak und aus dem Labor floh — und zwar nicht, weil das Wesen von Natur aus böse gewesen wäre, sondern weil Viktor Frankenstein weder ein Betriebsmodell noch eine Strategie für die Betreuung dessen bedacht hatte, was nach dem Start geschehen würde.

Lest den Roman noch einmal aufmerksam — Viktor arbeitet zwei Jahre in völliger Isolation an dem Projekt, konsultiert keine Kollegen, bespricht keine ethischen Folgen, baut keinen Betriebsplan für die Betreuung des Ergebnisses. Er ist ausschließlich von der technischen Aufgabe besessen: «Kann man Leben erzeugen?» Die Frage «Sollte man das tun?» wird auf später verschoben. Die Frage «Was tun wir dann mit dem Ergebnis?» wird gar nicht gestellt.

Im entscheidenden Augenblick des Starts geschieht die Katastrophe der Wahrnehmung. Das Wesen öffnet ein trübes, gelbes Auge, atmet mühsam, die Glieder zittern in Krämpfen — und Viktor ist statt Triumph von Grauen erfüllt¹⁴: «Der schöne Traum war verschwunden, und atemloses Grauen und Ekel erfüllten mein Herz.» Er begeht die Handlung, die die ganze weitere Tragödie bestimmen wird. Er flieht.

Er flieht buchstäblich aus dem Labor und legt sich schlafen, als würde sich das Problem von selbst lösen.

Das ist keine Schauerromantik — das ist ein Betriebsprotokoll, das jeder Konzernangestellte auf den ersten Blick wiedererkennt:

1. **Der Visionär** verkauft dem Vorstand eine revolutionäre Idee
2. **Das Team** arbeitet zwei Jahre isoliert, ohne Rückmeldung von Nutzern
3. **Der Start**: Das System sieht ganz anders aus als in der schönen Präsentation
4. **Der Visionär** wird auf eine «strategische Rolle» befördert (die elegante Art, davonzulaufen und sich schlafen zu legen)
5. **Das Geschöpf** beginnt sein eigenes, unberechenbares Leben

Mary Shelley hat keine gotische Gruselgeschichte geschrieben — sie hat die erste eingehende Nachbetrachtung (*post-mortem*) eines gescheiterten Starts eines komplexen Systems in der Literaturgeschichte verfasst.

Und wie in jeder gründlichen Nachbetrachtung lautet die Hauptlehre nicht «wir haben zufällig ein Ungeheuer geschaffen», sondern etwas weit Schlimmeres: **Wir wussten, dass wir ein Ungeheuer schaffen, und haben uns bewusst nicht aufgehalten.**

Sich aufzuhalten hätte bedeutet, sich vor Investoren und Team einzugestehen, was wahr war. Die ursprüngliche Idee war nicht bloß schlecht, sondern in der Architektur katastrophal unvollständig.

Viktor Frankenstein ist ein glänzender Student mit scharfem Verstand und tiefem Wissen. Sein grundsätzliches Problem liegt nicht im Mangel an Verstand. Er verwechselt in katastrophaler Weise das *technische Vermögen*, etwas zu erschaffen, mit der *Bereitschaft*, die Folgen zu tragen.

Der Abstand zwischen «Ich kann das machen» und «Ich muss das dann pflegen» ist arktisch weit. In ihm gehen Projekte, Karriere und, wie der Roman zeigt, Menschenleben zugrunde.

Betrachten wir nun drei belegte Geschichten aus der Konzernpraxis — alle wirklich, alle sorgfältig von staatlichen Prüfern dokumentiert, und jede eine ideale Wiederholung des gotischen Sujets, das die achtzehnjährige Mary am Kamin der verfluchten Villa Diodati erfand.

## FBI Sentinel: Das Ungeheuer für 451 Millionen Dollar

Im Jahr 2001 wurde Robert Mueller Direktor des FBI, eine Woche vor dem 11. September — und die Ermittlungen zu den Anschlägen legten einen technologischen Albtraum offen, der sich nicht länger übersehen ließ: Die Agenten arbeiteten mit Papierakten wie in den 1950er Jahren, Informationen zirkulierten wegen unverträglicher Systeme nicht zwischen den Abteilungen, und das zentrale System zur Fallverwaltung «Automated Case Support» war in Technik der 1980er Jahre geschrieben und zerfiel vor den Augen der Betrachter².

Mueller — ein Mann militärischer Disziplin und strategischen Denkens — tat genau das, was alle Konzern-Visionäre im Krisenmoment tun: Er verkündete ein Großprojekt der vollständigen digitalen Transformation. Das System «Virtual Case File» sollte zum digitalen Gehirn des FBI werden, zu einer revolutionären Plattform für Ermittlungen. Das Budget betrug 170 Millionen US-Dollar, Hauptauftragnehmer war die Science Applications International Corporation (SAIC), Termin — ehrgeizige drei Jahre.

Das Ergebnis nach drei Jahren und ausgegebenen 170 Millionen US-Dollar war beklemmend schlicht: absolut nichts Funktionsfähiges. Virtual Case File wurde vollständig als unbrauchbares System abgeschrieben, der Kongress verlangte ausführliche Erklärungen und öffentliche Anhörungen, und das FBI verkündete mit steinerner Miene den Neustart des Vorhabens.

Das neue Projekt erhielt den Namen «Sentinel» — das neue Budget wuchs auf 451 Millionen US-Dollar, der neue Termin wurde auf 2009 festgelegt, neuer Auftragnehmer wurde die Lockheed Martin Corporation, aber das architektonische Fehlschlagsmuster blieb dasselbe. Viktor Frankenstein kehrt triumphal in sein Labor zurück, mit noch größerem Budget und noch grandioseren Auferstehungsplänen.

Bis 2010 hatte Sentinel 405 Millionen der geplanten 451 Millionen verausgabt und stolz nur zwei der vier versprochenen Phasen abgeliefert. Lockheed Martin übergab feierlich das System, das die Agenten strikt zu benutzen verweigerten — aus einem einfachen Grund: Es arbeitete langsamer als die gewohnten Papierakten³.

Der Generalinspektor des Justizministeriums veröffentlichte eine trockene bürokratische Prüfung mit klassischen Formulierungen: «Das Projekt litt unter dem Fehlen eines disziplinierten Zugangs zur Anforderungsverwaltung, unzureichender Qualitätskontrolle und schwacher Koordinierung der Beteiligten»⁴ (Übertragung des Autors) — was übersetzt aus der Amtssprache ins Gotische die einfache und erschreckende Wahrheit bedeutet: Der Schöpfer nähte methodisch ein technisches Wesen aus einzelnen fremden Gliedmaßen zusammen, jagte einen kräftigen Strom staatlichen Geldes hindurch und geriet in Entsetzen, als das Ungeheuer sich ganz anders regte, als es auf den architektonischen Zeichnungen hübsch dargestellt war.

Erst 2012 tat das FBI endlich, was schon 2001 zu tun gewesen wäre: Es nahm dem externen Auftragnehmer das Projekt aus der Hand, verkleinerte das Team radikal auf vierzig Personen, wechselte zur iterativen Entwicklung in zweiwöchigen Zyklen und schloss die verbleibende Arbeit binnen eines Jahres ab — für weniger als 30 Millionen US-Dollar⁴.

Bilanz: dreizehn Jahre Qualen, mehr als sechshundert Millionen verausgabter US-Dollar, zwei völlig gescheiterte Projekte — und am Ende zeigte sich, dass die Lösung, die tatsächlich funktionierte (ein kleines internes Team, kurze Iterationen, das völlige Fehlen eines grandiosen Plans), weniger kostete als das Jahresbudget des ursprünglichen Virtual Case File.

Hetzel nickt weise aus dem fernen 1870 — Inkremente, ständige Rückkopplung, laufende Kalibrierung am Ergebnis; und Mary Shelley nickt traurig aus dem noch ferneren 1818 mit einer einfachen, aber lebenswichtigen Wahrheit: Überlasst das, was ihr erschaffen habt, nicht der Willkür.

Das Verblüffendste an dieser Geschichte liegt aber nicht im Ausmaß des Scheiterns, sondern in der Natur der Lösung, die am Ende griff. Als Chad Fulgham die interne Sentinel-Mannschaft übernahm, stellte er keine weiteren Programmierer ein — er entfernte überzählige Leute; er schrieb kein detaillierteres Pflichtenheft — er verzichtete zugunsten zweiwöchiger Iterationen ganz auf Pläne; er kaufte keine teurere Technik zu — er nutzte maximal, was ohnehin im FBI vorhanden war.

Ein Team von vierzig Personen leistete in einem Jahr, was Hunderte Spezialisten in zwölf Jahren dramatischen Ringens nicht zustande gebracht hatten — und geschehen ist das nicht, weil das neue Team klüger oder talentierter gewesen wäre als seine Vorgänger, sondern ausschließlich, weil es eine grundlegend andere Entscheidung traf: Es blieb im Labor und übernahm die Verantwortung für das Ergebnis.

## Healthcare.gov: Der Start, den die ganze Welt hörte

Am 1. Oktober 2013 startet die Regierung Barack Obamas mit großem Getöse Healthcare.gov — das Bundesportal für Krankenversicherung und zentrales technisches Element des revolutionären Affordable Care Act, ein System, das es Millionen Amerikanern ermöglichen sollte, einfach eine Versicherungspolice auszuwählen und zu kaufen.

In den ersten Stunden nach dem Start bricht die Website unter der Last von Millionen Nutzern nicht bloß zusammen — sie fällt völlig aus. Von den verzweifelten Anmeldeversuchen der ersten Tage gelingen buchstäblich eine Handvoll. Nach den Angaben, die in den dramatischen Anhörungen des Ausschusses für Energie und Handel des Repräsentantenhauses vorgelegt wurden, war die Zahl der erfolgreichen Registrierungen am ersten Tag einstellig — die unglaubliche Ziffer «sechs Personen im ganzen Land»⁵ (Übertragung des Autors) machte die Runde, wobei die genaue Zählweise später umstritten war.

Die sorgfältige Untersuchung des Ausschusses des Repräsentantenhauses stellte einen verblüffenden Umstand fest: Das grandiose Projekt wurde gleichzeitig von «55 verschiedenen Auftragnehmern ohne einen einzigen koordinierenden Systemintegrator»⁶ (Übertragung des Autors) geführt, wobei die Centers for Medicare & Medicaid Services (CMS) heldenhaft versuchten, die miteinander unvereinbaren Rollen des Auftraggebers, des Projektleiters und des Systemintegrators auszufüllen, ohne für die letzte Aufgabe die geringste Erfahrung oder die nötigen Mittel zu haben.

Viktor Frankenstein in seinem gotischen Labor arbeitete wenigstens allein und trug die persönliche Verantwortung für das Ergebnis — Healthcare.gov hatte dagegen 55 Paar arbeitsame Hände, verteilt über verschiedene Auftragnehmer, und dabei keinen einzigen koordinierenden Kopf, der das Ganze überblickt hätte.

Der GAO dokumentierte in seinem ausführlichen Bericht 2015 drei kritische Architekturfehler: «Wesentliche technische Anforderungen änderten sich noch in den letzten Wochen vor dem feierlichen Start grundlegend, eine vollständige Belastungsprüfung des Systems unter tatsächlicher Nutzerlast wurde nie durchgeführt, und die endgültige Entscheidung, am 1. Oktober zu starten, wurde ausschließlich aus politischen Gründen getroffen»⁷ (Übertragung des Autors), unter völliger Missachtung der technischen Empfehlungen.

Es ist hier wesentlich wichtig, nicht in politische Polemik abzugleiten — sie führt weit über unsere Analyse hinaus und lenkt von der Hauptlehre ab. Wichtig ist, die architektonische Struktur des Fehlschlags zu erkennen, die einem den Rücken hinunterläuft, wie im gotischen Roman — dieselben gewölbten Korridore der Burg Frankenstein, nur mit heutigem Gipskarton verkleidet und von LED-Panels beleuchtet:

**Der Visionär** (die gesetzliche Initiative) → **Der grandiose Entwurf** (ein einheitliches Portal für das ganze Land) → **Das isolierte Team** (55 Auftragnehmer ohne Koordinierung) → **Der Start nach Zeitplan** (ein politischer Termin) → **Die Flucht** (niemand haftete persönlich für die Funktionsfähigkeit des Systems).

Mary Shelley hätte dieses Sujet schreiben können, ohne eine einzige Zeile der Romanstruktur zu ändern. Viktor setzt das Wesen aus Einzelteilen zusammen, die aus verschiedenen Quellen stammen. Jede Einzelheit ist für sich funktionsfähig. Zusammen — ein Ungeheuer. Und der Schöpfer bleibt nicht da, um es das Gehen zu lehren.

Healthcare.gov wurde am Ende repariert, aber das erforderte zwei Monate intensive Arbeit einer eigens gebildeten «Technologie-Eingreiftruppe» (*surge team*) aus den besten hinzugezogenen Fachleuten von Google, Oracle und Red Hat sowie den vollständigen Neubau der Systemarchitektur von Grund auf. Die bittere Ironie der Lage bestand darin, dass die Menschen, die Healthcare.gov erfolgreich reparierten, genau nach jenen Grundsätzen handelten, die im ersten Kapitel dieses Buches beschrieben sind: ein kleines, fokussiertes Team, kurze iterative Zyklen, tägliche Rückkopplung mit den Nutzern — eine Methodik, die der alte Hetzel unbedenklich gebilligt hätte.

Aber die technische Reparatur von Healthcare.gov kostete nicht nur Haushaltsgelder und menschliche Anstrengung — sie kostete das unwiederbringliche öffentliche Vertrauen, jene Währung, die sich weder durch Refactoring (Umstrukturierung des Codes zur Verbesserung, ohne dass sich die Funktion ändert) noch durch systemische Optimierung neu schreiben lässt. Und darin liegt vielleicht die wichtigste Lehre des Frankenstein-Romans für die Konzernwelt: Technische Probleme sind fast immer technisch lösbar — mit ausreichend Mitteln und Fachwissen; Rufschäden aber sind unumkehrbar. Das Wesen Frankensteins hätte man theoretisch lehren, erziehen, in eine konstruktive Bahn lenken können — aber nur, bis es Wilhelm, Justine und Clerval tötete; danach war der Punkt der Umkehrbarkeit endgültig überschritten. Nicht, weil das Ungeheuer im Kern nicht mehr zu bessern gewesen wäre, sondern ausschließlich, weil Viktor zu lange gewartet und die Übernahme der Verantwortung aufgeschoben hatte.

## BBC Digital Media Initiative: das stille Ungeheuer

Längst nicht alle Ungeheuer Frankensteins veranstalten laute Aufführungen mit zerschlagenem Mobiliar und öffentlichen Skandalen — manche ziehen es vor, still und methodisch im Konzernkeller Ressourcen zu verzehren, sich langsam in der Dunkelheit auszudehnen, bis jemand zufällig mit einer Taschenlampe hineinsieht.

Im Jahr 2008 startet die BBC die Digital Media Initiative (DMI), ein System, das Produktion und Verwaltung von Inhalten modernisieren sollte. Ein vollständig digitaler Workflow (Arbeitsablauf): vom Dreh bis zur Ausstrahlung. Budget: 98 Millionen Pfund Sterling⁸.

Anfangs wurde das Projekt an Siemens IT Solutions vergeben. 2009 kündigte die BBC den Vertrag und beschloss, das System in Eigenregie zu bauen. Eine vertraute Entscheidung: Das FBI wird drei Jahre später beim Sentinel dasselbe tun, und dort wird es funktionieren. Aber das FBI verkleinerte das Team und ging zu Iterationen über. Die BBC tat das nicht.

Stattdessen baute die BBC weiter am Monolithen. Das interne Team übernahm den grandiosen Entwurf, ohne den Mut zu haben, ihn zu überprüfen.

Das britische National Audit Office veröffentlichte im Januar 2014 seinen Bericht. Die Schlussfolgerungen waren vernichtend: «Zum Zeitpunkt der Einstellung des Projekts hatte die DMI keines der versprochenen Ergebnisse geliefert.»⁸ (Übertragung des Autors)

Null. Achtundneunzig Millionen Pfund. Null Ergebnis.

Der NAO stellte fest, dass das Projekt an «unzureichender Aufsicht durch die Leitung der BBC, mangelnder Klarheit in Rollen und Zuständigkeiten und schwachem Risikomanagement»⁸ (Übertragung des Autors) litt. Der Bericht vermerkte, dass die Leitung der BBC «keine angemessenen Informationen über den Zustand des Projekts erhielt»⁹ (Übertragung des Autors) und dass technische Probleme in der Berichterstattung systematisch heruntergespielt wurden.

### Das Ungeheuer, das niemand sah

Die DMI ist der reinste, klinisch präzise Fall des Frankenstein-Syndroms in der heutigen Konzernpraxis. Hier gab es nicht einmal einen dramatischen, katastrophalen Start mit öffentlichen Skandalen — das Ungeheuer entkam nicht in die Freiheit, um die Stadt zu verwüsten, sondern starb still und unauffällig im Keller, nachdem es methodisch das gesamte zugewiesene Budget verzehrt hatte. Die Schöpfer flohen dabei nicht panisch aus dem Labor — sie hörten schlicht schrittweise auf, dort hineinzuschauen, in der Hoffnung, das Problem werde sich irgendwie von selbst lösen.

Achtundneunzig Millionen Pfund entsprechen zweitausendzweihundert Jahresgehältern eines BBC-Nachwuchsjournalisten. Oder dem Budget mehrerer Staffeln «Doctor Who». Oder (um in Mary Shelleys Sprache zu übersetzen) genügend Elektrizität, um einen ganzen Friedhof zu beleben, nicht bloß ein Ungeheuer.

Mary Shelley hat auch das beschrieben. Der Roman enthält einen Moment, der oft übersehen wird: Viktor flieht nicht bloß vor dem Wesen. Er meidet aktiv jede Auskunft über es. Fragt nicht nach. Sucht nicht. Hofft, das Problem verschwinde von selbst. Die BBC handelte ähnlich: Die Leitung wollte den wirklichen Stand des Projekts nicht wissen (denn Wissen verpflichtet zum Handeln).

## Frankenstein als Methodologie

Nun die These, die Berater für die Einführung agiler Methoden erzürnen wird: Die Einführung agiler Methoden in großen Organisationen ist der Versuch, totes Gewebe mit Galvanismus zu beleben.

Die Formulierung ist provokativ. Zerlegen wir sie in Teile.

Die klassische Einführung agiler Methoden beruht auf einer verführerisch einfachen Logik: Man nimmt eine bestehende Organisation mit gewachsener Hierarchie, formalen Prozessen und konservativer Kultur — und «transformiert» sie durch eine Reihe magischer Rituale in eine bewegliche, anpassungsfähige, funktionsübergreifende Struktur. Man stellt ein Heer externer Coaches ein, hält beflügelnde Schulungen ab, tauft Führungskräfte feierlich in Scrum Master um, führt zeremoniell heilige Rituale mit hübschen Namen ein.

Drei Probleme.

**Erstes Problem: Elektroschock erzeugt kein Leben.** Aldini brachte tote Glieder zum Zucken. Die Zuschauer hielten das für Wiederbelebung. Der Körper zuckte, aber er lebte nicht. Eine Organisation, die eine «Transformation» durchlaufen hat, zuckt — hält Stand-ups, füllt Boards, geht in Retrospektiven. Aber wenn sich die Kultur nicht geändert hat, ist das Galvanismus: der Anschein von Bewegung ohne Leben.

**Zweites Problem: Der Schöpfer flieht feierlich nach der Zeremonie.** Die Beratungsfirma führt eine großangelegte Einführung binnen sechs bis zwölf Monaten durch, kassiert den Dank und den Scheck, und verschwindet elegant vom Horizont. Die Organisation bleibt allein mit den glänzenden neuen Prozessen zurück, die keiner der Mitarbeiter tief genug versteht, um sie an die wirklichen Arbeitsbedingungen anzupassen. Viktor Frankenstein im Anzug, der feierlich das Labor verlässt mit den Worten: «Wir haben Ihrem Unternehmen ein neues Leben gegeben; entwickeln Sie sich weiter selbst.»

**Drittes Problem: Das Ungeheuer rächt sich.** Das Wesen Frankensteins wird nicht böse geboren. Es wird durch die Verlassenheit zerstörerisch. Zombie-Prozesse — Verfahren, die formal befolgt, aber ihres Inhalts beraubt sind — entstehen nicht, weil agile Methoden schlecht wären. Sie entstehen, weil die Schöpfer gegangen sind. Stand-ups werden zu Statusberichten an die Vorgesetzten. Retrospektiven werden zur Formsache. Sprints werden zu starr geplanten zweiwöchigen Wasserfällen. Das Ungeheuer lebt, aber es ist nicht das Leben, das sich der Schöpfer gedacht hat.

Das Wesen in Shelleys Roman lernt sprechen, indem es Milton, Plutarch und Goethe liest — heimlich, durch die Wand einer Hütte lauschend. Zombie-Prozesse lernen sprechen, indem sie den wirklichen agilen Methoden durch die Wand des Sitzungssaals lauschen: Sie übernehmen die Worte («Sprint», «Backlog», «Velocity»), aber nicht den Sinn. Das Ergebnis ist dasselbe: ein Wesen, das die menschliche Sprache spricht, aber von Menschen nicht verstanden wird. Und sich selbst nicht versteht.

## Nokia: Wenn der Schöpfer sich weigert, das Ungeheuer zu sehen

Die Geschichte Nokias steht für eine grundsätzlich andere Art von Konzern-Ungeheuer — hier war die zerstörerische Kraft kein einzelnes gescheitertes Projekt, sondern der gemeinsame Unwille der Organisation, die sich ändernde Wirklichkeit zu sehen und unbequeme Tatsachen anzuerkennen.

Im Jahr 2007 beherrschte Nokia mehr als 50 Prozent des Weltmarktes für Smartphones (rund 51 Prozent im 4. Quartal 2007)¹⁰. Bis 2013 waren es weniger als 3 Prozent¹⁰. Die Forscher Vuori und Huy von INSEAD veröffentlichten in *Administrative Science Quarterly* eine ausführliche Analyse, die auf 76 Interviews mit Nokia-Führungskräften beruht. Ihr Ergebnis: «Organisationale Angst lähmte die Fähigkeit Nokias, auf die Bedrohung durch das iPhone zu reagieren.»¹¹ (Übertragung des Autors)

Kein Fehlen an Technologie. Keine Ressourcenknappheit. Angst.

Die Führungskräfte der mittleren Ebene wussten von den Problemen mit Symbian — jenem Betriebssystem, das mit iOS nicht mithalten konnte. Aber sie fürchteten, schlechte Nachrichten nach oben zu melden. Die Leitung wiederum verbreitete Optimismus, ohne ein vollständiges Bild zu haben. Auf jeder Hierarchiestufe wurden Informationen gefiltert. Jede Stufe sah ihre eigene Version des Wesens, und keine deckte sich mit der Wirklichkeit¹¹.

Das ist nicht Viktor, der aus dem Labor flieht, sondern Viktor, der vor dem Wesen steht und sich einredet, einen Engel zu sehen.

Vuori und Huy beschrieben einen Mechanismus, den sie *distributed attention*¹¹ (verteilte Aufmerksamkeit — Übertragung des Autors) nannten: Wird eine Organisation so groß, dass kein einzelner Mensch das ganze Bild sieht, verflüssigt sich die Verantwortung. Jeder ist für seinen Ausschnitt zuständig, niemand für das Ganze. Frankensteins Ungeheuer hatte immerhin einen Schöpfer, den es fragen konnte: «Warum hast du mich erschaffen?»²⁸ Nokia ist ein Organismus ohne einzelnen Autor, dem diese Frage niemand stellen kann.

Nokia hat die Smartphone-Revolution nicht aus Dummheit verpasst. Die Firma hat sie verpasst, weil die Struktur der Organisation die Wahrheit unmöglich machte. Das Ungeheuer stand im Raum, und alle waren übereingekommen, es nicht zu sehen.

## Die Arktis der technischen Schuld

Wohin verschwinden verlassene Projekte? In Mary Shelleys Roman — in die Arktis. Frankensteins Wesen flieht zum Nordpol, in die Leere, wo keine Menschen sind. Viktor verfolgt es und stirbt im Eis.

Die Arktis der technischen Schuld: der Raum, in den Systeme abwandern, die man aufgegeben hat, aber nicht abschalten kann.

Jeder Konzern, der älter als zehn Jahre ist, hat seine Arktis. COBOL-Systeme in Banken, geschrieben von Menschen, die längst in Rente sind. ERP-Konfigurationen, die niemand vollständig versteht. Interne Werkzeuge, geschrieben 2009 von einem Praktikanten und zur kritischen Infrastruktur (*infrastructure* — die grundlegenden technischen Systeme, die die Arbeit der Organisation sichern) geworden.

Erschaffen mit besten Absichten. Von den Schöpfern verlassen. Umherwandernd in der eisigen Wüste der Konzern-Infrastruktur — verhasst und unersetzlich. Frankensteinsche Wesen im genauesten Sinn.

Frederick Brooks beschrieb in «The Mythical Man-Month» ein Gesetz, das über dem Eingang von Viktors Labor hätte hängen können: «Das Hinzufügen von Personal zu einem verspäteten Projekt macht es noch verspäteter.»¹² (Übertragung des Autors) Ein Ungeheuer-Projekt wird nicht folgsamer durch die Zahl der Menschen, die man ihm zuweist. Es wird komplexer und gefährlicher.

Nach Branchendaten (Standish Group, CHAOS Report 2018) haben Projekte, die wesentliche Entscheidungen aufschieben («*decision latency*»), eine halb so hohe Erfolgsquote¹³. Die Flucht vor der Entscheidung ist keine neutrale Handlung. Es ist ein in die Zeit gestreckter Akt der Zerstörung.

Viktor hätte sich und das Wesen retten können, wenn er geblieben wäre. Nicht davongelaufen. Nicht aufgeschoben. Nicht «delegiert» an ein anderes Team. Geblieben und die Verantwortung für sein Werk übernommen.

Jedes Beispiel dieses Kapitels (FBI, Healthcare.gov, BBC, Nokia) wiederholt ein Muster: Flucht vor der Verantwortung für das Geschaffene. Und jedes Mal kommt die Lösung auf dieselbe Weise: Jemand hört auf zu fliehen und beginnt aufzuräumen.

Eine bittere Ironie liegt darin, dass eine Industrie, die «fail fast, learn fast»²⁶ predigt, sich panisch davor fürchtet, Fehlschläge einzugestehen. *Fail fast* — solange es der A/B-Test einer Schaltfläche auf einer Landingpage ist. Sobald es um ein System für eine halbe Milliarde US-Dollar geht: *fail quietly, blame vendor, restructure leadership*²⁷. Mary Shelley war ehrlicher: In ihrem Roman zahlt Viktor mit dem Leben für die Flucht. Der Konzern-Viktor zahlt für die Flucht mit einer Versetzung in eine andere Abteilung und Aktienoptionen.

## Fünf Phasen des Konzern-Kummers

Bevor wir zur Struktur kommen: eine Beobachtung, die in Prüfberichten nicht steht, die aber jeder kennt, der einen großen Projekt-Fehlschlag durchlebt hat.

Wenn das Konzern-Ungeheuer schließlich anfängt, offen Mobiliar zu zertrümmern und Schaufenster einzuschlagen, durchläuft jede getroffene Organisation unweigerlich fünf klassische Phasen des Kummers, die man wie mit einem Chronometer messen kann:

**Verleugnung der Wirklichkeit.** *Das System arbeitet einwandfrei, die Nutzer sind nur nicht ausreichend in den neuen Verfahren geschult.*¹⁵ Nokia behauptete mit steinerner Miene: «Symbian bleibt eine wettbewerbsfähige Plattform.»¹⁶ Die Verwaltung von Healthcare.gov beharrte: «Das sind vorübergehende Skalierungsprobleme, die sich von selbst lösen.»¹⁷ Viktor Frankenstein redete sich ein: «Das Wesen ist weit in die Berge fortgezogen, es kommt nie wieder.»¹⁸

**Zorn.** *Schuld ist der Auftragnehmer / der Zulieferer / das vorige Team.*¹⁹ Das FBI: «SAIC hat Virtual Case File in den Sand gesetzt.»²⁰ Die BBC: «Siemens hat die DMI nicht bewältigt.»²¹ Viktor: «Dieses Wesen ist ein Ungeheuer, nicht ich.»²²

**Handeln mit der Wirklichkeit.** *Wenn wir dem Budget nur weitere 200 Millionen hinzufügen, oder einen weiteren Systemintegrator anstellen, oder noch eine globale Transformation durchführen — dann wird sich sicher alles auf magische Weise fügen.*²³ Das ist die teuerste aller Phasen; in ihr sind Organisationen bereit, jedes Geld zu zahlen, nur um einen grundlegenden Fehler in der Architektur nicht eingestehen zu müssen. Das FBI verhandelte mit dem Schicksal ganze dreizehn Jahre, die BBC zog diese Phase auf sechs Jahre in die Länge.

**Depression.** *Das Projekt ist tot, das Geld verausgabt, nichts funktioniert.*²⁴ In dieser Phase wechselt man üblicherweise die Führung, strukturiert um, schreibt eine Nachbetrachtung. Eine nützliche Phase — sofern man nicht in ihr steckenbleibt.

**Annahme.** *Wir haben nicht das erschaffen, was wir vorhatten. Nun müssen wir mit dem arbeiten, was da ist.*²⁵ Die einzige produktive Phase. Das FBI erreichte sie 2012. Healthcare.gov — nach zwei Monaten. Die BBC — nie (das Projekt wurde eingestellt).

Viktor Frankenstein erreicht die Annahme zu spät: im Eis, sterbend. Er erzählt seine Geschichte dem Kapitän Walton nicht als Rechtfertigung, sondern als Warnung. Eine Nachbetrachtung im wörtlichen Sinn.

## Der gotische Zyklus: vom Schaffen zum Bekennen

Mary Shelley — nicht zu vergessen: Sie war erst achtzehn — beschrieb einen universellen Zyklus der Selbstzerstörung, den die Konzernwelt mit maniakalischer Genauigkeit alle zehn Jahre wiederentdeckt, als läse sie die Partitur einer Tragödie vom Blatt. Der Zyklus beginnt stets mit ganz aufrichtiger Begeisterung und edlen Beweggründen: Viktor Frankenstein will den Tod besiegen, Direktor Mueller — das Land vor dem Terrorismus schützen, die Architekten von Healthcare.gov — Millionen Amerikanern die Krankenversicherung bringen, die Leitung der BBC — die Fernsehproduktion revolutionieren. Bei allen ist das Problem echt, die Lösung technisch machbar, die Absicht moralisch einwandfrei.

Dann folgt unweigerlich die verhängnisvolle Phase der Isolation — der Schöpfer beginnt, in völliger Abtrennung von denen zu arbeiten, die sein Werk betrifft. Viktor berät sich nicht mit Familie und Kollegen, das FBI gibt das Projekt ganz an einen externen Auftragnehmer ohne tiefe Beteiligung der Agenten ab, Healthcare.gov wird ohne umfassende Prüfung mit wirklichen Nutzern gebaut, die BBC hört schrittweise auf, die eigene Leitung über den tatsächlichen Stand zu informieren. Nur zwei Phasen — und schon hier, in diesem trügerisch stillen Abschnitt des gotischen Romans, ist das Schicksal des Ungeheuers endgültig besiegelt.

Unweigerlich kommt der Augenblick der Wahrheit — der feierliche Übergang in die Produktivumgebung. Frankensteins Wesen öffnet langsam die gelben Augen, das Konzernsystem geht offiziell in die Produktivumgebung, unter dem Trommelwirbel der Pressemitteilungen, und das Ergebnis entspricht in katastrophaler Weise nicht den schönen Erwartungen. Stets, ohne eine einzige Ausnahme.

> Und genau hier zerbricht der Schöpfer. Viktor legt sich schlafen. Der Auftragnehmer übergibt «Phase 1» und wechselt zu einem anderen Vertrag. Die Berater schließen das «Transformationsprojekt» und gehen. Die Führungskraft wechselt in eine «strategische Rolle». Die Flucht sieht nie aus wie Flucht — sie ist stets als Beförderung inszeniert.

Das der Willkür überlassene Werk wird unweigerlich zur zerstörerischen Kraft — und zwar nicht aus angeborener Bosheit oder Architekturmängeln, sondern ausschließlich aus Verlassenheit und Mangel an Fürsorge. Zombie-Prozesse, geerbte Systeme, die Betreuung verlangen und dabei methodisch Ressourcen fressen, epische Fehlschläge, die das Vertrauen der Nutzer systematisch untergraben — all diese Ungeheuer rächen sich nicht, weil sie von Anfang an als Ungeheuer angelegt gewesen wären, sondern ausschließlich, weil ihre Schöpfer im entscheidenden Augenblick flohen und sie ohne Betreuung ließen.

Der einzige Ausweg — das, was Mary Shelley Bekennen nennt und die Prüfer «Übernahme der Verantwortung nach den ersten Verlusten». Das FBI nahm Sentinel Lockheed Martin aus der Hand. Healthcare.gov baute sich mit einer Eingreiftruppe neu. Das Bekennen garantiert keine Rettung — Viktor stirbt im Eis —, aber ohne es lässt sich nicht einmal beginnen, etwas zu bessern. Der Zyklus ist keine Metapher. Er ist ein Betriebsmodell des Scheiterns.

## Vom Ungeheuer zum Kind

Mary Shelley stellte in ihrem gotischen Roman eine grundlegende Frage der Gegenwart: Was geschieht, wenn der Schöpfer einer Technik sein Werk der Willkür überlässt? Aber diese düstere Frage hat einen hellen spiegelnden Zwilling, und dieser muss uns weiter durch die Labyrinthe der Konzern-Wirklichkeit leiten: Was geschieht in den seltenen Fällen, in denen der Schöpfer die Verantwortung übernimmt und bei seinem Werk bleibt?

Das vorige Kapitel über Jules Verne zeigte uns das musterhafte Beispiel eines gesunden Schaffens — Iterationen, ständige Rückkopplung, wechselseitige Anpassung, in denen Schöpfer und Werk als ein System organisch mit einander weiterwachsen. Frankenstein führte die tragischen Folgen eines katastrophalen Reißens dieser lebendigen Verbindung vor Augen. Bleibt die dritte, schwierigste Stellung zu untersuchen — nicht der Augenblick des Schaffens, nicht das Drama des Reißens, sondern die langfristige verantwortliche Begleitung eines Projekts. Das ist keine technische Anweisung, kein Verwaltungszertifikat, keine philosophische Wahl zwischen Wasserfall- und agiler Entwicklung: Es ist ein literarischer Archetyp, in dem der Schöpfer sich bewusst nicht den Folgen entzieht, sondern geduldig lernt, mit dem zu leben und zu arbeiten, was er geschaffen hat.

Dazu muss man das Labor verlassen und in die Baker Street gehen.

---

**Fußnoten**

¹ Giovanni Aldini führte 1803 in London öffentliche Vorführungen des Galvanismus am Körper des hingerichteten George Forster durch. Dokumentiert in *An Account of the Late Improvements in Galvanism* (Aldini, 1804). (Übertragung des Autors)

² Virtual Case File: GAO-05-105, «FBI Trilogy Project», Februar 2005. Das Gesamtbudget des VCF belief sich auf rund 170 Millionen US-Dollar, das Projekt wurde im April 2005 vollständig abgeschrieben. (Übertragung des Autors)

³ Status of Sentinel: DOJ OIG Audit Report 10-03, Oktober 2009. Zu diesem Zeitpunkt hatte Sentinel 405 Millionen US-Dollar der geplanten 451 Millionen ausgegeben und nur 2 der 4 Phasen ausgeliefert. (Übertragung des Autors)

⁴ DOJ OIG Audit Report 12-08, November 2011. «The FBI's Sentinel Information Technology Project». Der Bericht dokumentiert sowohl die Probleme des Projekts unter Lockheed Martin als auch den erfolgreichen Abschluss durch das interne Team des FBI unter agilem Zugang. (Übertragung des Autors)

⁵ Aussagen vor dem Kongress, Oktober 2013. Angaben zur Zahl erfolgreicher Registrierungen am ersten Tag wurden in den Anhörungen des Ausschusses für Energie und Handel des Repräsentantenhauses angeführt.

⁶ US House Committee on Energy and Commerce, Majority Staff Report, «Behind the Curtain of the Healthcare.gov Rollout», September 2016. (Übertragung des Autors)

⁷ GAO-15-238, «Healthcare.gov: CMS Has Taken Steps to Address Problems, but Needs to Further Implement Systems Development Best Practices», März 2015. (Übertragung des Autors)

⁸ UK National Audit Office, HC 985, «The BBC's Digital Media Initiative», Januar 2014. Gesamtkosten des Projekts geschätzt auf 98,4 Mio. £, «the BBC has not achieved value for money». (Übertragung des Autors)

⁹ UK National Audit Office, Briefing for the Public Accounts Committee, «Managing the BBC's Digital Media Initiative», Session 2013–14. (Übertragung des Autors)

¹⁰ Angaben zum Marktanteil Nokias auf der Grundlage von Branchenerhebungen (IDC, Gartner, 2007–2013). Die Jahresberichte der Nokia Corporation bestätigen den Rückwärtstrend.

¹¹ Vuori, T. O. & Huy, Q. N. «Distributed Attention and Shared Emotions in the Innovation Process: How Nokia Lost the Smartphone Battle.» *Administrative Science Quarterly*, Vol. 61, Heft 1, 2016, S. 9–51. Erhebung auf der Grundlage von 76 Interviews mit oberen und mittleren Führungskräften Nokias. (Übertragung des Autors)

¹² Brooks, Frederick P. *The Mythical Man-Month: Essays on Software Engineering* (1975). Addison-Wesley. «Adding manpower to a late software project makes it later» — das Brookssche Gesetz. (Übertragung des Autors)

¹³ Standish Group, CHAOS Report 2018. *Decision Latency Theory*: Zusammenhang zwischen Entscheidungsgeschwindigkeit und Projekterfolg. (Übertragung des Autors)

¹⁴ Shelley, Mary. *Frankenstein, or The Modern Prometheus* (1818). Kapitel 5. Der Augenblick der Belebung des Wesens: «by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open… the beauty of the dream vanished, and breathless horror and disgust filled my heart.» Die berühmte Filmzeile «It's alive!» stammt aus dem Film von James Whale (1931), nicht aus Shelleys Roman. (Übertragung und Anmerkung des Autors)

¹⁵ Typische Aussage von Konzernvertretern in der Phase der Verleugnung — Verallgemeinerung nach Musteranalyse. (Illustration des Autors)

¹⁶ Nokia Corporation. Offizielle Verlautbarungen 2007–2010 — Verallgemeinerung der Konzernkommunikation. (Illustration des Autors)

¹⁷ CMS/Healthcare.gov. Offizielle Verlautbarungen Oktober 2013 — Verallgemeinerung der Krisenkommunikation. (Illustration des Autors)

¹⁸ Shelley, Mary. *Frankenstein, or The Modern Prometheus* (1818). Viktors Gedanken nach der Flucht. (Übertragung des Autors)

¹⁹ Typische Formulierung konzerninterner Verantwortungsverschiebung. (Illustration des Autors)

²⁰ FBI. Offizielle Position zum Fehlschlag des Virtual Case File. (Verallgemeinerung des Autors)

²¹ BBC. Offizielle Position zur DMI. (Verallgemeinerung des Autors)

²² Shelley, Mary. *Frankenstein, or The Modern Prometheus* (1818). Viktors Verhältnis zum Werk. (Übertragung des Autors)

²³ Typische Formulierung des Konzern-Handelns in der Krisenphase. (Illustration des Autors)

²⁴ Depressionsphase im Konzern-Kummerzyklus. (Illustration des Autors)

²⁵ Annahmephase im Konzern-Kummerzyklus. (Illustration des Autors)

²⁶ Eric Ries. *The Lean Startup* (2011). Grundsatz des schnellen Lernens durch Fehlschläge. (Übertragung des Autors)

²⁷ Beobachtung des Autors — Konzern-Antimuster bei großen Fehlschlägen. (Illustration des Autors)

²⁸ Shelley, Mary. *Frankenstein, or The Modern Prometheus* (1818). Die Frage des Wesens an den Schöpfer. (Übertragung des Autors)

---
