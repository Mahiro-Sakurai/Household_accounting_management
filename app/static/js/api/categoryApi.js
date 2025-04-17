// api/categoryApi.js
console.log("categoryApi読み込み")

const BASE_URL = "/api/categories";

// カテゴリ一覧を取得（GET）
export async function readCategory() {
    try {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error("サーバーエラー");

        const data = await res.json();
        const categories = { expense: [], income: [] };

        data.forEach(item => {
            const type = item.expense_type;
            if (type === "expense" || type === "income") {
                categories[type].push({ id: item.id, name: item.name });
            }
        });

        return categories;
    } catch (err) {
        console.error("カテゴリ取得エラー:", err);
        return { expense: [], income: [] }; // fallback
    }
}

// カテゴリを新規作成（POST）
export async function createCategory(category) {
    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category)
        });

        if (!res.ok) {
            const errMsg = await res.json();
            throw new Error(errMsg.error || "カテゴリ追加に失敗");
        }

        const result = await res.json();
        return result; // { message, id }
    } catch (err) {
        console.error("追加エラー:", err);
        alert("カテゴリ追加に失敗しました");
        return null;
    }
}

// カテゴリ名を更新（PUT）
export async function updateCategory(id, newName) {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName })
        });

        if (!res.ok) {
            const errMsg = await res.json();
            throw new Error(errMsg.error || "カテゴリ更新に失敗");
        }

        return await res.json(); // { message }
    } catch (err) {
        console.error("更新エラー:", err);
        throw err; // ← alertしない！親に投げる！
    }
}


// カテゴリー削除
export async function deleteCategory(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        const errMsg = await res.json();
        throw new Error(errMsg.error || "カテゴリ削除に失敗");
    }

    return await res.json(); // { message }
}
