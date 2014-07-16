package user;

import environment.Environment;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import pt.babyHelp.cloudEndpoints.article.ArticleCreationE;
import pt.babyHelp.cloudEndpoints.article.ArticleUpdateE;
import pt.babyHelp.services.BHChecker;
import pt.babyHelp.services.BabyHelpError;
import pt.core.cloudEndpoints.CEError;
import pt.gapiap.proccess.annotations.ApiMethodParameters;

import java.lang.annotation.Annotation;

public class UsersPersistence {
    @Rule
    public Environment store = new Environment(true);

    @Test
    public void checkEntryArticleCreate() {
        ArticleCreationE articleCreationE = new ArticleCreationE();
        articleCreationE.setBody("body");
        articleCreationE.setPhotoToken("aaa");
        articleCreationE.setPublic(false);
        articleCreationE.setTitle("aaa");

        BHChecker bhChecker = new BHChecker();
        try {
            bhChecker.check(articleCreationE);
        } catch (CEError ceError) {
            Assert.assertEquals(BabyHelpError.REQUIRED_FIELD, ceError.getCeErrorReturn());
            Assert.assertEquals("resumo", ceError.getParameters()[0]);
        }
    }

    @Test
    public void checkEntryArticleUpdate() {
        ArticleUpdateE articleUpdateE = new ArticleUpdateE();
        articleUpdateE.setBody("body");
        articleUpdateE.setPhotoToken("aaa");
        articleUpdateE.setPublic(false);
        articleUpdateE.setTitle("aaa");

        BHChecker bhChecker = new BHChecker();
        try {
            bhChecker.check(articleUpdateE);
            //é suposto entrar no catch
            Assert.assertTrue(false);
        } catch (CEError ceError) {
            Assert.assertEquals(BabyHelpError.REQUIRED_FIELD, ceError.getCeErrorReturn());
            Assert.assertEquals("resumo", ceError.getParameters()[0]);
        }
    }


    @Test
    public void checkAnnotation() {
        Annotation annotation = ArticleCreationE.class.getAnnotation(ApiMethodParameters.class);
        Assert.assertTrue(annotation.annotationType() == ApiMethodParameters.class);
    }
}
