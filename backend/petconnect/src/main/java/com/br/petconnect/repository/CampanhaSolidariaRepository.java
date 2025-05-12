package com.br.petconnect.repository;

import com.br.petconnect.model.CampanhaSolidaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampanhaSolidariaRepository extends JpaRepository<CampanhaSolidaria, Long> {
}
