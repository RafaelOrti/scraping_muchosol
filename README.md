# API dailyTrends

Se pide realizar un API (DailyTrends) que exponga un feed de noticias. Este feed es un
agregador de noticias de diferentes perió dicos. DailyTrends es un perió dico que une las
portadas de los periódicos nú mero uno.
Cuando un usuario abre DailyTrends, se encuentra con las 5 noticias de portada de El País y
El Mundo del día en el que lo abre, además se pueden añadir noticias a mano desde el API.

Se ha creado un workspace con todas las herramientas necesarias para trabaajr, en el siguiente repo: https://github.com/RafaelOrti/scrapping_muchosol_workspace

POR FALTA DE TIEMPO, NO SE HA TERMINADO DE IMPLEMENTAR EL RPC, TESTING Y SUBIDA AWS ELASTICSEARCH BEANSTALK

## Instrucciones

- `git clone https://github.com/RafaelOrti/scraping_muchosol.git`
- `cp .env.example .env`
- `npm install` 
- `npm run start` 

## Endpoint Swagger

- `/api-docs` contiene una vista con la que podemos probar los endpoints CRUD

## Scripts

- `start`: Inicia la aplicación en modo production
- `dev`: Inicia la aplicación en modo development
- `build`: Compila el código TypeScript
- `test`: Ejecuta las pruebas de testing
- `lint`: Realiza la verificación de estilo con ESLint
- `lint:fix`: Corrige automáticamente los problemas de estilo

## Arquitectura


![Screenshot from 2024-02-25 20-30-16](https://github.com/RafaelOrti/scraping_muchosol/assets/45425367/e51eaf6a-9692-4186-8537-28cc723b7b6a)


![Screenshot from 2024-02-25 20-46-24](https://github.com/RafaelOrti/scraping_muchosol/assets/45425367/15a09cf1-fcf4-46ad-ae21-a3426b6b184c)


### Capas de la aplicación

Capa de Presentación o Interfaz de Usuario (UI):
- Controllers: Manejan las solicitudes HTTP, interactúan con los servicios y devuelven respuestas HTTP.
- Routes: Define las rutas y los controladores asociados a cada ruta.

Capa de Lógica de Aplicación (BLL - Business Logic Layer):
- Services: Contienen la lógica de negocio de la aplicación. Interactúan con los controladores y los modelos para realizar operaciones específicas.

Capa de Acceso a Datos:
- Models: Representan la estructura de los datos y las operaciones relacionadas con la base de datos.
- Database: Contiene la configuración y las funciones para interactuar con la base de datos.

Capa de Infraestructura:
- Middlewares: Funciones que se ejecutan antes o después de las solicitudes HTTP para realizar tareas como autenticación, registro de solicitudes, etc...
- Utils: Contiene funciones y utilidades reutilizables en toda la aplicación, como funciones de ayuda, validación de datos, etc.
- Scripts: Scripts auxiliares o de utilidad que no están directamente relacionados con la lógica de la aplicación, como scripts de migración de datos, de inicialización, etc.
- Config: Configuraciones de la aplicación, como configuraciones de entorno, configuraciones de base de datos, etc.

Capa de Gestión de Estado:
- Interfaces: Definiciones de tipos de datos y estructuras de datos utilizadas en toda la aplicación.
- DTOS (Data Transfer Objects): Objetos utilizados para transferir datos entre las diferentes capas de la aplicación.

Capa de Servidor y Aplicación:
- Server: Configuración del servidor web y la aplicación Express.
- App: Punto de entrada de la aplicación donde se configuran y montan todas las partes de la aplicación.
