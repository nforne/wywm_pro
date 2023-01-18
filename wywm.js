// Request data from api

let returnedData = {}; // breeds and sub-breeds
let userInput = {data: '', breed: '', subBreed: '', options:'', num:''}
let images = []; // current array of fetched images
let slideTracker = 0; // to track and controle images when in slide view
let view = ''; // grid or slide
let zoomTracker = 0;

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

// to return to default img
const setDefaultImg = () => {
  const imgsBox = document.getElementById('imgs');
  imgsBox.innerHTML = '';
  imgsBox.removeAttribute('class');
  imgsBox.setAttribute('class', 'imgs');
  const defaultImg = document.createElement('img')
  defaultImg.setAttribute('src', 'mug_shot_cat.jpg');
  defaultImg.setAttribute('alt', 'mug_shot_cat');
  defaultImg.setAttribute('id', 'default');
  imgsBox.appendChild(defaultImg);
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
  const imgsBox = document.getElementById('imgs');
  imgsBox.removeAttribute('class');
  imgsBox.setAttribute('class', 'imgs')
  if (imgs.length === 0) {
    setDefaultImg();
    return;
  }
  for (let dog of imgs) {
    const dogImg = document.createElement('img');
    dogImg.setAttribute('src', `${dog}`);
    dogImg.setAttribute('alt', `${'dog'+ String(index)}`);
    imgsBox.appendChild(dogImg);
    index++
  }
}

const slideLeft = (images) => {
  if (slideTracker >= 1) {
    slideTracker -= 1;
  } else {
    message('That was all. Try sliding to the Right!')
    return;
  }
  const rowBox1 = document.getElementById('rowBox1')
  rowBox1.innerHTML = '';
  const img = document.createElement('img');
  img.setAttribute('src', `${images[slideTracker]}`);
  img.setAttribute('alt', `dog${slideTracker}`);
  rowBox1.appendChild(img);
}

const slideRight = (images) => {
  if (slideTracker < images.length - 1) {
    slideTracker += 1;
  } else {
    message('That was all. Try sliding to the Left!')
    return;
  }
  const rowBox1 = document.getElementById('rowBox1')
  rowBox1.innerHTML = '';
  const img = document.createElement('img');
  img.setAttribute('src', `${images[slideTracker]}`);
  img.setAttribute('alt', `dog${slideTracker}`);
  rowBox1.appendChild(img);
}

const zoomIn = () => {
  zoomTracker += 1;
  if (view === 'slide') {
    if (zoomTracker > 5) {
      message('That was it. Try zooming out!')
      zoomTracker -= 1
      return;
    }
    const imgsBox = document.getElementById('rowBox1');
    imgsBox.classList.remove(`zoom${zoomTracker - 1}`);
    imgsBox.classList.add(`zoom${zoomTracker}`);
  }
  if (view === 'grid') {
    if (zoomTracker > 6) {
      message('That was it. Try zooming out!')
      zoomTracker -= 1
      return;
    }
    gridView(images);
  }
}

const zoomOut = () => {
  zoomTracker -= 1;
  if (view === 'slide') {
    if (zoomTracker < 1) {
      message('That was it. Try zooming In!')
      zoomTracker += 1
      return;
    }
    const imgsBox = document.getElementById('rowBox1');
    imgsBox.classList.remove(`zoom${zoomTracker + 1}`);
    imgsBox.classList.add(`zoom${zoomTracker}`);
  }
  if (view === 'grid') {
    if (zoomTracker < 1) {
      message('That was it. Try zooming In!')
      zoomTracker += 1
      return;
    }
    gridView(images);
  }
}

let inputReset = ''; // to make user input reset availabe globally

// clear out old images on display
const clearOutAndSet = (images) => {
  const imgsBox = document.getElementById('imgs');
  imgsBox.innerHTML = '';
  imgsBox.removeAttribute('class');
  imgsBox.setAttribute('class', 'imgs');
  appendImg(images);
  inputReset();
}

