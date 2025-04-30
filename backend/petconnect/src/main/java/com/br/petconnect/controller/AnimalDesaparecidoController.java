package com.br.petconnect.controller;

import com.br.petconnect.controller.model.request.AnimalDoacaoRequest;
import com.br.petconnect.controller.model.response.AnimalDoacaoResponse;
import com.br.petconnect.model.Animal;
import com.br.petconnect.model.AnimalDoacao;
import com.br.petconnect.repository.AnimalDoacaoRepository;
import com.br.petconnect.service.SecurityUserServiceImpl;
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
    private AnimalDoacaoRepository animalDoacaoRepository;

    @Autowired
    SecurityUserServiceImpl securityUserService;

    @PostMapping
    public void publicarDoacao(@Valid @RequestBody AnimalDoacaoRequest animalDoacaoRequest) throws Exception {
        if (animalDoacaoRequest == null || animalDoacaoRequest.getAnimal() == null) {
            throw new Exception("Dados inválidos");
        }
        animalDoacaoRepository.save(convertAnimalDoacao(animalDoacaoRequest, getUsernameFromRequest()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AnimalDoacaoResponse>> buscaDoacoes() {
        List<AnimalDoacaoResponse> list = animalDoacaoRepository
                .findAll()
                .stream()
                .map(this::convertAnimalDoacaoResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{idAnimalDoacao}")
    public void removerDoacao(@PathVariable Long idAnimalDoacao) {
        animalDoacaoRepository.deleteById(idAnimalDoacao);
    }

    public static AnimalDoacao convertAnimalDoacao(AnimalDoacaoRequest animalDoacaoRequest, String username) throws Exception {
        AnimalDoacao anuncioDoacao = new AnimalDoacao();
        anuncioDoacao.setTitulo(animalDoacaoRequest.getTitulo());
        anuncioDoacao.setDescricao(animalDoacaoRequest.getDescricao());
        anuncioDoacao.setDoador(securityUserService.loadUserEntityByUsername(username));
        Animal animal = AnimalConverter.convertAnimal(animalDoacaoRequest.getAnimal());
        anuncioDoacao.setAnimal(animal);
        return anuncioDoacao;
    }

    private AnimalDoacaoResponse convertAnimalDoacaoResponse(AnimalDoacao animalDoacao) {
        AnimalDoacaoResponse animalDoacaoResponse = new AnimalDoacaoResponse();
        animalDoacaoResponse.setEmailUsuario(animalDoacao.getDoador().getEmail());
        animalDoacaoResponse.setData(animalDoacao.getDataPublicacao());
        animalDoacaoResponse.setTitulo(animalDoacao.getTitulo());
        animalDoacaoResponse.setDescricao(animalDoacao.getDescricao());
        animalDoacaoResponse.setAnimal(AnimalConverter.convertAnimalResponse(animalDoacao.getAnimal()));
        return animalDoacaoResponse;
    }

}
