/* 
   Universidad Aurelius - Lógica de la Intranet (Portal Interno)
*/

// --- DATOS MOCK INICIALES (MOCK DATABASE) ---
const DEFAULT_STUDENT_DATA = {
    email: "estudiante@aurelius.edu",
    name: "Alejandro Sanz Gómez",
    role: "Estudiante",
    degree: "Grado en Ingeniería Aeroespacial",
    id: "ALU-2024-879",
    average: "8.4",
    credits: "120 / 240 ECTS",
    grades: [
        { id: "MAT1", name: "Cálculo Infinitesimal", credits: 6, grade: "9.2", type: "Sobresaliente", status: "Aprobado" },
        { id: "MAT2", name: "Álgebra Lineal", credits: 6, grade: "8.0", type: "Notable", status: "Aprobado" },
        { id: "FIS1", name: "Física General I", credits: 6, grade: "7.5", type: "Notable", status: "Aprobado" },
        { id: "MEC1", name: "Mecánica Racional", credits: 6, grade: "9.8", type: "Sobresaliente", status: "Aprobado" },
        { id: "AER1", name: "Introducción a la Aerodinámica", credits: 6, grade: "4.5", type: "Suspenso", status: "Pendiente" },
        { id: "INF1", name: "Programación en Python", credits: 6, grade: "8.5", type: "Notable", status: "Aprobado" }
    ],
    tramites: [
        { id: "TRM-01", date: "15/02/2026", type: "Solicitud de Beca de Movilidad", status: "Aprobado", file: "beca_aprobada.pdf" },
        { id: "TRM-02", date: "10/04/2026", type: "Certificado Académico Oficial", status: "Completado", file: "certificado_oficial.pdf" }
    ],
    assignments: [
        { id: "ASG-01", subject: "Introducción a la Aerodinámica", name: "Práctica 3: Perfiles Alares NACA", deadline: "30/05/2026", status: "Pendiente" },
        { id: "ASG-02", subject: "Programación en Python", name: "Proyecto Final: Simulador Órbita Kepler", deadline: "05/06/2026", status: "Pendiente" },
        { id: "ASG-03", subject: "Mecánica Racional", name: "Resolución de Sistemas Holónomos", deadline: "12/05/2026", status: "Entregado" }
    ]
};

const DEFAULT_PROFESSOR_DATA = {
    email: "profesor@aurelius.edu",
    name: "Dr. Roberto Gómez Vega",
    role: "Profesor",
    department: "Departamento de Ingeniería Aeroespacial",
    id: "PROF-1998-342"
};

// Inicializar base de datos local en el navegador
if (!localStorage.getItem('student_db')) {
    localStorage.setItem('student_db', JSON.stringify(DEFAULT_STUDENT_DATA));
}
if (!localStorage.getItem('prof_db')) {
    localStorage.setItem('prof_db', JSON.stringify(DEFAULT_PROFESSOR_DATA));
}

// --- LOGICA DE CONTROL DE LA INTRANET ---
document.addEventListener('DOMContentLoaded', () => {
    checkActiveSession();
    initLoginForm();
    initTabNavigation();
    initModalControls();
    initTramitesForm();
});

/**
 * Verifica si hay una sesión activa y dibuja la interfaz correspondiente
 */
function checkActiveSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginScreen = document.getElementById('login-screen');
    const dashboardLayout = document.getElementById('dashboard-layout');

    if (currentUser) {
        // Ocultar login, mostrar dashboard
        loginScreen.style.display = 'none';
        dashboardLayout.style.display = 'grid';
        
        // Cargar perfiles y widgets
        renderProfile(currentUser);
        renderDashboardData(currentUser);
    } else {
        // Mostrar login, ocultar dashboard
        loginScreen.style.display = 'flex';
        dashboardLayout.style.display = 'none';
    }
}

/**
 * Procesa el envío del formulario de inicio de sesión
 */
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorAlert = document.getElementById('login-error-alert');
        
        if (errorAlert) errorAlert.style.display = 'none';

        // Comprobación de credenciales simulada
        if (email === "estudiante@aurelius.edu" && password === "12345") {
            const data = JSON.parse(localStorage.getItem('student_db'));
            localStorage.setItem('currentUser', JSON.stringify(data));
            checkActiveSession();
        } else if (email === "profesor@aurelius.edu" && password === "12345") {
            const data = JSON.parse(localStorage.getItem('prof_db'));
            localStorage.setItem('currentUser', JSON.stringify(data));
            checkActiveSession();
        } else {
            // Mostrar error
            if (errorAlert) {
                errorAlert.textContent = "Credenciales incorrectas. Pruebe con estudiante@aurelius.edu o profesor@aurelius.edu (clave: 12345)";
                errorAlert.style.display = 'block';
            }
        }
    });
}

