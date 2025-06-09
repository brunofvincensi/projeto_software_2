package com.br.petconnect.spring.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
	
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // permite CORS para todos os endpoints
                .allowedOrigins("http://localhost:4200") // origem do seu frontend Angular
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // métodos permitidos
                .allowedHeaders("*") // cabeçalhos permitidos
                .exposedHeaders("Authorization") // Adicione headers que devem ser expostos
                .allowCredentials(true) // permite envio de cookies/autenticação
                .maxAge(3600);
    }

}
