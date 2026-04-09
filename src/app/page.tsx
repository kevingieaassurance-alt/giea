

```tsx
"use client";
import { useState, useEffect, useCallback } from "react";

/* ── TYPES ── */
interface Q { q: string; choices: string[]; correct: number; expl: string; }
interface Jour { id: number; icon: string; title: string; color: string; bg: string; tag: string; desc: string; objectifs: string[]; blocs: { titre: string; corps: string }[]; quiz: Q[]; }
interface Progress { scores: Record; current: number; failed: Record; }

/* ── PALETTE ── */
const C = { j1:"#185FA5", j2:"#0F6E56", j3:"#A32D2D", j4:"#854F0B", j5:"#533AB7", j6:"#3B6D11", j7:"#0F6E56" };
const BG = { j1:"#E6F1FB", j2:"#E1F5EE", j3:"#FCEBEB", j4:"#FAEEDA", j5:"#EEEDFE", j6:"#EAF3DE", j7:"#E1F5EE" };

/* ── DATA ── */
const DATA: Jour[] = [
  {
    id:1, icon:"🧠", title:"Posture & CRM Monday", color:C.j1, bg:BG.j1,
    tag:"Fondations", desc:"Maîtriser le CRM et la posture commerciale GIEA",
    objectifs:["Règle d'or du CRM Monday","Statuts du pipeline LEADS","Module RDV complet","Déballe téléprospecteur GIEA"],
    blocs:[
      { titre:"La règle d'or GIEA",
        corps:`Si ce n'est pas dans Monday, ça n'existe pas.\n\n• 80% d'écoute, 20% de parole en RDV\n• Chaque action tracée dans le CRM Monday\n• Un CRM propre = un commercial crédible\n• Le manager consulte Monday tous les jours\n\nUn lead non tracé = une vente perdue. Sans exception.` },
      { titre:"Module LEADS — Pipeline",
        corps:`Groupes de leads GIEA :\n• LEAD KINÉ : 6 213 leads\n• LEAD KEV : 7 337 leads\n• Psychiatre : 1 692 leads\n• Infirmière : 1 541 leads\n• LEAD DOM-TOM : 3 192 leads\n\nStatuts pipeline (mettre à jour après CHAQUE appel) :\n→ Nouveau : lead jamais contacté\n→ Appel 1 / Appel 2 / Appel 3 : tentatives successives\n→ Rappel : prospect demande un rappel (noter la date !)\n→ Non joignable : 3 appels sans réponse\n→ Mauvais numéro : ne plus contacter\n→ RDV : basculer IMMÉDIATEMENT dans le module RDV\n\nColonnes OBLIGATOIRES : Nom, Téléphone, Ville, Commercial (TON NOM).` },
      { titre:"Module RDV — Alerte critique",
        corps:`Quand un lead accepte un RDV :\n→ Basculer IMMÉDIATEMENT dans le board RDV\n→ ⚠️ Le nom ne se copie PAS automatiquement. Coller manuellement.\n\nChamps OBLIGATOIRES :\n• Nom / Prénom\n• Téléphone\n• Email (indispensable pour les relances)\n• Commercial (TON NOM)\n• Date et heure du RDV\n\nNotes obligatoires :\nProduit / Situation pro / Revenus / Mutuelle actuelle / Objections / Prochaine étape\n\nStatuts RDV : RDV planifié → En échange → Effectué → Proposition envoyée → R2 → Signé → Sans suite` },
      { titre:"Le déballe téléprospecteur GIEA",
        corps:`Script officiel — à mémoriser mot pour mot :\n\n"Bonjour Monsieur/Madame [Nom] ? Oui bonjour, [Prénom] du cabinet G.I.E.A. Je vous dérange pas ?\n\n[petite pause]\n\nÇa va être très court — je ne cherche pas à vous vendre quelque chose, mais plutôt à comparer votre mutuelle et votre prévoyance avec celles avec qui on travaille, dans le but de vous faire économiser plusieurs centaines d'euros par an ou d'obtenir de meilleures garanties.\n\nVous êtes chez quelle compagnie actuellement ? Et vous payez environ combien par mois ?\n\nCe que je vous propose, c'est un petit rendez-vous de 10 minutes, gratuit et sans engagement, pour comparer. Vous préférez matin ou après-midi ?"` },
    ],
    quiz:[
      { q:"Quelle est la règle d'or du CRM GIEA ?", choices:["Appeler 50 prospects/jour","Si ce n'est pas dans Monday, ça n'existe pas","Envoyer un email avant chaque appel","Ne jamais noter d'infos personnelles"], correct:1, expl:"Règle absolue : si ce n'est pas dans Monday, ça n'existe pas. Chaque action doit être tracée sans exception." },
      { q:"Quel statut mettre après 3 appels sans réponse ?", choices:["Rappel","Annulé","Non joignable","Mauvais numéro"], correct:2, expl:"Après 3 tentatives sans réponse établie → 'Non joignable'." },
      { q:"Quand basculer un lead en RDV dans Monday ?", choices:["Le lendemain du RDV","Seulement si le client signe","IMMÉDIATEMENT quand le prospect accepte","À la fin de la semaine"], correct:2, expl:"Basculer IMMÉDIATEMENT dans le board RDV dès l'accord du prospect. Attention : coller le nom manuellement." },
      { q:"Que doit OBLIGATOIREMENT contenir la colonne 'Commercial' ?", choices:["Le nom du manager","Le nom du client","Ton propre prénom","Le produit visé"], correct:2, expl:"La colonne Commercial doit toujours contenir TON NOM. Sans cela, personne ne sait qui travaille le lead." },
      { q:"Comment se termine le déballe téléprospecteur pour obtenir le RDV ?", choices:["Vous êtes intéressé ?","Je peux vous rappeler ?","Vous préférez matin ou après-midi ?","Quel est votre email ?"], correct:2, expl:"'Vous préférez matin ou après-midi ?' — alternative fermée qui force le choix entre deux créneaux, pas un oui/non." },
      { q:"Quelle répartition écoute/parole en RDV ?", choices:["50/50","20% écoute / 80% parole","80% écoute / 20% parole","60% parole / 40% écoute"], correct:2, expl:"80% d'écoute, 20% de parole. Le commercial qui parle trop perd la vente." },
      { q:"Quel champ est indispensable dans le module RDV pour les relances automatiques ?", choices:["La ville","L'email du prospect","Le site internet","La date de naissance"], correct:1, expl:"L'email est indispensable pour les relances automatiques et l'envoi du devis." },
      { q:"Que faire quand un prospect demande d'être rappelé dans 3 jours ?", choices:["Non joignable","Appel 2","Rappel + noter la date dans les commentaires","RDV"], correct:2, expl:"Statut 'Rappel' avec la date précise notée. Sans la date, le rappel n'aura jamais lieu." },
      { q:"Le déballe commence par :", choices:["Présenter le prix","Dire qu'on veut vendre","Préciser qu'on cherche à comparer, pas à vendre","Demander l'email"], correct:2, expl:"'Je ne cherche pas à vous vendre quelque chose, mais à comparer...' — désamorce la résistance immédiatement." },
      { q:"Combien de groupes de leads minimum dans le CRM GIEA ?", choices:["2 groupes","3 groupes","5 groupes ou plus","1 seul groupe"], correct:2, expl:"LEAD KINÉ, LEAD KEV, Psychiatre, Infirmière, LEAD DOM-TOM — minimum 5 groupes distincts." },
    ]
  },
  {
    id:2, icon:"🏥", title:"Mutuelle SwissLife", color:C.j2, bg:BG.j2,
    tag:"Produit", desc:"Script 8 étapes SwissLife + objections + devis",
    objectifs:["Les 8 étapes du script SwissLife","Garanties clés à retenir","3 objections mutuelle","Présenter le devis"],
    blocs:[
      { titre:"Pourquoi SwissLife ?",
        corps:`SwissLife est recommandée chez GIEA pour 3 raisons :\n• Meilleure en termes de remboursements\n• Celle qui subit le moins d'augmentations annuelles\n• Garanties négociées exclusivement pour les adhérents GIEA (-20 à -30%)\n\nLa mutuelle est le produit d'entrée car :\n→ Tout le monde en a une\n→ Tout le monde paye trop cher\n→ C'est la porte vers la prévoyance et le PER` },
      { titre:"Script SwissLife — 8 étapes",
        corps:`Étape 1 — PRÉSENTATION\n"Monsieur Bruno, je vais vous présenter SwissLife — la meilleure en remboursements et celle qui augmente le moins."\n\nÉtape 2 — HOSPITALISATION\nChirurgie, anesthésie, honoraires médicaux pris en charge à X% de la base Sécu. Forfait journalier couvert. Chambre particulière : X€/jour.\n\nÉtape 3 — DENTAIRE\nSoins, prothèses, orthodontie à X%. Enveloppe actes non remboursés.\n⚠️ L'orthodontie n'est plus remboursée par la Sécu après 16 ans.\n\nÉtape 4 — OPTIQUE\nEnveloppe verres complexes (progressifs) + enveloppe lentilles. L'opticien utilise les deux = budget maximum.\n\nÉtape 5 — SOINS COURANTS & RADIOLOGIE\nMédecins généralistes et spécialistes à X%. Imagerie incluse. Peu ou pas de reste à charge.\n\nÉtape 6 — MÉDECINES DOUCES\nOstéopathie, acupuncture, chiro, podologie : 5 séances/an.\n\nÉtape 7 — MÉDICAMENTS\n150€/an/bénéficiaire pour médicaments non remboursés mais prescrits.\n\nÉtape 8 — CLOSING\n"Concrètement : garanties sur-mesure, grosse enveloppe optique, 5 séances de médecines douces, 150€ médicaments... L'ensemble revient à X€/mois."` },
      { titre:"3 objections mutuelle",
        corps:`OBJECTION 1 : "C'est trop cher"\nCourt : "Par rapport à quoi ?"\nCommercial : "Une couronne dentaire sans couverture : 1 000€. Une paire de lunettes progressives : 700€. Votre mutuelle vous rembourse combien sur ces actes-là ?"\n\nOBJECTION 2 : "J'ai déjà une mutuelle"\nCourt : "Très bien, on compare."\nCommercial : "Vous payez combien ? Et sur votre dernier soin dentaire ou vos lunettes, vous avez récupéré combien ? Je vous montre ce que SwissLife vous aurait donné."\n\nOBJECTION 3 : "Je vais réfléchir"\nCourt : "Je comprends. Qu'est-ce qui vous retient ?"\nCommercial : "La plupart du temps c'est une info qui manque. Si je réponds à votre question maintenant, on peut avancer ?"` },
    ],
    quiz:[
      { q:"Pourquoi recommander SwissLife en priorité ?", choices:["Elle est la moins chère","Meilleures garanties et moins d'augmentations annuelles","Seule dispo chez GIEA","Pas de questionnaire médical"], correct:1, expl:"SwissLife = meilleures remboursements + augmentations les plus faibles. Les deux arguments les plus forts." },
      { q:"À partir de quel âge l'orthodontie n'est plus remboursée par la Sécu ?", choices:["12 ans","14 ans","16 ans","18 ans"], correct:2, expl:"Après 16 ans, la Sécu ne rembourse plus l'orthodontie. Argument fort pour l'enveloppe dentaire SwissLife." },
      { q:"Combien de séances de médecines douces par an ?", choices:["3","5","10","Illimité"], correct:1, expl:"5 séances par an : ostéo, acupuncture, chiro, podologie." },
      { q:"Quel est le montant de l'enveloppe médicaments non remboursés ?", choices:["100€/an","150€/an/bénéficiaire","200€/an","250€/an"], correct:1, expl:"150€/an/bénéficiaire pour médicaments non remboursés mais prescrits par un médecin." },
      { q:"Comment répondre à 'J'ai déjà une mutuelle' ?", choices:["Votre mutuelle est probablement mauvaise","Très bien, on compare — vous payez combien et que vous rembourse-t-elle ?","Je ne peux rien faire","Je vous rappelle dans 6 mois"], correct:1, expl:"On ne dénigre jamais. On propose une comparaison factuelle sur les remboursements réels." },
      { q:"Comment optimiser le remboursement optique SwissLife ?", choices:["Utiliser uniquement l'enveloppe verres","Utiliser uniquement les lentilles","L'opticien utilise les deux enveloppes cumulées","Choisir chaque année une enveloppe"], correct:2, expl:"Les deux enveloppes (verres + lentilles) sont cumulables — c'est l'argument optique le plus puissant." },
      { q:"Quelle est la structure du script SwissLife ?", choices:["Prix d'abord, garanties ensuite","8 étapes de présentation → hospitalisation → ... → closing","3 étapes : découverte, proposition, closing","On commence par les médecines douces"], correct:1, expl:"8 étapes dans l'ordre : présentation, hospitalisation, dentaire, optique, soins, médecines douces, médicaments, closing." },
      { q:"Face à 'C'est trop cher', quelle est la première question ?", choices:["Vous avez quel budget ?","Par rapport à quoi exactement ?","Vous êtes sûr ?","Je peux faire une réduction"], correct:1, expl:"'Par rapport à quoi ?' force le client à préciser sa référence. Souvent il compare sans tenir compte des garanties réelles." },
      { q:"Que couvre le forfait hospitalier SwissLife ?", choices:["Uniquement la chambre particulière","Chirurgie, anesthésie, honoraires, forfait journalier et chambre particulière","Seulement l'urgence","Les soins ambulatoires uniquement"], correct:1, expl:"SwissLife couvre : chirurgie + anesthésie + honoraires + forfait journalier + chambre particulière." },
      { q:"Comment répondre à 'Je vais réfléchir' ?", choices:["D'accord, rappellez-moi","Je comprends. Qu'est-ce qui vous retient ? Si je réponds, on peut avancer ?","Prenez le temps qu'il vous faut","Je vous envoie une brochure"], correct:1, expl:"Identifier le vrai frein. Ne jamais laisser partir sans date de rappel précise." },
    ]
  },
  {
    id:3, icon:"🛡️", title:"Prévoyance Élite Premium", color:C.j3, bg:BG.j3,
    tag:"Produit", desc:"CEGEMA · franchises A/H/M · graphique de couverture",
    objectifs:["Graphique de couverture CEGEMA","Franchises A/H/M","Garanties par cœur","Script prévoyance complet"],
    blocs:[
      { titre:"Le trou à combler",
        corps:`La Sécu remplace au maximum 50% du salaire en arrêt de travail.\nPour un libéral sous CARMF, c'est encore moins.\n\nChiffres réels — Chirurgien, 2 500€/mois :\n• CARMF : 1 232€/mois (49%) pour les 3 premiers mois\n• CARMF : 2 070€/mois du J91 au J365\n• En invalidité (après 3 ans) : 1 344€/mois seulement\n\nSans prévoyance complémentaire, un chirurgien qui tombe malade perd immédiatement la moitié de ses revenus. Si il a des charges, des crédits… c'est la catastrophe.\n\nC'est ça que tu vends. Pas un contrat. Une sécurité de vie.` },
      { titre:"L'outil CEGEMA — giea.cegema.com",
        corps:`3 étapes dans l'outil :\n1. Saisir les données de l'adhérent\n2. Visualiser et ajuster le projet\n3. Compléter la demande d'adhésion\n\nChamps obligatoires étape 1 :\n• Nom, Prénom, Date de naissance\n• Revenu mensuel net moyen (hors dividendes)\n• Profession → ex : Chirurgien\n• Régime Obligatoire → CARMF (médecins), CARPIMKO (kiné)\n• Code postal, situation familiale, enfants\n• Fumeur ? Madelin ?\n\nLe graphique de couverture (étape 2) :\n• En gris : ce que verse le régime obligatoire\n• En bleu : ce qu'apporte la prévoyance GIEA\n• En rouge : la ligne cible = 100% du revenu\n\nTu montres ce graphique au client → il voit le trou immédiatement → il comprend le besoin sans que tu aies à argumenter.` },
      { titre:"Franchises A/H/M",
        corps:`Franchise A/H/M = Accident / Hospitalisation / Maladie (jours de carence)\n\nEx : Franchise 0-3-15 :\n• Accident → indemnisé dès le 1er jour (J1)\n• Hospitalisation → indemnisé dès le 4ème jour (J4)\n• Maladie → indemnisé dès le 16ème jour (J16)\n\nAutres options : 0-3-3 / 0-3-7 / 0-3-15 / 15-3-15 / 30-30-30 / 0-3-30 / 60-60-60 / 90-90-90 / 365-365-365\n\nPlus la franchise est courte → plus la cotisation est élevée.\n⭐ Recommandation GIEA : 0-3-15 pour la majorité des libéraux.` },
      { titre:"Garanties réelles — Chiffres terrain",
        corps:`Exemple : Chirurgien, 25 ans, 2 500€/mois, CARMF\n\nCotisation totale : 76,60€/mois\n• Garantie Décès : 51,73€/mois\n• Maintien de Revenu : 16,26€/mois\n• Frais Généraux : 0,61€/mois\n• Option Confort Hospitalier : 8,00€/mois\n\nGaranties Décès :\n• Capital décès : 323 000€\n• Double si décès accidentel ou conjoint dans les 12 mois\n• Allocation obsèques : 3 000€\n• Capital infirmité par accident : 57 800€\n\nMaintien de Revenu (franchise 0-3-15, durée 3 ans) :\n• J1-J90 : 1 267€/mois complémentaires\n• J91-J365 : 430€/mois\n• J366+ : 430€/mois\n\nRente Invalidité (dès J1095, quand la Sécu s'arrête) :\n• 1 156€/mois à vie jusqu'à la retraite\n\nConfort Hospitalier : 49€/jour (de 20 à 80€ au choix)` },
    ],
    quiz:[
      { q:"Pour un chirurgien à 2 500€/mois, que verse la CARMF les 3 premiers mois ?", choices:["2 500€ (100%)","1 800€ (72%)","1 232€ (49%)","0€"], correct:2, expl:"La CARMF verse 1 232€/mois les 3 premiers mois = 49% du revenu. C'est le trou à combler avec la prévoyance." },
      { q:"Que signifie la franchise 0-3-15 ?", choices:["0 mois, 3 semaines, 15 jours","Accident dès J1, Hospit dès J4, Maladie dès J16","Accident dès J3, Hospit dès J1, Maladie dès J15","Toutes garanties dès J15"], correct:1, expl:"0-3-15 : Accident = 0 jours de carence (dès J1), Hospit = 3 jours (dès J4), Maladie = 15 jours (dès J16)." },
      { q:"Quelle est la cotisation mensuelle pour un chirurgien de 25 ans (2 500€/mois) ?", choices:["45€/mois","62€/mois","76,60€/mois","120€/mois"], correct:2, expl:"76,60€/mois TTC toutes garanties incluses — c'est le chiffre réel terrain à connaître par cœur." },
      { q:"À partir de quel jour la Sécu considère un assuré invalide ?", choices:["J180 (6 mois)","J365 (1 an)","J1095 (3 ans)","J1825 (5 ans)"], correct:2, expl:"Au bout de 3 ans (J1095), la Sécu arrête les IJ et considère l'assuré invalide. La rente invalidité prend alors le relais." },
      { q:"Quel est le capital décès dans l'exemple ?", choices:["150 000€","250 000€","323 000€","500 000€"], correct:2, expl:"Capital décès : 323 000€. Double en cas de décès accidentel ou décès simultané du conjoint." },
      { q:"Quelle franchise est recommandée par GIEA pour les libéraux ?", choices:["0-3-3 (la plus courte)","0-3-15 (bon compromis)","30-30-30 (la moins chère)","365-365-365"], correct:1, expl:"0-3-15 = accident dès J1, maladie après 15 jours. Bon équilibre coût/protection pour les libéraux." },
      { q:"Combien d'étapes dans l'outil CEGEMA ?", choices:["2 étapes","3 étapes","5 étapes","7 étapes"], correct:1, expl:"3 étapes : saisie des données → visualiser et ajuster → compléter la demande d'adhésion." },
      { q:"Quel montant de rente invalidité à vie dans l'exemple ?", choices:["430€/mois","760€/mois","1 156€/mois","2 070€/mois"], correct:2, expl:"1 156€/mois à vie dès J1095, jusqu'à la retraite. Prend le relais quand la Sécu s'arrête." },
      { q:"Le graphique CEGEMA montre en bleu :", choices:["Ce que verse le régime obligatoire","Ce qu'apporte la prévoyance complémentaire GIEA","Le coût de la cotisation","Le revenu cible"], correct:1, expl:"En bleu = la prévoyance complémentaire GIEA. En gris = régime obligatoire. En rouge = revenu cible à atteindre." },
      { q:"Pourquoi la franchise 90-90-90 est-elle moins chère ?", choices:["Elle n'existe pas","Elle couvre moins de garanties","Longue carence = moins de risque pour l'assureur = cotisation réduite","Elle ne couvre pas l'hospitalisation"], correct:2, expl:"Plus la franchise est longue, moins l'assureur prend de risque à court terme, donc la cotisation est plus basse." },
    ]
  },
  {
    id:4, icon:"📈", title:"PER SwissLife", color:C.j4, bg:BG.j4,
    tag:"Produit", desc:"Madelin · impact fiscal · simulation swisslifeone.fr",
    objectifs:["Formule économie fiscale","Déballe Madelin","Simulateur 5 onglets","Calculs terrain"],
    blocs:[
      { titre:"Pourquoi le PER en priorité pour les TNS ?",
        corps:`Le Plan Épargne Retraite (PER) est le produit d'épargne retraite le plus avantageux fiscalement pour les TNS.\n\nLa loi Madelin permet aux indépendants (artisans, commerçants, professions libérales) de déduire fiscalement leurs cotisations retraite de leur revenu imposable.\n\n⚠️ PIÈGE : Un plafond Madelin non utilisé est DÉFINITIVEMENT PERDU.\nIl ne se reporte pas à l'année suivante. Jamais.\n\nC'est ton urgence commerciale. C'est l'argument le plus fort du déballe Madelin.` },
      { titre:"La formule — À connaître par cœur",
        corps:`Économie fiscale = Versement × TMI\n\nExemple réel — Kevin Jarmoune, TNS, 55 000€, TMI 30% :\n• Plafond Madelin 2026 : 6 541€/an\n• Économie fiscale : 6 541 × 30% = 1 962€\n• Effort réel : 6 541 - 1 962 = 4 579€\n• Capital à 67 ans : 908 453€\n\nLa phrase qui claque :\n"Vous versez 6 541€ pour votre retraite. L'État vous rembourse 1 962€ sur vos impôts. Votre effort réel ? Seulement 4 579€. C'est la seule épargne où l'État vous paie pour épargner."\n\nAutres calculs rapides :\n• TMI 41% → économie = versement × 0,41\n• TMI 30% → économie = versement × 0,30\n• TMI 11% → économie = versement × 0,11` },
      { titre:"Simulateur swisslifeone.fr — 5 onglets",
        corps:`1. Plafond Épargne Retraite → saisie données client\n2. Impact fiscal → calcul économie fiscale en temps réel\n3. Contrat retraite → paramétrage versements et allocation\n4. Modalités de sortie → rente / capital / mixte\n5. Résultats détaillés → tableau année par année\n\nChamps clés étape 1 :\n• Statut : Travailleur non salarié (TNS)\n• Bénéfice imposable 2026 : ex. 55 000€\n• Date création entreprise (si < 3 ans : versement minimum spécial)\n• TMI connu ? Si oui, entrer directement\n• Situation familiale + parts fiscales\n\nModalités de sortie :\n• Rente uniquement / Capital uniquement / Mixte\n• Option réversion : rente reversée au conjoint\n\nStratégie allocation recommandée :\n• Pilotage retraite (gestion automatique)\n• Équilibré : 65% Actions + 35% Mixte` },
      { titre:"Le déballe Madelin",
        corps:`Script officiel :\n\n"Bonjour [Nom], [Prénom] à l'appareil, cabinet GIEA.\n\nJe vous appelle concernant le suivi de votre dispositif Madelin. Nous avons identifié que vous disposez encore d'un plafond Madelin non utilisé. Un plafond non utilisé est définitivement perdu — c'est une perte d'avantage fiscal.\n\nAujourd'hui, vos contrats de mutuelle, de prévoyance et votre plan retraite, ils sont chez quel assureur ?\nVous êtes toujours travailleur indépendant ?\nÀ peu près, vous êtes autour de quel montant mensuel, tous contrats confondus ?\n\nJe vous propose un rendez-vous de 15 minutes, gratuit et sans engagement, pour analyser votre situation. Matin ou après-midi ?"` },
    ],
    quiz:[
      { q:"Quelle est la formule de l'économie fiscale Madelin ?", choices:["Versement ÷ TMI","Versement × TMI","Versement + TMI","TMI ÷ Versement"], correct:1, expl:"Économie fiscale = Versement × TMI. Exemple : 6 541€ × 30% = 1 962€." },
      { q:"Pour Kevin Jarmoune (55 000€, TMI 30%), quel est l'effort réel après économie fiscale ?", choices:["6 541€","1 962€","4 579€","3 000€"], correct:2, expl:"Effort réel = 6 541 - 1 962 = 4 579€. C'est le vrai coût après remboursement fiscal." },
      { q:"Que se passe-t-il si un TNS n'utilise pas son plafond Madelin ?", choices:["Il est reporté à l'année suivante","Il est définitivement perdu","Transférable au conjoint","Cumulé l'année suivante"], correct:1, expl:"Un plafond Madelin non utilisé est DÉFINITIVEMENT perdu. Jamais de report. C'est l'urgence absolue." },
      { q:"Combien d'onglets dans le simulateur PER SwissLife ?", choices:["3","4","5","7"], correct:2, expl:"5 onglets : Plafond Épargne Retraite, Impact fiscal, Contrat retraite, Modalités de sortie, Résultats détaillés." },
      { q:"Pour un TNS, TMI 41%, versement 10 000€ → économie fiscale ?", choices:["1 100€","4 100€","5 900€","10 000€"], correct:1, expl:"10 000€ × 41% = 4 100€ d'économie fiscale. Effort réel = 5 900€." },
      { q:"Quelle stratégie d'allocation est recommandée pour le PER ?", choices:["100% fonds euros","Libre","Pilotage retraite (gestion automatique)","100% actions"], correct:2, expl:"Pilotage retraite = la société de gestion gère automatiquement selon le profil et l'horizon." },
      { q:"Dans le déballe Madelin, quelle est la première info à recueillir ?", choices:["Email","Ses contrats actuels et leur assureur","Numéro SIRET","Chiffre d'affaires exact"], correct:1, expl:"On demande d'abord chez quel assureur sont ses contrats (mutuelle, prévoyance, retraite) pour qualifier." },
      { q:"Quelle est la hausse moyenne des cotisations avec l'indexation 2025-2026 ?", choices:["1 à 3%","6 à 10%","15 à 20%","25%"], correct:1, expl:"6 à 10% de hausse moyenne — argument central du déballe relance 2026." },
      { q:"Quel capital Kevin Jarmoune accumule à 67 ans avec son PER ?", choices:["424 264€","650 000€","908 453€","1 200 000€"], correct:2, expl:"908 453€ à 67 ans, dont 504 342€ de produits bruts. Les intérêts composés font la différence." },
      { q:"La phrase clé pour expliquer le PER à un TMI 41% :", choices:["Votre argent est bloqué jusqu'à la retraite","L'État finance 41% de votre épargne — vous versez 1€, l'État vous rend 41 centimes","C'est comme un livret A pour la retraite","Vous pouvez retirer quand vous voulez"], correct:1, expl:"'L'État finance X% de votre épargne retraite.' Pour 41% de TMI : chaque euro versé ne coûte que 59 centimes après économie fiscale." },
    ]
  },
  {
    id:5, icon:"💎", title:"Assurance Vie", color:C.j5, bg:BG.j5,
    tag:"Produit", desc:"SwissLife Évolution Plus · fiscalité · simulation",
    objectifs:["5 objectifs de simulation","Fiscalité AV en 3 règles","Remplir le simulateur","Traiter les 3 objections AV"],
    blocs:[
      { titre:"Pourquoi l'assurance vie ?",
        corps:`L'assurance vie est le placement préféré des Français pour 3 raisons :\n\n1. DISPONIBLE : l'argent n'est pas bloqué. Rachat partiel à tout moment.\n\n2. FISCALITÉ AVANTAGEUSE après 8 ans :\n• Abattement annuel : 4 600€/an (célibataire), 9 200€/an (couple)\n• Au-delà : seulement 7,5% + 17,2% PS\n\n3. TRANSMISSION HORS SUCCESSION :\n• 152 500€ par bénéficiaire hors droits de succession (primes avant 70 ans)\n• Outil patrimonial ultra-puissant\n\nVs Livret A : plafonne à 22 950€, rapporte 3%. L'AV n'a pas de plafond et peut rapporter 2 à 3× plus sur 10 ans.` },
      { titre:"Simulateur Évolution Plus — Écran par écran",
        corps:`Plateforme : swisslifeone.fr → SwissLife Évolution Plus\n3 onglets : Situation / Résultats détaillés / Synthèse et Edition\n\nBLOC 1 — Nom du projet : ex. "Kevin Jarmoune"\n\nBLOC 2 — Projet d'investissement :\n• Situation familiale → impact abattement (4 600€ ou 9 200€)\n• Encours existants :\n  - Primes AVANT 27/09/2017 : ex. 25 000€\n  - Primes APRÈS 27/09/2017 : ex. 35 000€\n  ⚠️ Ne JAMAIS oublier ce champ → fiscalité faussée\n• Objectif (5 options) :\n  ✅ Constituer / valoriser un capital\n  → Transmission à votre décès\n  → Rachats partiels\n  → Rachats programmés\n  → Rente à vie\n• Date de naissance + horizon de placement\n\nBLOC 3 — Versements :\n• Immédiat : ex. 26 000€\n• Programmé : ex. 300€/mois\n\nBLOC 4 — Stratégie :\n• Déléguée (recommandé) vs Libre\n• Équilibré = FORCE 3` },
      { titre:"Fiscalité en 3 règles",
        corps:`RÈGLE 1 — Avant 8 ans :\nGains taxés à 30% (flat tax : 12,8% IR + 17,2% PS)\n\nRÈGLE 2 — Après 8 ans :\nAbattement sur gains :\n• Célibataire : 4 600€/an\n• Couple : 9 200€/an\nAu-delà : 7,5% + 17,2% PS = 24,7% seulement\n\nRÈGLE 3 — Transmission :\nPrimes avant 70 ans :\n• 152 500€/bénéficiaire HORS droits de succession\n• Au-delà : taxe forfaitaire 20% puis 31,25%\nPrimes après 70 ans :\n• Abattement global 30 500€ seulement\n→ Toujours conseiller de verser avant 70 ans` },
      { titre:"3 objections AV",
        corps:`OBJECTION 1 : "C'est bloqué ?"\n"Non. Vous pouvez faire un rachat partiel à tout moment. On recommande de ne pas toucher pendant 8 ans pour la fiscalité optimale, mais c'est votre argent — accessible quand vous voulez."\n\nOBJECTION 2 : "J'ai déjà un livret A"\n"C'est parfait pour l'urgence. Mais le livret A plafonne à 22 950€ et rapporte 3%. L'AV n'a pas de plafond et peut rapporter 2 à 3× plus sur 10 ans selon la stratégie. Vous voulez voir la projection ?"\n\nOBJECTION 3 : "C'est risqué ?"\n"Ça dépend de votre profil. Vous voulez dormir tranquille ? On reste sur les fonds euros. Vous avez 20 ans devant vous ? On cherche un peu plus de performance avec une allocation équilibrée. Je vous montre les deux scénarios."` },
    ],
    quiz:[
      { q:"Abattement AV après 8 ans pour un célibataire ?", choices:["2 300€/an","4 600€/an","9 200€/an","15 300€/an"], correct:1, expl:"4 600€/an pour un célibataire (9 200€ pour un couple) après 8 ans de détention." },
      { q:"Montant transmissible hors succession par bénéficiaire ?", choices:["30 500€","76 000€","152 500€","300 000€"], correct:2, expl:"152 500€/bénéficiaire pour les primes versées avant 70 ans. Au-delà : taxe forfaitaire de 20%." },
      { q:"Distinction critique dans le simulateur Évolution Plus ?", choices:["Euros vs UC","Primes avant vs après 27/09/2017","Contrats SwissLife vs autres","Récents vs anciens"], correct:1, expl:"La date du 27/09/2017 est critique : les primes avant cette date bénéficient d'un régime fiscal différent (plus favorable)." },
      { q:"Stratégie d'allocation recommandée pour la plupart des clients AV ?", choices:["100% fonds euros","Libre","Déléguée + Équilibré (FORCE 3)","100% UC offensives"], correct:2, expl:"Déléguée + Équilibré (FORCE 3) est recommandée. Jamais 'Libre' pour un débutant." },
      { q:"Flat tax avant 8 ans sur les gains ?", choices:["15%","24,7%","30%","40%"], correct:2, expl:"30% de flat tax avant 8 ans (12,8% IR + 17,2% prélèvements sociaux)." },
      { q:"Un client dit 'c'est bloqué l'AV'. Réponse correcte ?", choices:["Oui pendant 8 ans","Non, rachat partiel à tout moment possible","Oui sauf décès","Seulement si vous avez plus de 70 ans"], correct:1, expl:"L'argent n'est jamais bloqué. Rachat partiel possible à tout moment. Le conseil de rester 8 ans est fiscal, pas contractuel." },
      { q:"Pourquoi conseiller de verser en AV avant 70 ans ?", choices:["Rendements meilleurs avant 70 ans","152 500€/bénéficiaire hors succession s'applique aux primes avant 70 ans","Contrat fermé après 70 ans","Frais d'entrée plus bas"], correct:1, expl:"L'abattement de 152 500€/bénéficiaire ne s'applique qu'aux primes versées AVANT 70 ans. Après : seulement 30 500€ global." },
      { q:"Combien d'objectifs de simulation dans Évolution Plus ?", choices:["2","3","5","8"], correct:2, expl:"5 objectifs : constituer capital, transmission, rachats partiels, rachats programmés, rente viagère." },
      { q:"Plafond du Livret A en 2026 ?", choices:["10 000€","15 300€","22 950€","30 000€"], correct:2, expl:"22 950€ est le plafond du Livret A. L'AV n'a pas de plafond — argument fort face à ce profil d'épargnant." },
      { q:"Erreur critique lors de la saisie dans Évolution Plus ?", choices:["Renseigner la date de naissance","Oublier les encours avant/après 27/09/2017","Choisir l'objectif","Mettre le versement en mensuel"], correct:1, expl:"Oublier les encours existants fausse entièrement le calcul fiscal. Erreur critique = mauvais conseil client." },
    ]
  },
  {
    id:6, icon:"🎯", title:"Scripts & Closing", color:C.j6, bg:BG.j6,
    tag:"Vente", desc:"5 objections · 3 déballes · techniques closing GIEA",
    objectifs:["5 objections majeures traitées","3 déballes officielles GIEA","Techniques de closing","Avant / Pendant / Après RDV"],
    blocs:[
      { titre:"5 objections — Méthode en 3 temps",
        corps:`OBJECTION 1 : "C'est trop cher"\nCourt : "Par rapport à quoi ?"\nCommercial : "Une couronne dentaire non couverte : 1 000€. Une paire de lunettes progressives : 700€. Ce que vous payez vous protège-t-il sur ces actes ?"\nStratégie : Ancrer le coût de la non-protection vs le coût de la protection.\n\nOBJECTION 2 : "Je vais réfléchir"\nCourt : "Qu'est-ce qui vous retient ?"\nCommercial : "La plupart du temps c'est une info qui manque. Si je réponds à votre question, on peut avancer ? Sinon, demain ou après-demain ?"\nStratégie : Identifier le vrai frein. Date de rappel précise obligatoire.\n\nOBJECTION 3 : "J'ai déjà une assurance"\nCourt : "Très bien, on compare."\nCommercial : "Vous payez combien ? Votre dernier soin dentaire, vous avez récupéré combien ? Je vous montre ce que vous auriez eu chez nous."\nStratégie : Comparaison factuelle. Ne jamais dénigrer la concurrence.\n\nOBJECTION 4 : "J'ai pas le temps"\nCourt : "C'est exactement pour ça — 10 minutes."\nCommercial : "10 minutes, c'est le temps d'un café. Je viens où vous voulez. Mardi ou jeudi ?"\nStratégie : Réduire la perception d'effort. Alternative fermée.\n\nOBJECTION 5 : "Je dois en parler à ma femme"\nCourt : "On peut l'inclure directement."\nCommercial : "Vous pensez qu'on pourrait faire ça ensemble ? Vendredi, on se retrouve tous les trois — 20 minutes."\nStratégie : Inclure le décisionnaire dans le prochain RDV.` },
      { titre:"Techniques de closing",
        corps:`CLOSING ALTERNATIF (le plus efficace) :\n"On démarre le 1er ou le 15 du mois ?"\n"Je vous prépare le dossier pour quelle date — cette semaine ou la semaine prochaine ?"\n→ Force un choix entre deux options positives. Évite le oui/non.\n\nCLOSING PAR RÉSUMÉ :\n"On est d'accord sur : [3 bénéfices clés]. Et tout ça pour [X€/mois]. On y va ?"\n→ Récapituler réduit les doutes. Le client voit la valeur totale vs coût mensuel.\n\nCLOSING PAR URGENCE (Madelin) :\n"Si on ne fait rien ce mois-ci, votre plafond Madelin de [X€] est définitivement perdu."\n→ Urgence réelle et légitime. Ne jamais inventer une fausse urgence.\n\nCLOSING APRÈS OBJECTION :\n[Traiter l'objection] → "Est-ce que ça répond à votre question ? Dans ce cas, on peut avancer ?"` },
      { titre:"Avant / Pendant / Après RDV",
        corps:`AVANT LE RDV :\n• Relire la fiche prospect dans Monday\n• Préparer le devis (CEGEMA ou swisslifeone.fr)\n• Confirmation du RDV par SMS la veille\n\nPENDANT LE RDV :\n1. Accueil (2 min) : rassurer, pas de vente forcée\n2. Découverte (10 min) : questions ouvertes, écouter, noter\n3. Diagnostic (5 min) : montrer le gap entre ce qu'ils ont et ce dont ils ont besoin\n4. Présentation (10 min) : solution sur-mesure, bénéfices, chiffres\n5. Closing (5 min) : alternative fermée, ne pas fuir la signature\n\nAPRÈS LE RDV :\n• Mettre à jour Monday IMMÉDIATEMENT\n• Envoyer le devis par email dans les 2 heures\n• Relance J+2 si pas de retour\n• Relance J+5 si toujours rien\n• Anticiper le délai de rétractation (14 jours)` },
    ],
    quiz:[
      { q:"Face à 'C'est trop cher', première chose à faire ?", choices:["Proposer une réduction","Défendre le prix","Demander 'Par rapport à quoi ?'","Changer de produit"], correct:2, expl:"'Par rapport à quoi ?' force le client à préciser sa référence et ouvre la discussion sur la vraie valeur." },
      { q:"Client dit 'Je dois en parler à ma femme' — meilleure stratégie ?", choices:["Attendre son retour","Insister pour signer seul","Proposer un RDV avec les deux conjoints","Envoyer un email au couple"], correct:2, expl:"Proposer un RDV avec les deux conjoints. On inclut le décisionnaire plutôt que de perdre le lead." },
      { q:"Quel closing alternatif recommande GIEA ?", choices:["Vous êtes intéressé ?","On démarre le 1er ou le 15 du mois ?","Je vous envoie une brochure ?","Vous avez besoin de temps ?"], correct:1, expl:"'On démarre le 1er ou le 15 ?' — le client choisit entre deux options positives, évitant le oui/non." },
      { q:"Que faire IMMÉDIATEMENT après un RDV ?", choices:["Appeler le manager","Mettre à jour Monday + envoyer le devis dans les 2 heures","Attendre que le client rappelle","Préparer le prochain RDV"], correct:1, expl:"Mettre à jour Monday IMMÉDIATEMENT et envoyer le devis dans les 2 heures. Si c'est pas dans Monday = ça n'existe pas." },
      { q:"Face à 'J'ai pas le temps', la bonne réponse ?", choices:["Je vous rappelle dans un mois","10 minutes, c'est le temps d'un café. Mardi ou jeudi ?","Dommage, j'aurais pu vous faire économiser","Envoyez-moi vos documents"], correct:1, expl:"Réduire la perception d'effort (10 min = un café) + alternative fermée sur le créneau." },
      { q:"Après avoir traité une objection, que faire ?", choices:["Passer à la suivante sans vérifier","'Est-ce que ça répond à votre question ? On peut avancer ?'","Attendre que le client réagisse","Baisser le prix"], correct:1, expl:"Toujours valider après chaque objection traitée, puis demander l'avancement. C'est le closing après objection." },
      { q:"Le closing par urgence Madelin est légitime car :", choices:["On invente une pression","Le plafond non utilisé est réellement perdu définitivement","La cotisation va augmenter","C'est une règle interne GIEA"], correct:1, expl:"L'urgence Madelin est réelle et factuelle. Ne jamais inventer une fausse urgence." },
      { q:"Délai maximum pour envoyer le devis après le RDV ?", choices:["24 heures","2 heures","48 heures","1 semaine"], correct:1, expl:"Dans les 2 heures. Plus on attend, plus le client refroidit." },
      { q:"Délai de rétractation légal après signature ?", choices:["7 jours","10 jours","14 jours","30 jours"], correct:2, expl:"14 jours de rétractation légal en France. Prévoir relance à J+12 pour s'assurer que tout va bien." },
      { q:"Comment répondre à 'J'ai déjà une assurance' sans dénigrer ?", choices:["Votre mutuelle est mauvaise","Très bien, on compare — vous payez combien et que vous rembourse-t-elle vraiment ?","Résiliez immédiatement","Je ne peux rien faire"], correct:1, expl:"Jamais dénigrer. Comparaison factuelle sur les remboursements réels. Le client tire lui-même ses conclusions." },
    ]
  },
  {
    id:7, icon:"🏆", title:"Certification Finale", color:C.j7, bg:BG.j7,
    tag:"Certification", desc:"Évaluation complète — Score minimum 8/10",
    objectifs:["Valider toutes les connaissances GIEA","Obtenir la certification commerciale","Identifier les lacunes résiduelles"],
    blocs:[
      { titre:"Récapitulatif — CRM & Posture",
        corps:`RÈGLES D'OR :\n• 80% écoute / 20% parole en RDV\n• Si ce n'est pas dans Monday, ça n'existe pas\n• Chaque appel = mise à jour du pipeline dans la minute\n• Le nom dans le module RDV ne se copie PAS automatiquement\n\nPIPELINE LEADS : Nouveau → Appel 1/2/3 → Rappel → Non joignable → RDV\n\nDÉBALLE TÉLÉPROSPECTEUR :\n"Je ne cherche pas à vous vendre quelque chose, mais à comparer... Matin ou après-midi ?"` },
      { titre:"Récapitulatif — Produits GIEA",
        corps:`MUTUELLE SWISSLIFE (8 étapes) :\nHospitalisation → Dentaire (ortho non remboursée après 16 ans) → Optique (2 enveloppes cumulables) → Soins courants → Médecines douces (5 séances/an) → Médicaments (150€/an) → Auditif → Closing\n\nPRÉVOYANCE CEGEMA (Chirurgien, 25 ans, 2 500€/mois) :\n• 76,60€/mois | Capital décès : 323 000€\n• IJ franchise 0-3-15 : 1 267€/mois\n• Rente invalidité dès J1095 : 1 156€/mois\n• CARMF verse 1 232€ sur 2 500€ de revenu (49%)\n\nPER SWISSLIFE :\n• Économie fiscale = Versement × TMI\n• 6 541€ × 30% = 1 962€ → effort réel 4 579€\n• Capital à 67 ans : 908 453€\n• Plafond non utilisé = définitivement perdu\n\nASSURANCE VIE ÉVOLUTION PLUS :\n• Avant 8 ans : flat tax 30%\n• Après 8 ans : 4 600€ (célibataire) / 9 200€ (couple)\n• Transmission : 152 500€/bénéficiaire hors succession\n• Primes avant vs après 27/09/2017 → régime fiscal différent` },
    ],
    quiz:[
      { q:"Formule économie fiscale Madelin ?", choices:["Versement + TMI","Versement ÷ TMI","Versement × TMI","TMI × 12"], correct:2, expl:"Économie fiscale = Versement × TMI. Fondamental pour convaincre un TNS." },
      { q:"Cotisation mensuelle prévoyance pour chirurgien 25 ans (2 500€/mois) ?", choices:["45€/mois","62€/mois","76,60€/mois","95€/mois"], correct:2, expl:"76,60€/mois TTC toutes garanties incluses. Chiffre terrain à connaître par cœur." },
      { q:"Abattement AV après 8 ans pour un célibataire ?", choices:["2 300€/an","4 600€/an","9 200€/an","15 300€/an"], correct:1, expl:"4 600€/an célibataire, 9 200€/an couple. Au-delà : seulement 7,5% + 17,2% PS." },
      { q:"Que se passe-t-il si un plafond Madelin n'est pas utilisé ?", choices:["Reporté à l'année suivante","Définitivement perdu","Utilisable dans les 3 ans","Investi automatiquement"], correct:1, expl:"DÉFINITIVEMENT perdu. Jamais de report. C'est l'urgence commerciale absolue." },
      { q:"Quand basculer un lead en RDV dans Monday ?", choices:["Le lendemain","Seulement si il signe","IMMÉDIATEMENT + coller le nom manuellement","À la fin de la semaine"], correct:2, expl:"IMMÉDIATEMENT + coller le nom manuellement (ne se copie pas automatiquement)." },
      { q:"Franchise prévoyance recommandée pour les libéraux ?", choices:["0-3-3","0-3-15","30-30-30","90-90-90"], correct:1, expl:"0-3-15 : accident dès J1, maladie après J16. Bon équilibre coût/protection." },
      { q:"Montant transmissible hors succession par bénéficiaire en AV ?", choices:["76 000€","100 000€","152 500€","230 000€"], correct:2, expl:"152 500€/bénéficiaire pour primes versées avant 70 ans." },
      { q:"Comment répondre à 'Je vais réfléchir' ?", choices:["D'accord, rappellez-moi","Qu'est-ce qui vous retient ? Si je réponds, on peut avancer ?","C'est normal, prenez le temps","Je vous envoie un email"], correct:1, expl:"Identifier le vrai frein. Ne jamais laisser partir sans traiter l'objection réelle et fixer une date." },
      { q:"Règle d'or du CRM GIEA ?", choices:["Appeler 50 prospects/jour","Si ce n'est pas dans Monday, ça n'existe pas","Email avant chaque appel","Ne pas noter d'infos perso"], correct:1, expl:"Règle absolue : si ce n'est pas dans Monday, ça n'existe pas." },
      { q:"Rente invalidité versée à vie dans l'exemple prévoyance ?", choices:["430€/mois","760€/mois","1 156€/mois","2 070€/mois"], correct:2, expl:"1 156€/mois à vie à partir du J1095, quand la Sécu s'arrête." },
      { q:"Closing alternatif le plus efficace chez GIEA ?", choices:["Vous êtes intéressé ?","On démarre le 1er ou le 15 du mois ?","Je vous envoie une brochure","Réfléchissez et revenez vers moi"], correct:1, expl:"'On démarre le 1er ou le 15 ?' — force un choix positif, évite le oui/non." },
      { q:"Que faire dans les 2 heures après un RDV ?", choices:["Appeler le manager","Mettre à jour Monday + envoyer le devis","Attendre le client","Préparer le RDV suivant"], correct:1, expl:"Monday mis à jour + devis envoyé dans les 2 heures. Plus on attend, plus le client refroidit." },
    ]
  }
];

