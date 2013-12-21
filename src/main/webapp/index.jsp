<%@page pageEncoding="UTF-8" %>
<%@ taglib prefix="tpl" tagdir="/WEB-INF/tags/tpl" %>
<%@ taglib prefix="cp" tagdir="/WEB-INF/tags/componentes" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:useBean id="m" class="pt.babyHelp.managers.index.IndexManager"/>
<tpl:master manager="${m}">

    <jsp:attribute name="javascript">
        <script src="http://cdn.jquerytools.org/1.2.7/full/jquery.tools.min.js"></script>

        <script>
            jQuery.fn.extend({
                oneButtonSubmit:function(buttonOK){
                    var validatedForm=false;
                    $(buttonOK).click(function(){
                        validatedForm = true;
                    });
                    $(this).submit(function(event){
                        if(!validatedForm) event.preventDefault();
                    });
                }
            }
            );
            jQuery.fn.extend({
                ol:function(form){
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
                            for(v in data){
                                var hiddenAddedToForm = $("<input type='hidden'/>");
                                field=data[v].split(':');
                                hiddenAddedToForm.attr("name",field[0]);
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

    </jsp:attribute>

    <jsp:attribute name="conteudo">
        <c:if test="${m.validator.admin}">
            <tpl:index-administrator m="${m}"/>
            <div class="modal" id="yesno" style="position: fixed; z-index: 0; top: 200px; left: 528px; display: none;">
                <h2>${m.bundle.confirmRemotionTitle}</h2>

                <form action="removerht.jsp" id="form-remove-user">
                    <p>
                        <button class="close" id="buttonYes">${m.bundle.buttonYes}</button>
                        <button class="close" id="buttonNo">${m.bundle.buttonNo}</button>
                    </p>
                </form>
            </div>
            <script>
                $(document).ready(function () {
                    $("#form-remove-user").oneButtonSubmit("button#buttonYes");
                    $(".button-remove").ol("#form-remove-user");
                });
            </script>
            <div id="exposeMask"
                 style="position: absolute; top: 0px; left: 0px; width: 1440px; height: 511px; display: none; opacity: 1; z-index: 9998; background-color: rgb(235, 236, 255);"></div>
        </c:if>
        <c:if test="${!m.validator.admin}">
            Olá utilizador
        </c:if>
    </jsp:attribute>
</tpl:master>