### Instrucciones para actualizar la DB y poblarla de productos cuando esta en una nueva instancia:

Paso 1: Correr en Insomnia / Postman un POST a `localhost:3000/apidolar/manual`. Esto guarda la cotizacion del dolar en la DB que es necesaria para los productos.

Paso 2: Correr en Insomnia / Postman un GET a `localhost:3000/tfactura/token`. Esto blanquea una apikey en TFACTURA para hacer las consultas y traerse los productos.

Paso 3: Correr en Insomnia / Postman un POST a `localhost:3000/product/updateDB?full=true`. Esto actualiza los productos. En realidad esta ruta hace todo junto, pero mejor que quede documentado las rutas separadas.

-R
