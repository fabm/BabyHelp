package pt.babyHelp.core.cloudEndpoints;

import com.google.api.server.spi.config.Transformer;


public class EndPointReturnTransformer implements Transformer<EndPointReturn, Object> {

    @Override
    public Object transformTo(EndPointReturn endPointReturn) {
        try {
            return endPointReturn.getEndPointResponse();
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @Override
    public EndPointReturn transformFrom(Object object) {
        return null;
    }

}
