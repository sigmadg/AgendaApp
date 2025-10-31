# Mi Agenda - Aplicación de Tareas Diarias

Una aplicación móvil desarrollada con React Native para gestionar tareas diarias con un calendario integrado.

## Características

- 📅 **Calendario interactivo** - Navega entre fechas y ve tus tareas organizadas por día
- ✅ **Gestión de tareas** - Agrega, completa y elimina tareas fácilmente
- 💾 **Almacenamiento local** - Tus tareas se guardan automáticamente en el dispositivo
- 🎨 **Interfaz moderna** - Diseño limpio y fácil de usar
- 📱 **Multiplataforma** - Funciona en Android e iOS

## Compilar en Android Studio

### Prerrequisitos

1. **Android Studio** (última versión)
2. **Java Development Kit (JDK) 17**
3. **Android SDK** (API Level 33 o superior)
4. **Node.js** (versión 16 o superior)
5. **npm** o **yarn**

### Pasos para compilar

#### 1. Configurar el entorno

```bash
# Navegar al directorio del proyecto
cd /home/sigmadg/Documentos/AgendaApp

# Instalar dependencias
npm install

# Para iOS (solo en macOS)
cd ios && pod install && cd ..
```

#### 2. Configurar Android Studio

1. **Abrir Android Studio**
2. **File → Open** y seleccionar la carpeta `/home/sigmadg/Documentos/AgendaApp/android`
3. **Esperar** a que Android Studio sincronice el proyecto
4. **Configurar el SDK** si es necesario:
   - File → Project Structure → SDK Location
   - Verificar que Android SDK esté configurado correctamente

#### 3. Configurar el dispositivo/emulador

**Opción A: Emulador Android**
1. En Android Studio: **Tools → AVD Manager**
2. **Create Virtual Device**
3. Seleccionar un dispositivo (ej: Pixel 6)
4. Descargar una imagen del sistema (API 33 o superior)
5. **Start** el emulador

**Opción B: Dispositivo físico**
1. Habilitar **Opciones de desarrollador** en tu Android
2. Activar **Depuración USB**
3. Conectar el dispositivo por USB
4. Autorizar la depuración cuando aparezca el diálogo

#### 4. Compilar y ejecutar

**Método 1: Desde la terminal**
```bash
# Ejecutar en Android
npx react-native run-android

# Ejecutar en iOS (solo en macOS)
npx react-native run-ios
```

**Método 2: Desde Android Studio**
1. **Seleccionar** el dispositivo/emulador en la barra superior
2. **Click** en el botón **Run** (▶️) o presionar **Shift + F10**
3. **Esperar** a que compile e instale la aplicación

#### 5. Generar APK

**APK de Debug:**
```bash
cd android
./gradlew assembleDebug
```
El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

**APK de Release:**
```bash
cd android
./gradlew assembleRelease
```
El APK se generará en: `android/app/build/outputs/apk/release/app-release.apk`

### Solución de problemas comunes

#### Error: "SDK location not found"
```bash
# Crear archivo local.properties en android/
echo "sdk.dir=/path/to/your/android/sdk" > android/local.properties
```

#### Error: "Metro bundler not found"
```bash
# Iniciar Metro bundler en una terminal separada
npx react-native start
```

#### Error: "Device not found"
- Verificar que el dispositivo esté conectado: `adb devices`
- Reiniciar el servidor ADB: `adb kill-server && adb start-server`

#### Error: "Build failed"
```bash
# Limpiar el proyecto
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Estructura del proyecto

```
AgendaApp/
├── android/                 # Proyecto Android nativo
│   ├── app/
│   │   ├── build.gradle     # Configuración de la app
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── java/com/agendaapp/
│   └── build.gradle         # Configuración del proyecto
├── ios/                     # Proyecto iOS nativo
├── src/
│   ├── components/          # Componentes React Native
│   │   ├── CalendarView.js
│   │   ├── TaskList.js
│   │   ├── TaskItem.js
│   │   └── AddTaskModal.js
│   └── utils/
│       └── storage.js       # Almacenamiento local
├── App.tsx                  # Componente principal
├── package.json
└── README.md
```

### Comandos útiles

```bash
# Limpiar caché
npx react-native start --reset-cache

# Ver logs de Android
npx react-native log-android

# Ver logs de iOS
npx react-native log-ios

# Verificar dispositivos conectados
adb devices

# Instalar APK manualmente
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Personalización

#### Cambiar el nombre de la aplicación
1. Editar `android/app/src/main/res/values/strings.xml`
2. Cambiar el valor de `app_name`

#### Cambiar el ícono de la aplicación
1. Reemplazar los archivos en `android/app/src/main/res/mipmap-*/`
2. Usar Android Asset Studio para generar iconos

#### Cambiar el package name
1. Editar `android/app/build.gradle` → `applicationId`
2. Renombrar carpetas en `android/app/src/main/java/`
3. Actualizar `AndroidManifest.xml`

### Tecnologías utilizadas

- **React Native 0.82.0** - Framework para desarrollo móvil
- **React Native Calendars** - Componente de calendario
- **AsyncStorage** - Almacenamiento local de datos
- **React Native Vector Icons** - Iconografía
- **React Native Safe Area Context** - Manejo de áreas seguras

---

¡Tu aplicación de agenda está lista para compilar en Android Studio! 🎉