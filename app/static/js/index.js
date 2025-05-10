import changeSection from "./script.js"
import openForm from "./openForm.js"

import CalendarManager from "./manager/calendarManager.js";
import CalendarView from "./views/calendarView.js";




document.addEventListener("DOMContentLoaded", async () => {
    const initialData = {
        type: "expense",
        date: new Date(),
        memo: "",
        amount: 0,
        selectedCategory: null
    }
    await openForm("budgetFormCreateToday", "create", initialData);
    changeSection("budget");


    const calendarManager = new CalendarManager({
        monthLabel: document.getElementById("monthLabel")
    })
    const calendarView = new CalendarView(calendarManager, {
        prevMonthBtn: document.getElementById("prevMonthBtn"),
        nextMonthBtn: document.getElementById("nextMonthBtn"),
        calendarGrid: document.getElementById("calendarGrid"),
        monthlySummary: document.getElementById("monthlySummary"),
        detailContainer: document.getElementById("detailContainer")
    });
    calendarView.init();

})