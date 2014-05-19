package testesOtherProjects.emumExtension;

public interface ParticularConstants {
    enum TypeA implements EnumComparator<GlobalConstants.TypeA>{
        A(GlobalConstants.TypeA.A),
        B(GlobalConstants.TypeA.B),
        C(GlobalConstants.TypeA.C);

        GlobalConstants.TypeA correspondence;
        TypeA(GlobalConstants.TypeA typeA) {
            correspondence = typeA;
        }

        @Override
        public boolean related(GlobalConstants.TypeA enumValue) {
            return correspondence==enumValue;
        }
    }
}
