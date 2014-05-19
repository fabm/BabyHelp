package testesOtherProjects.emumExtension;

public class WrapperEnum{

    private Enum e;
    private Class<? extends Enum>[] typesAccepted;

    public WrapperEnum(Class<? extends Enum>...typesAccepted) {
        this.typesAccepted = typesAccepted;
    }

    private boolean isTypeAccepted(Enum e){
        for (Class<? extends Enum> typeAccepted:typesAccepted){
            if(typeAccepted.isInstance(e)){
                return true;
            }
        }
        return false;
    }

    public WrapperEnum set(Enum e){
        if(!isTypeAccepted(e)){
            throw new IllegalArgumentException("Enumeration is not valid");
        }
        this.e = e;
        return this;
    }

    public boolean equals(Enum e){
        if(e==this.e)
            return true;
        return false;
    }

    public WrapperEnum newInstanceSomeTypeAccepted(){
        return new WrapperEnum(typesAccepted);
    }
}
