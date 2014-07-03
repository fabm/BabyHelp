package pt.babyHelp.services.article;

import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.Article;
import pt.babyHelp.bd.BD;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.article.ArticleCreationE;
import pt.babyHelp.cloudEndpoints.article.ArticleUpdateE;
import pt.babyHelp.cloudEndpoints.article.IdArticleE;
import pt.babyHelp.cloudEndpoints.article.ListIDs;
import pt.babyHelp.services.BabyHelp;
import pt.core.cloudEndpoints.Authorization;
import pt.core.cloudEndpoints.CEError;
import pt.core.cloudEndpoints.CEErrorReturn;
import pt.core.cloudEndpoints.CEUtils;
import pt.core.cloudEndpoints.services.CEService;
import pt.core.cloudEndpoints.services.annotations.InstanceType;
import pt.core.cloudEndpoints.services.annotations.PhotoUploadClass;
import pt.core.cloudEndpoints.services.annotations.PhotoUploadMethod;
import pt.core.cloudEndpoints.services.annotations.PhotoUploadedKey;
import pt.core.validators.BeanChecker;
import pt.core.validators.GlobalError;

import java.util.HashMap;
import java.util.Map;

@PhotoUploadClass(type = InstanceType.SINGLETONE)
public class ArticleService implements CEService {

    private Authorization authorization;
    private String method;
    private Object args;
    private BeanChecker beanChecker;

    public static CEService create() {
        return new ArticleService();
    }

    public Map<String, Object> createArticle() throws CEError {

        ArticleCreationE articleCreationE = (ArticleCreationE) args;
        Article article = new Article();
        article.setAuthorEmail(getAuthorization().savedUserFromApp().getEmail());

        article.setTitle(articleCreationE.getTitle());
        article.setPhotoKey(articleCreationE.getPhotoToken());
        article.setBody(articleCreationE.getBody());
        article.setSummary(articleCreationE.getSummary());
        article.setPublic(articleCreationE.isPublic());

        Key<Article> id = BD.ofy().save().entity(article).now();
        if (id == null)
            throw new CEError(BabyHelp.CEError.PERSIST, Article.class.getSimpleName());

        Map<String, Object> map = CEUtils.createMapAndPut("id", id.getId());
        map.put("message", "Artigo atualizado com sucesso");
        return map;
    }

    public Map<String, Object> update() throws CEError {
        @SuppressWarnings("unchecked")
        ArticleUpdateE articleUpdateE = (ArticleUpdateE) args;

        Article article = getArticle(articleUpdateE.getId());

        article.setTitle(articleUpdateE.getTitle());
        article.setPhotoKey(articleUpdateE.getPhotoToken());
        article.setBody(articleUpdateE.getBody());
        article.setSummary(articleUpdateE.getSummary());

        if (article.getAuthorEmail().equals(getAuthorization().getUserFromApp().getEmail()))
            throw new CEError(AricleError.NOT_OWNER, article.getTitle(), "atualizá-lo");

        BD.ofy().save().entity(article).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "updated");
        return map;
    }

    private Article getArticle(Long id) throws CEError {
        Article article;
        if (id == null) throw new CEError(GlobalError.REQUIRED);
        article = BD.ofy().load().type(Article.class).id(id).now();
        if (article == null)
            throw new CEError(AricleError.ID_NOT_FOUND,id.toString());
        return article;
    }


    @PhotoUploadMethod(key = "article-edit")
    public Map<String, Object> updatePhoto(@Named("id") Long id, @PhotoUploadedKey String key) throws CEError {
        Article article = getArticle(id);
        article.setPhotoKey(key);
        BD.ofy().save().entity(article).now();

        return CEUtils.createMapAndPut("message", "delete");
    }


    public Map<String, Object> delete() throws CEError {
        ListIDs listIds = (ListIDs) args;
        long[] ids = listIds.getIds();

        Long[] tIds = new Long[ids.length];
        for (int i = 0; i < ids.length; i++) {
            tIds[i] = ids[i];
        }

        Map<Long, Article> articlesMap = BD.ofy().load().type(Article.class).ids(tIds);

        for (Map.Entry<Long, Article> entry : articlesMap.entrySet()) {
            if (!entry.getValue().getAuthorEmail().equals(getAuthorization().getUserFromApp().getEmail())) {
                throw new CEError(AricleError.NOT_OWNER);
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

    public Map<String, Object> get() throws CEError {
        beanChecker.check(args);
        Article article = BD.ofy().load().type(Article.class).id(((IdArticleE) args).getId()).now();
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
    public CEService execute(User user, String method, Object args) throws UnauthorizedException {
        this.authorization = new BHAuthorization(user);
        this.authorization.check(method);
        this.method = method;
        this.args = args;
        this.beanChecker = new BeanChecker();
        return this;
    }

    @Override
    public Object getCEResponse() throws CEError {
        switch (method) {
            case ArticleAM.CREATE:
                return createArticle();
            case ArticleAM.DELETE:
                return delete();
            case ArticleAM.GET:
                return get();
            case ArticleAM.LIST_PUBLIC:
                return listPublic();
            case ArticleAM.UPDATE:
                return update();
            case ArticleAM.LIST_MY:
                return listMyArticles();
        }
        throw new UnsupportedOperationException(CEErrorReturn.NOT_IMPLEMENTED);
    }


    @Override
    public CEService execute(User user, String action) throws UnauthorizedException {
        return execute(user, action, null);
    }
}