/**
 * Navegación de Pestañas (Tabs) de la Barra Lateral
 */
function initTabNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const panels = document.querySelectorAll('.tab-panel');
    const headerTitle = document.querySelector('.dashboard-title h2');
    const btnLogout = document.getElementById('btn-logout');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            
            // Cambiar clase active en menú lateral
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Cambiar panel de contenido visible
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `tab-${targetTab}`) {
                    panel.classList.add('active');
                }
            });

            // Actualizar título en el encabezado
            if (headerTitle) {
                headerTitle.textContent = item.querySelector('span').textContent;
            }
        });
    });

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            location.reload(); // Recarga y limpia la UI volviendo a login
        });
    }
}

/**
 * Dibuja los datos del perfil en el menú lateral y la cabecera
 */
function renderProfile(user) {
    const profileAvatar = document.querySelector('.profile-avatar');
    const profileName = document.querySelector('.profile-name');
    const profileRole = document.querySelector('.profile-role');
    const professorClass = document.querySelectorAll('.student-only');
    const studentClass = document.querySelectorAll('.prof-only');

    if (profileName) profileName.textContent = user.name;
    if (profileRole) profileRole.textContent = user.role;
    if (profileAvatar) {
        // Obtener iniciales
        const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        profileAvatar.textContent = initials;
    }

    // Ocultar o mostrar secciones exclusivas de alumno o profesor
    if (user.role === 'Profesor') {
        professorClass.forEach(el => el.style.display = 'none');
        studentClass.forEach(el => el.style.display = 'block');
    } else {
        professorClass.forEach(el => el.style.display = 'block');
        studentClass.forEach(el => el.style.display = 'none');
    }
}

/**
 * Carga todos los datos dinámicos en los diferentes paneles
 */
function renderDashboardData(user) {
    if (user.role === 'Estudiante') {
        renderStudentDashboard(user);
    } else {
        renderProfessorDashboard(user);
    }
}

/**
 * Renderiza la vista específica de Estudiante
 */
