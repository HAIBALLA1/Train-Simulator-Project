

'use strict'



// Nombre de cases par défaut du simulateur
const LARGEUR_PLATEAU = 30;
const HAUTEUR_PLATEAU = 15;

// Dimensions des cases par défaut en pixels
const LARGEUR_CASE = 35;
const HAUTEUR_CASE = 40;


/*------------------------------------------------------------*/
// Types des cases
/*------------------------------------------------------------*/
class Type_de_case {
	static Foret = new Type_de_case('foret');
	static Eau = new Type_de_case('eau');
	static Rail_horizontal = new Type_de_case('rail horizontal');
	static Rail_vertical = new Type_de_case('rail vertical');
	static Rail_droite_vers_haut = new Type_de_case('rail droite vers haut');
	static Rail_haut_vers_droite = new Type_de_case('rail haut vers droite');
	static Rail_droite_vers_bas = new Type_de_case('rail droite vers bas');
	static Rail_bas_vers_droite = new Type_de_case('rail bas vers droite');
	static Arbre = new Type_de_case('arbre');
	static Volcan = new Type_de_case('volcan');
	static Grenouille = new Type_de_case('grenouille');
	static Champingnion = new Type_de_case('champingnion');

	constructor(nom) {
		this.nom = nom;
	}
}

/*------------------------------------------------------------*/
// Images
/*------------------------------------------------------------*/
const IMAGE_EAU = new Image();
IMAGE_EAU.src = 'images/eau.png';

const IMAGE_FORET = new Image();
IMAGE_FORET.src = 'images/foret.png';

const IMAGE_LOCO = new Image();
IMAGE_LOCO.src = 'images/locomotive.png';

const IMAGE_RAIL_HORIZONTAL = new Image();
IMAGE_RAIL_HORIZONTAL.src = 'images/rail-horizontal.png';

const IMAGE_RAIL_VERTICAL = new Image();
IMAGE_RAIL_VERTICAL.src = 'images/rail-vertical.png';

const IMAGE_RAIL_BAS_VERS_DROITE = new Image();
IMAGE_RAIL_BAS_VERS_DROITE.src = 'images/rail-bas-vers-droite.png';

const IMAGE_RAIL_DROITE_VERS_BAS = new Image();
IMAGE_RAIL_DROITE_VERS_BAS.src = 'images/rail-droite-vers-bas.png';

const IMAGE_RAIL_DROITE_VERS_HAUT = new Image();
IMAGE_RAIL_DROITE_VERS_HAUT.src = 'images/rail-droite-vers-haut.png';

const IMAGE_RAIL_HAUT_VERS_DROITE = new Image();
IMAGE_RAIL_HAUT_VERS_DROITE.src = 'images/rail-haut-vers-droite.png';

const IMAGE_WAGON = new Image();
IMAGE_WAGON.src = 'images/wagon.png';
const IMAGE_LOCOMO = new Image();
IMAGE_LOCOMO.src = 'images/locomotive.png';

const IMAGE_ARBRE = new Image();
IMAGE_ARBRE.src = 'images/arbre.png';

const IMAGE_VOLCAN = new Image();
IMAGE_VOLCAN.src = 'images/volcan.png';

const IMAGE_GRENOUILLE = new Image();
IMAGE_GRENOUILLE.src = 'images/grenouille.png';

const IMAGE_CHAMPINGNION = new Image();
IMAGE_GRENOUILLE.src = 'images/champignion.png';

const IMAGE_EXPLOSION = new Image();
IMAGE_EXPLOSION.src = 'images/explosion.gif';

/************************************************************/
// Variables globales
/************************************************************/

let Plateau_de_jeu;
let intervalId;
let Pause = false;
let contexte;
let c = 0;
let trains = [];



