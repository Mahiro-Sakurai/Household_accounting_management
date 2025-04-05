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

        this.categories = {
            expense: [
                '食費', '交通費', '娯楽', '日用品', '医療', '通信費',
                '交際費', '教育', '光熱費', '家賃', '貯金', 'その他'
            ],
            income: [
                '給料', 'ボーナス', '副業', '投資収入', 'その他収入'
            ]
        };

        this.addBtn.addEventListener("click", this.handleAddCategory.bind(this));
        this.editToggleBtn.addEventListener("click", this.toggleEditMode.bind(this));
        this.toggleBtns.forEach(btn => {
            btn.addEventListener("click", (event) => {
                const type = event.target.getAttribute("data-type");
                this.handleCategoryToggle(type, event.target);
            });
        });

        this.render();
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
            btn.textContent = category;
            btn.classList.add("category-button");
            if (category === this.selectedCategory) btn.classList.add("active");

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
                const delBtn = document.createElement("button");
                delBtn.textContent = "削除";
                delBtn.addEventListener("click", () => {
                    this.categories[this.currentType].splice(index, 1);
                    this.render();
                });

                const input = document.createElement("input");
                input.type = "text";
                input.value = category;
                input.addEventListener("input", () => {
                    this.categories[this.currentType][index] = input.value;
                    this.renderCategoryButtons();
                });

                item.appendChild(delBtn);
                item.appendChild(input);
            } else {
                const label = document.createElement("span");
                label.textContent = category;
                item.appendChild(label);
            }

            this.editGrid.appendChild(item);
        });
    }

    handleAddCategory() {
        const newCategory = this.addInput.value.trim();
        if (newCategory) {
            this.categories[this.currentType].push(newCategory);
            this.addInput.value = '';
            this.render();
        }
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
}
