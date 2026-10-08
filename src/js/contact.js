import { CONTACT, WEB3FORMS_KEY } from './config.js';

// Envoi du formulaire via Web3Forms (aucun serveur à gérer).
export function initContact() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  const setStatus = (message, type = '') => {
    status.textContent = message;
    status.dataset.type = type;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(':invalid');
      firstInvalid?.focus();
      setStatus('Merci de renseigner votre nom, votre téléphone et d’accepter d’être recontacté.', 'error');
      return;
    }

    if (!WEB3FORMS_KEY) {
      setStatus(`Le formulaire n’est pas encore activé. Appelez-nous au ${CONTACT.phoneDisplay}, on vous répond tout de suite.`, 'error');
      return;
    }

    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    setStatus('Envoi en cours…');

    const data = Object.fromEntries(new FormData(form));
    delete data.consent;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Nouvelle demande Kodaï : ${data.name}${data.company ? ` (${data.company})` : ''}`,
          from_name: 'Site Kodaï',
          ...data,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      form.reset();
      setStatus('Merci ! Votre demande est bien partie. On vous rappelle très vite.', 'success');
    } catch {
      setStatus(`Oups, l’envoi a échoué. Appelez-nous directement au ${CONTACT.phoneDisplay}.`, 'error');
    } finally {
      button.disabled = false;
    }
  });
}
