import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import styles from './Register.module.css';

const Register = () => {
  const [etape, setEtape] = useState(1);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [form, setForm] = useState({
    prenom: '', nom: '', age: '', sexe: '', telephone: '', poids: '', taille: '',
    groupeSanguin: '', tensionArterielle: '', maladiesChroniques: '', allergies: '',
    medecinTraitant: '', contactUrgence: '',
    email: '', password: '', confirmPassword: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const etapeSuivante = () => {
    if (etape === 1) {
      if (!form.prenom || !form.nom || !form.age || !form.sexe) {
        setMessage('Veuillez remplir tous les champs obligatoires (*).'); setIsError(true); return;
      }
      if (form.age && (form.age < 1 || form.age > 120)) {
        setMessage("L'âge doit être compris entre 1 et 120 ans."); setIsError(true); return;
      }
    }
    if (etape === 2 && !form.groupeSanguin) {
      setMessage('Veuillez sélectionner votre groupe sanguin.'); setIsError(true); return;
    }
    setMessage(''); setIsError(false); setEtape(etape + 1);
  };

  const etapePrecedente = () => { setMessage(''); setIsError(false); setEtape(etape - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setIsError(true); setMessage('Les mots de passe ne correspondent pas.'); return; }
    if (form.password.length < 6) { setIsError(true); setMessage('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    if (!form.email) { setIsError(true); setMessage("L'adresse email est obligatoire."); return; }
    try {
      await AuthService.register({
        prenom: form.prenom, nom: form.nom, age: parseInt(form.age), sexe: form.sexe,
        telephone: form.telephone, poids: form.poids ? parseFloat(form.poids) : null,
        taille: form.taille ? parseInt(form.taille) : null,
        groupeSanguin: form.groupeSanguin, tensionArterielle: form.tensionArterielle,
        maladiesChroniques: form.maladiesChroniques, allergies: form.allergies,
        medecinTraitant: form.medecinTraitant, contactUrgence: form.contactUrgence,
        email: form.email, password: form.password,
      });
      setIsError(false); setMessage('✅ Compte créé avec succès !');
      setTimeout(() => { window.location.href = '/login'; }, 1500);
    } catch (error) {
      setIsError(true); setMessage('❌ Erreur lors de la création du compte. Veuillez réessayer.');
    }
  };

  const etapes = ['Profil', 'Santé', 'Compte'];

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.registerHeader}>
          <div className={styles.registerIcon}>👤</div>
          <h1>Créer un compte</h1>
          <p className={styles.registerSub}>Étape {etape} sur 3 — {etapes[etape - 1]}</p>
        </div>

        <div className={styles.progressBar}>
          {etapes.map((label, i) => (
            <React.Fragment key={i}>
              <div className={`${styles.progressStep} ${etape >= i + 1 ? styles.active : ''}`}>
                <div className={styles.stepCircle}>{etape > i + 1 ? '✓' : i + 1}</div>
                <span>{label}</span>
              </div>
              {i < etapes.length - 1 && (
                <div className={`${styles.progressLine} ${etape >= i + 2 ? styles.active : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ÉTAPE 1 */}
        {etape === 1 && (
          <div className={styles.formEtape}>
            <div className={styles.formRow2}>
              <div className={styles.formGroup}>
                <label>Prénom *</label>
                <input type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Jean" required />
              </div>
              <div className={styles.formGroup}>
                <label>Nom *</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Dupont" required />
              </div>
            </div>
            <div className={styles.formRow2}>
              <div className={styles.formGroup}>
                <label>Âge *</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="72" min="1" max="120" required />
              </div>
              <div className={styles.formGroup}>
                <label>Téléphone</label>
                <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="+228 90 00 00 00" />
              </div>
            </div>
            <div className={styles.formRow2}>
              <div className={styles.formGroup}>
                <label>⚖️ Poids (kg)</label>
                <input type="number" name="poids" value={form.poids} onChange={handleChange} placeholder="70" min="1" step="0.1" />
              </div>
              <div className={styles.formGroup}>
                <label>📏 Taille (cm)</label>
                <input type="number" name="taille" value={form.taille} onChange={handleChange} placeholder="170" min="50" max="250" />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Sexe *</label>
              <div className={styles.radioGroup}>
                <label className={`${styles.radioBtn} ${form.sexe === 'Homme' ? styles.selected : ''}`}>
                  <input type="radio" name="sexe" value="Homme" checked={form.sexe === 'Homme'} onChange={handleChange} />
                  👨 Homme
                </label>
                <label className={`${styles.radioBtn} ${form.sexe === 'Femme' ? styles.selected : ''}`}>
                  <input type="radio" name="sexe" value="Femme" checked={form.sexe === 'Femme'} onChange={handleChange} />
                  👩 Femme
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 */}
        {etape === 2 && (
          <div className={styles.formEtape}>
            <div className={styles.formGroup}>
              <label>🩸 Groupe sanguin *</label>
              <div className={styles.bloodGroupGrid}>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((g) => (
                  <label key={g} className={`${styles.bloodBtn} ${form.groupeSanguin === g ? styles.selected : ''}`}>
                    <input type="radio" name="groupeSanguin" value={g} checked={form.groupeSanguin === g} onChange={handleChange} />
                    {g}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>🩺 Tension artérielle habituelle</label>
              <input type="text" name="tensionArterielle" value={form.tensionArterielle} onChange={handleChange} placeholder="Ex : 12/8" />
              <small>Exemple : 12/8 ou 120/80</small>
            </div>
            <div className={styles.formGroup}>
              <label>🏥 Maladies chroniques</label>
              <input type="text" name="maladiesChroniques" value={form.maladiesChroniques} onChange={handleChange} placeholder="Ex : Diabète, Hypertension" />
              <small>Séparez par des virgules si plusieurs</small>
            </div>
            <div className={styles.formGroup}>
              <label>⚠️ Allergies médicamenteuses</label>
              <input type="text" name="allergies" value={form.allergies} onChange={handleChange} placeholder="Ex : Pénicilline, Aspirine" />
            </div>
            <div className={styles.formGroup}>
              <label>👨‍⚕️ Médecin traitant</label>
              <input type="text" name="medecinTraitant" value={form.medecinTraitant} onChange={handleChange} placeholder="Dr. Martin - +228 90 00 00 00" />
            </div>
            <div className={styles.formGroup}>
              <label>📞 Contact d'urgence</label>
              <input type="text" name="contactUrgence" value={form.contactUrgence} onChange={handleChange} placeholder="Marie Dupont - +228 90 00 00 00" />
            </div>
          </div>
        )}

        {/* ÉTAPE 3 */}
        {etape === 3 && (
          <form className={styles.formEtape} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>📧 Adresse email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jean.dupont@email.com" required />
              <small>Utilisé pour vous connecter</small>
            </div>
            <div className={styles.formGroup}>
              <label>🔒 Mot de passe *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
              <small>Minimum 6 caractères</small>
            </div>
            <div className={styles.formGroup}>
              <label>🔒 Confirmer le mot de passe *</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
            </div>
            {message && <div className={isError ? styles.errorMsg : styles.successMsg}>{message}</div>}
            <button type="submit" className={styles.btnPrimary}>🎉 Créer mon compte</button>
          </form>
        )}

        {etape < 3 && message && (
          <div className={isError ? styles.errorMsg : styles.successMsg}>{message}</div>
        )}

        <div className={styles.navBtns}>
          {etape > 1 && (
            <button type="button" className={styles.btnSecondary} onClick={etapePrecedente}>← Retour</button>
          )}
          {etape < 3 && (
            <button type="button" className={styles.btnPrimary} onClick={etapeSuivante}>Suivant →</button>
          )}
        </div>

        <div className={styles.authFooter}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
