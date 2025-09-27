FROM node:20-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente y construir
COPY . .
RUN npm run build

# Exponer puerto 3000
EXPOSE 3000

# Servir la aplicación construida
CMD ["serve", "-s", "dist", "-l", "3000"]
