package pt.babyHelp.cloudEndpoints.article;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.article.ArticleApiMap;
import pt.babyHelp.services.article.ArticleService;
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

    Dispatcher dispatcher;

    @ApiMethod(name = ArticleApiMap.CREATE, httpMethod = HttpMethod.PUT, path = "create")
    public CEReturn createArticle(User user, ArticleCreationE articleCreationE) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleApiMap.CREATE, articleCreationE);
    }


    @ApiMethod(name = ArticleApiMap.UPDATE, httpMethod = HttpMethod.POST, path = "update")
    public CEReturn currentEmail(User user, ArticleUpdateE articleParamsUpdate) throws UnauthorizedException {

        return ArticleService.create()
                .execute(user, ArticleApiMap.UPDATE, articleParamsUpdate);
    }

    @ApiMethod(name = ArticleApiMap.LIST_MY, httpMethod = HttpMethod.GET, path = "list-my")
    public CEReturn myArticles(User user) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleApiMap.LIST_MY);
    }

    @ApiMethod(name = ArticleApiMap.LIST_PUBLIC, httpMethod = HttpMethod.GET, path = "list-public")
    public CEReturn listPublicArticles(User user) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleApiMap.LIST_PUBLIC);
    }

    @ApiMethod(name = ArticleApiMap.DELETE, httpMethod = HttpMethod.PUT, path = "delete")
    public CEReturn delete(User user, ListIDs listIDs) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleApiMap.DELETE);
    }

    @ApiMethod(name = ArticleApiMap.GET, httpMethod = HttpMethod.GET, path = "get")
    public CEReturn get(User user, @Named(value = "id") Long id) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleApiMap.GET, new IdArticleE(id));
    }
}