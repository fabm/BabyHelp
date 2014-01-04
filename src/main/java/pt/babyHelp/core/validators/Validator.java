package pt.babyHelp.core.validators;

import pt.babyHelp.core.webComponents.inputs.Input;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 31/12/13
 * Time: 11:47
 * To change this template use File | Settings | File Templates.
 */
public interface Validator<T extends Object> {
    boolean validate(Input<T> input);
    String getMessage(Object...args);
}
