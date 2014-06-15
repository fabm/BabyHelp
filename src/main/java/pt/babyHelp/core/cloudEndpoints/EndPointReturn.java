package pt.babyHelp.core.cloudEndpoints;

import com.google.api.server.spi.config.ApiTransformer;

@ApiTransformer(EndPointReturnTransformer.class)
public interface EndPointReturn {

    Object getEndPointResponse() throws EndPointError;

}
