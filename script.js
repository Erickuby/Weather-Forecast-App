
const apikey="8fb09f23e5b53648b3a4116a368b2538";
window.addEventListener("load",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            const url= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
            

            fetch(url).then((res)=>{
                return res.json();
            }).then((data)=>{
                console.log(data);
                console.log(new Date().getTime())
                var dat= new Date(data.dt)
                console.log(dat.toLocaleString(undefined,'Asia/Kolkata'))
                console.log(new Date().getMinutes())
                weatherReport(data);
            })
        })
    }
    
})


function searchByCity(){
    var place= document.getElementById('input').value;
    var urlsearch= `https://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

    fetch(urlsearch).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        weatherReport(data);
        
    })
    document.getElementById('input').value='';
}

let searchHistory = [];

function addCityToSearchHistory(city) {
  searchHistory.unshift(city);
  displaySearchHistory();
}

function displaySearchHistory() {
  let historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  for (let i = 0; i < searchHistory.length; i++) {
    let city = searchHistory[i];
    let listItem = document.createElement("li");
    listItem.innerText = city;
    listItem.addEventListener("click", function() {
        getWeatherData(city);
    });
    historyList.appendChild(listItem);
  }
}

let historyList = document.querySelectorAll("#history-list li");
for (let i = 0; i < historyList.length; i++) {
  historyList[i].addEventListener("click", function(event) {
    let city = event.target.innerText;
    getWeatherData(city);
  });
}


function getWeatherData(city) {
    let apiKey = "8fb09f23e5b53648b3a4116a368b2538";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
      addCityToSearchHistory(data.name);
      updateUI(data);
    });
}

function updateUI(data) {
    document.getElementById("city").innerText = data.name + ", " + data.sys.country;
    document.getElementById("temperature").innerText = Math.floor(data.main.temp - 273) + " °C";
    document.getElementById("humidity").innerText = data.main.humidity + "%";
    document.getElementById("clouds").innerText = data.weather[0].description;
    let icon1 = data.weather[0].icon;
    let iconurl = "https://openweathermap.org/img/wn/" + icon1 + "@2x.png";
    document.getElementById("img").src = iconurl;
  }

addCityToSearchHistory("New York");
addCityToSearchHistory("London");

function weatherReport(data){
    var urlcast= `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast, 5); 

        if(!data || !data.name || !data.sys || !data.sys.country){
            throw new Error("Data format is not correct or missing required fields")
        }

        document.getElementById('city').innerText= data.name + ', '+data.sys.country;
        console.log(data.name,data.sys.country);
    
        if(!data.main || !data.main.temp){
            throw new Error("Data format is not correct or missing required fields")
        }
        console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';

        if(!data.main || !data.main.humidity){
            throw new Error("Data format is not correct or missing required fields")
        }
        document.getElementById('humidity').innerText= data.main.humidity + '%';

        if(!data.wind || !data.wind.speed){
            throw new Error("Data format is not correct or missing required fields")
        }
        document.getElementById('windSpeed').innerText= data.wind.speed + 'm/s';
    
        if(!data.weather || !data.weather[0] || !data.weather[0].description){
            throw new Error("Data format is not correct or missing required fields")
        }
        document.getElementById('clouds').innerText= data.weather[0].description;
        console.log(data.weather[0].description)
        
        if(!data.weather || !data.weather[0] || !data.weather[0].icon){
            throw new Error("Data format is not correct or missing required fields")
        }
        let icon1= forecast.list[0].weather[0].icon;
        let iconurl= "https://api.openweathermap.org/img/w/"+ icon1 +".png";
        document.getElementById('img').src=iconurl
    }).catch((error)=>{
        console.log(error);
    });
    addCityToSearchHistory(data.name);
}



function hourForecast(forecast){
    document.querySelector('.templist').innerHTML=''
    for (let i = 0; i < 5; i++) {

        var date= new Date(forecast.list[i].dt*1000)
        console.log((date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00',''))

        let hourR=document.createElement('div');
        hourR.setAttribute('class','next');

        let div= document.createElement('div');
        let time= document.createElement('p');
        time.setAttribute('class','time')
        time.innerText= (date.toLocaleTimeString(undefined,'Asia/Kolkata')).replace(':00','');

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';

        div.appendChild(time)
        div.appendChild(temp)

        let desc= document.createElement('p');
        desc.setAttribute('class','desc')
        desc.innerText= forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc)
        document.querySelector('.templist').appendChild(hourR);
}
}

function dayForecast(forecast, numDays) {
    document.querySelector('.weekF').innerHTML = '';
    for (let i = 8; i < (8 * numDays); i += 8) {
        let div = document.createElement('div');
        div.setAttribute('class', 'dayF');
        
        let day = document.createElement('p');
        day.setAttribute('class', 'date');
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(undefined, 'Asia/Kolkata');
        div.appendChild(day);
        
        let temp = document.createElement('p');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273)) + ' °C';
        div.appendChild(temp);
        
        let description = document.createElement('p');
        description.setAttribute('class', 'desc');
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);
        
        document.querySelector('.weekF').appendChild(div);
    }
}

dayForecast(forecast, 5);

  
  




  
  
