package com.br.petconnect.repository;

import com.br.petconnect.model.AnimalDesaparecido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalDesaparecidoRepository extends JpaRepository<AnimalDesaparecido, Long>,
		JpaSpecificationExecutor<AnimalDesaparecido> {

}
