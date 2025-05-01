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
    private Integer id;

    @Column(nullable = false)
    private AnimalDoacaoInteressadoStatus status = AnimalDoacaoInteressadoStatus.AGUARDANDO_RESPOSTA;

    @ManyToOne
    @JoinColumn(nullable = false)
    private AnimalDoacao animalDoacao;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Usuario usuario;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AnimalDoacaoInteressadoStatus getStatus() {
        return status;
    }

    public void setStatus(AnimalDoacaoInteressadoStatus status) {
        this.status = status;
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
