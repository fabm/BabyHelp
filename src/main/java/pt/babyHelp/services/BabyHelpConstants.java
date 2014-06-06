package pt.babyHelp.services;

import pt.babyHelp.core.endpoints.ErrorReturn;

public class BabyHelpConstants{
    public static enum Error implements ErrorReturn{
        NOT_AUTHORIZED(0,"O utilizador não está autorizado a aceder á área de '%s'"),
        NOT_AUTHENTICATED(1,"O utilizador não está autenticado")
        ;

        private int code;
        private String message;

        Error(int code, String message) {
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
