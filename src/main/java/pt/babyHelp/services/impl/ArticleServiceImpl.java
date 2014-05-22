package pt.babyHelp.services.impl;

import com.google.appengine.api.users.User;
import com.googlecode.objectify.cmd.Query;
import com.googlecode.objectify.cmd.QueryKeys;
import pt.babyHelp.bd.Article;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.PersistenceException;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.endPoints.article.ArticleParams;
import pt.babyHelp.services.ArticleService;
import pt.babyHelp.services.UserBHService;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class ArticleServiceImpl implements ArticleService {

    private UserFromApp user;

    @Override
    public Map<String, Object> create(ArticleParams articleParams) throws EndPointError {
        if (articleParams.getTitle() == null)
            throw new EndPointError(Error.FIELD_TITLE_REQUIRED);
        if (articleParams.getBody() == null)
            throw new EndPointError(Error.FIELD_BODY_REUIRED);


        Article article = new Article();
        article.setAuthor(user);

        article.setTitle(articleParams.getTitle());
        article.setFotoUrl(articleParams.getFoto());
        article.setBody(articleParams.getBody());

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
        article.setFotoUrl(articleParams.getFoto());
        article.setBody(articleParams.getBody());

        if (article.getTitle() == null || article.getTitle().isEmpty())
            throw new EndPointError(Error.FIELD_TITLE_REQUIRED);

        if (article.getAuthor().equals(user.getEmail()))
            throw new EndPointError(Error.NOT_OWNER.addArgs(article.getTitle(), "atualizá-lo"));

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "updated");
        return map;
    }


    @Override
    public Map<String, Object> delete(long... ids) throws EndPointError {
        BD.ofy().delete().type(Article.class).ids(ids).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", "deleted");
        return map;
    }

    @Override
    public Map<String, Object> getMyArticles() {
        QueryKeys<Article> keys = BD.ofy().load().type(Article.class).filterKey(user).keys();
        Collection<Article> articleKeys = BD.ofy().load().keys(keys).values();
        Query<Article> query = BD.ofy().load().type(Article.class).filter("author", user);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("body", query.list());
        return map;
    }



    @Override
    public void setUser(User user) throws EndPointError {
        try {
            this.user = new UserFromApp();
            this.user.setEmail(user.getEmail());
            this.user = this.user.loadOrSave();
        } catch (PersistenceException e) {
            throw new EndPointError(UserBHService.Error.PERSISTENCE);
        }
    }
}
