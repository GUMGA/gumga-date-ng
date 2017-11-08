export class DateHoliday {

    constructor(_date, _holidays){
        this.date = moment(_date, "YYYY-MM-DD");
        this._holidays = _holidays;
    }

    isHoliday(){
        return this.date.holiday(this._holidays) != undefined;
    }

    getNameHoliday(){
        return this.date.holiday(this._holidays);
    }
    
}