console.log("categoryView読み込み")

// categoryView.js
export default class CategoryView {
    constructor(manager, elements) {
        this.manager = manager;
        this.displayGrid = elements.displayGrid;
        this.editGrid = elements.editGrid;
        this.addBtn = elements.addBtn;
        this.addInput = elements.addInput;
        this.editToggleBtn = elements.editToggleBtn;
        this.toggleBtns = elements.toggleBtns;
        this.amountInput = elements.amountInput;
        this.editMode = false;

        this.addBtn.addEventListener("click", () => this.handleAddCategory());
        this.editToggleBtn.addEventListener("click", () => this.toggleEditMode());
        this.toggleBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const type = e.target.dataset.type;
                this.manager.setCurrentType(type.includes("income") ? "income" : "expense");
                this.render();
            });
        });
    }

    async init() {
        await this.manager.init();
        this.render();
    }

    render() {
        this.renderCategoryButtons();
        this.renderEditCategories();
        this.renderAmountPlaceholder();
    }

    renderAmountPlaceholder() {
        this.amountInput.placeholder = this.manager.currentType === "expense" ? "支出を入力" : "収入を入力";
    }

    renderCategoryButtons() {
        const categories = this.manager.getCategories();
        this.displayGrid.innerHTML = '';

        categories.forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.classList.add("category-button");
            if (this.manager.getSelectedCategory()?.id === category.id) btn.classList.add("active");

            btn.addEventListener("click", () => {
                this.manager.selectCategory(category);
                this.renderCategoryButtons();
            });

            this.displayGrid.appendChild(btn);
        });
    }

    renderEditCategories() {
        if (!this.editGrid) return;
        const categories = this.manager.getCategories();
        this.editGrid.innerHTML = '';

        categories.forEach(category => {
            const item = document.createElement("div");
            item.classList.add("edit-category-item");

            if (this.editMode) {
                const input = document.createElement("input");
                input.type = "text";
                input.value = category.name;
                input.addEventListener("blur", async () => {
                    const newName = input.value.trim();
                    if (!newName || newName === category.name) return;
                    await this.manager.updateCategoryName(category.id, newName);
                    this.render();
                });

                const delBtn = document.createElement("button");
                delBtn.textContent = "削除";
                delBtn.addEventListener("click", async () => {
                    try {
                        await this.manager.deleteCategoryById(category.id);
                        this.render();
                    } catch (err) {
                        alert(err.message || "カテゴリ削除に失敗しました");
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

    async handleAddCategory() {
        const newCategory = this.addInput.value.trim();
        if (!newCategory) {
            alert("値を入力してください");
            return;
        }
        await this.manager.addCategory(newCategory);
        this.addInput.value = '';
        this.render();
    }
}
