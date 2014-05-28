package pt.babyHelp.services.impl;

import com.google.appengine.api.datastore.QueryResultIterable;
import com.googlecode.objectify.ObjectifyService;
import pt.babyHelp.bd.Article;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.PersistenceException;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.session.UserContext;
import pt.babyHelp.endPoints.article.ArticleParams;
import pt.babyHelp.endPoints.article.ListIDs;
import pt.babyHelp.services.ArticleService;

import java.util.*;

public class ArticleServiceImpl implements ArticleService {
    static {
        ObjectifyService.register(Article.class);
    }

    private UserContext userContext;

    @Override
    public Map<String, Object> create(ArticleParams articleParams) throws EndPointError {
        if (articleParams.getTitle() == null || articleParams.getTitle().isEmpty())
            throw new EndPointError(Error.FIELD_TITLE_REQUIRED);
        if (articleParams.getBody() == null || articleParams.getBody().isEmpty())
            throw new EndPointError(Error.FIELD_BODY_REUIRED);


        Article article = new Article();
        article.setAuthor(userContext.getUserFromApp());

        article.setTitle(articleParams.getTitle());
        article.setPhotoUrl(articleParams.getPhotoUrl());
        article.setBody(articleParams.getBody());
        article.setSummary(articleParams.getSummary());

        try {
            article.save();
        } catch (PersistenceException e) {
            throw new EndPointError(Error.SAVE_ERROR);
        }

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "created");
        return map;
    }

    @Override
    public Map<String, Object> update(ArticleParams articleParams) throws EndPointError {
        Article article;

        if (articleParams.getId() == null) throw new EndPointError(Error.ID_REQUIRED);
        article = BD.ofy().load().type(Article.class).filter("id = ", articleParams.getId()).first().now();
        if (article == null)
            throw new EndPointError(Error.ID_NOT_FOUND.addArgs(articleParams.getId().toString()));

        article.setTitle(articleParams.getTitle());
        article.setPhotoUrl(articleParams.getPhotoUrl());
        article.setBody(articleParams.getBody());
        article.setSummary(articleParams.getSummary());

        if (article.getTitle() == null || article.getTitle().isEmpty())
            throw new EndPointError(Error.FIELD_TITLE_REQUIRED);

        if (article.getAuthor().equals(userContext.getUserFromApp().getEmail()))
            throw new EndPointError(Error.NOT_OWNER.addArgs(article.getTitle(), "atualizá-lo"));

        BD.ofy().save().entity(article).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "updated");
        return map;
    }


    @Override
    public Map<String, Object> delete(ListIDs listIds) throws EndPointError {

        long[] ids = listIds.getIds();

        Long[] tIds = new Long[ids.length];
        for(int i=0;i<ids.length;i++){tIds[i]=ids[i];}

        Map<Long, Article> articlesMap = BD.ofy().load().type(Article.class).ids(tIds);

        for (Map.Entry<Long,Article> entry: articlesMap.entrySet()){
            if(!entry.getValue().getAuthor().getName().equals(userContext.getUserFromApp().getEmail())){
                throw new EndPointError(Error.NOT_OWNER);
            }
        }

        BD.ofy().delete().entities(articlesMap.values()).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "deleted");
        return map;
    }

    @Override
    public Map<String, Object> getMyArticles() {

        QueryResultIterable<Article> it = BD.ofy().load().type(Article.class).filter("author", userContext.getUserFromApp()).iterable();
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
    public void setUserContext(UserContext userContext) throws EndPointError {
        this.userContext = userContext;
    }
}
