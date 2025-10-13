
# Notas de desarrollo

## TODO
- [ ] Implementar atajos de teclado
- [ ] Mejorar sistema de notificaciones con historial
- [ ] Implementar idiomas
- [ ] Añadir sistema de creación de reglas personalizadas de sustitución de patrones
- [ ] Crear ejecutable portable con electron u otros.

---

## Bugs conocidos
> [!Tip]
> Los IDs de referencia (REF: XXXXXX) son inluidos en el codigo bruto de determinados módulos para facilitar la búsqueda utilizando `grep` u otros métodos. Estas referencias a veces tambien serán incluidas en el sistema de debugging.

1. [**REF: 000s1**] En versión móvil había un problema al ajustar el tamaño de `.output-section`, el viewport se mueve en el recálculo. Se implementó `window.addEventListener('scroll', () => storageService.saveScrollPosition(window.scrollY));` como método provisional utilizando una nueva función de control de guardado para solucionar el offset acumulativo.

2. [**REF: 000ax1**] En versión móvil, cuando `#textInput` obtiene el foco y aparece el teclado, si el usuario hace scroll hacia arriba, `.input-section` se desplazaba hacia abajo junto con el contenido (hasta su posición original `bottom: 0`). Se implementó la función `handleClickOutside` en el manejador `keyboardHandler.js` para evitar esto de manera provisional.

3. [**REF: 000o1**] El ajuste de `.output-section` inicial para **sincronizar el tamaño** con `.sidebar` toma mucho tiempo debido al reflow y ralentiza la carga. Esto puede generar un cambio visible en el tamaño inicial de `.output-section`. *(Esto solo es visible en primera carga o con recarga limpia CTRL + F5)*. La consola puede mostrar un warning como `[Violation] Forced reflow while executing JavaScript took 119ms`.

4. [**REF: 000io1**] Se implementó la llamada especial a `adjustOutputHeight()` en los cambios de altura a traves de la llamada a `autoResizeTextarea()`, haciendo la visualización más limpia e interactiva en pantallas más pequeñas (**pantallas inferiores a 1024px**). Esta aplicación no es del todo robusta y tiene algún pequeño offset impreciso en redimensionamientos por el momento, que se revisará más adelante.

5. [**REF: 000n1**] El cálculo de la altura disponible para el contenedor de **notificaciones** no se calcula de manera totalmente precisa. Se ajustó provisionalmente con un tamaño seguro por defecto.

6. Hace falta añadir un evento de **redimensionamiento en la ventana** (`window.addEventListener('resize' ..`) y otro en el viewport que llame a `adjustOutputHeight()` sin crear conflicto con `keyboardHandler.js`. Puede que al implementar esta llamada, la sección se redimensione al cambiar el tamaño del viewport mostrando el teclado o en otro tipo de redimensiones interferentes o superpuestas de manera predeterminada.

7. Hay un problema **cuando el teclado está visible** relacionado con el manejo del **overflow** de los elementos flotantes en **dispositivos móviles** que bloquea el scroll de los elementos como `#textInput` y los `.symbol-grid`. Esto, además de bloquear el scroll de dichos elementos, crea la posibilidad de que el `.input-section` se pueda deslizar junto a la pagina en deslizamientos verticales. Este problema se debe a como los navagadores móviles manejan los elementos fijados, y cuando el teclado está visible, el navegador sigue considerando que `.input-section` se encuentra en `bottom: 0` sobre el viewport (debajo del teclado) aunque no lo esté (y el mismo navegador es el que lo reposiciona en `bottom: 0` sobre el viewport).

8. [**REF: 000ay1**] Cuando se muestra el teclado **en dispositivos móviles**, el `.symbol-picker` puede salir de la pantalla si `#textInput` está expandido.

9. **En dispositivos móviles** Cuando se añade un símbolo desde `.symbol-picker` y se enfoca `#textInput`, `KeyboardHandler` no actua y el scroll no se corrige.

10. Hay un pequeño problema de redimensionamiento de `.output-section` al escribir en el input principal (al redimensionar `#textInput`) que permite que al aumentar/disminuir el tamaño antes de que termine el último redimensionamiento, el último cambio no se aplique por que está procesando el último, y hay una regla de seguridad que bloquea estos comportamientos **REF: 000ot1**.

11. Hay un error en la disposición del texto de `.formatted-output` en **dispositivos móviles**, ocasionando que al utilizar símbolos compuestos como **`áéíóúüñÁÉÍÓÚÜÑ`**, estos no se muestren correctamente y se representen con "**⊠**". Esto no es crítico, dado que al copiar el elemento se mantiene intacto.
    
    **Soluciones descartadas:**
      - Se probó importando una fuente más compatible como `Segoe UI Emoji` de manera local.
      - Se implementó el siguiente css:
        ```css
        .formatted-output {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        @media (max-width: 768px) {
          .formatted-output {
            font-variant-ligatures: none;
            font-feature-settings: "kern" 1, "liga" 0;
          }
        }
        ```  



