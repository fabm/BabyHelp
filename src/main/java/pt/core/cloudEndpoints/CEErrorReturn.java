package pt.core.cloudEndpoints;

public interface CEErrorReturn {
    public static final String NOT_IMPLEMENTED = "Not implemented yet";

    String getContext();

    int getCode();

    String getMsg();
}
