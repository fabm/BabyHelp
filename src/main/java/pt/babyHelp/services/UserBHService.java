package pt.babyHelp.services;

import com.google.api.server.spi.response.UnauthorizedException;
import pt.babyHelp.bd.Son;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.endpoints.ErrorReturn;
import pt.babyHelp.endPoints.UserAcessible;
import pt.babyHelp.endPoints.userEndPoint.RolesParameters;
import pt.babyHelp.services.impl.UserBHServiceImpl;

import java.util.Map;

public interface UserBHService extends UserAcessible {

    Map<String, Object> updateRoles(String email, RolesParameters rolesParameters)
            throws EndPointError, UnauthorizedException;

    Map<String, Object> list()
            throws EndPointError;

    Map<String, Object> getRoles(String email)
            throws EndPointError, UnauthorizedException;

    Map<String,Object> actionsPending();

    Map<String,Object> setSons(Son[] sons);

    enum Error implements ErrorReturn {
        PERSISTENCE(1, "Problema ao tentar guardar %s"),
        ROLE_NOT_MATCH(2, "Não é possível corresponder o role %s a nenhum role existente"),
        EMAIL_REQUIRED(3, "O campo email é obrigatório"),
        EMAIL_MALFORMED(4, "O campo email está mal formatado");

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
