package testesOtherProjects.emumExtension;

import testesOtherProjects.MissedEnumException;

import java.util.HashMap;

public interface ParticularConstants2 {
    enum TypeA implements EnumComparator<GlobalConstants.TypeA> {
        A, B;

        @Override
        public boolean related(GlobalConstants.TypeA enumValue) {
            switch (enumValue) {
                case A:
                    return this == A;
                case B:
                    return this == B;
            }
            throw new MissedEnumException(this, GlobalConstants.TypeA.class);
        }
    }

    enum TypeB implements EnumComparator<GlobalConstants.TypeB> {
        A, B;
        static HashMap<TypeB, GlobalConstants.TypeB> map;
        static {
            map = new HashMap<TypeB, GlobalConstants.TypeB>();
            map.put(A, GlobalConstants.TypeB.A);
            map.put(B, GlobalConstants.TypeB.B);
        }

        @Override
        public boolean related(GlobalConstants.TypeB enumValue) {
            return map.get(A)!=null;
        }
    }
}
