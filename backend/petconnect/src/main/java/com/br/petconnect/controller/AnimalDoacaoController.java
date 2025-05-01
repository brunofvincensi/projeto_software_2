package com.br.petconnect.controller;

import com.br.petconnect.controller.model.request.AnimalDoacaoRequest;
import com.br.petconnect.controller.model.response.AnimalDoacaoResponse;
import com.br.petconnect.model.Animal;
import com.br.petconnect.model.AnimalDoacao;
import com.br.petconnect.model.AnimalDoacaoInteressado;
import com.br.petconnect.model.Usuario;
import com.br.petconnect.repository.AnimalDoacaoInteressadoRepository;
import com.br.petconnect.repository.AnimalDoacaoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/animal/doacao")
public class AnimalDoacaoController extends PetConnetBaseController {

    @Autowired
    private AnimalDoacaoRepository animalDoacaoRepository;

    @Autowired
    private AnimalDoacaoInteressadoRepository animalDoacaoInteressadoRepository;

    @PostMapping
    public ResponseEntity<?> publicarDoacao(@Valid @RequestBody AnimalDoacaoRequest animalDoacaoRequest) throws Exception {
        if (animalDoacaoRequest == null || animalDoacaoRequest.getAnimal() == null) {
            return ResponseEntity.badRequest().body("Dados inválidos");
        }
        AnimalDoacao animalDoacao = convertAnimalDoacao(animalDoacaoRequest, getUsernameFromRequest());
        animalDoacao.setDataPublicacao(LocalDate.now());
        return ResponseEntity.ok(convertAnimalDoacaoResponse(animalDoacaoRepository.save(animalDoacao)));
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

    @PostMapping("/interesse")
    public ResponseEntity<?> registrarInteresse(@RequestBody Long idDoacao) throws Exception {
        Usuario usuario = securityUserService.loadUserEntityByUsername(getUsernameFromRequest());
        AnimalDoacao animalDoacao = animalDoacaoRepository.findById(idDoacao).orElse(null);
        if (animalDoacao == null) {
            return ResponseEntity.badRequest().body("Doação não existe");
        }

        if (Objects.equals(usuario.getId(), animalDoacao.getDoador().getId())) {
            return ResponseEntity.badRequest().body("Não pode se interessar por uma doação própria");
        }

        AnimalDoacaoInteressado interessado = new AnimalDoacaoInteressado();
        interessado.setUsuario(usuario);
        interessado.setAnimalDoacao(animalDoacao);
        animalDoacaoInteressadoRepository.save(interessado);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public void removerDoacao(@PathVariable Long id) {
        animalDoacaoRepository.deleteById(id);
    }

    private AnimalDoacao convertAnimalDoacao(AnimalDoacaoRequest animalDoacaoRequest, String username) throws Exception {
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
