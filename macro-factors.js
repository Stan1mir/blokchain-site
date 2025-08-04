// This is our new starting point.

document.addEventListener('DOMContentLoaded', () => {

    const apiKey = 'da66b07e7fe0fe8655f25f956d365354';

    const interestRateEl = document.getElementById('interest-rate');
    const inflationRateEl = document.getElementById('inflation-rate');
    const gdpGrowthEl = document.getElementById('gdp-growth');
    const headwindEl = document.getElementById('economic-headwind');

    // This is the function we need to debug
    async function getFredData(seriesId) {
        // We add a proxy to get around browser security (CORS)
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=5`;

        try {
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${seriesId}`);
            }
            const data = await response.json();

            // This is the "smart" loop that prevents the NaN error.
            // It will check the most recent observations until it finds a real number.
            for (const observation of data.observations) {
                if (observation.value !== '.') {
                    return parseFloat(observation.value); // Success! Return the number.
                }
            }
            // If no valid number was found in the last 5 days
            throw new Error(`No valid numerical data point found for ${seriesId}`);

        } catch (error) {
            console.error('Error fetching FRED data:', error);
            return null; // Return null to signify an error
        }
    }

    async function updateDashboard() {
        // This is the "magic" line you pointed out
        const [interestRate, inflationValue, gdpValue] = await Promise.all([
            getFredData('DGS10'),
            getFredData('CPIAUCSL'),
            getFredData('GDPC1')
        ]);

        // This is where the NaN error was happening
        const finalInterestRate = parseFloat(interestRate);

        // And these are the placeholders
        const finalInflationRate = 8.3;
        const finalGdpGrowth = 1.4;

        // The rest of the code displays these values...
        interestRateEl.textContent = `${finalInterestRate.toFixed(2)}%`;
        inflationRateEl.textContent = `${finalInflationRate.toFixed(2)}%`;
        gdpGrowthEl.textContent = `${finalGdpGrowth.toFixed(2)}%`;

        const headwind = finalGdpGrowth - (finalInterestRate - finalInflationRate);
        headwindEl.textContent = `${headwind.toFixed(2)}%`;

        if (headwind < 0) {
            headwindEl.style.color = '#e74c3c';
        } else {
            headwindEl.style.color = '#2ecc71';
        }
    }

    updateDashboard();
});