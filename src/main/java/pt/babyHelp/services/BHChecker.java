package pt.babyHelp.services;

import pt.core.cloudEndpoints.CEError;
import pt.core.cloudEndpoints.CEErrorReturn;
import pt.core.validators.BeanChecker;
import pt.core.validators.GlobalError;

public class BHChecker {
    private BeanChecker beanChecker = new BeanChecker();

    private static boolean isEqual(CEErrorReturn ceErrorReturn, GlobalError globalError) {
        if (!(ceErrorReturn instanceof GlobalError)) return false;
        return ceErrorReturn == globalError;
    }

    public <T> T check(Object object) throws CEError {
        try {
            return beanChecker.check(object);
        }catch (ClassCastException ex){
            throw new CEError(BabyHelpError.TYPE_NOT_CORRESPOND);
        } catch (CEError ceError) {
            if (isEqual(ceError.getCeErrorReturn(), GlobalError.REQUIRED))
                throw new CEError(BabyHelpError.REQUIRED_FIELD);
            else if (isEqual(ceError.getCeErrorReturn(), GlobalError.EMAIL))
                throw new CEError(BabyHelpError.EMAIL);
            else throw ceError;
        }
    }
}
