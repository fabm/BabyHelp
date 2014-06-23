package pt.babyHelp.cloudEndpoints.article;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.article.ArticleAM;
import pt.babyHelp.services.article.ArticleService;
import pt.core.cloudEndpoints.CEReturn;

import java.util.Map;

import static com.google.api.server.spi.config.ApiMethod.HttpMethod;

@Api(name = "article",
        version = "v1",
        description = "Endpoint dos artigos do BabyHelp",
        scopes = {Constants.EMAIL},
        clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
                Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE}
)
public class ArticleCE {


    @ApiMethod(name = "create", httpMethod = HttpMethod.PUT, path = "create")
    public CEReturn createArticle(User user, Map<String,Object> map) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleAM.CREATE, map);
    }


    @ApiMethod(name = "update", httpMethod = HttpMethod.POST, path = "update")
    public CEReturn currentEmail(User user, Map<String,Object> entryMap) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleAM.UPDATE, entryMap);
    }

    @ApiMethod(name = "list.my", httpMethod = HttpMethod.GET, path = "list-my")
    public CEReturn myArticles(User user) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleAM.LIST_MY);
    }

    @ApiMethod(name = "list.public", httpMethod = HttpMethod.GET, path = "list-public")
    public CEReturn listPublicArticles(User user) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleAM.LIST_PUBLIC);
    }

    @ApiMethod(name = "delete", httpMethod = HttpMethod.PUT, path = "delete")
    public CEReturn delete(User user, ListIDs listIDs) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleAM.DELETE);
    }

    @ApiMethod(name = "get", httpMethod = HttpMethod.GET, path = "get")
    public CEReturn get(User user, @Named(value = "id") long id) throws UnauthorizedException {
        return ArticleService.create()
                .execute(user, ArticleAM.GET);
    }
}