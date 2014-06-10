package pt.babyHelp.endPoints;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.oauth.OAuthServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.utils.SystemProperty;
import pt.babyHelp.bd.embededs.Role;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
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
public class Testes {

    public static UserEntry userCurrent = null;

    @ApiMethod(name = "sendMail", httpMethod = ApiMethod.HttpMethod.POST, path = "send/mail")
    public void sendEmailTest(SendMailParams sendParams) {

        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
        String msgBody = "teste email";


        Message msg = new MimeMessage(session);
        try {
            msg.setFrom(new InternetAddress(sendParams.emailEmissor, sendParams.emissor));
            msg.addRecipient(Message.RecipientType.TO,
                    new InternetAddress(sendParams.emailDestinatario, sendParams.destinatario));
            msg.setSubject(sendParams.assunto);
            msg.setText(sendParams.corpo);
            Transport.send(msg);
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @ApiMethod(name = "testuser", httpMethod = ApiMethod.HttpMethod.GET, path = "test/method")
    public Map<String, Object> getTester(User user) {
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
        Map<String, Object> map = new HashMap<String, Object>();
        if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) {
            Testes.userCurrent = userCurrent;
        }
        map.put("message", "console");
        return map;
    }

    @ApiMethod(name = "logout", httpMethod = ApiMethod.HttpMethod.POST, path = "logout")
    public Map<String, Object> logout() {
        Map<String, Object> map = new HashMap<String, Object>();
        if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) {
            Testes.userCurrent = null;
        }
        map.put("message", "console");
        return map;
    }

    public static class SendMailParams {


        private String corpo;
        private String destinatario;
        private String emissor;
        private String emailDestinatario;
        private String emailEmissor;
        private String assunto;

        public String getCorpo() {
            return corpo;
        }

        public void setCorpo(String corpo) {
            this.corpo = corpo;
        }

        public String getDestinatario() {
            return destinatario;
        }

        public void setDestinatario(String destinatario) {
            this.destinatario = destinatario;
        }

        public String getEmissor() {
            return emissor;
        }

        public void setEmissor(String emissor) {
            this.emissor = emissor;
        }

        public String getEmailDestinatario() {
            return emailDestinatario;
        }

        public void setEmailDestinatario(String emailDestinatario) {
            this.emailDestinatario = emailDestinatario;
        }

        public String getEmailEmissor() {
            return emailEmissor;
        }

        public void setEmailEmissor(String emailEmissor) {
            this.emailEmissor = emailEmissor;
        }

        public String getAssunto() {
            return assunto;
        }

        public void setAssunto(String assunto) {
            this.assunto = assunto;
        }
    }

    public static class UserEntry {
        private String email;
        private List<Role> roles;
        private boolean registered;
        private boolean logged;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public List<Role> getRoles() {
            return roles;
        }

        public void setRoles(List<Role> roles) {
            this.roles = roles;
        }

        public boolean isRegistered() {
            return registered;
        }

        public void setRegistered(boolean registered) {
            this.registered = registered;
        }

        public boolean isLogged() {
            return logged;
        }

        public void setLogged(boolean logged) {
            this.logged = logged;
        }
    }
}
