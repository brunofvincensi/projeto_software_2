package com.br.petconnect.service;

import com.br.petconnect.model.SecurityUser;
import com.br.petconnect.model.Usuario;
import com.br.petconnect.repository.UsuarioAvaliacaoRepository;
import com.br.petconnect.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class SecurityUserServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioAvaliacaoRepository usuarioAvaliacaoRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = loadUserEntityByUsername(username);
        SecurityUser userDetails = new SecurityUser();
        userDetails.setUsername(usuario.getEmail());
        userDetails.setPassword(usuario.getSenha());
        userDetails.setNome(usuario.getNome());
        userDetails.setEmail(usuario.getEmail());
        return userDetails;
    }

    public Usuario loadUserEntityByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository
                .findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Acesso não encontrado para o usuário: " + username));
    }

}