// to display fetched images in a grid
const gridView = (images) => {
  const imgsBox = document.getElementById('imgs');
  imgsBox.innerHTML = '';
  imgsBox.removeAttribute('class');
  imgsBox.setAttribute('class', 'grid')
  if (images.length <= 1) {
    clearOutAndSet(images);
    return
  }
  let columns = '';
  switch (zoomTracker) {
    case 6:
      columns = 1;
      break;
    case 5:
      columns = 2;
      break;
    case 4:
      columns = 3;
      break;
    case 3:
      columns = 4;
      break;
    case 2:
      columns = 5;
      break;
    case 1:
      columns = 6;
      break;
  }
  for (let i = 0; i < columns; i++) {
    const columnBox = document.createElement('div');
    columnBox.setAttribute('id', `columnBox${i}`);
    columnBox.setAttribute('class', 'columnImgs');
    switch (columns) {
      case 1:
        columnBox.classList.add("one");
        break;
      case 2:
        columnBox.classList.add("two");
        break;
      case 3:
        columnBox.classList.add("three");
        break;
      case 4:
        columnBox.classList.add("four");
        break;
      case 5:
        columnBox.classList.add("five");
        break;
      case 6:
        columnBox.classList.add("six");
        break;
    }
    imgsBox.appendChild(columnBox);
  }

  const distribution = Math.ceil(images.length / columns);
  let numberOfImgs = 0;
  let distributionTracker = 0;
  while (distributionTracker < distribution && numberOfImgs !== images.length) {
    for (let j = 0; j < columns; j++) {
      if (numberOfImgs === images.length) break;
      const columnBox = document.getElementById(`columnBox${j}`)
      const img = document.createElement('img');
      img.setAttribute('src', `${images[numberOfImgs]}`);
      img.setAttribute('alt', `dog${numberOfImgs}`);
      columnBox.appendChild(img);
      numberOfImgs += 1;
    }
    distributionTracker ++;
  }
}

// to display fetched images on horizontal slides
const slideView = (images) => {
  const imgsBox = document.getElementById('imgs');
  imgsBox.innerHTML = '';
  imgsBox.removeAttribute('class');
  imgsBox.setAttribute('class', 'slide')
  if (images.length <= 1) {
    clearOutAndSet(images);
    return
  }
  for (let i = 0; i < 3; i++) {
    const rowBox = document.createElement('div');
    rowBox.setAttribute('id', `rowBox${i}`);
    rowBox.setAttribute('class', 'rowBox');
    imgsBox.appendChild(rowBox);
  }
  const rowBox0 = document.getElementById('rowBox0')
  rowBox0.innerHTML = '<i id="slideL" class="fa fa-angle-double-left fa-5x" aria-hidden="true"></i>';
  
  const rowBox2 = document.getElementById('rowBox2')
  rowBox2.innerHTML = '<i id="slideR" class="fa fa-angle-double-right fa-5x" aria-hidden="true"></i>';
 
  const rowBox1 = document.getElementById('rowBox1')
  rowBox1.classList.add('zoom5')
  const img = document.createElement('img');
  img.setAttribute('src', `${images[slideTracker]}`);
  img.setAttribute('alt', `dog${slideTracker}`);
  rowBox1.appendChild(img);
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
    const grid = document.getElementById('grid');
    const slide = document.getElementById('slide');
    const zoomI = document.getElementById('zoomIn');
    const zoomO = document.getElementById('zoomOut');

    inputReset = () => { // globalise user input reset
      // reset input upon search query fired - go
      if (zoomTracker !== 0) {
        const imgsBox = document.getElementById('imgs');
        imgsBox.classList.remove(`zoom${zoomTracker}`)
        zoomTracker = 0;
      }
      userInput = {data: '', breed: '', subBreed: '', options:'', num:''};
      breed.value = '';
      subBreed.value = '';
      subBreed.disabled = true
      options.value = '';
      num.value = '';
      slideTracker = 0;
    }
    
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


    // capture go button click event
    go.addEventListener('click', () => {
      if (userInput.breed === '' && userInput.subBreed === '' && userInput.options ==='' && userInput.num ==='') {
        setDefaultImg();
        return;
      } else if (userInput.breed === '' && userInput.subBreed === '' && userInput.options ==='' && userInput.num ) {
        num.value = '';
        return
      }
      data(url(userInput)).then((res) => {
        const returnedImages = Array.isArray(res.message) ? [...res.message] : [res.message];
        images = [...returnedImages] // update globally available most recently fetched images
        clearOutAndSet(images);
      })
    } ,false);

    // capture grid button click event
    grid.addEventListener('click', () => {
      view = 'grid';
      zoomTracker = 6;
      gridView(images);
    } ,false);

    // capture slide button click event
    slide.addEventListener('click', () => {
      view = 'slide';
      zoomTracker = 5;
      slideView(images);

      const slideR = document.getElementById('slideR');
      const slideL = document.getElementById('slideL');

      // capture slideRight button click event
      slideR.addEventListener('click', () => {
        slideRight(images);
      } ,false);
      
      // capture slideLeft button click event
      slideL.addEventListener('click', () => {
        slideLeft(images);
      } ,false);

    } ,false);
    
    // capture zoomIn button click event
    zoomI.addEventListener('click', () => {
      zoomIn();
    } ,false);
    
    // capture zoomOut button click event
    zoomO.addEventListener('click', () => {
      zoomOut();
    } ,false);

  })
})


