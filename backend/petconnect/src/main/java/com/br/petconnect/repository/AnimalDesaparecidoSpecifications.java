package com.br.petconnect.repository;

import org.springframework.data.jpa.domain.Specification;

import com.br.petconnect.model.AnimalDesaparecido;
import com.br.petconnect.model.AnimalEspecie;

public class AnimalDesaparecidoSpecifications {
    
    public static Specification<AnimalDesaparecido> comLocal(String local) {
        return (root, query, cb) -> 
            local == null ? null : cb.equal(root.get("local"), local);
    }

    public static Specification<AnimalDesaparecido> comEspecie(AnimalEspecie especie) {
        return (root, query, cb) -> 
            especie == null ? null : cb.equal(root.get("animal").get("especie"), especie);
    }

    public static Specification<AnimalDesaparecido> comNome(String nome) {
        return (root, query, cb) -> 
            nome == null ? null : cb.like(cb.lower(root.get("animal").get("nome")), "%" + nome.toLowerCase() + "%");
    }
}