package pt.core.page;

import java.util.Map;

/**
 * Interface para servir de interador de uma consulta paginada
 *
 * @param <T> class da entidade de persistência
 */
public interface Page<T> {
    static final String LASTPAGE = "lastpage";
    static final String HEADER = "header";
    static final String BODY = "body";
    static final String NO_ROWS_ERROR = "no rows";

    /**
     * <p>Processamento da página da query</p>
     *
     * @param page      página a ser mostrada
     * @param qtPerPage quantidade de registos por página
     * @param extraInfo caso seja necessário toda a informção além do body, abaixo os exemplos de formatação
     *                  <p>caso o pârametro {@code extraInfo} seja {@code true} deve
     *                  ter o formato como o exemplo abaixo:</p>
     *                  <ul>
     *                  <li>header:
     *                  <ul>
     *                  <li>coluna 1</li>
     *                  <li>coluna 2</li>
     *                  <li>...</li>
     *                  </ul>
     *                  </li>
     *                  <li>body:
     *                  <ul>
     *                  <li>valor 1</li>
     *                  <li>valor 2</li>
     *                  <li>...</li>
     *                  </ul>
     *                  </li>
     *                  <li>lastpage:4</li>
     *                  </ul>
     *                  <p>caso contrário o formato seria:</p>
     *                  <li>body:
     *                  <ul>
     *                  <li>valor 1</li>
     *                  <li>valor 2</li>
     *                  <li>...</li>
     *                  </ul>
     *                  </li>
     * @return mapa com o resultado da paginação
     */
    Map<String, Object> process(int page, int qtPerPage, boolean extraInfo);

}
