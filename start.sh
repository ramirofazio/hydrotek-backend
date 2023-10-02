#!/bin/sh

# Ejecuta las migraciones de Prisma
npm run migrate
npm run prisma-update

# Inicia tu aplicación
npm start