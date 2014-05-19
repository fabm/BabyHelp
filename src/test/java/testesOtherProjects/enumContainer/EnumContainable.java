package testesOtherProjects.enumContainer;

public interface  EnumContainable<T extends Enum> {
    void set(T e);
    Enum getEnum();
}
