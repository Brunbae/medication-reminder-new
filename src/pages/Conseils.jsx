import React, { useState } from 'react';
import styles from './Conseils.module.css';

const conseilsData = {
  medicaments: [
    "Prenez toujours vos médicaments à la même heure chaque jour.",
    "Ne jamais arrêter un traitement sans l'avis de votre médecin.",
    "Rangez vos médicaments dans un endroit frais et sec, hors de portée des enfants.",
    "Lisez toujours la notice avant de prendre un médicament.",
    "En cas d'oubli d'une dose, ne doublez jamais la dose suivante.",
    "Signalez toujours vos allergies à votre médecin et pharmacien.",
    "Vérifiez la date de péremption de vos médicaments régulièrement.",
    "Ne partagez jamais vos médicaments avec une autre personne.",
  ],
  alimentation: [
    "Buvez au moins 6 à 8 verres d'eau par jour.",
    "Mangez des fruits et légumes frais à chaque repas.",
    "Réduisez la consommation de sel pour protéger votre cœur.",
    "Préférez les graisses végétales (huile d'olive) aux graisses animales.",
    "Consommez des produits laitiers pour renforcer vos os.",
    "Évitez les aliments trop sucrés et les boissons sucrées.",
    "Mangez lentement et mâchez bien vos aliments.",
    "Faites 3 repas équilibrés par jour à heures fixes.",
  ],
  exercice: [
    "Marchez au moins 30 minutes par jour à votre rythme.",
    "Faites des exercices d'étirement le matin pour assouplir vos articulations.",
    "La natation est excellente pour les articulations — douce et efficace.",
    "Évitez de rester assis plus de 2 heures sans vous lever.",
    "Des exercices d'équilibre aident à prévenir les chutes.",
    "Le vélo stationnaire est idéal pour faire du sport sans risque.",
    "Consultez votre médecin avant de commencer un nouveau sport.",
    "Faites de la gym douce ou du yoga adapté aux seniors.",
  ],
  stress: [
    "Pratiquez la respiration profonde : inspirez 4 secondes, expirez 6 secondes.",
    "Parlez de vos soucis à un proche ou à votre médecin.",
    "Écoutez de la musique douce pour vous détendre.",
    "Évitez les informations négatives avant de dormir.",
    "Pratiquez des activités qui vous plaisent chaque jour.",
    "La prière ou la méditation aide à trouver la paix intérieure.",
    "Un câlin ou une conversation avec un proche fait beaucoup de bien.",
    "Écrivez vos pensées dans un journal pour vous libérer l'esprit.",
  ],
  sommeil: [
    "Couchez-vous et levez-vous à la même heure chaque jour.",
    "Évitez le café et le thé après 15h.",
    "Gardez votre chambre fraîche, sombre et calme.",
    "Évitez les écrans (téléphone, télévision) 1 heure avant de dormir.",
    "Un verre de lait chaud avant de dormir aide à s'endormir.",
    "Faites une courte sieste de 20 minutes si vous êtes fatigué.",
    "Ne mangez pas trop lourd le soir pour mieux dormir.",
    "Une promenade le soir améliore la qualité du sommeil.",
  ],
  hygiene: [
    "Lavez-vous les mains régulièrement avec du savon.",
    "Brossez-vous les dents matin et soir pendant 2 minutes.",
    "Consultez votre médecin au moins une fois tous les 6 mois.",
    "Faites contrôler votre tension artérielle régulièrement.",
    "Évitez de fumer — c'est la meilleure chose pour votre santé.",
    "Exposez-vous au soleil 15 minutes par jour pour la vitamine D.",
    "Gardez votre maison propre et bien aérée.",
    "Portez des vêtements adaptés à la météo pour éviter les rhumes.",
  ],
};

const categories = [
  { id: 'medicaments', label: '💊 Médicaments' },
  { id: 'alimentation', label: '🥗 Alimentation' },
  { id: 'exercice', label: '🚶 Exercice' },
  { id: 'stress', label: '🧘 Stress' },
  { id: 'sommeil', label: '😴 Sommeil' },
  { id: 'hygiene', label: '🌿 Hygiène de vie' },
];

const Conseils = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [conseils, setConseils] = useState([]);

  const getConseils = (cat) => {
    setSelectedCategory(cat.id);
    const liste = conseilsData[cat.id];
    const melanges = [...liste].sort(() => Math.random() - 0.5).slice(0, 3);
    setConseils(melanges);
  };

  return (
    <div className={styles.conseilsContainer}>
      <div className={styles.conseilsHeader}>
        <h1>Astuces &amp; Conseils</h1>
        <p>Choisissez un thème pour recevoir des conseils santé</p>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
            onClick={() => getConseils(cat)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.conseilsResult}>
        {conseils.length > 0 && (
          <div className={styles.conseilCard}>
            <h2>{categories.find(c => c.id === selectedCategory)?.label}</h2>
            <div className={styles.conseilText}>
              {conseils.map((c, i) => (
                <div key={i} className={styles.conseilItem}>
                  <span className={styles.conseilNum}>{i + 1}</span>
                  <p>{c}</p>
                </div>
              ))}
            </div>
            <button
              className={styles.refreshBtn}
              onClick={() => getConseils(categories.find(c => c.id === selectedCategory))}
            >
              🔄 Autres conseils
            </button>
          </div>
        )}

        {conseils.length === 0 && (
          <div className={styles.placeholderBox}>
            <div className={styles.placeholderIcon}>💡</div>
            <p>Appuyez sur un thème ci-dessus pour recevoir vos conseils santé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conseils;
