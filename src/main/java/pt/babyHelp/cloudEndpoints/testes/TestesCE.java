package pt.babyHelp.cloudEndpoints.testes;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiResourceProperty;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.oauth.OAuthServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.utils.SystemProperty;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.impl.TestesImpl;
import pt.babyHelp.validation.BHParameterEvaluater;
import pt.core.cloudEndpoints.Authorization;
import pt.core.cloudEndpoints.CEError;
import pt.core.cloudEndpoints.CEReturn;
import pt.core.cloudEndpoints.CEUtils;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Api(name = "testes",
        version = "v1",
        description = "Testes do BabyHelp",
        scopes = {Constants.EMAIL},
        clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
                Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE}
)
public class TestesCE {

    public static UserEntry userCurrent = null;
    @ApiResourceProperty()
    public Map<String, Object> testProp = CEUtils.createMapAndPut("teste", "isto é um teste");
    private TestesImpl testesService = new TestesImpl();
    private int count = 0;

    private BHAuthorization getBHAuthorization(User user){
        return new BHAuthorization(user);
    }

    @ApiMethod(name = "countTest", httpMethod = ApiMethod.HttpMethod.GET, path = "countTest")
    public Map<String, Object> countTest() {
        count++;
        return CEUtils.createMapAndPut("count", count);
    }


    @ApiMethod(name = "sendMail", httpMethod = ApiMethod.HttpMethod.POST, path = "send/mail")
    public void sendEmailTest(SendMailParams sendParams) {

        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
        String msgBody = "teste email";


        Message msg = new MimeMessage(session);
        try {
            msg.setFrom(new InternetAddress(sendParams.getEmailEmissor(), sendParams.getEmissor()));
            msg.addRecipient(Message.RecipientType.TO,
                    new InternetAddress(sendParams.getEmailDestinatario(), sendParams.getDestinatario()));
            msg.setSubject(sendParams.getAssunto());
            msg.setText(sendParams.getCorpo());
            Transport.send(msg);
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @ApiMethod(name = "testuser", httpMethod = ApiMethod.HttpMethod.GET, path = "test/method")
    public Map<String, Object> getTester(User user) {
        getBHAuthorization(user).checkDevMode();

        Map<String, Object> map = new HashMap<String, Object>();

        map.put("parameter", user);
        try {
            map.put("oauthFactory", OAuthServiceFactory.getOAuthService().getCurrentUser());
        } catch (OAuthRequestException e) {
            map.put("oauthFactory", "error");
        }
        map.put("currentFactory", UserServiceFactory.getUserService().getCurrentUser());
        return map;
    }

    @ApiMethod(name = "userEntry", httpMethod = ApiMethod.HttpMethod.POST, path = "entry")
    public CEReturn dadosDaConsola(final UserEntry userCurrent) {
        getBHAuthorization(null).checkDevMode();
        CEReturn ceReturn = new CEReturn() {
            @Override
            public Object getCEResponse() throws CEError {
                TestesCE.userCurrent = userCurrent;
                return CEUtils.createMapAndPut("result", "user for development changed");
            }
        };

        return BHParameterEvaluater.create(userCurrent, ceReturn);
    }

    @ApiMethod(name = "logout", httpMethod = ApiMethod.HttpMethod.POST, path = "logout")
    public Map<String, Object> logout() {
        if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) {
            TestesCE.userCurrent = null;
        }
        return CEUtils.createMapAndPut("success", "user for development loggedOut");
    }

    @ApiMethod(name = "insert.son", httpMethod = ApiMethod.HttpMethod.POST, path = "insert/son")
    public CEReturn insertson(User user, SonParameter sonParameter) throws UnauthorizedException {
        getBHAuthorization(user).checkDevMode();
        testesService.setUser(user);
        testesService.getAuthorization().check("teste de inserção do filho", Role.PARENT);
        testesService.getAuthorization().checkDevMode();
        return new CEReturn() {
            @Override
            public Object getCEResponse() throws CEError {
                return testesService.insertSuns();
            }
        };
    }


    //TODO list parents testar
    @ApiMethod(name = "list.parents", httpMethod = ApiMethod.HttpMethod.POST, path = "list/parents")
    public Map<String, Object> listParents(User user, @Named("name") String name) throws UnauthorizedException {
        getBHAuthorization(user).checkDevMode();
        testesService.setUser(user);
        testesService.getAuthorization().check("teste de listagem de filhos", Role.PARENT);
        return testesService.getParentsList(name);
    }

}
