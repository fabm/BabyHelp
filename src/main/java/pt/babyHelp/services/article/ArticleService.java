package pt.babyHelp.services.article;

import com.google.api.server.spi.config.Named;
import com.google.common.collect.ImmutableMap;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.article.ArticleCreationE;
import pt.babyHelp.cloudEndpoints.article.ArticleUpdateE;
import pt.babyHelp.cloudEndpoints.article.IdArticleE;
import pt.babyHelp.cloudEndpoints.article.ListIDs;
import pt.babyHelp.services.RolesValidation;
import pt.gapiap.cloud.endpoints.authorization.Authorization;
import pt.gapiap.cloud.endpoints.errors.CEError;
import pt.gapiap.cloudEndpoints.services.annotations.PhotoUploadedKey;

import java.util.List;
import java.util.Map;

public interface ArticleService {
    @RolesValidation(Role.HEALTHTEC)
    Object createArticle(ArticleCreationE articleCreationE, Authorization<Role, UserFromApp> authorization) throws CEError;

    @RolesValidation(Role.HEALTHTEC)
    Map<String, String> update(ArticleUpdateE articleUpdateE, Authorization<Role, UserFromApp> authorization) throws CEError;

    @RolesValidation(Role.HEALTHTEC)
    ImmutableMap<String, String> updatePhoto(@Named("id") Long id, @PhotoUploadedKey String key) throws CEError;

    @RolesValidation(Role.ADMINISTRATOR)
    ImmutableMap<String, String> delete(ListIDs listIDs, Authorization<Role, UserFromApp> authorization) throws CEError;

    @RolesValidation()
    ImmutableMap<String, List<Map<String, Object>>> listMyArticles(Authorization<Role, UserFromApp> authorization);

    @RolesValidation()
    Map<String, Object> get(IdArticleE idArticleE) throws CEError;

    @RolesValidation()
    List<Map<String, Object>> listPublic();
}
