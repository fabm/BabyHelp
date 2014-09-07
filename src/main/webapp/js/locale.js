var locale = {};

locale.current = navigator.language || navigator.userLanguage;

locale['pt-PT'] = {
    'unexpected': {
        0: function get() {
            return 'Erro inesperado deve contactar o administrador'
        }
    },
    'loadingData': function () {
        return 'A carregar dados...'
    }
}