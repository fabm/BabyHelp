package pt.babyHelp.services;

import pt.gapiap.cloud.endpoints.CEErrorReturn;

public class BabyHelp {


    public static enum CEError implements CEErrorReturn {
        NOT_AUTHORIZED(0,"O utilizador não está autorizado a aceder á área de '%s'"),
        NOT_AUTHENTICATED(1,"O utilizador não está autenticado"),
        PERSIST(2,"Não foi possível persistir a entidade ''%s"),
        REQUIRED_FIELD(3,"O campo %s é obrigatório"),
        NO_NAME_USER(4,"Não foi atribuido nome ao utilizador")
        ;

        private int code;
        private String message;

        CEError(int code, String message) {
            this.code = code;
            this.message = message;
        }

        public void setCode(int code){
            this.code = code;
        }

        @Override
        public String getContext() {
            return "baby-help";
        }

        @Override
        public int getCode() {
            return this.code;
        }

        @Override
        public String getMsg() {
            return this.message;
        }
    }
}
