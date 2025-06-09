package com.br.petconnect.controller;

import com.br.petconnect.controller.model.request.AnimalDoacaoRequest;
import com.br.petconnect.controller.model.response.AnimalDesaparecidoResponse;
import com.br.petconnect.controller.model.response.AnimalDoacaoResponse;
import com.br.petconnect.model.Animal;
import com.br.petconnect.model.AnimalDesaparecido;
import com.br.petconnect.model.AnimalDoacao;
import com.br.petconnect.model.AnimalDoacaoInteressado;
import com.br.petconnect.model.AnimalEspecie;
import com.br.petconnect.model.Usuario;
import com.br.petconnect.repository.AnimalDesaparecidoSpecifications;
import com.br.petconnect.repository.AnimalDoacaoInteressadoRepository;
import com.br.petconnect.repository.AnimalDoacaoRepository;
import com.br.petconnect.repository.AnimalDoacaoSpecifications;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/animal/doacao")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class AnimalDoacaoController extends PetConnetBaseController {

    @Autowired
    private AnimalDoacaoRepository animalDoacaoRepository;

    @Autowired
    private AnimalDoacaoInteressadoRepository animalDoacaoInteressadoRepository;

    @PostMapping
    public ResponseEntity<?> publicarDoacao(
    		@RequestPart("animal") AnimalDoacaoRequest animalDoacaoRequest,
    		@RequestPart("foto") MultipartFile foto) throws Exception {
    	
    	String fotoPath = salvarFoto(foto);
    	animalDoacaoRequest.getAnimal().setImagemUrl(fotoPath);
    	
        AnimalDoacao animalDoacao = convertAnimalDoacao(animalDoacaoRequest, getUsernameFromRequest());
        animalDoacao.setDataPublicacao(LocalDate.now());
        return ResponseEntity.ok(convertAnimalDoacaoResponse(animalDoacaoRepository.save(animalDoacao)));
    }
    
    private String salvarFoto(MultipartFile foto) throws IOException {
        String diretorioUpload = "./uploads/pets/"; // Altere para seu diretório
        String nomeOriginal = foto.getOriginalFilename();
        String extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
        String nomeArquivo = UUID.randomUUID() + extensao;
        
        Path caminhoCompleto = Paths.get(diretorioUpload + nomeArquivo);
        Files.createDirectories(caminhoCompleto.getParent());
        Files.write(caminhoCompleto, foto.getBytes());
        
        return nomeArquivo;
    }
    
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleSizeExceeded() {
        return ResponseEntity
            .status(HttpStatus.PAYLOAD_TOO_LARGE)
            .body("Tamanho máximo da foto é 5MB");
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AnimalDoacaoResponse> findBydId(@PathVariable Long id) {
    	AnimalDoacao animalDoacao = animalDoacaoRepository.findById(id).orElse(null);
    	if (animalDoacao == null) {
    		return ResponseEntity.badRequest().build();
    	}
    	return ResponseEntity.ok(convertAnimalDoacaoResponse(animalDoacao));
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<AnimalDoacaoResponse>> buscaDoacoes(@RequestParam(required = false) MultiValueMap<String, String> query) {
    	String idadeStr = getParam(query, "idade");
    	
    	AnimalEspecie especie = null;
    	String especieStr = getParam(query, "especie");
    	if (especieStr != null && !especieStr.isBlank()) {
    		especie = AnimalEspecie.valueOf(especieStr);
    	}
    	String nome = getParam(query, "nome");
    	
        Specification<AnimalDoacao> spec = Specification.where(AnimalDoacaoSpecifications.comEspecie(especie))
                .and(AnimalDoacaoSpecifications.comNome(nome));
    	
    	if (idadeStr != null && !idadeStr.isBlank()) {
    		Integer idade = Integer.valueOf(idadeStr) ;
    		spec = spec.and(AnimalDoacaoSpecifications.comIdade(idade));
    	}
		
    	List<AnimalDoacaoResponse> list = animalDoacaoRepository
                .findAll(spec)
                .stream()
                .map(this::convertAnimalDoacaoResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
    
	/**
	 * Retorna um parâmetro de uma query
	 * @param query
	 * @param name
	 * @return
	 */
	protected String getParam(MultiValueMap<String, String> query, String name) {
		return query == null ? null : query.getFirst(name);
	}

    @PostMapping("/interesse/{id}")
    public ResponseEntity<?> registrarInteresse(@PathVariable Long id) throws Exception {
        Usuario usuario = securityUserService.loadUserEntityByUsername(getUsernameFromRequest());
        AnimalDoacao animalDoacao = animalDoacaoRepository.findById(id).orElse(null);
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
        animalDoacaoResponse.setIdUsuario(animalDoacao.getDoador().getId());
        animalDoacaoResponse.setData(animalDoacao.getDataPublicacao());
        animalDoacaoResponse.setTitulo(animalDoacao.getTitulo());
        animalDoacaoResponse.setDescricao(animalDoacao.getDescricao());
        animalDoacaoResponse.setAnimal(AnimalConverter.convertAnimalResponse(animalDoacao.getAnimal()));
        animalDoacaoResponse.setId(animalDoacao.getId());
        return animalDoacaoResponse;
    }

}
