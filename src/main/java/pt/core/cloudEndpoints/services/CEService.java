package pt.core.cloudEndpoints.services;

import pt.core.cloudEndpoints.CEError;
import pt.core.cloudEndpoints.CEReturn;

public interface CEService<A extends CEActionMap<?,?>> {
    CEReturn execute(A action,Object...args) throws CEError;
}
