import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Register.css';

const Register = () => {
  const [etape, setEtape] = useState(1);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [form, setForm] = useState({
    // Étape 1 - Profil
    prenom: '',
    nom: '',
    age: '',
    sexe: '',
    telephone: '',
    poids: '',
    taille: '',
    // Étape 2 - Santé
    groupeSanguin: '',
    tensionArterielle: '',
    maladiesChroniques: '',
    allergies: '',
    medecinTraitant: '',
    contactUrgence: '',
    // Étape 3 - Compte
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const etapeSuivante = () => {
    // Validation étape 1
    if (etape === 1) {
      if (!form.prenom || !form.nom || !form.age || !form.sexe) {
        setMessage('Veuillez remplir tous les champs obligatoires (*).');
        setIsError(true);
        return;
      }
      if (form.age && (form.age < 1 || form.age > 120)) {
        setMessage('L\'âge doit être compris entre 1 et 120 ans.');
        setIsError(true);
        return;
      }
    }
    
    // Validation étape 2
    if (etape === 2) {
      if (!form.groupeSanguin) {
        setMessage('Veuillez sélectionner votre groupe sanguin.');
        setIsError(true);
        return;
      }
    }
    
    setMessage('');
    setIsError(false);
    setEtape(etape + 1);
  };

  const etapePrecedente = () => {
    setMessage('');
    setIsError(false);
    setEtape(etape - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (form.password !== form.confirmPassword) {
      setIsError(true);
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (form.password.length < 6) {
      setIsError(true);
      setMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    if (!form.email) {
      setIsError(true);
      setMessage('L\'adresse email est obligatoire.');
      return;
    }
    
    try {
      await AuthService.register({
        // Étape 1
        prenom: form.prenom,
        nom: form.nom,
        age: parseInt(form.age),
        sexe: form.sexe,
        telephone: form.telephone,
        poids: form.poids ? parseFloat(form.poids) : null,
        taille: form.taille ? parseInt(form.taille) : null,
        // Étape 2
        groupeSanguin: form.groupeSanguin,
        tensionArterielle: form.tensionArterielle,
        maladiesChroniques: form.maladiesChroniques,
        allergies: form.allergies,
        medecinTraitant: form.medecinTraitant,
        contactUrgence: form.contactUrgence,
        // Étape 3
        email: form.email,
        password: form.password,
      });
      
      setIsError(false);
      setMessage('✅ Compte créé avec succès !');
      
      // Redirection après 1.5 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      
    } catch (error) {
      setIsError(true);
      setMessage('❌ Erreur lors de la création du compte. Veuillez réessayer.');
      console.error('Erreur inscription:', error);
    }
  };

  const etapes = ['Profil', 'Santé', 'Compte'];

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon">👤</div>
          <h1>Créer un compte</h1>
          <p className="register-sub">
            Étape {etape} sur 3 — {etapes[etape - 1]}
          </p>
        </div>

        {/* Barre de progression */}
        <div className="progress-bar">
          {etapes.map((label, i) => (
            <React.Fragment key={i}>
              <div className={`progress-step ${etape >= i + 1 ? 'active' : ''}`}>
                <div className="step-circle">
                  {etape > i + 1 ? '✓' : i + 1}
                </div>
                <span>{label}</span>
              </div>
              {i < etapes.length - 1 && (
                <div className={`progress-line ${etape >= i + 2 ? 'active' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ÉTAPE 1 - PROFIL */}
        {etape === 1 && (
          <div className="form-etape">
            <div className="form-row-2">
              <div className="form-group">
                <label>Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Jean"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Âge *</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="72"
                  min="1"
                  max="120"
                  required
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="+228 90 00 00 00"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>⚖️ Poids (kg)</label>
                <input
                  type="number"
                  name="poids"
                  value={form.poids}
                  onChange={handleChange}
                  placeholder="70"
                  min="1"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>📏 Taille (cm)</label>
                <input
                  type="number"
                  name="taille"
                  value={form.taille}
                  onChange={handleChange}
                  placeholder="170"
                  min="50"
                  max="250"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Sexe *</label>
              <div className="radio-group">
                <label className={`radio-btn ${form.sexe === 'Homme' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="sexe"
                    value="Homme"
                    checked={form.sexe === 'Homme'}
                    onChange={handleChange}
                  />
                  👨 Homme
                </label>
                <label className={`radio-btn ${form.sexe === 'Femme' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="sexe"
                    value="Femme"
                    checked={form.sexe === 'Femme'}
                    onChange={handleChange}
                  />
                  👩 Femme
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 - SANTÉ */}
        {etape === 2 && (
          <div className="form-etape">
            <div className="form-group">
              <label>🩸 Groupe sanguin *</label>
              <div className="blood-group-grid">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => (
                  <label
                    key={g}
                    className={`blood-btn ${form.groupeSanguin === g ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="groupeSanguin"
                      value={g}
                      checked={form.groupeSanguin === g}
                      onChange={handleChange}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>🩺 Tension artérielle habituelle</label>
              <input
                type="text"
                name="tensionArterielle"
                value={form.tensionArterielle}
                onChange={handleChange}
                placeholder="Ex : 12/8"
              />
              <small>Exemple : 12/8 ou 120/80</small>
            </div>

            <div className="form-group">
              <label>🏥 Maladies chroniques</label>
              <input
                type="text"
                name="maladiesChroniques"
                value={form.maladiesChroniques}
                onChange={handleChange}
                placeholder="Ex : Diabète, Hypertension"
              />
              <small>Séparez par des virgules si plusieurs</small>
            </div>

            <div className="form-group">
              <label>⚠️ Allergies médicamenteuses</label>
              <input
                type="text"
                name="allergies"
                value={form.allergies}
                onChange={handleChange}
                placeholder="Ex : Pénicilline, Aspirine"
              />
              <small>Indiquez les médicaments auxquels vous êtes allergique</small>
            </div>

            <div className="form-group">
              <label>👨‍⚕️ Médecin traitant</label>
              <input
                type="text"
                name="medecinTraitant"
                value={form.medecinTraitant}
                onChange={handleChange}
                placeholder="Dr. Martin - +228 90 00 00 00"
              />
              <small>Nom et contact de votre médecin</small>
            </div>

            <div className="form-group">
              <label>📞 Contact d'urgence</label>
              <input
                type="text"
                name="contactUrgence"
                value={form.contactUrgence}
                onChange={handleChange}
                placeholder="Marie Dupont - +228 90 00 00 00"
              />
              <small>Personne à contacter en cas d'urgence</small>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 - COMPTE */}
        {etape === 3 && (
          <form className="form-etape" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>📧 Adresse email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jean.dupont@email.com"
                required
              />
              <small>Utilisé pour vous connecter</small>
            </div>

            <div className="form-group">
              <label>🔒 Mot de passe *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <small>Minimum 6 caractères</small>
            </div>

            <div className="form-group">
              <label>🔒 Confirmer le mot de passe *</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {message && (
              <div className={isError ? 'error-msg' : 'success-msg'}>
                {message}
              </div>
            )}

            <button type="submit" className="btn-primary">
              🎉 Créer mon compte
            </button>
          </form>
        )}

        {/* Affichage des messages pour les étapes 1 et 2 */}
        {etape < 3 && message && (
          <div className={isError ? 'error-msg' : 'success-msg'}>
            {message}
          </div>
        )}

        {/* Boutons de navigation */}
        <div className="nav-btns">
          {etape > 1 && (
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={etapePrecedente}
            >
              ← Retour
            </button>
          )}
          {etape < 3 && (
            <button 
              type="button" 
              className="btn-primary" 
              onClick={etapeSuivante}
            >
              Suivant →
            </button>
          )}
        </div>

        {/* Lien de connexion */}
        <div className="auth-footer">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;