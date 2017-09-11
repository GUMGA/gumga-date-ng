(function(angular){

    angular.module('app', ['gumga.date', 'gumga.layout'])
      .config(function(GumgaDateServiceProvider){
        GumgaDateServiceProvider.setDefaultConfiguration({
          fontColor: '#000'
        })
      })
      .controller('ctrl', function($scope) {

        $scope.nascimento = new Date("2017-03-25T10:30:00-03:00");

        $scope.teste = function(evt){
          console.log(evt)
        }

        // LEFT_BOTTOM,LEFT_TOP,BOTTOM_LEFT,BOTTOM_RIGHT,RIGHT_BOTTOM,RIGHT_TOP,TOP_LEFT,TOP_RIGHT

        $scope.config = {
          fontColor: '#fff',
          format: 'dd/MM/yyyy',
          position: 'BOTTOM_LEFT',
          closeOnChange : true,
          changeDateOnTab: false,
          showCalendar: true,
          timeZone: "America/Sao_Paulo",
          change: function(data){
            // console.log(data)
          }
        }

        $scope.config2 = {
          fontColor: '#fff',
          format: 'HH:mm',
          position: 'BOTTOM_LEFT',
          showCalendar: true,
          timeZone: "America/Sao_Paulo",
          change: function(data){
            // console.log(data)
          }
        }

      });

})(window.angular);
