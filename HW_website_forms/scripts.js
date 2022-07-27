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
function getSelectedCity()
{

  var SelectedCity = document.getElementById("list").value
  
console.log(SelectedCity)

}

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