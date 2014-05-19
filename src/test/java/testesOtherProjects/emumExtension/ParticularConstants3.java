package testesOtherProjects.emumExtension;

public interface ParticularConstants3 {
    enum TypeA {
        INHERITANCE,
        C, D;
        private Enum e = null;

        private TypeA() {
           this.e = this;
        }

        public boolean equals(GlobalConstants.TypeA typeA){
            if(e instanceof GlobalConstants.TypeA){
                return typeA == this.e;
            }
            return false;
        }

        public boolean equals(TypeA typeA){
            if(e instanceof TypeA){
                return typeA == this.e;
            }
            return false;
        }


        public TypeA set(GlobalConstants.TypeA typeA){
            if(this==INHERITANCE){
                this.e=typeA;
                return this;
            }else{
                throw new NoSuchFieldError("impossible to set because it's not in inheritance mode");
            }
        }

        public Enum getEnum() {
            return e;
        }
    }
}
