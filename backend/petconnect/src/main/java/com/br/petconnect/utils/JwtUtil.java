package com.br.petconnect.utils;

import com.br.petconnect.model.SecurityUser;
import com.br.petconnect.service.SecurityUserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class JwtUtil {

    private static final String issuer = "PetConnect";
    private static final String secret = "FeQfrEjhH292K1KBUCdfqQSx8aMFdsawKEL7h8mdthBNFQVE2Hpda3g2RthpWk8kLfBP7cHX5Gfmcdx7DJXN2quS";
    private static final long expirationMs = TimeUnit.MINUTES.toMillis(30);
    private static final long refreshExpirationMs = TimeUnit.HOURS.toMillis(1);

    @Autowired
    private SecurityUserServiceImpl securityUserService;

    /**
     * Gera o token de login conforme as informações do usuário.
     *
     * @param securityUser informações do usuário
     * @return JWT de login com informações do usuário
     */
    public String generateLoginToken(SecurityUser securityUser) {
        long currentTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(securityUser.getUsername())
                .claim("nome", securityUser.getNome())
                .claim("phoneNumber", securityUser.getPhoneNumber())
                .claim("id", securityUser.getId())
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(currentTimeMillis + expirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * Gera o token de atualização para renovar a sessão do usuário.
     *
     * @param securityUser informações do usuário
     * @return JWT de atualização
     */
    public String generateRefreshToken(SecurityUser securityUser) {
        long currentTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(securityUser.getUsername())
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(currentTimeMillis + refreshExpirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * Gera um token temporário.
     *
     * @param subject o sujeito do token (username de um acesso por exemplo)
     * @param expirationMs tempo de expiração em milissegundos
     * @return o jwt temporário
     */
    public String generateTempToken(String subject, Long expirationMs) {
        long currentTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(subject)
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(currentTimeMillis + expirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public String generateTempToken(String subject, Long expirationMs, Map<String, Object> claims) {
        long currentTimeMillis = System.currentTimeMillis();
        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(new Date(currentTimeMillis))
                .setExpiration(new Date(currentTimeMillis + expirationMs))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * Faz a validação do token JWT passado.
     *
     * @param authToken token a ser validado
     * @return verdadeiro se o token é válido (não expirado também), falso caso contrário
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(authToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * @param token token a ser extraído o subject
     * @return o subject (userName) relacionado ao token
     */
    public String getUserNameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * @param token token a ser extraído o body
     * @return o body relacionado ao token
     */
    public Claims getBodyFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Extrai o token JWT de uma requisição HTTP.
     *
     * @param request requisição HTTP
     * @return o token JWT extraído
     */
    public String getJwtFromRequest(HttpServletRequest request) {
        String requestTokenHeader = request.getHeader("Authorization");
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            return requestTokenHeader.substring(7);
        }
        return null;
    }

    public Authentication getAuthentication(String token) {
        Claims claims = getBodyFromToken(token);  // Extrai as claims do JWT
        String username = claims.getSubject();  // Aqui, normalmente, você pega o 'sub', que seria o nome de usuário

        // Carregando o UserDetails
        UserDetails userDetails = securityUserService.loadUserByUsername(username);

        // Retorna uma instância de Authentication, que será armazenada no SecurityContextHolder
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

}
