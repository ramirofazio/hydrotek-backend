<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <h1 align="center">Hydrotek Backend</h1>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
npm install
```

## Running Docker (PostgreSQL)

First install [Docker](https://www.docker.com)

```bash
# build and run container
docker compose up
```

## Running the app

```bash
# development
npm run start
```
```
# watch mode
npm run start:dev
```
```
# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test
```
```
# e2e tests
npm run test:e2e
```
```
# test coverage
npm run test:cov
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

*Seguramente se agreguen más, pero estas son las que se generan a traves
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
1. en **product.module.ts** declaramos dentro del @Module la propiedad *exports*,
la cual debe tener como valor un array que contenga el service a exportar (
ej. [ProductService])
2. en **user.module.ts** declaramos dentro del @Module la propiedad *imports*,
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
este haya declarado en el *exports*


### 

