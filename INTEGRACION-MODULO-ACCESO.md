# Integración del módulo de acceso de usuarios

## ¿Qué se integró?

- Inicio de sesión con validación simulada.
- Identificación de recepción (`admin`) y usuarios del gimnasio (`usuario`).
- Redirección protegida a `/recepcion` o `/usuario`.
- Portal personal con consulta de datos, membresía, aforo e historial.
- Cierre de sesión manual y cierre por inactividad.

## Datos compartidos

El módulo de acceso consulta los mismos datos que los módulos existentes:

- `usuariosGym`: personas registradas, correo, contraseña de demostración, estado y sesión activa.
- `historialAccesos`: movimientos de entrada y salida registrados por recepción.

El módulo no mantiene listas independientes de usuarios, historial ni aforo.

## Cuentas de prueba

| Tipo | Correo | Contraseña |
|---|---|---|
| Recepción | `admin@gymassistant.com` | `123456` |
| Carlos Pérez (estudiante) | `c.perez001@pascualbravo.edu.co` | `gym123` |
| Laura Gómez (estudiante) | `l.gomez002@pascualbravo.edu.co` | `gym123` |
| Andrés Rodríguez (administrativo) | `a.rodriguez003@pascualbravo.edu.co` | `gym123` |

Las personas nuevas deben registrarse desde Gestión de personas, incluyendo correo institucional y contraseña inicial.

## Cómo ejecutar

En la carpeta raíz del proyecto:

```bash
npm install
npm run dev
```

Abre la dirección local que indique Vite. La aplicación inicia en la pantalla de acceso.

Para validar la compilación:

```bash
npm run build
```

## Flujo recomendado de prueba

1. Inicia sesión como recepción.
2. En Gestión de personas, registra una persona con correo institucional y contraseña inicial.
3. Registra una entrada para esa persona desde Registro de accesos.
4. Cierra sesión.
5. Inicia sesión con el correo y contraseña de la persona.
6. Consulta Mis ingresos y verifica que aparezca el movimiento registrado por recepción.
7. Consulta Aforo y verifica que se actualice con las sesiones activas.
8. Cierra sesión y comprueba que las rutas protegidas regresen al inicio de sesión.

## Nota sobre seguridad

La autenticación y las contraseñas son simuladas y se almacenan en `localStorage` para fines académicos. No es un mecanismo seguro para producción. En una siguiente etapa deben trasladarse al backend y almacenarse contraseñas con hash, validación del lado del servidor y sesiones seguras.
