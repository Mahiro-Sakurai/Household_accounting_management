const BASE_URL = "api/budgets";


// GET
export async function readMonthlyBudgets(year, month) {
    try {
        const res = await fetch(`${BASE_URL}?year=${year}&month=${month}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching monthly budgets:", err);
        return { error: err.message || "An error occurred while fetching data" };
    }

}




// POST
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


