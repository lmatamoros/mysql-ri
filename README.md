# Interfaz para operaciones en mysql

## Constructor

El constructor recibe un json con los datos para conexión a la base de datos.

Se compone de los siguientes elementos:

1. host: Host del servidor de base de datos al que se conectará.
2. user: Usuario con que se conectará a la base de datos.
3. password: Contraseña del usuarion con que se conectará.
4. database: Base de datos a la que se conectará.
5. multipleStatements: true/false.

Por ejemplo:

```javascript
{
    "host" : "localhost",
    "user" : "user",
    "password" : "password",
    "database" : "database",
    "multipleStatements" : true
}
```

## Invocador

Invoca un SP con base en los argumentos especificados.
