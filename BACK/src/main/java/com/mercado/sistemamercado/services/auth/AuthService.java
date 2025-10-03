package com.mercado.sistemamercado.services.auth;

import com.mercado.sistemamercado.model.auth.AuthDto;
import com.mercado.sistemamercado.model.auth.AuthRequest;

/**
 * Interfaz del servicio de autenticación.
 * Define el contrato para la funcionalidad de inicio de sesión.
 */
public interface AuthService {

    AuthDto login (AuthRequest authRequest);
}
