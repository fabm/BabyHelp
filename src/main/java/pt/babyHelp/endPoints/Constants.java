package pt.babyHelp.endPoints;

/**
 * <p>Contains the client IDs and scopes for allowed clients consuming the babyHelp API.</p>
 * <p>Used in {@link com.google.api.server.spi.config.Api}</p>
 * <p>To get the client ids you must:</p>
 * <ul>
 * <li>
 * navigate to
 * <a href="https://console.developers.google.com/project">Google Developers Console</a> url
 * </li>
 * <li>choose de project</li>
 * <li>in left bar, select APIs & auth option</li>
 * <li>Credentials</li>
 * <li>In the red button in the main area of the page click in CREATE NEW CLIENT ID</li>
 * <p/>
 * </ul>
 *
 *
 */
public interface Constants {

    public static final String WEB_CLIENT_ID = "942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com";
    public static final String ANDROID_CLIENT_ID = WEB_CLIENT_ID;
    public static final String IOS_CLIENT_ID = WEB_CLIENT_ID;
    public static final String ANDROID_AUDIENCE = WEB_CLIENT_ID;
    public static final String EMAIL = "https://www.googleapis.com/auth/userinfo.email";
    public static final String API_EXPLORER_CLIENT_ID
            = com.google.api.server.spi.Constant.API_EXPLORER_CLIENT_ID;

}
