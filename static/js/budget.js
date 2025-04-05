import FormInput from "./modules/FormInput.js";
import CategoryManager from './modules/CategoryManager.js';
import FormSubmit from "./modules/FormSubmit.js";

document.addEventListener("DOMContentLoaded", () => {

    const formInput = new FormInput({
        dateInput: document.getElementById("date"),
        prevBtn: document.getElementById("prevDayBtn"),
        nextBtn: document.getElementById("nextDayBtn"),
        memo: document.getElementById("memo"),
        errorMsg: document.getElementById("memoInputError"),
        amount: document.getElementById("amount")
    });
    formInput.init();


    const categoryManager = new CategoryManager({
        displayGrid: document.getElementById("categoryGrid"),
        editGrid: document.getElementById("editCategoryGrid"),
        addBtn: document.getElementById("addCategoryBtn"),
        addInput: document.getElementById("addCategoryInput"),
        editToggleBtn: document.getElementById("editCategoryBtn"),
        toggleBtns: document.querySelectorAll(".toggleBtn"),
        amountInput: document.getElementById("amount"),
    });
    categoryManager.render();

    const formSubmit = new FormSubmit("submitBtn", formInput, categoryManager);
    formSubmit.init();
});
