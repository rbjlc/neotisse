// Mesure d'audience : événements envoyés à Google Analytics (voir le plan de taggage dans Notion).
// Rien n'est envoyé tant que le visiteur n'a pas accepté la mesure d'audience : gtag n'existe qu'après son accord.

function envoyer(nom, params = {}, essais = 10) {
	if (typeof window.gtag === 'function') return window.gtag('event', nom, params);
	// Juste après le chargement, gtag peut arriver avec un léger retard : on réessaie quelques fois.
	if (essais > 0) setTimeout(() => envoyer(nom, params, essais - 1), 500);
}

const chemin = location.pathname;
const q = new URLSearchParams(location.search);

// Formulaire de contact envoyé (conversion principale)
if (chemin.startsWith('/contact') && q.get('devis') === 'merci' && q.get('type')) {
	envoyer('generate_lead', { type_demande: q.get('type') });
}
// Formulaire de contact refusé ou en erreur
if (chemin.startsWith('/contact') && ['erreur', 'robot', 'probleme'].includes(q.get('devis'))) {
	envoyer('formulaire_erreur', { formulaire: 'contact', raison: q.get('devis') });
}
// Témoignage envoyé
if (chemin.startsWith('/livre-or') && q.get('temoignage') === 'merci' && q.get('envoye')) {
	envoyer('temoignage_envoye');
}

const ou = (el) => {
	if (el.closest('.tete-droite')) return 'en-tete';
	if (el.closest('.flottant')) return 'bouton-flottant';
	if (el.closest('.menu-plein')) return 'menu';
	if (el.closest('footer')) return 'pied-de-page';
	return 'contenu';
};

document.addEventListener('click', (e) => {
	const a = e.target.closest && e.target.closest('a[href]');
	if (!a) return;
	const href = a.getAttribute('href') || '';
	if (/^\/contact\/?(\?|#|$)/.test(href) && !chemin.startsWith('/contact')) {
		envoyer('click_devis', { emplacement: ou(a), page_depart: chemin });
	} else if (href.startsWith('/agenda/')) {
		envoyer('ajout_agenda', { evenement: href.replace(/^\/agenda\/|\.ics$/g, '') });
	} else if (href.startsWith('mailto:')) {
		envoyer('click_contact', { contact_type: 'email', emplacement: ou(a) });
	} else if (href.startsWith('tel:')) {
		envoyer('click_contact', { contact_type: 'telephone', emplacement: ou(a) });
	} else {
		const reseau = (href.match(/(facebook|instagram|linkedin|youtube)\.com/) || [])[1];
		if (reseau) envoyer('click_reseau_social', { reseau, emplacement: ou(a) });
	}
});

// Question fréquente ouverte
document.querySelectorAll('details.faq-q').forEach((d) => {
	d.addEventListener('toggle', () => {
		if (!d.open) return;
		const question = (d.querySelector('summary')?.textContent || '').trim().slice(0, 100);
		envoyer('faq_ouverte', { question, page: chemin });
	});
});
