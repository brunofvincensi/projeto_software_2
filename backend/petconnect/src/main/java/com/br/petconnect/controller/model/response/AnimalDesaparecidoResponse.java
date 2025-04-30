package com.br.petconnect.controller.model.response;

import java.time.LocalDate;

public class AnimalDesaparecidoResponse {

    private AnimalResponse animal;
    private String titulo;
    private String local;
    private LocalDate dataDesaparecimento;
    private String complemento;
    private String emailUsuario;

    public AnimalResponse getAnimal() {
        return animal;
    }

    public void setAnimal(AnimalResponse animal) {
        this.animal = animal;
    }

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

    public String getEmailUsuario() {
        return emailUsuario;
    }

    public void setEmailUsuario(String emailUsuario) {
        this.emailUsuario = emailUsuario;
    }

}
