package com.br.petconnect.controller.model.request;

import jakarta.validation.constraints.NotBlank;

public class AnimalDoacaoRequest {

    @NotBlank
    private String titulo;
    @NotBlank
    private String descricao;
    private AnimalRequest animal;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public AnimalRequest getAnimal() {
        return animal;
    }

    public void setAnimal(AnimalRequest animal) {
        this.animal = animal;
    }

}
