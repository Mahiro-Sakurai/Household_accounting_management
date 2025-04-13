import { createBudget } from "../api/budgetApi.js";

export default class BudgetManager {
    constructor(categoryManager, options) {
        this.categoryManager = categoryManager;

        this.dateInput = options.dateInput;
        this.memoInput = options.memoInput;
        this.amountInput = options.amountInput;

        this._date = new Date();
    }

    init() {
        this.updateDateInput();
    }

    updateDateInput() {
        this.dateInput.value = this._date.toISOString().split("T")[0];
    }

    prevDate() {
        this._date.setDate(this._date.getDate() - 1);
        this.updateDateInput();
    }
    nextDate() {
        this._date.setDate(this._date.getDate() + 1);
        this.updateDateInput();
    }

    getDate() {
        return this._date;
    }

    memoValidate() {
        console.log("memoValidate")
    }

    async addBudget(onSuccess) {
        const payload = {
            expense_type: this.categoryManager.currentType,
            date: this._date,
            amount: this.amountInput.value,
            memo: this.memoInput.value,
            category_id: this.categoryManager.getSelectedCategory()?.id
        };

        try {
            await createBudget(payload);
            if (onSuccess) onSuccess(); // ←成功したらviewの関数を呼ぶ
        } catch (e) {
            console.error("APIエラー:", e);
        }
    }
}