# CHISANBOP AI

Aplicación web educativa que reconoce números representados con los dedos de ambas manos mediante la cámara y el modelo real **MediaPipe Hand Landmarker**.

## Ejecutar

```bash
npm install
npm run dev
```

Abre la URL HTTPS mostrada por Vite. El navegador debe tener permiso para usar la cámara; en el primer acceso puede ser necesario aceptar el certificado local. También se puede validar con `npm test` y generar producción con `npm run build`.

## Cómo funciona

La aplicación detecta hasta dos manos y sus 21 landmarks. Un analizador geométrico estima la extensión de cada dedo y una ventana temporal evita responder a fluctuaciones instantáneas. La mano izquierda representa decenas (su valor se multiplica por 10) y la derecha unidades: pulgar = 5 y cada dedo restante = 1. Así, `26 = (índice + medio en la izquierda) + (pulgar + índice en la derecha)`.

La imagen se muestra espejada para que resulte natural, pero la mano física se obtiene de la etiqueta `handedness` de MediaPipe. El modo desafío ofrece niveles 0–20, 0–50 y 0–99, puntuación, aciertos, racha implícita y precisión.

## Limitaciones

La calidad depende de la iluminación, el encuadre, el fondo y la orientación de las manos. El algoritmo está calibrado para gestos frontales con variaciones moderadas; no debe considerarse perfecto. El modelo se descarga desde Google Cloud y requiere conexión inicial. El procesamiento ocurre en el navegador y no se envía video a un servidor.

## Estructura

- `src/main.js`: interfaz y ciclo de cámara.
- `src/handDetector.js`, `camera.js`: MediaPipe y recursos de video.
- `src/fingerAnalyzer.js`, `chisanbop.js`: geometría y reglas matemáticas.
- `src/renderer.js`, `evaluator.js`: visualización y desafío.
- `tests/chisanbop.test.js`: pruebas independientes de cámara.

## Uso offline y PWA

El modelo `hand_landmarker.task` y los archivos WASM de MediaPipe están en `public/models/` y `public/mediapipe/wasm/`. El detector no usa CDN durante la ejecución. El Service Worker precarga la interfaz y guarda el modelo/WASM en caché runtime cuando se inicializan por primera vez.

Para preparar el modo offline:

1. Ejecuta `npm run build` y sirve `dist/` desde HTTP en `localhost` o HTTPS.
2. Abre la aplicación conectado a internet una vez.
3. Pulsa **Iniciar cámara** y espera a que aparezca `IA y cámara activas`.
4. Comprueba el indicador `IA local disponible`.
5. Desconecta internet y recarga la aplicación desde el mismo origen.

La cámara sigue requiriendo un contexto seguro: `localhost` funciona por HTTP; para instalarla en otro equipo o dominio usa HTTPS. Las puntuaciones finales se guardan en `localStorage` bajo `chisanbop.lastChallenge`.
