package com.br.petconnect.controller;

import com.br.petconnect.service.SecurityUserServiceImpl;
import com.br.petconnect.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class PetConnetBaseController {

    @Autowired
    protected JwtUtil jwtUtils;

    @Autowired
    protected HttpServletRequest servletRequest;

    @Autowired
    protected SecurityUserServiceImpl securityUserService;

    protected String getUsernameFromRequest() throws Exception {
        String token = getValidJwt();
        if (token == null) {
            throw new Exception();
        }
        Claims body = jwtUtils.getBodyFromToken(token);
        if (body == null) {
            throw new Exception();
        }
        return body.getSubject();
    }

    protected String getValidJwt() throws Exception {
        String token = getJwtFromRequest();
        boolean valid = token != null && jwtUtils.validateToken(token);
        if (!valid) {
            throw new Exception("Token inválido");
        }
        return token;
    }

    /**
     * @return o JWT contido na http request atual
     */
    protected String getJwtFromRequest() {
        return jwtUtils.getJwtFromRequest(servletRequest);
    }

}
