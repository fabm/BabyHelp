package pt.babyHelp.services;

import pt.babyHelp.bd.Son;

public interface SonsService {
    void addSon(Son son);
    void removeSons(long...ids);
    void update(Son son);
}
