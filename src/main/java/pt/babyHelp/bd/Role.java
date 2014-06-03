package pt.babyHelp.bd;

import java.util.*;

public enum Role {
    ADMINISTRATOR, HEALTHTEC, PARENT;

    public static Role convert(String string) throws ConvertException {
        try {
            return Role.valueOf(string);
        } catch (IllegalArgumentException e) {
            throw new ConvertException(string);
        }
    }

    public static Set<Role> toSet(Collection<String> sRoles){
        Set<Role> set = new HashSet<Role>();
        for(String sRole:sRoles){
            set.add(Role.convert(sRole));
        }
        return set;
    }

    public static Set<String> toStringSet(Collection<Role> roles){
        Set<String> set = new HashSet<String>();
        if(roles == null)return set;
        for(Role role:roles){
            set.add(role.toString());
        }
        return set;
    }

    public static class ConvertException extends RuntimeException {
        private String roleStr;

        public ConvertException(String roleStr) {
            super();
            this.roleStr = roleStr;
        }

        public String getRoleStr() {
            return roleStr;
        }
    }
}
