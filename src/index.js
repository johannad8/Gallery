import _ from 'lodash';
import './styles/main.scss';
import 'babel-polyfill';

var imageObjectArray = [];
var imagePage = 1;
var currentImage = 0;
const apiKey = '12592371-8ef86ca20acb1e557318b1906';

async function getImagesFromApi(page) {
  try {
    const response = await fetch('https://pixabay.com/api/?key='+apiKey+'&q=horses&page='+page+'&per_page=3');

    if (response.status !== 200) {
      throw 'Could not fetch images, response is: ' + response.statusText;
    }

    const responseAsJson = await response.json();
    return responseAsJson.hits;
  }
  catch (err) {
    document.getElementById("errorText").innerHTML = 'Could not fetch images: ' + err;
    return [];
  }
}

async function getImage(offset) {
  currentImage = currentImage + offset;

  // If this is the first time loading, we need to get new images
  if (imageObjectArray === undefined || imageObjectArray.length === 0) {
    imageObjectArray = await getImagesFromApi(imagePage);
  }
  // if we are on the last image we need to fetch next page
  else if (currentImage === imageObjectArray.length) {
    imagePage++;
    currentImage = 0;
    imageObjectArray = await getImagesFromApi(imagePage);
  }
  // if we are on first page and first image we cant go back
  else if (currentImage < 0 && imagePage === 1) {
    currentImage = 0;
  }
  // if we are on any other page and trying to go back fetch the previous page
  else if (currentImage < 0) {
    imagePage--;
    imageObjectArray = await getImagesFromApi(imagePage);
    currentImage = imageObjectArray.length - 1;
  }

  if (imageObjectArray !== undefined && imageObjectArray.length > 0) {
    document.getElementById('main_photo').src = imageObjectArray[currentImage].largeImageURL;
  }
}

document.addEventListener("DOMContentLoaded", async function(event) {
  // Load the first image
  await getImage(0);

  // Add gallery eventListeners
  document.getElementById("btn-next").addEventListener("click", async () => await getImage(1));
  document.getElementById("btn-prev").addEventListener("click", async () => await getImage(-1));
});
