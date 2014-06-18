package pt.babyHelp.services;

import pt.core.cloudEndpoints.CEErrorReturn;
import pt.babyHelp.cloudEndpoints.UserAcessible;
import pt.babyHelp.cloudEndpoints.article.ListIDs;

import java.util.Map;

public interface ArticleService extends UserAcessible{
    Map<String, Object> create(Map<String,Object> entryMap) throws pt.core.cloudEndpoints.CEError;

    Map<String, Object> update(Map<String,Object> entryMap)
            throws pt.core.cloudEndpoints.CEError;

    Map<String, Object> updatePhoto(Long id, String key)
            throws pt.core.cloudEndpoints.CEError;

    Map<String, Object> delete(ListIDs listIds)
            throws pt.core.cloudEndpoints.CEError;

    Map<String, Object> getMyArticles() ;

    Map<String, Object> get(long id);

    Map<String, Object> listPublic();



    enum CEError implements CEErrorReturn {
        WRONG_ROLE(1, "Não tem previlégios suficientes para executar esta ação"),
        ID_REQUIRED(2, "O id é obrigatório para atualizar o artigo"),
        ID_NOT_FOUND(3, "Não foi encontrado nenhum artigo com o id %s"),
        NOT_OWNER(4, "Não é o proprietário do artigo '%s', por isso não pode %s"),
        FIELD_REQUIRED(5, "O campo %s é obrigatório");

        private String msg;
        private int code;

        CEError(int code, String msg) {
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

        public CEError addArgs(String... vars) {
            this.msg = String.format(msg, vars);
            return this;
        }

        @Override
        public String getContext() {
            return "article";
        }
    }

}
