// Map game cards to their Roblox universe IDs
const gameUniverseMap = {
    "CountryRNG": "5874949762",
    "DumpsterDivers": "7584831866",
    // add more: "CardId": "UniverseId"
};

const BackButton = document.getElementById("BackButton");
const ProfileButton = document.getElementById("ProfileButton");

BackButton?.addEventListener("click", () => {
    window.location.href = "/mainpage/"; // loads /mainpage/index.html
});

ProfileButton?.addEventListener("click", () => {
    window.location.href = "/loginpage/"; // loads /loginpage/index.html
});

// Format numbers with k/m suffix
function formatNumber(num) {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "m";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
    return num.toString();
}

// Update stats for all cards
async function updateGameStats() {
    const gameCards = document.querySelectorAll(".game-card");

    for (const card of gameCards) {
        const gameId = card.dataset.gameId;
        const universeId = gameUniverseMap[gameId];
        if (!universeId) continue;

        try {
            // Visits & Active Players
            const statsResp = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://games.roblox.com/v1/games?universeIds=${universeId}`)}`);
            const statsData = JSON.parse((await statsResp.json()).contents);
            const visits = statsData.data[0].visits;
            const activePlayers = statsData.data[0].playing;

            // Votes / Like Ratio
            const votesResp = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://games.roblox.com/v1/games/votes?universeIds=${universeId}`)}`);
            const votesData = JSON.parse((await votesResp.json()).contents);
            const upvotes = votesData.data[0].upVotes;      // note: upVotes, downVotes
            const downvotes = votesData.data[0].downVotes;
            const likeRatio = ((upvotes / (upvotes + downvotes)) * 100).toFixed(2);

            // Update card stats element with formatted numbers
            const statsEl = card.querySelector(".game-caption");
            if (statsEl) {
                statsEl.textContent = `Visits: ${formatNumber(visits)} | Active: ${formatNumber(activePlayers)} | Like Ratio: ${likeRatio}%`;
            }

        } catch (err) {
            console.error(`Failed to fetch stats for ${gameId}:`, err);
        }
    }
}

window.addEventListener("DOMContentLoaded", updateGameStats);
