const serverUrl = "http://localhost:5000";

async function searchArtist() {
    const artistName = document.getElementById("artistInput").value;
    if (!artistName) {
        alert("Please enter an artist name");
        return;
    }

    const response = await fetch(`${serverUrl}/search?artist=${artistName}`);
    const data = await response.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    document.getElementById("artistInfo").innerHTML = `
        <h3>${data.name}</h3>
        <img src="${data.images[0]?.url || 'https://via.placeholder.com/150'}" width="150">
        <p>Genres: ${data.genres.join(", ")}</p>
        <button onclick="getRecommendations('${data.id}')">Find Similar Artists</button>
    `;
}

async function getRecommendations(artistId) {
    const response = await fetch(`${serverUrl}/recommendations?artistId=${artistId}`);
    const data = await response.json();

    let recommendationsHTML = "";
    data.forEach(artist => {
        recommendationsHTML += `
            <div>
                <h4>${artist.name}</h4>
                <img src="${artist.images[0]?.url || 'https://via.placeholder.com/100'}" width="100">
                <p>Genres: ${artist.genres.join(", ")}</p>
            </div>
        `;
    });

    document.getElementById("recommendations").innerHTML = recommendationsHTML;
}
