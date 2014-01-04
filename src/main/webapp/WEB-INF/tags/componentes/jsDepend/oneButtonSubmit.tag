<%@tag description="oneButtonSend" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@taglib prefix="jsd" tagdir="/WEB-INF/tags/componentes/jsDepend" %>
<%@attribute name="manager" type="pt.babyHelp.core.Manager" required="true" %>
<%@attribute name="idForm" required="true" %>
<%@attribute name="idOkButton" required="true" %>
<jsd:jqueryTools manager="${manager}"/>
<jsd:appendDeppendent manager="${manager}" tittle="one-button-submit">
    <script>
        jQuery.fn.extend({
                    oneButtonSubmit: function (buttonOK) {
                        var validatedForm = false;
                        $(buttonOK).click(function () {
                            validatedForm = true;
                        });
                        $(this).submit(function (event) {
                            if (!validatedForm) event.preventDefault();
                        });
                    }
                }
        );
    </script>
</jsd:appendDeppendent>
<jsd:appendJQOnReady manager="${manager}">$("#${idForm}").oneButtonSubmit("${idOkButton}");</jsd:appendJQOnReady>

