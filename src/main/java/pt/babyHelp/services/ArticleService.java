package pt.babyHelp.services;

import pt.babyHelp.core.cloudEndpoints.EndPointError;
import pt.babyHelp.core.cloudEndpoints.ErrorReturn;
import pt.babyHelp.endPoints.UserAcessible;
import pt.babyHelp.endPoints.article.ListIDs;

import java.util.Map;

public interface ArticleService extends UserAcessible{
    Map<String, Object> create(Map<String,Object> entryMap) throws EndPointError;

    Map<String, Object> update(Map<String,Object> entryMap)
            throws EndPointError;

    Map<String, Object> updatePhoto(Long id, String key)
            throws EndPointError;

    Map<String, Object> delete(ListIDs listIds)
            throws EndPointError;

    Map<String, Object> getMyArticles() ;

    Map<String, Object> get(long id);

    Map<String, Object> listPublic();

    enum Error implements ErrorReturn {
        WRONG_ROLE(1, "Não tem previlégios suficientes para executar esta ação"),
        ID_REQUIRED(2, "O id é obrigatório para atualizar o artigo"),
        ID_NOT_FOUND(3, "Não foi encontrado nenhum artigo com o id %s"),
        NOT_OWNER(4, "Não é o proprietário do artigo '%s', por isso não pode %s"),
        FIELD_REQUIRED(5, "O campo %s é obrigatório");

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
