package com.mercado.sistemamercado.controller;

import com.mercado.sistemamercado.model.usuarios.UsuarioDto;
import com.mercado.sistemamercado.model.usuarios.UsuarioRequest;
import com.mercado.sistemamercado.services.usuarios.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controlador para manejar las solicitudes relacionadas con usuarios.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Maneja la solicitud para listar usuarios.
     *
     * @return Respuesta HTTP con la lista de usuarios.
     */
    @GetMapping("/listar")
    public ResponseEntity<List<UsuarioDto>> listar() {
        return ResponseEntity.ok(this.usuarioService.listar());
    }

    /**
     * Maneja la solicitud para crear un nuevo usuario.
     *
     * @param request Objeto que contiene los datos del usuario a crear.
     * @return Respuesta HTTP con el usuario creado.
     */
    @PostMapping("/crear")
    public ResponseEntity<UsuarioDto> crear(@RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(this.usuarioService.crear(request));
    }

    /**
     * Maneja la solicitud para actualizar un usuario existente.
     *
     * @param id      ID del usuario a actualizar.
     * @param request Objeto que contiene los datos actualizados del usuario.
     * @return Respuesta HTTP con el usuario actualizado.
     * @throws Exception Si el usuario no se encuentra.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDto> actualizar(@PathVariable UUID id, @RequestBody UsuarioRequest request) throws Exception {
        return ResponseEntity.ok(this.usuarioService.actualizar(id, request));
    }

    /**
     * Maneja la solicitud para eliminar un usuario por su ID.
     *
     * @param id ID del usuario a eliminar.
     * @return Respuesta HTTP indicando el resultado de la operación.
     */
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        this.usuarioService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
