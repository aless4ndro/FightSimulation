class Personnage {
  constructor(nom) {
    this._nom = nom;
    this._vie = Math.max(20, Personnage.nombreAleatoire());
    this._attaque = Math.max(20, Personnage.nombreAleatoire());
    this._defense = Math.max(20, Personnage.nombreAleatoire());
    this._type = "";
    this._protection = Personnage.nombreAleatoire();

  }

  get nom() {
    return this._nom;
  }

  get vie() {
    return this._vie;
  }

  set vie(nouvelleVie) {
    if (nouvelleVie > 100) {
      this._vie = 100;
    } else {
      this._vie = nouvelleVie;
    }
  }

  get attaque() {
    return this._attaque;
  }

  set attaque(nouvelleAttaque) {
    if (nouvelleAttaque > 100) {
      this._attaque = 100;
    } else if (nouvelleAttaque < 20) {
      this._attaque = 20;
    } else {
      this._attaque = nouvelleAttaque;
    }
  }


  get defense() {
    return this._defense;
  }

  set defense(nouvelleDefense) {
    if (nouvelleDefense > 100) {
      this._defense = 100;
    } else if (nouvelleDefense < 20) {
      this._defense = 20;
    } else {
      this._defense = nouvelleDefense;
    }
  }


  get type() {
    return this._type;
  }

  set type(nouveauType) {
    const allowedTypes = ["CRS", "Gilet Jaune", "Citoyen"];
    if (allowedTypes.includes(nouveauType)) {
      this._type = nouveauType;
    } else {
      console.error(`Type "${nouveauType}" is not allowed.`);
    }
  }

  coupSpecial(cible) {
    console.log(this.nom + " utilise un coup spécial sur " + cible.nom)
  }

  peutUtiliserCoupSpecial() {
    // Cette méthode sera surchargée dans les sous-classes
    return false;
  }



  info() {
    console.log(this._nom + " (" + this._type + ") : Vie : " + this._vie + ", Attaque : " + this._attaque + ", Défense : " + this._defense);

  }

  attaque(cible) {
    if (this.peutUtiliserCoupSpecial()) {
      this.coupSpecial(cible);
    } else {
      let force_attaque = this._attaque - cible.defense - cible.protection;
      if (force_attaque > 0) {
        console.log(this._nom + " attaque " + cible.nom);
        cible.recevoirDegats(force_attaque);
        if (cible.vie <= 0) {
          console.log(cible.nom + " est mort");
        } else {
          console.log(cible.nom + " perd " + force_attaque + " points de vie (Vie restante : " + cible.vie + ")");
        }
      } else {
        console.log(this._nom + " (" + this._type + ") attaque " + cible.nom + " (" + cible.type + ")");
      }
    }
  }



  static nombreAleatoire() {
    return Math.floor(Math.random() * 10) + 1;
  }
}

let nbrJoueur = prompt("Combien de joueurs souhaitez-vous créer ?");
let joueur = [];

for (let i = 0; i < nbrJoueur; i++) {
  let nom = prompt("Saisir Nom :");
  let vie = Personnage.nombreAleatoire();
  let attaque = Personnage.nombreAleatoire();
  let defense = Personnage.nombreAleatoire();
  let perso = new Personnage(nom, vie, attaque, defense);
  joueur.push(perso);

  if (i === 0) {
    perso.type = "CRS";
  } else if (i === 1) {
    perso.type = "Gilet Jaune";
  } else {
    perso.type = "Citoyen";
  }

  perso.info();
}

// Sélectionnez un joueur aléatoire
let joueurAleatoire = joueur[Math.floor(Math.random() * joueur.length)];

