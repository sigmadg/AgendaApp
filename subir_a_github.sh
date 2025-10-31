#!/bin/bash

# Script para subir el repositorio a GitHub
# Autor: Asistente AI

echo "=========================================="
echo "  Subiendo repositorio a GitHub"
echo "=========================================="
echo ""

cd "$(dirname "$0")"

# Verificar si hay cambios pendientes
if [ -n "$(git status --porcelain)" ]; then
    echo "Agregando cambios pendientes..."
    git add -A
    git commit -m "Actualización del proyecto"
fi

# Verificar autenticación con GitHub CLI
if gh auth status &>/dev/null; then
    echo "✓ Autenticado con GitHub CLI"
    echo "Subiendo cambios..."
    git push -u origin main
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ ¡Repositorio subido exitosamente!"
    else
        echo "✗ Error al subir el repositorio"
        exit 1
    fi
else
    echo "No estás autenticado con GitHub CLI"
    echo ""
    echo "Para autenticarte, ejecuta:"
    echo "  gh auth login"
    echo ""
    echo "O si prefieres usar un token de acceso personal:"
    echo "  1. Ve a: https://github.com/settings/tokens"
    echo "  2. Genera un nuevo token (classic) con permisos 'repo'"
    echo "  3. Luego ejecuta:"
    echo "     git push -u origin main"
    echo "     (usuario: sigmadg, contraseña: el token)"
    exit 1
fi

