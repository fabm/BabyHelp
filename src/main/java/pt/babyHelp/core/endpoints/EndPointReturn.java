package pt.babyHelp.core.endpoints;

import com.google.api.server.spi.config.ApiTransformer;

import java.util.Map;

@ApiTransformer(EndPointReturnTransformer.class)
public interface EndPointReturn {

    Map<String,Object>toMap();
    Type getType();

    enum Type{
        error,map,state,simple
    }

}
