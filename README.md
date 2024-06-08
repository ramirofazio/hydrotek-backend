# Hydrotek Backend

Hydrotek nació en 2020 para llenar un vacío en el mercado de hidroponía. Nos dimos cuenta de la falta tanto de productos como de recursos para la hidroponía en nuestro país y decidimos actuar. Desde entonces nos hemos destacado por nuestros productos innovadores, creados por personas que son apasionadas cultivadoras.

## Run Locally

Clone the project

```bash
  git clone https://github.com/ramirofazio/hydrotek-backend
```

Go to the project directory

```bash
  cd hydrotek-backend
```

Install dependencies

```bash
  npm install
```

#### Config the server:

- Add `docker-compose.yml` file to root.
- Add `.env` file to root.

Install hydrotek-backend with npm:

```bash
  npm install
  chmod +x ./start.dev.sh
  ./start.dev.sh
```

## Conceptos Importantes

```
Pipes: permiten validar información simple de un Param.
Ej: ParseUUIDPipe permite validar que el param sea un UUID valido.

{
	"message": "Validation failed (uuid is expected)",
	"error": "Bad Request",
	"statusCode": 400
}
```

```
DTO's : permiten validar informacion compleja de un Body.
Se declaran en un archivo separado, y validan cada una de las props.
Ej: valida con decorator IsEnum que la categoria sea valida.

{
	"message": [
		"category must be one of the following values: macetas, otros"
	],
	"error": "Bad Request",
	"statusCode": 400
}
```

```
class-transformer: los Decorators de esta libreria permiten
ocultar o modificar props de la información que se quiera retornar

export class ProductResponseDTO {
    constructor(partial : Partial<ProductResponseDTO>) {
        Object.assign(this,partial);
    }

    title: string;

    description: string;

    published: boolean;


    category: CategoryType;
    //excluye props de la info de respuesta
    @Exclude()
    id: string;
    @Exclude()
    createdAt: string;
    @Exclude()
    value: number;

    //expone props, customizandolas si es necesario
    @Expose({name: "amount"})
    transformAmount() {
        return this.value;
    }
}
```

## Creación de nuevos modulos

La arquitectura más usada en Nest consiste en carpetas separadas por entidad.
Cada una de estas carpetas posee, como minimo, los archivos

- [entidad].module.ts
- [entidad].controller.ts
- [entidad].service.ts

\*Seguramente se agreguen más, pero estas son las que se generan a traves
del comando nest

### Generacion de nuevo module

Es el primer comando a correr al iniciar
el trabajo con una nueva entidad. Esto genera a su vez una carpeta
con el nombre de la entidad, ademas de importar e incluir en la
declaracion 'imports' del archivo app.module.ts el nuevo modulo
generado

```
nest g module [entidad]
```

### Generacion de nuevo controller

```
nest g controller [entidad]
```

### Generacion de nuevo service

```
nest g service [entidad]
```

## Importaciones entre modulos

Situacion: Necesitamos utilizar el service 'product.service.ts' desde el service
'user.service.ts'
Los pasos a seguir son los siguientes:

1. en **product.module.ts** declaramos dentro del @Module la propiedad _exports_,
   la cual debe tener como valor un array que contenga el service a exportar (
   ej. [ProductService])
2. en **user.module.ts** declaramos dentro del @Module la propiedad _imports_,
   la cual debe tener como valor un array que contenga el modulo que posee el
   service que necesitamos (ej. [ProductModule])
3. En el **user.service.ts**, importamos normalmente el **product.service.ts** y
   lo declaramos dentro del constructor de la clase

```
constructor(private readonly [entidad]Service : EntidadService) {}
```

En resumen, la buena practica seria que la comunicacion se establezca
entre modulos, teniendo un modulo emisor que define que exporta, y un modulo
receptor que, al importar este modulo emisor, podra acceder solo a aquello que
este haya declarado en el _exports_

###

## Authors

- [@ramirofazio](https://www.github.com/ramirofazio)
- [@TomasPerez1](https://www.github.com/TomasPerez1)
- [@joseSantangelo](https://www.github.com/josesantangelo)

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
