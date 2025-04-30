package com.br.petconnect.controller.model.response;

import com.br.petconnect.model.AnimalEspecie;

public class AnimalResponse {

    private String nome;
    private AnimalEspecie especie;
    private String raca;
    private Integer idade;
    private String descricao;
    private String imagemUrl;
    private String localizacao;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public AnimalEspecie getEspecie() {
        return especie;
    }

    public void setEspecie(AnimalEspecie especie) {
        this.especie = especie;
    }

    public String getRaca() {
        return raca;
    }

    public void setRaca(String raca) {
        this.raca = raca;
    }

    public Integer getIdade() {
        return idade;
    }

    public void setIdade(Integer idade) {
        this.idade = idade;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

}
