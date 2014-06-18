package pt.babyHelp.services;

import com.google.api.server.spi.response.UnauthorizedException;
import pt.babyHelp.bd.Son;
import pt.core.cloudEndpoints.CEErrorReturn;
import pt.babyHelp.cloudEndpoints.UserAcessible;
import pt.babyHelp.cloudEndpoints.user.RolesParameters;

import java.util.Map;

public interface UserBHService extends UserAcessible {

    Map<String, Object> updateRoles(String email, RolesParameters rolesParameters)
            throws pt.core.cloudEndpoints.CEError, UnauthorizedException;

    Map<String, Object> list()
            throws pt.core.cloudEndpoints.CEError;

    Map<String, Object> getRoles(String email)
            throws pt.core.cloudEndpoints.CEError, UnauthorizedException;

    Map<String,Object> pendingActions();

    Map<String,Object> setSons(Son[] sons);

    Map<String,Object> updateHealthTec(Map<String, Object> entryMap) throws pt.core.cloudEndpoints.CEError;

    Map<String,Object> updateUserName(Map<String, Object> entryMap) throws pt.core.cloudEndpoints.CEError;

    enum CEError implements CEErrorReturn {
        ROLE_NOT_MATCH(0, "Não é possível corresponder o role %s a nenhum role existente"),
        EMAIL_REQUIRED(1, "O campo email é obrigatório"),
        EMAIL_MALFORMED(2, "O campo email está mal formatado");

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
            return "userBH";
        }
    }

}
