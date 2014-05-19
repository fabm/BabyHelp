package testesOtherProjects.emumExtension;

public interface EnumSetterTypeB {
    void set(GlobalConstants.TypeB typeB);
    void set(ParticularConstants2.TypeB typeB);
    boolean isEnumEqual(GlobalConstants.TypeB typeB);
    boolean isEnumEqual(ParticularConstants2.TypeA typeB);
}