function run() {
  if (nbrJoueur === 1) {
    console.log('\x1b[32m%s\x1b[0m', "Le gagnant est ", joueur[0].nom);
    return;
  }

  let premier_joueur = Math.floor(Math.random() * joueur.length);

  for (let i = 0; i < joueur.length && joueur.length > 1; i++) {
    let attaquant = joueur[(premier_joueur + i) % joueur.length];
    let defenseur = joueur[(premier_joueur + i + 1) % joueur.length];
    let force_attaque = Math.floor(Math.random() * 10) + 1;
    let force_defense = Math.floor(Math.random() * 10) + 1;

    if (force_attaque > force_defense) {
      console.log('\x1b[31m%s\x1b[0m', attaquant.nom, "attaque", defenseur.nom);
      console.log('\x1b[33m%s\x1b[0m', defenseur.nom, "perd un point", defenseur.vie -= 1);
      if (defenseur.vie <= 0) {
        console.log('\x1b[32m%s\x1b[0m', defenseur.nom, "a été éliminé");
        joueur.splice(joueur.indexOf(defenseur), 1);
        nbrJoueur--;
        premier_joueur = i % joueur.length;
      }
    } else {
      console.log('\x1b[31m%s\x1b[0m', attaquant.nom, "attaque", defenseur.nom);
      console.log('\x1b[36m%s\x1b[0m', defenseur.nom, "a bloqué l'attaque");
    }

  }
  run();
}

run();


//CRS========================================================================================

class CRS extends Personnage {
  constructor(nom) {
    super(nom);
    this._protection = Personnage.nombreAleatoire();
    this._attaque += 5;
    this._defense += 5;
    this._type = "CRS";
    this._coupSpecial = "Fumigène";
    this._coupSpecial2 = "Canon à eau";
  }

  attaqueSpeciale(gj) {
    this.attaque(gj);
    let chance = Math.floor(Math.random() * 10) + 1;
    if (chance > 5) {
      this.fumigene(gj);
    }
    if (chance < 5) {
      this.canonAEau(gj);
    } else {
      console.log(this._nom + " (" + this._type + ") attaque " + cible.nom + " (" + cible.type + ")");
    }
  }

  coupSpecial(gj) {
    this.fumigene(gj);
    this.canonAEau(gj);

    this.attaqueSpeciale(gj);
  }

  peutUtiliserCoupSpecial() {
    return this._vie > 10;
  }

  fumigene(gj) {
    console.log('\x1b[31m%s\x1b[0m', this._nom + " lance un fumigène");
    gj.vie -= 5;
  }


  canonAEau(gj) {
    console.log('\x1b[34m%s\x1b[0m', this._nom + " lance un canon à eau");
    gj.vie -= 10;
  }


  appliquerBonusMalus() {
    this._attaque += 5;
    this._defense += 5;
    this._vie -= 5;
  }

  recevoirDegats(force_attaque) {
    this._vie -= force_attaque;
    console.log(this._nom + " a reçu " + force_attaque + " points de dégâts (Vie restante : " + this._vie + ")");
  }

  get protection() {
    return this._protection;
  }

  set protection(nouvelleProtection) {
    this._protection = nouvelleProtection;
  }

}



//Partie 3 : classe Gilet Jaune

class GiletJaune extends Personnage {
  constructor(nom) {
    super(nom);
    this._protection = Personnage.nombreAleatoire();
    this._attaque += 5;
    this._defense += 5;
    this._type = "Gilet Jaune";
    this._coupSpecial = "caillasage";
    this._coupSpecial2 = "mouvement de grande résistance";
  }

  appliquerBonusMalus() {
    this._attaque += 5;
    this._defense += 5;
    this._vie -= 5;
  }

  recevoirDegats(force_attaque) {
    this._vie -= force_attaque;
    console.log(this._nom + " a reçu " + force_attaque + " points de dégâts (Vie restante : " + this._vie + ")");
  }


  get protection() {
    return this._protection;
  }

  set protection(nouvelleProtection) {
    this._protection = nouvelleProtection;
  }

  attaqueSpeciale(crs) {
    this.attaque(crs);
    let chance = Math.floor(Math.random() * 10) + 1;
    if (chance > 5) {
      this.caillasage();
    }
    if (chance < 5) {
      this.mouvementDeGrandeResistance(crs);
    } else {
      console.log(this._nom + " (" + this._type + ") attaque " + cible.nom + " (" + cible.type + ")");
    }
  }

  coupSpecial(crs) {
    this.caillasage(crs);
    this.mouvementDeGrandeResistance(crs);
    this.attaqueSpeciale(crs);
    crs.recevoirDegats(20);
  }


  peutUtiliserCoupSpecial() {
    return this._vie > 10;
  }



  caillasage(crs) {
    console.log('\x1b[31m%s\x1b[0m', this._nom + " lance un caillasage");
    crs.vie -= 5;
  }

