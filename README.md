# Kodaï · Site vitrine

Site de l'agence Kodaï (Limoges) : sites internet, fiches Google Business Profile et gestion des avis clients.
Direction artistique « Atelier éditorial » : ivoire, noir encre et or, polices Instrument Serif et Manrope.

## Lancer le site

Prérequis : [Node.js](https://nodejs.org) 20 ou plus récent.

```bash
npm install        # une seule fois, installe Vite et les polices
npm run dev        # lance le site en local → http://localhost:5173
npm run build      # génère la version de production dans dist/
npm run preview    # prévisualise la version de production
```

## Où modifier quoi ?

| Je veux changer…                               | Fichier                                      |
| ---------------------------------------------- | -------------------------------------------- |
| Les textes, sections, FAQ                      | `index.html`                                 |
| Les **tarifs** et options du simulateur        | `src/js/config.js` (objet `PRICING`)         |
| HT / TTC                                       | `src/js/config.js` (`TAX_LABEL`)             |
| Les couleurs, polices, espacements             | `src/styles/main.css` (variables `:root`)    |
| Les mentions légales                           | `mentions-legales.html` (zones surlignées)   |
| Le logo, favicon, image de partage             | `public/`                                    |

## Activer le formulaire de contact

1. Créez une clé gratuite sur [web3forms.com](https://web3forms.com) avec l'e-mail qui doit recevoir les demandes.
2. Copiez `.env.example` en `.env` et collez la clé : `VITE_WEB3FORMS_KEY=votre-cle`.
3. Sur Vercel ou Netlify, ajoutez la même variable dans les réglages du projet.

Tant que la clé est absente, le formulaire invite à appeler le 06 75 31 72 79.

## Mettre en ligne

Vercel ou Netlify (gratuit) : importez le dépôt GitHub. Les réglages sont détectés automatiquement
(commande `npm run build`, dossier `dist`). Branchez ensuite votre nom de domaine.

## Animations

- Apparition au scroll (fondu + translation) avec `IntersectionObserver`
- Header qui se compacte au scroll
- Dégradé animé dans le hero (mis en pause quand il n'est plus visible)
- Boutons magnétiques (souris uniquement)
- Chiffres qui défilent, réponse d'avis « tapée », défilement horizontal des exemples

Toutes les animations ne touchent que `transform` et `opacity` pour rester fluides à 60 fps.
Si l'option système **« Réduire les animations »** est activée (`prefers-reduced-motion`),
tout est désactivé et le contenu s'affiche directement.

## Avant la mise en ligne

- [ ] Valider les tarifs du simulateur et les engagements affichés (7 jours, 48 h, 12 publications/an…)
- [ ] Valider la durée d'engagement indiquée dans la FAQ
- [ ] Compléter les mentions légales (SIRET, hébergeur, responsable…)
- [ ] Activer le formulaire (clé Web3Forms)
- [ ] Remplacer les maquettes fictives par de vraies réalisations dès que possible
