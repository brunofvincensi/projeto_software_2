package com.br.petconnect.controller.model.request;

import java.time.LocalDate;

public class AnimalDesaparecidoRequest {

    private String titulo;
    private String local;
    private LocalDate dataDesaparecimento;
    private String complemento;
    private AnimalRequest animal;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public LocalDate getDataDesaparecimento() {
        return dataDesaparecimento;
    }

    public void setDataDesaparecimento(LocalDate dataDesaparecimento) {
        this.dataDesaparecimento = dataDesaparecimento;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public AnimalRequest getAnimal() {
        return animal;
    }

    public void setAnimal(AnimalRequest animal) {
        this.animal = animal;
    }
}
