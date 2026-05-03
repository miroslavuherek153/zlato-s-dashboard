const AVAILABLE_TF = ["5m", "30m", "1h", "4h", "1d"];

// Absolutní URL k data.json – 100% funkční na GitHub Pages
const DATA_URL = "https://miroslavuherek153.github.io/zlato-s-dashboard/data.json";

async function loadData() {
    try {
        const response = await fetch(DATA_URL + "?cache=" + Date.now());

        if (!response.ok) {
            throw new Error("Chyba načítání data.json");
        }

        const data = await response.json();
        window.dashboardData = data;
        renderDashboard(data);

    } catch (err) {
        document.getElementById("content").innerHTML =
            `<p class="error">❌ Chyba načítání data.json</p>`;
    }
}

function renderDashboard(data) {
    const container = document.getElementById("content");
    container.innerHTML = "";

    Object.keys(data).forEach(symbol => {
        if (symbol === "updated") return;

        const item = data[symbol];

        let html = `
            <div class="symbol-block">
                <h2>${item.nazev} — ${symbol}</h2>
                <p><strong>Cena:</strong> ${item.price}</p>
                <p><strong>Sentiment:</strong> ${item.sentiment}</p>
                <p><strong>Predikce:</strong> ${item.prediction} (${item.prediction_score})</p>

                <div class="tf-buttons">
        `;

        AVAILABLE_TF.forEach(tf => {
            html += `<button onclick="showTF('${symbol}', '${tf}')">${tf}</button>`;
        });

        html += `</div>`;
        html += `<div id="tf-${symbol}" class="tf-data">Klikni na timeframe…</div>`;
        html += `</div>`;

        container.innerHTML += html;
    });
}

function showTF(symbol, tf) {
    const block = document.getElementById(`tf-${symbol}`);
    const data = window.dashboardData[symbol].timeframes[tf];

    if (!data) {
        block.innerHTML = `<p>❌ Data nejsou dostupná</p>`;
        return;
    }

    block.innerHTML = `
        <p><strong>VWAP:</strong> ${data.vwap.toFixed(2)}</p>
        <p><strong>RSI:</strong> ${data.rsi.toFixed(2)}</p>
        <p><strong>ATR:</strong> ${data.atr}</p>
        <p><strong>Trend:</strong> ${data.trend}</p>
        <p><strong>Predikce:</strong> ${data.prediction} (${data.prediction_score})</p>
    `;
}

loadData();
