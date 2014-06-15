package pt.babyHelp.core.cloudEndpoints;

public interface ErrorReturn {
    String getContext();
    int getCode();
    String getMsg();
}
