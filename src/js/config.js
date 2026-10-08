/**
 * Configuration centrale du site Kodaï.
 * Modifiez ici le téléphone, la clé du formulaire et TOUS les tarifs du simulateur.
 * Les prix sont des exemples : ajustez-les avant la mise en ligne.
 */

export const CONTACT = {
  phoneDisplay: '06 75 31 72 79',
  phoneHref: 'tel:+33675317279',
};

// Clé Web3Forms (gratuite sur https://web3forms.com), à mettre dans le fichier .env
export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

// « HT », ou « TTC » si vous facturez la TVA et préférez afficher les prix TTC.
export const TAX_LABEL = 'HT';

export const PRICING = {
  // Les groupes marqués perLocation sont multipliés par le nombre d'établissements.
  groups: [
    {
      id: 'site',
      title: 'Site internet',
      type: 'radio',
      options: [
        { id: 'none', label: 'Pas besoin pour l’instant', desc: 'Vous avez déjà un site, ou vous commencez par Google.' },
        { id: 'onepage', label: 'Site vitrine une page', desc: 'Présentation, services, avis, contact : l’essentiel pour être appelé.', monthly: 39, setup: 190 },
        { id: 'multi', label: 'Site multi-pages', desc: 'Jusqu’à 6 pages : une page par service, galerie, actualités…', monthly: 69, setup: 390 },
      ],
    },
    {
      id: 'gbp',
      title: 'Fiche Google Business',
      type: 'radio',
      perLocation: true,
      options: [
        { id: 'none', label: 'Pas besoin', desc: 'Votre fiche est déjà gérée.' },
        { id: 'create', label: 'Création et optimisation', desc: 'On crée ou reprend votre fiche et on l’optimise une fois pour toutes.', setup: 149 },
        { id: 'managed', label: 'Création + gestion mensuelle', desc: 'Publications, photos, horaires, questions : votre fiche vit toute l’année.', monthly: 29, setup: 149 },
      ],
    },
    {
      id: 'reviews',
      title: 'Avis clients',
      type: 'checkbox',
      perLocation: true,
      options: [
        { id: 'replies', label: 'Réponses à vos avis', desc: 'Une réponse personnalisée à chaque avis, sous 48 h.', monthly: 19 },
        { id: 'kit', label: 'Kit collecte d’avis', desc: 'QR code, cartes et sticker comptoir pour inviter vos clients à donner leur avis.', setup: 59 },
      ],
    },
    {
      id: 'options',
      title: 'Options',
      type: 'checkbox',
      options: [
        { id: 'booking', label: 'Prise de rendez-vous en ligne', desc: 'Vos clients réservent directement depuis votre site.', monthly: 15, requires: 'site' },
        { id: 'seo', label: 'Article mensuel & référencement local', desc: 'Un contenu par mois pour grimper sur Google.', monthly: 29 },
        { id: 'logo', label: 'Création ou rafraîchissement de logo', desc: 'Une identité claire, déclinée sur votre site et votre fiche.', setup: 190 },
        { id: 'photos', label: 'Séance photo sur place', desc: 'Limoges et alentours, 20 photos retouchées.', setup: 150 },
      ],
    },
  ],

  locations: { min: 1, max: 10, label: 'Nombre d’établissements', hint: 'La fiche Google et les avis sont comptés par établissement.' },

  // Remise appliquée sur l'abonnement mensuel quand l'offre est complète.
  bundle: {
    label: 'Pack complet',
    discount: 0.15,
    isEligible: (s) => s.site !== 'none' && s.gbp === 'managed' && s.reviews.includes('replies'),
  },

  defaults: { site: 'onepage', gbp: 'managed', reviews: ['replies'], options: [], locations: 1 },

  presets: [
    { id: 'google', label: 'Visibilité Google', sel: { site: 'none', gbp: 'managed', reviews: ['replies'], options: [] } },
    { id: 'vitrine', label: 'Site vitrine', sel: { site: 'onepage', gbp: 'create', reviews: [], options: [] } },
    { id: 'complet', label: 'Pack complet', sel: { site: 'multi', gbp: 'managed', reviews: ['replies', 'kit'], options: ['seo'] } },
  ],
};
