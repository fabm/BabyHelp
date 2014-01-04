import managerTest.InputsTest;
import managerTest.ManagerTest;
import org.junit.Assert;
import org.junit.Test;
import pt.babyHelp.core.Manager;
import pt.babyHelp.core.validators.EmailValidator;
import pt.babyHelp.core.validators.IntegerValidator;
import pt.babyHelp.core.webComponents.inputs.Input;
import pt.babyHelp.core.webComponents.inputs.InputDefault;

import java.util.Iterator;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 31/12/13
 * Time: 12:42
 * To change this template use File | Settings | File Templates.
 */
public class TesteValidators {

    @Test
    public void managerTest(){
        RequestMock requestMock = new RequestMock();

        ManagerTest managerTest = new ManagerTest();
        managerTest.setRequest(requestMock);
        InputsTest inputs = managerTest.getInputContainer();

        System.out.println("1ª Apresentação do formulário");

        managerTest.postRendering();

        printInput(inputs.getEmail());
        printInput(inputs.getInteiro());


        requestMock.getParameterMap().put(inputs.getInteiro().getName(),
                "5");
        requestMock.getParameterMap().put(inputs.getEmail().getName(),
                "francisco.ab.monteiro@gmail.com");

        managerTest = new ManagerTest();
        managerTest.setRequest(requestMock);
        inputs = managerTest.getInputContainer();

        System.out.println("Request do formulário feito");

        Assert.assertTrue(!inputs.getEmail().getMsgsIterator().iterator().hasNext());
        Assert.assertTrue(!inputs.getInteiro().getMsgsIterator().iterator().hasNext());

        managerTest.postRendering();

        printInput(inputs.getEmail());
        printInput(inputs.getInteiro());
    }

    @Test
    public void managerTestWithErrors(){
        System.out.println("Test manager with errors");
        RequestMock requestMock = new RequestMock();

        ManagerTest managerTest = new ManagerTest();
        managerTest.setRequest(requestMock);
        InputsTest inputs = managerTest.getInputContainer();

        System.out.println("1ª Apresentação do formulário");

        managerTest.postRendering();

        printInput(inputs.getEmail());
        printInput(inputs.getInteiro());


        requestMock.getParameterMap().put(inputs.getInteiro().getName(),
                "");
        requestMock.getParameterMap().put(inputs.getEmail().getName(),
                "");

        managerTest = new ManagerTest();
        managerTest.setRequest(requestMock);
        inputs = managerTest.getInputContainer();

        System.out.println("Request do formulário feito");

        Assert.assertTrue(inputs.getEmail().getMsgsIterator().iterator().hasNext());
        Assert.assertTrue(inputs.getInteiro().getMsgsIterator().iterator().hasNext());

        managerTest.postRendering();

        printInput(inputs.getEmail());
        printInput(inputs.getInteiro());
    }

    @Test
    public void managerTestWithErrors2(){
        System.out.println("Test manager with errors 2");
        RequestMock requestMock = new RequestMock();

        ManagerTest managerTest = new ManagerTest();
        managerTest.setRequest(requestMock);
        InputsTest inputs = managerTest.getInputContainer();

        System.out.println("1ª Apresentação do formulário");

        managerTest.postRendering();

        printInput(inputs.getEmail());
        printInput(inputs.getInteiro());


        requestMock.getParameterMap().put(inputs.getInteiro().getName(),
                "this is not a number");
        requestMock.getParameterMap().put(inputs.getEmail().getName(),
                "this is not a mail");

        managerTest = new ManagerTest();
        managerTest.setRequest(requestMock);
        inputs = managerTest.getInputContainer();

        System.out.println("Request do formulário feito");

        Assert.assertTrue(inputs.getEmail().getMsgsIterator().iterator().hasNext());
        Assert.assertTrue(inputs.getInteiro().getMsgsIterator().iterator().hasNext());

        managerTest.postRendering();

        printInput(inputs.getEmail());
        printInput(inputs.getInteiro());
    }


    public void printInput(Input input){
        System.out.println("Name:"+input.getName());
        System.out.println("FieldLabel:"+input.getFieldLabel());
        System.out.println("ID:"+input.getIdField());
        if(input.getValue()==null){
            System.out.println("Value:null");
        }else{
            System.out.println("ValueType:"+input.getValue().getClass());
            System.out.println("Value:"+input.getValue());
        }
        System.out.println("Messages:");
        printMessages(input);
        System.out.println();
    }

    public void printMessages(Input input){
        Iterator msgIterator = input.getMsgsIterator().iterator();
        while (msgIterator.hasNext()){
            System.out.println("  MSG:"+msgIterator.next());
        }
    }

}
