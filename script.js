const API_KEY = 'solaris-1Cqgm3S6nlMechWO';
const BASE_URL = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/';

async function fetchPlanetData() {
  try {
    const response = await fetch(`${BASE_URL}bodies`, {
      method: "GET",
      headers: { "x-zocom": API_KEY },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.bodies; 
  } catch (error) {
    console.error('Fetching planet data failed:', error);
    return []; 
  }
}

async function showPlanetInfo(planetName) {
  console.log(`Fetching data for: ${planetName}`); 
  const bodies = await fetchPlanetData();
  //console.log(bodies); // Genom det kunde jag hitta bokstavsfel i html för planeterna
  const bodyData = bodies.find(body => body.name.toLowerCase() === planetName.toLowerCase());

  if (bodyData) {
    const infoDiv = document.getElementById('planet-info');
    const htmlContent = `
      <h1>${bodyData.name}</h1>
      <p>${bodyData.desc}</p>
      <div><strong>Circumference:</strong> ${bodyData.circumference} km</div>
      <div><strong>Day Temperature:</strong> ${bodyData.temp.day}°C</div>
      <div><strong>Night Temperature:</strong> ${bodyData.temp.night}°C</div>
      <div><strong>Distance from Sun:</strong> ${bodyData.distance} km</div>
      <div><strong>Orbital Period:</strong> ${bodyData.orbitalPeriod} days</div>
      <div><strong>Moons:</strong> ${bodyData.moons.length ? bodyData.moons.join(', ') : 'None'}</div>`;
    infoDiv.innerHTML = htmlContent;
    infoDiv.style.display = 'block';
    document.getElementById('scroll-to-top').style.display = 'block'; // Show the button
    infoDiv.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the infoDiv
  } else {
    console.error(`No data found for planet: ${planetName}`);
  }
}

function scrollToPlanets() {
  document.getElementById('planet-info').style.display = 'none'; // Hide the planet info
  document.getElementById('scroll-to-top').style.display = 'none'; // Hide the button
  document.querySelector('.solar-system').scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the solar system
}

document.addEventListener('DOMContentLoaded', () => {
  const celestialBodies = document.querySelectorAll('.sun, .planet');
  celestialBodies.forEach(bodyElement => {
    bodyElement.addEventListener('click', () => {
      const planetName = bodyElement.getAttribute('data-name');
      showPlanetInfo(planetName);
    });
  });
});