  mouvementDeGrandeResistance(crs) {
    console.log('\x1b[34m%s\x1b[0m', this._nom + " lance un mouvement de grande résistance");
    crs.vie -= 10;
  }

}


//Match.js========================================================================================


/**les méthodes nécessaires pour ajouter des joueurs, vérifier si un nom de personnage est déjà pris, lancer un combat entre les joueurs, gérer les rounds, déterminer le gagnant et afficher ses informations. */
class Match {
  constructor() {
    this._joueur = [
      new CRS("CRS1"),
      new GiletJaune("GiletJaune1"),
    ];
    this._round = 1;
    this._winner = "";
    this._nextType = "CRS";
    this._typeCounts = { "CRS": 0, "Gilet Jaune": 0 };
  }

  get nextType() {
    return this._nextType;
  }

  set nextType(nouveauNextType) {
    this._nextType = nouveauNextType;
  }

  get joueur() {
    return this._joueur;
  }

  set joueur(nouveauJoueur) {
    this._joueur = nouveauJoueur;
  }

  get round() {
    return this._round;
  }

  set round(nouveauRound) {
    this._round = nouveauRound;
  }

  get winner() {
    return this._winner;
  }

  set winner(nouveauWinner) {
    this._winner = nouveauWinner;
  }

  verifieNomPersonnage(nom) {
    for (let i = 0; i < this._joueur.length; i++) {
      if (this._joueur[i].nom === nom) {
        return true;
      }
    }

    return false;
  }


  ajouterJoueur() {
    let perso;
    let currentType = this._nextType;
    let typeCount = this._joueur.filter(joueur => joueur.type === currentType).length;
    let nom = currentType + " " + (typeCount + 1);

    if (currentType === 'CRS') {
      perso = new CRS(nom);
      this._nextType = 'Gilet Jaune';
    } else {
      perso = new GiletJaune(nom);
      this._nextType = 'CRS';
    }
    this._joueur.push(perso);
  }


  run() {
    while (this._joueur.length > 1) {
      let premier_joueur = Math.floor(Math.random() * this._joueur.length);
      console.log("Round " + this._round);
      this._round++;
      for (let i = 0; i < this._joueur.length; i++) {
        let attaquant = this._joueur[(premier_joueur + i) % this._joueur.length];
        let defenseur = this._joueur[(premier_joueur + i + 1) % this._joueur.length];
        let force_attaque = Math.floor(Math.random() * 10) + 1;
        let force_defense = Math.floor(Math.random() * 10) + 1;

        if (attaquant.type !== defenseur.type) {
          if (attaquant.peutUtiliserCoupSpecial()) { // Vérifie si l'attaquant peut utiliser son coup spécial
            attaquant.coupSpecial(defenseur); // Utilise le coup spécial sur le défenseur
          } else {
            attaquant.attaquer(defenseur);
            if (force_attaque > force_defense) {
              console.log('\x1b[31m%s\x1b[0m', attaquant.nom, "attaque", defenseur.nom);
              console.log('\x1b[33m%s\x1b[0m', defenseur.nom, "perd un point", defenseur.vie -= 1);
              if (defenseur.vie <= 0) {
                console.log('\x1b[32m%s\x1b[0m', defenseur.nom, "a été éliminé");
                this._joueur.splice(this._joueur.indexOf(defenseur), 1);
                premier_joueur = i % this._joueur.length;
              }
            } else {
              console.log('\x1b[31m%s\x1b[0m', attaquant.nom, "attaque", defenseur.nom);
              console.log('\x1b[36m%s\x1b[0m', defenseur.nom, "a bloqué l'attaque");
            }
          }
        } else {
          console.log('\x1b[31m%s\x1b[0m', attaquant.nom, "attaque", defenseur.nom);
          console.log('\x1b[36m%s\x1b[0m', defenseur.nom, "a bloqué l'attaque");
        }
      }
    }

    console.log('\x1b[32m%s\x1b[0m', "Le gagnant est ", this._joueur[0].nom);
    this.win();
  }




  win() {
    console.log('\x1b[32m%s\x1b[0m', "Le gagnant est ", this._joueur[0].nom);
    this._joueur[0].info();


  }

  //créer un attribut nextType, et donner lui la valeur 'crs'

  NextType() {
    this.nextType = "crs";
  }
}





