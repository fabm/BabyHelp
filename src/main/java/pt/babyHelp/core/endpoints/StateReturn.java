package pt.babyHelp.core.endpoints;

import java.util.HashMap;
import java.util.Map;

public class StateReturn implements EndPointReturn {
    private String state;

    public StateReturn(String state) {
        this.state = state;
    }

    @Override
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("state", state);
        return map;
    }

    @Override
    public Type getType() {
        return Type.state;
    }

}
