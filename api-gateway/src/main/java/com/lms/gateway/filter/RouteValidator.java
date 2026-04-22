package com.lms.gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // Token nathuwa yanna puluwan endpoints tika meke danna
    public static final List<String> openApiEndpoints = List.of(
            "/auth/register",
            "/auth/login",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> {
                // 1. මේක OPTIONS request එකක් නම් Token එකක් ඕනෙම නැහැ (Bypass CORS preflight)
                if (request.getMethod().name().equals("OPTIONS")) {
                    return false;
                }
                // 2. නැත්නම් අර openApiEndpoints list එක චෙක් කරනවා
                return openApiEndpoints
                        .stream()
                        .noneMatch(uri -> request.getURI().getPath().contains(uri));
            };
}