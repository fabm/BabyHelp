package pt.babyHelp.servlets.actions;

import com.google.common.collect.Sets;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.services.ArticleService;
import pt.babyHelp.services.impl.ArticleServiceImpl;
import pt.babyHelp.servlets.Upload;
import pt.babyHelp.servlets.UploadAction;
import pt.babyHelp.servlets.UploadActionCreator;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class UpActionEditArticle implements UploadAction {
    static {
        Upload.registerAction(new UploadActionCreator() {
            @Override
            public UploadAction createInstance() {
                return new UpActionEditArticle();
            }

            @Override
            public String getKey() {
                return "edit-article";
            }
        });
    }

    Map<String,Object> map;
    ArticleService articleService;
    public UpActionEditArticle() {
        map = new HashMap<String, Object>();
        articleService = new ArticleServiceImpl();
    }

    @Override
    public void setContext(String string, String email) {
        map.put("imagekey",email);
    }

    @Override
    public Map<String, Object> getReturn() {
        return map;
    }

    @Override
    public Set<String> getParameters() {
        return Sets.newHashSet("id");
    }

    @Override
    public void setValue(String key, Object value) throws EndPointError {
        if (key.equals("id")) {
            if (value == null) throw new EndPointError(ArticleService.Error.ID_REQUIRED);
        }
    }
}
