// --- Live Macro Factors Dashboard Script (Simplified & Corrected) ---

document.addEventListener('DOMContentLoaded', () => {

    // Your API Key
    const apiKey = 'da66b07e7fe0fe8655f25f956d365354';

    // Get the HTML elements
    const interestRateEl = document.getElementById('interest-rate');
    const inflationRateEl = document.getElementById('inflation-rate');
    const gdpGrowthEl = document.getElementById('gdp-growth');
    const headwindEl = document.getElementById('economic-headwind');

    // --- A single function to get the LIVE Interest Rate ---
    async function getInterestRate() {
        const seriesId = 'DGS10'; // The series for the 10-Year Treasury
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=5`;

        try {
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            if (!response.ok) throw new Error("Network error");
            const data = await response.json();

            // Smart loop to find the most recent valid number
            for (const observation of data.observations) {
                if (observation.value !== '.') {
                    return parseFloat(observation.value);
                }
            }
            throw new Error("No valid data point found");

        } catch (error) {
            console.error('Error fetching interest rate:', error);
            return null; // Return null if it fails
        }
    }

    // --- Main function to update the dashboard ---
    async function updateDashboard() {

        // --- 1. GET THE LIVE DATA ---
        interestRateEl.textContent = 'Loading...';
        const liveInterestRate = await getInterestRate();

        inflationRateEl.textContent = 'Loading...';
        const liveInflationRate = await getInterestRate();

        gdpGrowthEl.textContent = 'Loading...';
        const liveGdpGrowth = await getInterestRate();

        // --- 2. DEFINE THE MANUAL DATA ---
        const manualInflationRate = 3.48; // You can change this number
        const manualGdpGrowth = 3.10;     // You can change this number

        // Display the manual data immediately
        inflationRateEl.textContent = `${manualInflationRate.toFixed(2)}%`;
        gdpGrowthEl.textContent = `${manualGdpGrowth.toFixed(2)}%`;

        // --- 3. CALCULATE AND DISPLAY EVERYTHING ---
        if (liveInterestRate !== null) {
            // Success! We got the live data.
            interestRateEl.textContent = `${liveInterestRate.toFixed(2)}%`;

            const headwind = liveGdpGrowth + liveInterestRate - liveInflationRate;
            headwindEl.textContent = `${headwind.toFixed(2)}%`;
            headwindEl.style.color = headwind < 0 ? '#e74c3c' : '#2ecc71';
        } else {
            // The API call failed. Show an error.
            interestRateEl.textContent = 'Data N/A';
            headwindEl.textContent = 'Error';
            headwindEl.style.color = '#e74c3c';
        }
    }

    // Run the function
    updateDashboard();
});