function renderStudentDashboard(student) {
    // 1. Resumen Inicio
    const summaryAvg = document.getElementById('summary-avg');
    const summaryCredits = document.getElementById('summary-credits');
    const summaryPending = document.getElementById('summary-pending');
    
    if (summaryAvg) summaryAvg.textContent = student.average;
    if (summaryCredits) summaryCredits.textContent = student.credits;
    
    const pendingCount = student.assignments.filter(a => a.status === 'Pendiente').length;
    if (summaryPending) summaryPending.textContent = pendingCount;

    // 2. Calificaciones Tabla
    const gradesBody = document.getElementById('grades-table-body');
    if (gradesBody) {
        gradesBody.innerHTML = '';
        student.grades.forEach(g => {
            const tr = document.createElement('tr');
            let badgeClass = 'badge-success';
            if (g.status === 'Pendiente') badgeClass = 'badge-warning';
            if (g.grade < 5) badgeClass = 'badge-error';

            tr.innerHTML = `
                <td><strong>${g.id}</strong></td>
                <td>${g.name}</td>
                <td>${g.credits} ECTS</td>
                <td><span class="badge ${badgeClass}">${g.type}</span></td>
                <td><strong>${g.grade}</strong></td>
            `;
            gradesBody.appendChild(tr);
        });
    }

    // 3. Trámites Historial
    const tramitesBody = document.getElementById('tramites-table-body');
    if (tramitesBody) {
        tramitesBody.innerHTML = '';
        student.tramites.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${t.id}</td>
                <td>${t.date}</td>
                <td>${t.type}</td>
                <td><span class="badge badge-success">${t.status}</span></td>
                <td><button class="btn-submit" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;" onclick="simulatePdfDownload('${t.file}', '${t.type}')"><i class="fa-solid fa-download"></i> Descargar</button></td>
            `;
            tramitesBody.appendChild(tr);
        });
    }

    // 4. Aula Virtual (Moodle)
    const moodleContainer = document.getElementById('moodle-container');
    if (moodleContainer) {
        moodleContainer.innerHTML = `
            <!-- Asignatura 1 -->
            <div class="moodle-card">
                <div class="moodle-card-banner">
                    <div>
                        <span class="moodle-card-code">MAT101</span>
                        <h4 class="moodle-card-subject">Cálculo Infinitesimal</h4>
                    </div>
                </div>
                <div class="moodle-card-body">
                    <div class="moodle-assignments-list">
                        <div class="moodle-assignment-item">
                            <span class="moodle-assignment-name">Examen Parcial 2</span>
                            <span class="badge badge-success">Calificado</span>
                        </div>
                        <div class="moodle-assignment-item">
                            <span class="moodle-assignment-name">Hoja de Ejercicios 4</span>
                            <span class="badge badge-success">Calificado</span>
                        </div>
                    </div>
                    <div class="moodle-card-footer">
                        <a href="#moodle-c" class="btn-moodle-link">Ir al curso &rarr;</a>
                    </div>
                </div>
            </div>

            <!-- Asignatura 2 -->
            <div class="moodle-card">
                <div class="moodle-card-banner blue">
                    <div>
                        <span class="moodle-card-code">AER202</span>
                        <h4 class="moodle-card-subject">Introducción a la Aerodinámica</h4>
                    </div>
                </div>
                <div class="moodle-card-body">
                    <div class="moodle-assignments-list">
                        ${renderAssignmentItem(student.assignments[0])}
                    </div>
                    <div class="moodle-card-footer">
                        <a href="#moodle-a" class="btn-moodle-link">Ir al curso &rarr;</a>
                    </div>
                </div>
            </div>

            <!-- Asignatura 3 -->
            <div class="moodle-card">
                <div class="moodle-card-banner green">
                    <div>
                        <span class="moodle-card-code">INF305</span>
                        <h4 class="moodle-card-subject">Programación en Python</h4>
                    </div>
                </div>
                <div class="moodle-card-body">
                    <div class="moodle-assignments-list">
                        ${renderAssignmentItem(student.assignments[1])}
                    </div>
                    <div class="moodle-card-footer">
                        <a href="#moodle-p" class="btn-moodle-link">Ir al curso &rarr;</a>
                    </div>
                </div>
            </div>
        `;
    }
}

function renderAssignmentItem(asg) {
    if (!asg) return '';
    let badge = `<span class="badge badge-warning" style="cursor:pointer" onclick="openUploadModal('${asg.id}', '${asg.name}')">Entregar</span>`;
    if (asg.status === 'Entregado') {
        badge = `<span class="badge badge-info">Recibido</span>`;
    }
    return `
        <div class="moodle-assignment-item">
            <span class="moodle-assignment-name">${asg.name}</span>
            ${badge}
        </div>
    `;
}

/**
 * Renderiza la vista de Profesor
 * Permite cambiar calificaciones del alumno (Alejandro Sanz) de forma persistente.
 */
function renderProfessorDashboard(prof) {
    // Buscar datos del estudiante de la base de datos
    const student = JSON.parse(localStorage.getItem('student_db'));
    
    // Dibujar el panel de control del profesor
    const profContainer = document.getElementById('prof-dashboard-container');
    if (!profContainer) return;

    let gradesOptionsHtml = '';
    student.grades.forEach(g => {
        gradesOptionsHtml += `<option value="${g.id}">${g.name} (${g.id}) - Nota Actual: ${g.grade}</option>`;
    });

    profContainer.innerHTML = `
        <div class="dashboard-summary-cards">
            <div class="summary-card">
                <div class="summary-card-info">
                    <h4>Departamento</h4>
                    <p style="font-size:1.15rem; margin-top:0.3rem">${prof.department}</p>
                </div>
                <div class="summary-card-icon blue"><i class="fa-solid fa-graduation-cap"></i></div>
            </div>
            <div class="summary-card">
                <div class="summary-card-info">
                    <h4>Alumnos Asignados</h4>
                    <p>42</p>
                </div>
                <div class="summary-card-icon green"><i class="fa-solid fa-users"></i></div>
            </div>
            <div class="summary-card">
                <div class="summary-card-info">
                    <h4>Asignaturas Impartidas</h4>
                    <p>3</p>
                </div>
                <div class="summary-card-icon gold"><i class="fa-solid fa-book-open"></i></div>
            </div>
        </div>

        <div class="dashboard-widgets-grid" style="grid-template-columns: 1.2fr 1fr">
            <!-- Calificaciones del Alumno Seleccionado -->
            <div class="widget">
                <div class="widget-header">
                    <h3>Calificaciones de Alejandro Sanz Gómez (${student.id})</h3>
                    <span class="badge badge-info">${student.degree}</span>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Asignatura</th>
                                <th>Nota</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${student.grades.map(g => `
                                <tr>
                                    <td><strong>${g.id}</strong></td>
                                    <td>${g.name}</td>
                                    <td><strong>${g.grade}</strong></td>
                                    <td><span class="badge ${g.grade >= 5 ? 'badge-success' : 'badge-error'}">${g.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Panel para Cambiar Notas -->
            <div class="widget">
                <div class="widget-header">
                    <h3>Modificar Calificaciones</h3>
                </div>
                <form id="change-grade-form" onsubmit="handleProfessorGradeChange(event)">
                    <div class="form-group">
                        <label for="prof-student">Alumno</label>
                        <select id="prof-student" class="form-input" disabled>
                            <option>${student.name} (${student.id})</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="prof-subject">Asignatura</label>
                        <select id="prof-subject" class="form-input">
                            ${gradesOptionsHtml}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="prof-grade-val">Nueva Calificación (0.0 - 10.0)</label>
                        <input type="number" step="0.1" min="0" max="10" id="prof-grade-val" class="form-input" required placeholder="Ej: 8.5">
                    </div>
                    <button type="submit" class="btn-submit" style="width: 100%"><i class="fa-solid fa-save"></i> Guardar Cambios</button>
                    <div id="grade-change-success" style="display:none; color:var(--success); font-size:0.85rem; margin-top:0.8rem; font-weight:700; text-align:center;">
                        ¡Nota modificada y sincronizada correctamente!
                    </div>
                </form>
            </div>
        </div>
    `;
}

/**
 * Gestor del formulario del Profesor para modificar notas de alumnos
 */
window.handleProfessorGradeChange = function(e) {
    e.preventDefault();
    const subjectId = document.getElementById('prof-subject').value;
    const newGrade = parseFloat(document.getElementById('prof-grade-val').value).toFixed(1);
    
    // Obtener la base de datos del estudiante
    const student = JSON.parse(localStorage.getItem('student_db'));
    const gradeObj = student.grades.find(g => g.id === subjectId);
    
    if (gradeObj) {
        gradeObj.grade = newGrade;
        // Calcular estado y tipo cualitativo
        if (newGrade >= 9.0) {
            gradeObj.type = "Sobresaliente";
            gradeObj.status = "Aprobado";
        } else if (newGrade >= 7.0) {
            gradeObj.type = "Notable";
            gradeObj.status = "Aprobado";
        } else if (newGrade >= 5.0) {
            gradeObj.type = "Aprobado";
            gradeObj.status = "Aprobado";
        } else {
            gradeObj.type = "Suspenso";
            gradeObj.status = "Pendiente";
        }

        // Recalcular promedio de notas
        const sum = student.grades.reduce((acc, current) => acc + parseFloat(current.grade), 0);
        student.average = (sum / student.grades.length).toFixed(1);

        // Guardar
        localStorage.setItem('student_db', JSON.stringify(student));
        
        // Si la sesión actual modificada es la del estudiante, refrescar. 
        // Como estamos como Profesor, el estudiante lo verá cuando inicie sesión.
        
        // Mostrar mensaje éxito
        const successEl = document.getElementById('grade-change-success');
        if (successEl) {
            successEl.style.display = 'block';
            setTimeout(() => { successEl.style.display = 'none'; }, 3000);
        }

        // Volver a pintar para reflejar la nota actualizada
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        renderProfessorDashboard(currentUser);
    }
};

/**
 * Inicia controles para el Formulario de Solicitud de Trámites Administrativos
 */
function initTramitesForm() {
    const form = document.getElementById('new-tramite-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const typeSelect = document.getElementById('tramite-type');
        const motiveInput = document.getElementById('tramite-motive');
        
        if (!typeSelect) return;

        const student = JSON.parse(localStorage.getItem('student_db'));
        
        // Generar nuevo trámite
        const newId = `TRM-0${student.tramites.length + 1}`;
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        
        const newTramite = {
            id: newId,
            date: dateStr,
            type: typeSelect.value,
            status: "Procesando",
            file: "tramite_solicitado.pdf"
        };

        student.tramites.unshift(newTramite); // Agregar al inicio de la lista
        localStorage.setItem('student_db', JSON.stringify(student));
        
        // Si el usuario actual es el estudiante, actualizar su estado en la sesión actual
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.role === 'Estudiante') {
            localStorage.setItem('currentUser', JSON.stringify(student));
        }

        // Limpiar formulario y mostrar éxito
        motiveInput.value = '';
        const successMsg = document.getElementById('tramite-success-alert');
        if (successMsg) {
            successMsg.style.display = 'block';
            setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
        }

        // Recargar datos en la UI
        checkActiveSession();
    });
}

/**
 * Simulación de descargas de documentos oficiales firmados digitalmente
 */
window.simulatePdfDownload = function(filename, docName) {
    alert(`[Simulador de Sede Electrónica] Descargando documento oficial:\n\nArchivo: ${filename}\nTipo: ${docName}\n\nEste documento PDF contiene firma digital oficial y huella electrónica.`);
    
    // Crear un blob vacío simulado de texto y descargarlo
    const blobContent = `--- UNIVERSIDAD AURELIUS --- \nDOCUMENTO OFICIAL: ${docName}\nID de Registro: SHA256-${Math.random().toString(36).substr(2, 9).toUpperCase()}\nFecha de Emision: ${new Date().toLocaleDateString()}\n\nEste es un documento oficial con validez juridica simulada para el proyecto web01.`;
    const blob = new Blob([blobContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace('.pdf', '.txt'); // Se descarga como txt legible para pruebas
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// --- LOGICA DEL MODAL DE ENTREGA DE TAREAS (AULA VIRTUAL) ---
let currentAsgId = null;

function initModalControls() {
    const modal = document.getElementById('assignment-modal');
    const closeBtn = document.querySelector('.btn-close-modal');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const submitBtn = document.getElementById('btn-submit-file');

    if (!modal) return;

    // Abrir modal es controlado por openUploadModal() global
    
    // Cerrar modal al pulsar cruz
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Cerrar modal al pulsar fuera de él
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Simulación Drag & Drop
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFilesSelection(files);
        });

        fileInput.addEventListener('change', () => {
            handleFilesSelection(fileInput.files);
        });
    }

    // Botón entregar archivo
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const selectedFile = localStorage.getItem('last_selected_file');
            if (!selectedFile) {
                alert('Por favor, selecciona o arrastra un archivo primero.');
                return;
            }

            // Guardar estado en localStorage
            const student = JSON.parse(localStorage.getItem('student_db'));
            const asgObj = student.assignments.find(a => a.id === currentAsgId);
            
            if (asgObj) {
                asgObj.status = "Entregado";
                localStorage.setItem('student_db', JSON.stringify(student));
                
                // Actualizar sesión activa
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser && currentUser.role === 'Estudiante') {
                    localStorage.setItem('currentUser', JSON.stringify(student));
                }

                // Limpiar selección de archivo temporal
                localStorage.removeItem('last_selected_file');
                if (dropZone) {
                    dropZone.innerHTML = `
                        <div class="drop-zone-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                        <p>Arrastra archivos aquí o haz clic para subir</p>
                    `;
                }

                // Cerrar modal y repintar
                modal.style.display = 'none';
                checkActiveSession();
                
                alert(`¡Tarea "${asgObj.name}" entregada con éxito!`);
            }
        });
    }
}

window.openUploadModal = function(asgId, asgName) {
    currentAsgId = asgId;
    const modal = document.getElementById('assignment-modal');
    const modalAsgTitle = document.getElementById('modal-assignment-name');
    
    if (modal && modalAsgTitle) {
        modalAsgTitle.textContent = asgName;
        modal.style.display = 'flex';
    }
};

function handleFilesSelection(files) {
    const dropZone = document.getElementById('drop-zone');
    if (files.length > 0) {
        const file = files[0];
        localStorage.setItem('last_selected_file', file.name);
        
        if (dropZone) {
            dropZone.innerHTML = `
                <div class="drop-zone-icon" style="color:var(--success)"><i class="fa-solid fa-file-circle-check"></i></div>
                <p style="font-weight:700; color:var(--text-main)">${file.name}</p>
                <p style="font-size:0.75rem; color:var(--text-muted)">Tamaño: ${(file.size/1024).toFixed(1)} KB (Haz clic para cambiar)</p>
            `;
        }
    }
}
