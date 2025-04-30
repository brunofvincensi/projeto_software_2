package com.br.petconnect.repository;

import com.br.petconnect.model.AnimalDoacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalDoacaoRepository extends JpaRepository<AnimalDoacao, Long> {
}
