package pt.babyHelp.endPoints.testes;

import pt.babyHelp.bd.MyDate;

public class SonParameter {
    String name;
    MyDate birthDay;
    String photokey;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MyDate getBirthDay() {
        return birthDay;
    }

    public void setBirthDay(MyDate birthDay) {
        this.birthDay = birthDay;
    }

    public String getPhotokey() {
        return photokey;
    }

    public void setPhotokey(String photokey) {
        this.photokey = photokey;
    }
}
