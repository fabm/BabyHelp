package testesOtherProjects;

public class MissedEnumException extends RuntimeException {
    static final String ERROR = "item %s from enumeration %s is not implemented yet in enumeration %s";
    private Enum itemValue;
    private Class enumDestinyClass;

    public<T extends Enum> MissedEnumException(T itemValue, Class<? extends Enum> enumDestinyClass) {
        this.itemValue = itemValue;
        this.enumDestinyClass = enumDestinyClass;
    }

    public Enum getItemValue(){
        return itemValue;
    }

    public Class<? extends Enum>getSourceClass(){
        return getItemValue().getClass();
    }

    public Class<? extends Enum> getDestinyClass() {
        return enumDestinyClass;
    }

    @Override
    public String getMessage() {
        return String.format(
                ERROR,
                itemValue.name(),
                getSourceClass().getName(),
                getDestinyClass().getName()
        );
    }
}
