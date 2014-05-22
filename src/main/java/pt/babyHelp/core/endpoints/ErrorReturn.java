package pt.babyHelp.core.endpoints;

public interface ErrorReturn {
    String getContext();
    int getCode();
    String getMsg();
}
