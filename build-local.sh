#!/bin/bash

echo "🚀 Construindo aplicação localmente..."

# Parar serviços existentes
echo "📦 Parando serviços existentes..."
pkill -f "node server.js" || true
pkill -f "npm start" || true

# Instalar dependências
echo "📦 Instalando dependências do backend..."
cd nahora-backend
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm install

echo "📦 Instalando dependências do frontend..."
cd ../nahora-merchant
npm install

# Iniciar serviços
echo "🚀 Iniciando backend..."
cd ../nahora-backend
npm start &
BACKEND_PID=$!

echo "🚀 Iniciando frontend..."
cd ../nahora-merchant
npm start &
FRONTEND_PID=$!

echo "✅ Serviços iniciados!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "🌐 Acesse: http://localhost:3000"
echo "🔑 Login: thais@gmail.com / teste1234"
echo ""
echo "Para parar os serviços, pressione Ctrl+C"

# Aguardar interrupção
trap "echo '🛑 Parando serviços...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
