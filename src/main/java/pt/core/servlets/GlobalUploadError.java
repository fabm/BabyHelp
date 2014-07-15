package pt.core.servlets;

import pt.gapiap.cloud.endpoints.CEErrorReturn;

public enum GlobalUploadError implements CEErrorReturn {
    NO_ACTION_PARAMETER,
    NO_UPLOAD_ACTION_REGISTERED;

    private static String[] messages;

    static {
        messages = new String[GlobalUploadError.values().length];
        messages[NO_ACTION_PARAMETER.ordinal()] = "There is no parameter fo the action";
        messages[NO_UPLOAD_ACTION_REGISTERED.ordinal()] = "There is no upload registered for the action '%s'";
    }

    @Override
    public String getContext() {
        return "upload";
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
