FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
# On lance Vite en mode host pour que Docker puisse exposer le port
CMD ["npm", "run", "dev", "--", "--host"]