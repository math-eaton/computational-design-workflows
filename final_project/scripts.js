console.log('ok...')

const token = config.MAPBOX_TOKEN
let latitude, longitude;
// Structure
//----------------------------
const form = document.querySelector("form");
// const SelectedCity = document.querySelector(".list")
// think about selected city  later. this can maybe bin form results together
const wordsInput = document.querySelector(".words");
// const locationInput = document.querySelector(".coordinates.innerHTML");
// console.log(locationInput)
var button = document.querySelector("button");
let poemContainer = document.querySelector('ul');

// const coords = 
// const coords

//--
//OBJECT SETUP
//----------------------------
const poem = {
	"poemList": []
}

// Event Handlers
//----------------------------
function pageLoadFn(event){
  if(localStorage.getItem('poems') === null){
    return
  } else {
    poems = JSON.parse(localStorage.getItem('poems'))
    poems.poemList.forEach(displayPoem)
  }
}

const addNewPoem = (e) => {
  e.preventDefault();
  console.log('clicked')
  // variable for values entered in the form
  // const newCity = SelectedCity.value;
  const newWords = wordsInput.value;
  const newLocation = {longitude, latitude};

  console.log(newWords, newLocation)


  // store in a JSON object
  poemObject = {
		// city: newCity,
		words: newWords,
    location: newLocation,
		completed: false
	}

  console.log(poemObject)
  displayPoem(poemObject);

  // // pass object into display function
  
  //add object to array
	poem.poemList.push(poemObject);
  console.log(poem)
  //store in local storage
	localStorage.setItem("poems", JSON.stringify(poem));

	//clear form
	form.reset();

}

function displayPoem(poem){
  console.log(poem) // {name: 'hello'}
  if(poem == "") return null

  // let account_name = 'Celeste Layne'
  // let twitter_handle = '@bot'

  let newListItem = document.createElement('li');

  newListItem.textContent = `${poem.words}`
  poemContainer.appendChild(newListItem);

  const marker = new mapboxgl.Marker()
  .setLngLat([poem.location.longitude, poem.location.latitude])
  .addTo(map); // add the marker to the map
  
  }

  form.reset()
  

// Events
//----------------------------
button.addEventListener("click", addNewPoem);
window.addEventListener('load', pageLoadFn);


//text counter
//----------------------------
function textCounter(field,field2,maxlimit)
{
 var countfield = document.getElementById(field2);
 if ( field.value.length > maxlimit ) {
  field.value = field.value.substring( 0, maxlimit );
  return false;
 } else {
  countfield.value = maxlimit - field.value.length;
 }

 if(countfield.value <= 10){
  counter.style.color = '#f0f';
  counter.style.fontWeight = 'bold'
} else {
  counter.style.color = 'blue';
  counter.style.fontWeight = 'normal'
}
}

//error messages
//----------------------------
form.addEventListener('submit', (e) => {
  let messages = []
  if (wordsInput.value === '' || wordsInput.value == null) {
    messages.push('text is required')
  }

  if (wordsInput.value.length <= 6) {
    messages.push('submission must be longer than six characters')
  }

  // if (wordsInput.value.length >= 255) {
  //   messages.push('submission must be less than 255 characters')
  // }

  if (messages.length > 0 || messages.length !== null) {
    e.preventDefault()
    wordsInput.innerText = messages.join(', ')
  }
})


//MAPBOX!!!!!!!!!!!!!!!!!!


mapboxgl.accessToken = token;
const coordinates = document.getElementById('coordinates');
// let defaultCoord = 
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    // pitch: 45,

});

document.getElementById("list").onchange = getCityXY;
document.getElementById("list").onchange = onLoad;


function getCityXY() {
  // get long and lat 
  // var cityLongLat=val.split(', ');
  var cityLongLat = document.getElementById('list').value
  var centerPoint=cityLongLat.split(', ');
  // set center of map
  map.flyTo({center: centerPoint, zoom: centerPoint[2]});
  return centerPoint
}

const centerPoint = getCityXY()
var cityLat = parseFloat(centerPoint[0]);
var cityLong = parseFloat(centerPoint[1]); 

console.log(centerPoint + " Long: " + cityLong + " Lat: " + cityLat)
const canvas = map.getCanvasContainer();

const geojson = {
  'type': 'FeatureCollection',
  'features': [
      {
          'type': 'Feature',
          'geometry': {
              'type': 'Point',
              'coordinates': [
                -83.091265, 39.156753
                ]
              
          }
      }
  ]
}

function onLoad(e) {
    const centerPoint = getCityXY()

    // Update the Point feature in `geojson` coordinates to the selected city extent
    // and call setData to the source layer `point` on it.
    geojson.features[0].geometry.coordinates = [centerPoint[0], centerPoint[1]];
    map.getSource('point').setData(geojson);
}

function onMove(e) {
    const coords = e.lngLat;
    // console.log(coords)
    // Set a UI indicator for dragging.
    canvas.style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    map.getSource('point').setData(geojson);
}

function onUp(e) {
    coords = e.lngLat;
    console.log(coords)

    // Print the coordinates of where the point had
    // finished being dragged to on the map.
    coordinates.style.display = 'block';
    coordinates.innerHTML = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;

    canvas.style.cursor = '';

    // Unbind mouse/touch events
    map.off('mousemove', onMove);
    map.off('touchmove', onMove);
    

    // return updatedPointCoordinates
    latitude = coords.lat;
    longitude = coords.lng
    // console.log([coords.lng, coords.lat])
    // console.log(coords)

}

// const updatedPointCoordinates = coordinates.innerHTML
// console.log(updatedPointCoordinates)

map.on('load', () => {
    // Add a single point to the map.
    map.addSource('point', {
        'type': 'geojson',
        'data': geojson
    });

    map.addLayer({
        'id': 'point',
        'type': 'circle',
        'source': 'point',
        'paint': {
            'circle-radius': 15,
            'circle-color': '#F84C4C' // red color
        }
    });

    // When the cursor enters a feature in
    // the point layer, prepare for dragging.
    map.on('mouseenter', 'point', () => {
        map.setPaintProperty('point', 'circle-color', '#3bb2d0');
        canvas.style.cursor = 'move';
    });

    map.on('mouseleave', 'point', () => {
        map.setPaintProperty('point', 'circle-color', '#3887be');
        canvas.style.cursor = '';
    });

    map.on('mousedown', 'point', (e) => {
        // Prevent the default map drag behavior.
        e.preventDefault();

        canvas.style.cursor = 'grab';

        map.on('mousemove', onMove);
        map.once('mouseup', onUp);
    });

    map.on('touchstart', 'point', (e) => {
        if (e.points.length !== 1) return;

        // Prevent the default map drag behavior.
        e.preventDefault();

        map.on('touchmove', onMove);
        map.once('touchend', onUp);
    });

});

// map.flyTo({center: [cityLongLat], zoom: 9});

// if 

// else center: [0, 0]

// var map = new mapboxgl.Map({
//   container: 'map', // container id
//   style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
//   center: [lng, lat], // starting position [lng, lat]
//   zoom: 9 // starting zoom

// POETRY MAP PAGE
