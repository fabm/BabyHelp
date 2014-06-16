package pt.babyHelp.services;

import pt.babyHelp.core.cloudEndpoints.CEErrorReturn;

public class BabyHelpConstants{
    public static enum CEError implements CEErrorReturn {
        NOT_AUTHORIZED(0,"O utilizador não está autorizado a aceder á área de '%s'"),
        NOT_AUTHENTICATED(1,"O utilizador não está autenticado"),
        PERSIST(2,"Não foi possível persistir a entidade ''%s"),
        REQUIRED_FIELD(3,"O campo %s é obrigatório")
        ;

        private int code;
        private String message;

        CEError(int code, String message) {
            this.code = code;
            this.message = message;
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
