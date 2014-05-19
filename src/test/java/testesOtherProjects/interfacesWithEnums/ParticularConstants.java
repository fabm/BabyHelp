package testesOtherProjects.interfacesWithEnums;

import testesOtherProjects.MissedEnumException;

public interface ParticularConstants {

    public enum TypeEnum {
        A,B,C,D;

        public GeneralConstants.TypeEnum toGlobal() {
            switch (this){
                case A:return GeneralConstants.TypeEnum.ENUM_A;
                case B:return GeneralConstants.TypeEnum.ENUM_B;
            }
            throw new MissedEnumException(this,GeneralConstants.TypeEnum.class);
        }

        public static TypeEnum fromGlobal(GeneralConstants.TypeEnum globalEnum){
            switch (globalEnum){
                case ENUM_A:return A;
                case ENUM_B:return B;
            }
            throw new MissedEnumException(globalEnum,TypeEnum.class);
        }
    }
}
