// Request data from api

let returnedData = {}
const userInput = {breed: '', subBreed: '', options:'', num:''}

const url = (input = '') => {
  // url constructor, template logic 
  if (input.options && !input.breed){
    alert('You can specify the #-of-pictures - upto 5, else you get only 1, if available!')
    // render bread and sub-breed inactive
    if (input.num === 0) {
      // Display single random image from all dogs collection
      return 'https://dog.ceo/api/breeds/image/random'
    } else if (input.num > 0) {
      // Display multiple random images from all dogs collection
      return `https://dog.ceo/api/breeds/image/random/${num}`
    }
  } else if (input.breed) {
    // render sub-breed active if available else inactive
    alert('Specify the breed and or sub-breed if you prefer to be specific, otherwise it\'s optional!')
    let subBreed = ''
    if (data && data[input.breed].length > 0) {
      subBreed = document.getElementById('SUB-BREED').value;
    } else if (data && data[input.breed].length === 0) {
      // deactivate sub-breed menu
      document.getElementById("SUB-BREED").disabled = true;
    }
    if (input.subBreed) {
      if (input.options == 'random') {
        // Multiple images from a sub-breed collection as available
        alert('You can specify the #-of-pictures - upto 5, else you get only 1, if available!')
        return `https://dog.ceo/api/breed/${input.breed}/${input.subBreed}/images/random${input.num ? `/${input.num}` : ''}`
      } else if (input.options === 'all') {
        // Returns an array of all the images from the sub-breed
        return `https://dog.ceo/api/breed/${input.breed}/${input.subBreed}/images`
      }
    } else if (!subBreed) {
      if (options === 'random') {
        // Multiple images from a breed collection as available
        alert('You can specify the #-of-pictures - upto 5, else you get only 1, if available!')
        return `https://dog.ceo/api/breed/${input.breed}/images/random${input.num ? `/${input.num}` : ''}`
      } else if (input.options === 'all') {
        // Returns an array of all the images from the breed
        return `https://dog.ceo/api/breed/${input.breed}/images`
      }
    }
  } 
  return 'https://dog.ceo/api/breeds/list/all';
}

// function to fetch data from api
const data = (url) => {
  return fetch(url).then(res => {
    // check for ok response code
    if (res.status == 200) {
      // get the response in json format
      return res.json() 
    }
  }).catch((e) => {
    console.log(e)
  })
}

// function to create option elements and append them
const appendOptions = (breedOrSub, options) => {
  for (let dog of options) {
    let option = document.createElement('option');
    option.textContent = dog;
    breedOrSub.appendChild(option)
  }
}


window.addEventListener('load', () => {
  
  data(url(userInput)).then((res) => {
    returnedData = {...res.message};
    const breed = document.getElementById('BREED');
    const subBreed = document.getElementById('SUB-BREED');
    const options = document.getElementById('PICTURE-OPTIONS');
    const num = document.getElementById('#-OF-PICTURES');
    const go = document.getElementById('GO');
    
    // to populate the breed menu
    let breeds = [...Object.keys(returnedData)];
    appendOptions(breed, breeds)

    // to populate the sub-breed menu if the selected breed has sub-breed(s)
    if (breed.value.length === 0) {
      subBreed.value = '';
      subBreed.disabled = true;
    }
    breed.addEventListener('change', () => {
      userInput['breed'] = breed.value;
      if (breed.value.length === 0 || returnedData[breed.value].length === 0) {
        subBreed.value = '';
        subBreed.disabled = true;
      } else if (returnedData[breed.value].length > 0) {
        subBreed.innerHTML = '';
        subBreed.appendChild(document.createElement('option'));
        subBreed.disabled = false;
        let subBreeds = [...returnedData[breed.value]];
        appendOptions(subBreed, subBreeds)
      } 
    } ,false); 

    // capture user sub-breed input
    if (subBreed.disabled === true || subBreed.value.length === 0) {
      subBreed.value = '';
    }
    subBreed.addEventListener('change', () => {
      if (subBreed.disabled === true || subBreed.value.length === 0) {
        subBreed.value = '';
      } 
      userInput['subBreed'] = subBreed.value;
    } ,false);

    // capture user otpions input
    options.value = '';
    options.addEventListener('change', () => {
      if (options.value.length === 0) {
        options.value = '';
      } 
      userInput['options'] = options.value;
    } ,false);

    // capture user num imput
    num.value = '';
    num.addEventListener('change', () => {
      if (num.value === 0) {
        num.value = '';
      }
      userInput['num'] = num.value;
    } ,false);


    // capture got button click event
    go.addEventListener('click', () => {
       console.log('this userInput ==>',JSON.stringify(userInput)) // ==========================================
       // reset on search query fired
       breed.value = '';
       subBreed.value = '';
       subBreed.disabled = true
       options.value = '';
       num.value = '';
    } ,false);

  })
})