const KEY = "giea_v3";

/* ── HELPERS ── */
const s = (obj: React.CSSProperties): React.CSSProperties => obj;

/* ── MAIN ── */
export default function App() {
  const [prog, setProg] = useState({ scores:{}, current:1, failed:{} });
  const [view, setView] = useState("home");
  const [sel, setSel] = useState(null);
  const [ci, setCi] = useState(0);
  const [ans, setAns] = useState<Record>({});
  const [done, setDone] = useState(false);
  const [sc, setSc] = useState(0);

  useEffect(() => {
    try { const r = localStorage.getItem(KEY); if (r) setProg(JSON.parse(r)); } catch {}
  }, []);

  const save = useCallback((p: Progress) => {
    setProg(p);
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  }, []);

  const open = (j: Jour) => {
    if (j.id > prog.current) return;
    setSel(j); setCi(0); setAns({}); setDone(false); setSc(0); setView("learn");
  };

  const submit = useCallback(() => {
    if (!sel) return;
    let ok = 0;
    const f: number[] = [];
    sel.quiz.forEach((q, i) => { if (ans[i] === q.correct) ok++; else f.push(i); });
    const score = Math.round((ok / sel.quiz.length) * 10);
    setSc(score);
    setDone(true);
    const min = sel.id === 7 ? 8 : 7;
    const ns = { ...prog.scores, [sel.id]: Math.max(score, prog.scores[sel.id] ?? 0) };
    const nf = { ...prog.failed, [sel.id]: f };
    let nc = prog.current;
    if (score >= min && sel.id === prog.current && prog.current < 7) nc = prog.current + 1;
    save({ ...prog, scores: ns, current: nc, failed: nf });
  }, [ans, sel, prog, save]);

  const reset = () => {
    save({ scores:{}, current:1, failed:{} });
    setView("home"); setSel(null);
  };

  const validated = (j: Jour) => { const sc2 = prog.scores[j.id]; return sc2 !== undefined && sc2 >= (j.id === 7 ? 8 : 7); };
  const failed_j  = (j: Jour) => { const sc2 = prog.scores[j.id]; return sc2 !== undefined && sc2 < (j.id === 7 ? 8 : 7); };

  const avgScore = (() => {
    const vals = DATA.filter(j => prog.scores[j.id] !== undefined && validated(j)).map(j => prog.scores[j.id]);
    return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : null;
  })();

  /* ──────── HOME ──────── */
  if (view === "home") return (
    
      

        {/* Hero */}
        
          🏛️
          GIEA Paris 16 — Formation Commerciale
          Parcours certifiant · Score minimum 7/10 par jour · 8/10 pour la certification
          
            {[
              { l:"Jour actuel",  v:`${prog.current}/7` },
              { l:"Validés",      v:`${DATA.filter(j=>validated(j)).length}/7` },
              { l:"Moyenne",      v: avgScore !== null ? `${avgScore}/10` : "—" },
            ].map((m,i) => (
              
                {m.l}
                {m.v}
              
            ))}
          
        

        {/* Jours */}
        
          {DATA.map(j => {
            const locked = j.id > prog.current;
            const ok = validated(j);
            const fail = failed_j(j);
            const fq = prog.failed[j.id] ?? [];
            return (
              <div key={j.id} className="fade" onClick={() => !locked && open(j)} style={s({
                background:"var(--card)", border:`1.5px solid ${ok ? j.color : fail ? "#E24B4A" : "var(--border)"}`,
                borderRadius:"var(--radius)", padding:"16px 14px", cursor:locked?"not-allowed":"pointer",
                opacity:locked?0.4:1, position:"relative", transition:"border-color .2s",
              })}>
                
                  {locked ? "🔒" : ok ? `${prog.scores[j.id]}/10 ✓` : fail ? `${prog.scores[j.id]}/10 ✗` : j.id===prog.current ? "● En cours" : ""}
                
                
                  {j.icon}
                  J{j.id} · {j.tag}
                
                {j.title}
                {j.desc}
                {fq.length > 0 && !ok && (
                  
                    {fq.length} question{fq.length>1?"s":""} à retravailler
                  
                )}
              
            );
          })}
        

        {/* Points faibles */}
        {Object.keys(prog.failed).some(k => (prog.failed[Number(k)]?.length ?? 0) > 0) && (
          
            📌 Points à retravailler
            {Object.entries(prog.failed).map(([jid, qids]) => {
              const jour = DATA.find(j => j.id === Number(jid));
              if (!jour || !qids || qids.length === 0) return null;
              return (
                
                  {jour.icon} Jour {jid} — {jour.title}
                  {qids.map(qi => (
                    • {jour.quiz[qi]?.q}
                  ))}
                
              );
            })}
          
        )}

        
          
            Réinitialiser la progression
          
        
      
    
  );

  /* ──────── LEARN ──────── */
  if (view === "learn" && sel) {
    const bloc = sel.blocs[ci];
    const total = sel.blocs.length;
    return (
      
        
          
            <button onClick={() => setView("home")} style={s({ background:"none", border:`1.5px solid ${sel.color}`, color:sel.color, borderRadius:8, padding:"7px 16px", fontWeight:600, fontSize:13 })}>← Retour
            {sel.icon} Jour {sel.id} — {sel.title}
            {ci+1}/{total}
          

          {ci === 0 && (
            
              🎯 Objectifs
              {sel.objectifs.map((o,i) => ✓ {o})}
            
          )}

          
            {bloc.titre}
            {bloc.corps.split("\n").map((line,i) => {
              if (!line.trim()) return ;
              const bold = line.endsWith(":") && line.length < 45;
              return {line};
            })}
          

          {/* Progress bar */}
          
            <div style={s({ width:`${((ci+1)/total)*100}%`, height:"100%", background:sel.color, borderRadius:99, transition:"width .3s" })} />
          

          
            <button disabled={ci===0} onClick={() => setCi(c=>c-1)} style={s({ background:"none", border:`1.5px solid ${sel.color}`, color:sel.color, borderRadius:8, padding:"9px 18px", fontWeight:600, fontSize:13 })}>← Précédent
            {ci === total-1
              ? <button onClick={() => setView("quiz")} style={s({ background:sel.color, color:"#fff", border:"none", borderRadius:8, padding:"9px 24px", fontWeight:700, fontSize:14 })}>Passer au quiz →
              : <button onClick={() => setCi(c=>c+1)} style={s({ background:sel.color, color:"#fff", border:"none", borderRadius:8, padding:"9px 24px", fontWeight:700, fontSize:14 })}>Suivant →
            }
          
        
      
    );
  }

  /* ──────── QUIZ ──────── */
  if (view === "quiz" && sel) {
    const min = sel.id === 7 ? 8 : 7;
    const allDone = sel.quiz.every((_,i) => ans[i] !== undefined);

    if (done) {
      const ok = sel.quiz.filter((_,i) => ans[i] === sel.quiz[i].correct);
      const wrong = sel.quiz.map((q,i) => ({q,i})).filter(({i}) => ans[i] !== sel.quiz[i].correct);
      const pass = sc >= min;
      return (
        
          
            
              {pass?"🎉":"📚"}
              {sc}/10
              {pass?`Jour ${sel.id} validé !`:`Score insuffisant — minimum ${min}/10`}
              {ok.length}/{sel.quiz.length} bonnes réponses
            

            {wrong.length > 0 && (
              
                ❌ Corrections
                {wrong.map(({q,i}) => (
                  
                    Q{i+1}. {q.q}
                    ❌ Votre réponse : {q.choices[ans[i]]}
                    ✅ Bonne réponse : {q.choices[q.correct]}
                    💡 {q.expl}
                  
                ))}
              
            )}

            {ok.length > 0 && (
              
                ✅ Points maîtrisés ({ok.length})
                {ok.map((q,i) => • {q.q})}
              
            )}

            
              {!pass && <button onClick={() => { setAns({}); setDone(false); }} style={s({ background:"#E24B4A", color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontWeight:700, flex:1 })}>🔄 Refaire le test}
              <button onClick={() => { setCi(0); setView("learn"); setAns({}); setDone(false); }} style={s({ background:"none", border:`1.5px solid ${sel.color}`, color:sel.color, borderRadius:8, padding:"10px 18px", fontWeight:600 })}>Revoir le cours
              <button onClick={() => setView("home")} style={s({ background:sel.color, color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontWeight:700, flex:1 })}>
                {pass && prog.current > sel.id ? "Jour suivant →" : "← Accueil"}
              
            
          
        
      );
    }

    return (
      
        
          
            <button onClick={() => setView("learn")} style={s({ background:"none", border:`1.5px solid ${sel.color}`, color:sel.color, borderRadius:8, padding:"7px 14px", fontWeight:600, fontSize:13 })}>← Cours
            {sel.icon} Quiz — Jour {sel.id}
            Min. {min}/10
          

          
            {sel.quiz.length} questions · {Object.keys(ans).length}/{sel.quiz.length} répondues
          

          {sel.quiz.map((q,i) => (
            
              
                Q{i+1}. {q.q}
              
              {q.choices.map((c,ci2) => {
                const selected = ans[i] === ci2;
                return (
                  <div key={ci2} onClick={() => setAns(a=>({...a,[i]:ci2}))} style={s({
                    padding:"10px 14px", marginBottom:7, borderRadius:8, cursor:"pointer",
                    border:`1.5px solid ${selected?sel.color:"var(--border)"}`,
                    background:selected?sel.bg:"var(--bg)", fontSize:13, fontWeight:selected?700:400,
                  })}>
                    
                      {["A","B","C","D"][ci2]}.
                    {c}
                  
                );
              })}
            
          ))}

          
            Valider mes réponses →
            {!allDone && 
              {sel.quiz.length - Object.keys(ans).length} question{sel.quiz.length - Object.keys(ans).length > 1?"s":""} restante{sel.quiz.length - Object.keys(ans).length > 1?"s":""}
            }
          
        
      
    );
  }

  return null;
}
```
