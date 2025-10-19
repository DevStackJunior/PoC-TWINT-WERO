\# 💳 Proof of Concept – Fusion de 2 applications financières avec AdonisJS



\## 🧠 Contexte



Ce Proof of Concept (PoC) démontre la faisabilité technique de la \*\*\*fusion\* de formats transactionnels différents en provenance de deux applications financières\*\* en une seule plateforme unifiée, à l’aide du framework \*\*AdonisJS\*\*.  

Les sources de données sont \*\*deux fichiers JSON locaux\*\* représentant deux environnements bancaires différents :  

🇨🇭 \*\*TWINT (normes suisses)\*\* et 🇪🇺 \*\*WERO (normes européennes)\*\*.



Aucune API externe n’est utilisée — toutes les données sont \*\*chargées localement\*\*, \*\*fusionnées en base MySQL\*\*, puis \*\*consultées depuis le dossier `/resources/`\*\*.



---



\## 🎯 Objectifs du PoC



\### Objectifs principaux



\- \*\*Fusion des données\*\* de deux systèmes financiers distincts (App A et App B).  

\- \*\*Chargement depuis fichiers JSON locaux\*\* sans dépendance externe.  

\- \*\*Architecture modulaire\*\* pour isoler la logique de chaque application.  

\- \*\*Gestion commune de la logique métier\*\*, services et schémas.  

\- \*\*Fusion et transformation des données\*\* dans un format unique.  

\- \*\*Migration Opérationnelle\*\* vers une base SQL complète.  



---



\## ⚙️ Objectifs techniques



\### 1. Environnement \& persistance



\- Utilisation d’un \*\*conteneur MySQL (Docker)\*\* pour centraliser les données fusionnées.  

\- \*\*Lecture et importation\*\* des fichiers `/data/a.json` et `/data/b.json` dans la base à l’initialisation du projet.  

\- \*\*Aucune route API brute exposée\*\* : les données sont exploitées depuis le dossier `/data/`.  

\- Possibilité d’utiliser des \*\*scripts de seeding AdonisJS\*\* pour automatiser le chargement.



---



\### 2. Sources de données locales



Les deux fichiers JSON sont \*\*identiques en structure\*\* (même schéma, mêmes clés),  

mais leurs \*\*contenus diffèrent\*\* (valeurs, montants, devises, origine, etc.).



| Fichier | Origine | Description | Format |

|----------|----------|-------------|---------|

| `/data/a.json` | 🇨🇭 \*\*App A – TWINT / Swiss Payment Standard\*\* | Données simulées selon les normes suisses (TWINT / Swiss QR Bill / ISO 20022) | ✅ Identique à `/data/b.json` |

| `/data/b.json` | 🇪🇺 \*\*App B – WERO / PSD2 Berlin Group\*\* | Données simulées selon les normes européennes (Open Banking / PSD2 Berlin Group) | ✅ Identique à `/data/a.json` |



> 🔹 Les deux fichiers partagent le \*\*même format JSON unifié\*\*, garantissant une intégration directe.  

> Seuls les contenus varient selon le contexte (devise, identifiant, typologie, etc.).



---



\### 3. Processus de fusion et de lecture



1\. \*\*Chargement initial\*\*

&nbsp;  - Les fichiers `/data/a.json` et `/data/b.json` sont lus par `DataLoaderService`.  

&nbsp;  - Chaque entrée est validée, enrichie et préparée pour insertion.



2\. \*\*Insertion et fusion en base\*\*

&nbsp;  - Les enregistrements sont insérés dans MySQL.  

&nbsp;  - Une table unique regroupe toutes les transactions avec un champ d’origine :  

&nbsp;    - `"origin": "SWISS"` pour `/data/a.json`  

&nbsp;    - `"origin": "EU"` pour `/data/b.json`.



3\. \*\*Lecture depuis `/resources/`\*\*

&nbsp;  - Les vues, scripts ou exports dans `/resources/` accèdent directement à la base.  

&nbsp;  - Aucun dossier `/api/` n’est utilisé : tout est interne et géré par AdonisJS.



---



\### 4. Normalisation \& validation



Avant insertion en base, un service de normalisation applique :



\- ✅ \*\*Validation de structure\*\* (`user\_id`, `merchant\_id`, `amount`, `currency\_id`, etc.)  

\- 🔄 \*\*Conversion de statuts\*\* → normes ISO 20022 :  

&nbsp; `completed` → `BOOKED`, `pending` → `PENDING`, `failed` → `REJECTED`  

\- 💱 \*\*Uniformisation des devises\*\* selon \*\*ISO 4217\*\* (CHF, EUR, etc.) 



---



\### 📂 Arborescence globale



```bash

/app

&nbsp;├── controllers/              # Contrôleurs métier : lecture et fusion des données JSON

&nbsp;├── data/                     # Données JSON brutes simulant deux environnements bancaires

&nbsp;│   ├── a.json                # 🇨🇭 Données TWINT / Swiss Payment Standard

&nbsp;│   └── b.json                # 🇪🇺 Données WERO / PSD2 Berlin Group

&nbsp;├── exceptions/               # Gestion des erreurs et exceptions globales

&nbsp;├── middleware/               # Middlewares AdonisJS (container bindings, etc.)

&nbsp;│   └── container\_bindings\_middleware.ts

&nbsp;├── models/                   # Modèles Lucid ORM (liés à la base MySQL)

&nbsp;│   ├── currency.ts           # Table des devises (ISO 4217)

&nbsp;│   ├── merchant.ts           # Table des marchands

&nbsp;│   ├── test.ts               # Modèle de test / sandbox

&nbsp;│   ├── transaction.ts        # Table principale des transactions

&nbsp;│   ├── user.ts               # Table des utilisateurs

&nbsp;│   └── wallet.ts             # Table des portefeuilles électroniques

/bin                           # Scripts CLI (ex: seed, maintenance)

/config                        # Configuration AdonisJS (app, database, etc.)

/database                      # Migrations et seeds pour la base MySQL

/resources                     # Couche présentation : CSS, JS et templates Edge

&nbsp;│

&nbsp;├── css/                      # Feuilles de styles du front-end

&nbsp;│   ├── app.css

&nbsp;│   ├── dashboard.css

&nbsp;│   └── home.css

&nbsp;│

&nbsp;├── js/                       # Scripts front-end spécifiques aux vues

&nbsp;│   ├── app.js

&nbsp;│   ├── common.js

&nbsp;│   ├── dashboard.js

&nbsp;│   ├── home.js

&nbsp;│   ├── merchant.js

&nbsp;│   └── pay.js

&nbsp;│

&nbsp;├── views/                    # Templates Edge pour affichage des pages

&nbsp;│   ├── components/layout/    # Composants réutilisables (layout global)

&nbsp;│   │   └── main.edge

&nbsp;│   ├── pages/                # Pages de l’application

&nbsp;│   │   ├── errors/           # Pages d’erreurs (404, 500, etc.)

&nbsp;│   │   ├── dashboard.edge    # Vue du tableau de bord (transactions agrégées)

&nbsp;│   │   ├── merchant.edge     # Vue marchands

&nbsp;│   │   ├── pay.edge          # Vue paiement

&nbsp;│   │   └── home.edge         # Vue d’accueil / overview

&nbsp;│

/start                         # Initialisation (kernel, routes, providers, etc.)



