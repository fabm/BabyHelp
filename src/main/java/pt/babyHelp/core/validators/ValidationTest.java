package pt.babyHelp.core.validators;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 01/01/14
 * Time: 18:06
 * To change this template use File | Settings | File Templates.
 */
public class ValidationTest {

    public static ValidationTest newInstance(){
        return new ValidationTest();
    }

    private boolean allValid = true;
    public void validation(boolean validation){
        allValid = validation && allValid;
    }

    public boolean isAllValid() {
        return allValid;
    }
}
