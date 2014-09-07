package pt.babyHelp.servlets;

import com.google.api.server.spi.response.UnauthorizedException;
import pt.gapiap.servlets.Upload;

public class BHUpload extends Upload{
    @Override
    protected UnauthorizedException errorAuthorizationOauth() {
        return new UnauthorizedException("É necessário estar autenticado");
    }

}
