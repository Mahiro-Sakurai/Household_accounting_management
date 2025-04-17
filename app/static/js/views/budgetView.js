console.log("budgetView読み込み")

export default class BudgetView {
    constructor(budgetManager, elements) {
        this.budgetManager = budgetManager;
        this.prevDayBtn = elements.prevDayBtn;
        this.nextDayBtn = elements.nextDayBtn;
        this.submitBtn = elements.submitBtn;
        this.overlay = elements.overlay;

        this.prevDayBtn.addEventListener("click", () => this.budgetManager.prevDate());
        this.nextDayBtn.addEventListener("click", () => this.budgetManager.nextDate());
        this.submitBtn.addEventListener("click", () => {
            this.budgetManager.addBudget(() => this.showModal());
        });
    }

    init() {
        this.budgetManager.init();
        this.renderMemoValidate();

    }

    renderMemoValidate() {
        this.budgetManager.memoValidate()
    }



    showModal() {
        this.overlay.classList.remove("hidden");

        setTimeout(() => {
            this.overlay.classList.add("hidden");
        }, 800);
    }
}