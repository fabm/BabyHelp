package pt.babyHelp.core.cloudEndpoints;

public interface CEErrorReturn {
    String getContext();
    int getCode();
    String getMsg();
}