// Request data from api

let returnedData = {}

const url = (data = '', breed = '', options = '', num = '') => {
  // url constructor, template logic 
  if (options && !breed){
    alert('You can specify the #-of-pictures - upto 5, else you get only 1, if available!')
    // render bread and sub-breed inactive
    if (num === 0) {
      // Display single random image from all dogs collection
      return 'https://dog.ceo/api/breeds/image/random'
    } else if (num > 0) {
      // Display multiple random images from all dogs collection
      return `https://dog.ceo/api/breeds/image/random/${num}`
    }
  } else if (breed) {
    // render sub-breed active if available else inactive
    alert('Specify the breed and or sub-breed if you prefer to be specific, otherwise it\'s optional!')
    let subBreed = ''
    if (data && data[breed].length > 0) {
      subBreed = document.getElementById('SUB-BREED').value;
    } else if (data && data[breed].length === 0) {
      // deactivate sub-breed menu
      document.getElementById("SUB-BREED").disabled = true;
    }
    if (subBreed) {
      if (options == 'random') {
        // Multiple images from a sub-breed collection as available
        alert('You can specify the #-of-pictures - upto 5, else you get only 1, if available!')
        return `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random${num ? `/${num}` : ''}`
      } else if (options === 'all') {
        // Returns an array of all the images from the sub-breed
        return `https://dog.ceo/api/breed/${breed}/${subBreed}/images`
      }
    } else if (!subBreed) {
      if (options == 'random') {
        // Multiple images from a breed collection as available
        alert('You can specify the #-of-pictures - upto 5, else you get only 1, if available!')
        return `https://dog.ceo/api/breed/${breed}/images/random${num ? `/${num}` : ''}`
      } else if (options === 'all') {
        // Returns an array of all the images from the breed
        return `https://dog.ceo/api/breed/${breed}/images`
      }
    }
  } else {
    return 'https://dog.ceo/api/breeds/list/all'
  }
}


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
  
  data(url()).then((res) => {
    returnedData = {...res.message};
    const breed = document.getElementById('BREED');
    const subBreed = document.getElementById('SUB-BREED');

    let breeds = [...Object.keys(returnedData)];
    appendOptions(breed, breeds)

    breed.addEventListener('change', () => {
      if (returnedData[breed.value].length > 0) {
        subBreed.disabled = false;
        let subBreeds = [...returnedData[breed.value]];
        appendOptions(subBreed, subBreeds)
      } else if (returnedData[breed.value].length === 0) {
        subBreed.disabled = true;
      }
    } ,false) ; 

  })
})


