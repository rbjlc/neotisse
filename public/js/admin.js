/* Back-office Neotisse : éditeur de texte, choix des photos, listes, avertissements. */
(function () {
	'use strict';

	/* ---------- Menu sur téléphone ---------- */
	var burger = document.querySelector('.adm-burger');
	if (burger) burger.addEventListener('click', function () {
		var m = document.getElementById('adm-menu');
		var ouvert = m.classList.toggle('ouvert');
		burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
	});

	/* ---------- Confirmation avant suppression ---------- */
	document.addEventListener('submit', function (e) {
		var q = e.submitter && e.submitter.getAttribute('data-confirmer');
		if (q && !window.confirm(q)) e.preventDefault();
	}, true);

	/* ---------- Éditeur de texte ---------- */
	function initEditeur(ed) {
		if (ed.dataset.pret) return; ed.dataset.pret = '1';
		var zone = ed.querySelector('.editeur-zone'), cache = ed.querySelector('textarea');
		function sync() {
			var h = zone.innerHTML.replace(/<p><br><\/p>/g, '').replace(/&nbsp;/g, ' ').trim();
			cache.value = h;
			cache.dispatchEvent(new Event('input', { bubbles: true }));
		}
		zone.addEventListener('input', sync);
		zone.addEventListener('blur', sync);
		// Collage : on garde le texte, pas la mise en forme d'origine (Word, sites…)
		zone.addEventListener('paste', function (e) {
			e.preventDefault();
			var t = (e.clipboardData || window.clipboardData).getData('text/plain');
			var html = t.split(/\n{2,}/).map(function (p) { return p.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }).replace(/\n/g, '<br>'); }).join('</p><p>');
			document.execCommand('insertHTML', false, t.indexOf('\n\n') >= 0 ? '<p>' + html + '</p>' : html);
		});
		document.execCommand && document.execCommand('defaultParagraphSeparator', false, 'p');
		ed.querySelectorAll('[data-cmd]').forEach(function (b) {
			b.addEventListener('mousedown', function (e) { e.preventDefault(); });
			b.addEventListener('click', function () {
				var cmd = b.getAttribute('data-cmd');
				zone.focus();
				if (cmd === 'lien') {
					var sel = window.getSelection();
					if (!sel || sel.isCollapsed) { alert('Sélectionnez d’abord les mots qui deviendront le lien.'); return; }
					var url = prompt('Adresse du lien (ex. : https://www.musee.fr ou /contact/). Laissez vide pour retirer le lien.', 'https://');
					if (url === null) return;
					url = url.trim();
					if (!url || url === 'https://') document.execCommand('unlink');
					else {
						if (!/^(https?:|mailto:|tel:|\/|#)/.test(url)) url = (url.indexOf('@') > 0 ? 'mailto:' : 'https://') + url;
						document.execCommand('createLink', false, url);
					}
				} else if (cmd === 'h2' || cmd === 'h3' || cmd === 'p') {
					document.execCommand('formatBlock', false, '<' + cmd + '>');
				} else {
					document.execCommand(cmd);
				}
				sync();
			});
		});
	}

	/* ---------- Compteurs de caractères ---------- */
	function initCompteur(el) {
		if (el.dataset.compte) return; el.dataset.compte = '1';
		var max = +el.getAttribute('data-max'); if (!max) return;
		var s = document.createElement('span'); s.className = 'compteur';
		el.insertAdjacentElement('afterend', s);
		function maj() { var n = el.value.length; s.textContent = n + ' / ' + max + ' caractères'; s.classList.toggle('trop', n > max); }
		el.addEventListener('input', maj); maj();
	}

	/* ---------- Listes répétables ---------- */
	function nomResume(item) {
		var champ = item.querySelector('.rep-corps input[type=text], .rep-corps textarea, .rep-corps [data-alt]');
		var t = item.querySelector('[data-alt]') && !item.querySelector('.rep-corps input[type=text]:not([data-alt])') ? item.querySelector('[data-alt]').value : (champ ? champ.value : '');
		return (t || '').replace(/<[^>]+>/g, '').trim() || 'Nouvel élément';
	}
	function initRepeteur(fs) {
		if (fs.dataset.pret) return; fs.dataset.pret = '1';
		var rep = fs.querySelector('.repeteur'), modele = fs.querySelector('template[data-modele]');
		var ajouter = fs.querySelector('[data-ajouter]');
		var max = +rep.getAttribute('data-max') || 0;
		function majMax() { if (max) ajouter.hidden = rep.children.length >= max; }
		ajouter.addEventListener('click', function () {
			var n = modele.content.firstElementChild.cloneNode(true);
			rep.appendChild(n); initTout(n); marquerModifie(); majMax();
			var p = n.querySelector('input:not([type=hidden]), textarea:not([hidden]), .editeur-zone'); if (p) p.focus();
		});
		rep.addEventListener('click', function (e) {
			var item = e.target.closest('.rep-item'); if (!item || item.parentNode !== rep) return;
			if (e.target.closest('[data-supprimer]')) {
				if (confirm('Retirer cet élément ? (Il disparaîtra après « Enregistrer ».)')) { item.remove(); marquerModifie(); majMax(); }
			} else if (e.target.closest('[data-monter]')) {
				if (item.previousElementSibling) { rep.insertBefore(item, item.previousElementSibling); marquerModifie(); }
			} else if (e.target.closest('[data-descendre]')) {
				if (item.nextElementSibling) { rep.insertBefore(item.nextElementSibling, item); marquerModifie(); }
			} else if (e.target.closest('[data-ouvrir]')) {
				item.classList.toggle('ferme');
			}
		});
		rep.addEventListener('input', function (e) {
			var item = e.target.closest('.rep-item'); if (item) item.querySelector('.rep-nom').textContent = nomResume(item);
		});
		majMax();
	}
	/** Avant l'envoi : numérote les éléments des listes dans l'ordre affiché. */
	function renumeroter(form) {
		var reps = Array.prototype.slice.call(form.querySelectorAll('.repeteur'));
		reps.forEach(function (rep) {
			var base = rep.getAttribute('data-base');
			var esc = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			var re = new RegExp('^' + esc + '\\.(\\d+|#)\\.');
			Array.prototype.forEach.call(rep.children, function (item, k) {
				item.querySelectorAll('[name]').forEach(function (el) { el.name = el.name.replace(re, base + '.' + k + '.'); });
			});
		});
	}

	/* ---------- Photos ---------- */
	var dlg = null;
	function fenetrePhotos(choisi) {
		if (!dlg) {
			dlg = document.createElement('dialog'); dlg.className = 'photos';
			dlg.innerHTML = '<div class="photos-tete"><h2>Choisir une photo</h2><label class="b b-principal b-petit">Envoyer une nouvelle photo<input type="file" accept="image/*" hidden></label><button type="button" class="b b-second b-petit" data-fermer>Fermer</button></div><p class="adm-info" style="margin:16px 20px 0" data-etat>Chargement des photos…</p><div class="photos-grille"></div>';
			document.body.appendChild(dlg);
			dlg.querySelector('[data-fermer]').addEventListener('click', function () { dlg.close(); });
			dlg.querySelector('input[type=file]').addEventListener('change', function (e) {
				var f = e.target.files[0]; if (!f) return;
				var etat = dlg.querySelector('[data-etat]'); etat.hidden = false; etat.textContent = 'Envoi de la photo…';
				envoyerPhoto(f).then(function (m) { etat.hidden = true; dlg._choisi(m); dlg.close(); })
					.catch(function (err) { etat.textContent = err.message; });
				e.target.value = '';
			});
		}
		dlg._choisi = choisi;
		var grille = dlg.querySelector('.photos-grille'), etat = dlg.querySelector('[data-etat]');
		grille.innerHTML = ''; etat.hidden = false; etat.textContent = 'Chargement des photos…';
		dlg.showModal();
		fetch('/admin/api/photos/').then(function (r) { return r.json(); }).then(function (d) {
			if (d.erreur) throw new Error(d.erreur);
			etat.hidden = !!d.photos.length; etat.textContent = 'Aucune photo pour l’instant : envoyez-en une avec le bouton ci-dessus.';
			d.photos.forEach(function (m) {
				var b = document.createElement('button'); b.type = 'button'; b.title = m.alt || '';
				b.innerHTML = '<img loading="lazy" alt="">'; b.querySelector('img').src = m.url; b.querySelector('img').alt = m.alt || 'Photo sans description';
				b.addEventListener('click', function () { dlg._choisi(m); dlg.close(); });
				grille.appendChild(b);
			});
		}).catch(function (err) { etat.textContent = err.message; });
	}
	/** Réduit la photo (1800 px max, WebP) avant l'envoi : plus rapide, et le site reste léger. */
	function reduire(fichier) {
		return new Promise(function (ok) {
			if (!/^image\/(jpeg|png|webp)$/.test(fichier.type)) return ok(fichier);
			var img = new Image(), url = URL.createObjectURL(fichier);
			img.onload = function () {
				URL.revokeObjectURL(url);
				var max = 1800, l = img.naturalWidth, h = img.naturalHeight;
				var garderPng = fichier.type === 'image/png' && fichier.size < 800000;
				if (l <= max && h <= max && (fichier.size < 500000 || garderPng)) return ok(fichier);
				var k = Math.min(1, max / Math.max(l, h)), cv = document.createElement('canvas');
				cv.width = Math.round(l * k); cv.height = Math.round(h * k);
				var ctx = cv.getContext('2d');
				if (!garderPng) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); }
				ctx.drawImage(img, 0, 0, cv.width, cv.height);
				// WebP (plus léger) si le navigateur sait le produire, sinon JPEG
				var webp = !garderPng && cv.toDataURL('image/webp').indexOf('data:image/webp') === 0;
				var type = garderPng ? 'image/png' : webp ? 'image/webp' : 'image/jpeg';
				var ext = garderPng ? '.png' : webp ? '.webp' : '.jpg';
				cv.toBlob(function (b) { ok(new File([b], fichier.name.replace(/\.[a-z]+$/i, '') + ext, { type: type })); }, type, 0.82);
			};
			img.onerror = function () { ok(fichier); };
			img.src = url;
		});
	}
	function envoyerPhoto(f, alt) {
		if (f.size > 25e6) return Promise.reject(new Error('Photo trop lourde (25 Mo maximum).'));
		return reduire(f).then(function (r) {
			var fd = new FormData(); fd.append('fichier', r); fd.append('alt', alt || '');
			return fetch('/admin/api/photos/', { method: 'POST', body: fd });
		}).then(function (r) { return r.json(); }).then(function (d) { if (d.erreur) throw new Error(d.erreur); return d.photo; });
	}
	window.neoEnvoyerPhoto = envoyerPhoto;

	function initPhoto(bloc) {
		if (bloc.dataset.pret) return; bloc.dataset.pret = '1';
		var src = bloc.querySelector('[data-src]'), alt = bloc.querySelector('[data-alt]'), apercu = bloc.querySelector('.photo-apercu');
		var choisir = bloc.querySelector('[data-choisir]'), retirer = bloc.querySelector('[data-retirer]');
		function maj() {
			var u = src.value;
			apercu.style.backgroundImage = u ? "url('" + u.replace(/'/g, "\\'") + "')" : '';
			apercu.classList.toggle('pleine', !!u);
			choisir.textContent = u ? 'Changer la photo' : 'Choisir une photo';
			retirer.hidden = !u;
		}
		choisir.addEventListener('click', function () {
			fenetrePhotos(function (m) {
				src.value = m.url;
				if (!alt.value || confirm('Remplacer aussi la description par celle de la photo choisie ?\n\n« ' + (m.alt || '(aucune)') + ' »')) alt.value = m.alt || alt.value;
				maj(); marquerModifie();
				var item = bloc.closest('.rep-item'); if (item) item.querySelector('.rep-nom').textContent = nomResume(item);
				if (!alt.value) alt.focus();
			});
		});
		retirer.addEventListener('click', function () { src.value = ''; maj(); marquerModifie(); });
	}

	/* ---------- Modifications non enregistrées ---------- */
	var modifie = false;
	function marquerModifie() {
		modifie = true;
		document.querySelectorAll('[data-etat-modif]').forEach(function (s) { s.textContent = 'Modifications non enregistrées'; });
	}
	window.addEventListener('beforeunload', function (e) { if (modifie) { e.preventDefault(); e.returnValue = ''; } });

	function initTout(racine) {
		racine.querySelectorAll('[data-editeur]').forEach(initEditeur);
		racine.querySelectorAll('[data-max]:not(.repeteur)').forEach(initCompteur);
		racine.querySelectorAll('fieldset').forEach(function (fs) { if (fs.querySelector(':scope > .repeteur')) initRepeteur(fs); });
		racine.querySelectorAll('[data-photo]').forEach(initPhoto);
	}
	initTout(document);

	document.querySelectorAll('form.edition').forEach(function (f) {
		f.addEventListener('input', marquerModifie);
		f.addEventListener('change', marquerModifie);
		f.addEventListener('submit', function (e) {
			f.querySelectorAll('[data-editeur]').forEach(function (ed) { ed.querySelector('.editeur-zone').dispatchEvent(new Event('blur')); });
			renumeroter(f);
			// les modèles de listes ne sont pas envoyés
			f.querySelectorAll('template').forEach(function (t) { t.remove(); });
			// photo sans description : on prévient (sans bloquer)
			var sans = Array.prototype.filter.call(f.querySelectorAll('[data-photo]'), function (b) { return b.querySelector('[data-src]').value && !b.querySelector('[data-alt]').value.trim(); });
			if (sans.length && !e.submitter?.hasAttribute('data-sans-alt')) {
				if (!confirm(sans.length + ' photo(s) sans description. La description aide les personnes malvoyantes et Google.\n\nEnregistrer quand même ?')) {
					e.preventDefault(); sans[0].querySelector('[data-alt]').focus(); return;
				}
			}
			modifie = false;
		});
	});

	/* ---------- Médiathèque : glisser-déposer ---------- */
	var depot = document.querySelector('[data-depot]');
	if (depot) {
		var input = depot.querySelector('input[type=file]'), etat = depot.querySelector('[data-etat]');
		function envoyer(fichiers) {
			fichiers = Array.prototype.slice.call(fichiers).filter(function (f) { return /^image\//.test(f.type); });
			if (!fichiers.length) return;
			var n = 0;
			etat.textContent = 'Envoi de ' + fichiers.length + ' photo(s)…';
			fichiers.reduce(function (p, f) { return p.then(function () { return envoyerPhoto(f).then(function () { n++; etat.textContent = n + ' / ' + fichiers.length + ' envoyée(s)…'; }); }); }, Promise.resolve())
				.then(function () { location.href = '/admin/photos/?ok=' + encodeURIComponent(n + ' photo(s) ajoutée(s). Pensez à écrire leur description.'); })
				.catch(function (err) { etat.textContent = err.message; });
		}
		input.addEventListener('change', function () { envoyer(input.files); });
		['dragenter', 'dragover'].forEach(function (t) { depot.addEventListener(t, function (e) { e.preventDefault(); depot.classList.add('survol'); }); });
		['dragleave', 'drop'].forEach(function (t) { depot.addEventListener(t, function (e) { e.preventDefault(); depot.classList.remove('survol'); }); });
		depot.addEventListener('drop', function (e) { envoyer(e.dataTransfer.files); });
	}

	/* ---------- Nouveau mot de passe : jeton reçu dans l'adresse ---------- */
	var jeton = document.getElementById('jeton');
	if (jeton) {
		var h = new URLSearchParams(location.hash.slice(1));
		jeton.value = h.get('access_token') || '';
		if (!jeton.value) { var a = document.getElementById('sans-jeton'); if (a) a.hidden = false; }
	}
})();
