// Attributs d'image : dimensions (évite que la page « saute » au chargement)
// et version réduite pour les téléphones, pour les photos d'origine du site.
import dims from '../data/dimensions-images.json';

export function attrsImage(src, sizes = '(max-width: 900px) 100vw, 50vw') {
	const d = dims[src];
	if (!d) return {};
	const [w, h, petit] = d;
	const a = { width: w, height: h };
	if (petit) {
		a.srcset = `${src.replace(/\.webp$/, '-800.webp')} ${petit[0]}w, ${src} ${w}w`;
		a.sizes = sizes;
	}
	return a;
}
