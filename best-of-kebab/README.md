# Best Of Kebab — site web

Site vitrine pour Best Of Kebab (Avenue des Casernes 11, 1040 Etterbeek), prêt à déployer sur GitHub Pages tel quel.

## Structure du projet

```
.
├── index.html                  ← page d'accueil (à la racine, requis pour GitHub Pages)
├── favicon.ico                 ← icône d'onglet navigateur (multi-résolution)
├── manifest.json               ← manifeste web (icônes, nom, couleurs — "ajouter à l'écran d'accueil")
├── robots.txt                  ← autorise l'indexation, pointe vers sitemap.xml
├── sitemap.xml                 ← plan du site pour les moteurs de recherche
├── css/
│   └── style.css               ← toutes les feuilles de style
├── js/
│   └── main.js                 ← toutes les interactions (menu, avis, cookies, horaires...)
├── assets/
│   ├── img/                    ← photos, logo, avatars des avis, icônes
│   └── video/
│       └── hero.mp4            ← vidéo de fond de la page d'accueil
├── legal/
│   ├── mentions-legales.html
│   ├── confidentialite.html
│   └── cookies.html
└── README.md
```

Tous les chemins utilisés dans le site sont **relatifs** — aucune dépendance à un chemin local, à un environnement de développement, ou à un quelconque service tiers autre que Google Fonts (polices, via CDN) et la carte Google Maps intégrée (iframe). Rien ne dépend de Claude ni d'un environnement temporaire : tu peux déposer ce dossier tel quel sur GitHub et le site fonctionnera immédiatement.

## Déployer sur GitHub Pages

1. Crée un nouveau dépôt sur GitHub (ex. `best-of-kebab`).
2. Dépose **tout le contenu de ce dossier** (pas le dossier lui-même) à la racine du dépôt — `index.html`, `favicon.ico`, etc. doivent être directement visibles à la racine, pas dans un sous-dossier.
3. Va dans **Settings → Pages** du dépôt.
4. Sous "Build and deployment", choisis la branche `main` (ou `master`) et le dossier `/ (root)`.
5. Clique sur **Save**. Le site sera en ligne en HTTPS après 1 à 2 minutes, à une adresse du type :
   `https://ton-pseudo.github.io/best-of-kebab/`

## À personnaliser avant mise en ligne

- **Nom de domaine** : `robots.txt`, `sitemap.xml`, et les balises Open Graph / Twitter Card / canonical dans `index.html` contiennent toutes le placeholder `https://votre-domaine.example/`. Remplace-le partout par ta vraie adresse une fois connue (ex. `https://ton-pseudo.github.io/best-of-kebab/` ou ton nom de domaine personnalisé) — sinon les partages sur les réseaux sociaux et l'indexation Google utiliseront cette fausse adresse.
- **E-mail de contact** : `contact@bestofkebabetterbeek.be` est utilisé par défaut dans les mentions légales, la politique de confidentialité et le formulaire de contact — remplace-le par l'adresse réelle si elle diffère (recherche ce texte dans `index.html`, `legal/mentions-legales.html` et `legal/confidentialite.html`).
- **Prix "à la carte"** : les plats du Pain Turc (Pitta, Poulet, Viande, Merguez, Mixte) n'avaient pas de prix lisible sur la photo du tableau — à compléter dans `index.html` (section `#menu`, onglet "Durum & Pain Turc") si tu as l'info.
- **Horaires** : actuellement fixées à 11h–00h tous les jours (confirmé via la fiche Google et heures.be au moment de la création du site). Si elles changent, modifie le tableau `schedule` en haut de `js/main.js`.
- **Avis Google** : les textes affichés sont réels et non modifiés, avec mention de la source. Un avis peut être retiré sur demande de son auteur (lien de contact prévu dans la section Avis).

## Fonctionnalités incluses

- Vidéo en fond de page d'accueil (autoplay, muette, en boucle)
- Menu complet filtrable par recherche, organisé par catégories (barre latérale sur ordinateur) : Snacks Simples, Durum & Pain Turc, Gyros, Bicky, Salade, Menus, Assiettes, Boissons
- 7 "menus vedettes" en photo (Durum, Kofte, Pain Turc, Bicky, Kapsalon, Salade de Poulet, Tacos)
- Galerie photo (façade, cuisine, vitrines, préparation) avec mise en collage sur ordinateur
- Carousel d'avis Google qui défile automatiquement, en boucle CSS pure (aucun script requis pour l'animation)
- Horaires avec statut Ouvert/Fermé calculé en direct
- Formulaire de contact (ouvre le client mail avec le message pré-rempli — site statique, pas de serveur)
- Bannière de consentement aux cookies (Tout accepter / Tout refuser / Personnaliser) + lien permanent "Gérer mes cookies"
- Pages légales séparées : mentions légales, politique de confidentialité, politique de cookies
- Section allergènes
- Favicon, manifest et balises de partage (Open Graph / Twitter Card) prêts pour la recherche Google et le partage sur les réseaux
