# Módulo de Gestión de Personas – GymAssistant

## Archivos incluidos

- `src/App.jsx`: agrega la opción Gestión de personas al menú lateral y al inicio.
- `src/pages/GestionPersonas.jsx`: listado, búsqueda, filtros, resumen, edición y activación/desactivación.
- `src/components/FormularioUsuario.jsx`: formulario de registro y edición.
- `src/services/usuariosService.js`: operaciones de usuarios usando la misma clave `usuariosGym`.
- `src/data/usuariosPrueba.js`: añade campos de membresía a los datos iniciales de demostración.

## Integración en el proyecto existente

1. Haz una copia de seguridad o confirma que tu rama de recepción esté subida.
2. En tu repositorio local, crea una rama nueva desde tu rama actual:

   ```bash
   git switch feature/recepcionNataliaCardenas
   git pull
   git switch -c feature/gestion-personas
   ```

   Si tu rama tiene otro nombre, reemplázalo por el nombre real.

3. Descomprime este paquete en la raíz del proyecto, permitiendo reemplazar `src/App.jsx` y `src/data/usuariosPrueba.js` y agregar los demás archivos.
4. Instala dependencias si es necesario y ejecuta:

   ```bash
   npm install
   npm run dev
   ```

5. Prueba las operaciones y luego revisa los cambios:

   ```bash
   git status
   git diff
   ```

6. Cuando confirmes que todo funciona:

   ```bash
   git add src/App.jsx src/components/FormularioUsuario.jsx src/pages/GestionPersonas.jsx src/services/usuariosService.js src/data/usuariosPrueba.js
   git commit -m "Agregar módulo de gestión de personas"
   git push -u origin feature/gestion-personas
   ```

## Funcionalidades incluidas

- Registrar personas.
- Listar y buscar por nombre o documento.
- Filtrar por clasificación y estado.
- Editar información.
- Desactivar y reactivar usuarios (se conserva el registro).
- Clasificar estudiantes, profesores y administrativos.
- Consultar el estado de membresía y fecha de vencimiento cuando aplique.
- Persistir los cambios en `localStorage` con la clave `usuariosGym`, compartida con recepción.

## Consideraciones

- Es un frontend de demostración; no realiza peticiones al backend.
- La desactivación conserva el registro y cierra la sesión activa local del usuario.
- Para usuarios antiguos sin campos de membresía, la tabla muestra “Sin información”.
- El estado de membresía vencida se calcula a partir de la fecha de vencimiento.
- Los datos iniciales de `usuariosPrueba.js` son datos de demostración. Si el navegador ya tiene `usuariosGym` guardado, se seguirá utilizando ese contenido.
