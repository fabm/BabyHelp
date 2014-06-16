package pt.babyHelp.core.cloudEndpoints;

import com.google.api.server.spi.config.Transformer;


public class CEReturnTransformer implements Transformer<CEReturn, Object> {

    @Override
    public Object transformTo(CEReturn CEReturn) {
        try {
            return CEReturn.getCEResponse();
        } catch (CEError CEError) {
            return CEError.getMap();
        }
    }

    @Override
    public CEReturn transformFrom(Object object) {
        return null;
    }

}
