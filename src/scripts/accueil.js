// Neotisse v2 : animations de la page d'accueil.
// Le fil teint mené par une aiguille, les mots qui glissent, le carrousel des ateliers, les apparitions au défilement.
// Tout est désactivé si l'appareil demande moins d'animations.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { surOuverture } from './chargement.js';
import { decouperEnMots, cacheMot } from './mots.js';

gsap.registerPlugin(ScrollTrigger);
var g = gsap, ST = ScrollTrigger;
var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var chargement = document.getElementById('chargement');

/* Carrousel des ateliers : il avance tout seul avec le défilement de la page,
   et on peut aussi le faire glisser (souris, doigt) ou utiliser les flèches du clavier. */
var car = document.getElementById('carrousel'), barre = document.getElementById('progression');
var placerCarrousel = null, carrouselDefil = 0;
if (car && barre) {
var main = 0, x = 0, departX = 0, baseMain = 0, prise = false;
function limites() { return Math.min(0, window.innerWidth - car.scrollWidth); }
function placer(anime) {
var lim = limites();
main = Math.max(lim - carrouselDefil, Math.min(-carrouselDefil, main));
x = carrouselDefil + main;
if (anime && !calme) g.to(car, { x: x, duration: 0.8, ease: 'power3.out', overwrite: true });
else g.set(car, { x: x, overwrite: true });
barre.style.transform = 'scaleX(' + (0.15 + 0.85 * (lim ? x / lim : 0)) + ')';
}
placerCarrousel = placer;
var glisse = 0;
car.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse' && e.button !== 0) return; prise = true; glisse = 0; departX = e.clientX; baseMain = main; car.classList.add('prise'); });
car.addEventListener('click', function (e) { if (glisse > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
car.addEventListener('pointermove', function (e) { if (!prise) return; glisse = Math.max(glisse, Math.abs(e.clientX - departX)); if (glisse > 6) { main = baseMain + (e.clientX - departX) * 1.2; placer(false); } });
['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) { car.addEventListener(t, function () { prise = false; car.classList.remove('prise'); }); });
car.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { main -= 300; placer(true); } if (e.key === 'ArrowLeft') { main += 300; placer(true); } });
window.addEventListener('resize', function () { placer(false); });
placer(false);
}

/* Titres qui montent mot à mot, chaque mot sortant d'un cache */
function decouperTitre(h) {
if (h.dataset.decoupe) return;
h.dataset.decoupe = '1';
h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
decouperEnMots(h, cacheMot);
}

/* Fil aux quatre couleurs, de haut en bas de la page */
/* ---------- Le fil rouge ----------
 Un seul fil de laine garance, mené par une aiguille. Il passe derrière les photos et les cartes
 (comme un fil de trame), fait une boucle près de certains titres et finit noué sur le bouton de contact. */
var aiguille = null, traceFil = null, longueurFil = 0;
function pos() {
// premier élément trouvé parmi les sélecteurs donnés (une section peut être vide dans le back-office)
var el = null;
for (var i = 0; i < arguments.length && !el; i++) el = document.querySelector(arguments[i]);
var main = document.getElementById('haut'), m = main.getBoundingClientRect();
if (!el) return { x: m.width * 0.1, y: m.height * 0.5, w: m.width * 0.8, h: 10 };
var r = el.getBoundingClientRect();
return { x: r.left - m.left, y: r.top - m.top, w: r.width, h: r.height };
}
// Courbe douce qui passe par tous les points (Catmull-Rom convertie en courbes de Bézier)
function courbe(pts) {
var d = 'M ' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
for (var i = 0; i < pts.length - 1; i++) {
  var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, t = 5.2;
  d += ' C ' + (p1[0] + (p2[0] - p0[0]) / t).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / t).toFixed(1) + ', ' +
    (p2[0] - (p3[0] - p1[0]) / t).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / t).toFixed(1) + ', ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
}
return d;
}
// Petite boucle : le fil fait un tour sur lui-même autour du point (x, y)
function boucle(x, y, r, sens) {
var s = sens || 1, pts = [[x - r * 2.2 * s, y - r * 0.6]];
// le fil entre, fait un tour complet bien rond, puis repart
[150, 200, 250, 300, 350, 40, 90, 130].forEach(function (deg) {
  var a = deg * Math.PI / 180;
  pts.push([x + Math.cos(a) * r * s, y + Math.sin(a) * r]);
});
pts.push([x + r * 0.2 * s, y + r * 2.4]);
return pts;
}
/* Souplesse : les longs passages pendent un peu, comme un fil tenu à ses deux bouts */
var pointsFil = [];
function assouplir(pts) {
var r = [pts[0]];
for (var i = 1; i < pts.length; i++) {
  var a = pts[i - 1], b = pts[i], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  var n = Math.floor(L / 140);
  for (var k = 1; k <= n; k++) {
    var t = k / (n + 1), creux = Math.sin(Math.PI * t) * Math.min(38, L * 0.06);
    // le fil s'affaisse vers le bas (gravité) et ondule un peu sur le côté
    r.push([a[0] + dx * t + Math.sin(k * 1.7 + i) * 6, a[1] + dy * t + creux]);
  }
  r.push(b);
}
return r;
}
/* Le fil ondule quand on fait défiler, puis se calme */
var energie = 0, dernierY = window.scrollY, temps = 0, filAnime = false;
function onduler() {
var v = window.scrollY - dernierY; dernierY = window.scrollY;
energie += (Math.min(34, Math.abs(v) * 0.9) - energie) * (Math.abs(v) * 0.9 > energie ? 0.18 : 0.035);
temps += 0.016;
var amp = 1.6 + energie;
if (pointsFil.length) {
  var n = pointsFil.length;
  var d = courbe(pointsFil.map(function (p, i) {
    if (i < 2 || i > n - 3) return p; // les deux bouts restent attachés
    var phase = temps * 2.4 + p[1] * 0.0045;
    return [p[0] + Math.sin(phase) * amp, p[1] + Math.cos(phase * 0.8) * amp * 0.35];
  }));
  var svg = document.getElementById('fil');
  svg.querySelectorAll('path[data-fil]').forEach(function (pa) { pa.setAttribute('d', d); });
  if (traceFil) traceFil.setAttribute('d', d);
  if (aiguille && placerAiguilleFil) placerAiguilleFil();
}
requestAnimationFrame(onduler);
}
var placerAiguilleFil = null;

