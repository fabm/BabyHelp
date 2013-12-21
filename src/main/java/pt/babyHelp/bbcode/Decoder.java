package pt.babyHelp.bbcode;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 25/10/13
 * Time: 20:26
 * To change this template use File | Settings | File Templates.
 */
public class Decoder {

    public static String bbcode(String text) {
        String html = text;

        Map<String, String> bbMap = new HashMap<String, String>();



        html=html.replaceAll("\\[\\*\\](.+?)(?:\r\n|\r|\n|\n\r)", "<li>$1</li>");
        html=html.replaceAll("(\r\n|\r|\n|\n\r)", "<br/>");
        html=html.replaceAll("\\[list=1\\](.+?)\\[/list\\]", "<ol>$1</ol>");
        html=html.replaceAll("\\[list\\](.+?)\\[/list\\]","<ul>$1</ul>");

        html=html.replaceAll("(\r\n|\r|\n|\n\r)", "<br/>");
        html=html.replaceAll("\\[list=1\\](.+?)\\[/list\\]", "<ol>$1</ol>");
        html=html.replaceAll("\\[b\\](.+?)\\[/b\\]", "<strong>$1</strong>");
        html=html.replaceAll("\\[i\\](.+?)\\[/i\\]", "<span style='font-style:italic;'>$1</span>");
        html=html.replaceAll("\\[u\\](.+?)\\[/u\\]", "<span style='text-decoration:underline;'>$1</span>");
        html=html.replaceAll("\\[h1\\](.+?)\\[/h1\\]", "<h1>$1</h1>");
        html=html.replaceAll("\\[h2\\](.+?)\\[/h2\\]", "<h2>$1</h2>");
        html=html.replaceAll("\\[h3\\](.+?)\\[/h3\\]", "<h3>$1</h3>");
        html=html.replaceAll("\\[h4\\](.+?)\\[/h4\\]", "<h4>$1</h4>");
        html=html.replaceAll("\\[h5\\](.+?)\\[/h5\\]", "<h5>$1</h5>");
        html=html.replaceAll("\\[h6\\](.+?)\\[/h6\\]", "<h6>$1</h6>");
        html=html.replaceAll("\\[quote\\](.+?)\\[/quote\\]", "<blockquote>$1</blockquote>");
        html=html.replaceAll("\\[p\\](.+?)\\[/p\\]", "<p>$1</p>");
        html=html.replaceAll("\\[p=(.+?),(.+?)\\](.+?)\\[/p\\]", "<p style='text-indent:$1px;line-height:$2%;'>$3</p>");
        html=html.replaceAll("\\[center\\](.+?)\\[/center\\]", "<div align='center'>$1");
        html=html.replaceAll("\\[align=(.+?)\\](.+?)\\[/align\\]", "<div align='$1'>$2");
        html=html.replaceAll("\\[color=(.+?)\\](.+?)\\[/color\\]", "<span style='color:$1;'>$2</span>");
        html=html.replaceAll("\\[size=(.+?)\\](.+?)\\[/size\\]", "<span style='font-size:$1;'>$2</span>");
        html=html.replaceAll("\\[img\\](.+?)\\[/img\\]", "<img src='$1' />");
        html=html.replaceAll("\\[img=(.+?),(.+?)\\](.+?)\\[/img\\]", "<img width='$1' height='$2' src='$3' />");
        html=html.replaceAll("\\[email\\](.+?)\\[/email\\]", "<a href='mailto:$1'>$1</a>");
        html=html.replaceAll("\\[email=(.+?)\\](.+?)\\[/email\\]", "<a href='mailto:$1'>$2</a>");
        html=html.replaceAll("\\[url\\](.+?)\\[/url\\]", "<a href='$1'>$1</a>");
        html=html.replaceAll("\\[url=(.+?)\\](.+?)\\[/url\\]", "<a href='$1'>$2</a>");
        html=html.replaceAll("\\[youtube\\](.+?)\\[/youtube\\]", "<object width='640' height='380'><param name='movie' value='http://www.youtube.com/v/$1'></param><embed src='http://www.youtube.com/v/$1' type='application/x-shockwave-flash' width='640' height='380'></embed></object>");
        html=html.replaceAll("\\[video\\](.+?)\\[/video\\]", "<video src='$1' />");

        for (Map.Entry entry : bbMap.entrySet()) {
            html = html.replaceAll(entry.getKey().toString(), entry.getValue().toString());
        }

        return html;
    }
}
