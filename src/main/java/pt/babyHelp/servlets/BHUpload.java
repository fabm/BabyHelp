package pt.babyHelp.servlets;

import com.google.api.server.spi.response.UnauthorizedException;
import pt.core.servlets.Upload;

public class BHUpload extends Upload{
    @Override
    protected UnauthorizedException errorAuthorizationOauth() {
        return new UnauthorizedException("É necessário estar autenticado");
    }

    @Override
    protected UnauthorizedException errorAuthorizationUpload() {
        return new UnauthorizedException("Não tem acesso à àrea de upload");
    }
}
