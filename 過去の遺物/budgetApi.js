// 指定月の日別の支出・収入サマリー
export async function fetchCalendarSummary(year, month) {
    try {
        const res = await fetch(`${BASE_URL}/calendar_summary?year=${year}&month=${month}`);
        if (!res.ok) throw new Error("カレンダーサマリー取得失敗");
        return await res.json();
    } catch (err) {
        console.error("fetchCalendarSummary エラー", err);
        return [];
    }
}

// 指定日ごとの明細（カテゴリ・金額・メモ）
export async function fetchDayDetails(dateStr) {
    try {
        const res = await fetch(`${BASE_URL}/day_details?date=${dateStr}`);
        if (!res.ok) throw new Error("明細取得失敗");
        return await res.json();
    } catch (err) {
        console.error("fetchDayDetails エラー", err);
        return null;
    }
}
