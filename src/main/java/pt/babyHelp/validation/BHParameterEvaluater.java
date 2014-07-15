package pt.babyHelp.validation;

import pt.babyHelp.cloudEndpoints.testes.UserEntry;
import pt.core.cloudEndpoints.parameter.evaluation.CEParameterEvaluater;
import pt.core.cloudEndpoints.parameter.evaluation.ParameterEvaluated;
import pt.gapiap.cloud.endpoints.CEError;
import pt.gapiap.cloud.endpoints.CEReturn;
import pt.gapiap.proccess.validation.EmailChecker;

public class BHParameterEvaluater extends CEParameterEvaluater {


    public BHParameterEvaluater(ParameterEvaluated parameter, CEReturn ceReturn) {
        super(parameter, ceReturn);
    }

    public static CEParameterEvaluater create(UserEntry userCurrent, CEReturn ceReturn) {
        return new BHParameterEvaluater(userCurrent, ceReturn);
    }

    @Override
    protected String getAlias(String name) {
        if(parameter instanceof UserEntry){
            if(name.equals("profession")) return "profissão";
            else if(name.equals("email")) return "e-mail";
        }
        return null;
    }

    @Override
    protected boolean isValid(String name, Object value, String validation) {
        if (validation.equals(BHValidationToRemove.REQUIRED) && !validateRequire(value))
            return false;
        if(validation.equals(BHValidationToRemove.EMAIL) && !EmailChecker.check(value))
            return false;
        return true;
    }

    @Override
    public Object getCEResponse() throws CEError {
        return super.getCEResponse();
    }
}