function dessinerFil() {
var svg = document.getElementById('fil'), main = svg.parentElement;
var W = main.clientWidth, H = main.scrollHeight, etroit = W < 760;
svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
if (ST) ST.getAll().forEach(function (t) { if (/^fil/.test(t.vars.id || '')) t.kill(); });
var hero = pos('.hero');
var mani = pos('#manifeste', '.manifeste');
var pri = pos('.principes .grille', '#manifeste');
var ate = pos('.ateliers');
var car = pos('.carte .img', '.ateliers');
var res = pos('.respiration', '.ateliers');
var equ = pos('.equipe h2');
var pho = pos('.equipe .photos', '.equipe');
var age = pos('.dates', '.agenda h2');
var bou = pos('.final .bouton', '.final h2');
var pts;
if (etroit) {
  // Téléphone : le fil longe le bord gauche, avec une boucle à chaque grande section.
  var x = 10;
  pts = [[W / 2, hero.y + hero.h - 50], [W / 2, hero.y + hero.h + 40], [x + 6, mani.y - 30]];
  [mani.y + mani.h / 2, ate.y + 60, equ.y + 10, age.y - 20].forEach(function (y, i) {
    pts.push([x, y - 120]); boucle(x + 1, y, 6, 1).forEach(function (p) { pts.push(p); }); pts.push([x + 2, y + 140]);
  });
  pts.push([x, bou.y - 160], [x + 2, bou.y + bou.h * 0.5 - 30], [bou.x - 14, bou.y + bou.h * 0.5 + 4], [bou.x + 8, bou.y + bou.h * 0.5]);
} else {
  var cy = car.y + car.h * 0.55;
  pts = [
    [W / 2, hero.y + hero.h - 50], [W / 2, hero.y + hero.h + 60],
    [mani.x - 70, mani.y + mani.h * 0.35]
  ].concat(boucle(mani.x - 90, mani.y + mani.h * 0.62, 24, 1)).concat([
    [mani.x - 40, mani.y + mani.h + 40],
    [W * 0.55, pri.y - 30], [W * 0.92, pri.y + pri.h * 0.4], [W * 0.94, ate.y + 40],
    // dans la section ateliers : le fil passe derrière les cartes, d'un bord à l'autre
    [W * 0.86, cy - 120], [W * 0.5, cy], [W * 0.04, cy + 40],
    [W * 0.08, res.y - 60],
    // derrière la grande photo
    [W * 0.35, res.y + res.h * 0.5], [W * 0.62, res.y + res.h + 40],
    [pho.x + pho.w + 20, equ.y - 30]
  ]).concat(boucle(equ.x - 70, equ.y + 30, 20, -1)).concat([
    [pho.x + pho.w * 0.6, pho.y + pho.h + 50], [age.x - 44, age.y - 150], [age.x - 36, age.y - 30], [age.x - 30, age.y + age.h * 0.5],
    [age.x - 20, age.y + age.h + 40], [W * 0.5, age.y + age.h + 120],
    // passe sous le bandeau des partenaires, puis longe le bord droit jusqu'au bouton
    [W * 0.95, bou.y - 420], [W * 0.93, bou.y - 120], [bou.x + bou.w + 150, bou.y + bou.h * 0.2]
  ]).concat(boucle(bou.x + bou.w + 70, bou.y + bou.h * 0.5, 16, -1)).concat([[bou.x + bou.w + 18, bou.y + bou.h * 0.55], [bou.x + bou.w - 8, bou.y + bou.h * 0.5]]);
}
pts = assouplir(pts);
pointsFil = pts;
var d = courbe(pts);
var ep = etroit ? 2.4 : 3.2;
// Teinture du fil : la couleur suit le fond de chaque section pour rester bien visible
var debutY = hero.y + hero.h - 60, finY = bou.y + bou.h, span = Math.max(1, finY - debutY);
var off = function (y) { return Math.max(0, Math.min(1, (y - debutY) / span)).toFixed(4); };
var arrets = [
  [debutY, '#A8321F'], [mani.y + mani.h * 0.6, '#A8321F'], [pri.y + pri.h * 0.5, '#2E5A8A'],
  [ate.y + 40, '#E8B42F'], [ate.y + ate.h - 40, '#E8B42F'], [pho.y + pho.h * 0.3, '#4F5233'],
  [age.y, '#A8321F'], [age.y + age.h + 60, '#A8321F'], [bou.y - 260, '#E8B42F'], [finY, '#E8B42F']
];
var degrade = '<linearGradient id="teinte" gradientUnits="userSpaceOnUse" x1="0" y1="' + debutY.toFixed(0) + '" x2="0" y2="' + finY.toFixed(0) + '">' +
  arrets.map(function (a) { return '<stop offset="' + off(a[0]) + '" stop-color="' + a[1] + '"/>'; }).join('') + '</linearGradient>';
svg.innerHTML = '<defs>' + degrade +
  '<mask id="masque-fil" maskUnits="userSpaceOnUse" x="-40" y="0" width="' + (W + 80) + '" height="' + H + '"><path id="trace" d="' + d + '" stroke="#fff" stroke-width="' + (ep + 7) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/></mask>' +
  '</defs>' +
  '<g mask="url(#masque-fil)" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
    // ombre portée très légère sur le fond
    '<path data-fil d="' + d + '" stroke="#26222A" stroke-opacity=".13" stroke-width="' + (ep + 1.5) + '" transform="translate(1.5,3)"/>' +
    // l'âme du fil, teinte à la garance
    '<path data-fil d="' + d + '" stroke="url(#teinte)" stroke-width="' + ep + '"/>' +
    // les deux brins du fil retors : petites torsions sombres
    '<path data-fil d="' + d + '" stroke="#26222A" stroke-opacity=".32" stroke-width="' + ep + '" stroke-dasharray="1.2 3.4"/>' +
    // reflet de la laine
    '<path data-fil d="' + d + '" stroke="#FFF3DD" stroke-opacity=".5" stroke-width="' + (ep * 0.3).toFixed(2) + '" stroke-dasharray="6 2.5" transform="translate(-.6,-.7)"/>' +
    // quelques fibres qui dépassent
    '<path data-fil d="' + d + '" stroke="url(#teinte)" stroke-opacity=".45" stroke-width=".6" stroke-dasharray=".8 9 .6 14" transform="translate(1.4,.4)"/>' +
  '</g>' +
  '<g id="aiguille" aria-hidden="true"><line x1="-26" y1="0" x2="10" y2="0" stroke="#8C8F96" stroke-width="2.4" stroke-linecap="round"/><line x1="-24" y1="-.6" x2="8" y2="-.6" stroke="#E9EBEF" stroke-width=".8" stroke-linecap="round"/><ellipse cx="-20" cy="0" rx="3.4" ry="1.1" fill="#F4EFE6" stroke="#8C8F96" stroke-width=".8"/><path d="M10 -1.2 L 16 0 L 10 1.2 Z" fill="#8C8F96"/></g>';
traceFil = document.getElementById('trace'); longueurFil = traceFil.getTotalLength();
aiguille = document.getElementById('aiguille');
if (!g || !ST || calme) { g && g.set(aiguille, { opacity: 0 }); return; }
g.set(traceFil, { strokeDasharray: longueurFil + ' ' + (longueurFil * 4), strokeDashoffset: longueurFil });
var placerAiguille = function () {
  var fait = longueurFil - (parseFloat(traceFil.style.strokeDashoffset) || 0);
  var p = traceFil.getPointAtLength(Math.max(0, fait)), q = traceFil.getPointAtLength(Math.min(longueurFil, fait + 4));
  var angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
  aiguille.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + angle.toFixed(1) + ')');
  aiguille.style.opacity = fait > 4 && fait < longueurFil - 6 ? 1 : 0;
};
placerAiguilleFil = placerAiguille;
if (!filAnime) { filAnime = true; requestAnimationFrame(onduler); }
g.to(traceFil, { strokeDashoffset: 0, ease: 'none', onUpdate: placerAiguille,
  scrollTrigger: { id: 'fil-trace', trigger: '.manifeste', start: 'top 92%', endTrigger: '.final .bouton', end: 'top 60%', scrub: 0.9 } });
