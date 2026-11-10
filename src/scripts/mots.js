// Découpe le texte d'un élément en mots, chacun enveloppé dans un <span>, sans passer par innerHTML :
// les balises (italique, gras…) et leurs attributs restent intacts, quel que soit l'environnement.
// `creer(contenu)` reçoit un nœud (mot ou balise entière) et renvoie l'élément qui l'enveloppe.

/** Vrai si l'élément ne contient que du texte, de l'italique, du gras ou des retours à la ligne. */
export function texteSimple(el) {
	return [...el.childNodes].every((n) => n.nodeType === 3 || (n.nodeType === 1 && /^(EM|STRONG|BR)$/.test(n.tagName)));
}

export function decouperEnMots(el, creer) {
	const frag = document.createDocumentFragment();
	let dernier = null; // l'élément qui contient le dernier mot, pour y recoller la ponctuation qui le suit
	const ajouter = (noeud) => { frag.appendChild(creer(noeud)); dernier = noeud.parentNode; };
	[...el.childNodes].forEach((n) => {
		if (n.nodeType === 3) {
			// les espaces insécables restent dans le mot : « mesure ? » ne se coupe pas
			n.textContent.split(/([ \t\n\r]+)/).forEach((morceau, i) => {
				if (!morceau) return;
				if (/^[ \t\n\r]+$/.test(morceau)) { frag.appendChild(document.createTextNode(' ')); dernier = null; }
				else if (i === 0 && dernier) dernier.appendChild(document.createTextNode(morceau)); // collé au mot d'avant
				else ajouter(document.createTextNode(morceau));
			});
		} else if (n.nodeType === 1 && n.tagName === 'BR') {
			frag.appendChild(n); dernier = null;
		} else if (n.nodeType === 1) {
			ajouter(n); // une balise (italique, gras) reste un seul bloc
		}
	});
	el.replaceChildren(frag);
}

/** Mots qui sortent d'un cache : <span class="cache-mot"><span>mot</span></span> */
export function cacheMot(contenu) {
	const ext = document.createElement('span'), int = document.createElement('span');
	ext.className = 'cache-mot'; ext.setAttribute('aria-hidden', 'true');
	int.appendChild(contenu); ext.appendChild(int);
	return ext;
}
