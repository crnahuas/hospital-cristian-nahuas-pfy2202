# Integración del catálogo con REST

El frontend no importa los arreglos del catálogo. La secuencia es: componente React → `useResource` → `getResource` → `fetch` → MSW → respuesta HTTP JSON. Los datos del catálogo solo se importan desde los handlers del mock.

## Inicio de la aplicación

`main.jsx` importa el módulo del navegador dinámicamente y espera `worker.start()` antes de renderizar. Esto evita que una consulta inicial se adelante a la activación del Service Worker. Un fallo de registro presenta un aviso y un control de recarga.

El worker se sirve desde `public/mockServiceWorker.js` y se copia a `dist/` al compilar. Su URL usa `BASE_URL` para admitir subdirectorios. MSW está habilitado por defecto durante el desarrollo y al ejecutar la versión compilada.

## Consultas y respuestas

`getResource` construye una URL del mismo origen o de `VITE_API_URL`, envía una petición GET con `Accept: application/json`, comprueba `response.ok` y valida la estructura de los datos. Un arreglo vacío es una respuesta válida para listados, pero no para el detalle individual de un libro.

Los filtros se envían como parámetros de consulta. El mock verifica que exista la categoría y devuelve solo sus libros. Una categoría válida sin contenido devuelve `[]`; una categoría o un identificador inexistente devuelve 404.

## Estados y alternativas

El componente compartido `RequestState` muestra carga durante cada petición, incluso en una actualización manual. Una respuesta 404, 500 o un error de conexión presenta mensajes diferentes y opciones para reintentar o regresar al catálogo.

Al fallar una actualización, se conservan los datos anteriores del mismo recurso. Si se prueba un escenario de error, se puede usar como respaldo su consulta normal. La clave incluye los parámetros de categoría y el escenario: un resultado de Ficción nunca se usa como respuesta de Drama. Sin una consulta exitosa anterior no se inventan resultados.

## Caché y concurrencia

TanStack Query reutiliza una respuesta durante cinco minutos y mantiene las consultas inactivas en memoria hasta diez minutos. Consumidores simultáneos de la misma consulta comparten su estado. Al desmontar o cambiar de recurso, la señal de cancelación se pasa a `fetch`; las respuestas de una consulta anterior no se guardan bajo la clave de la nueva categoría.

Se deshabilitan las consultas automáticas al recuperar el foco y los reintentos automáticos, para que cada consulta se inicie mediante la navegación o una acción explícita. La navegación vuelve a consultar cuando el resultado está vencido. Actualizar fuerza una consulta, y Reintentar elimina el escenario de fallo antes de solicitar datos normales.

La caché vive en memoria durante la sesión de la aplicación. Recargar elimina ese respaldo. No es persistencia de servidor ni una implementación completa de uso sin conexión.

## Escenarios de prueba

`scenario` es un parámetro del mock usado por los selector de estados. Permite devolver 404, 500, fallo de red, demora o lista vacía. Los listados no mezclan los datos simulados con los de respuesta normal. La demora habitual es de 450 ms y la lenta de 2500 ms; en las pruebas de integración se elimina la demora habitual para mantenerlas rápidas.

Los tests usan los mismos handlers en `msw/node`. Playwright prueba el build con el Service Worker real, rutas con hash, navegación, errores y vistas adaptadas.
