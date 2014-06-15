package pt.babyHelp.services;

import com.google.api.server.spi.response.UnauthorizedException;
import pt.babyHelp.bd.Son;
import pt.babyHelp.core.cloudEndpoints.EndPointError;
import pt.babyHelp.core.cloudEndpoints.ErrorReturn;
import pt.babyHelp.endPoints.UserAcessible;
import pt.babyHelp.endPoints.userEndPoint.RolesParameters;

import java.util.Map;

public interface UserBHService extends UserAcessible {

    Map<String, Object> updateRoles(String email, RolesParameters rolesParameters)
            throws EndPointError, UnauthorizedException;

    Map<String, Object> list()
            throws EndPointError;

    Map<String, Object> getRoles(String email)
            throws EndPointError, UnauthorizedException;

    Map<String,Object> pendingActions();

    Map<String,Object> setSons(Son[] sons);

    enum Error implements ErrorReturn {
        ROLE_NOT_MATCH(0, "Não é possível corresponder o role %s a nenhum role existente"),
        EMAIL_REQUIRED(1, "O campo email é obrigatório"),
        EMAIL_MALFORMED(2, "O campo email está mal formatado");

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
            return "userBH";
        }
    }

}
