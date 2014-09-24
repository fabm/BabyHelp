/// <reference path="gapis.ts" />
class ClientBabyHelp extends ClientLoader {
    constructor(apiMapDepot:ApiMapDepot) {
        super(apiMapDepot);
        this.apiUrl = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";
        super.setClientID('942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com');
        super.setScope(['https://www.googleapis.com/auth/userinfo.email']);
    }

}

interface Role {
    name:string;alias:string;role:boolean;
}

class UserService extends ClientBabyHelp {
    constructor(apiMapDepot:ApiMapDepot) {
        super(apiMapDepot);
        this.client = 'userBH';
    }

    public static loadAllRoles():Array<Role> {
        function create(alias, name):Role {
            return {
                name: name,
                alias: alias,
                role: false
            };
        }

        var all:Array<Role> = [];
        all.push(create('técnico de saúde', 'HEALTHTEC'));
        all.push(create('administrador', 'ADMINISTRATOR'));
        all.push(create('educador', 'PARENT'));
        return all;
    }

    getRoles(user):Executor {
        var self = this;

        var onSuccess;

        var iResolver = {
            success: (response)=> {
                var allRoles:Array<Role> = UserService.loadAllRoles();
                allRoles.forEach((value, index, arr)=> {
                    value.role = response.body.indexOf(value.name) != -1;
                });
                user.roles = allRoles;
                onSuccess(null);
            },
            error: null,
            unauthorized: null
        };


        return {
            execute: (resolver:Resolve)=> {
                iResolver.error = resolver.error;
                iResolver.unauthorized = resolver.unauthorized;
                onSuccess = resolver.success;
                super.loadApi(()=> {
                    var method = self.api['get']['roles'];
                    method.args = {email: user.email};
                    method.execute(iResolver);
                });
            }
        };
    }

    updateRoles(user:{email:string;roles:Array<Role>}):Executor {
        var self = this;

        return {
            execute: (resolver:Resolve)=> {
                var rolesSelected:Array<string> = [];
                user.roles.forEach((value, index, arr)=> {
                    if (value.role)rolesSelected.push(value.name);
                });
                var updateRoles = self.api['update']['roles'];
                updateRoles.args = {'email': user.email, 'roles': rolesSelected};
                updateRoles.execute(resolver);
            }
        }
    }

    list():Executor {
        return this.api['list'];
    }
}

interface ArticleCreation {
    body:string;
    summary:string;
    title:string;
    photoUrl:string;
    isPublic:boolean;
}

interface ArticleUpdate extends ArticleCreation {
    id:number;
}

class ArticlesService extends ClientBabyHelp {
    constructor(apiMapDepot:ApiMapDepot) {
        super(apiMapDepot);
        this.client = 'article';
    }

    get(id):Executor {
        return this.api['get']({id: id});
    }

    create(article:ArticleCreation):Executor {
        return this.api['create']({article: article});
    }

    listMy():Executor {
        return this.api['list']['my']();
    }

    listPublic():Executor {
        return this.api['list']['public']();
    }

    update(article:ArticleUpdate):Executor {
        return this.api['update'](article);
    }

    delete(ids):Executor {
        return this.api['delete']({ids: ids});
    }
}

class PhotoTokenService extends ClientBabyHelp {
    constructor(apiMapDepot:ApiMapDepot) {
        super(apiMapDepot);
        this.client = 'photoToken';
    }

    getPhotoToken() {
        return this.api['getuploadurl']();
    }
}
