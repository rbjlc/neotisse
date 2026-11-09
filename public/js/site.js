/* Neotisse : filtres du calendrier, copie de l’e-mail, effets au défilement. */
(function () {
	var toast = document.getElementById('toast'), tm;
	function dire(t) {
		if (!toast) return;
		toast.textContent = t; toast.hidden = false;
		clearTimeout(tm); tm = setTimeout(function () { toast.hidden = true; }, 3600);
	}

	// Filtres du calendrier
	var filtres = document.querySelectorAll('.filtre');
	if (filtres.length) {
		var evts = document.querySelectorAll('#liste-evts .evt');
		var mois = document.querySelectorAll('#liste-evts [data-mois]');
		var vide = document.getElementById('aucun-evt');
		filtres.forEach(function (b) {
			b.addEventListener('click', function () {
				var f = b.getAttribute('data-f'), n = 0;
				filtres.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
				evts.forEach(function (e) {
					var ok = f === 'tous' || e.getAttribute('data-type') === f;
					e.hidden = !ok; if (ok) n++;
				});
				mois.forEach(function (m) {
					var s = m.nextElementSibling, visible = false;
					while (s && !s.hasAttribute('data-mois')) { if (!s.hidden) visible = true; s = s.nextElementSibling; }
					m.hidden = !visible;
				});
				if (vide) vide.hidden = n > 0 || !evts.length;
			});
		});
	}

	// Copier l'adresse e-mail
	var btn = document.getElementById('btn-copier');
	if (btn) {
		btn.addEventListener('click', function () {
			var el = document.getElementById('mail');
			var ko = function () {
				var r = document.createRange(); r.selectNodeContents(el);
				var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
				dire('Adresse sélectionnée : copiez-la avec Ctrl + C.');
			};
			try { navigator.clipboard.writeText(el.textContent).then(function () { dire('Adresse copiée.'); }, ko); } catch (e) { ko(); }
		});
	}

	// Message après envoi d'un formulaire : on y amène le focus
	var msg = document.querySelector('.retour[tabindex="-1"]');
	if (msg) { msg.focus(); }
})();

/* Apparition en douceur des sections et des photos au défilement.
   Rien n'est caché si les animations sont désactivées sur l'appareil. */
(function () {
	if (!('IntersectionObserver' in window)) return;
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	var racine = document.querySelector('.contenu-page');
	if (!racine) return;
	var cibles = [];
	var sections = racine.querySelectorAll(':scope > .wp-block-group, :scope > .wp-block-group > .wp-block-group__inner-container > .wp-block-group');
	sections.forEach(function (s, i) {
		// La première section (grande photo, titre) reste visible tout de suite.
		if (s.querySelector('.hero-cover, .page-hero') || s.classList.contains('hero-zone') || s.classList.contains('page-hero')) return;
		if (s.closest('.hero-zone')) return;
		var r = s.getBoundingClientRect();
		if (r.top < window.innerHeight * 0.85) return; // déjà à l'écran : pas d'effet
		if (s.querySelector('.collage-geste')) {
			s.querySelectorAll('.collage-geste .collage-photo, .geste-texte').forEach(function (e) { cibles.push(e); });
			return;
		}
		cibles.push(s);
	});
	if (!cibles.length) return;
	document.documentElement.classList.add('anime');
	cibles.forEach(function (c) { c.classList.add('revele'); });
	var io = new IntersectionObserver(function (entrees) {
		entrees.forEach(function (e) {
			if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
	cibles.forEach(function (c) { io.observe(c); });
	// Sécurité : tout s'affiche si l'on imprime ou si l'onglet reste longtemps en arrière-plan.
	window.addEventListener('beforeprint', function () { cibles.forEach(function (c) { c.classList.add('visible'); }); });
})();

/* Témoignage : le champ « Précisez où » n'apparaît que si l'on choisit « Autre ». */
(function () {
	var choix = document.getElementById('neo_ou');
	var champ = document.getElementById('champ-lieu');
	if (!choix || !champ) { return; }
	function maj() {
		var autre = choix.value === 'autre';
		champ.hidden = !autre;
		if (!autre) { document.getElementById('neo_lieu').value = ''; }
	}
	choix.addEventListener('change', function () {
		maj();
		if (choix.value === 'autre') { document.getElementById('neo_lieu').focus(); }
	});
	maj();
})();

/* Le fil sous le menu se teint au fil de la lecture (15 % minimum, jamais tout écru). */
(function () {
	var fil = document.querySelector('.galon');
	if (!fil) return;
	var MIN = 0.15, attente = false;
	function maj() {
		attente = false;
		var hauteur = document.documentElement.scrollHeight - window.innerHeight;
		var avance = hauteur > 0 ? Math.min(1, Math.max(0, window.scrollY / hauteur)) : 1;
		fil.style.setProperty('--teinte', (MIN + (1 - MIN) * avance).toFixed(3));
		var haut = parseFloat(getComputedStyle(fil).top) || 0;
		fil.classList.toggle('colle', window.scrollY > 0 && fil.getBoundingClientRect().top <= haut + 0.5);
	}
	window.addEventListener('scroll', function () { if (!attente) { attente = true; window.requestAnimationFrame(maj); } }, { passive: true });
	window.addEventListener('resize', maj);
	maj();
})();

/* Actualités : filtrer par type (Festival, Colloque…). */
(function () {
	var liste = document.getElementById('liste-actus');
	var boutons = document.querySelectorAll('.actus-entete .filtre');
	if (!liste || !boutons.length) return;
	var vide = document.getElementById('aucune-actu');
	boutons.forEach(function (b) {
		b.addEventListener('click', function () {
			var f = b.getAttribute('data-f'), visibles = 0;
			boutons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
			document.querySelectorAll('#liste-actus .article, .une[data-cat]').forEach(function (a) {
				var ok = f === 'tous' || a.getAttribute('data-cat') === f;
				a.hidden = !ok; if (ok) visibles++;
			});
			if (vide) vide.hidden = visibles > 0;
		});
	});
})();
