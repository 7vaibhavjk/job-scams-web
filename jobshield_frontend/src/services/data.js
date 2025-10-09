// src/services/data.js
import dayjs from "dayjs";
import ApiService from "./api";

export async function loadRecords() {
    const rows = await ApiService.getRecords();
    return rows.map(r => ({
        ...r,
        date: dayjs(r.date),
        year: r.year ?? Number(dayjs(r.date).format("YYYY")),
        month: r.month ?? dayjs(r.date).format("YYYY-MM"),
        state_code: r.state_code || "Unspecified",
        state_name: r.state_name || "Unspecified",
        contact_method: r.contact_method || "Unspecified",
        age_band: r.age_band || "Unspecified",
        gender: r.gender || "Unspecified",
        scam_group: r.scam_group || "Unspecified",
        scam_type: r.scam_type || "Unspecified",
        amount_lost_aud: +r.amount_lost_aud || 0,
        report_count: +r.report_count || 0,
    }));
}

export const currency = v =>
    (v ?? 0).toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

export const sum = (arr, f = x => x) => arr.reduce((a, x) => a + f(x), 0);

export function groupBy(arr, keyFn) {
    const m = new Map();
    for (const x of arr) {
        const k = keyFn(x);
        if (!m.has(k)) m.set(k, []);
        m.get(k).push(x);
    }
    return [...m.entries()];
}
