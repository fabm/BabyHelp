package testesOtherProjects.emumExtension;

public interface GlobalConstants {
    enum TypeA implements GlobalTypeEnum<TypeA> {
        A, B, C;

        @Override
        public TypeA getEnum() {
            return this;
        }

        @Override
        public boolean equals(TypeA e) {
            return e == this;
        }

        @Override
        public boolean isGlobal() {
            return true;
        }
    }

    enum TypeB implements GlobalTypeEnum<TypeB> {
        A, B, C;

        @Override
        public TypeB getEnum() {
            return this;
        }

        @Override
        public boolean equals(TypeB e) {
            return e == this;
        }

        @Override
        public boolean isGlobal() {
            return true;
        }
    }

    interface GlobalTypeEnum<Tg extends Enum> {
        Enum getEnum();

        boolean equals(Tg e);

        boolean isGlobal();
    }

    interface ParticuarTypeEnum<Tg extends Enum, Tp extends ParticuarTypeEnum>
            extends GlobalTypeEnum<Tg> {
        boolean equals(Tp p);

        void set(Tp p);

        void set(Tg g);
    }

}
