(function(angular){

    angular.module('app', ['gumga.date'])
      .controller('ctrl', function($scope, GumgaDateService){

        $scope.nascimento = "1953-03-15T12:18:25-03:00"

        GumgaDateService.setDefaultConfiguration({
          fontColor: '#fff',
        })


        $scope.config = {
          fontColor: '#FFF',
          format: 'dd/MM/yyyy HH:mm',
          timeZone: "America/Sao_Paulo"
        }

      });

})(window.angular);
