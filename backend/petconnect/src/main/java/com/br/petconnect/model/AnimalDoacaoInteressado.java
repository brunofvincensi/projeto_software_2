package com.br.petconnect.model;

import jakarta.persistence.*;

/**
 * Representa os usuários interessados na doação
 */
@Entity
@Table(name = "anuncio_doacao_interessado")
public class AnimalDoacaoInteressado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private AnimalDoacao animalDoacao;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Usuario usuario;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AnimalDoacao getAnimalDoacao() {
        return animalDoacao;
    }

    public void setAnimalDoacao(AnimalDoacao animalDoacao) {
        this.animalDoacao = animalDoacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

}
