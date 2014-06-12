package pt.babyHelp.bd.embededs;

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

    public static Role[] toRolesArray(List<String> sRoles){
        List<Role>list = new ArrayList<Role>(sRoles.size());
        for(String strRole:sRoles){
            list.add(Role.convert(strRole));
        }
        return list.toArray(new Role[list.size()]);
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
