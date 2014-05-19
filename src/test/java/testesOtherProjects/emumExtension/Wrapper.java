package testesOtherProjects.emumExtension;

public class Wrapper implements EnumSetterTypeA,EnumSetterTypeB
{
    private Enum typeA;
    private Enum typeB;


    @Override
    public void set(GlobalConstants.TypeA typeA) {
        this.typeA = typeA;
    }

    @Override
    public void set(ParticularConstants.TypeA typeA) {
        this.typeA = typeA;
    }

    @Override
    public boolean isEnumEqual(GlobalConstants.TypeA typeA) {
        return false;
    }

    @Override
    public boolean isEnumEqual(ParticularConstants.TypeA typeA) {
        return false;
    }

    @Override
    public void set(GlobalConstants.TypeB typeB) {
        this.typeB = typeB;
    }

    @Override
    public void set(ParticularConstants2.TypeB typeB) {
        this.typeB = typeB;
    }

    @Override
    public boolean isEnumEqual(GlobalConstants.TypeB typeB) {
        return this.typeB==typeB;
    }

    @Override
    public boolean isEnumEqual(ParticularConstants2.TypeA typeB) {
        return this.typeB==typeB;
    }
}
