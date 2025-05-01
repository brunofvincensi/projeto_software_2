package com.br.petconnect.controller;

import com.br.petconnect.controller.model.request.AnimalDesaparecidoRequest;
import com.br.petconnect.controller.model.response.AnimalDesaparecidoResponse;
import com.br.petconnect.model.Animal;
import com.br.petconnect.model.AnimalDesaparecido;
import com.br.petconnect.repository.AnimalDesaparecidoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/animal/desaparecido")
public class AnimalDesaparecidoController extends PetConnetBaseController {

    @Autowired
    private AnimalDesaparecidoRepository animalDesaparecidoRepository;

    @PostMapping
    public void publicarDoacao(@Valid @RequestBody AnimalDesaparecidoRequest animalDesaparecidoRequest) throws Exception {
        if (animalDesaparecidoRequest == null || animalDesaparecidoRequest.getAnimal() == null) {
            throw new Exception("Dados inválidos");
        }
        animalDesaparecidoRepository.save(convertAnimalDesaparecido(animalDesaparecidoRequest, getUsernameFromRequest()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AnimalDesaparecidoResponse>> buscaDoacoes() {
        List<AnimalDesaparecidoResponse> list = animalDesaparecidoRepository
                .findAll()
                .stream()
                .map(this::convertAnimalDesaparecidoResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public void removerDoacao(@PathVariable Long id) {
        animalDesaparecidoRepository.deleteById(id);
    }

    public AnimalDesaparecido convertAnimalDesaparecido(AnimalDesaparecidoRequest animalDesaparecidoRequest, String username) throws Exception {
        AnimalDesaparecido animalDesaparecido = new AnimalDesaparecido();
        animalDesaparecido.setTitulo(animalDesaparecidoRequest.getTitulo());
        animalDesaparecido.setComplemento(animalDesaparecidoRequest.getComplemento());
        animalDesaparecido.setUsuario(securityUserService.loadUserEntityByUsername(username));
        animalDesaparecido.setDataDesaparecimento(animalDesaparecidoRequest.getDataDesaparecimento());
        animalDesaparecido.setLocal(animalDesaparecidoRequest.getLocal());
        Animal animal = AnimalConverter.convertAnimal(animalDesaparecidoRequest.getAnimal());
        animalDesaparecido.setAnimal(animal);
        return animalDesaparecido;
    }

    private AnimalDesaparecidoResponse convertAnimalDesaparecidoResponse(AnimalDesaparecido animalDesaparecido) {
        AnimalDesaparecidoResponse animalDesaparecidoResponse = new AnimalDesaparecidoResponse();
        animalDesaparecidoResponse.setEmailUsuario(animalDesaparecido.getUsuario().getEmail());
        animalDesaparecidoResponse.setTitulo(animalDesaparecido.getTitulo());
        animalDesaparecidoResponse.setComplemento(animalDesaparecido.getComplemento());
        animalDesaparecidoResponse.setDataDesaparecimento(animalDesaparecido.getDataDesaparecimento());
        animalDesaparecidoResponse.setLocal(animalDesaparecido.getLocal());
        animalDesaparecidoResponse.setAnimal(AnimalConverter.convertAnimalResponse(animalDesaparecido.getAnimal()));
        return animalDesaparecidoResponse;
    }

}
