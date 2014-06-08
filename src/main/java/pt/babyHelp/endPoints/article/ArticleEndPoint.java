package pt.babyHelp.endPoints.article;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.endPoints.Constants;
import pt.babyHelp.services.ArticleService;
import pt.babyHelp.services.impl.ArticleServiceImpl;

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
public class ArticleEndPoint {

    private ArticleService articleService = new ArticleServiceImpl();


    @ApiMethod(name = "create", httpMethod = HttpMethod.PUT, path = "create")
    public Map<String, Object> createArticle(User user, ArticleParams articleParams) throws UnauthorizedException {
        try {
            this.articleService.setUser(user);
            return this.articleService.create(articleParams);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "update", httpMethod = HttpMethod.POST, path = "update")
    public Map<String, Object> currentEmail(User user, ArticleParams articleParams) throws UnauthorizedException {
        try {
            this.articleService.setUser(user);
            return this.articleService.update(articleParams);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }


    @ApiMethod(name = "list.my", httpMethod = HttpMethod.GET, path = "list-my")
    public Map<String, Object> myArticles(User user) throws UnauthorizedException {
        this.articleService.setUser(user);
        return this.articleService.getMyArticles();
    }

    @ApiMethod(name = "delete", httpMethod = HttpMethod.PUT, path = "delete")
    public Map<String, Object> delete(User user, ListIDs listIDs) throws UnauthorizedException {
        try {
            this.articleService.setUser(user);
            return this.articleService.delete(listIDs);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "get", httpMethod = HttpMethod.GET, path = "get")
    public Map<String, Object> get(User user, @Named(value = "id") long id) throws UnauthorizedException {
        this.articleService.setUser(user);
        return this.articleService.get(id);
    }
}