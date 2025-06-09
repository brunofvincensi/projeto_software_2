package com.br.petconnect.controller;

import com.br.petconnect.controller.model.request.AnimalDesaparecidoRequest;
import com.br.petconnect.controller.model.request.AnimalDoacaoRequest;
import com.br.petconnect.controller.model.response.AnimalDesaparecidoResponse;
import com.br.petconnect.model.Animal;
import com.br.petconnect.model.AnimalDesaparecido;
import com.br.petconnect.model.AnimalDoacao;
import com.br.petconnect.model.AnimalEspecie;
import com.br.petconnect.repository.AnimalDesaparecidoRepository;
import com.br.petconnect.repository.AnimalDesaparecidoSpecifications;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/animal/desaparecido")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AnimalDesaparecidoController extends PetConnetBaseController {

    @Autowired
    private AnimalDesaparecidoRepository animalDesaparecidoRepository;

    
    @PostMapping
    public void publicarAnimalDesaparecido(
    		@RequestPart("animal") AnimalDesaparecidoRequest animalDesaparecidoRequest,
    		@RequestPart("foto") MultipartFile foto) throws Exception {
    	
    	String fotoPath = salvarFoto(foto);
    	animalDesaparecidoRequest.getAnimal().setImagemUrl(fotoPath);
    	animalDesaparecidoRepository.save(convertAnimalDesaparecido(animalDesaparecidoRequest, getUsernameFromRequest()));
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
    
    @GetMapping("/{id}")
    public ResponseEntity<AnimalDesaparecidoResponse> findBydId(@PathVariable Long id) {
    	AnimalDesaparecido animalDesaparecido = animalDesaparecidoRepository.findById(id).orElse(null);
    	if (animalDesaparecido == null) {
    		return ResponseEntity.badRequest().build();
    	}
    	return ResponseEntity.ok(convertAnimalDesaparecidoResponse(animalDesaparecido));
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<AnimalDesaparecidoResponse>> buscaAnimalDesaparecido(@RequestParam(required = false) MultiValueMap<String, String> query) {
    	String local = getParam(query, "local");
    	
    	AnimalEspecie especie = null;
    	String especieStr = getParam(query, "especie");
    	if (especieStr != null && !especieStr.isBlank()) {
    		especie = AnimalEspecie.valueOf(especieStr);
    	}
    	String nome = getParam(query, "nome");
    	
        Specification<AnimalDesaparecido> spec = Specification.where(AnimalDesaparecidoSpecifications.comLocal(local))
                .and(AnimalDesaparecidoSpecifications.comEspecie(especie))
                .and(AnimalDesaparecidoSpecifications.comNome(nome));
    	
    	List<AnimalDesaparecidoResponse> list = animalDesaparecidoRepository
                .findAll(spec)
                .stream()
                .map(this::convertAnimalDesaparecidoResponse)
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
	
    @DeleteMapping("/{id}")
    public void removerAnimalDesaparecido(@PathVariable Long id) {
        animalDesaparecidoRepository.deleteById(id);
    }

    public AnimalDesaparecido convertAnimalDesaparecido(AnimalDesaparecidoRequest animalDesaparecidoRequest, String username) throws Exception {
        AnimalDesaparecido animalDesaparecido = new AnimalDesaparecido();
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
        animalDesaparecidoResponse.setIdUsuario(animalDesaparecido.getUsuario().getId());
        animalDesaparecidoResponse.setComplemento(animalDesaparecido.getComplemento());
        animalDesaparecidoResponse.setDataDesaparecimento(animalDesaparecido.getDataDesaparecimento());
        animalDesaparecidoResponse.setLocal(animalDesaparecido.getLocal());
        animalDesaparecidoResponse.setAnimal(AnimalConverter.convertAnimalResponse(animalDesaparecido.getAnimal()));
        animalDesaparecidoResponse.setId(animalDesaparecido.getId());
        return animalDesaparecidoResponse;
    }

}
