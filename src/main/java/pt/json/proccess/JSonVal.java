package pt.json.proccess;

import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.Element;
import javax.lang.model.element.TypeElement;
import java.util.Set;

@SupportedSourceVersion(SourceVersion.RELEASE_7)
public class JSonVal extends AbstractProcessor {

    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        for(TypeElement te:annotations){
            System.out.println(te.getSimpleName());
        }
        System.out.println("te------------------------");
        Set<? extends Element> eleSet = roundEnv.getElementsAnnotatedWith(Validation.Email.class);
        for(Element el:eleSet){
            System.out.println(el.getSimpleName());
        }
        System.out.println("se------------------------");
        return true;
    }
}
