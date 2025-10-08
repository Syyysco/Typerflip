<div align="center">

  **IDIOMA**: Español  ·  [Inglés](README.md)
  
  <img src="/assets/img/banner-onpage.png" alt="Typerflip - Magic formatter for social platforms"><br>
  
  # TYPERFLIP
  Dale formato a tus ideas para redes sociales
  
  [![License](https://img.shields.io/badge/License-Restricted%20Personal%20Use-BE2642)](https://github.com/Syyysco/Typerflip/blob/main/LICENSE)
  [![Website](https://img.shields.io/website?url=https%3A%2F%2Fsyyysco.github.io%2FTyperflip%2F)](https://syyysco.github.io/Typerflip/)
  [![GitHub issues](https://img.shields.io/github/issues/Syyysco/Typerflip)](https://github.com/Syyysco/Typerflip/issues)
  [![GitHub last commit](https://img.shields.io/github/last-commit/Syyysco/Typerflip?colorB=319e8c)](https://github.com/Syyysco/Typerflip/commits)
  
  [Ver Demo](https://syyysco.github.io/Typerflip/)  ⊶  [Reportar Bug](https://github.com/Syyysco/Typerflip/issues)  ⊷  [Solicitar Feature](https://github.com/Syyysco/Typerflip/issues)
  
  <br>
  
  <img src="/assets/img/screenshots/pc-mobile-preview.png" alt="Typerflip website quick view"><br>
</div>

  > Typerflip llega para solucionar un problema actual en la mayoría de plataformas, que obliga a los usuarios a crear publicaciones, descripciones, biografías u otro tipo de elementos sin transmitir nada, sin personalidad, profesionalidad, y sobre todo, generando fricción entre el mensajero y el receptor. La idea es facilitar la comprensión del mensaje y evitar la pérdida de interés del usuario. Simple.
  <br>

## ÍNDICE DE CONTENIDO
- [Características clave](#características-clave)
- [Uso rápido](#uso-rápido)
- [Instalación local](#instalación-local)
  - [Método simple](#método-simple)
  - [Usando npm](#usando-npm)
- [Guía de formato](#guía-de-formato)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Información para desarrolladores](#información-para-desarrolladores)
  - [Idiomas del proyecto](#idiomas-del-proyecto)
  - [Corrección de errores y TODOs](#corrección-de-errores-y-todos)
- [Rendimiento](#rendimiento)
  - [Versión escritorio](#versión-escritorio)
  - [Versión móvil](#versión-móvil)
- [Paleta de colores](#paleta-de-colores)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
  
<br>

## CARACTERÍSTICAS CLAVE

- **Formato en tiempo real** - Visualiza los cambios mientras escribes
  > - Syntaxis similar a *Markdown*
  > - 8 Tipos de formato ([Ver](#guía-de-formato))
  > - Los cambios se reflejan al instante prácticamente.
- **Compatibilidad multiplataforma** - Verifica límites de caracteres para cada red social
  > - Twitter/X
  > - Linkedin
  > - Instagram
  > - Facebook
  > - Threads
  > - Discord
  > - Reddit
  > - Tiktok
  > - Youtube
  > - Mastodon
- **Guardado automático** - No pierdas nunca tu trabajo
- **Análisis de contenido** - Métricas útiles de control
  > - Compatibilidad general
  > - Párrafos
  > - Hashtags
  > - Menciones
  > - Emojis
  > - Tiempo de lectura
  > - URLs
- **Símbolos y emojis** - Acceso rápido a caracteres especiales
- **Sistema de plantillas** - Guarda y reutiliza tus formatos favoritos
  > - Plantillas predeterminadas para posts y biografías
  > - Sistema de creación y edición de plantillas personalizadas.

<br>

## USO RÁPIDO

1. **Escribe o pega** tu texto en el editor
2. Usa los **atajos de formato** ([Ver](#guía-de-formato))
4. Observa la **compatibilidad** con cada plataforma
5. **Copia**, **exporta** o **guarda** tu texto formateado

> En la siguiente comparación se puede apreciar la diferencia de una publicación corriente en *Linkedin* (izquierda) y la misma versión utilizando *Typerflip* (derecha).
<img src="/assets/img/screenshots/linkedin-preview.png" alt="Text comparison on Linkedin using Typerflip"><br>

<br>

## INSTALACIÓN LOCAL
> En cualquier tipo de ejecución en local, es necesario clonar el repositorio y estar situado en la carpeta del mismo:
> ```bash
> # Clona el repositorio y muevete a su ubicación
> git clone https://github.com/Syyysco/Typerflip.git && cd Typerflip
> ```
> Luego, puedes elegir los siguientes métodos:

### MÉTODO SIMPLE
```bash
# Levanta el servidor
python3 -m http.server 8080 --bind 0.0.0.0

# Abre el navegador en la URL local (consola) o introduce la URL en el navegador
chrome http://localhost:8080 # para chrome
edge http://localhost:8080   # para microsoft edge

```

### USANDO NPM
```bash
# Instala dependencias (no instalará nada en el sistema)
npm install

# Construir build y lanzar
npm run build
```

> [!Note]
> - Una vez creada la build con `npm run build` no es necesario volver a construirla para lanzar el servidor. Puedes lanzar el servidor ejecutando lo siguiente `npm run start`.
> - Es posible cambiar el puerto predeterminado, la apertura automática en el navegador, y otras configuraciones desde el archivo [`config/build.config.json`](config/build.config.json):
>   ```json
>   "server": {
>     "enabled": true,
>     "port": 8080
>   },
>   "autoOpenBrowser": true
>   ```

<br>

## GUÍA DE FORMATO
| Sintaxis                              | Resultado                          |
|---------------------------------------|------------------------------------|
| `**Texto**`                           | **Negrita**                        |
| `*Texto*`                             | *Cursiva*                          |
| `***Texto***`                         | ***Negrita cursiva***              |
| `1. Texto, 2. Texto...`               | Lista numerada (𝟭. )               |
| `- Texto`                             | Lista simple (• )                  |
| `+ Texto`                             | Lista destacada (● )               |
| `` `codigo` `` o ` ```bloque``` `     | Código / bloque de código (𝚖𝚘𝚗𝚘)   |
| `.. Texto`, `... Texto`, etc          | Sangría (tabulación)               |

<br>

## ESTRUCTURA DEL PROYECTO

```rb
typerflip/
├── assets/            # Recursos estáticos
│   ├── brand/         # Recursos de identidad
│   ├── fonts/         # Fuentes
├── css/               # Estilos modulares
│   ├── base/          # Estilos base
│   ├── components/    # Componentes
│   ├── layout/        # Contenedor
│   ├── responsive/    # Media queries
│   ├── utils/         # Utilidades
│   └── main.css/      # Importación de modulos
├── js/                # Lógica JavaScript
│   ├── components/    # Componentes Web
│   ├── config/        # Configuración
│   ├── data/          # Datos modulares
│   ├── lib/           # Librerías internas
│   ├── services/      # Servicios
│   ├── store/         # Variables dinámicas
│   ├── utils/         # Utilidades
│   └── app.js/        # Flujo principal
├── config/            # Configuración general
│   └── build.config.json # Configuración de la build para npm
├── build.js           # Punto de partida de la construcción con npm
├── package.json       # Modulos requeridos para npm
├── manifest.json      # Manifiesto
├── browserconfig.xml  # Tiles & PWA
├── sitemap.xml        # SEO
├── robots.txt         # Indicaciones de indexación
└── index.html         # Punto de entrada
```
> Los archivos que no aparecen listados son recursos auxiliares (imágenes, configuraciones específicas o scripts internos).

<br>

## INFORMACIÓN PARA DESARROLLADORES
### IDIOMAS DEL PROYECTO
> [!Important]
> La UI de la aplicación está hecha en español. Más abajo se adjuntan detalles concretos sobre el idioma de cada tipo de elemento del proyecto.

- **Idiomas disponibles en la documentación:** Inglés y Español (2)
- **Idioma principal de la web (Cadenas de texto, HTML lang, etc):** Español
- **Idioma de variables, funciones, metodos, etc (CSS, HTML, JS ..):** Inglés 
- **Idioma de comentarios:** Español
- **Idioma de JSDoc:** Inglés

### CORRECCIÓN DE ERRORES y TODOs
- **Notas de desarrollo:** El archivo [`DEVELOPMENT.md`](DEVELOPMENT.md) contiene los errores conocidos hasta ahora y tareas por hacer/ideas futuras.
- **Sistema de IDs/Referencias:** Los fragmentos problematicos, pendientes de solucionar, experimentales o provisionales (identificados) se comentaron en el código fuente, indicando una pequeña descripción, un ID/referencia y posteriormente añadiéndolo al documento [`DEVELOPMENT.md`](DEVELOPMENT.md) para su busqueda con utilidades como `grep`.
- **Modo debug disponible:** El archivo [`js/lib/debugSystem.js`](js/lib/debugSystem.js) se encarga de gestionar la mayoría de logs y proporcionar de una forma más completa la información de errores, advertencias, etc.
    - Las trazas/logs que se muestren en la consola por parte del sistema de debug contendrán información relevante, entre ella se mostrará la referencia del error. Lo que facilitará la búsqueda del mismo dentro del proyecto.
    - Es posible activarlo/configurarlo desde el archivo [`js/config/constants.js`](js/config/constants.js). El objeto `APP_CONFIG` contiene toda la configuración de la aplicación, y en él se encuentra la configuración del modo debug (deshabilitado por defecto):
        ```js
        DEBUG: {
          ENABLED: false,
          SHOW_TIMESTAMP: true,
          LOG_TO_CONSOLE: true,
          SHOW_STACK_TRACE: false
        },
        ```
    - El uso básico es el siguiente (tambien se encuentra comentado al final del archivo principal):
      ```js
      // Usando la función global
      debug('error', '001ac5', 'Database connection failed', { host: 'localhost', port: 5432 });
      debug('warning', '002bd7', 'API rate limit approaching', { current: 95, limit: 100 });
      debug('info', '003ce9', 'User authentication successful', { userId: 12345 });
      debug('success', '004df1', 'File upload completed', { filename: 'document.pdf', size: '2.3MB' });
      
      // Usando métodos específicos
      debugSystem.error('005ef3', 'Validation failed for user input', myObject);
      debugSystem.warning('006fg5', 'Memory usage high', { usage: '85%', threshold: '80%' });
      debugSystem.info('007gh7', 'Cache refreshed successfully');
      debugSystem.success('008hi9', 'Backup completed');
      
      // Utilidades
      console.log('Debug Stats:', debugSystem.getStats());
      debugSystem.clear(); // Limpiar logs
      debugSystem.disable(); // Desactivar debug
      ```
      > Los parámetros necesarios son:
      >  - **Tipo de error:** `error`, `warning`, `info`, `success`. En caso de dejar el campo vacío se tomará como base el tipo `info`.
      >  - **Referencia de traza:** Identificador único de la traza (importante asegurar que no existe ya). Por ejemplo: `005tr1`.
      >  - **Mensaje:** Texto que se mostrará en la traza (log) en la consola del navegador. Solo texto (no Object, HTMLElement, etc)
      >  - **Datos adicionales:** Información adicional revisable como *Object*, *HTMLElement*, etc.

<br>

## RENDIMIENTO
> En los análisis de rendimiento de *Lighthouse* salta a la vista un retardo en la primera carga de contenido, que acaba afectando al rendimiento en el balance general, y aunque no se transmita directamente en la sensación de uso, puede afectar a la correcta indexación y posicionamiento de la web. Esto está reflejado en las [notas de desarrollo](DEVELOPMENT.md) y es ocasionado en el ajuste inicial del layout. Esto se solucionará proximamente.

### VERSIÓN ESCRITORIO
| Métrica                | Puntuación |
|------------------------|------------|
| Rendimiento            | 82/100     |
| Accesibilidad          | 94/100     |
| Prácticas recomendadas | 100/100    |
| SEO                    | 100/100    |

<img src="/assets/img/screenshots/lighthouse-desktop.png" alt="Insights of Typerflip web app on desktop" align="center"><br>

### VERSIÓN MÓVIL
> En versiones móviles el redimiento se ve afectado en la primera carga al sumar los cálculos iniciales del layout (javascript) al mismo tiempo que se monitorean los cambios en el viewport intentando comprobar si es necesario aplicar cambios. Esto se solucionará proximamente.

| Métrica                | Puntuación |
|------------------------|------------|
| Rendimiento            | 59/100     |
| Accesibilidad          | 92/100     |
| Prácticas recomendadas | 100/100    |
| SEO                    | 100/100    |

<img src="/assets/img/screenshots/lighthouse-mobile.png" alt="Insights of Typerflip web app on mobile" align="center"><br>

<br>

## PALETA DE COLORES

| Color         | Hex       | Uso               |
|---------------|-----------|-------------------|
| Black         | `#000000` | Fondo principal   |
| Licorice      | `#1D0D12` | Acento principal  |
| Dark Gunmetal | `#1B212C` | Acento secundario |
| Ghost White   | `#FAFAFF` | Texto primario    |
| Independence  | `#4A5568` | Texto acentuado   |

<img src="/assets/img/screenshots/color-palette.png" alt="Color palette used on Typerflip" align="center"><br>

<br>

## CONTRIBUIR

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

> [!Note]
> Para cambios o nuevas funciones recuerda añadir indicaciones claras. En casos de funciones experimentales o errores varios es importante documentarlos siguiendo el sistema actual de referencias (tanto en el código fuente como en el archivo [`DEVELOPMENT.md`](DEVELOPMENT.md)).

<br>

## LICENCIA

Este proyecto está bajo la licencia de uso personal. Esta prohibe cualquier uso comercial, inclusion en proyectos externos y redistribución sin consentimiento expreso del autor. Ver [LICENCIA](LICENSE) para más detalles.


---

<br>

<div align="center">

  <img src="/assets/img/watermark.png" alt="Sysco logo" width="150"><br>

  Hecho con ♥ por [Sysco](https://github.com/Syyysco)

  <img src="/assets/img/profile_banner.png" alt="Sysco logo" width="50"><br>

</div>
