package testesOtherProjects.emumExtension;

public interface EnumComparator<T extends Enum<?>> {
    boolean related(T enumValue);
}
