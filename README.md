# 📚 Bibliostack

> Ma bibliothèque personnelle — Suivi de lectures, notes et découvertes.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)

---

## 🌟 Aperçu

**Bibliostack** est une application web fullstack qui te permet de gérer ta collection de livres personnelle. Tu peux ajouter des livres, noter tes lectures, écrire tes notes personnelles et suivre tes statistiques de lecture.

---

## ✨ Fonctionnalités

- 🔐 **Authentification** — Inscription, connexion et déconnexion sécurisées
- 📖 **Gestion de livres** — Ajouter, modifier et supprimer des livres
- ⭐ **Notation** — Attribuer une note de 1 à 10 à chaque livre
- 📝 **Notes personnelles** — Écrire et consulter tes notes pour chaque livre
- 📊 **Statistiques** — Nombre de livres lus, note moyenne, notes écrites
- 🖼️ **Couvertures automatiques** — Récupération automatique via l'ISBN (Open Library)
- 📱 **Responsive** — Compatible mobile, tablette et desktop

---

## 🛠️ Technologies utilisées

| Côté | Technologies |
|------|-------------|
| Frontend | HTML, CSS, EJS, JavaScript, Axios |
| Backend | Node.js, Express.js |
| Base de données | PostgreSQL |
| Authentification | Passport.js, bcrypt, express-session |
| Autres | dotenv, body-parser |

---

## 🚀 Installation

### Prérequis

- Node.js v18+
- PostgreSQL

### Étapes

**1. Cloner le repo**
```bash
git clone https://github.com/ton-username/bibliostack.git
cd bibliostack
```

**2. Installer les dépendances**
```bash
npm install
```

**3. Configurer les variables d'environnement**

Crée un fichier `.env` à la racine :
```env
SESSION_SECRET=ton_secret_ici
PG_USER=ton_user_postgres
PG_HOST=localhost
PG_DATABASE=bibliostack
PG_PASSWORD=ton_mot_de_passe
PG_PORT=5432
```

**4. Créer la base de données**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100)
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  date_read DATE,
  isbn VARCHAR(20),
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes TEXT
);
```

**5. Lancer l'application**
```bash
node index.js
```

L'application tourne sur [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du projet

```
bibliostack/
├── public/
│   └── style.css
├── views/
│   ├── partials/
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── main.ejs
├── .env
├── .gitignore
├── index.js
└── package.json
```

---

## 🔒 Sécurité

- Mots de passe hashés avec **bcrypt**
- Sessions sécurisées avec **express-session**
- Protection des routes avec **Passport.js**
- Chaque utilisateur accède uniquement à ses propres données
- Variables sensibles dans `.env` (jamais pushées sur GitHub)

---

## 👤 Auteur

**ZAKI** — Projet fullstack personnel

---

## 📄 Licence

Ce projet est sous licence MIT.
