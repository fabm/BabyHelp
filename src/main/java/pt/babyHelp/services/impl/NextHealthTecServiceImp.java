package pt.babyHelp.services.impl;



public class NextHealthTecServiceImp {
/*

    private static enum Error implements ErrorReturn {
        emailInvalid(0, "email inválido"),
        persistence(1, "problema de persitência"),
        emailAlreadyExists(2, "o email já existe"),
        noRows(3, "tabela sem conteúdo");

        private int code;
        private String msg;


        Error(int code, String msg) {
            this.code = code;
            this.msg = msg;
        }

        @Override
        public int getCode() {
            return this.code;
        }

        @Override
        public String getMsg() {
            return this.msg;
        }
    }

    private User user;


    private Map<String, Object> getList() throws EndPointError {
        Map<String, Object> map = new HashMap<String, Object>();

        List<Object> body = new ArrayList<Object>();
        Iterator<NextHealthTec> it = NextHealthTec.loadAll();

        if (!it.hasNext()) {
            throw new EndPointError(Error.noRows);
        }

        while (it.hasNext()) {
            NextHealthTec nextHealthTec = it.next();
            body.add(Arrays.asList(nextHealthTec.getId(), nextHealthTec.getEmail()));
        }
        map.put(Page.BODY, body);
        return map;
    }

    @Override
    public synchronized Map<String, Object> delete(ParametersDeleteNHT parametersDeleteNHT) throws EndPointError {
        Map<String, Object> map = new HashMap<String, Object>();
        List<Key<NextHealthTec>> keys = BD.keys(NextHealthTec.class, parametersDeleteNHT.getIds());
        BD.ofy().delete().keys(keys).now();
        return getList();
    }

    @Override
    public EndPointReturn add(String email) throws EndPointError {
        if (!EmailChecker.check(email)) throw new EndPointError(Error.emailInvalid);

        NextHealthTec nextHealthTec = NextHealthTec.findByEmail(email);

        if (nextHealthTec != null) throw new EndPointError(Error.emailAlreadyExists);

        nextHealthTec = new NextHealthTec();
        nextHealthTec.setEmail(email);
        try {
            nextHealthTec.save();
        } catch (PersistenceException e) {
            throw new EndPointError(Error.persistence);
        }
        return new StateReturn("added");
    }

    @Override
    public EndPointReturn updateMyUser() throws EndPointError {

        NextHealthTec nextHealthTec = NextHealthTec.findByEmail(user.getEmail());

        if (nextHealthTec == null)
            return new StateReturn("not updated");

        UserFromApp currentuser = UserFromApp.findByUser(this.user);
        if (currentuser == null) {
            currentuser = new UserFromApp();
            currentuser.setUser(this.user);
            currentuser.setRoles(Role.HEALTHTEC);
            try {
                currentuser.save();
            } catch (PersistenceException e) {
                throw new EndPointError(Error.persistence);
            }
        }
        return new StateReturn("updated");
    }

    @Override
    public EndPointReturn upgradeUser(String email) throws EndPointError {
        NextHealthTec nextHealthTec = new NextHealthTec();
        nextHealthTec.setEmail(email);

        try {
            nextHealthTec.save();
        } catch (PersistenceException e) {
            throw new EndPointError(Error.persistence);
        }

        return new StateReturn("updated");
    }

    @Override
    public Map<String, Object> listPaged(int page, int qtPerPage, boolean extraInfo) {
        NextHealthTecPage nextHealthTecPage = new NextHealthTecPage();
        return nextHealthTecPage.process(page, qtPerPage, extraInfo);
    }


    @Override
    public Map<String, Object> list() throws EndPointError {
        Map<String, Object> map = getList();
        map.put(Page.HEADER, Arrays.asList("id", "email"));
        return map;
    }

    @Override
    public void setUser(User user) {
        this.user = user;
    }
*/

}
