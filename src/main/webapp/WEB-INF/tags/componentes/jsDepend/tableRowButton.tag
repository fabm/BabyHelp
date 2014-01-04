<%@tag description="oneButtonSend" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@taglib prefix="jsd" tagdir="/WEB-INF/tags/componentes/jsDepend" %>
<%@attribute name="manager" type="pt.babyHelp.core.Manager" required="true" %>
<%@attribute name="classButtons" required="true" %>
<%@attribute name="idForm" required="true" %>

<jsd:jqueryTools manager="${manager}"/>
<jsd:appendDeppendent manager="${manager}" tittle="table-row-button">
    <script>
        jQuery.fn.extend({
            ol: function (form) {
                button = this;
                return $(this).overlay({
                    mask: {
                        color: '#DDDDDD',
                        loadSpeed: 200,
                        opacity: 0.96
                    },
                    onLoad: function (e) {
                        $(".hiddenAddedToForm").remove();
                        data = $(button).data().params.split(',');
                        for (v in data) {
                            var hiddenAddedToForm = $("<input type='hidden'/>");
                            field = data[v].split(':');
                            hiddenAddedToForm.attr("name", field[0]);
                            hiddenAddedToForm.val(field[1]);
                            hiddenAddedToForm.addClass("hiddenAddedToForm");
                            $(form).append(hiddenAddedToForm);
                        }
                    },
                    closeOnClick: false
                });
            }
        });
    </script>
</jsd:appendDeppendent>
<jsd:appendJQOnReady manager="${manager}">$(".${classButtons}").ol("#${idForm}");</jsd:appendJQOnReady>