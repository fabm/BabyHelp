package pt.core.cloudEndpoints;

import com.google.api.server.spi.config.Transformer;


public class CEReturnTransformer implements Transformer<CEReturn, Object> {

    @Override
    public Object transformTo(CEReturn ceReturn) {
        try {
            return ceReturn.getCEResponse();
        } catch (CEError CEError) {
            return CEError.getMap();
        }
    }

    @Override
    public CEReturn transformFrom(Object object) {
        return null;
    }

}
