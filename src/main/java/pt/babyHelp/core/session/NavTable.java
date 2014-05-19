package pt.babyHelp.core.session;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * This class represents a table state navigation in session map
 *
 * @param <I>
 */
public class NavTable<I> implements Serializable, Pageable {
    private int itemsPerPage;
    private int lastPage;
    private int page;
    private Map<Integer, I> mappedIds;

    public NavTable(int itemsPerPage, int count) {
        this.itemsPerPage = itemsPerPage;
        this.lastPage = (count-1)/itemsPerPage;
    }

    public void createMappedIds() {
        mappedIds = new HashMap<Integer, I>();
    }

    public int append(I realId) {
        int r = mappedIds.size();
        mappedIds.put(r, realId);
        return r;
    }

    public Map<Integer, I> getMappedIds() {
        return mappedIds;
    }

    public int getItemsPerPage() {
        return itemsPerPage;
    }

    public int getLastPage() {
        return lastPage;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    @Override
    public boolean hasNext() {
        return page < lastPage;
    }

    @Override
    public boolean hasPrev() {
        return page > 0;
    }

    public void incrementPage() {
        if (hasNext()) page++;
        mappedIds = null;
    }

    public void decrementPage() {
        if (hasPrev()) page--;
        mappedIds = null;
    }

}
