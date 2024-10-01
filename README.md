Este es un proyecto de [**React Native**](https://reactnative.dev), iniciado usando [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Comenzando

>**Nota**: Asegurate de tener las siguientes dependencies instaladas en tu computador local antes de proceder:
> * Java Development Kit (JDK) versión 17.
> * Configurar la variable de entorno `JAVA_HOME` en el computador local con la ubicación del JDK recién instalado.
>   ### For Windows
>   Crear la variable de entorno siguiendo [este tutorial en inglés.](https://medium.com/@hawkdive26/how-to-create-new-environment-variables-in-windows-11-575c66f21381)
>   ### For Mac
>   Crear la variable de entorno siguiendo estos pasos:  
>   1. Lanzar la app Terminal de macOS.
>   3. Validar la ruta del JDK recién instalado al ejecutar el comando:
>   ```bash
>   /usr/libexec/java_home -V
>   ```
>   4. Con resultado del comando anterior se debe extraer la URL que está al final de cada línea, por ejemplo, al encontrar una la línea como esta: 
`17.0.11 (arm64) "Oracle Corporation" - "Java SE 17.0.11" /Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home`, se debe extraer la ruta `/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home` para un uso posterior.
>   5. Editar archivo .zshrc usando el editor de texto nano. 
>   ```bash
>   nano ~./zshrc
>   ```
>   6. Al inicio del archivo separar unas lineas para agregar el siguiente contenido, donde se debe reemplazar la `<Ruta>` por la ruta extraída en el punto 4: `/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home`:
>   ```bash
>   #Java home para proyecto de grado
>   JAVA_HOME="<Ruta>"
>   PATH="${JAVA_HOME}/bin:${PATH}"
>   ```
>   7. Guardar los cambios al presionar `control`+`x`, luego la tecla `Y`, y luego la tecla `Enter`
>   8. Guardar los cambios para todas las sesiones.
>   ```bash
>   source ~./zshrc
>   ```
>   
> * Android Studio. [Ver aquí pasos de instalación.](https://developer.android.com/codelabs/basic-android-kotlin-compose-install-android-studio?hl=es-419#0)
> * Android Emulator. [Ver aquí pasos en inglés de cómo configurar el emulador de android.](https://medium.com/@abdalqader27.najjar/how-to-install-emulator-on-android-studio-95eb101e604b)
> * Configurar la variable de entorno `ANDROID_HOME` en el computador local con la ubicación del SDK de Android recién instalado.
>   ### For Windows
>   Crear la variable de entorno siguiendo [este tutorial en inglés.](https://medium.com/@hawkdive26/how-to-create-new-environment-variables-in-windows-11-575c66f21381)
>   ### For Mac
>   Crear la variable de entorno siguiendo estos pasos:  
>   1. Lanzar la app Terminal de macOS.
>   3. Validar la ruta de Android SDK recién instalado (Generalmente se encuentra en la ruta `/Users/<nombre de usuario del computador local>/Library/Android/sdk`).
>   4. Editar archivo .zshrc usando el editor de texto nano. 
>   ```bash
>   nano ~./zshrc
>   ```
>   5. Al inicio del archivo separar unas lineas para agregar el siguiente contenido, donde se debe reemplazar la `<Ruta>` por la ruta extraída en el punto 4: `/Users/<nombre de usuario del computador local>/Library/Android/sdk`:
>   ```bash
>   #Java home para proyecto de grado
>   ANDROID_HOME="<Ruta>"
>   PATH="$ANDROID_HOME/platform-tools:$PATH"
>   PATH="$ANDROID_HOME/tools:$PATH"
>   PATH="$ANDROID_HOME/tools/bin:$PATH"   
>   PATH="$ANDROID_HOME/emulator:$PATH"
>   ```
>   6. Guardar los cambios al presionar `control`+`x`, luego la tecla `Y`, y luego la tecla `Enter`
>   7. Guardar los cambios para todas las sesiones.
>   ```bash
>   source ~./zshrc
>   ```
>
> * Configurar el archivo `local.properties` que se encuentra en el directorio `android/` y cambiar el valor del atributo `sdk.dir` por la ruta del SDK Android extraída en el punto 5.
>
## Paso 1: Iniciar el servidor Metro

Primero, necesitarás iniciar **Metro**, que es el JavaScript _bundler_ que viene _con_ React Native.

Para iniciar Metro, ejecuta el siguiente comando desde el directorio _root_ del proyecto:

```bash
# usando npm
npm start

# O usando Yarn
yarn start
```

## Paso 2: Iniciar la aplicación

Primero deja que el servidor Metro Bundler se ejecute en su _propio_ terminal. Abre una _nueva_ terminal desde el directorio _root_ del proyecto. Ejecuta el siguiente comando para iniciar la aplicación en Android o iOS:

### For Android

```bash
# usando npm
npm run android

# O usando Yarn
yarn android
```

### For iOS

```bash
# usando npm
npm run ios

# O usando Yarn
yarn ios
```

Si todo está configurado _correctamente_, deberías ver la nueva app ejecutandose en  tu _Android Emulator_ o _iOS Simulator_ siempre que en breve hayas configurado tu emulator/simulator correctamente.

Esa es una manera para correr la aplicación — tu también la puedes correr directamente desde adentro de Android Studio y Xcode respectivamente.

### Generación de APK

### Cómo usar el APK

### Estructura de directorios
/src
  /components
    /Header
      ├── AuthHeader.tsx        # Header para pantallas de autenticación (login, registro, confirmación de correo)
      ├── MainHeader.tsx        # Header para pantallas post-login
      └── Header.styles.tsx     # Estilos compartidos entre headers (si aplican)
  /screens
    /Auth                      # Pantallas de autenticación
      ├── LoginScreen.tsx
      ├── RegisterScreen.tsx
      ├── EmailConfirmationScreen.tsx
    /Main                      # Pantallas post-login
      ├── HomeScreen.tsx
      ├── ProfileScreen.tsx
      ├── SettingsScreen.tsx
  /navigation
    ├── AuthNavigator.tsx        # Navegación para login, registro y confirmación de correo
    ├── MainNavigator.tsx        # Navegación para la aplicación después de loguearse
    └── RootNavigator.tsx        # Contiene la lógica para cambiar entre AuthNavigator y MainNavigator
  /context
    └── AuthContext.tsx          # Maneja el estado de autenticación del usuario
  /test
    ├── components              # Test unitarios para componentes
    ├── screens                 # Test unitarios para pantallas
    └── navigation              # Test de integración para la navegación
  Theme.tsx                     # Archivo de temas globales
App.tsx                         # Archivo principal de la aplicación

### Ahora qué?

- Si estás cuioso para aprender más sobre React Native, chequea este link [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

Si no puedes hacer que funcione, mira este link [Troubleshooting](https://reactnative.dev/docs/troubleshooting).

# Aprender más

Para aprender más sobre React Native, dale una mirada a los siguiente recursos:

- [React Native Website](https://reactnative.dev) - aprender más sobre React Native.
- [Comenzando](https://reactnative.dev/docs/environment-setup) - un **resumen** de React Native y como congifurar tu ambiente.
- [Aprender lo básico](https://reactnative.dev/docs/getting-started) - un **tour guiado** de las **bases** de React Native .
- [Blog](https://reactnative.dev/blog) - Leer lo más último de publicaciones oficiales de React Native.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - El Open Source; **repositorio** de GitHub para React Native.
