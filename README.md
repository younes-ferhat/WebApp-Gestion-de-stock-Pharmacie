# 🏥 Pharmasol - Système de Gestion de Pharmacie Intelligent

Pharmasol est une application moderne de gestion de stock pour pharmacies, intégrant un **Assistant IA local** (basé sur Qwen 2.5) capable de répondre à des questions sur les stocks, les fournisseurs et les dates de péremption.

---

## 🚀 Fonctionnalités Clés
- **📦 Gestion de Stock** : Suivi en temps réel des produits et quantités.
- **🛡️ Sécurité & Auth** : Système de connexion sécurisé via Laravel Sanctum.
- **🤖 Assistant IA Local** : Chat intelligent qui analyse vos données (Ollama + Qwen).
- **🐳 Dockerisé** : Environnement prêt à l'emploi (PHP 8.2, Nginx, MySQL, Node.js).
- **🏎️ Mode Turbo** : Optimisation spécifique pour éviter les lenteurs de Docker sur Windows.

---

## 🛠️ Pré-requis
Avant de commencer, assurez-vous d'avoir installé :
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Lancer Docker avant l'installation).
- [Ollama](https://ollama.com/) (Pour faire tourner l'IA sur votre machine).
- [Git](https://git-scm.com/).

---

## 📥 1. Installation Initial (Première fois)

Pour installer le projet automatiquement, vous pouvez utiliser le script fourni ou suivre les étapes manuelles.

### Option A : Via le script automatique (Windows uniquement)
1. Clonez le dépôt : `git clone https://github.com/younes-ferhat/WebApp-Gestion-de
stock-Pharmacie.git`
2. Créez vos fichiers `.env` (Copiez `.env.example` en `.env` dans `/backend` et `/frontend`).
3. Double-cliquez sur : **`INSTALLATION_INITIALE.bat`**.

### Option B : Méthode manuelle
```bash
# 1. Lancer l'infrastructure
docker-compose up -d --build

# 2. Installer la base de données et les produits de test
docker exec pharmasol-api php artisan migrate:fresh --seed

# 3. Optimiser le cache pour Windows
docker exec pharmasol-api php artisan optimize
