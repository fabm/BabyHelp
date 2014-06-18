package pt.babyHelp.cloudEndpoints.user;

import pt.babyHelp.bd.Son;

import java.util.List;

public class SonsParameters{
    private List<Son> sons;

    public List<Son> getSons() {
        return sons;
    }

    public void setSons(List<Son> sons) {
        this.sons = sons;
    }
}

