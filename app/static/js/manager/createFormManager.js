import { readCategory, createCategory, updateCategory, deleteCategory } from "../api/categoryApi.js";
import { createBudget } from "../api/budgetApi.js";

export default class CreateFormManager {
    constructor(initialData) {
        this._type = initialData.type
        this._date = initialData.date
        this._memo = initialData.memo
        this._amount = initialData.amount
        this._selectedCategory = initialData.selectedCategory
        this._categories = { expense: [], income: [] };
    }

    async init() {
        await this.readCategory();
    }

    // type
    setType(type) {
        this._type = type;
    }

    getType() {
        return this._type;
    }

    // date
    setDate(date) {
        this._date = date;
    }

    getDate() {
        return this._date;
    }

    prevDate() {
        this._date.setDate(this._date.getDate() - 1);
    }

    nextDate() {
        this._date.setDate(this._date.getDate() + 1);
    }

    // memo
    setMemo(memo) {
        this._memo = memo;
    }

    getMemo() {
        return this._memo;
    }

    // amount
    setAmount(amount) {
        this._amount = amount;
    }

    getAmount() {
        return this._amount;
    }

    // category
    getCategory() {
        return this._categories[this._type];
    }

    setSelectedCategory(category) {
        this._selectedCategory = category
        console.log(category)
    }

    getSelectedCategory() {
        return this._selectedCategory;
    }

    async readCategory() {
        const data = await readCategory();
        this._categories = data;
    }

    async createCategory(name) {
        console.log("createCategory")
        const payload = { name: name, expense_type: this._type };
        const result = await createCategory(payload);
        if (result) {
            this._categories[this._type].push({ id: result.id, name });
            return result;
        }
    }

    async updateCategoryName(id, newName) {
        try {
            const success = await updateCategory(id, newName);
            if (success) {
                const category = this._categories[this._type].find(c => c.id === id);
                if (category) category.name = newName;
            }
        } catch (err) {
            console.error("カテゴリ名更新失敗:", err);
            throw err;
        }
    }

    async deleteCategoryById(id) {
        try {
            const result = await deleteCategory(id);
            if (result) {
                this._categories[this._type] = this._categories[this._type].filter(c => c.id !== id);
            }
            return result;
        } catch (err) {
            throw err;
        }
    }

    async createBudget() {
        const year = this._date.getFullYear();
        const month = this._date.getMonth() + 1;
        const day = this._date.getDate()
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        console.log(this._selectedCategory.id)
        console.log(this._selectedCategory.name)
        const data = {
            expense_type: this._type,
            category_id: this._selectedCategory.id,
            category_name: this._selectedCategory.name,
            amount: Number(this._amount ?? 0),
            date_str: dateStr,
            memo: this._memo ?? null
        }
        try {
            await createBudget(data)
        } catch (err) {
            return null
        }
    }
}