// Request data from api

const url = (breed = '', options = '', num = '') => {
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
const data = async (url) => {
  try {
    const res = await fetch(url)
    // returned data management logic
    // check for ok response code
    if (res.status == 200) {
      // get the response in json format
      res.json()
      // log the message part of the response
      console.log(`The api returned: ${data.message}`)
    }
  } catch (e) {
    // catch and log any errors
    console.log(e)
  }
}