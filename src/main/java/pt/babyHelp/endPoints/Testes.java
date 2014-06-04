package pt.babyHelp.endPoints;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
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
    public static class SendParams{
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

        private String corpo;
        private String destinatario;
        private String emissor;
        private String emailDestinatario;
        private String emailEmissor;
        private String assunto;
    }

    @ApiMethod(name = "endMail", httpMethod = ApiMethod.HttpMethod.POST, path = "send/mail")
    public void sendEmailTest(SendParams sendParams) {

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
}
