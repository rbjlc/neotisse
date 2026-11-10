// Neotisse v2 : écran d'attente de la première visite.
// Une pelote de laine tombe, rebondit, puis roule en déroulant un fil : les lettres du nom se lèvent
// à son passage. Le fil se tend, puis l'écran s'ouvre le long du fil sur l'accueil.
// Un clic, la touche Échap ou le bouton « Passer l'introduction » vont directement à l'ouverture.
import { gsap as g } from 'gsap';

export function jouerChargement() {
	const ecran = document.getElementById('chargement');
	if (!ecran || !document.documentElement.classList.contains('premiere-visite')) return null;
	const passerBtn = document.getElementById('ch-passer');
	// connexion très lente : la page a mis trop longtemps à se charger, on ne fait pas attendre davantage
	if (performance.now() > 4500) {
		ecran.remove(); if (passerBtn) passerBtn.remove();
		document.documentElement.classList.remove('premiere-visite');
		return null;
	}
	ecran.style.animation = 'none'; // le script est là : plus besoin du garde-fou CSS
	if (passerBtn) passerBtn.style.animation = 'none';

	const pelote = document.getElementById('ch-pelote'), ecrase = document.getElementById('ch-ecrase');
	const taille = document.getElementById('ch-taille'), roule = document.getElementById('ch-roule');
	const fil = document.getElementById('ch-fil'), nom = document.getElementById('ch-nom');
	const lettres = [...nom.querySelectorAll('.l')];
	const police = parseFloat(getComputedStyle(nom).fontSize);
	const R = Math.max(14, police * 0.16);
	const solY = document.getElementById('ch-haut').getBoundingClientRect().bottom;
	const centres = lettres.map((l) => { const r = l.getBoundingClientRect(); return r.left + r.width / 2; });
	let s = 1, tourne = 0, bx = 0, by = 0, debutX = 0, solX = 0;

	fil.setAttribute('stroke-width', Math.max(1.5, R * 0.1));
	const majPelote = (f = 0) => {
		pelote.setAttribute('transform', `translate(${bx.toFixed(1)} ${(by - R * s).toFixed(1)})`);
		ecrase.setAttribute('transform', `translate(0 ${R * s}) scale(${1 + 0.22 * f} ${1 - 0.3 * f}) translate(0 ${-R * s})`);
		taille.setAttribute('transform', `scale(${(s * R / 64).toFixed(3)})`);
		roule.setAttribute('transform', `rotate(${tourne.toFixed(1)})`);
	};
	const majFil = () => fil.setAttribute('d', solX > debutX ? `M${debutX} ${solY} L${solX} ${solY}` : '');
	const ecraser = (t, fort) => { const o = { f: 0 }; t.to(o, { f: fort, duration: 0.07, ease: 'power2.out', yoyo: true, repeat: 1, onUpdate: () => majPelote(o.f) }); };

	const x0 = Math.max(R * 2, centres[0] - police * 1.1);
	debutX = solX = bx = x0; by = solY - window.innerHeight * 0.5;
	majPelote(); majFil();
	pelote.setAttribute('opacity', '1');

	const tl = g.timeline();
	// chute et rebond
	const chute = { y: by };
	tl.to(chute, { y: solY, duration: 0.42, ease: 'power2.in', onUpdate: () => { by = chute.y; majPelote(); } }, 0.15);
	ecraser(tl, 1.3);
	const saut = { k: 0 }, haut = police * 0.45;
	tl.to(saut, { k: 1, duration: 0.32, ease: 'none', onUpdate: () => {
		bx = x0 + R * 2 * saut.k; by = solY - haut * 4 * saut.k * (1 - saut.k); tourne += 7; majPelote();
	} });
	ecraser(tl, 0.8);
	// la pelote roule, déroule le fil et rapetisse ; les lettres se lèvent à son passage
	const depart = x0 + R * 2, arrivee = window.innerWidth + R * 3, duree = 1.35, o = { x: depart };
	tl.addLabel('roule');
	tl.to(o, { x: arrivee, duration: duree, ease: 'power1.in', onUpdate: () => {
		bx = o.x; by = solY; s = 1 - 0.55 * Math.min(1, (o.x - depart) / (arrivee - depart));
		tourne = (o.x - depart) / (R * s) * 57.3; solX = o.x; majPelote(); majFil();
	} }, 'roule');
	centres.forEach((cx, i) => {
		const p = Math.max(0, Math.min(1, (cx - depart) / (arrivee - depart)));
		tl.to(lettres[i].firstChild, { y: 0, yPercent: 0, duration: 0.7, ease: 'power4.out' }, 'roule+=' + (duree * Math.sqrt(p)).toFixed(3));
	});
	tl.to('#ch-petit', { opacity: 1, duration: 0.4 }, '-=0.3');
	// le fil se tend, puis l'écran s'ouvre le long du fil
	tl.addLabel('ouvrir', '+=0.12');
	tl.to(fil, { attr: { 'stroke-width': '+=2' }, duration: 0.12, yoyo: true, repeat: 1 }, 'ouvrir')
		.to('#ch-haut', { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, 'ouvrir+=0.15')
		.to('#ch-bas', { yPercent: 100, duration: 0.8, ease: 'power4.inOut' }, 'ouvrir+=0.15')
		.to('#ch-trace', { opacity: 0, duration: 0.2 }, 'ouvrir+=0.15')
		.add(() => {
			ecran.remove(); if (passerBtn) passerBtn.remove();
			document.documentElement.classList.remove('premiere-visite');
		}, 'ouvrir+=0.95');

	// passer l'introduction
	const passer = () => {
		if (tl.time() >= tl.labels.ouvrir) return;
		lettres.forEach((l) => g.set(l.firstChild, { y: 0, yPercent: 0 }));
		pelote.setAttribute('opacity', '0');
		// l'intro est rangée dans la chronologie de la page : c'est elle qu'on avance
		const parent = tl.parent && tl.parent !== g.globalTimeline ? tl.parent : null;
		if (parent) parent.seek(tl.startTime() + tl.labels.ouvrir); else tl.seek('ouvrir');
	};
	ecran.addEventListener('click', passer);
	passerBtn?.addEventListener('click', passer);
	const echap = (e) => { if (e.key === 'Escape') passer(); };
	document.addEventListener('keydown', echap);
	tl.eventCallback('onComplete', () => document.removeEventListener('keydown', echap));
	return tl;
}
