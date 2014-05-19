package pt.babyHelp.core.endpoints;

import com.google.api.server.spi.config.Transformer;

import java.util.HashMap;
import java.util.Map;


public class EndPointReturnTransformer implements Transformer<EndPointReturn, Map<String, ?>> {

    @Override
    public Map<String, ?> transformTo(EndPointReturn endPointReturn) {
        return endPointReturn.toMap();
    }

    @Override
    public EndPointReturn transformFrom(Map<String, ?> stringMap) {
        return null;
    }

}
