const BASE_URL = "/budget";

// データ送信（POST）
export async function createBudget(data) {
    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("データ送信に失敗しました");

        return await res.json(); // { message }
    } catch (err) {
        console.error("送信エラー:", err);
        alert("データ送信に失敗しました");
        throw err;
    }
}

