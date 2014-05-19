package pt.babyHelp.core.endpoints;


import com.google.api.server.spi.response.BadRequestException;

public class EndPointError extends BadRequestException {

    public EndPointError(ErrorReturn errorReturn) {
        super(errorReturn.getCode() + ":" + errorReturn.getMsg());
    }

}
