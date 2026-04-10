"use client";
import{useState,useEffect}from"react";
const SK="giea_v4";
type Q={q:string;ch:string[];ok:number;ex:string};
type C={t:string;c:string};
type J={id:number;icon:string;title:string;color:string;bg:string;tag:string;desc:string;objectifs:string[];contenu:C[];quiz:Q[]};
type P={scores:Record<number,number>;jourActuel:number};
const JOURS:J[]=[{id:1,icon:"🧠",title:"Posture & CRM",color:"#185FA5",bg:"#E6F1FB",tag:"Fondations",desc:"Monday CRM · deballe · posture",objectifs:["Pipeline LEADS Monday","Statuts RDV","Deballe teleprospecteur","Regle 80/20"],contenu:[{t:"La regle d or",c:"Si ce n est pas dans Monday, ca n existe pas.\n\n80% ecoute, 20% parole.\nChaque action tracee dans Monday.\nUn CRM propre = commercial credible."},{t:"Module LEADS",c:"Statuts (mettre a jour apres CHAQUE appel):\nNouveau / Appel 1 / Appel 2 / Appel 3 / Rappel (noter date) / Non joignable (3 tentatives) / Mauvais numero / RDV\n\nColonnes obligatoires: Nom, Telephone (+33), Ville, Commercial (TON NOM)."},{t:"Module RDV",c:"Le nom ne se copie PAS automatiquement depuis LEADS. Coller manuellement.\n\nChamps: Nom/Prenom, Telephone, Email, Commercial (TON NOM), Date RDV.\nStatuts: planifie > echange > effectue > proposition > R2 > Signe > Sans suite.\nNotes: Produit / Situation pro / Revenus / Mutuelle actuelle / Objections."},{t:"Deballe GIEA",c:"STANDARD: Bonjour [Nom], [Prenom] du cabinet GIEA. Je vous derange pas? Ca va etre tres court. Je ne cherche pas a vendre quelque chose, mais a comparer votre mutuelle et prevoyance pour vous faire economiser plusieurs centaines d euros. Vous etes chez quelle compagnie? Vous payez combien? 10 minutes, gratuit, sans engagement. Matin ou apres-midi?\n\nMADELIN: Je vous appelle concernant votre dispositif Madelin. Votre plafond non utilise est definitivement perdu. Vos contrats sont chez quel assureur? Vous etes toujours independant? Quel montant mensuel tous contrats confondus? 15 minutes, gratuit. Matin ou apres-midi?\n\nRELANCE 2026: On s etait dit de se recontacter en 2026. Avec l indexation, vos contrats ont augmente de 6 a 10% et les remboursements n ont pas suivi. On compare? Matin ou apres-midi?"}],quiz:[{q:"Regle d or CRM GIEA?",ch:["50 appels/jour","Si pas dans Monday = n existe pas","Email avant chaque appel","Ne rien noter"],ok:1,ex:"Si ce n est pas dans Monday, ca n existe pas."},{q:"Statut apres 3 appels sans reponse?",ch:["Rappel","Annule","Non joignable","Mauvais numero"],ok:2,ex:"Non joignable apres 3 tentatives."},{q:"Priorite quand lead accepte RDV?",ch:["Envoyer email","Basculer RDV + coller nom manuellement","Mettre Rappel","Attendre lendemain"],ok:1,ex:"Basculer immediatement. Le nom ne se copie pas automatiquement."},{q:"Colonne Commercial contient:",ch:["Nom manager","Nom client","TON prenom","Produit vise"],ok:2,ex:"Toujours TON NOM."},{q:"Question closing du deballe?",ch:["Vous etes interesse?","Je peux rappeler?","Matin ou apres-midi?","Votre email?"],ok:2,ex:"Alternative fermee matin/apres-midi."},{q:"Repartition ecoute/parole?",ch:["50/50","20% ecoute","80% ecoute / 20% parole","70% parole"],ok:2,ex:"80% ecoute, 20% parole."},{q:"Champ indispensable RDV?",ch:["Ville","Email","Site internet","Date naissance"],ok:1,ex:"L email permet les relances automatiques."},{q:"Statut pour rappel dans 3 jours?",ch:["Non joignable","Appel 2","Rappel + date","RDV"],ok:2,ex:"Rappel avec la date precise."},{q:"Le deballe commence par:",ch:["Presenter le prix","Vouloir vendre","Ne pas vendre mais comparer","Demander email"],ok:2,ex:"Desamorce la resistance des le depart."},{q:"Notes RDV prioritaires?",ch:["Meteo","Produit/situation/revenus/mutuelle/objections","Numero dossier","Code postal"],ok:1,ex:"Notes completes = autonomie sans rappeler le client."}]},{id:2,icon:"🏥",title:"Mutuelle SwissLife",color:"#0F6E56",bg:"#E1F5EE",tag:"Produit",desc:"Script 8 etapes · objections · devis",objectifs:["Script 8 etapes","Garanties cles","Objections mutuelle","Devis"],contenu:[{t:"Pourquoi SwissLife?",c:"Meilleure en remboursements. Moins d augmentations. Garanties negociees GIEA: -20 a -30%."},{t:"Script 8 etapes",c:"1. PRESENTATION: SwissLife meilleure en remboursements, moins d augmentations.\n2. HOSPITALISATION: chirurgie, anesth sie, chambre particuliere.\n3. DENTAIRE: protheses, orthodontie (non remboursee Secu apres 16 ans), implantologie.\n4. OPTIQUE: verres complexes + lentilles. L opticien utilise les deux enveloppes.\n5. SOINS COURANTS: medecins generalistes et specialistes, imagerie.\n6. MEDECINES DOUCES: osteo, acupuncture, chiro. 5 seances/an.\n7. MEDICAMENTS: 150 euros/an/beneficiaire (non rembourses mais prescrits).\n8. CLOSING: resumer les benefices + annoncer le prix."},{t:"Les 3 objections",c:"TROP CHER: Par rapport a quoi exactement? Une couronne = 1000 euros, lunettes = 700 euros. Votre mutuelle vous rembourse combien?\n\nJ AI DEJA: Super, on compare. Vous payez combien et que rembourse-t-elle sur dentaire ou lunettes?\n\nJE REFLECHIS: Je comprends. Qu est-ce qui vous retient? Si je reponds a votre question, on peut avancer?"}],quiz:[{q:"Pourquoi recommander SwissLife?",ch:["Moins chere","Meilleures garanties + moins d augmentations","Seule dispo GIEA","Pas de questionnaire"],ok:1,ex:"Meilleures garanties et moins d augmentations annuelles."},{q:"Orthodontie non remboursee Secu apres?",ch:["12 ans","14 ans","16 ans","18 ans"],ok:2,ex:"Apres 16 ans."},{q:"Seances medecines douces par an?",ch:["3","5","10","Illimite"],ok:1,ex:"5 seances/an."},{q:"Enveloppe medicaments non rembourses?",ch:["100 euros","150 euros","200 euros","250 euros"],ok:1,ex:"150 euros/an/beneficiaire."},{q:"Reponse a j ai deja une mutuelle?",ch:["Votre mutuelle est mauvaise","On compare - vous payez combien et que rembourse-t-elle?","Je ne peux rien faire","Je rappelle dans 6 mois"],ok:1,ex:"Comparaison factuelle, jamais denigrer la concurrence."},{q:"Implantologie et parodontologie?",ch:["Actes de confort","Actes non rembourses Secu","Chirurgie esthetique","Medecines douces"],ok:1,ex:"Actes non rembourses Secu, couverts par SwissLife."},{q:"Structure du script SwissLife?",ch:["Prix d abord","8 etapes: presentation, hospit, dentaire, optique, soins, douces, medicaments, closing","3 etapes","Commencer par medecines douces"],ok:1,ex:"8 etapes dans un ordre precis."},{q:"Face a c est trop cher?",ch:["Quel budget?","Par rapport a quoi exactement?","Vous etes sur?","Je fais une reduction"],ok:1,ex:"Par rapport a quoi force le client a preciser sa reference."},{q:"Remboursement optique SwissLife?",ch:["Verres seulement","Lentilles seulement","Les deux enveloppes cumulees","Choisir une par an"],ok:2,ex:"L opticien utilise les deux enveloppes."},{q:"Reponse a je vais reflechir?",ch:["D accord rappelez-moi","Qu est-ce qui vous retient? Si je reponds on avance?","Prenez le temps","J envoie une brochure"],ok:1,ex:"Identifier le vrai frein, ne jamais laisser partir sans date."}]},{id:3,icon:"🛡️",title:"Prevoyance CEGEMA",color:"#A32D2D",bg:"#FCEBEB",tag:"Produit",desc:"Elite Premium CEGEMA · franchises · chiffres reels",objectifs:["Graphique CEGEMA","Franchises A/H/M","Garanties par coeur","Script prevoyance"],contenu:[{t:"Pourquoi la prevoyance?",c:"CARMF verse 1232 euros/mois (49%) les 3 premiers mois sur 2500 euros de revenu. Sans prevoyance complementaire = catastrophe."},{t:"Outil CEGEMA (giea.cegema.com)",c:"3 etapes: 1. Saisir les donnees adherent 2. Visualiser et ajuster 3. Completer la demande.\n\nChamps: Nom, Revenu mensuel net, Date naissance, Profession, Regime Obligatoire (CARMF/CARPIMKO), Code postal, Fiscalite Madelin.\n\nGraphique: Gris=RO, Bleu=complementaire GIEA, Rouge=cible 100% du revenu."},{t:"Franchises A/H/M",c:"A=Accident / H=Hospitalisation / M=Maladie (jours de carence).\n\nExemple 0-3-15: Accident des J1, Hospit des J4, Maladie des J16.\n\nRecommandation GIEA: 0-3-15 (bon compromis cout/protection)."},{t:"Garanties - Chirurgien 25 ans 2500 euros/mois",c:"Cotisation TTC: 76,60 euros/mois\nDeces: 51,73 + Maintien Revenu: 16,26 + Frais Gen: 0,61 + Confort Hospit: 8,00\n\nCapital deces: 323 000 euros (double si accident).\nIJ franchise 0-3-15: 1267 euros/mois complementaires.\nRente invalidite des J1095: 1156 euros/mois a vie.\nConfort hospitalier: 49 euros/jour."}],quiz:[{q:"CARMF verse combien les 3 premiers mois (2500 euros/mois)?",ch:["2500 euros (100%)","1800 euros","1232 euros (49%)","0 euro"],ok:2,ex:"CARMF verse 1232 euros/mois (49%)."},{q:"Franchise 0-3-15 signifie?",ch:["0 mois, 3 semaines, 15 jours","Accident J1, Hospit J4, Maladie J16","Accident J3, Hospit J1, Maladie J15","Tout des J15"],ok:1,ex:"0=accident J1, 3=hospit J4, 15=maladie J16."},{q:"Cotisation mensuelle chirurgien 25 ans?",ch:["45 euros","62 euros","76,60 euros","120 euros"],ok:2,ex:"76,60 euros/mois TTC toutes garanties."},{q:"La Secu considere invalide a partir de?",ch:["J180","J365","J1095 (3 ans)","J1825"],ok:2,ex:"Apres 3 ans (J1095), la Secu arrete les indemnites."},{q:"Capital deces?",ch:["150000 euros","250000 euros","323000 euros","500000 euros"],ok:2,ex:"323000 euros, double si accident."},{q:"Franchise recommandee GIEA?",ch:["0-3-3","0-3-15","30-30-30","365-365-365"],ok:1,ex:"0-3-15: bon equilibre cout/protection."},{q:"CEGEMA comporte combien d etapes?",ch:["2","3","5","7"],ok:1,ex:"3 etapes: saisie, visualisation, adhesion."},{q:"Rente invalidite?",ch:["430 euros","760 euros","1156 euros","2070 euros"],ok:2,ex:"1156 euros/mois a vie des J1095."},{q:"Le graphique CEGEMA montre?",ch:["Seulement la cotisation","Gris=RO, Bleu=complementaire, Rouge=cible","Seulement remboursements Secu","Comparatif concurrence"],ok:1,ex:"Outil visuel: le client voit le trou a combler."},{q:"Franchise 90-90-90 est moins chere car?",ch:["Elle n existe pas","Moins de garanties","Longue carence = moins de risque assureur","Ne couvre pas hospit"],ok:2,ex:"Plus la carence est longue, moins l assureur verse."}]},{id:4,icon:"📈",title:"PER SwissLife",color:"#854F0B",bg:"#FAEEDA",tag:"Produit",desc:"Madelin · impact fiscal · simulateur",objectifs:["Formule economie fiscale","Plafond Madelin","Deballes officiels","Simulateur 5 onglets"],contenu:[{t:"Le PER et la loi Madelin",c:"Loi Madelin: les independants deduisent fiscalement leurs cotisations de prevoyance, sante et retraite.\n\nUN PLAFOND MADELIN NON UTILISE EST DEFINITIVEMENT PERDU. C est l urgence commerciale absolue."},{t:"La formule - A connaitre par coeur",c:"Economie fiscale = Versement x TMI\n\nExemple Kevin Jarmoune, TNS, 55000 euros, TMI 30%:\nPlafond Madelin 2026: 6541 euros/an\nEconomie fiscale: 6541 x 30% = 1962 euros\nEffort reel: 6541 - 1962 = 4579 euros\nCapital a 67 ans: 908453 euros\n\nPhrase cle: Vous versez 6541 euros. L Etat vous rembourse 1962 euros. Votre effort reel? 4579 euros. C est la seule epargne ou l Etat vous paie pour epargner."},{t:"Simulateur swisslifeone.fr - 5 onglets",c:"1. Plafond Epargne Retraite: saisie (statut TNS, benefice 2026, TMI, date creation).\n2. Impact fiscal: calcul economie en temps reel.\n3. Contrat retraite: versements programmes, allocation Pilotage retraite = equilibre 65% actions.\n4. Modalites de sortie: rente / capital / mixte, reversion.\n5. Resultats detailles: tableau annee par annee jusqu a 67 ans."}],quiz:[{q:"Formule economie fiscale Madelin?",ch:["Versement / TMI","Versement x TMI","Versement + TMI","TMI / Versement"],ok:1,ex:"Economie = Versement x TMI."},{q:"Effort reel Kevin Jarmoune (6541 euros, TMI 30%)?",ch:["6541 euros","1962 euros","4579 euros","3000 euros"],ok:2,ex:"6541 - 1962 = 4579 euros d effort reel."},{q:"Plafond Madelin non utilise?",ch:["Reportable l annee suivante","Definitivement perdu","Transferable au conjoint","Cumulable"],ok:1,ex:"Definitivement perdu - urgence absolue."},{q:"Onglets du simulateur SwissLife PER?",ch:["3","4","5","7"],ok:2,ex:"5 onglets: Plafond, Impact fiscal, Contrat, Modalites, Resultats."},{q:"Economie fiscale TMI 41%, versement 10000 euros?",ch:["1100 euros","4100 euros","5900 euros","10000 euros"],ok:1,ex:"10000 x 41% = 4100 euros."},{q:"Strategie allocation recommandee PER?",ch:["100% fonds euros","Libre","Pilotage retraite","100% actions"],ok:2,ex:"Pilotage retraite: gestion automatique."},{q:"Dans le deballe Madelin, premiere info?",ch:["Email","Assureur actuel","SIRET","Chiffre d affaires"],ok:1,ex:"Quel assureur pour ses contrats actuels?"},{q:"Hausse indexation 2025-2026?",ch:["1-3%","6-10%","15-20%","25%"],ok:1,ex:"6 a 10% - argument central du deballe relance 2026."},{q:"Capital Kevin Jarmoune a 67 ans?",ch:["424264 euros","650000 euros","908453 euros","1200000 euros"],ok:2,ex:"908453 euros dont 504342 euros de produits bruts."},{q:"Phrase cle PER pour TMI 41%?",ch:["Vous bloquez votre argent","L Etat finance 41% de votre epargne retraite","Comme un livret A","Retrait quand vous voulez"],ok:1,ex:"L Etat finance X% de votre epargne retraite."}]},{id:5,icon:"💎",title:"Assurance Vie",color:"#533AB7",bg:"#EEEDFE",tag:"Produit",desc:"Evolution Plus · fiscalite · simulation · objections",objectifs:["5 objectifs simulation","Fiscalite AV","Remplir simulateur","Objections AV"],contenu:[{t:"Pourquoi l assurance vie?",c:"1. DISPONIBLE: retrait possible a tout moment (rachat partiel).\n2. FISCALITE apres 8 ans: abattement 4600 euros/an (celibataire) ou 9200 euros/an (couple).\n3. TRANSMISSION: 152500 euros/beneficiaire hors succession.\n\nVs livret A: plafonne a 22950 euros, rapporte 3%. L AV n a pas de plafond et peut rapporter 2-3x plus sur 10 ans."},{t:"Simulateur Evolution Plus (swisslifeone.fr)",c:"Champs critiques:\n- Situation familiale: impact abattement.\n- Encours AVANT 27/09/2017 ET APRES (regimes fiscaux differents) - NE PAS OUBLIER.\n- Objectif: constituer capital / transmission / rachats partiels / rachats programmes / rente.\n- Horizon de placement.\n- Versement immediat + programme mensuel.\n- Strategie: Deleguee + Equilibre = FORCE 3 (recommande).\n\nErreurs a eviter: oublier les encours existants / Libre pour un debutant / Objectif transmission pour 35 ans."},{t:"Fiscalite en 3 regles",c:"AVANT 8 ANS: flat tax 30% sur gains (12,8% IR + 17,2% PS).\n\nAPRES 8 ANS: abattement 4600 euros/an (celibataire) ou 9200 euros/an (couple). Taux residuel: 7,5% + 17,2% PS.\n\nTRANSMISSION: Primes versees AVANT 70 ans: 152500 euros/beneficiaire hors succession. Apres 70 ans: abattement global 30500 euros seulement. Toujours verser avant 70 ans."},{t:"3 objections AV",c:"C EST BLOQUE? Non. Retrait possible a tout moment. On recommande 8 ans pour la fiscalite, mais c est votre argent.\n\nJ AI UN LIVRET A: Parfait pour l urgence. Mais il plafonne a 22950 euros et rapporte 3%. L AV peut rapporter 2-3x plus sur 10 ans.\n\nC EST RISQUE? Ca depend du profil. Fonds euros = securise. Horizon long = plus de performance. Je vous montre les deux scenarios."}],quiz:[{q:"Abattement AV apres 8 ans pour celibataire?",ch:["2300 euros/an","4600 euros/an","9200 euros/an","15300 euros/an"],ok:1,ex:"4600 euros/an (9200 euros pour un couple)."},{q:"Montant transmissible par beneficiaire hors succession?",ch:["30500 euros","76000 euros","152500 euros","300000 euros"],ok:2,ex:"152500 euros/beneficiaire pour primes versees avant 70 ans."},{q:"Distinction critique dans le simulateur?",ch:["Euros vs UC","Primes avant vs apres 27/09/2017","Recentes vs anciennes","SwissLife vs autres"],ok:1,ex:"Date du 27/09/2017 - regime fiscal different."},{q:"Strategie recommandee Evolution Plus?",ch:["100% fonds euros","Libre","Deleguee + Equilibre FORCE 3","100% UC offensives"],ok:2,ex:"Deleguee + Equilibre. Jamais Libre pour un debutant."},{q:"Flat tax avant 8 ans?",ch:["15%","24,7%","30%","40%"],ok:2,ex:"30% (12,8% IR + 17,2% PS)."},{q:"Reponse a c est bloque?",ch:["Oui 8 ans minimum","Non totalement inaccessible","Non, rachat partiel a tout moment, 8 ans c est pour la fiscalite","Oui sauf deces"],ok:2,ex:"Jamais bloque. Rachat partiel a tout moment."},{q:"Pourquoi verser avant 70 ans?",ch:["Meilleurs rendements","152500 euros/beneficiaire hors succession","Contrat ferme apres 70 ans","Frais moins eleves"],ok:1,ex:"Apres 70 ans l abattement global n est que 30500 euros."},{q:"Combien d objectifs de simulation Evolution Plus?",ch:["2","3","5","8"],ok:2,ex:"5 objectifs: capital, transmission, rachats partiels, rachats programmes, rente."},{q:"Plafond du Livret A?",ch:["10000 euros","15300 euros","22950 euros","30000 euros"],ok:2,ex:"22950 euros. L AV n a pas de plafond."},{q:"Erreur critique lors de la saisie?",ch:["Saisir date naissance","Oublier les encours existants avant/apres 27/09/2017","Choisir objectif avant strategie","Mettre versement en mensuel"],ok:1,ex:"Oublier les encours fausse entierement le calcul fiscal."}]},{id:6,icon:"🎯",title:"Scripts & Closing",color:"#3B6D11",bg:"#EAF3DE",tag:"Vente",desc:"5 objections · 3 deballes · closing GIEA",objectifs:["5 objections majeures","3 deballes","Techniques de closing","Avant/pendant/apres RDV"],contenu:[{t:"Les 5 objections",c:"1. TROP CHER - Par rapport a quoi? Une couronne = 1000 euros. Votre mutuelle rembourse combien?\n2. JE REFLECHIS - Qu est-ce qui vous retient? Si je reponds maintenant, on peut avancer?\n3. J AI DEJA - On compare. Vous payez combien? Sur votre dernier acte dentaire vous avez recupere combien?\n4. PAS LE TEMPS - 10 minutes, le temps d un cafe. Je viens ou vous voulez. Mardi ou jeudi?\n5. J EN PARLE A MA FEMME - On peut l inclure directement. Vous etes libres vendredi? On fait ca ensemble, 20 minutes."},{t:"Techniques de closing",c:"ALTERNATIF (le plus efficace): On demarre le 1er ou le 15 du mois? Pour quelle date je vous prepare le dossier?\n\nPAR RESUME: Donc on est d accord: [3 benefices]. Pour X euros/mois. On y va?\n\nPAR URGENCE (Madelin): Si on ne fait rien ce mois-ci, votre plafond est definitivement perdu.\n\nAPRES OBJECTION: [Traiter] -> Ca repond a votre question? Dans ce cas, on peut avancer?"},{t:"Avant / Pendant / Apres RDV",c:"AVANT: Relire la fiche dans Monday. Preparer le devis. Confirmation RDV par SMS/email la veille.\n\nPENDANT: 1. Accueil (2 min): pas de vente forcee. 2. Decouverte (10 min): questions ouvertes, ecouter. 3. Diagnostic (5 min): montrer le gap. 4. Presentation (10 min): solution sur-mesure, chiffres. 5. Closing (5 min): alternative fermee.\n\nAPRES: Mettre a jour Monday IMMEDIATEMENT. Envoyer devis dans les 2 heures. Relance J+2. Relance J+5. Delai retractation: 14 jours, relance J+12."}],quiz:[{q:"Face a trop cher, premiere chose?",ch:["Reduction immediate","Defendre le prix","Demander par rapport a quoi?","Changer de produit"],ok:2,ex:"Par rapport a quoi force le client a preciser sa reference."},{q:"Strategie j en parle a ma femme?",ch:["Accepter et attendre","Insister pour signer seul","Proposer RDV avec les deux conjoints","Envoyer email au couple"],ok:2,ex:"Inclure le decisionnaire dans le prochain RDV."},{q:"Closing alternatif GIEA?",ch:["Vous etes interesse?","On demarre le 1er ou le 15?","Je vous envoie une brochure?","Vous avez besoin de temps?"],ok:1,ex:"Alternative entre deux options positives."},{q:"Que faire immediatement apres un RDV?",ch:["Appeler le manager","Mettre a jour Monday + envoyer devis dans 2h","Attendre que le client rappelle","Preparer prochain RDV"],ok:1,ex:"Monday IMMEDIATEMENT + devis dans les 2 heures."},{q:"Face a pas le temps?",ch:["Je rappelle dans un mois","10 minutes, le temps d un cafe. Mardi ou jeudi?","C est dommage","Envoyez vos documents"],ok:1,ex:"Reduire la perception d effort + alternative fermee."},{q:"Apres avoir traite une objection?",ch:["Insister sur le prix","Reformuler differemment","Ca repond a votre question? On peut avancer?","Changer de produit"],ok:2,ex:"Valider que le client est satisfait, puis demander l avancement."},{q:"L urgence closing Madelin est legitime car?",ch:["On invente une pression","Le plafond est reellement perdu definitivement","La cotisation va augmenter","Regle interne GIEA"],ok:1,ex:"Urgence reelle et factuelle, jamais inventee."},{q:"Delai max pour envoyer le devis apres RDV?",ch:["24 heures","2 heures","48 heures","1 semaine"],ok:1,ex:"2 heures maximum."},{q:"Delai de retractation apres signature?",ch:["7 jours","10 jours","14 jours","30 jours"],ok:2,ex:"14 jours legaux - prevoir relance J+12."},{q:"Reponse a j ai deja une assurance?",ch:["Votre mutuelle est mauvaise","On compare - vous payez combien et que rembourse-t-elle?","Resiliez immediatement","Je ne peux rien faire"],ok:1,ex:"Comparaison factuelle, jamais denigrer la concurrence."}]},{id:7,icon:"🏆",title:"Certification",color:"#533AB7",bg:"#EEEDFE",tag:"Certification",desc:"Evaluation finale · 8/10 requis",objectifs:["Valider toutes les connaissances","Obtenir la certification"],contenu:[{t:"Recap Fondations",c:"80% ecoute / 20% parole. Si pas dans Monday = n existe pas. Chaque appel = mise a jour pipeline. Nom RDV = copier manuellement. Deballe: pas vendre mais comparer... matin ou apres-midi?"},{t:"Recap Produits",c:"MUTUELLE SwissLife (8 etapes): hospit, dentaire (ortho>16 ans), optique, soins, medecines douces (5 seances), medicaments (150 euros), auditif, closing.\n\nPREVOYANCE CEGEMA: 76,60 euros/mois, capital 323000 euros, IJ 1267 euros (0-3-15), rente 1156 euros des J1095.\n\nPER SwissLife: Versement x TMI, 6541 x 30% = 1962 euros, effort 4579 euros, capital 908453 euros a 67 ans.\n\nASSURANCE VIE: avant 8 ans=30%, apres 8 ans=abattement 4600 euros, transmission 152500 euros/beneficiaire."}],quiz:[{q:"Formule economie fiscale Madelin?",ch:["Versement+TMI","Versement x TMI","Versement/TMI","TMI x 12"],ok:1,ex:"Versement x TMI = economie fiscale."},{q:"Cotisation prevoyance chirurgien 25 ans?",ch:["45 euros","62 euros","76,60 euros","95 euros"],ok:2,ex:"76,60 euros/mois TTC toutes garanties."},{q:"Abattement AV apres 8 ans (celibataire)?",ch:["2300 euros","4600 euros","9200 euros","15300 euros"],ok:1,ex:"4600 euros/an pour un celibataire."},{q:"Plafond Madelin non utilise?",ch:["Reportable","Definitivement perdu","Cumulable 3 ans","Investi automatiquement"],ok:1,ex:"Definitivement perdu - urgence absolue."},{q:"Quand un lead accepte RDV?",ch:["Attendre le lendemain","Basculer RDV + coller nom manuellement","Mettre Rappel","Envoyer email seulement"],ok:1,ex:"Basculer immediatement. Nom a coller manuellement."},{q:"Franchise prevoyance recommandee GIEA?",ch:["0-3-3","0-3-15","30-30-30","90-90-90"],ok:1,ex:"0-3-15: bon compromis cout/protection."},{q:"Transmission hors succession AV?",ch:["76000 euros","100000 euros","152500 euros","230000 euros"],ok:2,ex:"152500 euros/beneficiaire avant 70 ans."},{q:"Reponse a je vais reflechir?",ch:["D accord rappelez-moi","Qu est-ce qui vous retient? Si je reponds on avance?","Prenez le temps","J envoie un email"],ok:1,ex:"Identifier le vrai frein."},{q:"Regle d or CRM GIEA?",ch:["50 appels/jour","Si pas dans Monday = n existe pas","Email avant chaque appel","Ne rien noter"],ok:1,ex:"Si ce n est pas dans Monday, ca n existe pas."},{q:"Rente invalidite prevoyance?",ch:["430 euros/mois","760 euros/mois","1156 euros/mois","2070 euros/mois"],ok:2,ex:"1156 euros/mois a vie des J1095."},{q:"Closing alternatif GIEA?",ch:["Vous etes interesse?","On demarre le 1er ou le 15?","Je vous envoie une brochure?","Prenez le temps"],ok:1,ex:"Le 1er ou le 15 - force un choix positif."},{q:"Script mutuelle: etapes apres optique?",ch:["Closing directement","Soins courants, medecines douces, medicaments, closing","Hospitalisation a nouveau","Dentaire a nouveau"],ok:1,ex:"Apres optique: soins courants, medecines douces (5 seances), medicaments (150 euros), closing."}]}];
export default function GIEAFormation(){
  const[jour,setJour]=useState<J|null>(null);
  const[view,setView]=useState<"home"|"learn"|"quiz">("home");
  const[cidx,setCidx]=useState(0);
  const[answers,setAnswers]=useState<Record<number,number>>({});
  const[submitted,setSubmitted]=useState(false);
  const[score,setScore]=useState(0);
  const[prog,setProg]=useState<P>({scores:{},jourActuel:1});
  useEffect(()=>{try{const r=localStorage.getItem(SK);if(r)setProg(JSON.parse(r));}catch{}},[]);
  const save=(p:P)=>{setProg(p);try{localStorage.setItem(SK,JSON.stringify(p));}catch{}};
  const open=(j:J)=>{if(j.id>prog.jourActuel)return;setJour(j);setCidx(0);setAnswers({});setSubmitted(false);setScore(0);setView("learn");};
  const submit=()=>{
    if(!jour)return;
    let ok=0;jour.quiz.forEach((q,i)=>{if(answers[i]===q.ok)ok++;});
    const s=Math.round((ok/jour.quiz.length)*10);setScore(s);setSubmitted(true);
    const min=jour.id===7?8:7;
    const ns={...prog.scores,[jour.id]:Math.max(s,prog.scores[jour.id]??0)};
    const nj=s>=min&&jour.id===prog.jourActuel&&prog.jourActuel<7?prog.jourActuel+1:prog.jourActuel;
    save({scores:ns,jourActuel:nj});
  };
  const validCount=Object.entries(prog.scores).filter(([k,v])=>v>=(Number(k)===7?8:7)).length;
  const best=Object.values(prog.scores).length>0?Math.max(...Object.values(prog.scores)):null;
  const card=(extra?:React.CSSProperties):React.CSSProperties=>({background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",padding:"20px",marginBottom:16,...extra});
  const gbtn=(c:string):React.CSSProperties=>({background:"transparent",border:"1.5px solid "+c,color:c,borderRadius:"var(--border-radius-md)",padding:"9px 20px",fontWeight:600,fontSize:14,cursor:"pointer"});
  const pbtn=(c:string,ex?:React.CSSProperties):React.CSSProperties=>({background:c,color:"#fff",border:"none",borderRadius:"var(--border-radius-md)",padding:"10px 22px",fontWeight:600,fontSize:14,cursor:"pointer",...ex});
  const j=jour;
  if(!j||view==="home")return(
    <div style={{minHeight:"100vh",background:"var(--color-background-tertiary)",padding:"20px 16px",fontFamily:"var(--font-sans)"}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={card({textAlign:"center"})}>
          <div style={{fontSize:36,marginBottom:8}}>🏛️</div>
          <h1 style={{fontSize:20,fontWeight:600,marginBottom:6}}>GIEA Paris 16 — Formation Closer</h1>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:14}}>Parcours certifiant · 7/10 minimum par jour · 8/10 pour la certification</p>
          <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap"}}>
            {[{l:"Jour actuel",v:prog.jourActuel+"/7"},{l:"Jours valides",v:validCount+"/7"},{l:"Meilleur",v:best?best+"/10":"—"}].map((m,i)=>(
              <div key={i} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"8px 14px",minWidth:90}}>
                <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:2}}>{m.l}</div>
                <div style={{fontSize:18,fontWeight:600}}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {JOURS.map(jj=>{
            const locked=jj.id>prog.jourActuel;
            const sc=prog.scores[jj.id];
            const min=jj.id===7?8:7;
            const ok=sc!==undefined&&sc>=min;
            const fail=sc!==undefined&&sc<min;
            return(
              <button key={jj.id} onClick={()=>!locked&&open(jj)} style={{background:"var(--color-background-primary)",border:"0.5px solid "+(ok?jj.color:fail?"#E24B4A":"var(--color-border-tertiary)"),borderRadius:"var(--border-radius-lg)",padding:"14px",cursor:locked?"not-allowed":"pointer",textAlign:"left",opacity:locked?0.45:1,position:"relative"}}>
                <div style={{position:"absolute",top:8,right:10,fontSize:11,fontWeight:600,color:ok?jj.color:fail?"#E24B4A":"var(--color-text-secondary)"}}>
                  {locked?"🔒":ok?sc+"/10 ✓":fail?sc+"/10 ✗":jj.id===prog.jourActuel?"● En cours":""}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:18}}>{jj.icon}</span>
                  <span style={{fontSize:10,fontWeight:600,color:jj.color,background:jj.bg,padding:"2px 7px",borderRadius:10}}>Jour {jj.id} · {jj.tag}</span>
                </div>
                <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{jj.title}</div>
                <div style={{fontSize:11,color:"var(--color-text-secondary)",lineHeight:1.4}}>{jj.desc}</div>
              </button>
            );
          })}
        </div>
        <div style={{textAlign:"center"}}>
          <button onClick={()=>save({scores:{},jourActuel:1})} style={{background:"none",border:"none",color:"var(--color-text-secondary)",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Reinitialiser la progression</button>
        </div>
      </div>
    </div>
  );
  if(view==="learn"){
    const bloc=j.contenu[cidx];
    const isLast=cidx===j.contenu.length-1;
    return(
      <div style={{minHeight:"100vh",background:"var(--color-background-tertiary)",padding:"20px 16px",fontFamily:"var(--font-sans)"}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <button onClick={()=>setView("home")} style={gbtn(j.color)}>← Retour</button>
            <span style={{fontSize:13,color:"var(--color-text-secondary)",flex:1}}>{j.icon} Jour {j.id} — {j.title}</span>
            <span style={{fontSize:12,color:j.color,fontWeight:700}}>{cidx+1}/{j.contenu.length}</span>
          </div>
          {cidx===0&&(
            <div style={card({borderLeft:"3px solid "+j.color})}>
              <div style={{fontWeight:700,fontSize:13,color:j.color,marginBottom:10}}>🎯 Objectifs du jour</div>
              {j.objectifs.map((o,i)=>(
                <div key={i} style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:5,display:"flex",gap:8}}>
                  <span style={{color:j.color}}>✓</span>{o}
                </div>
              ))}
            </div>
          )}
          <div style={card()}>
            <h2 style={{fontSize:17,fontWeight:700,color:j.color,marginBottom:14}}>{bloc.t}</h2>
            {bloc.c.split("\n").map((line,i)=>{
              if(!line.trim())return<div key={i} style={{height:8}}/>;
              const bold=line.startsWith("•")||line.startsWith("1.")||line.startsWith("2.")||line.startsWith("3.")||line.startsWith("4.")||line.startsWith("5.")||line.startsWith("AVANT")||line.startsWith("PENDANT")||line.startsWith("APRES")||line.startsWith("STANDARD")||line.startsWith("MADELIN")||line.startsWith("RELANCE")||line.startsWith("TROP")||line.startsWith("J AI")||line.startsWith("JE ")||line.startsWith("PAS ")||line.startsWith("C EST")||line.startsWith("AVANT")||line.startsWith("APRES")||line.startsWith("ALTERNATIF")||line.startsWith("PAR ")||line.startsWith("MUTUELLE")||line.startsWith("PREVOYANCE")||line.startsWith("PER ")||line.startsWith("ASSURANCE");
              return<div key={i} style={{fontSize:14,lineHeight:1.75,marginBottom:bold?6:2,fontWeight:bold?600:400}}>{line}</div>;
            })}
          </div>
          <div style={{background:"var(--color-background-secondary)",borderRadius:99,height:6,marginBottom:16,overflow:"hidden"}}>
            <div style={{width:((cidx+1)/j.contenu.length*100)+"%",height:"100%",background:j.color,borderRadius:99,transition:"width 0.3s"}}/>
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"space-between"}}>
            <button disabled={cidx===0} onClick={()=>setCidx(i=>i-1)} style={gbtn(j.color)}>← Precedent</button>
            {isLast
              ?<button onClick={()=>setView("quiz")} style={pbtn(j.color)}>Passer au quiz →</button>
              :<button onClick={()=>setCidx(i=>i+1)} style={pbtn(j.color)}>Suivant →</button>
            }
          </div>
        </div>
      </div>
    );
  }
  const min=j.id===7?8:7;
  const isPass=score>=min;
  const correctCount=j.quiz.filter((q,i)=>answers[i]===q.ok).length;
  const wrongIdxs=j.quiz.map((q,i)=>({q,i})).filter(({q,i})=>answers[i]!==q.ok);
  if(submitted)return(
    <div style={{minHeight:"100vh",background:"var(--color-background-tertiary)",padding:"20px 16px",fontFamily:"var(--font-sans)"}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={card({textAlign:"center",borderTop:"4px solid "+(isPass?j.color:"#E24B4A")})}>
          <div style={{fontSize:48,marginBottom:8}}>{isPass?"🎉":"📚"}</div>
          <div style={{fontSize:36,fontWeight:800,color:isPass?j.color:"#E24B4A",marginBottom:4}}>{score}/10</div>
          <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{isPass?"Jour "+j.id+" valide!":"Score insuffisant — minimum "+min+"/10"}</div>
          <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>{correctCount}/{j.quiz.length} bonnes reponses</div>
        </div>
        {wrongIdxs.length>0&&(
          <div style={card()}>
            <div style={{fontWeight:700,fontSize:15,color:"#A32D2D",marginBottom:14}}>❌ Questions ratees — Corrections</div>
            {wrongIdxs.map(({q,i})=>(
              <div key={i} style={{marginBottom:18,padding:14,background:"#FCEBEB",borderRadius:"var(--border-radius-md)",border:"0.5px solid #F09595"}}>
                <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>Q{i+1}. {q.q}</div>
                <div style={{fontSize:12,color:"#A32D2D",marginBottom:4}}>❌ Votre reponse: {q.ch[answers[i]]}</div>
                <div style={{fontSize:12,color:"#3B6D11",marginBottom:8}}>✅ Bonne reponse: {q.ch[q.ok]}</div>
                <div style={{fontSize:12,color:"var(--color-text-secondary)",borderTop:"0.5px solid #F09595",paddingTop:8}}>💡 {q.ex}</div>
              </div>
            ))}
          </div>
        )}
        {correctCount>0&&(
          <div style={card({borderLeft:"3px solid "+j.color})}>
            <div style={{fontWeight:700,fontSize:14,color:j.color,marginBottom:10}}>✅ Points maitrises ({correctCount})</div>
            {j.quiz.filter((_,i)=>answers[i]===j.quiz[i].ok).map((q,i)=>(
              <div key={i} style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}>• {q.q}</div>
            ))}
          </div>
        )}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {!isPass&&<button onClick={()=>{setAnswers({});setSubmitted(false);}} style={pbtn("#E24B4A",{flex:1})}>🔄 Refaire le test</button>}
          <button onClick={()=>{setView("learn");setCidx(0);setAnswers({});setSubmitted(false);}} style={gbtn(j.color)}>Revoir le cours</button>
          <button onClick={()=>setView("home")} style={pbtn(j.color,{flex:1})}>{isPass&&prog.jourActuel>j.id?"Jour suivant →":"← Accueil"}</button>
        </div>
      </div>
    </div>
  );
  const allAnswered=j.quiz.every((_,i)=>answers[i]!==undefined);
  return(
    <div style={{minHeight:"100vh",background:"var(--color-background-tertiary)",padding:"20px 16px",fontFamily:"var(--font-sans)"}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <button onClick={()=>setView("learn")} style={gbtn(j.color)}>← Cours</button>
          <span style={{flex:1,fontWeight:600,fontSize:14}}>{j.icon} Quiz — Jour {j.id}</span>
          <span style={{fontSize:12,color:j.color,fontWeight:700}}>Min. {min}/10</span>
        </div>
        <div style={card({textAlign:"center",background:j.bg,border:"1px solid "+j.color+"20",marginBottom:16})}>
          <div style={{fontSize:13,color:j.color,fontWeight:600}}>{j.quiz.length} questions · {Object.keys(answers).length}/{j.quiz.length} repondues</div>
        </div>
        {j.quiz.map((q,i)=>(
          <div key={i} style={card()}>
            <div style={{fontWeight:600,fontSize:14,marginBottom:12,lineHeight:1.5}}>
              <span style={{color:j.color,fontWeight:800}}>Q{i+1}.</span> {q.q}
            </div>
            {q.ch.map((c,ci)=>{
              const sel=answers[i]===ci;
              return(
                <div key={ci} onClick={()=>setAnswers(a=>({...a,[i]:ci}))} style={{padding:"10px 14px",marginBottom:8,borderRadius:"var(--border-radius-md)",cursor:"pointer",border:"1.5px solid "+(sel?j.color:"var(--color-border-tertiary)"),background:sel?j.bg:"var(--color-background-secondary)",fontSize:13,fontWeight:sel?600:400,transition:"all 0.15s"}}>
                  <span style={{color:j.color,fontWeight:700,marginRight:8}}>{["A","B","C","D"][ci]}.</span>{c}
                </div>
              );
            })}
          </div>
        ))}
        <div style={card({textAlign:"center"})}>
          <button onClick={submit} disabled={!allAnswered} style={pbtn(j.color,{fontSize:15,padding:"12px 40px",opacity:allAnswered?1:0.5})}>Valider mes reponses →</button>
          {!allAnswered&&<div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:8}}>Repondez a toutes les questions avant de valider</div>}
        </div>
      </div>
    </div>
  );
        }
