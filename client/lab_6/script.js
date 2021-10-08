async function windowActions() {
  const request = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  const categories = await request.json();
  function findMatches(word, categories) {
    return categories.filter((place) => {
      const regex = new RegExp(word, 'gi');
      return place.category.match(regex) || place.name.match(regex);
    });
  }

  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, categories);
    const html = matchArray.map((place) => `
        <li>
            <div>${place.name}</div>
            <div>${place.category}</div>
            <div>${place.address_line_1}</div>
            <div>${place.city}</div>
            <div>${place.zip}</div>
        </li>
        `).join('');
    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('.suggestions');
  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', (evt) => { displayMatches(evt); });
}
window.onload = windowActions;