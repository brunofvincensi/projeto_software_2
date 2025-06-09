package com.br.petconnect.controller;

import com.br.petconnect.controller.model.request.LoginRequest;
import com.br.petconnect.controller.model.request.UsuarioAvaliacaoRequest;
import com.br.petconnect.controller.model.request.UsuarioRequest;
import com.br.petconnect.controller.model.response.LoginResponse;
import com.br.petconnect.controller.model.response.UsuarioResponse;
import com.br.petconnect.model.Role;
import com.br.petconnect.model.SecurityUser;
import com.br.petconnect.model.Usuario;
import com.br.petconnect.model.UsuarioAvaliacao;
import com.br.petconnect.repository.UsuarioAvaliacaoRepository;
import com.br.petconnect.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/usuario")
public class UsuarioController extends PetConnetBaseController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioAvaliacaoRepository usuarioAvaliacaoRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody UsuarioRequest usuarioRequest) {
        if (usuarioRequest == null || Role.ADMIN.equals(usuarioRequest.getRole())) {
            return ResponseEntity.badRequest().build();
        }
        
        if (usuarioRepository.findByEmail(usuarioRequest.getEmail()).isPresent()) {
        	return ResponseEntity.badRequest().body("Usuário já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(usuarioRequest.getNome());
        usuario.setEmail(usuarioRequest.getEmail());
        usuario.setDataNascimento(usuarioRequest.getDataNascimento());
        usuario.setDataCriacao(LocalDate.now());
        usuario.setRole(usuarioRequest.getRole());
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

    @PostMapping("/avaliar")
    public ResponseEntity<?> avaliar(@RequestBody @Valid UsuarioAvaliacaoRequest usuarioAvaliacaoRequest) throws Exception {
        if (usuarioAvaliacaoRequest.getNota() < 0 || usuarioAvaliacaoRequest.getNota() > 5) {
            return ResponseEntity.badRequest().build();
        }

        UsuarioAvaliacao usuarioAvaliacao = new UsuarioAvaliacao();

        usuarioAvaliacao.setAvaliador(securityUserService.loadUserEntityByUsername(getUsernameFromRequest()));
        usuarioAvaliacao.setAvaliado(usuarioRepository.findById(usuarioAvaliacaoRequest.getIdUsuario()).orElseThrow(() -> new Exception("Usuário não existe")));
        usuarioAvaliacao.setNota(usuarioAvaliacaoRequest.getNota());
        usuarioAvaliacao.setComentario(usuarioAvaliacaoRequest.getObservacao());

        usuarioAvaliacaoRepository.save(usuarioAvaliacao);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) throws Exception {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new Exception("Usuário não existe"));

        UsuarioResponse usuarioResponse = new UsuarioResponse();
        usuarioResponse.setEmail(usuario.getEmail());
        usuarioResponse.setNome(usuario.getNome());
        usuarioResponse.setTelefone(usuario.getTelefone());
        usuarioResponse.setImagemUrl(usuario.getImagemUrl());
        usuarioResponse.setDataNascimento(usuario.getDataNascimento());
        usuarioResponse.setAvaliacao(usuario.getMediaAvaliacao());

        return ResponseEntity.ok(usuarioResponse);
    }
    
    @PutMapping
    public ResponseEntity<?> editarUsuario(@RequestBody UsuarioRequest usuarioRequest) throws UsernameNotFoundException, Exception {
        if (usuarioRequest == null || Role.ADMIN.equals(usuarioRequest.getRole())) {
            return ResponseEntity.badRequest().build();
        }
        
        Usuario usuario = securityUserService.loadUserEntityByUsername(getUsernameFromRequest());
        if (usuario == null) {
        	return ResponseEntity.badRequest().build();
        }
        
        usuario.setNome(usuarioRequest.getNome());
        usuario.setDataNascimento(usuarioRequest.getDataNascimento());
        usuario.setTelefone(usuarioRequest.getTelefone());

        usuarioRepository.save(usuario);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}
