package pt.babyHelp.services.impl;

import com.google.api.server.spi.config.Named;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.Article;
import pt.babyHelp.bd.BD;
import pt.babyHelp.core.cloudEndpoints.EndPointError;
import pt.babyHelp.core.cloudEndpoints.CEPUtils;
import pt.babyHelp.endPoints.Authorization;
import pt.babyHelp.endPoints.article.ArticleParams;
import pt.babyHelp.endPoints.article.ListIDs;
import pt.babyHelp.services.ArticleService;
import pt.babyHelp.services.BabyHelpConstants;
import pt.babyHelp.services.annotations.InstanceType;
import pt.babyHelp.services.annotations.PhotoUploadClass;
import pt.babyHelp.services.annotations.PhotoUploadMethod;
import pt.babyHelp.services.annotations.PhotoUploadedKey;
import pt.babyHelp.servlets.Upload;

import java.util.*;

@PhotoUploadClass(type = InstanceType.SINGLETONE)
public class ArticleServiceImpl implements ArticleService {
    static {
        Upload.registerUploadClass(ArticleServiceImpl.class);
    }

    private Authorization authorization;

    @Override
    public Map<String, Object> create(Map<String,Object> entryMap) throws EndPointError {

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
            throw new EndPointError(BabyHelpConstants.Error.PERSIST, Article.class.getSimpleName());

        Map<String, Object> map = CEPUtils.createMapAndPut("id", id.getId());
        map.put("message", "Artigo atualizado com sucesso");
        return map;
    }

    @Override
    public Map<String, Object> update(Map<String,Object> entryMap) throws EndPointError {

        ArticleParams articleParams = new ArticleParams(entryMap, ArticleParams.Type.UPDATE);

        Article article = getArticle(articleParams.getId());

        article.setTitle(articleParams.getTitle());
        article.setPhotoKey(articleParams.getPhotoUrl());
        article.setBody(articleParams.getBody());
        article.setSummary(articleParams.getSummary());

        if (article.getAuthorEmail().equals(getAuthorization().getUserFromApp().getEmail()))
            throw new EndPointError(Error.NOT_OWNER.addArgs(article.getTitle(), "atualizá-lo"));

        BD.ofy().save().entity(article).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "updated");
        return map;
    }

    private Article getArticle(Long id) throws EndPointError {
        Article article;
        if (id == null) throw new EndPointError(Error.ID_REQUIRED);
        article = BD.ofy().load().type(Article.class).id(id).now();
        if (article == null)
            throw new EndPointError(Error.ID_NOT_FOUND.addArgs(id.toString()));
        return article;
    }


    @Override
    @PhotoUploadMethod(key = "article-edit")
    public Map<String, Object> updatePhoto(@Named("id") Long id, @PhotoUploadedKey String key) throws EndPointError {
        //getAuthorization().check("atualização do url da foto do artigo", Role.HEALTHTEC);

        Article article = getArticle(id);
        article.setPhotoKey(key);
        BD.ofy().save().entity(article).now();

        return CEPUtils.createMapAndPut("message", "delete");
    }


    @Override
    public Map<String, Object> delete(ListIDs listIds) throws EndPointError {
        long[] ids = listIds.getIds();

        Long[] tIds = new Long[ids.length];
        for (int i = 0; i < ids.length; i++) {
            tIds[i] = ids[i];
        }

        Map<Long, Article> articlesMap = BD.ofy().load().type(Article.class).ids(tIds);

        for (Map.Entry<Long, Article> entry : articlesMap.entrySet()) {
            if (!entry.getValue().getAuthorEmail().equals(getAuthorization().getUserFromApp().getEmail())) {
                throw new EndPointError(Error.NOT_OWNER);
            }
        }

        BD.ofy().delete().entities(articlesMap.values()).now();
        return CEPUtils.createMapAndPut("state", "deleted");
    }


    @Override
    public Map<String, Object> getMyArticles() {


        Query<Article> query = BD.ofy().load().type(Article.class)
                .filter("authorEmail", getAuthorization().getUserFromApp().getEmail());

        return CEPUtils.createMapAndPut("articles", CEPUtils.listMapPojo(query));
    }

    @Override
    public Map<String, Object> get(long id) {
        Article article = BD.ofy().load().type(Article.class).id(id).now();
        return CEPUtils.getMap(article);
    }

    @Override
    public Map<String, Object> listPublic() {
        Query<Article> query = BD.ofy().load().type(Article.class).filter("isPublic", true);
        return CEPUtils.createMapAndPut("articles", CEPUtils.listMapPojo(query));
    }


    @Override
    public void setUser(User user) {
        authorization = new Authorization(user);
    }

    @Override
    public Authorization getAuthorization() {
        return authorization;
    }

}
