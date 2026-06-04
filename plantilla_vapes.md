## SECCIÓN 1 — Visión del producto

Drakarys Vape Store es la tienda en línea oficial de una vape shop física, donde los clientes pueden explorar y comprar fácilmente todos los productos disponibles, con información clara y detallada de cada artículo para tomar la mejor decisión de compra.

## SECCIÓN 2 — Usuarios y casos de uso

Los casos de uso principales del cliente serían:
    • Explorar el catálogo — navegar por categorías de productos (desechables, pods, líquidos, accesorios, etc.)
    • Buscar un producto específico — encontrar rápidamente un artículo por nombre, marca o características.
    • Ver detalle del producto — consultar imágenes, descripción, sabores disponibles, nicotina, precio y stock.
    • Agregar al carrito — seleccionar cantidad y variantes antes de comprar.
    • Realizar el pago — completar la compra de forma rápida y segura.
    • Consultar su pedido — revisar el estado y historial de sus compras.

## SECCIÓN 3 — Funcionalidades

**Input — Lo que el usuario hace**
    • El usuario puede buscar productos por nombre, marca o categoría. 
    • El usuario puede filtrar productos por tipo, sabor, nivel de nicotina y precio. 
    • El usuario puede seleccionar variantes de un producto (sabor, tamaño, nicotina). 
    • El usuario puede agregar productos al carrito y modificar cantidades. 
    • El usuario puede registrarse, iniciar y cerrar sesión. 
    • El usuario puede completar el proceso de pago con sus datos de envío. 
    • El usuario puede aplicar códigos de descuento. 
**Output — Lo que el sistema muestra**
    • El sistema muestra el catálogo completo de productos con imagen, nombre y precio. 
    • El sistema muestra la ficha detallada de cada producto con todas sus variantes y stock disponible. 
    • El sistema muestra el resumen del carrito actualizado en tiempo real. 
    • El sistema muestra la confirmación del pedido al finalizar la compra. 
    • El sistema muestra el historial de pedidos del usuario. 
    • El sistema muestra productos relacionados o recomendados en la ficha de producto. 
**Estados — Lo que el sistema gestiona**
    • El sistema permite marcar productos como disponible, agotado o próximamente. 
    • El sistema permite gestionar el stock y actualizar disponibilidad automáticamente. 
    • El sistema permite que el pedido tenga estados: pendiente, en preparación, enviado y entregado. 
    • El sistema permite que el carrito persista aunque el usuario cierre el navegador.

## SECCIÓN 4 — Flujos de usuario

**Flujo principal (todo va bien)**
    1. El usuario abre la página — ve la pantalla de inicio con el catálogo destacado, ofertas y categorías. 
    2. Explora o busca un producto — navega por categorías o usa el buscador para encontrar lo que quiere. 
    3. Abre la ficha del producto — revisa imágenes, descripción, variantes disponibles (sabor, nicotina) y precio. 
    4. Selecciona variantes y agrega al carrito — elige las opciones deseadas y confirma la cantidad. 
    5. Revisa el carrito — ve el resumen con productos, cantidades y total. 
    6. Inicia sesión o continúa como invitado — si ya tiene cuenta inicia sesión, si no puede registrarse o comprar sin cuenta. 
    7. Ingresa datos de envío — completa nombre, dirección y teléfono. 
    8. Selecciona método de pago — elige entre las opciones disponibles (tarjeta, transferencia, etc.). 
    9. Confirma el pedido — revisa el resumen final y presiona "Comprar". 
    10. El sistema procesa el pago — valida la transacción y descuenta el stock automáticamente. 
    11. Confirmación — el usuario ve una pantalla de éxito con el número de pedido y recibe un correo de confirmación. 
    12. Seguimiento — el usuario puede revisar el estado de su pedido desde su cuenta. 

**Flujo alternativo (algo falla)**


