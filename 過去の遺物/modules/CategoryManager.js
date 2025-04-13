/*
export default class CategoryManager {
    constructor(options) {
        this.displayGrid = options.displayGrid;
        this.editGrid = options.editGrid;
        this.addBtn = options.addBtn;
        this.addInput = options.addInput;
        this.editToggleBtn = options.editToggleBtn;
        this.toggleBtns = options.toggleBtns;
        this.amountInput = options.amountInput;

        this.currentType = "expense";
        this.selectedCategory = null;
        this.editMode = false;

        this.categories = { expense: [], income: [] };

        this.fetchCategories();
    }

    render() {
        this.renderCategoryButtons();
        this.renderEditCategories();
        this.renderAmountPlaceholder();
    }

    renderAmountPlaceholder() {
        this.amountInput.placeholder = this.currentType === "expense" ? "支出を入力" : "収入を入力";
    }

    renderCategoryButtons() {
        this.displayGrid.innerHTML = '';
        this.categories[this.currentType].forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.classList.add("category-button");
            if (category.name === this.selectedCategory?.name) btn.classList.add("active");

            btn.addEventListener("click", () => {
                this.selectedCategory = category;
                this.renderCategoryButtons();
            });

            this.displayGrid.appendChild(btn);
        });
    }

    renderEditCategories() {
        if (!this.editGrid) return;
        this.editGrid.innerHTML = '';

        this.categories[this.currentType].forEach((category, index) => {
            const item = document.createElement("div");
            item.classList.add("edit-category-item");

            if (this.editMode) {
                const input = document.createElement("input");
                input.type = "text";
                input.value = category.name;
                input.addEventListener("blur", async () => {
                    const newName = input.value.trim();
                    if (!newName || newName === category.name) return;

                    try {
                        const res = await fetch(`/api/categories/${category.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name: newName })
                        });

                        const result = await res.json();
                        this.categories[this.currentType][index].name = newName;
                        this.renderCategoryButtons();
                    } catch (err) {
                        console.error("編集失敗:", err);
                        alert("カテゴリ編集に失敗しました");
                    }
                });

                const delBtn = document.createElement("button");
                delBtn.textContent = "削除";
                delBtn.addEventListener("click", async () => {
                    try {
                        await fetch(`/api/categories/${category.id}`, {
                            method: "DELETE"
                        });

                        this.categories[this.currentType].splice(index, 1);
                        this.render();
                    } catch (err) {
                        console.error("削除エラー:", err);
                        alert("カテゴリ削除に失敗しました");
                    }
                });

                item.appendChild(input);
                item.appendChild(delBtn);
            } else {
                const label = document.createElement("span");
                label.textContent = category.name;
                item.appendChild(label);
            }

            this.editGrid.appendChild(item);
        });
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        this.editToggleBtn.textContent = this.editMode ? "完了" : "編集";
        this.renderEditCategories();
    }

    handleCategoryToggle(type, clickedBtn) {
        if (type === "expense" || type === "income") {
            this.currentType = type;
            this.render();
            this.toggleBtns.forEach(btn => btn.classList.remove("active"));
            clickedBtn.classList.add("active");
        } else if (type === "editExpense" || type === "editIncome") {
            this.currentType = type === "editExpense" ? "expense" : "income";
            this.renderEditCategories();
        }
    }

    getSelectedCategory() {
        return this.selectedCategory;
    }

    async fetchCategories() {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();

            const categories = { expense: [], income: [] };
            data.forEach(item => {
                const type = item.expence_type;
                if (type === "expense" || type === "income") {
                    categories[type].push({ id: item.id, name: item.name });
                }
            });

            this.categories = categories;

            this.addBtn.addEventListener("click", this.handleAddCategory.bind(this));
            this.editToggleBtn.addEventListener("click", this.toggleEditMode.bind(this));
            this.toggleBtns.forEach(btn => {
                btn.addEventListener("click", (event) => {
                    const type = event.target.getAttribute("data-type");
                    this.handleCategoryToggle(type, event.target);
                });
            });

            this.render();
        } catch (err) {
            console.error("カテゴリ取得エラー:", err);
            alert("カテゴリーの取得に失敗しました");
        }
    }

    async handleAddCategory() {
        const newCategory = this.addInput.value.trim();
        if (!newCategory) {
            alert("値を入力してください")
            return;
        }

        const payload = {
            name: newCategory,
            expence_type: this.currentType
        };

        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            this.categories[this.currentType].push({ id: result.id, name: newCategory });
            this.addInput.value = '';
            this.render();
        } catch (err) {
            console.error("追加エラー:", err);
            alert("カテゴリ追加に失敗しました");
        }
    }
}

*/