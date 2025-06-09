package com.br.petconnect.controller.model.response;

import java.time.LocalDate;

public class AnimalDoacaoResponse {

	private Long id;
    private AnimalResponse animal;
    private String titulo;
    private String descricao;
    private String emailUsuario;
    private LocalDate data;
    private Long idUsuario;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getEmailUsuario() {
        return emailUsuario;
    }

    public void setEmailUsuario(String emailUsuario) {
        this.emailUsuario = emailUsuario;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

	public Long getIdUsuario() {
		return idUsuario;
	}

	public void setIdUsuario(Long idUsuario) {
		this.idUsuario = idUsuario;
	}
    
}
