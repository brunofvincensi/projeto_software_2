package com.br.petconnect.repository;

import com.br.petconnect.model.UsuarioAvaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioAvaliacaoRepository extends JpaRepository<UsuarioAvaliacao, Long> {
}
