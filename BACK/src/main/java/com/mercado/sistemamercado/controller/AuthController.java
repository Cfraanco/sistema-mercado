package com.mercado.sistemamercado.controller;

import com.mercado.sistemamercado.model.auth.AuthDto;
import com.mercado.sistemamercado.model.auth.AuthRequest;
import com.mercado.sistemamercado.services.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para manejar las solicitudes de autenticación.
 */

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Maneja la solicitud de inicio de sesión.
     *
     * @param authRequest Objeto que contiene las credenciales de autenticación.
     * @return Respuesta HTTP y revisa si las credenciales son válidas.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthDto> login(@RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok(this.authService.login(authRequest));
    }
}