class Plateau {
	/* Constructeur d'un plateau vierge */
	constructor() {
		this.largeur = LARGEUR_PLATEAU;
		this.hauteur = HAUTEUR_PLATEAU;

		// État des cases du plateau
		this.cases = [];
		for (let x = 0; x < this.largeur; x++) {
			this.cases[x] = [];
			for (let y = 0; y < this.hauteur; y++) {
				this.cases[x][y] = Type_de_case.Foret;
			}
		}
	}

	ajouterTrain(x, y, nbr_wagon, Type_button) {
		if ((x >= 0 && y >= 0 && x < this.largeur && y < this.hauteur) &&
			this.cases[x][y] === Type_de_case.Rail_horizontal &&
			!Train.UnDesTrainOccupe(x, y)) {

			for (let i = 1; i <= nbr_wagon; i++) {
				if (x - i < 0 || x - i >= this.largeur ||
					this.cases[x - i][y] !== Type_de_case.Rail_horizontal ||
					Train.UnDesTrainOccupe(x - i, y)) {
					console.log("Pas possible wagon dans un train");
					return false;
				}
			}
			console.log('par la');
			const newTrain = new Train(new locomotive(x, y), nbr_wagon);
			trains.push(newTrain);
			dessine_vehicule(contexte, Type_button, x, y);
			this.demarrer();
			return true;
		}

		console.log("pas possible locomotive dans un train");
		return false;
	}

	supprimerTrain(train) {
		for (let i = 0; i < trains.length; i++) {
			if (trains[i] === train) {
				// Afficher l'animation d'explosion
				dessine_case(contexte, this, train.locomotive.x, train.locomotive.y);
				contexte.drawImage(IMAGE_EXPLOSION, train.locomotive.x * LARGEUR_CASE, train.locomotive.y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);

				// Afficher un message d'erreur
				const messageErreur = document.getElementById('message-erreur');
				messageErreur.textContent = 'Collision de trains! Les trains ont explosé.';
				messageErreur.style.display = 'block';

				setTimeout(() => {
					// Cacher l'animation d'explosion et redessiner les cases où les wagons se trouvaient
					for (let wagon of train.wagons) {
						dessine_case(contexte, this, wagon.x, wagon.y);
					}
					dessine_case(contexte, this, train.locomotive.x, train.locomotive.y);

					// Supprimer le train de la liste des trains
					trains.splice(i, 1);
					console.log('Train supprimé avec succès');

					// Cacher le message d'erreur
					messageErreur.style.display = 'none';
				}, 1000); // Durée de l'animation en millisecondes

				return true;
			}
		}
		console.log('Train non trouvé, donc il y a un problème');
		return false;
	}


	demarrer() {
		if (Pause) {
			Pause = false;
		}
		this.boucler();
	}

	animer() {
		for (let i = 0; i < trains.length; i++) {
			trains[i].avancer();
		}
	}

	boucler() {
		if (Pause) return false;
		this.animer();
		setTimeout(() => this.boucler(), 500); // une itération par 500ms = 2 itérations par seconde
	}

	togglePause()
	{
		Pause=!Pause;
		if(!Pause)
		{
			console.log("helloooo my firen");
			this.boucler();
		}


	}
}

