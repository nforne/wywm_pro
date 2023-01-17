// Request data from api

let returnedData = {}
const userInput = {data: '', breed: '', subBreed: '', options:'', num:''}

// message function to display messages for ten seconds
const message = (msg) => {  
  const  msge = document.getElementById('message');
  let option = document.createElement('p');
  option.textContent = msg;
  msge.appendChild(option)
  setTimeout(() => {
    msge.innerHTML = '';
  }, 10000) 
}


// url constructor, template logic 
const url = (input = '') => {
  let outPut = '';
  if (input.breed === '' && input.options){
    message('You can specify the #-of-pictures - upto 5, else you get only 1, if available!')
    if ((input.num === '' || input.num) && input.options === 'random') {
      // Display single random image from all dogs collection
      outPut = 'https://dog.ceo/api/breeds/image/random'
    } else if ((!input.num || input.num >= 1) && input.options === 'all') {
      // Display multiple random images from all dogs collection
      outPut = `https://dog.ceo/api/breeds/image/random/${input.num ? input.num : 2}`
    }
  } else if (input.breed) {
    message('Specify the breed and or sub-breed if you prefer to be specific, otherwise it\'s optional!')
    if (input.subBreed) {
      if (input.options == 'random' || input.options == '') {
        // Multiple images from a sub-breed collection as available
        message('You can specify the #-of-pictures - upto 5, else you get only 1, if available!')
        outPut = `https://dog.ceo/api/breed/${input.breed}/${input.subBreed}/images/random${input.num ? `/${input.num}` : ''}`
      } else if (input.options === 'all') {
        // Returns an array of all the images from the sub-breed
        outPut = `https://dog.ceo/api/breed/${input.breed}/${input.subBreed}/images`
      }
    } else if (input.subBreed === '') {
      if (input.options === 'random') {
        // Multiple images from a breed collection as available
        message('You can specify the #-of-pictures - upto 5, else you get only 1, if available!')
        outPut = `https://dog.ceo/api/breed/${input.breed}/images/random${input.num ? `/${input.num}` : ''}`
      } else if (input.options === 'all' || input.options === '') {
        // Returns an array of all the images from the breed
        outPut = `https://dog.ceo/api/breed/${input.breed}/images`
      }
    }
  } else {
    outPut = 'https://dog.ceo/api/breeds/list/all';
  } 
  return outPut;
}

// function to fetch data from api
const data = (url) => {
  return fetch(url).then(res => {
    // check for ok response code
    if (res.status === 200) {
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

// function to create img elements and append them
const appendImg = (imgs) => {
  let index = 0;
  for (let dog of imgs) {
    const imgsBox = document.getElementById('imgs');
    const option = document.createElement('img');
    option.setAttribute('src', `${dog}`);
    option.setAttribute('alt', `${'dog'+ String(index)}`);
    imgsBox.appendChild(option);
    index++
  }
}


window.addEventListener('load', () => {
  
  data(url(userInput)).then((res) => {
    returnedData = {...res.message};
    userInput['data'] = returnedData;
    const breed = document.getElementById('BREED');
    const subBreed = document.getElementById('SUB-BREED');
    const options = document.getElementById('PICTURE-OPTIONS');
    const num = document.getElementById('#-OF-PICTURES');
    const go = document.getElementById('GO');
    
    // to populate the breed menu
    let breeds = [...Object.keys(returnedData)];
    appendOptions(breed, breeds);

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
        appendOptions(subBreed, subBreeds);
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
      userInput['num'] = num.value;
    } ,false);


    // capture got button click event
    go.addEventListener('click', () => {
      
      data(url(userInput)).then((res) => {
        console.log(res) //--------------------------------------------------------------------------
        const returnedData = Array.isArray(res.message) ? [...res.message] : [res.message];        
        console.log('these imgs ====>', returnedData) //======================================================
        const defaultImg = document.getElementById('default');
        defaultImg.setAttribute('hidden', 'hidden')
        appendImg(returnedData);

        // reset on search query fired
         userInput = {data: '', breed: '', subBreed: '', options:'', num:''}
         breed.value = '';
         subBreed.value = '';
         subBreed.disabled = true
         options.value = '';
         num.value = '';
      })
    } ,false);

  })
})


