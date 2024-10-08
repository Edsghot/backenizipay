# Embedded-PaymentFormD1-JavaScript
Este es un ejemplo practico con la pasarela de pago de Izipay utilizando el formulario de pago incrustado.  
Visite la documentación para más información aquí: [Documentación Izipay](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/javascript/quick_start_js.html)

## Diagrama de secuencia

![diagrama-de-secuencia](/screenshots/diagrama-de-secuencia.jpeg)

## Requisitos Previos
1- Tener nodejs version 12.0.0 en adelante.


## 1.- Descargar el archivo 
Descargar el proyecto .zip ingresado [aquí](https://github.com/izipay-pe/Embedded-PaymentFormD1-JavaScript/archive/refs/heads/main.zip) ó clonarlo con git.

```sh
git clone https://github.com/izipay-pe/Embedded-PaymentFormD1-JavaScript.git
``` 
## 2.- Obtener las credenciales
Ingresar al back office vendedor para poder obtener las crecenciales. Ingresar a CONFIGURACIÓN< TIENDA < CLAVES DE API REST [aquí](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/api/get_my_keys.html).  

![Credenciales](/screenshots/bo.png)

## 3.- Configurar las credenciales:
Obtener las credenciales de su Back Office Vendedor y copiarlas en las variales correspondientes en el archivo creado llamado: `keys.js` 

```sh
/* Username, password and endpoint used for server to server web-service calls */

//(En el Back Office) Copiar Usuario
    username = 'XXXXXXXX'

//(En el Back Office) Copiar Contraseña de test
    password = 'testpassword_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

//(En el Back Office) Copiar Contraseña de Nombre del servidor API REST
    endpoint = "https://api.micuentaweb.pe",


/* publicKey and used by the javascript client */
//(En el Back Office) Copiar Clave pública de test
    publickey = 'XXXXXXXX:testpublickey_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

/* SHA256 key */
//(En el Back Office) Clave HMAC-SHA-256 de test
    HMACSHA256 = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
``` 
## 4.-Configurar la respuesta del pago por IPN 
Configurar la URL de notificación al final del pago para que su servidor web esté al tanto de la información del estado de pago de la transacción. Vea la documentación para más información. Aquí [IPN](https://secure.micuentaweb.pe/doc/es-PE/form-payment/quick-start-guide/implementar-la-ipn.html) 

De forma predeterminada, no se notifica al sitio del comerciante en caso de abandono. Debe habilitar la regla de notificación correspondiente en su Back Office Vendedor.

Para configurar la notificación:

Entrar en Back Office Vendedor

a)Vaya al menú: Configuración > Reglas de notificación .

b)Haga clic derecho en URL de notificación de cancelación .

c)Seleccione Gestionar la regla .

d)En la sección Configuración general , llene el campo Dirección(es) de e-mail a notificar en caso de fallo .

e)Marque la casilla Reenvío automático en caso de fallo si desea autorizar a la plataforma a reenviar automáticamente la notificación hasta 4 veces en caso de fallo.

f)En la sección URL de notificación de la API REST , indique la URL de su página en los campos URL de destino de la IPN a la que se llamará en modo TEST y URL de destino de la IPN a la que se llamará en modo PRODUCTION .
Guarde los cambios.

g)Active la regla haciendo clic derecho en URL de notificación de cancelación y seleccionando Activar la regla .


![URL de notificacion](/screenshots/bo2.png)
# IPN
https://tudominio.com/ipn

## 5.- Ejecutar el proyecto
1- Instalación de los paquetes
```sh
npm install
```

2- Ejecutar el proyecto con el siguiente comando 
```sh
npm run dev
```
Luego abrir la siguiente url en su navegador web (Chrome, Mozilla, Safari, etc) con el puerto 3000: **http://localhost:3000/**.


![Pasarela de pago](/screenshots/app.png)

<!-- # API REST 
http://localhost:3000/api/checkout

http://localhost:3000/api/validate -->


# DEMO
https://izipay-nodejs-example.onrender.com/
