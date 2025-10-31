#!/bin/bash

# Script para iniciar ngrok para Ollama
echo "🚀 Iniciando ngrok para Ollama..."

# Verificar que Ollama esté corriendo
if ! pgrep -f "ollama serve" > /dev/null; then
    echo "⚠️  Ollama no está corriendo. Iniciando Ollama..."
    OLLAMA_HOST=0.0.0.0:11434 ollama serve &
    sleep 3
fi

# Verificar que Ollama esté escuchando en el puerto 11434
if ! netstat -tuln | grep -q ":11434"; then
    echo "❌ Ollama no está escuchando en el puerto 11434"
    echo "Intentando iniciar Ollama..."
    OLLAMA_HOST=0.0.0.0:11434 ollama serve &
    sleep 5
fi

# Iniciar ngrok para el puerto 11434
echo "🌐 Iniciando túnel ngrok para Ollama en puerto 11434..."
ngrok http 11434

echo "✅ ngrok iniciado para Ollama"
echo "📋 URL pública disponible en la consola de ngrok"