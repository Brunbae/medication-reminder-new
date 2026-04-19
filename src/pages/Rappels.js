import React, { useState } from 'react';
import { addReminder } from '../services/reminderService';
import './Rappels.css';

const Rappels = () => {
  const [medicament, setMedicament] = useState('');
  const [heure, setHeure] = useState('');
  const [frequence, setFrequence] = useState('');
  const [dosage, setDosage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addReminder({ medicament, heure, frequence, dosage });
    setSuccess(true);
    setMedicament('');
    setHeure('');
    setFrequence('');
    setDosage('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="rappels-container">
      <div className="rappels-header">
        <h1>💊 Programmer un rappel</h1>
        <p>Ajoutez un médicament et son horaire de prise</p>
      </div>

      <div className="form-body">
        <div className="form-card">
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>
                <span className="label-icon">💊</span>
                Nom du médicament
              </label>
              <input
                type="text"
                value={medicament}
                onChange={(e) => setMedicament(e.target.value)}
                placeholder="Ex : Doliprane 500mg"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <span className="label-icon">⏰</span>
                  Heure de prise
                </label>
                <input
                  type="time"
                  value={heure}
                  onChange={(e) => setHeure(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <span className="label-icon">🔁</span>
                  Fréquence
                </label>
                <select
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value)}
                  required
                >
                  <option value="">Choisir...</option>
                  <option value="quotidien">Quotidien</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuel">Mensuel</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">💉</span>
                Dosage (optionnel)
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Ex : 1 comprimé"
              />
            </div>

            <hr className="form-divider" />

            <button type="submit" className="submit-btn">
              ✅ Ajouter le rappel
            </button>

            {success && (
              <div className="success-banner">
                🎉 Rappel ajouté avec succès !
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default Rappels;