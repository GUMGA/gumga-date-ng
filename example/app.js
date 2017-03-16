(function(angular){

    angular.module('app', ['gumga.date'])
      .controller('ctrl', function($scope, GumgaDateService){



        GumgaDateService.setDefaultConfiguration({
          fontColor: '#fff',
        })


        $scope.teste = function(){
          $scope.nascimento = "1953-03-15T12:23:25-03:00";
        }

        $scope.config = {
          fontColor: '#FFF',
          format: 'dd/MM/yyyy HH:mm',
          timeZone: "America/Sao_Paulo"
        }

      });

})(window.angular);
