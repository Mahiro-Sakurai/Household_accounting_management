console.log("budgetManager読み込み")
/*
import FormInput from "../modules/FormInput.js";
import CategoryManager from "../modules/CategoryManager.js";
import { submitBudget } from "../api/budgetApi.js";


export default class BudgetManager {
    constructor() {
        this.formInput = null;
        this.categoryManager = null;
        this.submitBtn = document.getElementById("submitBtn");
    }

    init() {
        this.formInput = new FormInput({
            dateInput: document.getElementById("date"),
            prevBtn: document.getElementById("prevDayBtn"),
            nextBtn: document.getElementById("nextDayBtn"),
            memo: document.getElementById("memo"),
            errorMsg: document.getElementById("memoInputError"),
            amount: document.getElementById("amount")
        });
        this.formInput.init();

        this.categoryManager = new CategoryManager({
            displayGrid: document.getElementById("categoryGrid"),
            editGrid: document.getElementById("editCategoryGrid"),
            addBtn: document.getElementById("addCategoryBtn"),
            addInput: document.getElementById("addCategoryInput"),
            editToggleBtn: document.getElementById("editCategoryBtn"),
            toggleBtns: document.querySelectorAll(".toggleBtn"),
            amountInput: document.getElementById("amount"),
        });
        this.categoryManager.render();

        this.setupSubmit();
    }

    setupSubmit() {
        this.submitBtn.addEventListener("click", async () => {
            const { date, memo, amount } = this.formInput.getInputData();
            const category = this.categoryManager.getSelectedCategory();
            const expenseType = document.querySelector(".income-expense-toggle .active")?.dataset.type || "expense";

            if (!category || !amount || !expenseType) {
                alert("必要な情報が入力されていません");
                return;
            }

            const data = {
                date,
                amount,
                memo,
                category_id: category.id,
                expenseType
            };

            try {
                const result = await submitBudget(data);
                console.log("送信結果:", result);
                alert("データが保存されました！");
            } catch {
                alert("データ保存に失敗しました。");
            }
        });
    }
}
*/