console.log('ok...')


// Structure
//----------------------------
const form = document.querySelector("form");
const SelectedCity = document.querySelector(".list")
const wordsInput = document.querySelector(".words");
const locationInput = document.querySelector(".location");
var button = document.querySelector("button");

// City dropdown
// ----------------------------
// function getSelectedCity()
// {

//   var SelectedCity = document.getElementById("list").value
  
// console.log(SelectedCity)}

// convert dropdown text to a static coordinate centroid now

// function getCityXY(val){ 
//   var cityLongLat=val.split(', ');

  // var cityLong = parseFloat(cityLongLat[1]); 
  // var cityLat = parseFloat(cityLongLat[0]);
  // console.log("Long: " + cityLong)
  // console.log("Lat: " + cityLat)
  // console.log(cityLongLat)

  // return cityLongLat

// }

// console.log(getCityXY(cityLongLat))

// const cityLong = cityForm.value=CityLongLat[1];
// const cityLat = cityForm.value=CityLongLat[0];

// console.log(cityLat)
// console.log(cityLong)


//--
//OBJECT SETUP
//----------------------------
const contact = {
	"contactList": []
}


// Event Handlers
//----------------------------
const addNewContact = (e) => {
  e.preventDefault();
  
  // variable for values entered in the form
  const newCity = SelectedCity.value;
  const newWords = wordsInput.value;
  const newLocation = locationInput.value;
  
  // store in a JSON object
  contactObject = {
		city: newCity,
		words: newWords,
    location: newLocation,
		completed: false,
	}
  
// Events
//----------------------------
form.addEventListener("submit", addNewContact);

  // pass object into display function
	// displayContact(contactObject);
  
  //add object to array
	contact.contactList.push(contactObject);
  console.log(contact)
  //store in local storage
	// localStorage.setItem("contact", JSON.stringify(contact));

  // var selected = new Array();
  // $('.cityInput option:selected').each(function() {
  //     selected.push($(this).val());
  // });

	//clear form
	form.reset();
}

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
  counter.style.color = 'red';
  counter.style.fontWeight = 'bold'
} else {
  counter.style.color = 'black';
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


mapboxgl.accessToken = 'pk.eyJ1IjoibWpoMjI0MSIsImEiOiJjbDZhNWdtdWcwemYwM2Nyejg4azR6MjdtIn0.jcFs6eofGMkSv7Gokq_b6A';
const coordinates = document.getElementById('coordinates');
// let defaultCoord = 
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-98.5556, 39.8097],
    zoom: 1.5,

});

function getCityXY() {
  // get long and lat 
  // var cityLongLat=val.split(', ');
  var cityLongLat0 = document.getElementById('list').value
  var cityLongLat=cityLongLat0.split(', ');
  console.log(cityLongLat)
  // set center of map
  map.flyTo({center: cityLongLat, zoom: 7.5});
  return cityLongLat
}

const canvas = map.getCanvasContainer();

const geojson = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [cityLongLat]
            }
        }
    ]
};

function onMove(e) {
    const coords = e.lngLat;

    // Set a UI indicator for dragging.
    canvas.style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    map.getSource('point').setData(geojson);
}

function onUp(e) {
    const coords = e.lngLat;

    // Print the coordinates of where the point had
    // finished being dragged to on the map.
    coordinates.style.display = 'block';
    coordinates.innerHTML = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;
    canvas.style.cursor = '';

    // Unbind mouse/touch events
    map.off('mousemove', onMove);
    map.off('touchmove', onMove);
}

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
            'circle-radius': 10,
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