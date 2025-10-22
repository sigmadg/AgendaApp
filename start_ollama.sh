#!/bin/bash
# Script para iniciar Ollama con configuración de red pública

# Matar procesos existentes de Ollama
pkill -f ollama 2>/dev/null || true

# Esperar un momento
sleep 2

# Iniciar Ollama escuchando en todas las interfaces
export OLLAMA_HOST=0.0.0.0:11434
ollama serve &

# Esperar a que inicie
sleep 3

# Verificar que está funcionando
echo "Verificando que Ollama está funcionando..."
curl -s http://localhost:11434/api/tags > /dev/null && echo "✅ Ollama está funcionando correctamente" || echo "❌ Error al iniciar Ollama"

# Mostrar información de red
echo "Ollama está escuchando en:"
netstat -tlnp | grep 11434 || echo "No se puede verificar el puerto (requiere permisos de administrador)"