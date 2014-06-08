package pt.babyHelp.services.impl;

import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.QueryResultIterable;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.Article;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.PersistenceException;
import pt.babyHelp.bd.Role;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.endPoints.Authorization;
import pt.babyHelp.endPoints.article.ArticleParams;
import pt.babyHelp.endPoints.article.ListIDs;
import pt.babyHelp.services.ArticleService;
import pt.babyHelp.services.annotations.InstanceType;
import pt.babyHelp.services.annotations.PhotoUploadClass;
import pt.babyHelp.services.annotations.PhotoUploadMethod;
import pt.babyHelp.services.annotations.PhotoUploadedKey;
import pt.babyHelp.servlets.Upload;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@PhotoUploadClass(type = InstanceType.SINGLETONE)
public class ArticleServiceImpl implements ArticleService {
    static {
        Upload.registerUploadClass(ArticleServiceImpl.class);
    }

    private Authorization authorization;

    @Override
    public Map<String, Object> create(ArticleParams articleParams) throws EndPointError, UnauthorizedException {

        getAuthorization().check("criação de um artigo", Role.HEALTHTEC);

        if (articleParams.getTitle() == null || articleParams.getTitle().isEmpty())
            throw new EndPointError(Error.FIELD_TITLE_REQUIRED);
        if (articleParams.getBody() == null || articleParams.getBody().isEmpty())
            throw new EndPointError(Error.FIELD_BODY_REUIRED);


        Article article = new Article();
        article.setAuthor(getAuthorization().getRegisteredUser());

        article.setTitle(articleParams.getTitle());
        article.setPhotoUrl(articleParams.getPhotoUrl());
        article.setBody(articleParams.getBody());
        article.setSummary(articleParams.getSummary());


        try {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("id", article.save().getId());
            map.put("message", "Artigo atualizado com sucesso");
            return map;
        } catch (PersistenceException e) {
            throw new EndPointError(Error.SAVE_ERROR);
        }
    }

    @Override
    public Map<String, Object> update(ArticleParams articleParams) throws EndPointError, UnauthorizedException {
        getAuthorization().check("atualização de um artigo", Role.HEALTHTEC);

        Article article = getArticle(articleParams.getId());

        article.setTitle(articleParams.getTitle());
        article.setPhotoUrl(articleParams.getPhotoUrl());
        article.setBody(articleParams.getBody());
        article.setSummary(articleParams.getSummary());

        if (article.getTitle() == null || article.getTitle().isEmpty())
            throw new EndPointError(Error.FIELD_TITLE_REQUIRED);

        if (article.getAuthor().equals(getAuthorization().getUserFromApp().getEmail()))
            throw new EndPointError(Error.NOT_OWNER.addArgs(article.getTitle(), "atualizá-lo"));

        BD.ofy().save().entity(article).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "updated");
        return map;
    }

    private Article getArticle(Long id) throws EndPointError {
        Article article;
        if (id == null) throw new EndPointError(Error.ID_REQUIRED);
        article = BD.ofy().load().type(Article.class).filter("id = ", id).first().now();
        if (article == null)
            throw new EndPointError(Error.ID_NOT_FOUND.addArgs(id.toString()));
        return article;
    }


    @Override
    @PhotoUploadMethod(key = "article-edit")
    public Map<String, Object> updatePhoto(@Named("id") Long id, @PhotoUploadedKey String key)
            throws UnauthorizedException, EndPointError {
        getAuthorization().check("atualização do url da foto do artigo", Role.HEALTHTEC);

        Article article = getArticle(id);
        article.setPhotoUrl(key);
        BD.ofy().save().entity(article).now();

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", "atualizado com sucesso");
        return map;
    }


    @Override
    public Map<String, Object> delete(ListIDs listIds) throws EndPointError, UnauthorizedException {
        getAuthorization().check("remoção de artigos");
        long[] ids = listIds.getIds();

        Long[] tIds = new Long[ids.length];
        for (int i = 0; i < ids.length; i++) {
            tIds[i] = ids[i];
        }

        Map<Long, Article> articlesMap = BD.ofy().load().type(Article.class).ids(tIds);

        for (Map.Entry<Long, Article> entry : articlesMap.entrySet()) {
            if (!entry.getValue().getAuthor().getName().equals(getAuthorization().getUserFromApp().getEmail())) {
                throw new EndPointError(Error.NOT_OWNER);
            }
        }

        BD.ofy().delete().entities(articlesMap.values()).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "deleted");
        return map;
    }


    @Override
    public Map<String, Object> getMyArticles() throws UnauthorizedException {
        getAuthorization().check("artigos do utilizador atual");

        QueryResultIterable<Article> it = BD.ofy().load().type(Article.class)
                .filter("author", getAuthorization().getUserFromApp()).iterable();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        Map<String, Object> articleMap;
        for (Article article : it) {
            articleMap = new HashMap<String, Object>();
            articleMap.put("id", article.getId());
            articleMap.put("body", article.getBody());
            articleMap.put("title", article.getTitle());
            articleMap.put("photo", article.getPhotoUrl());
            articleMap.put("author", article.getAuthor().getName());
            list.add(articleMap);
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("body", list);
        return map;
    }

    @Override
    public Map<String, Object> get(long id) {
        Article article = BD.ofy().load().type(Article.class).id(id).now();
        HashMap<String, Object> articleMap = new HashMap<String, Object>();
        articleMap.put("id", article.getId());
        articleMap.put("body", article.getBody());
        articleMap.put("title", article.getTitle());
        articleMap.put("photo", article.getPhotoUrl());
        articleMap.put("author", article.getAuthor().getName());
        return articleMap;
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
