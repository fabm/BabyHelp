package pt.babyHelp.cloudEndpoints.article;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.embededs.Role;
import pt.core.cloudEndpoints.CEError;
import pt.core.cloudEndpoints.CEReturn;
import pt.babyHelp.cloudEndpoints.Constants;
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
public class ArticleCE {

    private ArticleService articleService = new ArticleServiceImpl();


    @ApiMethod(name = "create", httpMethod = HttpMethod.PUT, path = "create")
    public CEReturn createArticle(User user, final Map<String,Object> map) throws UnauthorizedException {
        this.articleService.setUser(user);
        articleService.getAuthorization().check("criação de um artigo", Role.HEALTHTEC);

        return new CEReturn() {
            @Override
            public Object getCEResponse() throws CEError {
                return articleService.create(map);
            }
        };

    }


    @ApiMethod(name = "update", httpMethod = HttpMethod.POST, path = "update")
    public CEReturn currentEmail(User user, final Map<String,Object> entryMap) throws UnauthorizedException {
        this.articleService.setUser(user);
        this.articleService.getAuthorization().check("atualização de um artigo", Role.HEALTHTEC);
        return new CEReturn() {
            @Override
            public Object getCEResponse() throws CEError {
                return articleService.update(entryMap);
            }
        };
    }

    @ApiMethod(name = "list.my", httpMethod = HttpMethod.GET, path = "list-my")
    public Map<String, Object> myArticles(User user) throws UnauthorizedException {
        this.articleService.setUser(user);
        this.articleService.getAuthorization().check("artigos do utilizador atual", Role.HEALTHTEC);
        return this.articleService.getMyArticles();
    }

    @ApiMethod(name = "list.public", httpMethod = HttpMethod.GET, path = "list-public")
    public Map<String, Object> listPublicArticles(User user) {
        this.articleService.setUser(user);
        return this.articleService.listPublic();
    }

    @ApiMethod(name = "delete", httpMethod = HttpMethod.PUT, path = "delete")
    public CEReturn delete(User user, final ListIDs listIDs) throws UnauthorizedException {
        this.articleService.setUser(user);
        this.articleService.getAuthorization().check("remoção de artigos");
        return new CEReturn() {
            @Override
            public Object getCEResponse() throws CEError {
                return articleService.delete(listIDs);
            }
        };
    }

    @ApiMethod(name = "get", httpMethod = HttpMethod.GET, path = "get")
    public Map<String, Object> get(User user, @Named(value = "id") long id) throws UnauthorizedException {
        this.articleService.setUser(user);
        return this.articleService.get(id);
    }
}