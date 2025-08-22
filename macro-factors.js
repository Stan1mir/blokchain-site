// --- Live Macro Factors Dashboard Script (100% Automatic Version) ---

document.addEventListener('DOMContentLoaded', () => {

    const apiKey = process.env.FRED_API_KEY; // Read from environment
    if (!apiKey) {
        console.error("API Key Missing: You must set the FRED_API_KEY environment variable.");
    }
    const proxyUrl = 'https://api.allorigins.win/raw?url=';

    const interestRateEl = document.getElementById('interest-rate');
    const inflationRateEl = document.getElementById('inflation-rate');
    const gdpGrowthEl = document.getElementById('gdp-growth');
    const headwindEl = document.getElementById('economic-headwind');

    // --- Function 1: Gets the LATEST single value (for Interest Rate) ---
    async function getLatestValue(seriesId) {
        const apiUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=5`;
        try {
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            if (!response.ok) throw new Error(`Network error for ${seriesId}`);
            const data = await response.json();
            for (const obs of data.observations) {
                if (obs.value !== '.') return parseFloat(obs.value);
            }
            throw new Error(`No valid data for ${seriesId}`);
        } catch (error) {
            console.error(`Error in getLatestValue for ${seriesId}:`, error);
            return null;
        }
    }

    // --- FUNCTION 2: Calculates Year-Over-Year % Change (for Inflation & GDP) ---
    async function getYoYChange(seriesId, observationCount) {
        // observationCount should be 13 for monthly data (CPI), 5 for quarterly data (GDP)
        const apiUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${observationCount}`;
        try {
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            if (!response.ok) throw new Error(`Network error for ${seriesId}`);
            const data = await response.json();

            if (data.observations.length < observationCount) throw new Error(`Not enough data for YoY on ${seriesId}`);

            const currentValue = parseFloat(data.observations[0].value);
            const oldValue = parseFloat(data.observations[observationCount - 1].value); // Value from 1 year ago

            if (isNaN(currentValue) || isNaN(oldValue) || oldValue === 0) throw new Error(`Invalid data for YoY on ${seriesId}`);

            const percentChange = ((currentValue - oldValue) / oldValue) * 100;
            return percentChange;
        } catch (error) {
            console.error(`Error in getYoYChange for ${seriesId}:`, error);
            return null;
        }
    }

    // --- Main function to update the dashboard ---
    async function updateDashboard() {
        interestRateEl.textContent = 'Loading...';
        inflationRateEl.textContent = 'Loading...';
        gdpGrowthEl.textContent = 'Loading...';
        headwindEl.textContent = 'Calculating...';

        const [liveInterestRate, liveInflationRate, liveGdpGrowth] = await Promise.all([
            getLatestValue('DGS10'),       // Interest rate is a simple latest value
            getYoYChange('CPIAUCSL', 13),   // Inflation is YoY % change of monthly data
            getYoYChange('GDPC1', 5)        // GDP Growth is YoY % change of quarterly data
        ]);

        let hasError = false;

        // Display Interest Rate
        if (liveInterestRate !== null) {
            interestRateEl.textContent = `${liveInterestRate.toFixed(2)}%`;
        } else { interestRateEl.textContent = 'Data N/A'; hasError = true; }

        // Display Inflation Rate
        if (liveInflationRate !== null) {
            inflationRateEl.textContent = `${liveInflationRate.toFixed(2)}%`;
        } else { inflationRateEl.textContent = 'Data N/A'; hasError = true; }

        // Display GDP Growth
        if (liveGdpGrowth !== null) {
            gdpGrowthEl.textContent = `${liveGdpGrowth.toFixed(2)}%`;
        } else { gdpGrowthEl.textContent = 'Data N/A'; hasError = true; }

        // Calculate and display the headwind
        if (hasError) {
            headwindEl.textContent = 'Error';
            headwindEl.style.color = '#e74c3c';
        } else {
            const headwind = liveGdpGrowth - (liveInterestRate - liveInflationRate);
            headwindEl.textContent = `${headwind.toFixed(2)}%`;
            headwindEl.style.color = headwind < 0 ? '#e74c3c' : '#2ecc71';
        }
    }

    updateDashboard();
});