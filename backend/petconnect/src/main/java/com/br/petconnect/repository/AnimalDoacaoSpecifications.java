package com.br.petconnect.repository;

import org.springframework.data.jpa.domain.Specification;

import com.br.petconnect.model.AnimalDesaparecido;
import com.br.petconnect.model.AnimalDoacao;
import com.br.petconnect.model.AnimalEspecie;

public class AnimalDoacaoSpecifications {
    
    public static Specification<AnimalDoacao> comIdade(Integer idade) {
        return (root, query, cb) -> 
        idade == null ? null : cb.equal(root.get("animal").get("idade"), idade);
    }

    public static Specification<AnimalDoacao> comEspecie(AnimalEspecie especie) {
        return (root, query, cb) -> 
            especie == null ? null : cb.equal(root.get("animal").get("especie"), especie);
    }

    public static Specification<AnimalDoacao> comNome(String nome) {
        return (root, query, cb) -> 
            nome == null ? null : cb.like(cb.lower(root.get("animal").get("nome")), "%" + nome.toLowerCase() + "%");
    }

}
