package testesOtherProjects.emumExtension;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 02/02/14
 * Time: 14:37
 * To change this template use File | Settings | File Templates.
 */
public interface EnumSetterTypeA {
    void set(GlobalConstants.TypeA typeA);
    void set(ParticularConstants.TypeA typeA);
    boolean isEnumEqual(GlobalConstants.TypeA typeA);
    boolean isEnumEqual(ParticularConstants.TypeA typeA);
}