// Classe locomotive
class locomotive {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.direction = 'droite'; // par défaut
	}

	avancer() {
		let flag_arret_wagons = 0;
		let ancien_x = this.x;
		let ancien_y = this.y;
		let train = this.trouverLeTrain();
		this.MettreAJourPosLocomo();
		switch (this.direction) { // actualiser x , y
			case 'droite':
				this.x++;
				break;
			case 'gauche':
				this.x--;
				break;
			case 'haut':
				this.y--;
				break;
			case 'bas':
				this.y++;
				break;
			case 'static':
				break;
			case 'supprimer':
				console.log('SUPPRESSION DE TRAIN');

				if (train) { // on s'assure qu'il existe
					Plateau_de_jeu.supprimerTrain(train);
				}
				console.log('locomotive dans' + this.x, this.y);
				dessine_case(contexte, Plateau_de_jeu, this.x, this.y);
				flag_arret_wagons = 1;
				break;
		}
		dessine_case(contexte, Plateau_de_jeu, ancien_x, ancien_y); // enlever l'image de la locomotive
		if (flag_arret_wagons !== 1) {
			dessine_vehicule(contexte, "Locomotive seule", this.x, this.y); // null pour le wagon
		}

		let x_wagon;
		let y_wagon;
		let x_loco = ancien_x;
		let y_loco = ancien_y;
		if (flag_arret_wagons !== 1) {
			for (let i = train.wagons.length - 1; i >= 0; i--) { // les wagons vont suivre la locomotive
				x_wagon = train.wagons[i].x;
				y_wagon = train.wagons[i].y;
				train.wagons[i].avancer(x_loco, y_loco)
				x_loco = x_wagon; // je fais en sorte qu'un wagon devienne la locomotive de celui derrière lui
				y_loco = y_wagon;
			}
		}

		this.detecterCollision();
	}

	detecterCollision() {
		for (let i = 0; i < trains.length; i++) {
			for (let j = i + 1; j < trains.length; j++) {
				if (trains[i].locomotive.x === trains[j].locomotive.x && trains[i].locomotive.y === trains[j].locomotive.y) {
					// Afficher un message d'erreur
					const messageErreur = document.getElementById('message-erreur');
					messageErreur.textContent = 'Collision de trains! Les trains ont explosé.';
					messageErreur.style.display = 'block';

					// Afficher l'animation d'explosion pour le premier train
					dessine_case(contexte, Plateau_de_jeu, trains[i].locomotive.x, trains[i].locomotive.y);
					contexte.drawImage(IMAGE_EXPLOSION, trains[i].locomotive.x * LARGEUR_CASE, trains[i].locomotive.y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);

					// Supprimer les trains après un délai pour montrer l'explosion
					setTimeout(() => {
						let ti=trains[i];
						let tj=trains[j];

						Plateau_de_jeu.supprimerTrain(ti);
						Plateau_de_jeu.supprimerTrain(tj);

						// Cacher le message d'erreur après la suppression des trains
						messageErreur.style.display = 'none';
					}, 500); // Durée de l'animation en millisecondes

					return;
				}
			}
		}
	}


	trouverLeTrain() {
		return trains.find(train => train.locomotive === this);
	}

	MettreAJourPosLocomo()
	{
		//revient a mettre a jour position de locomotive
		let pos_x=this.x;
		let pos_y=this.y;
		let type_case=Plateau_de_jeu.cases[pos_x][pos_y];

		if(type_case===Type_de_case.Rail_droite_vers_haut && this.direction==='droite')
		{
			this.direction='haut';
		}
		else if(type_case===Type_de_case.Rail_droite_vers_haut && this.direction==='bas')
		{
			this.direction='gauche';
		}


		else if(type_case===Type_de_case.Rail_haut_vers_droite && this.direction==='haut')
		{
			this.direction='droite';
		}
		else if(type_case===Type_de_case.Rail_haut_vers_droite && this.direction==='gauche')
		{
			this.direction='bas';
		}

		else if(type_case===Type_de_case.Rail_bas_vers_droite && this.direction==='bas')
		{
			this.direction='droite';
		}
		else if(type_case===Type_de_case.Rail_bas_vers_droite && this.direction==='gauche')
		{
			this.direction='haut';
		}

		else if(type_case===Type_de_case.Rail_droite_vers_bas && this.direction==='droite')
		{
			this.direction='bas';
		}
		else if(type_case===Type_de_case.Rail_droite_vers_bas && this.direction==='haut')
		{
			this.direction='gauche';
		}
		else if(type_case===Type_de_case.Rail_horizontal && this.direction==='droite')
		{
			this.direction='droite';
		}
		else if(type_case===Type_de_case.Rail_horizontal && this.direction==='gauche')
		{
			this.direction='gauche';
		}
		else if(type_case===Type_de_case.Rail_vertical && this.direction==='haut')
		{
			this.direction='haut';
		}
		else if(type_case===Type_de_case.Rail_vertical && this.direction==='bas')
		{
			this.direction='bas';
		}
		else if(type_case===Type_de_case.Eau || type_case===Type_de_case.Foret)
		{
			this.direction='supprimer';
		}
		else
		{
			this.direction='supprimer'; // mauvaise voie
		}
	}
}

