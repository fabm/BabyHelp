package pt.babyHelp.services;

import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.endpoints.ErrorReturn;
import pt.babyHelp.endPoints.UserAcessible;
import pt.babyHelp.endPoints.article.ArticleParams;
import pt.babyHelp.endPoints.article.ListIDs;
import pt.babyHelp.services.annotations.InstanceType;
import pt.babyHelp.services.annotations.PhotoUploadClass;
import pt.babyHelp.services.annotations.PhotoUploadMethod;
import pt.babyHelp.services.annotations.PhotoUploadedKey;
import pt.babyHelp.services.impl.ArticleServiceImpl;

import java.util.Map;

public interface ArticleService extends UserAcessible {
    Map<String, Object> create(ArticleParams articleParams) throws EndPointError, UnauthorizedException;

    Map<String, Object> update(ArticleParams articleParams)
            throws EndPointError, UnauthorizedException;

    Map<String, Object> updatePhoto(Long id, String key)
            throws UnauthorizedException, EndPointError;

    Map<String, Object> delete(ListIDs ids)
            throws EndPointError, UnauthorizedException;

    Map<String, Object> getMyArticles() throws UnauthorizedException;

    Map<String, Object> get(long id);

    enum Error implements ErrorReturn {
        WRONG_ROLE(1, "Não tem previlégios suficientes para executar esta ação"),
        FIELD_TITLE_REQUIRED(2, "O campo titulo é obrigatório"),
        FIELD_BODY_REUIRED(3, "O campo conteúdo do artigo é obrigatório"),
        SAVE_ERROR(4, "Não foi possível guardar o artigo"),
        ID_REQUIRED(5, "O id é obrigatório para atualizar o artigo"),
        ID_NOT_FOUND(6, "Não foi encontrado nenhum artigo com o id %s"),
        NOT_OWNER(7, "Não é o proprietário do artigo '%s', por isso não pode %s");

        private String msg;
        private int code;

        Error(int code, String msg) {
            this.msg = msg;
            this.code = code;
        }

        @Override
        public int getCode() {
            return this.code;
        }

        @Override
        public String getMsg() {
            return this.msg;
        }

        public Error addArgs(String... vars) {
            this.msg = String.format(msg, vars);
            return this;
        }

        @Override
        public String getContext() {
            return "article";
        }
    }

}