| Paso | Fallo posible | Qué hace el sistema |
| :---: | :--- | :--- |
| **3** | El producto está agotado | Muestra badge "Agotado" y deshabilita el botón de compra |
| **4** | La variante seleccionada no tiene stock | Avisa al usuario y sugiere una variante alternativa |
| **5** | El carrito está vacío al ir a pagar | Redirige al catálogo con un mensaje de aviso |
| **6** | Error al iniciar sesión | Muestra mensaje de error y opción de recuperar contraseña |
| **10** | El pago es rechazado | Notifica al usuario y le permite intentar con otro método de pago |
| **10** | Error de conexión durante el pago | El pedido queda en estado "pendiente" y se le avisa al usuario por correo |
| **11** | No llega el correo de confirmación | El usuario puede reenviar la confirmación desde su historial de pedidos |

## SECCIÓN 5 — Arquitectura

Para este proyecto, utilizaremos una arquitectura basada en tecnologías de alto rendimiento y escalabilidad, centrada en una solución unificada.
    • **Frontend:** Angular (Framework) con Ionic (UI components) para garantizar una experiencia responsiva y nativa tanto en web como en dispositivos móviles.
    • **Backend:** Supabase (Backend-as-a-Service), que permite gestionar toda la lógica de datos y autenticación sin necesidad de infraestructura de servidor propia.
    • **Base de datos:** PostgreSQL (gestionado a través de Supabase), centralizando la información de inventario, usuarios y ventas.
    • **Autenticación:** Supabase Auth para la gestión segura de perfiles de clientes y administradores.
    • **Hosting:** Netlify para el despliegue del frontend, asegurando tiempos de carga rápidos.
**Diagrama de flujo de datos:**
    1. Usuario (Cliente): Interactúa con la interfaz (Angular/Ionic) para buscar productos o realizar una compra.
    2. Solicitud de datos: El frontend envía una petición a la API de Supabase para obtener o guardar información en la base de datos (PostgreSQL).
    3. Procesamiento: Supabase valida la sesión del usuario (Autenticación) y ejecuta la consulta sobre la base de datos.
    4. Respuesta: La base de datos devuelve los productos o confirma la compra, y la interfaz (Angular) actualiza la vista para el usuario en tiempo real.

## SECCIÓN 6 — Requisitos no funcionales

Aquí los requisitos no funcionales de Drakarys Vape Store:

⚡ **Rendimiento**
    • Tiempo de carga inicial menor a 3 segundos en conexión móvil estándar. 
    • El catálogo debe renderizar en menos de 1.5 segundos tras una búsqueda o filtro. 
    • Soporte de hasta 500 usuarios simultáneos en una primera etapa (escalable según crecimiento de la tienda). 

🌐 **Idiomas**
    • Español como idioma principal (mercado boliviano). 
    • Arquitectura preparada para agregar inglés en el futuro sin reestructurar el código (i18n con Angular). 

📱 **Compatibilidad**
    • Diseño mobile-first: funciona correctamente en pantallas desde 320px de ancho. 
    • Compatible con los navegadores principales: Chrome, Firefox, Safari y Edge (últimas 2 versiones). 
    • Funcional en Android 8+ e iOS 13+ mediante Ionic. 

🔒 **Seguridad**
    • Autenticación gestionada por Supabase Auth (tokens JWT, sesiones seguras). 
    • Row Level Security (RLS) en PostgreSQL: cada usuario solo accede a sus propios datos. 
    • Comunicación cifrada mediante HTTPS en todos los endpoints. 
    • Los datos de pago no se almacenan en la base de datos propia; se delegan a la pasarela de pago. 

🛡️ **Disponibilidad y fiabilidad**
    • Disponibilidad objetivo del 99.5% mensual (respaldado por la infraestructura de Supabase y Netlify). 
    • Recuperación ante errores: si Supabase falla, el frontend muestra mensajes claros en lugar de pantallas en blanco. 

♿ **Accesibilidad**
    • Cumplimiento básico de WCAG 2.1 nivel AA: contraste de colores adecuado, textos alternativos en imágenes, navegación por teclado. 

🧩 **Mantenibilidad**
    • Código modular con componentes reutilizables en Angular/Ionic. 
    • Variables de entorno separadas para desarrollo, staging y producción. 
    • Documentación mínima del proyecto para facilitar incorporar nuevos desarrolladores. 

⚖️ **Restricciones legales**
    • Aviso de edad en el acceso a la tienda (los productos de vapeo están restringidos a mayores de edad según normativa boliviana). 
    • Política de privacidad visible conforme a la Ley N° 164 de Bolivia (Telecomunicaciones y TIC).
