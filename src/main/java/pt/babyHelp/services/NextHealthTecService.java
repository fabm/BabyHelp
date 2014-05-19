package pt.babyHelp.services;

import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.endpoints.EndPointReturn;
import pt.babyHelp.endPoints.nextHelthTecEndPoint.ParametersDeleteNHT;
import pt.babyHelp.endPoints.UserAcessible;

import java.util.Map;

public interface NextHealthTecService extends UserAcessible {

    Map<String,Object> delete(ParametersDeleteNHT parametersDeleteNHT) throws EndPointError;

    EndPointReturn add(String email)throws EndPointError;

    EndPointReturn updateMyUser() throws EndPointError;

    EndPointReturn upgradeUser(String email) throws EndPointError;

    Map<String, Object> listPaged(int page, int qtPerPage, boolean extraInfo);
    Map<String, Object> list() throws EndPointError;
}
