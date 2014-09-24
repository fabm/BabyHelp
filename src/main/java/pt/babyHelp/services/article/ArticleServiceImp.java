package pt.babyHelp.services.article;

import com.google.api.server.spi.config.Named;
import com.google.common.collect.ImmutableMap;
import com.google.inject.Inject;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.Article;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.article.ArticleCreationE;
import pt.babyHelp.cloudEndpoints.article.ArticleUpdateE;
import pt.babyHelp.cloudEndpoints.article.IdArticleE;
import pt.babyHelp.cloudEndpoints.article.ListIDs;
import pt.gapiap.cloud.endpoints.authorization.Authorization;
import pt.gapiap.cloud.endpoints.errors.CEError;
import pt.gapiap.cloud.endpoints.errors.ErrorManager;
import pt.gapiap.cloudEndpoints.services.annotations.InstanceType;
import pt.gapiap.cloudEndpoints.services.annotations.PhotoUploadClass;
import pt.gapiap.cloudEndpoints.services.annotations.PhotoUploadMethod;
import pt.gapiap.cloudEndpoints.services.annotations.PhotoUploadedKey;
import pt.gapiap.proccess.annotations.MappedAction;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@PhotoUploadClass(type = InstanceType.SINGLETONE)
public class ArticleServiceImp implements ArticleService {

  @Inject
  private ErrorManager errorManager;

  @Override
  public Object createArticle(ArticleCreationE articleCreationE, Authorization<Role, UserFromApp> authorization) throws CEError {

    Article article = new Article();
    article.setAuthorEmail(authorization.savedUser().getEmail());

    article.setTitle(articleCreationE.getTitle());
    article.setPhotoKey(articleCreationE.getPhotoToken());
    article.setBody(articleCreationE.getBody());
    article.setSummary(articleCreationE.getSummary());
    article.setPublic(articleCreationE.isPublic());

    Key<Article> id = BD.ofy().save().entity(article).now();

    return ImmutableMap.builder()
        .put("id", id.getId())
        .put("message", "Artigo atualizado com sucesso")
        .build();
  }

  private void testNotUsed() {

  }


  @Override
  public Map<String, String> update(ArticleUpdateE articleUpdateE, Authorization<Role, UserFromApp> authorization) throws CEError {
    @SuppressWarnings("unchecked")

    Article article = getArticle(articleUpdateE.getId());

    article.setTitle(articleUpdateE.getTitle());
    article.setPhotoKey(articleUpdateE.getPhotoToken());
    article.setBody(articleUpdateE.getBody());
    article.setSummary(articleUpdateE.getSummary());

    if (article.getAuthorEmail().equals(authorization.getUserWithRoles().getEmail())) {
    }

    BD.ofy().save().entity(article).now();
    return ImmutableMap.of("state", "updated");
  }

  private Article getArticle(Long id) throws CEError {
    Article article;
    article = BD.ofy().load().type(Article.class).id(id).now();
    if (article == null) {
      return null;
    }
    return article;
  }


  @Override
  @PhotoUploadMethod(key = "article-edit")
  public ImmutableMap<String, String> updatePhoto(@Named("id") Long id, @PhotoUploadedKey String key) throws CEError {
    Article article = getArticle(id);
    article.setPhotoKey(key);
    BD.ofy().save().entity(article).now();

    return ImmutableMap.of("message", "delete");
  }


  @Override
  public ImmutableMap<String, String> delete(ListIDs listIDs, Authorization<Role, UserFromApp> authorization) throws CEError {
    long[] ids = listIDs.getIds();

    Long[] tIds = new Long[ids.length];
    for (int i = 0; i < ids.length; i++) {
      tIds[i] = ids[i];
    }

    Map<Long, Article> articlesMap = BD.ofy().load().type(Article.class).ids(tIds);

    for (Map.Entry<Long, Article> entry : articlesMap.entrySet()) {
      if (!entry.getValue().getAuthorEmail().equals(authorization.getUserWithRoles().getEmail())) {

      }
    }

    BD.ofy().delete().entities(articlesMap.values()).now();
    return ImmutableMap.of("state", "deleted");
  }


  @Override
  public ImmutableMap<String, List<Map<String, Object>>> listMyArticles(Authorization<Role, UserFromApp> authorization) {
    Query<Article> query = BD.ofy().load().type(Article.class)
        .filter("authorEmail", authorization.getUserWithRoles().getEmail());

    List<Map<String, Object>> mapList = new ArrayList<>(query.count());

    for (Article article : query) {
      mapList.add(article.toMap());
    }

    return ImmutableMap.of("articles", mapList);
  }

  @Override
  public Map<String, Object> get(IdArticleE idArticleE) throws CEError {
    Article article = BD.ofy().load().type(Article.class).id(idArticleE.getId()).now();
    return article.toMap();
  }

  @Override
  public List<Map<String, Object>> listPublic() {
    Query<Article> query = BD.ofy().load().type(Article.class).filter("isPublic", true);

    List<Map<String, Object>> mapList = new ArrayList<>(query.count());

    for (Article article : query) {
      mapList.add(article.toMap());
    }

    return mapList;
  }
}
