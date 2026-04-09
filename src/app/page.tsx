```tsx
"use client";

import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */
interface QuizQuestion {
  q: string;
  choices: string[];
  correct: number;
  explanation: string;
}

interface JourData {
  id: number;
  icon: string;
  title: string;
  color: string;
  bg: string;
  tag: string;
  desc: string;
  objectifs: string[];
  contenu: { titre: string; corps: string }[];
  quiz: QuizQuestion[];
}

interface Progress {
  scores: Record;
  jourActuel: number;
  failedQuestions: Record;
}

/* ═══════════════════════════════════════
   DONNÉES — 7 JOURS DE FORMATION
═══════════════════════════════════════ */
const JOURS: JourData[] = [
  /* ── JOUR 1 ── */
  {
    id: 1, icon: "🧠", title: "Posture & CRM Monday", color: "#185FA5", bg: "#E6F1FB",
    tag: "Fondations", desc: "Maîtriser le CRM Monday et la posture commerciale GIEA",
    objectifs: ["Comprendre la règle d'or du CRM", "Maîtriser le pipeline LEADS", "Connaître le module RDV", "Être capable de faire le déballe téléprospecteur"],
    contenu: [
      {
        titre: "La règle d'or GIEA",
        corps: `Si ce n'est pas dans Monday, ça n'existe pas.\n\nAvant de passer le premier appel, il faut maîtriser deux principes :\n• 80% d'écoute, 20% de parole\n• Chaque action est tracée dans le CRM Monday (giea-squad.monday.com)\n\nUn CRM propre = un commercial crédible. Le manager consulte Monday tous les jours.`
      },
      {
        titre: "Module LEADS — Le pipeline",
        corps: `Les groupes de leads chez GIEA :\n• LEAD KINÉ : 6 213 leads\n• LEAD KEV : 7 337 leads\n• Psychiatre : 1 692 leads\n• Infirmière : 1 541 leads\n• LEAD DOM-TOM : 3 192 leads\n\nStatuts du pipeline (à mettre à jour après CHAQUE appel) :\n• Nouveau → lead jamais contacté\n• Appel 1 / Appel 2 / Appel 3 → tentatives successives\n• Rappel → prospect demande à être rappelé (noter la date !)\n• Non joignable → 3 appels sans réponse\n• Mauvais numéro → ne plus contacter\n• RDV → rendez-vous accepté → basculer dans le module RDV immédiatement\n\nColonnes OBLIGATOIRES : Nom/Société, Téléphone (+33), Ville, Site internet, Commercial (TON NOM).`
      },
      {
        titre: "Module RDV — L'alerte critique",
        corps: `Quand un lead accepte un RDV :\n→ Basculer IMMÉDIATEMENT dans le board RDV\n→ ⚠️ Le nom ne se copie PAS automatiquement. Tu dois le coller manuellement.\n\nChamps OBLIGATOIRES dans le RDV :\n• Nom / Prénom\n• Téléphone\n• Email (pour les relances automatiques)\n• Commercial (TON NOM)\n• Date et heure du RDV\n\nStatuts RDV : RDV planifié → En échange → RDV effectué → Proposition envoyée → R2 → Signé → Sans suite\n\nNotes obligatoires dans chaque RDV :\nProduit / Situation pro / Revenus / Mutuelle actuelle + montant / Objections / Prochaine étape`
      },
      {
        titre: "Le déballe téléprospecteur GIEA",
        corps: `Script officiel à mémoriser mot pour mot :\n\n"Bonjour Monsieur/Madame [Nom] ? Oui bonjour, [Prénom] du cabinet G.I.E.A. Je vous dérange pas ?\n\n(petite pause)\n\nÇa va être très court — je ne cherche pas à vous vendre quelque chose, mais plutôt à comparer votre mutuelle et votre prévoyance avec celles avec qui on travaille, dans le but de vous faire économiser plusieurs centaines d'euros par an ou d'obtenir de meilleures garanties.\n\nVous êtes chez quelle compagnie actuellement ? Et vous payez environ combien par mois ?\n\nCe que je vous propose, c'est un petit rendez-vous de 10 minutes, gratuit et sans engagement, pour comparer. Vous préférez matin ou après-midi ?"`
      },
    ],
    quiz: [
      { q: "Quelle est la règle d'or du CRM GIEA ?", choices: ["Appeler 50 prospects par jour", "Si ce n'est pas dans Monday, ça n'existe pas", "Toujours envoyer un email avant d'appeler", "Ne jamais mettre de notes dans le CRM"], correct: 1, explanation: "La règle absolue GIEA : si ce n'est pas dans Monday, ça n'existe pas. Chaque action doit être tracée." },
      { q: "Quel statut mettre après 3 appels sans réponse ?", choices: ["Rappel", "Annulé", "Non joignable", "Mauvais numéro"], correct: 2, explanation: "Après 3 tentatives sans réponse établie, le statut passe en 'Non joignable'." },
      { q: "Que doit-on faire en PRIORITÉ quand un lead accepte un RDV ?", choices: ["Envoyer un email de confirmation", "Basculer immédiatement dans le board RDV et coller le nom manuellement", "Mettre le statut 'Rappel'", "Attendre le lendemain pour mettre à jour Monday"], correct: 1, explanation: "Basculer immédiatement dans le board RDV. Attention : le nom ne se copie pas automatiquement, il faut le coller manuellement." },
      { q: "Quelle information est OBLIGATOIRE dans la colonne Commercial d'un lead ?", choices: ["Le nom du manager", "Le nom du client", "Ton propre prénom", "Le produit visé"], correct: 2, explanation: "La colonne Commercial doit toujours contenir TON NOM. Sans cela, personne ne sait qui travaille le lead." },
      { q: "Dans le déballe téléprospecteur GIEA, quelle est la question de closing pour obtenir le RDV ?", choices: ["Vous êtes intéressé ?", "Je peux vous rappeler ?", "Vous préférez matin ou après-midi ?", "Quel est votre email ?"], correct: 2, explanation: "La question de closing est 'Vous préférez matin ou après-midi ?' — c'est une alternative fermée qui force le choix entre deux créneaux, pas un oui/non." },
      { q: "Quelle est la répartition écoute/parole recommandée en RDV ?", choices: ["50% / 50%", "20% écoute / 80% parole", "80% écoute / 20% parole", "70% parole / 30% écoute"], correct: 2, explanation: "80% d'écoute, 20% de parole. Le commercial qui parle trop perd la vente. Comprendre avant de proposer." },
      { q: "Quel champ est indispensable dans le module RDV pour les relances automatiques ?", choices: ["La ville du prospect", "L'email du prospect", "Le site internet", "La date de naissance"], correct: 1, explanation: "L'email est indispensable pour les relances automatiques et l'envoi du devis." },
      { q: "Combien de groupes de leads sont visibles dans le CRM GIEA ?", choices: ["3 groupes", "5 groupes", "7 groupes ou plus", "2 groupes"], correct: 2, explanation: "Il y a plusieurs groupes : LEAD KINÉ, LEAD KEV, Psychiatre, Infirmière, LEAD DOM-TOM, et d'autres — soit 7 groupes ou plus." },
      { q: "Le déballe téléprospecteur commence par :", choices: ["Présenter le prix de la mutuelle", "Dire qu'on veut vendre quelque chose", "Préciser qu'on ne cherche pas à vendre mais à comparer", "Demander l'email du prospect"], correct: 2, explanation: "Le déballe commence par 'je ne cherche pas à vous vendre quelque chose, mais à comparer...' — cela désamorce la résistance." },
      { q: "Quel statut donner à un lead qui demande d'être rappelé dans 3 jours ?", choices: ["Non joignable", "Appel 2", "Rappel (+ noter la date dans les commentaires)", "RDV"], correct: 2, explanation: "Statut 'Rappel' avec la date précise notée dans les commentaires. Sans la date, le rappel n'aura jamais lieu." },
    ]
  },

  /* ── JOUR 2 ── */
  {
    id: 2, icon: "🏥", title: "Mutuelle SwissLife", color: "#0F6E56", bg: "#E1F5EE",
    tag: "Produit", desc: "Maîtriser le script SwissLife en 8 étapes et les objections",
    objectifs: ["Connaître les 8 étapes du script SwissLife", "Comprendre les garanties clés", "Traiter les objections mutuelle", "Savoir présenter le devis"],
    contenu: [
      {
        titre: "Pourquoi la mutuelle en premier ?",
        corps: `La mutuelle est le produit d'entrée chez GIEA pour 3 raisons :\n1. Tout le monde en a une\n2. Tout le monde paye trop cher pour ce qu'il a\n3. C'est la porte d'entrée vers la prévoyance et le PER\n\nSwissLife est recommandée car :\n• Meilleure en termes de remboursements\n• Celle qui subit le moins d'augmentations chaque année\n• Garanties négociées exclusivement pour les adhérents GIEA (-20 à -30%)`
      },
      {
        titre: "Script SwissLife — Les 8 étapes",
        corps: `Étape 1 — PRÉSENTATION\n"Monsieur Bruno, je vais vous présenter la solution SwissLife que je vous recommande — la meilleure en termes de remboursements et celle qui subit le moins d'augmentations chaque année."\n\nÉtape 2 — HOSPITALISATION\nChirurgie, anesthésie, honoraires médicaux pris en charge à X% de la base Sécu. Forfait journalier couvert. Chambre particulière à X€/jour.\n\nÉtape 3 — DENTAIRE\nSoins classiques, prothèses, orthodontie remboursés à X%. Enveloppe pour actes non remboursés (implantologie, prothèses, parodontologie). ⚠️ L'orthodontie n'est plus remboursée par la Sécu après 16 ans.\n\nÉtape 4 — OPTIQUE\nEnveloppe pour verres complexes (verres progressifs) + enveloppe pour lentilles non remboursées. L'opticien utilise les deux = budget total lunettes optimisé.\n\nÉtape 5 — SOINS COURANTS & RADIOLOGIE\nConsultations généralistes et spécialistes remboursées à X%. Imagerie médicale incluse. Peu ou pas de reste à charge dans la majorité des cas.\n\nÉtape 6 — MÉDECINES DOUCES\nOstéopathie, acupuncture, chiropractie, podologie : X€/séance, 5 séances par an.\n\nÉtape 7 — MÉDICAMENTS\nMédicaments non remboursés mais prescrits par un médecin : 150€/an/bénéficiaire.\n\nÉtape 8 — CLOSING\n"Concrètement, vous avez des garanties sur-mesure, une grosse enveloppe optique, 5 séances de médecines douces par an, une enveloppe médicaments à 150€... L'ensemble de cette couverture revient à X€ par mois."`
      },
      {
        titre: "Les 3 objections mutuelle",
        corps: `OBJECTION 1 : "C'est trop cher"\nRéponse courte : "Par rapport à quoi exactement ?"\nRéponse commerciale : "Comparons. Une paire de lunettes progressives sans couverture : 600 à 800€. Une couronne dentaire : 800 à 1 200€. Votre mutuelle actuelle vous rembourse combien sur ces actes ? Voilà la vraie question."\n\nOBJECTION 2 : "J'ai déjà une mutuelle"\nRéponse courte : "C'est parfait. On compare, c'est tout."\nRéponse commerciale : "Super, ça nous donne une base de comparaison. Vous payez combien par mois ? Et sur vos lunettes ou votre dernier soin dentaire, vous avez récupéré combien ? Je vais vous montrer ce que SwissLife vous aurait remboursé."\n\nOBJECTION 3 : "Je vais réfléchir"\nRéponse : "Je comprends. Qu'est-ce qui vous retient ? La plupart du temps c'est une information qui manque. Si je réponds à votre question maintenant, on peut avancer ?"`
      },
    ],
    quiz: [
      { q: "Pourquoi recommander SwissLife plutôt qu'une autre mutuelle ?", choices: ["Elle est la moins chère du marché", "Elle a les meilleures garanties et subit le moins d'augmentations", "Elle est la seule disponible chez GIEA", "Elle ne demande pas de questionnaire médical"], correct: 1, explanation: "SwissLife est recommandée pour ses remboursements élevés et ses faibles augmentations annuelles — deux arguments clés face aux clients." },
      { q: "À partir de quel âge l'orthodontie n'est plus remboursée par la Sécurité sociale ?", choices: ["12 ans", "14 ans", "16 ans", "18 ans"], correct: 2, explanation: "L'orthodontie n'est plus remboursée par la Sécu après 16 ans — argument fort pour justifier l'enveloppe dentaire SwissLife." },
      { q: "Combien de séances de médecines douces sont couvertes par an ?", choices: ["3 séances", "5 séances", "10 séances", "Illimité"], correct: 1, explanation: "5 séances par an pour l'ostéopathie, acupuncture, chiropractie et podologie." },
      { q: "Quel est le montant de l'enveloppe médicaments non remboursés (prescrits) ?", choices: ["100€/an/bénéficiaire", "150€/an/bénéficiaire", "200€/an/bénéficiaire", "250€/an/bénéficiaire"], correct: 1, explanation: "150€ par an et par bénéficiaire pour les médicaments non remboursés mais prescrits par un médecin." },
      { q: "Quelle est la bonne réponse à l'objection 'J'ai déjà une mutuelle' ?", choices: ["Votre mutuelle est probablement mauvaise", "Très bien, on compare — vous payez combien et que vous rembourse-t-elle sur les lunettes ou le dentaire ?", "Alors vous n'avez pas besoin de nous", "Je vous rappelle dans 6 mois"], correct: 1, explanation: "On ne dévalorise jamais la mutuelle actuelle. On propose une comparaison factuelle basée sur les remboursements réels." },
      { q: "Comment appelle-t-on les actes comme l'implantologie ou la parodontologie ?", choices: ["Actes de confort", "Actes non remboursés par la Sécurité sociale", "Actes de chirurgie esthétique", "Actes de médecine douce"], correct: 1, explanation: "L'implantologie, certaines prothèses, l'orthodontie adulte et la parodontologie sont des actes non remboursés par la Sécu — couverts par l'enveloppe SwissLife." },
      { q: "Quelle est la structure du script SwissLife ?", choices: ["Prix d'abord, garanties ensuite", "8 étapes : présentation → hospitalisation → dentaire → optique → soins → médecines douces → médicaments → closing", "Seulement 3 étapes : découverte, proposition, closing", "On commence par les médecines douces car c'est le plus différenciant"], correct: 1, explanation: "Le script SwissLife suit 8 étapes dans un ordre précis, du plus important (hospitalisation) au closing." },
      { q: "Face à l'objection 'C'est trop cher', quelle est la première question à poser ?", choices: ["Vous avez quel budget ?", "Par rapport à quoi exactement ?", "Vous êtes sûr ?", "Je peux vous faire une réduction"], correct: 1, explanation: "'Par rapport à quoi exactement ?' force le client à préciser sa référence. Souvent il compare à son prix actuel sans savoir ce qu'il perd en remboursements." },
      { q: "Pour l'optique, comment maximiser le remboursement ?", choices: ["Utiliser uniquement l'enveloppe verres", "Utiliser uniquement l'enveloppe lentilles", "L'opticien utilise les deux enveloppes (verres complexes + lentilles) pour maximiser le budget total", "Choisir soit verres soit lentilles chaque année"], correct: 2, explanation: "L'opticien peut utiliser les deux enveloppes cumulées — c'est l'argument optique le plus fort de SwissLife." },
      { q: "Comment répondre à 'Je vais réfléchir' ?", choices: ["D'accord, je vous rappelle dans 15 jours", "Je comprends. Qu'est-ce qui vous retient ? Si je réponds à votre question maintenant, on peut avancer ?", "C'est normal, prenez le temps qu'il faut", "Dans ce cas je vous envoie une brochure"], correct: 1, explanation: "Ne jamais laisser le client partir sans identifier le vrai frein. 'Qu'est-ce qui vous retient ?' transforme une objection vague en une question précise à traiter." },
    ]
  },

  /* ── JOUR 3 ── */
  {
    id: 3, icon: "🛡️", title: "Prévoyance Élite Premium", color: "#A32D2D", bg: "#FCEBEB",
    tag: "Produit", desc: "Maîtriser la prévoyance CEGEMA avec les vrais chiffres terrain",
    objectifs: ["Comprendre le graphique de couverture CEGEMA", "Maîtriser les franchises A/H/M", "Connaître les garanties par cœur", "Faire le script prévoyance complet"],
    contenu: [
      {
        titre: "Pourquoi la prévoyance est le produit le plus important",
        corps: `La Sécurité sociale remplace au maximum 50% du salaire en cas d'arrêt de travail.\nPour un libéral (médecin, kiné, chirurgien...) sous régime CARMF, c'est encore moins.\n\nChiffres réels — Chirurgien, 2 500€/mois de revenu :\n• CARMF verses : 1 232€/mois (= 49% du revenu) pour les 3 premiers mois\n• CARMF verses : 2 070€/mois du 91ème jour au 365ème jour\n• En invalidité (après 3 ans) : 1 344€/mois seulement\n\nSans prévoyance complémentaire, un chirurgien qui tombe malade perd immédiatement la moitié de ses revenus. Si il a un cabinet, des charges, des crédits… c'est la catastrophe.\n\nC'est ça que tu vends. Pas un contrat. Une sécurité de vie.`
      },
      {
        titre: "L'outil CEGEMA — giea.cegema.com",
        corps: `3 étapes dans l'outil :\n1. Saisir les données de l'adhérent\n2. Visualiser et ajuster le projet\n3. Compléter la demande d'adhésion\n\nChamps à remplir (étape 1) :\n• Nom, Prénom\n• Revenu mensuel net moyen (hors dividendes)\n• Date de naissance\n• Profession → ex : Chirurgien\n• Régime Obligatoire → CARMF (médecins), CARPIMKO (kiné), RSI…\n• Code postal\n• Fumeur ? Conjoint collaborateur ? Micro-entrepreneur ? Fiscalité Madelin ?\n• Situation familiale + enfants\n\nLe graphique de couverture (étape 2) montre visuellement :\n• En gris : ce que verse le régime obligatoire (CARMF)\n• En bleu : ce qu'apporte la prévoyance complémentaire GIEA\n• En rouge : la ligne à atteindre (100% du revenu)\n\nTu montres ce graphique au client : il voit immédiatement le trou à combler.`
      },
      {
        titre: "Les franchises A/H/M — À maîtriser absolument",
        corps: `Franchise A/H/M = Accident / Hospitalisation / Maladie (en jours de carence)\n\nEx : Franchise 0-3-15 :\n• Accident → indemnisé dès le 1er jour (J1)\n• Hospitalisation → indemnisé dès le 4ème jour (J4)\n• Maladie → indemnisé dès le 16ème jour (J16)\n\nAutres options disponibles :\n• 0-3-3 / 0-3-7 / 0-3-15 ← recommandée pour la plupart des libéraux\n• 15-3-15 / 30-30-30 / 30-3-30\n• 0-3-30 / 60-60-60 / 90-90-90 / 365-365-365\n\nPlus la franchise est courte → plus la cotisation est élevée.\nRecommandation GIEA : 0-3-15 pour les libéraux (bon compromis coût/protection).`
      },
      {
        titre: "Les garanties — Chiffres réels (Chirurgien, 25 ans, 2 500€/mois)",
        corps: `Cotisation mensuelle TTC : 76,60€/mois\n• Garantie Décès : 51,73€/mois\n• Garantie Maintien de Revenu : 16,26€/mois\n• Garantie Frais Généraux : 0,61€/mois\n• Option Confort Hospitalier : 8,00€/mois\n\nGARANTIES DÉCÈS :\n• Capital décès : 323 000€\n• Double si décès accidentel ou décès simultané du conjoint\n• Allocation obsèques : 3 000€ option disponible\n• Maladie grave : option disponible\n• Capital infirmité par accident : 57 800€\n\nMAINTIEN DE REVENU (franchise 0-3-15, durée 3 ans) :\n• J1 à J90 : 1 267,12€/mois complémentaires\n• J91 à J365 : 430€/mois complémentaires\n• J366+ : 430€/mois complémentaires\n\nRENTE INVALIDITÉ :\n• Dès le 1 095ème jour (= après 3 ans d'arrêt, quand la Sécu arrête)\n• Montant : 1 156€/mois à vie jusqu'à la retraite\n• Type barème : Pro 16 recommandé\n\nFRAIS GÉNÉRAUX : 100€/mois (franchise 0-3-30, durée 1 an)\nCONFORT HOSPITALIER : 49€/jour (slider de 20 à 80€)`
      },
    ],
    quiz: [
      { q: "Pour un chirurgien sous CARMF avec 2 500€/mois de revenu, que verse le RO les 3 premiers mois ?", choices: ["2 500€/mois (100%)", "1 800€/mois (72%)", "1 232€/mois (environ 49%)", "0€/mois"], correct: 2, explanation: "La CARMF verse environ 1 232€/mois les 3 premiers mois, soit 49% du revenu. C'est le 'trou' que la prévoyance complémentaire doit combler." },
      { q: "Que signifie la franchise 0-3-15 ?", choices: ["0 mois, 3 semaines, 15 jours", "Accident dès J1, Hospitalisation dès J4, Maladie dès J16", "Accident dès J3, Hospit dès J1, Maladie dès J15", "Toutes les garanties dès J15"], correct: 1, explanation: "0-3-15 = Accident indemnisé dès J1 (0 jours de carence), Hospitalisation dès J4 (3 jours de carence), Maladie dès J16 (15 jours de carence)." },
      { q: "Quel est le montant de la cotisation mensuelle pour un chirurgien de 25 ans (2 500€/mois) ?", choices: ["45€/mois", "62€/mois", "76,60€/mois", "120€/mois"], correct: 2, explanation: "76,60€/mois TTC pour un chirurgien de 25 ans avec 2 500€/mois de revenu — toutes garanties incluses (décès, maintien de revenu, frais généraux, confort hospitalier)." },
      { q: "À partir de quel jour la Sécu considère un assuré comme invalide ?", choices: ["Dès 6 mois d'arrêt (J180)", "Dès 1 an d'arrêt (J365)", "Dès 3 ans d'arrêt (J1095)", "Dès 5 ans d'arrêt (J1825)"], correct: 2, explanation: "Au bout de 3 ans d'arrêt (J1095), la Sécu considère l'assuré invalide et arrête les indemnités journalières. C'est là que la rente invalidité prend le relais." },
      { q: "Quel est le montant du capital décès dans l'exemple ?", choices: ["150 000€", "250 000€", "323 000€", "500 000€"], correct: 2, explanation: "Capital décès : 323 000€, avec doublement en cas de décès accidentel ou décès simultané du conjoint dans les 12 mois." },
      { q: "Quelle franchise est recommandée par GIEA pour la majorité des libéraux ?", choices: ["0-3-3 (la plus courte)", "0-3-15 (bon compromis coût/protection)", "30-30-30 (la moins chère)", "365-365-365 (la moins chère)"], correct: 1, explanation: "La franchise 0-3-15 est recommandée : accident couvert dès J1, maladie après 15 jours. Bon équilibre entre protection et coût." },
      { q: "L'outil CEGEMA (giea.cegema.com) comporte combien d'étapes ?", choices: ["2 étapes", "3 étapes", "5 étapes", "7 étapes"], correct: 1, explanation: "3 étapes : 1. Saisir les données de l'adhérent → 2. Visualiser et ajuster le projet → 3. Compléter la demande d'adhésion." },
      { q: "Quel est le montant de la rente invalidité versée à vie dans l'exemple ?", choices: ["430€/mois", "760€/mois", "1 156€/mois", "2 070€/mois"], correct: 2, explanation: "1 156€/mois à vie jusqu'à la retraite, dès le J1095 (3 ans d'arrêt). C'est la garantie invalidité qui prend le relais quand la Sécu arrête tout." },
      { q: "Que montre le graphique de couverture CEGEMA ?", choices: ["Uniquement la cotisation mensuelle", "En gris le RO, en bleu la complémentaire, en rouge la cible de revenu à atteindre", "Uniquement les remboursements Sécu", "Le comparatif avec la concurrence"], correct: 1, explanation: "Le graphique montre visuellement le trou entre ce que verse le RO (gris) et le revenu cible (rouge). La prévoyance complémentaire (bleu) comble ce trou. C'est l'outil de conviction le plus puissant." },
      { q: "Pourquoi la franchise 90-90-90 est-elle moins chère ?", choices: ["Elle n'existe pas", "Elle couvre moins de garanties", "Elle a une longue carence (90 jours) donc l'assureur prend moins de risques", "Elle ne couvre pas l'hospitalisation"], correct: 2, explanation: "Plus la franchise est longue, moins l'assureur verse d'indemnités (le client attend 90 jours avant d'être couvert). Le risque est moindre pour l'assureur, donc la cotisation est plus basse." },
    ]
  },

  /* ── JOUR 4 ── */
  {
    id: 4, icon: "📈", title: "PER SwissLife", color: "#854F0B", bg: "#FAEEDA",
    tag: "Produit", desc: "Maîtriser le PER et la fiscalité Madelin pour les TNS",
    objectifs: ["Comprendre le fonctionnement du PER", "Maîtriser la formule de l'économie fiscale", "Connaître le déballe Madelin", "Utiliser le simulateur swisslifeone.fr"],
    contenu: [
      {
        titre: "Qu'est-ce que le PER et pourquoi en parler en premier aux TNS ?",
        corps: `Le Plan Épargne Retraite (PER) est le produit d'épargne retraite le plus avantageux fiscalement en France pour les travailleurs non salariés (TNS).\n\nLa loi Madelin permet aux indépendants (artisans, commerçants, professions libérales) de déduire fiscalement leurs cotisations de prévoyance, santé et retraite de leur revenu imposable.\n\n⚠️ LE PIÈGE : Un plafond Madelin non utilisé est DÉFINITIVEMENT PERDU. Il ne se reporte pas.\n\nC'est ton urgence commerciale. C'est l'argument le plus fort du déballe Madelin.`
      },
      {
        titre: "La formule — À connaître par cœur",
        corps: `Économie fiscale = Versement × TMI\n\nExemple réel — Kevin Jarmoune, TNS, bénéfice 55 000€, TMI 30% :\n• Plafond Madelin 2026 : 6 541€/an\n• Économie fiscale : 6 541 × 30% = 1 962€\n• Effort réel d'épargne : 6 541 - 1 962 = 4 579€\n• Capital à 67 ans : 908 453€ (sur 41 ans, allocation équilibrée)\n\nLa phrase qui claque :\n"Vous versez 6 541€ pour votre retraite. L'État vous rembourse 1 962€ sur vos impôts. Votre effort réel ? Seulement 4 579€. C'est la seule épargne où l'État vous paie pour épargner."\n\nAutres exemples rapides :\n• TMI 41% : économie = versement × 0,41\n• TMI 30% : économie = versement × 0,30\n• TMI 11% : économie = versement × 0,11`
      },
      {
        titre: "Le simulateur SwissLife PER (swisslifeone.fr)",
        corps: `5 onglets dans le simulateur :\n1. Plafond Épargne Retraite → saisie des données client\n2. Impact fiscal → calcul économie fiscale en temps réel\n3. Contrat retraite → paramétrage des versements et de l'allocation\n4. Modalités de sortie → rente / capital / mixte\n5. Résultats détaillés → tableau année par année\n\nChamps clés à remplir :\n• Statut professionnel : Travailleur non salarié (TNS)\n• Bénéfice imposable 2026 : ex. 55 000€\n• Date de création de l'entreprise (si créateur < 3 ans : versement minimum spécial)\n• Fiscalité / TMI : ex. 30%\n• Situation familiale + parts fiscales\n\nVersions disponibles de la sortie à la retraite :\n• Rente uniquement\n• Capital uniquement\n• Rente et capital (mixte)\n• Option réversion : rente reversée au conjoint\n\nStratégie d'allocation :\n• Pilotage retraite (recommandé) : gestion automatique\n• Équilibré : 65% Actions + 35% Mixte`
      },
      {
        titre: "Les 3 déballes officielles GIEA",
        corps: `DÉBALLE STANDARD :\n"Bonjour [Nom], [Prénom] du cabinet G.I.E.A. Je vous dérange pas ? Ça va être très court — je ne cherche pas à vous vendre quelque chose mais à comparer votre mutuelle et prévoyance avec celles avec qui on travaille, pour vous faire économiser plusieurs centaines d'euros ou obtenir de meilleures garanties. Vous êtes chez quelle compagnie ? Vous payez combien par mois ? Ce que je propose : 10 minutes, gratuit, sans engagement. Matin ou après-midi ?"\n\nDÉBALLE MADELIN :\n"Bonjour [Nom], [Prénom] à l'appareil, cabinet GIEA. Je vous appelle concernant le suivi de votre dispositif Madelin. Nous avons identifié que vous disposez encore d'un plafond Madelin non utilisé. Un plafond non utilisé est définitivement perdu — c'est une perte d'avantage fiscal. Vos contrats sont chez quel assureur ? Vous êtes toujours travailleur indépendant ? Et à peu près, vous êtes autour de quel montant mensuel, tous contrats confondus ? Je vous propose 15 minutes, gratuit, sans engagement. Matin ou après-midi ?"\n\nDÉBALLE RELANCE 2026 :\n"Bonjour [Nom], [Prénom] du cabinet GIEA — je ne vous dérange pas ? On s'était dit de se recontacter début 2026. Avec l'indexation 2025-2026, vos contrats ont augmenté de 6 à 10% en moyenne. Et le problème, c'est que les remboursements n'ont pas suivi. On compare votre mutuelle et prévoyance avec nos compagnies partenaires ? 10 minutes, matin ou après-midi ?"`,
      },
    ],
    quiz: [
      { q: "Quelle est la formule de l'économie fiscale Madelin ?", choices: ["Versement ÷ TMI", "Versement × TMI", "Versement + TMI", "TMI ÷ Versement"], correct: 1, explanation: "Économie fiscale = Versement × TMI. Exemple : 6 541€ × 30% = 1 962€ d'économie fiscale." },
      { q: "Pour Kevin Jarmoune (TNS, 55 000€, TMI 30%), quel est l'effort réel d'épargne après économie fiscale ?", choices: ["6 541€", "1 962€", "4 579€", "3 000€"], correct: 2, explanation: "Effort réel = 6 541 - 1 962 = 4 579€. C'est le vrai coût pour le client après remboursement fiscal." },
      { q: "Que se passe-t-il si un TNS n'utilise pas son plafond Madelin ?", choices: ["Il peut le reporter à l'année suivante", "Il perd définitivement cet avantage fiscal", "Il peut le transférer à son conjoint", "Il le cumule avec l'année suivante"], correct: 1, explanation: "Un plafond Madelin non utilisé est définitivement perdu. Il ne se reporte pas. C'est l'argument d'urgence du déballe Madelin." },
      { q: "Combien d'onglets comporte le simulateur SwissLife PER ?", choices: ["3 onglets", "4 onglets", "5 onglets", "7 onglets"], correct: 2, explanation: "5 onglets : Plafond Épargne Retraite, Impact fiscal, Contrat retraite, Modalités de sortie, Résultats détaillés." },
      { q: "Pour un TNS avec TMI de 41% et un versement de 10 000€, quelle est l'économie fiscale ?", choices: ["1 100€", "4 100€", "5 900€", "10 000€"], correct: 1, explanation: "10 000€ × 41% = 4 100€ d'économie fiscale. L'effort réel est donc de 5 900€ (10 000 - 4 100)." },
      { q: "Quelle est la stratégie d'allocation recommandée pour la plupart des clients PER ?", choices: ["100% fonds euros", "Libre (le client choisit ses UC)", "Pilotage retraite — gestion automatique", "100% actions"], correct: 2, explanation: "Pilotage retraite est recommandé : la société de gestion pilote automatiquement l'allocation selon le profil et l'horizon." },
      { q: "Dans le déballe Madelin, quelle est la première information à recueillir auprès du prospect ?", choices: ["Son adresse email", "Ses contrats actuels et leur assureur", "Son numéro de SIRET", "Son chiffre d'affaires exact"], correct: 1, explanation: "On demande d'abord chez quel assureur sont ses contrats actuels (mutuelle, prévoyance, retraite) pour qualifier le prospect." },
      { q: "Quelle est la hausse moyenne des cotisations avec l'indexation 2025-2026 ?", choices: ["1 à 3%", "6 à 10%", "15 à 20%", "25%"], correct: 1, explanation: "Avec l'indexation 2025-2026, les cotisations ont augmenté en moyenne de 6 à 10% — argument central du déballe relance 2026." },
      { q: "Quel est le capital approximatif accumulé par Kevin Jarmoune (6 541€/an pendant 41 ans) à 67 ans ?", choices: ["424 264€", "650 000€", "908 453€", "1 200 000€"], correct: 2, explanation: "908 453€ de capital à 67 ans, dont 424 264€ de versements bruts et 504 342€ de produits bruts. Les intérêts composés font la différence." },
      { q: "Quelle est la phrase clé pour expliquer le PER à un TNS à 41% de TMI ?", choices: ["Vous allez bloquer votre argent jusqu'à la retraite", "L'État finance 41% de votre épargne retraite — vous versez 1€, l'État vous rend 0,41€", "C'est comme un livret A mais pour la retraite", "Vous pouvez retirer quand vous voulez"], correct: 1, explanation: "La phrase exacte : 'L'État finance X% de votre épargne retraite'. Pour un TMI de 41%, chaque euro versé ne coûte que 59 centimes après économie fiscale." },
    ]
  },

  /* ── JOUR 5 ── */
  {
    id: 5, icon: "💎", title: "Assurance Vie", color: "#533AB7", bg: "#EEEDFE",
    tag: "Produit", desc: "SwissLife Évolution Plus : simulation, fiscalité et objections",
    objectifs: ["Comprendre les 5 objectifs de simulation", "Maîtriser la fiscalité de l'AV", "Savoir remplir le simulateur Évolution Plus", "Traiter les objections AV"],
    contenu: [
      {
        titre: "Pourquoi l'assurance vie est le produit patrimonial n°1",
        corps: `L'assurance vie est le placement préféré des Français pour 3 raisons :\n\n1. ÉPARGNE DISPONIBLE : contrairement aux idées reçues, l'argent n'est pas bloqué. On peut faire un rachat partiel à tout moment.\n\n2. FISCALITÉ AVANTAGEUSE après 8 ans :\n• Abattement annuel : 4 600€/an pour un célibataire, 9 200€/an pour un couple\n• Après abattement : seulement 7,5% de prélèvements sociaux + flat tax réduite\n\n3. TRANSMISSION HORS SUCCESSION :\n• Jusqu'à 152 500€ par bénéficiaire transmis hors droits de succession (primes versées avant 70 ans)\n• Outil de transmission patrimoniale ultra-puissant\n\nAlternative au livret A : le livret A plafonne à 22 950€ et rapporte 3% brut. L'assurance vie n'a pas de plafond et peut rapporter 2 à 3 fois plus sur 10 ans selon la stratégie.`
      },
      {
        titre: "Le simulateur SwissLife Évolution Plus — Écran par écran",
        corps: `Plateforme : swisslifeone.fr → Études et simulateurs → SwissLife Évolution Plus\n3 onglets : Situation / Résultats détaillés / Synthèse et Edition\n\nBLOC 1 — Nom du projet : ex. "Kevin Jarmoune"\n\nBLOC 2 — Projet d'investissement :\n• Situation familiale : Célibataire / Marié(e) / Pacsé(e)… → impact direct sur l'abattement\n• Encours existants au 31/12 de l'année précédente :\n  - Primes versées AVANT le 27/09/2017 : ex. 25 000€\n  - Primes versées APRÈS le 27/09/2017 : ex. 35 000€\n  ⚠️ Cette distinction est CRITIQUE pour la fiscalité. Ne jamais oublier ce champ.\n• Objectif de simulation (5 options) :\n  ✅ Constituer / valoriser un capital pour réaliser un projet\n  → Préparer la transmission d'un capital à votre décès\n  → Constituer un capital en vue de rachats partiels\n  → Constituer un capital en vue de rachats programmés\n  → Constituer un capital à convertir en rente à vie\n• Date de naissance (obligatoire)\n• Horizon de placement : slider 8 à 99 ans\n\nBLOC 3 — Versements :\n• Transfert ancien contrat (valeur de rachat si applicable)\n• Versement supplémentaire immédiat : ex. 26 000€\n• Versement programmé : ex. 300€/mois\n\nBLOC 4 — Stratégie d'allocation :\n• Déléguée (recommandé) vs Libre\n• Sécurité ←→ Équilibré (FORCE 3) ←→ Offensif\n\n⚠️ ERREURS À ÉVITER :\n• Oublier les encours existants → fiscalité faussée\n• Choisir "Libre" pour un client débutant → il paniquera\n• Objectif "transmission" pour un client de 35 ans → incohérent`
      },
      {
        titre: "La fiscalité en 3 règles clés",
        corps: `RÈGLE 1 — Avant 8 ans :\nGains taxés à 30% (flat tax : 12,8% IR + 17,2% PS)\n\nRÈGLE 2 — Après 8 ans :\nAbattement annuel sur les gains :\n• Célibataire : 4 600€/an\n• Couple : 9 200€/an\nAu-delà de l'abattement : 7,5% + 17,2% PS = 24,7% seulement\n\nRÈGLE 3 — Transmission :\nPrimes versées AVANT 70 ans :\n• 152 500€ par bénéficiaire transmis HORS droits de succession\n• Au-delà : taxe forfaitaire de 20% puis 31,25%\nPrimes versées APRÈS 70 ans :\n• Abattement global de 30 500€ (tous bénéficiaires confondus)\n• Plus intéressant de verser avant 70 ans\n\nRÈGLE BONUS — Primes avant vs après 27/09/2017 :\n• Primes versées AVANT cette date bénéficient d'un régime de faveur (abattement de 10% après 25 ans de détention pour certains contrats)\n• D'où l'importance de renseigner ce champ dans le simulateur`
      },
      {
        titre: "Les 3 objections AV — Réponses terrain",
        corps: `OBJECTION : "C'est bloqué ?"\nRéponse : "Non, pas du tout. Vous pouvez retirer quand vous voulez — c'est ce qu'on appelle un rachat partiel. On recommande de ne pas toucher pendant 8 ans pour profiter de la fiscalité optimale, mais c'est votre argent, accessible à tout moment."\n\nOBJECTION : "J'ai déjà un livret A, ça suffit"\nRéponse : "Le livret A c'est parfait pour l'urgence — 3 mois de charges à portée. Mais pour le reste, le livret A plafonne à 22 950€ et rapporte 3%. L'assurance vie n'a pas de plafond et sur 10 ans, avec une stratégie équilibrée, vous pouvez viser 2 à 3 fois plus. Vous voulez que je vous montre la projection ?"\n\nOBJECTION : "C'est risqué ?"\nRéponse : "Ça dépend de la stratégie choisie. Vous voulez dormir tranquille ? On reste sur les fonds euros, sécurisé. Vous avez 20 ans devant vous ? On peut chercher un peu plus de performance avec une allocation équilibrée. Je vais vous montrer les deux scénarios sur le simulateur."`,
      },
    ],
    quiz: [
      { q: "Quel est l'abattement annuel sur les gains d'une assurance vie après 8 ans pour un célibataire ?", choices: ["2 300€/an", "4 600€/an", "9 200€/an", "15 300€/an"], correct: 1, explanation: "4 600€/an d'abattement pour un célibataire (9 200€ pour un couple). Au-delà, le taux est de seulement 7,5% + 17,2% PS." },
      { q: "Jusqu'à quel montant peut-on transmettre par bénéficiaire hors succession ?", choices: ["30 500€", "76 000€", "152 500€", "300 000€"], correct: 2, explanation: "152 500€ par bénéficiaire peuvent être transmis hors droits de succession pour les primes versées avant 70 ans." },
      { q: "Quelle est la distinction critique dans le simulateur Évolution Plus concernant les encours existants ?", choices: ["Contrats en euros vs contrats en UC", "Primes versées avant vs après le 27/09/2017", "Primes récentes vs primes anciennes", "Contrats SwissLife vs autres assureurs"], correct: 1, explanation: "La date du 27/09/2017 est critique : les primes versées avant cette date bénéficient d'un régime fiscal différent (plus favorable pour les anciens contrats)." },
      { q: "Quelle stratégie d'allocation est recommandée pour la plupart des clients AV ?", choices: ["100% fonds euros", "Libre (le client gère lui-même)", "Déléguée + Équilibré (FORCE 3)", "100% UC offensives"], correct: 2, explanation: "Allocation Déléguée + stratégie Équilibrée (FORCE 3) est recommandée pour la majorité des profils. Pas 'Libre' pour un débutant." },
      { q: "Quelle est la flat tax applicable sur les gains avant 8 ans de détention ?", choices: ["15%", "24,7%", "30%", "40%"], correct: 2, explanation: "Flat tax de 30% avant 8 ans (12,8% IR + 17,2% prélèvements sociaux)." },
      { q: "Un client dit 'c'est bloqué l'assurance vie'. Quelle est la bonne réponse ?", choices: ["Oui, pendant 8 ans minimum", "Non, l'argent est totalement inaccessible", "Non, vous pouvez faire un rachat partiel à tout moment. On recommande 8 ans pour la fiscalité, mais c'est votre argent.", "Oui, sauf en cas de décès"], correct: 2, explanation: "L'argent n'est jamais bloqué. On peut retirer à tout moment via un rachat partiel. Le conseil de rester 8 ans est fiscal, pas contractuel." },
      { q: "Pourquoi est-il plus avantageux de verser en AV avant 70 ans ?", choices: ["Les rendements sont meilleurs avant 70 ans", "L'abattement de 152 500€/bénéficiaire s'applique aux primes versées avant 70 ans", "Après 70 ans, le contrat est automatiquement fermé", "Les frais d'entrée sont plus bas avant 70 ans"], correct: 1, explanation: "L'abattement de 152 500€ par bénéficiaire (hors succession) ne s'applique qu'aux primes versées AVANT 70 ans. Après 70 ans, l'abattement global est de seulement 30 500€." },
      { q: "Combien d'objectifs de simulation sont disponibles dans Évolution Plus ?", choices: ["2 objectifs", "3 objectifs", "5 objectifs", "8 objectifs"], correct: 2, explanation: "5 objectifs : constituer un capital, préparer la transmission, rachats partiels, rachats programmés, rente viagère." },
      { q: "Quel est le plafond du Livret A en 2026 ?", choices: ["10 000€", "15 300€", "22 950€", "30 000€"], correct: 2, explanation: "22 950€ est le plafond du Livret A. Argument fort : l'AV n'a pas de plafond et offre potentiellement de meilleures performances sur le long terme." },
      { q: "Une erreur critique lors de la saisie dans Évolution Plus est de :", choices: ["Renseigner la date de naissance", "Oublier les encours existants (primes avant/après 27/09/2017)", "Choisir l'objectif avant la stratégie", "Mettre le versement programmé en mensuel"], correct: 1, explanation: "Oublier les encours existants fausse entièrement le calcul fiscal. C'est une erreur critique qui peut conduire à un mauvais conseil." },
    ]
  },

  /* ── JOUR 6 ── */
  {
    id: 6, icon: "🎯", title: "Scripts & Closing", color: "#3B6D11", bg: "#EAF3DE",
    tag: "Vente", desc: "Maîtriser les 5 objections et les techniques de closing GIEA",
    objectifs: ["Traiter les 5 objections majeures", "Maîtriser les 3 déballes GIEA", "Connaître les techniques de closing", "Gérer les situations difficiles"],
    contenu: [
      {
        titre: "Les 5 objections majeures — Méthode en 3 temps",
        corps: `Pour chaque objection : Réponse courte → Réponse commerciale → Stratégie\n\nOBJECTION 1 : "C'est trop cher"\nCourt : "Par rapport à quoi ?"\nCommercial : "Comparons. Une couronne dentaire non couverte : 1 000€. Une paire de lunettes progressives : 700€. Ce que vous payez chaque mois vous protège-t-il vraiment sur ces actes ? Voilà la vraie question."\nStratégie : Ancrer le coût de la non-protection vs le coût de la protection.\n\nOBJECTION 2 : "Je vais réfléchir"\nCourt : "Je comprends. Qu'est-ce qui vous retient ?"\nCommercial : "La plupart du temps c'est une information qui manque. Si je réponds à votre question maintenant, on peut avancer ? Sinon, quand est-ce qu'on se rappelle — demain ou après-demain ?"\nStratégie : Identifier le vrai frein. Ne jamais laisser partir sans date de rappel précise.\n\nOBJECTION 3 : "J'ai déjà une assurance"\nCourt : "Très bien, on compare."\nCommercial : "Super, ça nous donne une base. Vous payez combien ? Et sur votre dernier acte dentaire ou vos lunettes, vous avez récupéré combien ? Je vais vous montrer ce que vous auriez eu avec nos garanties."\nStratégie : Analyse comparative factuelle. Ne jamais dénigrer la concurrence.\n\nOBJECTION 4 : "J'ai pas le temps"\nCourt : "Je comprends. C'est exactement pour ça que je veux qu'on se voit 10 minutes."\nCommercial : "10 minutes, c'est le temps d'un café. Je viens où vous voulez, je m'adapte à votre agenda. Mardi ou jeudi ?"\nStratégie : Réduire la perception d'effort. Alternative fermée pour forcer le choix.\n\nOBJECTION 5 : "Je dois en parler à ma femme/mari"\nCourt : "Bien sûr. On peut l'inclure directement."\nCommercial : "C'est normal. Vous pensez qu'on pourrait faire ça ensemble ? Si vous êtes libre vendredi, on pourrait se retrouver tous les trois — 20 minutes, et vous avez une vision complète tous les deux."\nStratégie : Inclure le décisionnaire dans le prochain RDV plutôt que perdre le lead.`
      },
      {
        titre: "Les techniques de closing GIEA",
        corps: `CLOSING ALTERNATIF (le plus efficace) :\n"On démarre le 1er ou le 15 du mois ?"\n"Je vous prépare le dossier pour quelle date — cette semaine ou la semaine prochaine ?"\n→ Force un choix entre deux options positives. Évite le oui/non.\n\nCLOSING PAR RÉSUMÉ :\n"Donc on est d'accord sur : [résumer les 3 bénéfices clés]. Et tout ça pour [X€/mois]. On y va ?"\n→ Récapituler = réduire les doutes. Le client voit la valeur totale vs le coût mensuel.\n\nCLOSING PAR URGENCE (Madelin) :\n"Si on ne fait rien ce mois-ci, votre plafond Madelin de [X€] est définitivement perdu. On ne peut pas le récupérer l'année prochaine."\n→ Urgence réelle et légitime. Ne jamais fabriquer une fausse urgence.\n\nCLOSING APRÈS OBJECTION :\n[Traiter l'objection] → "Est-ce que ça répond à votre question ? Dans ce cas, on peut avancer ?"\n→ Toujours demander une validation après avoir traité l'objection.`
      },
      {
        titre: "Avant / Pendant / Après le RDV",
        corps: `AVANT LE RDV :\n• Relire la fiche prospect dans Monday (produit, situation, objections)\n• Préparer le devis sur l'outil adapté (CEGEMA, swisslifeone.fr)\n• Avoir le comparatif avec leur mutuelle/prévoyance actuelle\n• Confirmation du RDV envoyée par SMS/email (la veille)\n\nPENDANT LE RDV :\n1. Accueil (2 min) : remercier, rassurer ("pas de vente forcée, juste une comparaison")\n2. Découverte (10 min) : questions ouvertes, écouter, prendre des notes\n3. Diagnostic (5 min) : montrer le gap entre ce qu'ils ont et ce dont ils ont besoin\n4. Présentation (10 min) : solution sur-mesure, bénéfices concrets, chiffres\n5. Closing (5 min) : alternative fermée, ne pas fuir la signature\n\nAPRÈS LE RDV :\n• Mettre à jour Monday IMMÉDIATEMENT (statut + notes complètes)\n• Envoyer le devis par email dans les 2 heures\n• Relance J+2 si pas de retour\n• Relance J+5 si toujours rien\n• Mettre une alerte pour le délai de rétractation (14 jours)`
      },
    ],
    quiz: [
      { q: "Face à 'C'est trop cher', quelle est la première chose à faire ?", choices: ["Proposer une réduction immédiatement", "Défendre le prix", "Demander 'Par rapport à quoi ?'", "Changer de produit"], correct: 2, explanation: "'Par rapport à quoi ?' force le client à préciser sa référence. Souvent il compare à un prix sans tenir compte des garanties réelles." },
      { q: "Quand un client dit 'Je dois en parler à ma femme', la meilleure stratégie est :", choices: ["Accepter et attendre son retour", "Insister pour qu'il signe seul maintenant", "Proposer un RDV avec les deux conjoints", "Envoyer un email au couple"], correct: 2, explanation: "Proposer un RDV avec les deux conjoints : 'On peut faire ça ensemble. Vendredi vous êtes disponibles tous les deux ?' On inclut le décisionnaire plutôt que de perdre le lead." },
      { q: "Quel est le closing alternatif recommandé par GIEA ?", choices: ["'Vous êtes intéressé ?'", "'On démarre le 1er ou le 15 du mois ?'", "'Je vous envoie une brochure ?'", "'Vous avez besoin de temps ?'"], correct: 1, explanation: "'On démarre le 1er ou le 15 du mois ?' est un closing alternatif : le client choisit entre deux options positives, évitant le oui/non." },
      { q: "Que faire IMMÉDIATEMENT après un RDV ?", choices: ["Appeler le manager pour un débriefing", "Mettre à jour Monday + envoyer le devis par email dans les 2 heures", "Attendre que le client rappelle", "Préparer le prochain RDV"], correct: 1, explanation: "Mettre à jour Monday IMMÉDIATEMENT et envoyer le devis dans les 2 heures. Si ce n'est pas dans Monday = ça n'existe pas." },
      { q: "Face à 'J'ai pas le temps', la bonne réponse est :", choices: ["Je comprends, je vous rappelle dans un mois", "10 minutes, c'est le temps d'un café. Je viens où vous voulez. Mardi ou jeudi ?", "C'est dommage, j'aurais pu vous faire économiser", "Envoyez-moi vos documents et je vous fait une étude"], correct: 1, explanation: "Réduire la perception d'effort (10 minutes = un café) + alternative fermée sur le créneau. On ne laisse pas le prospect choisir 'aucun' de ces créneaux." },
      { q: "Que faire si un client traite une objection mais reste hésitant ?", choices: ["Insister sur le prix", "Reformuler l'objection différemment", "Demander 'Est-ce que ça répond à votre question ? Dans ce cas, on peut avancer ?'", "Changer de produit"], correct: 2, explanation: "Après chaque objection traitée : valider que le client est satisfait de la réponse, puis demander l'avancement. C'est le closing après objection." },
      { q: "Le closing par urgence Madelin est légitime car :", choices: ["On invente une fausse pression pour forcer la vente", "Le plafond Madelin non utilisé est réellement perdu définitivement", "La cotisation va augmenter le mois prochain", "C'est une règle interne GIEA"], correct: 1, explanation: "L'urgence Madelin est réelle : un plafond non utilisé est définitivement perdu. C'est une urgence légitime et factuelle, jamais inventée." },
      { q: "Combien de temps maximum après le RDV doit-on envoyer le devis ?", choices: ["24 heures", "2 heures", "48 heures", "1 semaine"], correct: 1, explanation: "Le devis doit être envoyé dans les 2 heures après le RDV. Plus on attend, plus le client refroidit." },
      { q: "Quelle est la durée du délai de rétractation à anticiper après une signature ?", choices: ["7 jours", "10 jours", "14 jours", "30 jours"], correct: 2, explanation: "14 jours de délai de rétractation légal en France. Il faut prévoir une relance à J+12 pour s'assurer que tout va bien." },
      { q: "Comment répondre à 'J'ai déjà une assurance' sans dénigrer la concurrence ?", choices: ["Leur mutuelle est probablement mauvaise", "Très bien, on compare. Vous payez combien et que vous rembourse-t-elle sur le dentaire/optique ?", "Résiliez votre contrat actuel immédiatement", "Je ne peux rien faire si vous avez déjà un contrat"], correct: 1, explanation: "On ne dénigre jamais la concurrence. On propose une comparaison factuelle sur les remboursements réels. Le client tire lui-même ses conclusions." },
    ]
  },

  /* ── JOUR 7 ── */
  {
    id: 7, icon: "🏆", title: "Certification Finale", color: "#533AB7", bg: "#EEEDFE",
    tag: "Certification", desc: "Évaluation complète sur les 7 jours — Score minimum 8/10",
    objectifs: ["Valider toutes les connaissances GIEA", "Obtenir la certification", "Identifier les points faibles résiduels"],
    contenu: [
      {
        titre: "Récapitulatif — Les fondations GIEA",
        corps: `RÈGLES D'OR :\n• 80% écoute / 20% parole en RDV\n• Si ce n'est pas dans Monday, ça n'existe pas\n• Chaque appel = mise à jour du pipeline dans la minute\n• Jamais une réponse vague : toujours structuré, guidé, avec des scripts\n\nCRM MONDAY :\n• Modules : LEADS (pipeline) + RDV (suivi)\n• Statuts : Nouveau / Appel 1-2-3 / Rappel / Non joignable / Mauvais numéro / RDV\n• Le nom dans le module RDV ne se copie PAS automatiquement\n• Notes RDV obligatoires : produit, situation pro, revenus, mutuelle actuelle, objections\n\nDÉBALLE TÉLÉPROSPECTEUR :\n"Je ne cherche pas à vous vendre quelque chose, mais à comparer... Matin ou après-midi ?"`,
      },
      {
        titre: "Récapitulatif — Les produits",
        corps: `MUTUELLE SWISSLIFE (8 étapes) :\nHospitalisation → Dentaire (orho non remboursée après 16 ans) → Optique → Soins courants → Médecines douces (5 séances/an) → Médicaments (150€/an) → Auditif → Closing\n\nPRÉVOYANCE CEGEMA (Chirurgien, 25 ans, 2 500€/mois) :\n• 76,60€/mois cotisation\n• Capital décès : 323 000€\n• IJ franchise 0-3-15 : 1 267€/mois\n• Rente invalidité dès J1095 : 1 156€/mois\n• CARMF verse 1 232€ sur 2 500€ de revenu (49%)\n\nPER SWISSLIFE :\n• Formule : Économie fiscale = Versement × TMI\n• Ex : 6 541€ × 30% = 1 962€ d'économie / 4 579€ d'effort réel\n• Capital Kevin Jarmoune à 67 ans : 908 453€\n• Plafond non utilisé = définitivement perdu\n\nASSURANCE VIE ÉVOLUTION PLUS :\n• Avant 8 ans : flat tax 30%\n• Après 8 ans : abattement 4 600€ (célibataire) / 9 200€ (couple)\n• Transmission : 152 500€/bénéficiaire hors succession\n• Primes avant vs après 27/09/2017 → régime fiscal différent`,
      },
    ],
    quiz: [
      { q: "Quelle formule permet de calculer l'économie fiscale Madelin ?", choices: ["Versement + TMI", "Versement ÷ TMI", "Versement × TMI", "TMI × 12"], correct: 2, explanation: "Économie fiscale = Versement × TMI. Fondamental pour convaincre un TNS." },
      { q: "Quelle est la cotisation mensuelle de la prévoyance pour un chirurgien de 25 ans (2 500€/mois) ?", choices: ["45€/mois", "62€/mois", "76,60€/mois", "95€/mois"], correct: 2, explanation: "76,60€/mois TTC toutes garanties incluses (décès, maintien de revenu, frais généraux, confort hospitalier)." },
      { q: "Après combien d'années d'assurance vie l'abattement fiscal s'applique-t-il ?", choices: ["5 ans", "8 ans", "10 ans", "15 ans"], correct: 1, explanation: "Après 8 ans : abattement de 4 600€/an pour un célibataire, 9 200€/an pour un couple." },
      { q: "Que se passe-t-il si un plafond Madelin n'est pas utilisé dans l'année ?", choices: ["Il est reporté à l'année suivante", "Il est définitivement perdu", "Il peut être utilisé dans les 3 ans", "Il est automatiquement investi en PER"], correct: 1, explanation: "Un plafond Madelin non utilisé est définitivement perdu. C'est l'urgence commerciale absolue du déballe Madelin." },
      { q: "Dans le CRM Monday, que faut-il faire quand un lead accepte un RDV ?", choices: ["Attendre le lendemain pour mettre à jour", "Basculer immédiatement dans le board RDV et coller le nom manuellement", "Envoyer un email de confirmation seulement", "Mettre le statut 'Rappel'"], correct: 1, explanation: "Basculer immédiatement dans le board RDV. Attention : le nom ne se copie pas automatiquement — toujours le coller manuellement." },
      { q: "Quelle franchise prévoyance GIEA recommande pour la plupart des libéraux ?", choices: ["0-3-3 (protection maximale)", "0-3-15 (bon compromis)", "30-30-30 (moins chère)", "90-90-90 (économique)"], correct: 1, explanation: "0-3-15 est recommandée : accident dès J1, hospitalisation dès J4, maladie dès J16. Bon équilibre coût/protection." },
      { q: "Quel est le montant transmissible hors succession par bénéficiaire en assurance vie ?", choices: ["76 000€", "100 000€", "152 500€", "230 000€"], correct: 2, explanation: "152 500€ par bénéficiaire peuvent être transmis hors droits de succession pour les primes versées avant 70 ans." },
      { q: "Comment répondre à l'objection 'Je vais réfléchir' ?", choices: ["D'accord, rappellez-moi quand vous êtes prêt", "Qu'est-ce qui vous retient ? Si je réponds à votre question, on peut avancer ?", "C'est normal, prenez le temps", "Je vous envoie un email récapitulatif"], correct: 1, explanation: "'Qu'est-ce qui vous retient ?' identifie le vrai frein. Sans cette question, le commercial laisse partir le client sans avoir traité l'objection réelle." },
      { q: "Quelle est la règle d'or du CRM GIEA ?", choices: ["Appeler 50 prospects par jour minimum", "Si ce n'est pas dans Monday, ça n'existe pas", "Envoyer un email avant chaque appel", "Ne jamais noter d'informations personnelles"], correct: 1, explanation: "La règle absolue : si ce n'est pas dans Monday, ça n'existe pas. Chaque action tracée = commercial crédible." },
      { q: "Quelle est la rente invalidité versée à vie dans la prévoyance exemple (Chirurgien) ?", choices: ["430€/mois", "760€/mois", "1 156€/mois", "2 070€/mois"], correct: 2, explanation: "1 156€/mois à vie à partir du J1095 (3 ans d'arrêt), quand la Sécu arrête les indemnités." },
      { q: "Quel closing technique utilise-t-on pour un TNS avec un plafond Madelin non utilisé ?", choices: ["Closing par résumé des bénéfices", "Closing par urgence réelle : plafond définitivement perdu", "Closing alternatif : 1er ou 15 du mois", "Closing émotionnel sur la famille"], correct: 1, explanation: "Le closing par urgence réelle est le plus puissant : 'Si on ne fait rien ce mois-ci, votre plafond Madelin est définitivement perdu.' C'est une urgence factuelle et légitime." },
      { q: "Dans le script SwissLife mutuelle, combien d'étapes y a-t-il ?", choices: ["5 étapes", "6 étapes", "8 étapes", "10 étapes"], correct: 2, explanation: "8 étapes : présentation → hospitalisation → dentaire → optique → soins courants → médecines douces → médicaments → closing." },
    ]
  },
];

