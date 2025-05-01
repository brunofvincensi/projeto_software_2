package com.br.petconnect.controller;

import com.br.petconnect.controller.model.request.LoginRequest;
import com.br.petconnect.controller.model.request.UsuarioRequest;
import com.br.petconnect.controller.model.response.LoginResponse;
import com.br.petconnect.model.Role;
import com.br.petconnect.model.SecurityUser;
import com.br.petconnect.model.Usuario;
import com.br.petconnect.repository.UsuarioRepository;
import com.br.petconnect.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/usuario")
public class UsuarioController extends PetConnetBaseController {

    @Autowired
    private JwtUtil jwtUtils;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private HttpServletRequest servletRequest;

    @Autowired
    AuthenticationManager authenticationManager;

    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody UsuarioRequest usuarioRequest) {
        Usuario usuario = new Usuario();
        usuario.setNome(usuarioRequest.getNome());
        usuario.setEmail(usuarioRequest.getEmail());
        usuario.setDataNascimento(usuarioRequest.getDataNascimento());
        usuario.setDataCriacao(LocalDate.now());
        usuario.setRole(Role.CLIENTE);
        usuario.setTelefone(usuarioRequest.getTelefone());

        BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
        usuario.setSenha(bcrypt.encode(usuarioRequest.getSenha()));

        usuarioRepository.save(usuario);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> logar(@RequestBody @Valid LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getSenha();
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, password);
        try {
             authentication = authenticationManager.authenticate(authentication);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e);
        }
        SecurityUser userDetails = (SecurityUser) authentication.getPrincipal();

        String token = jwtUtils.generateLoginToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setAccessToken(token);
        loginResponse.setRefreshToken(refreshToken);
        return ResponseEntity.ok().body(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody @Valid String refreshToken) {
        if (refreshToken != null && jwtUtils.validateToken(refreshToken)) {
            String username = jwtUtils.getUserNameFromToken(refreshToken);
            SecurityUser aliasUserDetails = (SecurityUser) securityUserService.loadUserByUsername(username);
            if (aliasUserDetails != null) {
                String token = jwtUtils.generateLoginToken(aliasUserDetails);
                String newRefreshToken = jwtUtils.generateRefreshToken(aliasUserDetails);

                LoginResponse loginResponse = new LoginResponse();
                loginResponse.setAccessToken(token);
                loginResponse.setRefreshToken(newRefreshToken);
                return ResponseEntity.ok().body(loginResponse);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autorizado");
    }

}
