console.log("categoryManager読み込み")
// categoryManager.js
import { readCategory, createCategory, updateCategory, deleteCategory } from "../api/categoryApi.js";

export default class CategoryManager {
    constructor() {
        this.categories = { expense: [], income: [] };
        this.currentType = "expense";
        this.selectedCategory = null;
        this.editMode = false;
    }

    async init() {
        const data = await readCategory();
        this.categories = data;
    }

    getCategories() {
        return this.categories[this.currentType];
    }

    getSelectedCategory() {
        return this.selectedCategory;
    }

    setCurrentType(type) {
        this.currentType = type;
    }

    selectCategory(category) {
        this.selectedCategory = category;
    }

    async addCategory(name) {
        const payload = { name, expence_type: this.currentType };
        const result = await createCategory(payload);
        if (result) {
            this.categories[this.currentType].push({ id: result.id, name });
        }
    }

    async updateCategoryName(id, newName) {
        try {
            const success = await updateCategory(id, newName);
            if (success) {
                const category = this.categories[this.currentType].find(c => c.id === id);
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
                this.categories[this.currentType] = this.categories[this.currentType].filter(c => c.id !== id);
            }
            return result;
        } catch (err) {
            throw err;
        }
    }
}
