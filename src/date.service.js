(() => {
  'use strict';

  const GumgaService = () => {
      let service = {};

      service.configuration = {
        background: '#1abc9c',
        primaryColor: '#1abc9c',
        fontColor: '#fff',
        format: 'dd/MM/yyyy',
        minYear: 1905,
        timeZone: "America/Sao_Paulo",
        maxYear: 2050,
        inputProperties: {
          class: 'form-control'
        }
      }

      service.getDefaultConfiguration = () => {
        return service.configuration;
      }

      service.setDefaultConfiguration = config => {
        Object.keys(config).forEach(key => service.configuration[key] = config[key]);
      }

      return service;
  }

  angular.module('gumga.date.service', [])
         .service('GumgaDateService', GumgaService);
})();