// Classe Wagon
class Wagon {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	avancer(x, y) {
		dessine_case(contexte, Plateau_de_jeu, this.x, this.y); // enlever l'image du wagon
		this.x = x; // actualiser x
		this.y = y; // actualiser y
		dessine_vehicule(contexte, null, this.x, this.y); // null pour le wagon
		return true;
	}
}

// Classe Train
class Train {
	constructor(locomotive, nbr_wagon) {
		this.x = locomotive.x;
		this.y = locomotive.y;
		this.locomotive = locomotive;
		this.nbr_wagon = nbr_wagon;
		this.wagons = [];
		for (let i = 0; i < nbr_wagon; i++) {
			this.wagons[i] = new Wagon(locomotive.x - (1 + i), locomotive.y);
		}
	}

	TrainOccupe(x, y) {
		if (this.locomotive.x === x && this.locomotive.y === y) {
			return true;
		}
		for (let i = 0; i < this.wagons.length; i++) {
			if (this.wagons[i].x === x && this.wagons[i].y === y) {
				return true;
			}
		}
		return false;
	}

	static UnDesTrainOccupe(x, y) {
		for (let train of trains) {
			if (train.TrainOccupe(x, y)) {
				return true;
			}
		}
		return false;
	}

	avancer() {
		this.locomotive.avancer();
	}
}

/************************************************************/
// Méthodes
/************************************************************/

function image_of_case(type_de_case) {
	switch (type_de_case) {
		case Type_de_case.Foret:
			return IMAGE_FORET;
		case Type_de_case.Eau:
			return IMAGE_EAU;
		case Type_de_case.Rail_horizontal:
			return IMAGE_RAIL_HORIZONTAL;
		case Type_de_case.Rail_vertical:
			return IMAGE_RAIL_VERTICAL;
		case Type_de_case.Rail_droite_vers_haut:
			return IMAGE_RAIL_DROITE_VERS_HAUT;
		case Type_de_case.Rail_haut_vers_droite:
			return IMAGE_RAIL_HAUT_VERS_DROITE;
		case Type_de_case.Rail_droite_vers_bas:
			return IMAGE_RAIL_DROITE_VERS_BAS;
		case Type_de_case.Rail_bas_vers_droite:
			return IMAGE_RAIL_BAS_VERS_DROITE;
		case Type_de_case.Arbre:
			return IMAGE_ARBRE;
		case Type_de_case.Volcan:
			return IMAGE_VOLCAN;
		case Type_de_case.Grenouille:
			return IMAGE_GRENOUILLE;
		case Type_de_case.Champingnion:
			return IMAGE_CHAMPINGNION;
	}
}

