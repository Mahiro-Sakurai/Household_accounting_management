import { readMonthlyBudgets } from '../api/budgetApi.js';

// calendarManager.js
export default class CalendarManager {
    constructor(options) {
        this.monthLabel = options.monthLabel;

        this._date = new Date();
        this.monthlyBudgets = null;
    }

    async init() {
        await this.readMonthlyBudgets();
        this.updateMonth();
    }



    async prevMonth() {
        this._date.setMonth(this._date.getMonth() - 1);
        this.updateMonth();
        await this.readMonthlyBudgets();

    }

    async nextMonth() {
        this._date.setMonth(this._date.getMonth() + 1);
        this.updateMonth();
        await this.readMonthlyBudgets();
    }



    async readMonthlyBudgets() {
        const year = this._date.getFullYear();
        const month = this._date.getMonth() + 1;
        const monthlyBudgets = await readMonthlyBudgets(year, month);
        this.monthlyBudgets = monthlyBudgets;
        console.log(this.monthlyBudgets)
    }


    updateMonth() {
        this.monthLabel.textContent = `${this._date.getFullYear()}年${this._date.getMonth() + 1}月`;
    }



    getDate() {
        return this._date
    }

    getData() {
        return this.monthlyBudgets.data
    }

    getDailyTotals() {
        return this.monthlyBudgets.daily_totals
    }

    getMonthlyTotals() {
        return this.monthlyBudgets.monthly_totals
    }

    getCurrentDate() {
        return this.currentDate;
    }

    formatJapaneseDate(dateStr) {
        const date = new Date(dateStr);

        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 0始まりなので+1
        const day = date.getDate();

        const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
        const weekday = weekdays[date.getDay()];

        return `${year}年${month}月${day}日（${weekday}）`;
    }

}

