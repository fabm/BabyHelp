package pt.babyHelp.services.article;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.Article;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.UserFromApp;

import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.article.ArticleCreationE;
import pt.babyHelp.cloudEndpoints.article.ArticleUpdateE;
import pt.babyHelp.cloudEndpoints.article.IdArticleE;
import pt.babyHelp.cloudEndpoints.article.ListIDs;
import pt.babyHelp.services.BHChecker;
import pt.babyHelp.services.BabyHelp;
import pt.babyHelp.services.RolesValidation;
import pt.core.cloudEndpoints.CEUtils;
import pt.core.cloudEndpoints.services.CEService;
import pt.core.cloudEndpoints.services.annotations.InstanceType;
import pt.core.cloudEndpoints.services.annotations.PhotoUploadClass;
import pt.core.cloudEndpoints.services.annotations.PhotoUploadMethod;
import pt.core.cloudEndpoints.services.annotations.PhotoUploadedKey;
import pt.core.validation.GlobalError;
import pt.gapiap.cloud.endpoints.Authorization;
import pt.gapiap.cloud.endpoints.CEError;
import pt.gapiap.cloud.endpoints.CEErrorReturn;
import pt.gapiap.proccess.annotations.MappedAction;
import pt.gapiap.services.Dispatcher;

import java.util.HashMap;
import java.util.Map;

@PhotoUploadClass(type = InstanceType.SINGLETONE)
public class ArticleService {


    @MappedAction(value = ArticleApiMap.CREATE,area = "criação de um artigo")
    @RolesValidation(Role.HEALTHTEC)
    public Map<String, Object> createArticle(ArticleCreationE articleCreationE) throws CEError {

        Article article = new Article();
        article.setAuthorEmail(getAuthorization().savedUserFromApp().getEmail());

        article.setTitle(articleCreationE.getTitle());
        article.setPhotoKey(articleCreationE.getPhotoToken());
        article.setBody(articleCreationE.getBody());
        article.setSummary(articleCreationE.getSummary());
        article.setPublic(articleCreationE.isPublic());

        Key<Article> id = BD.ofy().save().entity(article).now();
        if (id == null) {
            throw new CEError(BabyHelp.CEError.PERSIST, Article.class.getSimpleName());
        }

        Map<String, Object> map = CEUtils.createMapAndPut("id", id.getId());
        map.put("message", "Artigo atualizado com sucesso");
        return map;
    }


    @MappedAction(value = ArticleApiMap.UPDATE,area = "atualização de um artigo")
    public Map<String, Object> update(ArticleUpdateE articleUpdateE) throws CEError {
        @SuppressWarnings("unchecked")

        Article article = getArticle(articleUpdateE.getId());

        article.setTitle(articleUpdateE.getTitle());
        article.setPhotoKey(articleUpdateE.getPhotoToken());
        article.setBody(articleUpdateE.getBody());
        article.setSummary(articleUpdateE.getSummary());

        if (article.getAuthorEmail().equals(getAuthorization().getUserWithRoles().getEmail())) {
            throw new CEError(AricleError.NOT_OWNER, article.getTitle(), "atualizá-lo");
        }

        BD.ofy().save().entity(article).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "updated");
        return map;
    }

    private Article getArticle(Long id) throws CEError {
        Article article;
        if (id == null) {
            throw new CEError(GlobalError.REQUIRED);
        }
        article = BD.ofy().load().type(Article.class).id(id).now();
        if (article == null) {
            throw new CEError(AricleError.ID_NOT_FOUND, id.toString());
        }
        return article;
    }


    @PhotoUploadMethod(key = "article-edit")
    public Map<String, Object> updatePhoto(@Named("id") Long id, @PhotoUploadedKey String key) throws CEError {
        Article article = getArticle(id);
        article.setPhotoKey(key);
        BD.ofy().save().entity(article).now();

        return CEUtils.createMapAndPut("message", "delete");
    }


    @MappedAction(value = ArticleApiMap.DELETE,area = "delete")
    public Map<String, Object> delete(ListIDs listIDs) throws CEError {
        long[] ids = listIDs.getIds();

        Long[] tIds = new Long[ids.length];
        for (int i = 0; i < ids.length; i++) {
            tIds[i] = ids[i];
        }

        Map<Long, Article> articlesMap = BD.ofy().load().type(Article.class).ids(tIds);

        for (Map.Entry<Long, Article> entry : articlesMap.entrySet()) {
            if (!entry.getValue().getAuthorEmail().equals(getAuthorization().getUserWithRoles().getEmail())) {
                throw new CEError(AricleError.NOT_OWNER);
            }
        }

        BD.ofy().delete().entities(articlesMap.values()).now();
        return CEUtils.createMapAndPut("state", "deleted");
    }


    @MappedAction(value = ArticleApiMap.LIST_MY, area = "lista dos artigos do autor")
    public Map<String, Object> listMyArticles() {
    Query<Article> query = BD.ofy().load().type(Article.class)
                .filter("authorEmail", getAuthorization().getUserWithRoles().getEmail());

        return CEUtils.createMapAndPut("articles", CEUtils.listMapPojo(query));
    }

    @MappedAction(value = ArticleApiMap.GET,area = "detalhe do artigo")
    public Map<String, Object> get(IdArticleE idArticleE) throws CEError {
        Article article = BD.ofy().load().type(Article.class).id(idArticleE.getId()).now();
        return CEUtils.getMap(article);
    }

    @MappedAction(value = ArticleApiMap.LIST_PUBLIC,area = "lista dos artigos públicos")
    public Map<String, Object> listPublic() {
        Query<Article> query = BD.ofy().load().type(Article.class).filter("isPublic", true);
        return CEUtils.createMapAndPut("articles", CEUtils.listMapPojo(query));
    }



}
