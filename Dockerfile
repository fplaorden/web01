# Imagen base oficial de Nginx ligera y multi-arquitectura (soporta ARM64 de forma nativa)
FROM nginx:alpine

# Instalar openssl para la generación del certificado SSL autofirmado
RUN apk add --no-cache openssl

# Crear el directorio para los certificados SSL
RUN mkdir -p /etc/nginx/ssl

# Generar clave privada y certificado autofirmado (válido por 365 días)
# Se definen parámetros básicos para el sujeto (CN=localhost)
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=ES/ST=Leon/L=Leon/O=Universidad Aurelius/OU=IT/CN=localhost"

# Desinstalar openssl para reducir el tamaño final de la imagen y mejorar la seguridad
RUN apk del openssl

# Eliminar los archivos por defecto que vienen en Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar el código estático de la aplicación
COPY . /usr/share/nginx/html/

# Eliminar archivos innecesarios de configuración de desarrollo del contenedor
RUN rm -f /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/docker-compose.yml \
    /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/README.md

# Reemplazar la configuración por defecto de Nginx con la nuestra optimizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puertos estándar HTTP (80) y HTTPS (443)
EXPOSE 80 443

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
