package pt.babyHelp.cloudEndpoints.article;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.Article;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.BHDispatcher;
import pt.babyHelp.services.article.ArticleApiMap;
import pt.babyHelp.services.article.ArticleService;
import pt.gapiap.cloud.endpoints.CEError;
import pt.gapiap.cloud.endpoints.CEReturn;
import pt.gapiap.services.Dispatcher;

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

    private BHDispatcher dispatcher;

    public ArticleCE() {
        dispatcher = new BHDispatcher(new ArticleService());
    }

    private BHDispatcher getDispatcher(User user){
        dispatcher.setUser(user);
        return dispatcher;
    }

    @ApiMethod(name = ArticleApiMap.CREATE, httpMethod = HttpMethod.PUT, path = "create")
    public CEReturn createArticle(User user, ArticleCreationE articleCreationE) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(articleCreationE);
    }


    @ApiMethod(name = ArticleApiMap.UPDATE, httpMethod = HttpMethod.POST, path = "update")
    public CEReturn currentEmail(User user, ArticleUpdateE articleParamsUpdate) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(articleParamsUpdate);
    }

    @ApiMethod(name = ArticleApiMap.LIST_MY, httpMethod = HttpMethod.GET, path = "list-my")
    public CEReturn myArticles(User user) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(ArticleApiMap.LIST_MY);
    }

    @ApiMethod(name = ArticleApiMap.LIST_PUBLIC, httpMethod = HttpMethod.GET, path = "list-public")
    public CEReturn listPublicArticles(User user) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(ArticleApiMap.LIST_PUBLIC);
    }

    @ApiMethod(name = ArticleApiMap.DELETE, httpMethod = HttpMethod.PUT, path = "delete")
    public CEReturn delete(User user, ListIDs listIDs) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(listIDs);
    }

    @ApiMethod(name = ArticleApiMap.GET, httpMethod = HttpMethod.GET, path = "get")
    public CEReturn get(User user, @Named(value = "id") Long id) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(new IdArticleE(id));
    }
}