/* ═══════════════════════════════════════
   STORAGE KEY
═══════════════════════════════════════ */
const STORAGE_KEY = "giea_progress_v2";

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function GIEAFormation() {
  const [progress, setProgress] = useState({ scores: {}, jourActuel: 1, failedQuestions: {} });
  const [view, setView] = useState("home");
  const [selectedJour, setSelectedJour] = useState(null);
  const [contentIndex, setContentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  /* Load from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch {}
  }, []);

  const saveProgress = useCallback((p: Progress) => {
    setProgress(p);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
  }, []);

  /* Computed */
  const validatedDays = Object.keys(progress.scores).filter(k => {
    const jid = Number(k);
    return progress.scores[jid] >= (jid === 7 ? 8 : 7);
  });
  const bestScore = Object.values(progress.scores).length > 0 ? Math.max(...Object.values(progress.scores)) : null;

  /* Navigation */
  const openJour = (j: JourData) => {
    if (j.id > progress.jourActuel) return;
    setSelectedJour(j);
    setContentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setQuizScore(0);
    setView("learn");
  };

  const startQuiz = () => { setView("quiz"); setAnswers({}); setSubmitted(false); };

  const submitQuiz = useCallback(() => {
    if (!selectedJour) return;
    let correct = 0;
    const failed: number[] = [];
    selectedJour.quiz.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
      else failed.push(i);
    });
    const score = Math.round((correct / selectedJour.quiz.length) * 10);
    setQuizScore(score);
    setSubmitted(true);

    const minScore = selectedJour.id === 7 ? 8 : 7;
    const newScores = { ...progress.scores, [selectedJour.id]: Math.max(score, progress.scores[selectedJour.id] ?? 0) };
    const newFailed = { ...progress.failedQuestions, [selectedJour.id]: failed };
    let newJour = progress.jourActuel;
    if (score >= minScore && selectedJour.id === progress.jourActuel && progress.jourActuel < 7) {
      newJour = progress.jourActuel + 1;
    }
    saveProgress({ ...progress, scores: newScores, jourActuel: newJour, failedQuestions: newFailed });
  }, [answers, selectedJour, progress, saveProgress]);

  const resetAll = () => {
    const p: Progress = { scores: {}, jourActuel: 1, failedQuestions: {} };
    saveProgress(p);
    setView("home");
    setSelectedJour(null);
  };

  /* Styles helpers */
  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--bg-primary)", border: "0.5px solid var(--border)",
    borderRadius: "var(--radius-lg)", padding: "20px", ...extra,
  });

  const btn = (color: string, extra?: React.CSSProperties): React.CSSProperties => ({
    background: color, color: "#fff", border: "none", borderRadius: "var(--radius-md)",
    padding: "10px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer", ...extra,
  });

  const ghostBtn = (color: string): React.CSSProperties => ({
    background: "transparent", border: `1.5px solid ${color}`, color, borderRadius: "var(--radius-md)",
    padding: "9px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer",
  });

  /* ── HOME ── */
  if (view === "home") {
    const globalAvg = validatedDays.length > 0
      ? Math.round(validatedDays.reduce((s, k) => s + progress.scores[Number(k)], 0) / validatedDays.length)
      : null;

    return (
      
        
          {/* Header */}
          
            🏛️
            GIEA Paris 16 — Formation Closer
            Parcours certifiant · 7/10 minimum par jour · 8/10 pour la certification finale
            
              {[
                { label: "Jour actuel", val: `${progress.jourActuel}/7` },
                { label: "Jours validés", val: `${validatedDays.length}/7` },
                { label: "Moyenne", val: globalAvg !== null ? `${globalAvg}/10` : "—" },
                { label: "Meilleur", val: bestScore !== null ? `${bestScore}/10` : "—" },
              ].map((m, i) => (
                
                  {m.label}
                  {m.val}
                
              ))}
            
          

          {/* Grid jours */}
          
            {JOURS.map(j => {
              const locked = j.id > progress.jourActuel;
              const sc = progress.scores[j.id];
              const minSc = j.id === 7 ? 8 : 7;
              const validated = sc !== undefined && sc >= minSc;
              const failed = sc !== undefined && sc < minSc;
              const failed_q = progress.failedQuestions[j.id] ?? [];

              return (
                <div key={j.id} className="fade-in" onClick={() => !locked && openJour(j)} style={{
                  ...card({ cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.45 : 1, position: "relative",
                    borderColor: validated ? j.color : failed ? "#E24B4A" : "var(--border)",
                    transition: "border-color 0.2s, transform 0.15s",
                  }),
                }}>
                  
                    {locked ? "🔒" : validated ? `${sc}/10 ✓` : failed ? `${sc}/10 ✗` : j.id === progress.jourActuel ? "● En cours" : ""}
                  
                  
                    {j.icon}
                    Jour {j.id} · {j.tag}
                  
                  {j.title}
                  {j.desc}
                  {failed_q.length > 0 && !validated && (
                    
                      {failed_q.length} question{failed_q.length > 1 ? "s" : ""} à retravailler
                    
                  )}
                
              );
            })}
          

          {/* Weak points panel */}
          {Object.keys(progress.failedQuestions).length > 0 && (
            
              📌 Points à retravailler
              {Object.entries(progress.failedQuestions).map(([jid, qids]) => {
                const jour = JOURS.find(j => j.id === Number(jid));
                if (!jour || qids.length === 0) return null;
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
  }

  /* ── LEARN ── */
  if (view === "learn" && selectedJour) {
    const bloc = selectedJour.contenu[contentIndex];
    const isLast = contentIndex === selectedJour.contenu.length - 1;
    const total = selectedJour.contenu.length;

    return (
      
        
          {/* Nav */}
          
            <button onClick={() => setView("home")} style={ghostBtn(selectedJour.color)}>← Retour
            {selectedJour.icon} Jour {selectedJour.id} — {selectedJour.title}
            {contentIndex + 1} / {total}
          

          {/* Objectifs */}
          {contentIndex === 0 && (
            
              🎯 Objectifs du jour
              {selectedJour.objectifs.map((o, i) => (
                
                  ✓ {o}
                
              ))}
            
          )}

          {/* Contenu */}
          
            {bloc.titre}
            {bloc.corps.split("\n").map((line, i) => {
              if (!line.trim()) return ;
              const isBullet = line.startsWith("•") || line.startsWith("→") || line.startsWith("⚠️") || line.startsWith("✅");
              return (
                
                  {line}
                
              );
            })}
          

          {/* Progress bar */}
          
            <div style={{ width: `${((contentIndex + 1) / total) * 100}%`, height: "100%", background: selectedJour.color, borderRadius: 99, transition: "width 0.3s" }} />
          

          {/* Navigation */}
          
            <button disabled={contentIndex === 0} onClick={() => setContentIndex(i => i - 1)} style={ghostBtn(selectedJour.color)}>← Précédent
            {isLast
              ? Passer au quiz →
              : <button onClick={() => setContentIndex(i => i + 1)} style={btn(selectedJour.color)}>Suivant →
            }
          
        
      
    );
  }

  /* ── QUIZ ── */
  if (view === "quiz" && selectedJour) {
    const minSc = selectedJour.id === 7 ? 8 : 7;
    const isPass = quizScore >= minSc;
    const allAnswered = selectedJour.quiz.every((_, i) => answers[i] !== undefined);

    if (submitted) {
      /* Results screen */
      const correctCount = selectedJour.quiz.filter((q, i) => answers[i] === q.correct).length;
      const wrongIdxs = selectedJour.quiz.map((q, i) => ({ q, i })).filter(({ q, i }) => answers[i] !== q.correct);

      return (
        
          
            {/* Score card */}
            
              {isPass ? "🎉" : "📚"}
              {quizScore}/10
              
                {isPass ? `Jour ${selectedJour.id} validé !` : `Score insuffisant — minimum ${minSc}/10`}
              
              
                {correctCount}/{selectedJour.quiz.length} bonnes réponses
              
            

            {/* Corrections */}
            {wrongIdxs.length > 0 && (
              
                ❌ Questions ratées — Corrections
                {wrongIdxs.map(({ q, i }) => (
                  
                    Q{i + 1}. {q.q}
                    ❌ Votre réponse : {q.choices[answers[i]]}
                    ✅ Bonne réponse : {q.choices[q.correct]}
                    💡 {q.explanation}
                  
                ))}
              
            )}

            {/* Points forts */}
            {correctCount > 0 && (
              
                ✅ Points maîtrisés ({correctCount})
                {selectedJour.quiz.filter((_, i) => answers[i] === selectedJour.quiz[i].correct).map((q, i) => (
                  • {q.q}
                ))}
              
            )}

            {/* Actions */}
            
              {!isPass && (
                <button onClick={() => { setAnswers({}); setSubmitted(false); }} style={btn("#E24B4A", { flex: 1 })}>
                  🔄 Refaire le test
                
              )}
              <button onClick={() => { setView("learn"); setContentIndex(0); setAnswers({}); setSubmitted(false); }} style={ghostBtn(selectedJour.color)}>
                Revoir le cours
              
              <button onClick={() => setView("home")} style={btn(selectedJour.color, { flex: 1 })}>
                {isPass && progress.jourActuel > selectedJour.id ? "Jour suivant →" : "← Accueil"}
              
            
          
        
      );
    }

    /* Quiz form */
    return (
      
        
          
            <button onClick={() => setView("learn")} style={ghostBtn(selectedJour.color)}>← Cours
            {selectedJour.icon} Quiz — Jour {selectedJour.id}
            Min. {minSc}/10
          

          
            
              {selectedJour.quiz.length} questions · {Object.keys(answers).length}/{selectedJour.quiz.length} répondues
            
          

          {selectedJour.quiz.map((q, i) => (
            
              
                Q{i + 1}. {q.q}
              
              {q.choices.map((c, ci) => {
                const selected = answers[i] === ci;
                return (
                  <div key={ci} onClick={() => setAnswers(a => ({ ...a, [i]: ci }))} style={{
                    padding: "10px 14px", marginBottom: 8, borderRadius: "var(--radius-md)", cursor: "pointer",
                    border: `1.5px solid ${selected ? selectedJour.color : "var(--border)"}`,
                    background: selected ? selectedJour.bg : "var(--bg-secondary)",
                    fontSize: 13, fontWeight: selected ? 600 : 400, transition: "all 0.15s",
                  }}>
                    
                      {["A", "B", "C", "D"][ci]}.
                    
                    {c}
                  
                );
              })}
            
          ))}

          
            
              Valider mes réponses →
            
            {!allAnswered && (
              
                Répondez à toutes les questions avant de valider ({selectedJour.quiz.length - Object.keys(answers).length} restante{selectedJour.quiz.length - Object.keys(answers).length > 1 ? "s" : ""})
              
            )}
          
        
      
    );
  }

  return null;
}
```

  return null;
}
```