placerAiguille();
}


function animations() {
if (calme) { dessinerFil(); return; }
document.documentElement.classList.add('js-anim');
// le fil est tracé d'après la mise en page, avant que les animations ne déplacent les éléments
dessinerFil();
// Entrée du titre : tout de suite, ou au moment où l'écran d'attente s'ouvre (première visite)
var tl = g.timeline({ paused: true });
surOuverture(function () { tl.play(); });
tl.from('.hero h1 .ligne > span', { yPercent: 110, duration: 1.2, ease: 'power4.out', stagger: 0.1 }, 0.05)
  .from('.hero .apparait', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.15 }, '-=0.9')
  .from('#hero-img', { scale: 1.15, duration: 2.4, ease: 'power2.out' }, '-=1.6');
// Hero en parallaxe
g.to('#hero-img', { yPercent: 18, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
g.to('.hero .contenu', { yPercent: -35, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '20% top', end: 'bottom top', scrub: true } });
g.to('.hero .defiler', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '15% top', scrub: true } });
// Grands titres des sections : les mots montent, liés au défilement
document.querySelectorAll('.ateliers h2, .equipe h2, .agenda h2, .final h2').forEach(function (h) {
  decouperTitre(h);
  g.from(h.querySelectorAll('.cache-mot > span'), { yPercent: 110, rotate: 4, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 92%', end: 'top 55%', scrub: 0.8 } });
});
// Petits titres : un trait qui se dessine
g.utils.toArray('main .libelle').forEach(function (l) {
  g.from(l, { opacity: 0, x: -30, ease: 'none', scrollTrigger: { trigger: l, start: 'top 95%', end: 'top 75%', scrub: 0.6 } });
});
// Manifeste mot à mot
var m = document.getElementById('manifeste');
if (m) decouperEnMots(m, function (c) { var s = document.createElement('span'); s.className = 'mot'; s.appendChild(c); return s; });
if (m) g.to('#manifeste .mot', { opacity: 1, stagger: 0.06, ease: 'none', scrollTrigger: { trigger: m, start: 'top 82%', end: 'bottom 45%', scrub: true } });
// Principes : chiffres qui défilent
// Principes : chaque colonne monte à sa propre vitesse
g.utils.toArray('.principe').forEach(function (c, i) {
  g.fromTo(c, { y: 60 + i * 50, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.principes', start: 'top 95%', end: 'top 40%', scrub: 0.8 } });
});
// Mots qui glissent au rythme du défilement (une ligne vers la gauche, l'autre vers la droite)
if (document.getElementById('rang-1')) g.fromTo('#rang-1', { x: function () { return window.innerWidth * 0.05; } }, { x: function () { return -(document.getElementById('rang-1').scrollWidth - window.innerWidth * 0.95); }, ease: 'none', scrollTrigger: { trigger: '.mots', start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } });
if (document.getElementById('rang-2')) g.fromTo('#rang-2', { x: function () { return -(document.getElementById('rang-2').scrollWidth - window.innerWidth * 0.95); } }, { x: function () { return window.innerWidth * 0.05; }, ease: 'none', scrollTrigger: { trigger: '.mots', start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } });
// Ateliers
g.from('.carte', { y: 80, opacity: 0, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: '.grille-cartes', start: 'top 95%', end: 'top 45%', scrub: 0.8 } });
// le carrousel avance à mesure qu'on descend dans la page
if (placerCarrousel) ST.create({ trigger: '.ateliers', start: 'top 60%', end: 'bottom 20%', scrub: true, invalidateOnRefresh: true,
  onUpdate: function (st) { carrouselDefil = st.progress * Math.min(0, window.innerWidth - car.scrollWidth); placerCarrousel(false); } });
// les photos des cartes glissent dans leur cadre
g.utils.toArray('.carte img').forEach(function (im) {
  g.fromTo(im, { xPercent: -6, scale: 1.15 }, { xPercent: 6, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.ateliers', start: 'top bottom', end: 'bottom top', scrub: true } });
});
// Grande photo
g.fromTo('.respiration', { clipPath: 'inset(8% 6% 8% 6%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.respiration', start: 'top bottom', end: 'top 25%', scrub: true } });
g.to('#respiration-img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.respiration', start: 'top bottom', end: 'bottom top', scrub: true } });
g.from('.respiration blockquote, .respiration cite', { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: '.respiration', start: 'top 45%' } });
// Équipe
document.querySelectorAll('[data-vitesse]').forEach(function (im) {
  g.fromTo(im, { yPercent: -4, scale: 1.12 }, { yPercent: +im.getAttribute('data-vitesse'), ease: 'none', scrollTrigger: { trigger: '.equipe', start: 'top bottom', end: 'bottom top', scrub: true } });
});
g.fromTo('.equipe .photos .a', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: '.equipe', start: 'top 70%' } });
g.fromTo('.equipe .photos .b', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.inOut', delay: 0.25, scrollTrigger: { trigger: '.equipe', start: 'top 70%' } });
// Agenda
// Prochaines dates : elles apparaissent simplement, l'une après l'autre
g.from('.dates li', { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.dates', start: 'top 85%' } });
g.from('.equipe .noms > div', { y: 40, opacity: 0, ease: 'none', stagger: 0.2, scrollTrigger: { trigger: '.equipe .noms', start: 'top 95%', end: 'top 70%', scrub: 0.8 } });
// Partenaires : défilement continu, accéléré par le scroll
// Final
document.querySelectorAll('.fils-deco path').forEach(function (p, i) {
  var l = p.getTotalLength(); g.set(p, { strokeDasharray: l, strokeDashoffset: l });
  g.to(p, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: i * 0.15, scrollTrigger: { trigger: '.final', start: 'top 70%' } });
});
g.from('.final p, .final .bouton', { y: 40, opacity: 0, ease: 'none', stagger: 0.15, scrollTrigger: { trigger: '.final', start: 'top 75%', end: 'top 35%', scrub: 0.8 } });
ST.refresh();
var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { dessinerFil(); ST.refresh(); }, 250); });
}

if (document.readyState === 'complete') animations();
else window.addEventListener('load', animations);
