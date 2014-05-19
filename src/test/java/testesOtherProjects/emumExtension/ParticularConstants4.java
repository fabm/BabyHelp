package testesOtherProjects.emumExtension;

public interface ParticularConstants4 {
    enum TypeA implements GlobalConstants.
            ParticuarTypeEnum<GlobalConstants.TypeA,TypeA>{
        INHERITANCE,C,D;

        private TypeA() {
            this.e = this;
        }

        Enum e;

        @Override
        public boolean equals(TypeA p) {
            return p==this;
        }

        @Override
        public void set(TypeA p) {
            this.e=p;
        }

        @Override
        public void set(GlobalConstants.TypeA g) {
            this.e=g;
        }

        @Override
        public Enum getEnum() {
            return this.e;
        }

        @Override
        public boolean equals(GlobalConstants.TypeA e) {
            return this.e == e;
        }

        @Override
        public boolean isGlobal() {
            return GlobalConstants.TypeA.class.isInstance(this.e);
        }
    }

}
