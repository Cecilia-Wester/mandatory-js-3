const BASE_URL = 'https://dog.ceo/api/';
const headerText = document.querySelector('header h1');
const renderImagesBtn = document.querySelector('#renderImages');
const main = document.querySelector('main');

//Hämtar hundlistan
function fetchDogs(){
    axios.get(`${BASE_URL}breeds/list/all`)
    .then(function (response) {
        renderDogs(response.data.message)
    })
    .catch(function (error) {
        console.log(error);
    });
}

//renderar ut hela listan med hundar i aside
function renderDogs(dogs){
    let ul = document.querySelector('ul');
    for(let dog in dogs){
        let li = document.createElement('li');
        ul.append(li);
        li.textContent = dog;
        li.id = dog;
        let ulSubBreed = document.createElement('ul');
        ulSubBreed.className = 'ulSubBreed';
        li.appendChild(ulSubBreed);
        li.addEventListener('click', function(e){
            fetchSubBreed(dog,e);
            window.location.hash = dog;
            headerText.textContent = dog;
            fetchBreedImage(dog,e);
        });
    }
}

fetchDogs();
//Hämtar bilderna som ska renderas på main
function fetchImages(){
    axios.get(`${BASE_URL}breeds/image/random/3`)
    .then(function (response){
        renderImages(response.data.message);
        })
    .catch(function (error) {
        console.log(error);
    });
}

//Renderar bilder på random hundar ur alla raser
function renderImages(images){
    main.innerHTML = '';
    let divImages = document.createElement('div');
    main.appendChild(divImages);
    divImages.className = 'divImages';
    for(image of images){
        let divImage = document.createElement('div'); 
        divImage.className = 'divImage';
        let img = document.createElement('img');
        divImage.appendChild(img);
        img.src = image;
        divImages.appendChild(divImage);  
    }
}

//denna funktionen gör så att man hamnar på samma sida som man var på
function renderDogImages(){
    if (window.location.hash){
        main.innerHTML = '';
        const splitted = window.location.hash.slice(1).split("-");
        if (splitted.length === 2) {
            let breed = splitted[0];
            let subBreed = splitted[1];
            fetchSubBreedImages(breed,subBreed)
        } else {
            let breed = splitted[0];
            fetchBreedImage(breed);
        }
    } else {
        fetchImages();
    }
}


renderDogImages();
renderImagesBtn.addEventListener('click', function(){
    renderDogImages();
});


//Hämtar sub-breedsen som ska ligga under varje ras som har det.
function fetchSubBreed(subBreed,e){
    axios.get(`${BASE_URL}breed/${subBreed}/list`)
    .then(response => {
        const dogs = response.data.message;
        renderSubBreeds(dogs,e); 

    })
    .catch(function (error) {
        console.log(error);
    });
}

//renderar ut sub-breedsen under varje ras i aside
function renderSubBreeds(dogs, e){
    let breed = e.target.id;
    let ulSubBreed = e.target.querySelector('.ulSubBreed');
    ulSubBreed.innerHTML ='';
    for(let subBreed of dogs){
        if(subBreed !== null){
            let li = document.createElement('li');
            ulSubBreed.appendChild(li);
            li.textContent = subBreed;
            li.addEventListener('click', function(e){
                e.stopPropagation();
                window.location.hash = breed +'-'+subBreed;
                headerText.textContent = breed +'-'+subBreed;
                fetchSubBreedImages(subBreed,e);
            });
        }
    }
}

//Hämtar tre random bilder på rasen man har klickat på.
function fetchBreedImage(breed,e){
    axios.get(`${BASE_URL}breed/${breed}/images/random/3`)
    .then(response => {
        const dogs = response.data.message;
        renderImages(dogs,e);
    })
    .catch(function (error) {
        console.log(error);
    });
}

function getHome(){
    let iconHome = document.querySelector('.iconHome');
    iconHome.addEventListener('click', function(e){
        window.location.href = 'main.html';
    });
}

getHome();

function fetchSubBreedImages(breed, subBreed, e){
    subBreed = window.location.hash.slice(1)
    console.log(subBreed)
    let splitSubBreed = subBreed.split('-');
    console.log(splitSubBreed);
    breed = splitSubBreed[0];
    subBreed = splitSubBreed[1];
    axios.get(`${BASE_URL}breed/${breed}/${subBreed}/images/random/3`)
    .then(response => {
        const subBreedImages = response.data.message;
        renderImages(subBreedImages,e);
    })
    .catch(function (error) {
        console.log(error);
    });
}