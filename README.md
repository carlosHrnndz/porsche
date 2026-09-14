# Atelier · versión local revisada

Herramienta interna para preparar un taller independiente especializado en Porsche en Madrid, con objetivo de apertura en septiembre de 2028. Revisión de fuentes: 13 de septiembre de 2026.

## Abrir

Haz doble clic en `previsualizar.command`, dentro de esta carpeta. Mantén abierta la ventana mientras utilizas la aplicación. Para terminar, ciérrala o pulsa Control+C.

La dirección será [versión local](http://127.0.0.1:8767/index.html). El servidor solo acepta conexiones del propio ordenador. Requiere Python 3, ya disponible en el entorno revisado.

El simulador también carga sus datos al abrir `index.html` directamente: no depende de una descarga del catálogo ni de bibliotecas de internet. El previsualizador es preferible para guardar de forma consistente y para acceder al observatorio original. La nueva versión no instala un servicio de caché, no envía datos y no publica nada.

## Contenido

- La decisión: propuesta de arranque y comparación de uno o dos socios con idéntica demanda.
- Simulador: capacidad y aprendizaje, salarios, captación, inversión, deuda, caja, cuenta de resultados y pruebas adversas.
- Hoja de ruta: acciones desde septiembre de 2026 hasta diciembre de 2028; casillas de seguimiento y condiciones de apertura.
- Ubicación: municipios del archivo DGT, cinco competidores, tres alquileres y un traspaso con fuentes y límites.
- Taller y equipo: presupuesto editable, referencias comerciales, cantidades iniciales, IVA y financiación por partida.
- Fuentes: documentos oficiales, referencias de proveedores y supuestos del cálculo.

Los informes de investigación se encuentran en `research/mercado.md` y `research/tecnica.md`.

## Guardado y continuidad

Se guardan automáticamente los parámetros válidos y las tareas marcadas en este navegador. «Guardar escenario» crea una variante con nombre. «Exportar proyecto» descarga una copia JSON de configuración, escenarios y tareas; «Importar proyecto» la recupera. «Descargar meses CSV» exporta la proyección completa con deuda, IVA pendiente, impuesto pendiente y saldos comerciales.

Los archivos de la versión Gemini se conservan en `referencia/` como archivo histórico, con sus limitaciones identificadas. No se cambian ni se importan sus escenarios guardados en el navegador: las fórmulas y los supuestos son diferentes. Antes de cualquier publicación futura, conservar ambas carpetas y exportar los escenarios del navegador. La versión nueva utiliza almacenamiento separado.

## Interpretación

Todos los presupuestos son hipótesis editables para 2028. Los precios comerciales se muestran como referencias de 2026 y el presupuesto inicial de equipo aplica un 3% anual durante dos años. Las partidas sin cotización están identificadas como estimaciones; ese incremento no garantiza su precio futuro.

La aportación configurada debe ser capital que se pueda comprometer. Ni una indemnización aún incierta ni un préstamo supuesto están confirmados por el modelo. La reserva mínima es una meta de caja, no un gasto adicional. El capital necesario mantiene esa reserva con la deuda elegida, en el peor mes proyectado; no es una valoración de la empresa.

El objetivo de 2.000 € netos por socio usa una bolsa editable de coste empresarial, no un cálculo personalizado de nómina. La fiscalidad se simplifica y se explica en la aplicación. La provisión del 20% no afirma que ese sea el tipo legal aplicable; no se modelan pagos fraccionados. Revisar con gestoría antes de comprometer capital.

La financiación de equipos es un préstamo para comprar activos por su importe neto, no un leasing fiscal. La provisión de diagnosis Porsche se consume al inicio como gasto provisional, con licencias recurrentes estimadas aparte; deberá sustituirse por la oferta final sin duplicar gastos. El número de elevadores y su inversión se ajustan por separado y la interfaz lo advierte.

## Comprobaciones del motor

El motor independiente tiene pruebas de préstamos, carencia, facturación, IVA, impuestos, inversión, aprendizaje, capacidad, estacionalidad y ejecución sin red. Se ejecutan con Node: `node --test tests/model.test.js` desde esta carpeta.

## GitHub

Este proyecto se prepara para un repositorio privado llamado `porsche`. Subir el repositorio no activa una web pública ni GitHub Pages. Cuando se revise y se decida publicar en GitHub, se preparará una copia depurada: esta herramienta contiene escenarios de capital y remuneración y está planteada para uso privado. No hay credenciales ni datos bancarios en el código.
