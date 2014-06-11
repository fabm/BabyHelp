package pt.babyHelp.endPoints.testes;

public class SendMailParams {


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
