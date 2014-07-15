package pt.babyHelp.services;

import pt.gapiap.cloud.endpoints.CEErrorReturn;

public enum BabyHelpError implements CEErrorReturn {
    NOT_AUTHORIZED,
    NOT_AUTHENTICATED,
    PERSIST,
    REQUIRED_FIELD,
    NO_NAME_USER,
    EMAIL,
    TYPE_NOT_CORRESPOND;

    private static String[] messages;

    static {
        messages = new String[BabyHelpError.values().length];
        messages[NOT_AUTHORIZED.ordinal()] = "O utilizador não está autorizado a aceder á área de '%s'";
        messages[NOT_AUTHENTICATED.ordinal()] = "O utilizador não está autenticado";
        messages[PERSIST.ordinal()] = "Não foi possível persistir a entidade ''%s";
        messages[REQUIRED_FIELD.ordinal()] = "O campo %s é obrigatório";
        messages[NO_NAME_USER.ordinal()] = "Não foi atribuido nome ao utilizador";
    }

    @Override
    public String getContext() {
        return "baby-help";
    }

    @Override
    public int getCode() {
        return this.ordinal();
    }

    @Override
    public String getMsg() {
        return messages[this.ordinal()];
    }
}
