(() => {
  'use strict';

  require('./date.service.js')
  require('./date.mask.js')
  const TEMPLATE = require('./date.template.js').default;


  const GumgaDate = ($timeout, $filter, $locale, GumgaDateService) => {
    return {
        restrict: 'E',
        template : TEMPLATE,
        scope: {
           config: '=?configuration',
           ngModel: '=',
           ngDisabled: '=?'
        },
        require: '^ngModel',
        link: (scope, elm, attrs) => {
          let self = scope;
          self.uid = Math.floor((Math.random() * 99999999));

          self.config = self.config || {};

          self.getDefaultConfiguration = () => GumgaDateService.getDefaultConfiguration();

          self.range = function(min, max, step) {
              if(!self.opened) return [];
              step = step || 1;
              var input = [];
              for (var i = min; i <= max; i += step) {
                  input.push(i);
              }
              return input;
          };

          self.getScrollSize = () => {
            if(!self.gumgaDateValue) return;
            let index = self.gumgaDateValue.getFullYear() - self.getMinYear();
            return (index * 92) - 50;
          }

          self.getWeekDays = () => {
              let dateformats = $locale.DATETIME_FORMATS;
              return dateformats.SHORTDAY.map(day=>{
                return day.substring(0,3);
              });
          }

          self.getGumgaMonths = (cut) => {
              let dateformats = $locale.DATETIME_FORMATS;
              return dateformats.STANDALONEMONTH.map(day=>{
                  return cut ? day.substring(0,3) : day;
              });
          }

          const formatDate = (date, format) => {
            return $filter('date')(date, format);
          }

          const init = () => {
            self.inputFormat = self.config.format ? self.config.format : self.getDefaultConfiguration().format;
            self.type =
            self.inputFormat.toLowerCase().indexOf('hh:mm') != -1
            && self.inputFormat.toLowerCase().indexOf('dd') == -1 ? 'HOUR' : self.type;

            self.type = self.inputFormat.toLowerCase().indexOf('hh:mm') != -1
            && self.inputFormat.toLowerCase().indexOf('dd') != -1 ? 'DATE_HOUR' : self.type;

            self.type = self.inputFormat.toLowerCase().indexOf('hh:mm') == -1
            && self.inputFormat.toLowerCase().indexOf('dd') != -1 ? 'DATE' : self.type;

            self.mask = self.inputFormat.replace(/[a-zA-Z\d]/g, '9');

            self.inputProperties = {
                class: self.config.inputProperties&&self.config.inputProperties.class?self.config.inputProperties.class:self.getDefaultConfiguration().inputProperties.class,
                placeholder: self.config.inputProperties&&self.config.inputProperties.placeholder?self.config.inputProperties.placeholder:angular.noop()
            }

            self.style = {
              fontColor: self.config.fontColor || self.getDefaultConfiguration().fontColor,
              background: self.config.background || self.getDefaultConfiguration().background
            }

            if(self.ngModel && (self.ngModel instanceof Date)){
               self.gumgaDateValue = self.ngModel;
               self.setNgModel(self.gumgaDateValue)
            }else if(self.ngModel && (typeof self.ngModel == "string")){
              let date = moment(self.ngModel).toDate();
              self.gumgaDateValue = date;
              self.setNgModel(self.gumgaDateValue);
            }else{
              self.gumgaDateValue = new Date();
            }

            if(self.type == 'HOUR'){
              self.alterView('hours');
            }else{
              self.alterView('days');
            }

          }

          const isDate = function(s) {
            let separators = ['\\.', '\\-', '\\/'];
            let bits = s.split(new RegExp(separators.join('|'), 'g'));
            let d = new Date(bits[2], bits[1] - 1, bits[0]);
            return d.getFullYear() == bits[2] && d.getMonth() + 1 == bits[1];
          }


          self.alterView = view => {
            self.view = view;
            if(view == 'months'){
              if(!self.years)
                self.years = self.range(self.getMinYear(), self.getMaxYear());
              handlingScroll();
            }
          }


          let calendar = undefined;

          const animateScroll = (size ,scrollTop) => {
            if(size > scrollTop){
              let x = (Math.abs(size - scrollTop + 2000) / 30);
              calendar.scrollTop += x < 1 ? 1 : x;
              $timeout(()=>animateScroll(size, calendar.scrollTop));
            }else if(scrollTop > size && scrollTop > 0){
              let x = (Math.abs(scrollTop - size) / 30);
              calendar.scrollTop -= x < 1 ? 1 : x;
              $timeout(()=>animateScroll(size, calendar.scrollTop));
            }
          }

          const handlingScroll = () => {
            calendar = document.getElementById('year-and-month-'+self.uid)
            $timeout(()=>{
              let size = self.getScrollSize();
              animateScroll(size, calendar.scrollTop)
            })
          }

          self.handlingHours = (num) => {
            self.gumgaDateValue.setHours(self.gumgaDateValue.getHours() + num);
            self.setNgModel(self.gumgaDateValue)
          }

          self.handlingMinutes = (num) => {
            self.gumgaDateValue.setMinutes(self.gumgaDateValue.getMinutes() + num);
            self.setNgModel(self.gumgaDateValue)
          }

          self.getFormatLength = () => self.inputFormat ? self.inputFormat.replace(/[^a-zA-Z0-9]/g,'').length : 0;

          self.setGumgaDateValue = (value, event) => {
              self.inputFormat = self.config.format ? self.config.format : self.getDefaultConfiguration().format;
              let minYear = self.getMinYear();
              let maxYear = self.getMaxYear();
              let timeZone = self.config.timeZone ? self.config.timeZone : self.getDefaultConfiguration().timeZone;

              let date = moment(value, self.inputFormat.toUpperCase().replace('HH:MM', 'hh:mm')).tz(timeZone).toDate()
              if(value && date != 'Invalid Date' && (date.getFullYear() >= minYear && date.getFullYear() <= maxYear)){
                self.gumgaDateValue = date;
                self.setNgModel(self.gumgaDateValue)
              }else{
                self.value = null;
              }
          }

          self.getMinYear = () => {
            return self.config.minYear ? self.config.minYear : self.getDefaultConfiguration().minYear;
          }

          self.getMaxYear = () => {
            return self.config.maxYear ? self.config.maxYear : self.getDefaultConfiguration().maxYear;
          }

          self.getMonth = () => {
            if(!self.gumgaDateValue || !(self.gumgaDateValue instanceof Date)) return;
            return self.getGumgaMonths()[self.gumgaDateValue.getMonth()];
          }

          self.setDay = day => {
            if(!self.gumgaDateValue || !(self.gumgaDateValue instanceof Date)) return;
            let update = new Date();
            update.setYear(day.year);
            update.setMonth(day.mouth);
            update.setDate(day.value);
            update.setHours(self.gumgaDateValue.getHours());
            update.setMinutes(self.gumgaDateValue.getMinutes());
            update.setSeconds(self.gumgaDateValue.getSeconds());
            self.gumgaDateValue = update;
            self.setNgModel(self.gumgaDateValue)
          }

          self.setYearAndMonth = (year, month) => {
            if(!self.gumgaDateValue || !(self.gumgaDateValue instanceof Date)) return;
            self.getGumgaMonths(true).forEach((gumgaMonth, index)=>{
                if(gumgaMonth == month) {
                  let update = new Date();
                  update.setYear(year);
                  update.setMonth(index);
                  update.setDate(self.gumgaDateValue.getDate());
                  update.setHours(self.gumgaDateValue.getHours());
                  update.setMinutes(self.gumgaDateValue.getMinutes());
                  update.setSeconds(self.gumgaDateValue.getSeconds());
                  self.gumgaDateValue = update;
                  self.setNgModel(self.gumgaDateValue)
                  self.alterView('days');
                }
            });
          }

          self.getYear = () => {
            if(!self.gumgaDateValue) return;
            return self.gumgaDateValue.getFullYear();
          }

          self.isToday = day => {
              return day.value == self.gumgaDateValue.getDate() && day.mouth == self.gumgaDateValue.getMonth();
          }

          self.isThatMonth = (year, mouth) => {
              return self.getGumgaMonths(true)[self.gumgaDateValue.getMonth()] == mouth && self.gumgaDateValue.getFullYear() == year;
          }

          self.config.open = (event) => {
              if(event) event.stopPropagation();
              self.opened = true;
              newCalendar(self.gumgaDateValue.getMonth(), self.gumgaDateValue.getFullYear());
          }

          self.config.close = () => {
              self.opened = false;
              self.alterView('days');
          }

          const getDaysInMonth = (date) => {
              return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
          };

          self.handlingMonths = function (date, num) {
              self.gumgaDateValue = moment(date).add(num, 'months').toDate();
              self.setNgModel(self.gumgaDateValue)
              if(self.view == 'months'){
                handlingScroll();
              }
          }

          self.$watch('config', () => {
            init();
          }, true)

          self.$watch('ngModel', (value) => {
            if(self.ngModel && (self.ngModel instanceof Date)){
               self.gumgaDateValue = self.ngModel;
               newCalendar(value.getMonth(), value.getFullYear());
               self.value = formatDate(angular.copy(value), self.inputFormat);
            }
            if(self.ngModel && (typeof self.ngModel == "string")){
              let date = moment(self.ngModel).toDate();
              self.gumgaDateValue = date;
              newCalendar(date.getMonth(), date.getFullYear());
              self.value = formatDate(angular.copy(date), self.inputFormat);
            }
          }, true)

          self.$watch('value', (value) => value ? self.setGumgaDateValue(value) : self.ngModel = null);

          self.setNgModel = (value) => {
            let timeZone = self.config.timeZone ? self.config.timeZone : self.getDefaultConfiguration().timeZone;
            self.ngModel = moment.tz(value, timeZone).format();
            newCalendar(value.getMonth(), value.getFullYear());
            self.value = formatDate(angular.copy(value), self.inputFormat);
            if(self.config.change) self.config.change(self.ngModel);
          }

          elm.bind('click', (event) => {
            event.stopPropagation();
          })

          let listener = document.addEventListener('click', event => {
            $timeout(self.config.close);
          })

          self.$on('$destroy', () => {
            document.removeEventListener('click', listener);
          })

          const newCalendar = (mouth, year) => {
            if(!self.opened) return;
            let primaryDay = new Date(year, mouth, 1), count = 1;
            var possibilities = new Array(42);

            for(var x = 0; x < possibilities.length; x++){
          		possibilities[x] = "";
          	}

            for(let x = primaryDay.getDay(); x < possibilities.length; x ++){
              let data = new Date(year, mouth, count);
              possibilities[x] = {value: data.getDate()}
              if(data.getMonth() != mouth){
                possibilities[x].style = 'color: #b7aaaa !important;';
              }
              possibilities[x].mouth = data.getMonth();
              possibilities[x].year = data.getFullYear();
              count++;
            }

            let previousMonth = moment(new Date(year, mouth, 1)).add(-1, 'months');
            for (let i = 0; i < primaryDay.getDay(); i++) {
                possibilities[(primaryDay.getDay()-1) - i] = {
                  value :  previousMonth.daysInMonth() - i,
                  style : 'color: #b7aaaa !important;',
                  mouth: previousMonth.toDate().getMonth(),
                  year: previousMonth.toDate().getFullYear()
                }
            }
            self.rows = possibilities;
          }


        }
    }
  }

  GumgaDate.$inject = ['$timeout', '$filter', '$locale', 'GumgaDateService'];

  angular.module('gumga.date', ['gumga.date.service', 'gumga.date.mask'])
         .directive('gumgaDate', GumgaDate);
})();
