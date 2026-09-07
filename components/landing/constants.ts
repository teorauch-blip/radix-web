/**
 * Constantes compartidas entre el Server Component de la landing
 * (`app/propiedades-en-salta/page.tsx`) y su componente de cliente.
 *
 * Vive en su propio archivo —sin `'use client'`— a propósito. Cuando un Server
 * Component importa un valor que NO es un componente desde un módulo marcado
 * `'use client'`, Next no le entrega el valor: le entrega una referencia de
 * cliente. Acá eso significaba que `LANDING_MAX_RESULTADOS` llegaba al servidor
 * como un proxy, `.slice(0, proxy)` se evaluaba como `.slice(0, NaN)` y devolvía
 * un array vacío. Resultado: el ItemList del JSON-LD salía con
 * `numberOfItems: 0` mientras la grilla mostraba las seis tarjetas.
 *
 * Un módulo neutro lo importan los dos lados y cada uno recibe el número.
 */

/**
 * Techo de tarjetas de la landing. No es paginación: lo que sobra no se
 * renderiza (a diferencia de /propiedades, que lo oculta con `hidden` para no
 * dejar propiedades sin ningún link entrante). Acá no hace falta, porque el
 * botón "Ver todas las propiedades" lleva al listado donde sí están todas.
 */
export const LANDING_MAX_RESULTADOS = 6
