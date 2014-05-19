package testesOtherProjects.emumExtension;

public interface EnumSetter<T extends Enum<?>> {
    void setEnum(T e);
    boolean isEnumEquals(T e);
}
