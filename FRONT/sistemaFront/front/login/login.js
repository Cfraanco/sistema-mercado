// Función para manejar el inicio de sesión
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
      
        const cedula = document.getElementById('cedula').value;
        const contrasena = document.getElementById('password').value;
        
        if (!cedula || !contrasena) {
            alert('Por favor, completa todos los campos');
            return;
        }

        const datosLogin = {
            cedula: cedula,
            contrasena: contrasena
        };

        enviarLogin(datosLogin);
    });
});

async function enviarLogin(datos) {
    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        if (response.ok) {
            const resultado = await response.json();

            // Obtener el rol del usuario de la respuesta
            const rol = resultado.usuario?.rol;

            // Redirigir según el rol
            redirigirSegunRol(rol, resultado);
            
        } else {
            const error = await response.json();
            console.error('Error en el login:', error);
            alert('Credenciales incorrectas');
        }
        
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('Error de conexión con el servidor');
    }
}

// Función para redirigir según el rol del usuario
function redirigirSegunRol(rol, datosUsuario) {
    console.log('Función redirigirSegunRol llamada con rol:', rol);
    
    // Verificar si el rol es válido
    if (rol === undefined || rol === null) {
        alert('Error: No se pudo determinar el rol del usuario. Respuesta del servidor: ' + JSON.stringify(datosUsuario));
        return;
    }
    
    // Convertir el rol a número si viene como string
    const rolNumerico = parseInt(rol);
    console.log('Rol numérico:', rolNumerico);
    
    // Guardar datos del usuario en localStorage para uso posterior
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    localStorage.setItem('rol', rolNumerico);
    
    let urlDestino = '';
    
    if (rol === "1" || rolNumerico === 1) {
        // Administrador
        urlDestino = '../admin/admin.html'; 
        window.location.href = urlDestino;
        
    } else if (rol === "2" || rolNumerico === 2) {
        // Cajero
        urlDestino = '../cajero/cajero.html'; 
        window.location.href = urlDestino;
        
    } else {
        alert('Error: Rol de usuario no reconocido. Rol recibido: ' + rol);
        return;
    }
}
