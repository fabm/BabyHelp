package pt.core;

import com.google.common.collect.Lists;
import pt.gapiap.cloud.endpoints.errors.ErrorArea;
import pt.gapiap.cloud.endpoints.errors.ErrorManager;
import pt.gapiap.cloud.endpoints.errors.GlobalErrorArea;
import pt.gapiap.proccess.validation.defaultValidator.languages.DefaultValidatorErrorArea;
import pt.gapiap.servlets.language.UploadErrorArea;

import java.util.ArrayList;
import java.util.List;

public class BHErrorManager extends ErrorManager {
  @Override
  public List<ErrorArea> getErrorAreas() {
    ArrayList<ErrorArea> list = Lists.newArrayList(
        new GlobalErrorArea(),
        new UploadErrorArea(),
        new DefaultValidatorErrorArea()
    );
    return list;
  }
}
