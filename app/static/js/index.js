import CategoryManager from "./manager/categoryManager.js";
import CategoryView from "./views/categoryView.js";
import BudgetManager from "./manager/budgetManager.js";
import BudgetView from "./views/budgetView.js";

// 画面切り替えユーティリティ関数
function switchSection(targetId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });
    document.getElementById(targetId).classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
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
        amountInput: document.getElementById("amount"),

    });
    const budgetView = new BudgetView(budgetManager,
        {
            prevDayBtn: document.getElementById("prevDayBtn"),
            nextDayBtn: document.getElementById("nextDayBtn"),
            submitBtn: document.getElementById("submitBtn"),
            overlay: document.getElementById("overlay")
        }
    );
    budgetView.init();

    // 画面切り替えイベント
    document.getElementById("budgetBtn").addEventListener("click", () => {
        switchSection("budget");
    });

    document.getElementById("calendarBtn").addEventListener("click", () => {
        switchSection("calendar");
    });

    document.getElementById("reportBtn").addEventListener("click", () => {
        switchSection("report");
    });

    document.getElementById("menuBtn").addEventListener("click", () => {
        switchSection("menu");
    });

    // カテゴリ編集画面に移動
    document.getElementById("categoryBtn").addEventListener("click", () => {
        switchSection("category");
    });

    // 家計簿入力画面に戻る
    document.getElementById("backBudgetBtn").addEventListener("click", () => {
        switchSection("budget");
    });
});

