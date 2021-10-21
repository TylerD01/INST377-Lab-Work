async function windowActions() {
  const request = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const categories = await request.json();
  const ACCESSTOKEN = 'pk.eyJ1IjoidHlsZXJkMDEiLCJhIjoiY2t2MWZ6eTB1N3dqOTJvcWpwYWplZWlubSJ9.0aZQ0Vv9WLIPFfhl-xldSw';
  const markers = [];
  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('.suggestions');
  
  const mymap = L.map('mapid').setView([38.989, -76.93], 12);
  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESSTOKEN}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
  }).addTo(mymap);

  function findMatches(numberToMatch, categories) {
    return categories.filter((place) => {
      const regex = new RegExp(numberToMatch, 'g');
      return place.zip.match(regex);
    });
  }

  function displayMatches(event) {
    markers.forEach((marker) => {
      marker.remove();
    });
    const matchArray = findMatches(event.target.value, categories);
    const slicedArray = matchArray.slice(0, 5);
    slicedArray.forEach((place) => {
      if (place.hasOwnProperty('geocoded_column_1')) {
        const point = place.geocoded_column_1;
        const latLong = point.coordinates;
        const marker = latLong.reverse();
        markers.push(L.marker(marker).addTo(mymap));
        console.log(markers);
      }
    });
    const html = slicedArray.map((place) => `
          <div class="box">
              <div>${place.name}</div>
              <div>${place.address_line_1}</div>
          </div>
          `).join('');
    if (searchInput === '') {
      suggestions.innerHTML = '';
      markers.forEach((marker) => {
        marker.remove();
      });
    } else {
      suggestions.innerHTML = html;
    }
  }

  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => { displayMatches(evt); });
}
window.onload = windowActions;