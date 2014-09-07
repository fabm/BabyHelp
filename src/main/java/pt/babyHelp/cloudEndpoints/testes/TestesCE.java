package pt.babyHelp.cloudEndpoints.testes;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.oauth.OAuthServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.utils.SystemProperty;
import com.google.common.collect.ImmutableMap;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.Constants;
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
public class TestesCE {

  public static UserEntry userCurrent = null;
  public Map<String, ?> testProp = ImmutableMap.of("teste", "isto é um teste");
  private TestesImpl testesService = new TestesImpl();
  private int count = 0;

  private BHAuthorization createBHAuthorization(User user) {
    BHAuthorization bhAuthorization = new BHAuthorization();
    bhAuthorization.init(user);
    return bhAuthorization;
  }

  @ApiMethod(name = "countTest", httpMethod = ApiMethod.HttpMethod.GET, path = "countTest")
  public Object countTest() {
    count++;
    return ImmutableMap.of("count", count);
  }


  @ApiMethod(name = "sendMail", httpMethod = ApiMethod.HttpMethod.POST, path = "send/mail")
  public Object sendEmailTest(SendMailParams sendParams) {

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
    return ImmutableMap.of("teste", "teste");
  }

  @ApiMethod(name = "testuser", httpMethod = ApiMethod.HttpMethod.GET, path = "test/method")
  public Object getTester(User user) {

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
  public Object dadosDaConsola(final UserEntry userCurrent) {

    //TODO put a CEReturn value in return
    return null;
  }

  @ApiMethod(name = "logout", httpMethod = ApiMethod.HttpMethod.POST, path = "logout")
  public Object logout() {
    if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) {
      TestesCE.userCurrent = null;
    }
    return ImmutableMap.of("success", "user for development loggedOut");
  }


}
