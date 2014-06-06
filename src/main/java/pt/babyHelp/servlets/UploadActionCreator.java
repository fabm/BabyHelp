package pt.babyHelp.servlets;

public interface UploadActionCreator {
    UploadAction createInstance();
    String getKey();
}
