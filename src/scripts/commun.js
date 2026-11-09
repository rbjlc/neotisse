// Neotisse v2 : comportements communs à toutes les pages.
// En-tête qui se remplit, menu plein écran, bouton flottant, transition entre les pages.
import { gsap } from 'gsap';

const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const racine = document.documentElement;
const tete = document.getElementById('tete');
const flottant = document.getElementById('flottant');
const surAccueil = document.body.classList.contains('accueil');

/* ---------- En-tête et bouton flottant ---------- */
function surDefilement() {
	const y = window.scrollY, h = window.innerHeight;
	if (surAccueil) tete.classList.toggle('plein', y > h * 0.75);
	if (flottant) {
		const pied = document.querySelector('.pied');
		const finProche = pied && pied.getBoundingClientRect().top < h * 1.1;
		flottant.classList.toggle('vu', y > h * (surAccueil ? 0.9 : 0.5) && !finProche);
	}
}
window.addEventListener('scroll', surDefilement, { passive: true });
surDefilement();

/* ---------- Fil d'avancement en haut de l'écran ---------- */
const avancee = document.getElementById('avancee');
if (avancee && !calme) {
	const majAvancee = () => {
		const max = document.documentElement.scrollHeight - window.innerHeight;
		gsap.to(avancee, { scaleX: max > 0 ? window.scrollY / max : 0, duration: 0.3, ease: 'power2.out', overwrite: true });
	};
	window.addEventListener('scroll', majAvancee, { passive: true });
	majAvancee();
}

/* ---------- Menu plein écran ---------- */
const menu = document.getElementById('menu-plein');
const ouvrir = document.getElementById('ouvrir-menu');
const fermer = document.getElementById('fermer-menu');
const apercus = menu.querySelectorAll('.apercu img');
let dernierFocus = null;

function focusables() {
	return [...menu.querySelectorAll('a[href], button:not([disabled])')].filter((e) => e.offsetParent !== null);
}
function basculerMenu(ouvert) {
	ouvrir.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
	racine.style.overflow = ouvert ? 'hidden' : '';
	if (ouvert) {
		dernierFocus = document.activeElement;
		menu.hidden = false;
		menu.classList.add('ouvert');
		if (!calme) {
			gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power4.inOut' });
			gsap.fromTo(menu.querySelectorAll('nav a .mot'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.06, delay: 0.3 });
		}
		setTimeout(() => fermer.focus(), calme ? 0 : 350);
	} else {
		const fin = () => { menu.classList.remove('ouvert'); menu.hidden = true; (dernierFocus || ouvrir).focus(); };
		if (calme) fin();
		else gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'power4.inOut', onComplete: fin });
	}
}
ouvrir.addEventListener('click', () => basculerMenu(true));
fermer.addEventListener('click', () => basculerMenu(false));
document.addEventListener('keydown', (e) => {
	if (ouvrir.getAttribute('aria-expanded') !== 'true') return;
	if (e.key === 'Escape') basculerMenu(false);
	if (e.key === 'Tab') {
		// le clavier reste dans le menu tant qu'il est ouvert
		const f = focusables(); if (!f.length) return;
		if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
		else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
	}
});
menu.querySelectorAll('[data-img]').forEach((a) => {
	const montrer = () => apercus.forEach((im, i) => im.classList.toggle('vu', i === Number(a.dataset.img)));
	a.addEventListener('mouseenter', montrer);
	a.addEventListener('focus', montrer);
});

/* ---------- Transition entre les pages : quatre fils de teinture descendent puis remontent ---------- */
const rideau = document.getElementById('rideau');
const fils = rideau.querySelectorAll('span');
const nomRideau = document.getElementById('rideau-nom');

function lienInterne(a, e) {
	if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
	if (a.target && a.target !== '_self') return false;
	if (a.hasAttribute('download') || a.dataset.sansTransition !== undefined) return false;
	const url = new URL(a.href, location.href);
	if (url.origin !== location.origin) return false;
	if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/agenda/') || /\.[a-z0-9]+$/i.test(url.pathname)) return false;
	if (url.pathname === location.pathname && url.search === location.search) return false; // ancre sur la même page
	return url;
}
document.addEventListener('click', (e) => {
	const a = e.target.closest('a[href]');
	const url = lienInterne(a, e);
	if (!url || calme) return;
	e.preventDefault();
	nomRideau.textContent = a.dataset.page || a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40);
	try { sessionStorage.setItem('neo-transition', '1'); } catch { /* navigation privée */ }
	gsap.timeline({ onComplete: () => { location.href = url.href; } })
		.set(fils, { transformOrigin: 'top' })
		.to(fils, { scaleY: 1, duration: 0.55, ease: 'power3.inOut', stagger: 0.06 })
		.to(nomRideau, { opacity: 1, duration: 0.25 }, '-=0.1');
});

// Arrivée sur la nouvelle page : le rideau remonte
function arriver() {
	if (!racine.classList.contains('arrivee')) return;
	try { sessionStorage.removeItem('neo-transition'); } catch { /* rien */ }
	if (calme) { racine.classList.remove('arrivee'); return; }
	gsap.set(fils, { scaleY: 1, transformOrigin: 'bottom' });
	racine.classList.remove('arrivee');
	gsap.to(fils, { scaleY: 0, duration: 0.6, ease: 'power3.inOut', stagger: 0.07, delay: 0.05 });
}
arriver();
// Retour arrière (page gardée en mémoire par le navigateur) : rideau rangé
window.addEventListener('pageshow', (e) => { if (e.persisted) { gsap.set(fils, { scaleY: 0 }); gsap.set(nomRideau, { opacity: 0 }); } });
