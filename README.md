# Universidad Aurelius - Web & Intranet Interactiva (web01)

Este proyecto consiste en un sitio web universitario de alto prestigio institucional combinando la estética y sobriedad de las universidades anglosajonas más destacadas (como Harvard, MIT, Stanford, Oxford) con la arquitectura estructural y organizativa de la **Universidad de León** (www.unileon.es). 

Además, incorpora una **Intranet de Servicios** completamente interactiva que simula la gestión diaria de alumnos y profesores a través de almacenamiento local persistente.

---

## 📸 Captura y Estética
El diseño utiliza una paleta de colores institucional basada en **Borgoña Imperial** (#7A1C1C) y **Oro Viejo Académico** (#D4AF37), combinando tipografías de serif elegantes para los titulares (*Playfair Display*) con fuentes sans-serif muy legibles para el contenido de lectura (*Plus Jakarta Sans*). Las imágenes que ilustran el campus y las dependencias han sido generadas mediante inteligencia artificial específicamente para este proyecto.

---

## 🛠️ Pila Tecnológica
El proyecto se ha construido bajo la filosofía de máxima ligereza, velocidad de carga y portabilidad:
*   **Estructura:** HTML5 semántico.
*   **Estilo:** Vanilla CSS (sin frameworks, con un sistema modular y responsivo).
*   **Lógica:** Vanilla JavaScript (ES6+), sin dependencias pesadas.
*   **Iconografía:** FontAwesome (vía CDN) y gráficos vectoriales nativos (SVG).

---

## 🌟 Características Principales

### 1. Portal Público (`index.html`)
*   **Megamenús Adaptativos:** Menús de navegación detallados para las secciones de *Universidad*, *Estudios* e *Investigación*.
*   **Animación de Cifras:** Contadores de rendimiento y estadísticas institucionales que se animan de forma fluida cuando aparecen en pantalla mediante `IntersectionObserver`.
*   **Sección de Actualidad:** Un tablón de anuncios asimétrico y dinámico que muestra las últimas noticias de la universidad y los eventos de la agenda cultural.
*   **Diseño Responsivo:** Adaptado al 100% para pantallas móviles, tabletas y ordenadores de escritorio.

### 2. Intranet Universitaria (`intranet.html`)
Un portal interno de servicios y secretaría virtual que se comporta como una aplicación de tipo SaaS educativo:
*   **Autenticación Simulada:** Pantalla de Login con validación y manejo de errores.
*   **Base de Datos en Navegador:** Utiliza `localStorage` para persistir los cambios entre perfiles y recargas de página.
*   **Expediente del Alumno:** Tabla interactiva de asignaturas cursadas, créditos y sus correspondientes calificaciones cualitativas y numéricas.
*   **Calendario Semanal:** Horario interactivo por horas y aulas de clase.
*   **Secretaría Virtual (Trámites):** Formulario para redactar y presentar solicitudes oficiales. Al enviarse, se firma digitalmente en la base de datos, se añade al historial y permite la descarga inmediata del documento simulado (con un ID de firma único SHA256).
*   **Aula Virtual (Moodle):** Muestra los cursos activos con sus tareas pendientes. Permite "Entregar Trabajos" abriendo un modal interactivo con soporte drag-and-drop para simular la subida del archivo.
*   **Panel de Profesor:** Permite ver la lista de alumnos asignados, consultar su expediente y **modificar sus calificaciones** en tiempo real. Cualquier cambio que el profesor realice en el panel se verá reflejado inmediatamente en la sesión del estudiante.

---

## 🔐 Credenciales de Demostración
Para probar los flujos interactivos de la intranet, accede a [intranet.html](intranet.html) e inicia sesión con una de las siguientes cuentas:

### Perfil de Estudiante (Alejandro Sanz)
*   **Usuario:** `estudiante@aurelius.edu`
*   **Contraseña:** `12345`

### Perfil de Profesor (Dr. Roberto Gómez)
*   **Usuario:** `profesor@aurelius.edu`
*   **Contraseña:** `12345`

---

## 🚀 Cómo Ejecutar el Proyecto
Dado que el proyecto no requiere de servidores pesados ni bases de datos relacionales externas, puedes ejecutarlo de dos formas:
1.  **Ejecución Directa:** Abre el archivo [index.html](index.html) directamente con tu navegador favorito.
2.  **Servidor Local (Recomendado):** Para evitar bloqueos de seguridad del navegador sobre operaciones locales de archivos, puedes iniciarlo con extensiones como *Live Server* en VS Code o usando un servidor HTTP rápido de Python o Node.
    ```bash
    # Con Python 3
    python -m http.server 8000
    ```
    Y accede a `http://localhost:8000`.
