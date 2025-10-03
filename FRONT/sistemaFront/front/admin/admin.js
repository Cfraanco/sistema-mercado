// Variables globales
let moduloActual = 'dashboard';
let productos = [];
let usuarios = [];
let ventas = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistema();
    mostrarModulo('dashboard');
});

function inicializarSistema() {
    // Verificar autenticación
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        window.location.href = '../Login/index.html';
        return;
    }

    const rol = localStorage.getItem('rol');
    if (rol !== "1" && rol !== 1) {
        alert('Acceso denegado. Solo los administradores pueden acceder a este módulo.');
        logout(true);
        return;
    }

    // Mostrar información del usuario
    const nombreUsuario = usuario.usuario?.nombre || usuario.nombre || usuario.cedula;
    document.getElementById('userInfo').textContent = `Administrador: ${nombreUsuario}`;
    mostrarModulo('caja');
}

// ========== NAVEGACIÓN ==========

function mostrarModulo(modulo) {
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    moduloActual = modulo;
    
    // Cargar contenido del módulo
    switch(modulo) {
        case 'inventario':
            cargarInventario();
            break;
        case 'caja':
            cargarCaja();
            break;
        case 'reportes':
            cargarReportes();
            break;
        case 'usuarios':
            cargarUsuarios();
            break;
    }
}

//========== FUNCIONES AUXILIARES ==========

function logout(forzado) {
    if (forzado) {
        localStorage.clear();
        window.location.href = '../login/login.html';
        return;
    }
    
    if (confirm('¿Está seguro de cerrar sesión?')) {
        localStorage.clear();
        window.location.href = '../login/login.html';
    }
}