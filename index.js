console.log("hello");
const Key ="48b49240e19d31e21c29538d0ca220bc";
async function showWeather(){
    const city = "sitapur";
    const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Key}`);
    const data =await response.json();
    console.log(data);

    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)} *C`
    document.body.append(newPara);


}
showWeather();