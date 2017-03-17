(function(angular){

    angular.module('app', ['gumga.date'])
      .config(function(GumgaDateServiceProvider){
        GumgaDateServiceProvider.setDefaultConfiguration({
          fontColor: '#000'
        })
      })
      .controller('ctrl', function($scope) {

        $scope.teste = {
          position: 'BOTTOM_LEFT',
          format: 'dd/MM/yyyy',
          showCalendar: true,
        }

        // LEFT_BOTTOM,LEFT_TOP,BOTTOM_LEFT,BOTTOM_RIGHT,RIGHT_BOTTOM,RIGHT_TOP,TOP_LEFT,TOP_RIGHT

        $scope.config = {
          fontColor: '#fff',
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
