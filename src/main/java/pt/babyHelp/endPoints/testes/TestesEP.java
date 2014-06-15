package pt.babyHelp.endPoints.testes;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.oauth.OAuthServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.utils.SystemProperty;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.core.cloudEndpoints.CEPUtils;
import pt.babyHelp.core.cloudEndpoints.EndPointError;
import pt.babyHelp.core.cloudEndpoints.EndPointReturn;
import pt.babyHelp.endPoints.Authorization;
import pt.babyHelp.endPoints.Constants;
import pt.babyHelp.services.impl.TestesImpl;

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
public class TestesEP {

    public static UserEntry userCurrent = null;
    private TestesImpl testesService = new TestesImpl();

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
        Authorization.checkDevMode();

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
    public Map<String, Object> dadosDaConsola(UserEntry userCurrent) {
        Authorization.checkDevMode();
        TestesEP.userCurrent = userCurrent;
        return CEPUtils.createMapAndPut("success", "user for development changed");
    }

    @ApiMethod(name = "logout", httpMethod = ApiMethod.HttpMethod.POST, path = "logout")
    public Map<String, Object> logout() {
        if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) {
            TestesEP.userCurrent = null;
        }
        return CEPUtils.createMapAndPut("success", "user for development loggedOut");
    }

    @ApiMethod(name = "insert.son", httpMethod = ApiMethod.HttpMethod.POST, path = "insert/son")
    public EndPointReturn insertson(User user, SonParameter sonParameter) throws UnauthorizedException {
        Authorization.checkDevMode();
        testesService.setUser(user);
        testesService.getAuthorization().check("teste de inserção do filho", Role.PARENT);
        testesService.getAuthorization().checkDevMode();
        return new EndPointReturn() {
            @Override
            public Object getEndPointResponse() throws EndPointError {
                return testesService.insertSuns();
            }
        };
    }



    //TODO list parents testar
    @ApiMethod(name = "list.parents", httpMethod = ApiMethod.HttpMethod.POST, path = "list/parents")
    public Map<String, Object> listParents(User user, @Named("name") String name) throws UnauthorizedException {
        testesService.setUser(user);
        testesService.getAuthorization().check("teste de listagem de filhos", Role.PARENT);
        return testesService.getParentsList(name);
    }

}
