
# Usa a imagem base do Node.js
FROM node:20-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta 3001
EXPOSE 3001

# Define a variável de ambiente para forçar logs
ENV NODE_ENV=development

# Comando para iniciar a aplicação
CMD ["npm", "start"]
