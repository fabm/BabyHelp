package pt.babyHelp.bd;

public class PersistenceException extends Exception{
    BD bdObject;

    public PersistenceException(BD bdObject) {
        super("It is not possible persist the object of class:"+
                bdObject.getClass().getName()+" ");
        this.bdObject = bdObject;
    }
}
