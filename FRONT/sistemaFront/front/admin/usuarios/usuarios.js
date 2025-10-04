
function cargarUsuarios() {
    const contenido = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Gestión de Usuarios</h2>
            <div>
                <button class="btn btn-success me-2" onclick="nuevoUsuario()">
                    <i class="bi bi-plus-circle"></i> Nuevo Usuario
                </button>
                <button class="btn btn-primary" onclick="cargarListaUsuarios()">
                    <i class="bi bi-arrow-clockwise"></i> Actualizar
                </button>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Cédula</th>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaUsuarios">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal Usuario -->
        <div class="modal fade" id="modalUsuario" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tituloModalUsuario">Nuevo Usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formUsuario">
                            <input type="hidden" id="usuarioId">
                            <div class="mb-3">
                                <label for="usuarioCedula" class="form-label">Cédula *</label>
                                <input type="text" class="form-control" id="usuarioCedula" required>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioNombre" class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="usuarioNombre" required>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioContrasena" class="form-label">Contraseña *</label>
                                <input type="password" class="form-control" id="usuarioContrasena" required>
                            </div>
                            <div class="mb-3">
                                <label for="usuarioRol" class="form-label">Rol *</label>
                                <select class="form-control" id="usuarioRol" required>
                                    <option value="">Seleccione un rol</option>
                                    <option value="1">Administrador</option>
                                    <option value="2">Cajero</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarUsuario()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('contenidoModulo').innerHTML = contenido;
    cargarListaUsuarios();
}

async function cargarListaUsuarios() {
    try {
         const response = await fetch('http://localhost:8080/api/usuarios/listar');
         const usuarios = await response.json();

        mostrarUsuarios(usuarios);
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

function mostrarUsuarios(usuarios) {
    const tbody = document.getElementById('tablaUsuarios');
    tbody.innerHTML = '';
    
    usuarios.forEach(usuario => {
        const rolTexto = usuario.rol === '1' ? 'Administrador' : 'Cajero';
        const rolBadge = usuario.rol === '1' ? 'bg-primary' : 'bg-success';
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.cedula}</td>
            <td>${usuario.nombre}</td>
            <td><span class="badge ${rolBadge}">${rolTexto}</span></td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarUsuario(${JSON.stringify(usuario).replace(/"/g, '&quot;')})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario('${usuario.id}', '${usuario.cedula.replace(/'/g, "\\'")}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function nuevoUsuario() {
    document.getElementById('tituloModalUsuario').textContent = 'Nuevo Usuario';
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
}

function editarUsuario(usuario) {
    document.getElementById('tituloModalUsuario').textContent = 'Editar Usuario';
    document.getElementById('usuarioId').value = usuario.id;
    document.getElementById('usuarioCedula').value = usuario.cedula;
    document.getElementById('usuarioNombre').value = usuario.nombre;
    document.getElementById('usuarioRol').value = usuario.rol;
    document.getElementById('usuarioContrasena').value = usuario.contrasena; 
    
    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
}

async function guardarUsuario() {
    let id = document.getElementById('usuarioId').value;
    const usuarioData = {
        id: document.getElementById('usuarioId').value,
        cedula: document.getElementById('usuarioCedula').value,
        nombre: document.getElementById('usuarioNombre').value,
        contrasena: document.getElementById('usuarioContrasena').value,
        rol: document.getElementById('usuarioRol').value
    };

    // Validación: campos no nulos ni vacíos (excepto id)
    const validacion = validarUsuarioData(usuarioData);
    if (!validacion.valido) {
        alert(validacion.mensaje);
        if (validacion.campo) {
            const el = document.getElementById(validacion.campo);
            if (el) el.focus();
        }
        return;
    }

    // Comprobar cédula duplicada en el servidor antes de crear/actualizar
    try {
        const listaResp = await fetch('http://localhost:8080/api/usuarios/listar');
        if (listaResp.ok) {
            const usuariosExistentes = await listaResp.json();
            const cedulaTrim = usuarioData.cedula == null ? '' : String(usuarioData.cedula).trim();
            const existe = usuariosExistentes.some(u => {
                const uCed = u.cedula == null ? '' : String(u.cedula).trim();
                const mismoId = usuarioData.id && String(u.id) === String(usuarioData.id);
                return uCed === cedulaTrim && !mismoId;
            });

            if (existe) {
                alert(`el usuario con la cedula ${usuarioData.cedula} ya existe`);
                const el = document.getElementById('usuarioCedula');
                if (el) el.focus();
                return;
            }
        } 
    } catch (e) {
        console.warn('Error verificando cédula duplicada:', e);
    }

    try {
        const isEditing = usuarioData.id && usuarioData.id !== '';
         let response;

        if (isEditing) {
            response = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioData)
            });
        } else {
            response = await fetch('http://localhost:8080/api/usuarios/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioData)
            });
        }

         if (response.ok) {
            const usuarioGuardado = await response.json();
            if (isEditing) {
                alert(`Usuario actualizado exitosamente: ${usuarioGuardado.nombre}`);
            } else {
                alert(`Usuario creado exitosamente: ${usuarioGuardado.nombre}`);
            }
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la operación');
        }

        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalUsuario'));
        modal.hide();
        cargarListaUsuarios();
        
    } catch (error) {
        console.error('Error guardando usuario:', error);
        alert('Error al guardar el usuario');
    }
}

async function eliminarUsuario(id, cedula) {
    if (!confirm(`¿Está seguro de eliminar el usuario ${cedula}?`)) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/usuarios/eliminar/${id}`, { 
            method: 'DELETE' 
        });
        
        if (response.ok) {
            alert('Usuario eliminado exitosamente');

            let sesion = JSON.parse(localStorage.getItem('usuario'));
            if(id == sesion.usuario.id){
                logout(true);
                return;
            }
            cargarListaUsuarios();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar el usuario');
        }


    } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar el usuario');
    }
}

function validarUsuarioData(usuario) {
    if (!usuario) {
        return { valido: false, mensaje: 'Datos de usuario inválidos', campo: null };
    }

    // Normalizar valores y comprobar vacío
    const cedula = usuario.cedula == null ? '' : String(usuario.cedula).trim();
    const nombre = usuario.nombre == null ? '' : String(usuario.nombre).trim();
    const contrasena = usuario.contrasena == null ? '' : String(usuario.contrasena).trim();
    const rol = usuario.rol == null ? '' : String(usuario.rol).trim();

    if (cedula === '') {
        return { valido: false, mensaje: 'La cédula es obligatoria', campo: 'usuarioCedula' };
    }
    if (nombre === '') {
        return { valido: false, mensaje: 'El nombre es obligatorio', campo: 'usuarioNombre' };
    }

    if (contrasena === '') {
        return { valido: false, mensaje: 'La contraseña es obligatoria', campo: 'usuarioContrasena' };
    }
    if (rol === '') {
        return { valido: false, mensaje: 'El rol es obligatorio', campo: 'usuarioRol' };
    }

    return { valido: true, mensaje: '', campo: null };
}