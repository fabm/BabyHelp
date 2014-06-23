package pt.babyHelp.services.article;

import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.Article;
import pt.babyHelp.bd.BD;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.article.ArticleParams;
import pt.babyHelp.cloudEndpoints.article.ListIDs;
import pt.babyHelp.services.BabyHelp;
import pt.babyHelp.services.annotations.InstanceType;
import pt.babyHelp.services.annotations.PhotoUploadClass;
import pt.babyHelp.services.annotations.PhotoUploadMethod;
import pt.babyHelp.services.annotations.PhotoUploadedKey;
import pt.core.cloudEndpoints.Authorization;
import pt.core.cloudEndpoints.CEError;
import pt.core.cloudEndpoints.CEErrorReturn;
import pt.core.cloudEndpoints.CEUtils;
import pt.core.cloudEndpoints.services.CEService;

import java.util.HashMap;
import java.util.Map;

@PhotoUploadClass(type = InstanceType.SINGLETONE)
public class ArticleService implements CEService<ArticleAM> {

    private Authorization authorization;
    private ArticleAM action;
    private Object[] args;

    public static CEService<ArticleAM> create() {
        return new ArticleService();
    }

    public Map<String, Object> createArticle() throws CEError {

        @SuppressWarnings("unchecked")
        Map<String, Object> entryMap = (Map<String, Object>) args[0];

        ArticleParams articleParams = new ArticleParams(entryMap, ArticleParams.Type.CREATE);

        Article article = new Article();
        article.setAuthorEmail(getAuthorization().savedUserFromApp().getEmail());

        article.setTitle(articleParams.getTitle());
        article.setPhotoKey(articleParams.getPhotoUrl());
        article.setBody(articleParams.getBody());
        article.setSummary(articleParams.getSummary());
        article.setPublic(articleParams.isPublic());

        Key<Article> id = BD.ofy().save().entity(article).now();
        if (id == null)
            throw new CEError(BabyHelp.CEError.PERSIST, Article.class.getSimpleName());

        Map<String, Object> map = CEUtils.createMapAndPut("id", id.getId());
        map.put("message", "Artigo atualizado com sucesso");
        return map;
    }

    public Map<String, Object> update() throws CEError {
        @SuppressWarnings("unchecked")
        Map<String, Object> entryMap = (Map<String, Object>) args[0];
        ArticleParams articleParams = new ArticleParams(entryMap, ArticleParams.Type.UPDATE);

        Article article = getArticle(articleParams.getId());

        article.setTitle(articleParams.getTitle());
        article.setPhotoKey(articleParams.getPhotoUrl());
        article.setBody(articleParams.getBody());
        article.setSummary(articleParams.getSummary());

        if (article.getAuthorEmail().equals(getAuthorization().getUserFromApp().getEmail()))
            throw new CEError(CEErrorR.NOT_OWNER.addArgs(article.getTitle(), "atualizá-lo"));

        BD.ofy().save().entity(article).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "updated");
        return map;
    }

    private Article getArticle(Long id) throws CEError {
        Article article;
        if (id == null) throw new CEError(CEErrorR.ID_REQUIRED);
        article = BD.ofy().load().type(Article.class).id(id).now();
        if (article == null)
            throw new CEError(CEErrorR.ID_NOT_FOUND.addArgs(id.toString()));
        return article;
    }


    @PhotoUploadMethod(key = "article-edit")
    public Map<String, Object> updatePhoto(@Named("id") Long id, @PhotoUploadedKey String key) throws CEError {
        //getAuthorization().check("atualização do url da foto do artigo", Role.HEALTHTEC);

        Article article = getArticle(id);
        article.setPhotoKey(key);
        BD.ofy().save().entity(article).now();

        return CEUtils.createMapAndPut("message", "delete");
    }


    public Map<String, Object> delete() throws CEError {
        ListIDs listIds = (ListIDs) args[0];
        long[] ids = listIds.getIds();

        Long[] tIds = new Long[ids.length];
        for (int i = 0; i < ids.length; i++) {
            tIds[i] = ids[i];
        }

        Map<Long, Article> articlesMap = BD.ofy().load().type(Article.class).ids(tIds);

        for (Map.Entry<Long, Article> entry : articlesMap.entrySet()) {
            if (!entry.getValue().getAuthorEmail().equals(getAuthorization().getUserFromApp().getEmail())) {
                throw new CEError(CEErrorR.NOT_OWNER);
            }
        }

        BD.ofy().delete().entities(articlesMap.values()).now();
        return CEUtils.createMapAndPut("state", "deleted");
    }


    public Map<String, Object> listMyArticles() {


        Query<Article> query = BD.ofy().load().type(Article.class)
                .filter("authorEmail", getAuthorization().getUserFromApp().getEmail());

        return CEUtils.createMapAndPut("articles", CEUtils.listMapPojo(query));
    }

    public Map<String, Object> get() {
        Article article = BD.ofy().load().type(Article.class).id((Long) args[0]).now();
        return CEUtils.getMap(article);
    }

    public Map<String, Object> listPublic() {
        Query<Article> query = BD.ofy().load().type(Article.class).filter("isPublic", true);
        return CEUtils.createMapAndPut("articles", CEUtils.listMapPojo(query));
    }


    public void setUser(User user) {
        authorization = new BHAuthorization(user);
    }

    public Authorization getAuthorization() {
        return authorization;
    }

    @Override
    public CEService<ArticleAM> execute(User user, ArticleAM action, Object... args) throws UnauthorizedException {
        this.authorization = new BHAuthorization(user);

        this.authorization.check(action);
        this.action = action;
        this.args = args;
        return this;
    }

    @Override
    public Object getCEResponse() throws CEError {
        switch (action) {
            case CREATE:
                return createArticle();
            case DELETE:
                return delete();
            case GET:
                return get();
            case LIST_PUBLIC:
                return listPublic();
            case UPDATE:
                return update();
            case LIST_MY:
                return listMyArticles();
        }
        throw new UnsupportedOperationException(CEErrorReturn.NOT_IMPLEMENTED);
    }

    enum CEErrorR implements CEErrorReturn {
        WRONG_ROLE(1, "Não tem previlégios suficientes para executar esta ação"),
        ID_REQUIRED(2, "O id é obrigatório para atualizar o artigo"),
        ID_NOT_FOUND(3, "Não foi encontrado nenhum artigo com o id %s"),
        NOT_OWNER(4, "Não é o proprietário do artigo '%s', por isso não pode %s"),
        FIELD_REQUIRED(5, "O campo %s é obrigatório");

        private String msg;
        private int code;

        CEErrorR(int code, String msg) {
            this.msg = msg;
            this.code = code;
        }

        @Override
        public int getCode() {
            return this.code;
        }

        @Override
        public String getMsg() {
            return this.msg;
        }

        public CEErrorR addArgs(String... vars) {
            this.msg = String.format(msg, vars);
            return this;
        }

        @Override
        public String getContext() {
            return "article";
        }
    }

}
