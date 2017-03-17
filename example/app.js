(function(angular){

    angular.module('app', ['gumga.date'])
      .controller('ctrl', function($scope, GumgaDateService){

        GumgaDateService.setDefaultConfiguration({
          fontColor: '#fff',
        })

        $scope.teste = {
          position: 'BOTTOM_LEFT',
          format: 'dd/MM/yyyy',
          showCalendar: false,
        }

        // LEFT_BOTTOM,LEFT_TOP,BOTTOM_LEFT,BOTTOM_RIGHT,RIGHT_BOTTOM,RIGHT_TOP,TOP_LEFT,TOP_RIGHT

        $scope.config = {
          fontColor: '#FFF',
          format: 'dd/MM/yyyy HH:mm',
          position: 'BOTTOM_LEFT',
          showCalendar: true,
          timeZone: "America/Sao_Paulo",
          change: function(data){
            // console.log(data)
          }
        }

      });

})(window.angular);
