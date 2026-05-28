# Resumen de Dockerización y Guía de Despliegue (web01)

Hemos creado la estructura necesaria para desplegar la aplicación web estática **Universidad Aurelius** utilizando un servidor Nginx altamente optimizado con SSL autofirmado, listo para ser ejecutado en tu VPS ARM de Oracle Cloud.

---

## Archivos Creados

1.  **[nginx.conf](file:///g:/Mi%20unidad/Antigravity_fpl/web01/nginx.conf):** Configuración de Nginx para producción.
    *   **Redirección HTTP a HTTPS:** Escucha en el puerto 80 y redirige a la versión segura.
    *   **Seguridad:** Incluye cabeceras de seguridad como `HSTS`, `X-Frame-Options` y `X-Content-Type-Options`.
    *   **Rendimiento:** Habilita el protocolo **HTTP/2** en el puerto 443 y activa la **compresión Gzip** para todos los recursos textuales.
    *   **Caché:** Reglas de expiración agresivas (1 año) para CSS y JS con cabecera `immutable`, y de 30 días para imágenes/recursos estáticos.
2.  **[Dockerfile](file:///g:/Mi%20unidad/Antigravity_fpl/web01/Dockerfile):** Definición de la imagen del contenedor.
    *   Utiliza la imagen ultra-ligera oficial `nginx:alpine` compatible con arquitectura **ARM64**.
    *   Instala temporalmente `openssl` y **genera automáticamente un certificado SSL autofirmado** con validez de 365 días para que el contenedor levante HTTPS de inmediato sin fallar por falta de claves.
    *   Copia los archivos estáticos y la configuración, limpiando archivos del entorno de desarrollo para reducir el tamaño final de la imagen.
3.  **[docker-compose.yml](file:///g:/Mi%20unidad/Antigravity_fpl/web01/docker-compose.yml):** Orquestación simple.
    *   Define el servicio `web01` apuntando al Dockerfile local.
    *   Mapea los puertos `80:80` y `443:443`.
    *   Configura la política de reinicio `unless-stopped` para que se inicie automáticamente tras reinicios del sistema.

---

## Guía Paso a Paso para el Despliegue en la VPS de Oracle Cloud

Para poner en marcha la aplicación en tu servidor Linux Ubuntu en Oracle Cloud, sigue estos pasos:

### Paso 1: Configurar la red en Oracle Cloud (OCI Console)
Por defecto, Oracle Cloud bloquea todo el tráfico entrante en los puertos 80 y 443 desde el panel de control de la nube:
1.  Entra a tu consola de **Oracle Cloud Infrastructure**.
2.  Ve a tu instancia de cómputo y haz clic en la **Subred virtual (VCN)** a la que pertenece.
3.  Selecciona la **Security List** (Lista de Seguridad) por defecto.
4.  Haz clic en **Add Ingress Rules** (Añadir reglas de entrada) y añade dos reglas:
    *   **Regla 1 (HTTP):** Source CIDR: `0.0.0.0/0`, IP Protocol: `TCP`, Destination Port Range: `80`.
    *   **Regla 2 (HTTPS):** Source CIDR: `0.0.0.0/0`, IP Protocol: `TCP`, Destination Port Range: `443`.

### Paso 2: Configurar el Firewall en la VPS (Ubuntu)
Las imágenes por defecto de Ubuntu en Oracle Cloud vienen con reglas de `iptables` muy estrictas que ignoran el estado de `ufw` y bloquean los puertos 80 y 443. Ejecuta estos comandos por SSH para abrirlos de forma persistente:

```bash
# Insertar reglas de aceptación en iptables
sudo iptables -I INPUT 6 -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -p tcp --dport 443 -j ACCEPT

# Guardar las reglas para que persistan tras reiniciar la VPS
sudo netfilter-persistent save
```

### Paso 3: Subir los archivos y Levantar la Aplicación
1.  Sube la carpeta del proyecto `web01` a tu VPS (vía Git, SFTP o SCP).
2.  Accede al directorio del proyecto en la VPS.
3.  Levanta el entorno con Docker Compose:
    ```bash
    docker compose up -d --build
    ```

### Paso 4: Validar el Funcionamiento
1.  Abre un navegador y accede a tu sitio web usando la dirección IP pública de la VPS:
    *   `http://<IP_DE_TU_VPS>` (debería redirigirte automáticamente a `https://<IP_DE_TU_VPS>`).
2.  Dado que el certificado es autofirmado y no hay dominio, verás la advertencia **"La conexión no es privada"**. Haz clic en **Opciones avanzadas** y selecciona **Acceder a <IP> (no seguro)**.
3.  El sitio web cargará de forma normal y todo el tráfico estará encriptado.
