#!/bin/bash

# Script para compilar AgendaApp en modo Release
# Uso: ./build-release.sh

echo "🚀 Iniciando compilación de AgendaApp en modo Release..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar que existe el keystore de release
if [ ! -f "android/app/release.keystore" ]; then
    echo "❌ Error: No se encontró el keystore de release"
    echo "💡 Ejecuta primero la configuración de keystore"
    exit 1
fi

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
cd android
./gradlew clean
cd ..

# Limpiar caché de React Native
echo "🧹 Limpiando caché de React Native..."
npx react-native start --reset-cache &
CACHE_PID=$!
sleep 5
kill $CACHE_PID 2>/dev/null

# Compilar en modo release
echo "🔨 Compilando aplicación en modo Release..."
cd android

# Cargar propiedades de release
if [ -f "app/release.properties" ]; then
    echo "📋 Cargando configuración de release..."
    source app/release.properties
    export RELEASE_STORE_FILE
    export RELEASE_KEY_ALIAS
    export RELEASE_STORE_PASSWORD
    export RELEASE_KEY_PASSWORD
fi

# Compilar APK de release
echo "📱 Generando APK de release..."
./gradlew assembleRelease

# Verificar que se generó el APK
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ APK de release generado exitosamente!"
    echo "📁 Ubicación: android/app/build/outputs/apk/release/app-release.apk"
    
    # Mostrar información del APK
    echo "📊 Información del APK:"
    ls -lh app/build/outputs/apk/release/app-release.apk
    
    # Copiar APK al directorio raíz para fácil acceso
    cp app/build/outputs/apk/release/app-release.apk ../AgendaApp-release.apk
    echo "📋 APK copiado a: AgendaApp-release.apk"
    
else
    echo "❌ Error: No se pudo generar el APK de release"
    exit 1
fi

cd ..

echo "🎉 ¡Compilación completada exitosamente!"
echo "📱 Tu APK de release está listo para distribución"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Probar el APK en un dispositivo físico"
echo "   2. Subir a Google Play Store (si es necesario)"
echo "   3. Distribuir a usuarios finales"
echo ""
echo "⚠️  Recuerda mantener seguro tu keystore de release!"
