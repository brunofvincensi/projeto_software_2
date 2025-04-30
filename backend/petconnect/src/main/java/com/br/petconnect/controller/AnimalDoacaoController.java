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
@RequestMapping("/doacao")
public class AnimalDoacaoController extends PetConnetBaseController {

    @Autowired
    private AnimalDoacaoRepository animalDoacaoRepository;

    @PostMapping
    public ResponseEntity<?> publicarDoacao(@Valid @RequestBody AnimalDoacaoRequest animalDoacaoRequest) throws Exception {
        if (animalDoacaoRequest == null || animalDoacaoRequest.getAnimal() == null) {
            return ResponseEntity.badRequest().body("Dados inválidos");
        }
        AnimalDoacao animalDoacao = animalDoacaoRepository.save(convertAnimalDoacao(animalDoacaoRequest, getUsernameFromRequest()));
        return ResponseEntity.ok(convertAnimalDoacaoResponse(animalDoacao));
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
        anuncioDoacao.setDoador(new SecurityUserServiceImpl().loadUserEntityByUsername(username));
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


//    /**
//     * Valida o token da requisição e retorna o usuário do token.
//     *
//     * @return o usuário do token
//     * @throws AliasUnauthorizedException se o token não é válido ou qualquer outro erro
//     */
//    protected UserDetails getUserAutenticado() throws Exception {
//        try {
//            String token = getValidJwt();
//            if (token == null) {
//                throw new Exception();
//            }
//
//            Claims body = jwtUtils.getBodyFromToken(token);
//            if (body == null) {
//                throw new Exception();
//            }
//
//            SecurityUser aliasUserDetails = new SecurityUser();
//            aliasUserDetails.setUsername(body.getSubject());
//            aliasUserDetails.setNome(body.get("nome", String.class));
//            aliasUserDetails.setEmail(body.get("email", String.class));
//            aliasUserDetails.setPassword(body.getSubject());
//
//            String _authorities = body.get("authorities", String.class);
//            Collection<GrantedAuthority> authorities = Collections.emptySet();
//            if (_authorities != null) {
//                String[] split = _authorities.split(",");
//                if (split != null && split.length > 0) {
//                    authorities = new HashSet<>(split.length);
//                    for (String authority : split) {
//                        authorities.add(new SimpleGrantedAuthority(authority));
//                    }
//                }
//            }
//            UserDetails userDetails = aliasUserDetails;
//
//            if (userDetails != null) {
//                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
//                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(servletRequest));
//                SecurityContextHolder.getContext().setAuthentication(authentication);
//                return userDetails;
//            }
//            throw new Exception();
//        } catch (Exception e) {
//            throw new Exception();
//        }
//    }

}