function dessine_case(contexte, plateau, x, y) {
	const la_case = plateau.cases[x][y];
	let image_a_afficher = image_of_case(la_case);
	contexte.drawImage(image_a_afficher, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
}

function dessine_plateau(page, plateau) {
	for (let x = 0; x < plateau.largeur; x++) {
		for (let y = 0; y < plateau.hauteur; y++) {
			dessine_case(page, plateau, x, y);
		}
	}
}

function dessine_vehicule(contexte, type_de_vehicule, x, y) {
	switch (type_de_vehicule) {
		case "Locomotive seule":
			contexte.drawImage(IMAGE_LOCOMO, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			break;
		case "Locomotive et 1 wagon":
			contexte.drawImage(IMAGE_LOCOMO, x * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			contexte.drawImage(IMAGE_WAGON, (x - 1) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			break;
		case "Locomotive et 3 wagons":
			contexte.drawImage(IMAGE_LOCOMO, (x - 0) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			contexte.drawImage(IMAGE_WAGON, (x - 1) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			contexte.drawImage(IMAGE_WAGON, (x - 2) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			contexte.drawImage(IMAGE_WAGON, (x - 3) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			break;
		case "Locomotive et 5 wagons":
			contexte.drawImage(IMAGE_LOCOMO, (x - 0) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			contexte.drawImage(IMAGE_WAGON, (x - 1) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			contexte.drawImage(IMAGE_WAGON, (x - 2) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			contexte.drawImage(IMAGE_WAGON, (x - 3) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			contexte.drawImage(IMAGE_WAGON, (x - 4) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			contexte.drawImage(IMAGE_WAGON, (x - 5) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			break;
		default:
			contexte.drawImage(IMAGE_WAGON, (x - 0) * LARGEUR_CASE, y * HAUTEUR_CASE, LARGEUR_CASE, HAUTEUR_CASE);
			break;
	}
}

/************************************************************/
// Auditeurs
/************************************************************/

function interagir_avec_plateau() {
	const pauseButton = document.querySelector("#boutons button");
	pauseButton.addEventListener("click", () => {
		if (!Pause) {
			Plateau_de_jeu.togglePause();
			pauseButton.textContent = 'Redémarrer';
		} else {
			Plateau_de_jeu.togglePause();
			pauseButton.textContent = 'Pause';
		}
	});

	const imageButtons = document.querySelectorAll("#boutons input[type='image']");
	let Type_button = null;
	imageButtons.forEach(button => {
		button.addEventListener("click", () => {
			imageButtons.forEach(btn => {
				btn.disabled = false;
				console.log("hello");
			});
			button.disabled = true;
			Type_button = button.alt;
			console.log("Selected type:", Type_button);
		});
	});

	const champ = document.getElementById("simulateur");
	champ.addEventListener("click", (event) => {
		const rect = champ.getBoundingClientRect();
		const x = Math.floor((event.clientX - rect.left) / LARGEUR_CASE);
		const y = Math.floor((event.clientY - rect.top) / HAUTEUR_CASE);

		if (Type_button) {
			let flag = false;
			switch (Type_button) {
				case "Forêt":
					Plateau_de_jeu.cases[x][y] = Type_de_case.Foret;
					flag = true;
					break;
				case "Eau":
					Plateau_de_jeu.cases[x][y] = Type_de_case.Eau;
					flag = true;
					break;
				case "Rail horizontal":
					Plateau_de_jeu.cases[x][y] = Type_de_case.Rail_horizontal;
					flag = true;
					break;
				case "Rail Vertical":
					Plateau_de_jeu.cases[x][y] = Type_de_case.Rail_vertical;
					flag = true;
					break;
				case "Rail allant de droite vers le haut":
					Plateau_de_jeu.cases[x][y] = Type_de_case.Rail_droite_vers_haut;
					flag = true;
					break;
				case "Rail allant du haut vers la droite":
					Plateau_de_jeu.cases[x][y] = Type_de_case.Rail_haut_vers_droite;
					flag = true;
					break;
				case "Rail allant de la droite vers le bas":
					Plateau_de_jeu.cases[x][y] = Type_de_case.Rail_droite_vers_bas;
					flag = true;
					break;
				case "Rail allant du bas vers la droite":
					Plateau_de_jeu.cases[x][y] = Type_de_case.Rail_bas_vers_droite;
					flag = true;
					break;
				case "Arbre":
					if (Plateau_de_jeu.cases[x][y] === Type_de_case.Foret) {
						Plateau_de_jeu.cases[x][y] = Type_de_case.Arbre;
						flag = true;
					} else {
						console.log("L'arbre ne peut être placé que sur une forêt");
					}
					break;
				case "Volcan":
					if (Plateau_de_jeu.cases[x][y] === Type_de_case.Foret) {
						Plateau_de_jeu.cases[x][y] = Type_de_case.Volcan;
						flag = true;
					} else {
						console.log("Le volcan ne peut être placé que sur une forêt");
					}
					break;
				case "Grenouille":
					if (Plateau_de_jeu.cases[x][y] === Type_de_case.Eau) {
						Plateau_de_jeu.cases[x][y] = Type_de_case.Grenouille;
						flag = true;
					} else {
						console.log("La grenouille ne peut être placée que dans l'eau");
					}
					break;
				case "Champignion":
					if (Plateau_de_jeu.cases[x][y] === Type_de_case.Foret) {
						Plateau_de_jeu.cases[x][y] = Type_de_case.Champingnion;
						flag = true;
					} else {
						console.log("Le Champignion ne peut être placé que sur une forêt");
					}
					break;
			}
			if (flag === true) {
				dessine_case(contexte, Plateau_de_jeu, x, y);
				flag = false;
			}

			switch (Type_button) {
				case "Locomotive seule":
					Plateau_de_jeu.ajouterTrain(x, y, 0, Type_button);
					break;
				case "Locomotive et 1 wagon":
					Plateau_de_jeu.ajouterTrain(x, y, 1, Type_button);
					break;
				case "Locomotive et 3 wagons":
					Plateau_de_jeu.ajouterTrain(x, y, 3, Type_button);
					break;
				case "Locomotive et 5 wagons":
					Plateau_de_jeu.ajouterTrain(x, y, 5, Type_button);
					break;
			}
		}
	});
}


/************************************************************/
// Plateau de jeu initial
/************************************************************/

function cree_plateau_initial(plateau) {
	plateau.cases[12][7] = Type_de_case.Rail_horizontal;
	plateau.cases[13][7] = Type_de_case.Rail_horizontal;
	plateau.cases[14][7] = Type_de_case.Rail_horizontal;
	plateau.cases[15][7] = Type_de_case.Rail_horizontal;
	plateau.cases[16][7] = Type_de_case.Rail_horizontal;
	plateau.cases[17][7] = Type_de_case.Rail_horizontal;
	plateau.cases[18][7] = Type_de_case.Rail_horizontal;
	plateau.cases[19][7] = Type_de_case.Rail_droite_vers_haut;
	plateau.cases[19][6] = Type_de_case.Rail_vertical;
	plateau.cases[19][5] = Type_de_case.Rail_droite_vers_bas;
	plateau.cases[12][5] = Type_de_case.Rail_horizontal;
	plateau.cases[13][5] = Type_de_case.Rail_horizontal;
	plateau.cases[14][5] = Type_de_case.Rail_horizontal;
	plateau.cases[15][5] = Type_de_case.Rail_horizontal;
	plateau.cases[16][5] = Type_de_case.Rail_horizontal;
	plateau.cases[17][5] = Type_de_case.Rail_horizontal;
	plateau.cases[18][5] = Type_de_case.Rail_horizontal;
	plateau.cases[11][5] = Type_de_case.Rail_haut_vers_droite;
	plateau.cases[11][6] = Type_de_case.Rail_vertical;
	plateau.cases[11][7] = Type_de_case.Rail_bas_vers_droite;

	plateau.cases[0][7] = Type_de_case.Rail_horizontal;
	plateau.cases[1][7] = Type_de_case.Rail_horizontal;
	plateau.cases[2][7] = Type_de_case.Rail_horizontal;
	plateau.cases[3][7] = Type_de_case.Rail_horizontal;
	plateau.cases[4][7] = Type_de_case.Rail_horizontal;
	plateau.cases[5][7] = Type_de_case.Eau;
	plateau.cases[6][7] = Type_de_case.Rail_horizontal;
	plateau.cases[7][7] = Type_de_case.Rail_horizontal;

	for (let x = 22; x <= 27; x++) {
		for (let y = 2; y <= 5; y++) {
			plateau.cases[x][y] = Type_de_case.Eau;
		}
	}

	plateau.cases[22][8] = Type_de_case.Rail_horizontal;
	plateau.cases[23][8] = Type_de_case.Rail_horizontal;
	plateau.cases[24][8] = Type_de_case.Rail_horizontal;
	plateau.cases[25][8] = Type_de_case.Rail_horizontal;
	plateau.cases[26][8] = Type_de_case.Rail_bas_vers_droite;
	plateau.cases[27][8] = Type_de_case.Rail_horizontal;
	plateau.cases[28][8] = Type_de_case.Rail_horizontal;
	plateau.cases[29][8] = Type_de_case.Rail_horizontal;

	plateau.cases[3][10] = Type_de_case.Eau;
	plateau.cases[4][10] = Type_de_case.Eau;
	plateau.cases[4][11] = Type_de_case.Eau;
	plateau.cases[4][12] = Type_de_case.Eau;
	plateau.cases[4][13] = Type_de_case.Eau;
	plateau.cases[4][13] = Type_de_case.Eau;
	plateau.cases[5][10] = Type_de_case.Eau;

	plateau.cases[7][10] = Type_de_case.Eau;
	plateau.cases[7][11] = Type_de_case.Eau;
	plateau.cases[7][12] = Type_de_case.Eau;
	plateau.cases[7][13] = Type_de_case.Eau;
	plateau.cases[8][10] = Type_de_case.Eau;
	plateau.cases[9][10] = Type_de_case.Eau;
	plateau.cases[8][13] = Type_de_case.Eau;
	plateau.cases[9][13] = Type_de_case.Eau;

	plateau.cases[11][10] = Type_de_case.Eau;
	plateau.cases[11][11] = Type_de_case.Eau;
	plateau.cases[11][12] = Type_de_case.Eau;
	plateau.cases[11][13] = Type_de_case.Eau;
	plateau.cases[12][11] = Type_de_case.Eau;
	plateau.cases[13][10] = Type_de_case.Eau;
	plateau.cases[13][11] = Type_de_case.Eau;
	plateau.cases[13][12] = Type_de_case.Eau;
	plateau.cases[13][13] = Type_de_case.Eau;

	plateau.cases[15][10] = Type_de_case.Eau;
	plateau.cases[15][11] = Type_de_case.Eau;
	plateau.cases[15][12] = Type_de_case.Eau;
	plateau.cases[15][13] = Type_de_case.Eau;
	plateau.cases[16][10] = Type_de_case.Eau;
	plateau.cases[16][13] = Type_de_case.Eau;
	plateau.cases[17][10] = Type_de_case.Eau;
	plateau.cases[17][11] = Type_de_case.Eau;
	plateau.cases[17][12] = Type_de_case.Eau;
	plateau.cases[17][13] = Type_de_case.Eau;

	plateau.cases[19][10] = Type_de_case.Eau;
	plateau.cases[19][11] = Type_de_case.Eau;
	plateau.cases[19][12] = Type_de_case.Eau;
	plateau.cases[19][13] = Type_de_case.Eau;
	plateau.cases[20][13] = Type_de_case.Eau;
	plateau.cases[21][10] = Type_de_case.Eau;
	plateau.cases[21][11] = Type_de_case.Eau;
	plateau.cases[21][12] = Type_de_case.Eau;
	plateau.cases[21][13] = Type_de_case.Eau;
}

/************************************************************/
// Fonction principale
/************************************************************/

function tchou() {
	console.log("Tchou, attention au départ !");
	contexte = document.getElementById('simulateur').getContext("2d");

	// Création du plateau
	Plateau_de_jeu = new Plateau();
	cree_plateau_initial(Plateau_de_jeu);
	// Dessine le plateau
	dessine_plateau(contexte, Plateau_de_jeu);
	// commencer à interagir avec le plateau
	interagir_avec_plateau();
}

/************************************************************/
// Programme principal
/************************************************************/
window.addEventListener("load", () => {
	// Appel à la fonction principale
	tchou();
});
