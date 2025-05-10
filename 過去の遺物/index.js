// カテゴリ管理初期化
const categoryManager = new CategoryManager();
const categoryView = new CategoryView(categoryManager, {
    displayGrid: document.getElementById("categoryGrid"),
    editGrid: document.getElementById("editCategoryGrid"),
    addBtn: document.getElementById("addCategoryBtn"),
    addInput: document.getElementById("addCategoryInput"),
    editToggleBtn: document.getElementById("editCategoryBtn"),
    toggleBtns: document.querySelectorAll(".toggleBtn"),
    amountInput: document.getElementById("amount")
});
categoryView.init();

// budget管理初期化
const budgetManager = new BudgetManager(categoryManager, {
    dateInput: document.getElementById("date"),
    memoInput: document.getElementById("memo"),
    amountInput: document.getElementById("amount")
});
const budgetView = new BudgetView(budgetManager, {
    prevDayBtn: document.getElementById("prevDayBtn"),
    nextDayBtn: document.getElementById("nextDayBtn"),
    submitBtn: document.getElementById("submitBtn"),
    overlay: document.getElementById("overlay")
});
budgetView.init();
