package com.br.petconnect.repository;

import com.br.petconnect.model.AnimalDoacaoInteressado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalDoacaoInteressadoRepository extends JpaRepository<AnimalDoacaoInteressado, Long> {
}
