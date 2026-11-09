/* Neotisse : bandeau de consentement aux cookies (règles CNIL). */
(function () {
	var NOM = 'neo_consent', DUREE = 182; // 6 mois
	var b = document.getElementById('neo-cookies');

	function lire() {
		var m = document.cookie.match(new RegExp('(?:^|; )' + NOM + '=([^;]*)'));
		if (!m) return null;
		try { return JSON.parse(decodeURIComponent(m[1])); } catch (e) { return null; }
	}
	function ecrire(choix) {
		var d = new Date(); d.setTime(d.getTime() + DUREE * 864e5);
		document.cookie = NOM + '=' + encodeURIComponent(JSON.stringify(choix)) + '; expires=' + d.toUTCString() + '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
	}
	// Lance les scripts bloqués d'une catégorie acceptée
	function lancer(cat) {
		document.querySelectorAll('script[type="text/plain"][data-neo-consent="' + cat + '"]').forEach(function (s) {
			var n = document.createElement('script');
			for (var i = 0; i < s.attributes.length; i++) {
				var a = s.attributes[i];
				if (a.name !== 'type' && a.name.indexOf('data-neo-') !== 0) n.setAttribute(a.name, a.value);
			}
			if (s.getAttribute('data-neo-type') === 'module') n.type = 'module';
			n.text = s.text;
			s.parentNode.replaceChild(n, s);
		});
	}
	// Retrait de l'accord : supprime les cookies de mesure d'audience déjà déposés (Google Analytics…)
	function effacerAudience() {
		var hote = location.hostname, domaines = ['', hote, '.' + hote];
		var parts = hote.split('.');
		if (parts.length > 2) domaines.push('.' + parts.slice(-2).join('.'));
		document.cookie.split('; ').forEach(function (c) {
			var nom = c.split('=')[0];
			if (/^(_ga|_gid|_gat|_gcl)/.test(nom)) {
				domaines.forEach(function (d) {
					document.cookie = nom + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
				});
			}
		});
	}
	function appliquer(choix) {
		if (choix && choix.audience) lancer('audience');
		document.dispatchEvent(new CustomEvent('neo:consentement', { detail: choix }));
	}

	var choix = lire();
	if (!choix || !choix.audience) effacerAudience();
	appliquer(choix);
	if (!b) return;

	var details = document.getElementById('neo-cookies-details');
	var caseAudience = document.getElementById('neo-c-audience');
	var btnPerso = b.querySelector('[data-neo-cookies="personnaliser"]');
	var btnEnr = b.querySelector('[data-neo-cookies="enregistrer"]');
	var fond = document.getElementById('neo-cookies-fond');
	var dernierFocus = null;

	function ouvrir() {
		dernierFocus = document.activeElement;
		var c = lire();
		caseAudience.checked = !!(c && c.audience);
		b.hidden = false;
		if (fond) fond.hidden = false;
		document.documentElement.classList.add('cookies-ouvert');
		var t = b.querySelector('button'); if (t) t.focus();
	}
	function fermer() {
		b.hidden = true;
		if (fond) fond.hidden = true;
		document.documentElement.classList.remove('cookies-ouvert');
		details.hidden = true; btnEnr.hidden = true;
		btnPerso.setAttribute('aria-expanded', 'false');
		if (dernierFocus && dernierFocus.focus && dernierFocus !== document.body) dernierFocus.focus();
	}
	function enregistrer(audience) {
		var c = { audience: !!audience, date: new Date().toISOString().slice(0, 10) };
		var avant = lire();
		ecrire(c);
		fermer();
		if (!c.audience) effacerAudience();
		if (avant && avant.audience && !c.audience) { location.reload(); return; } // retrait : on recharge sans les scripts
		appliquer(c);
	}

	b.addEventListener('click', function (e) {
		var a = e.target.closest('[data-neo-cookies]'); if (!a) return;
		var act = a.getAttribute('data-neo-cookies');
		if (act === 'accepter') enregistrer(true);
		if (act === 'refuser') enregistrer(false);
		if (act === 'enregistrer') enregistrer(caseAudience.checked);
		if (act === 'personnaliser') {
			var ouvert = details.hidden;
			details.hidden = !ouvert; btnEnr.hidden = !ouvert;
			btnPerso.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
		}
	});
	document.addEventListener('click', function (e) {
		var a = e.target.closest('[data-neo-cookies="ouvrir"]');
		if (a && !b.contains(a)) { e.preventDefault(); ouvrir(); }
	});

	// Clavier : le focus reste dans la fenêtre ; Échap la ferme sans enregistrer de choix
	// (rien n'est déposé, et elle reviendra à la page suivante).
	b.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') { fermer(); return; }
		if (e.key !== 'Tab') return;
		var f = Array.prototype.filter.call(b.querySelectorAll('button, a[href], input'), function (x) { return !x.hidden && x.offsetParent !== null; });
		if (!f.length) return;
		var premier = f[0], dernier = f[f.length - 1];
		if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
		else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
	});

	// S'ouvre seul à la première visite, sur n'importe quelle page, tant qu'aucun choix n'est fait.
	if (!choix && b.getAttribute('data-auto') === '1') ouvrir();
})();
