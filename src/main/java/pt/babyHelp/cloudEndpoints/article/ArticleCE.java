package pt.babyHelp.cloudEndpoints.article;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.BHACLInvoker;
import pt.babyHelp.services.article.ArticleApiMap;
import pt.babyHelp.services.article.ArticleService;
import pt.gapiap.cloud.endpoints.errors.CEError;

import static com.google.api.server.spi.config.ApiMethod.HttpMethod;

@Api(name = ArticleApiMap.API,
    version = "v1",
    description = "Endpoint dos artigos do BabyHelp",
    scopes = {Constants.EMAIL},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
        Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
    audiences = {Constants.ANDROID_AUDIENCE}
)
public class ArticleCE {

  private BHACLInvoker<ArticleService> getACL(User user) {
    return null;
  }

  private BHACLInvoker<ArticleService> getACL() {
    return null;
  }

  @ApiMethod(name = ArticleApiMap.CREATE, httpMethod = HttpMethod.PUT, path = "create")
  public Object createArticle(User user, ArticleCreationE articleCreationE) throws UnauthorizedException, CEError {
    BHACLInvoker<ArticleService> aclInvoker = getACL(user);
    return aclInvoker.execute().createArticle(articleCreationE, aclInvoker.getAuthorization());
  }


  @ApiMethod(name = ArticleApiMap.UPDATE, httpMethod = HttpMethod.POST, path = "update")
  public Object currentEmail(User user, ArticleUpdateE articleParamsUpdate) throws UnauthorizedException, CEError {
    BHACLInvoker<ArticleService> aclInvoker = getACL(user);
    return getACL(user).execute().update(articleParamsUpdate, aclInvoker.getAuthorization());
  }

  @ApiMethod(name = ArticleApiMap.LIST_MY, httpMethod = HttpMethod.GET, path = "list-my")
  public Object myArticles(User user) throws UnauthorizedException, CEError {
    return getACL().execute().listMyArticles(getACL(user).getAuthorization());
  }

  @ApiMethod(name = ArticleApiMap.LIST_PUBLIC, httpMethod = HttpMethod.GET, path = "list-public")
  public Object listPublicArticles(User user) throws UnauthorizedException, CEError {
    return getACL(user).execute().listPublic();
  }

  @ApiMethod(name = ArticleApiMap.DELETE, httpMethod = HttpMethod.PUT, path = "delete")
  public Object delete(User user, ListIDs listIDs) throws UnauthorizedException, CEError {
    BHACLInvoker<ArticleService> aclInvoker = getACL(user);
    return aclInvoker.execute().delete(listIDs, aclInvoker.getAuthorization());
  }

  @ApiMethod(name = ArticleApiMap.GET, httpMethod = HttpMethod.GET, path = "get")
  public Object get(User user, @Named(value = "id") Long id) throws UnauthorizedException, CEError {
    return getACL(user).execute().get(new IdArticleE(id));
  }
}