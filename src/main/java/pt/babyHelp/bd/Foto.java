package pt.babyHelp.bd;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.util.HashSet;
import java.util.List;

@Entity
public class Foto extends BD {

    private
    @Id
    Long id;
    private
    @Index
    String utilizador;
    @Index
    private String blob;
    private boolean publica;
    private Partilha partilha;
    private HashSet<String> autorizados;

    public static Foto load(Long id) {
        return BD.ofy().load().type(Foto.class).id(id).now();
    }

    public static Foto load(String blob) {
        return BD.ofy().load().type(Foto.class).filter("blob =", blob).first().now();
    }

    public static List<Foto> getFotosDoUtilizador(String utilizador) {
        return BD.ofy().load().type(Foto.class).filter("utilizador =", utilizador).list();
    }

    public static List<Foto> getFotosPublicas(String utilizador) {
        return BD.ofy().load().type(Foto.class).filter("publica =", true).list();
    }

    public boolean isPublica() {
        return publica;
    }

    public void setPublica(boolean publica) {
        this.publica = publica;
    }


    public String getUtilizador() {
        return utilizador;
    }

    public void setUtilizador(String utilizador) {
        this.utilizador = utilizador;
    }

    public String getBlob() {
        return blob;
    }

    public void setBlob(String blob) {
        this.blob = blob;
    }

    public Long getId() {
        return id;
    }

    public List<Foto> fotosDoUtilizador() {
        return null;
    }


    public Partilha criaPartilha() {
        partilha = new Partilha();
        return partilha;
    }

    public Partilha getPartilha() {
        return partilha;
    }

    public void addAutorizado(String autorizado) {
        if (autorizados == null)
            autorizados = new HashSet<String>();
        autorizados.add(autorizado);
    }

    public boolean temAutorizacao(String autorizado) {
        if (utilizador.equals(autorizado)) return true;
        if (autorizados == null) return false;
        for (String a : autorizados)
            if (a.equals(autorizado)) return true;
        return false;
    }
}
