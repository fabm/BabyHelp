package pt.babyHelp.services;

import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.endpoints.ErrorReturn;
import pt.babyHelp.endPoints.UserAcessible;
import pt.babyHelp.endPoints.userEndPoint.RolesParameters;

import java.util.Map;

public interface UserBHService extends UserAcessible {
    Map<String, Object> currentEmail();

    Map<String, Object> checkRoles(RolesParameters rolesParameters)
            throws EndPointError;

    Map<String, Object> updateRoles(String email, RolesParameters rolesParameters)
            throws EndPointError;

    Map<String, Object> list()
            throws EndPointError;

    Map<String, Object> removeRole(String email, String role) throws EndPointError;

    Map<String, Object> addRole(String email, String role) throws EndPointError;
    Map<String, Object> getRoles(String email) throws EndPointError;


    enum Error implements ErrorReturn {
        ROLE_NOT_MATCH(1, "Não é possível corresponder o role %s a nenhum role existente"),
        PERSISTENCE(2, "Problema ao tentar guardar %s"),
        EMAIL_REQUIRED(3, "O campo email é obrigatório");

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
    }

}
