package com.br.petconnect.controller;

import com.br.petconnect.controller.model.request.AnimalRequest;
import com.br.petconnect.controller.model.response.AnimalResponse;
import com.br.petconnect.model.Animal;

public class AnimalConverter {

    public static AnimalResponse convertAnimalResponse(Animal animal) {
        AnimalResponse animalResponse = new AnimalResponse();
        animalResponse.setDescricao(animal.getDescricao());
        animalResponse.setEspecie(animal.getEspecie());
        animalResponse.setNome(animal.getNome());
        animalResponse.setIdade(animal.getIdade());
        animalResponse.setRaca(animal.getRaca());
        animalResponse.setImagemUrl(animal.getImagemUrl());
        animalResponse.setDescricao(animal.getDescricao());
        return animalResponse;
    }

    public static Animal convertAnimal(AnimalRequest animalRequest) {
        Animal animal = new Animal();
        animal.setDescricao(animalRequest.getDescricao());
        animal.setEspecie(animalRequest.getEspecie());
        animal.setNome(animalRequest.getNome());
        animal.setIdade(animalRequest.getIdade());
        animal.setRaca(animalRequest.getRaca());
        animal.setImagemUrl(animalRequest.getImagemUrl());
        animal.setDescricao(animalRequest.getDescricao());
        return animal;
    }

}
