#? Imagen base de PostgreSQL
FROM postgres:latest
#? Variables de entorno para configurar la base de datos
ENV POSTGRES_DB=hydrotek-db
ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=root
#? Expone el puerto 5432 para la comunicación con la base de datos
EXPOSE 5432

#* ACA ESTAN LAS CREDENCIALES DE LA DB MONTADA EN DOCKER
#*
#! COMANDOS:
#*
#! CREAR IMAGEN DB:
#*
#todo --> docker build -t hydrotek-db .
#*
#! CREAR CONTENEDOR DB:
#*
#todo --> docker run -d --name hydrotek-db -p 5432:5432 hydrotek-db
#
#?  -d = detached (para que no te tire todo el log)
#?  -p Mapea puertos del contenedor a tu maquina (tuMaquina:elContenedor)