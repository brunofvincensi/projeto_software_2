package com.br.petconnect.controller;

import com.br.petconnect.controller.model.request.CampanhaSolidariaRequest;
import com.br.petconnect.controller.model.response.CampanhaSolidariaResponse;
import com.br.petconnect.model.CampanhaSolidaria;
import com.br.petconnect.model.Role;
import com.br.petconnect.model.Usuario;
import com.br.petconnect.repository.CampanhaSolidariaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/campanha_solidaria")
public class CampanhaSolidariaController extends PetConnetBaseController {

    @Autowired
    private CampanhaSolidariaRepository campanhaSolidariaRepository;

    @PostMapping
    public ResponseEntity<?> criarCampanha(@Valid @RequestBody CampanhaSolidariaRequest campanhaSolidariaRequest) throws Exception {
        Usuario usuario = securityUserService.loadUserEntityByUsername(getUsernameFromRequest());
        // Apenas usuários de abrigo podem criar campanha
        if (usuario == null || !Role.ABRIGO_ANIMAIS.equals(usuario.getRole())) {
            return ResponseEntity.badRequest().build();
        }
        CampanhaSolidaria campanhaSolidaria = convertCampanha(campanhaSolidariaRequest, usuario);
        campanhaSolidariaRepository.save(campanhaSolidaria);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<CampanhaSolidariaResponse>> buscaDoacoes() {
        List<CampanhaSolidariaResponse> list = campanhaSolidariaRepository
                .findAll()
                .stream()
                .map(this::converCampanhaResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    private CampanhaSolidariaResponse converCampanhaResponse(CampanhaSolidaria campanhaSolidaria) {
        CampanhaSolidariaResponse response = new CampanhaSolidariaResponse();

        response.setDataInicio(campanhaSolidaria.getDataInicio());
        response.setTitulo(campanhaSolidaria.getTitulo());
        response.setDescricao(campanhaSolidaria.getDescricao());
        response.setMeta(campanhaSolidaria.getMeta());
        response.setDataFim(campanhaSolidaria.getDataFim());
        response.setValorArrecadado(campanhaSolidaria.getValorArrecadado());

        return response;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarCampanha(@Valid @RequestBody CampanhaSolidariaRequest campanhaSolidariaRequest) throws Exception {
        CampanhaSolidaria campanhaSolidaria = campanhaSolidariaRepository.findById(campanhaSolidariaRequest.getId()).orElse(null);
        if (campanhaSolidaria == null) {
            return ResponseEntity.badRequest().build();
        }

        Usuario usuario = securityUserService.loadUserEntityByUsername(getUsernameFromRequest());
        if (!campanhaSolidaria.getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.badRequest().build();
        }

        convertCampanha(campanhaSolidariaRequest, campanhaSolidaria);
        campanhaSolidariaRepository.save(campanhaSolidaria);
        return ResponseEntity.ok().build();
    }

    private static CampanhaSolidaria convertCampanha(CampanhaSolidariaRequest campanhaSolidariaRequest, Usuario usuario) {
        CampanhaSolidaria campanhaSolidaria = new CampanhaSolidaria();
        campanhaSolidaria.setUsuario(usuario);
        return convertCampanha(campanhaSolidariaRequest, campanhaSolidaria);
    }

    private static CampanhaSolidaria convertCampanha(CampanhaSolidariaRequest campanhaSolidariaRequest, CampanhaSolidaria campanhaSolidaria) {
        campanhaSolidaria.setDataInicio(LocalDate.now());
        campanhaSolidaria.setTitulo(campanhaSolidariaRequest.getTitulo());
        campanhaSolidaria.setDescricao(campanhaSolidariaRequest.getDescricao());
        campanhaSolidaria.setMeta(campanhaSolidariaRequest.getMeta());
        campanhaSolidaria.setDataFim(campanhaSolidariaRequest.getDataFim());
        return campanhaSolidaria;
    }

}
