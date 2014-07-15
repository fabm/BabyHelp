package pt.babyHelp.services.article;

import pt.gapiap.cloud.endpoints.CEErrorReturn;

public enum AricleError implements CEErrorReturn {
    NOT_OWNER,
    ID_NOT_FOUND;

    @Override
    public String getContext() {
        return "artigo";
    }

    @Override
    public int getCode() {
        return this.ordinal();
    }

    @Override
    public String getMsg() {
        switch (this){
            case NOT_OWNER:
                return "Não é possível aceder ao artigo pois não é o autor";
            case ID_NOT_FOUND:
                return "Não foi encontrado o artigo com o id:%s";
        }
        return null;
    }
}
