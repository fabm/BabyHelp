package user;

import org.junit.Assert;
import org.junit.Test;
import pt.babyHelp.cloudEndpoints.article.ArticleCreationE;
import pt.babyHelp.cloudEndpoints.article.ArticleUpdateE;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.bean.checker.BeanChecker;
import pt.gapiap.proccess.validation.bean.checker.BeanCheckerException;

import javax.validation.constraints.NotNull;
import java.lang.annotation.Annotation;

public class BeanCheckTest {

    @Test
    public void checkEntryArticleCreate() {
        ArticleCreationE articleCreationE = new ArticleCreationE();
        articleCreationE.setBody("body");
        articleCreationE.setPhotoToken("aaa");
        articleCreationE.setPublic(false);
        articleCreationE.setTitle("aaa");

        BeanChecker beanChecker = new BeanChecker(false);
        try {
            beanChecker.check(articleCreationE);
            //the instruction above never happens
            Assert.assertTrue(false);
        } catch (BeanCheckerException e) {
            Assert.assertEquals(NotNull.class, e.getValidationContext()
                    .getAnnotation().annotationType());
            Assert.assertEquals("summary", e.getValidationContext().getName());
        }
    }

    @Test
    public void checkEntryArticleUpdate() {
        ArticleUpdateE articleUpdateE = new ArticleUpdateE();
        articleUpdateE.setBody("body");
        articleUpdateE.setPhotoToken("aaa");
        articleUpdateE.setPublic(false);
        articleUpdateE.setTitle("aaa");

        BeanChecker bhChecker = new BeanChecker(false);
        try {
            bhChecker.check(articleUpdateE);
            //the instruction above never happens
            Assert.assertTrue(false);
        } catch (BeanCheckerException e) {
            Assert.assertEquals(NotNull.class, e.getValidationContext()
                    .getAnnotation().annotationType());
            Assert.assertEquals("summary", e.getValidationContext().getName());
        }
    }


    @Test
    public void checkAnnotation() {
        Annotation annotation = ArticleCreationE.class.getAnnotation(ApiMethodParameters.class);
        Assert.assertTrue(annotation.annotationType() == ApiMethodParameters.class);
    }
}
