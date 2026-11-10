// Neotisse v2 : pages intérieures vivantes au défilement.
// Titres qui montent mot à mot, photos qui se dévoilent et glissent dans leur cadre,
// textes et cartes qui apparaissent au fil de la lecture. Rien ne bouge si l'appareil demande moins d'animations.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { decouperEnMots, cacheMot, texteSimple } from './mots.js';

gsap.registerPlugin(ScrollTrigger);
const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const contenu = document.getElementById('contenu');

function decouper(h) {
	// seulement les titres simples (texte, italique, gras) : on ne touche pas aux liens ni aux balises particulières
	if (h.dataset.decoupe || !texteSimple(h)) return false;
	h.dataset.decoupe = '1';
	h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
	decouperEnMots(h, cacheMot);
	return true;
}

// Un fil fin se dessine sous le grand titre de chaque page, comme la signature de l'accueil
function filSousTitre() {
	const h1 = contenu && contenu.querySelector('h1');
	if (!h1 || h1.nextElementSibling?.classList.contains('fil-titre')) return null;
	const ns = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(ns, 'svg');
	svg.setAttribute('class', 'fil-titre'); svg.setAttribute('viewBox', '0 0 240 14'); svg.setAttribute('aria-hidden', 'true');
	const path = document.createElementNS(ns, 'path');
	path.setAttribute('d', 'M2 8 C 30 2, 50 13, 80 7 S 130 1, 160 7 S 210 12, 238 6');
	svg.appendChild(path);
	if (getComputedStyle(h1).textAlign === 'center') svg.classList.add('centre');
	h1.after(svg);
	return path;
}

function lancer() {
	const fil = filSousTitre();
	if (calme || !contenu) return;
	if (fil) {
		const L = fil.getTotalLength();
		gsap.fromTo(fil, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', delay: 0.5 });
	}

	// Le grand titre de la page monte à l'arrivée
	const h1 = contenu.querySelector('h1');
	if (h1 && decouper(h1)) gsap.from(h1.querySelectorAll('.cache-mot > span'), { yPercent: 110, rotate: 3, duration: 1.1, ease: 'power4.out', stagger: 0.06, delay: 0.15 });

	// Les autres titres montent au rythme du défilement
	contenu.querySelectorAll('h2').forEach((h) => {
		if (!decouper(h)) return;
		gsap.from(h.querySelectorAll('.cache-mot > span'), { yPercent: 110, rotate: 3, ease: 'none', stagger: 0.06, scrollTrigger: { trigger: h, start: 'top 95%', end: 'top 65%', scrub: 0.7 } });
	});

	// Photos : elles se dévoilent de bas en haut puis glissent doucement pendant qu'on lit
	contenu.querySelectorAll('img').forEach((im) => {
		if (im.closest('.logos, .reseaux, form') || im.width < 160) return;
		gsap.fromTo(im, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: im, start: 'top 98%', end: 'top 55%', scrub: 0.6 } });
		// dans un cadre qui coupe l'image, elle glisse légèrement agrandie pour ne jamais laisser de vide
		const cadre = im.parentElement && getComputedStyle(im.parentElement).overflow === 'hidden';
		// un petit cadre autour de la photo porte le zoom au survol, sans gêner l'animation au défilement
		if (cadre && !im.parentElement.classList.contains('zoom')) { const z = document.createElement('div'); z.className = 'zoom'; im.before(z); z.appendChild(im); }
		if (cadre) gsap.fromTo(im, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } });
		else gsap.fromTo(im, { y: 30 }, { y: -20, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } });
	});

	// Textes, cartes, questions : ils montent par petits groupes
	const blocs = [...contenu.querySelectorAll('p, li, article, details, .wp-block-buttons, .btn, label, input, select, textarea, blockquote')]
		.filter((el) => !el.closest('h1, h2, article li, article p, details p, details li, .cookies') && el.getBoundingClientRect().top > window.innerHeight * 0.9);
	gsap.set(blocs, { y: 40, opacity: 0 });
	ScrollTrigger.batch(blocs, {
		start: 'top 92%',
		onEnter: (lot) => gsap.to(lot, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
	});
	// Garde-fou : tout ce qui est encore caché s'affiche si l'on arrive en bas de page
	ScrollTrigger.create({ trigger: document.body, start: 'bottom bottom+=2', onEnter: () => gsap.to(blocs, { y: 0, opacity: 1, duration: 0.4, overwrite: true }) });

	// Ateliers et articles : la photo et le texte se croisent légèrement au défilement
	contenu.querySelectorAll('.atelier, .article').forEach((carte, i) => {
		const sens = carte.classList.contains('inv') || i % 2 ? -1 : 1;
		gsap.fromTo(carte, { x: 40 * sens }, { x: 0, ease: 'none', scrollTrigger: { trigger: carte, start: 'top bottom', end: 'top 50%', scrub: 0.8 } });
	});
}

if (document.readyState === 'complete') lancer();
else window.addEventListener('load', lancer);
