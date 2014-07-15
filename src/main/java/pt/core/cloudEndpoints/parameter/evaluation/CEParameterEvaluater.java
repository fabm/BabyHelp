package pt.core.cloudEndpoints.parameter.evaluation;

import pt.gapiap.cloud.endpoints.CEError;
import pt.gapiap.cloud.endpoints.CEReturn;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class CEParameterEvaluater implements CEReturn {

    protected ParameterEvaluated parameter;

    protected CEReturn ceReturn;

    public static boolean validateRequire(Object value) {
        if (value == null)
            return false;
        if (value instanceof String && ((String) value).isEmpty())
            return false;
        return true;
    }


    @Override
    public Object getCEResponse() throws CEError {
        if (parameter.isDefinitionRequest()) {
            return getDefenition();
        } else {
            for (Field field : parameter.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                Evaluation eval = field.getAnnotation(Evaluation.class);
                if (eval != null) {
                    for (String validation : eval.validations()) {
                        try {
                            isValid(field.getName(), field.get(parameter), validation);
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
            return ceReturn.getCEResponse();
        }
    }

    public CEParameterEvaluater(ParameterEvaluated parameter, CEReturn ceReturn) {
        this.parameter = parameter;
        this.ceReturn = ceReturn;
    }

    protected abstract boolean isValid(String name, Object value, String validation);

    protected List<String> getValidationsList(Evaluation evalAnnot) {
        return Arrays.asList(evalAnnot.validations());
    }

    protected String getAlias(String name) {
        return null;
    }

    protected CEReturn getDefenition() {
        final Map<String, Object> parameterReturn = new HashMap<String, Object>();
        Field[] fields = parameter.getClass().getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            Map<String, Object> fieldPropertie = new HashMap<String, Object>();
            Evaluation evalAnnot = field.getAnnotation(Evaluation.class);
            if (evalAnnot != null) {
                if (evalAnnot.validations().length != 0)
                    fieldPropertie.put("validations", getValidationsList(evalAnnot));
                String name = evalAnnot.name();
                if (name.isEmpty())
                    name = field.getName();
                String alias = getAlias(name);
                if (alias != null)
                    fieldPropertie.put("alias", getAlias(name));
                fieldPropertie.put("type", getType(field));
                parameterReturn.put(name, fieldPropertie);
            }
        }
        return new CEReturn() {
            @Override
            public Object getCEResponse() throws CEError {
                return parameterReturn;
            }
        };
    }

    protected String getType(Field field) {
        return field.getType().getSimpleName();
    }
}
