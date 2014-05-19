package testesOtherProjects.constants.particularConstants;
public enum TypeA {
    A,B;

    public static String ERROR="not yet implemented";

    public testesOtherProjects.constants.globalConstants.TypeA
    toGlobal(){
        switch (this){
            case A:return testesOtherProjects.constants.globalConstants.TypeA.A;
            case B:return testesOtherProjects.constants.globalConstants.TypeA.B;
        }
        throw new IllegalArgumentException(ERROR);
    }

    public static TypeA fromGlobal(
            testesOtherProjects.constants.globalConstants.TypeA typeA
    ){
        switch (typeA){
            case A:return A;
            case B:return B;
        }
        throw new IllegalArgumentException(ERROR);
    }
}
