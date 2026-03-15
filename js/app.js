const divSearch = document.querySelector('#divSearch')
const divTop = document.querySelector('#divTop')
const divSearchAndResults = document.querySelector('#divSearchAndResults')
const h3Loading = document.querySelector('#h3Loading')
const divLoc = document.querySelector('#divLoc')
const cboLoc = document.querySelector('#cboLoc')
const txtLocName = document.querySelector('#txtLocName')
const btnReturn = document.querySelector('#btnReturn')
const divToday = document.querySelector('#divToday')
const iconCurConditions = document.querySelector('#iconCurConditions')
const divCurTemp = document.querySelector('#divCurTemp')
const divTempFeels = document.querySelector('#divTempFeels')
const divTempTodayHigh = document.querySelector('#divTempTodayHigh')
const divTempTodayLow = document.querySelector('#divTempTodayLow')
const divCurHum = document.querySelector('#divCurHum')
const divCurWindSpeed = document.querySelector('#divCurWindSpeed')
const divDaily = document.querySelector('#divDaily')
const divFlexDailies = document.querySelector('#divFlexDailies')
const divHourly = document.querySelector('#divHourly')
const divFlexHourlies = document.querySelector('#divFlexHourlies')
// https://www.codelessgenie.com/blog/adding-objects-to-array-in-localstorage
const strLocs = localStorage.getItem('arrLocs')
const arrLocs = strLocs ? JSON.parse(strLocs) : []
arrLocs.forEach(objLoc => {
    const optLoc = document.createElement('option')
    optLoc.value = objLoc.id
    optLoc.innerText = `${objLoc.name}, ${objLoc.admin1}, ${objLoc.country}`
    cboLoc.appendChild(optLoc)
})
getLocation()
// for icons
function getConditions(weather_code,is_day){
    return weather_code == 0 && is_day ? 'sun' :
    weather_code == 0 ? 'moon' :
    weather_code == 1 && is_day ? 'cloud-sun' :
    weather_code == 1 ? 'cloud-moon' :
    weather_code == 2 ? 'cloud' :
    weather_code == 3 ? 'clouds' :
    weather_code == 45 ? 'cloud-fog' :
    weather_code == 48 ? 'cloud-haze' :
    weather_code < 56 ? 'cloud-drizzle' :
    weather_code < 58 ? 'cloud-sleet' :
    weather_code < 66 ? 'cloud-rain' :
    weather_code < 68 ? 'cloud-sleet' :
    weather_code < 78 ? 'cloud-snow' :
    weather_code < 83 ? 'cloud-rain-heavy' :
    weather_code < 87 ? 'cloud-snow' :
    weather_code < 96 ? 'cloud-lightning-rain' : 'cloud-hail'
}

function loadWeatherData(latitude,longitude,timezone){
    h3Loading.innerText = 'Loading . . .'
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,apparent_temperature_max,temperature_2m_min,apparent_temperature_min,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,uv_index,is_day&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=${timezone.replace('/','%2F')}&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`)
    .then(result => {
        if(result.ok){
            return result.json()
        } else {
            throw new Error(result.status)
        }
    })
    .then(data => {
        h3Loading.innerText = ''
        iconCurConditions.classList.add('bi',`bi-${getConditions(data.current.weather_code,data.current.is_day)}`,'text-primary','fs-1')
        divCurTemp.innerText = `${data.current.temperature_2m}${data.current_units.temperature_2m}`
        divTempFeels.innerText = `(feels like ${data.current.apparent_temperature}${data.current_units.apparent_temperature})`
        divTempTodayHigh.innerText = `${data.daily.temperature_2m_max[0]}${data.daily_units.temperature_2m_max} (${data.daily.apparent_temperature_max[0]}${data.daily_units.apparent_temperature_max})`
        divTempTodayLow.innerText = `${data.daily.temperature_2m_min[0]}${data.daily_units.temperature_2m_min} (${data.daily.apparent_temperature_min[0]}${data.daily_units.apparent_temperature_min})`
        divCurHum.innerText = `${data.current.relative_humidity_2m}%`
        divCurWindSpeed.innerText = `${data.current.wind_speed_10m}mph`
        divToday.classList.remove('d-none')
        divDaily.classList.remove('d-none')
        divHourly.classList.remove('d-none')
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#for...in_statement
        for(const i in data.daily.time){
            const divNewDayForecast = document.createElement('div')
            divNewDayForecast.classList.add('text-center','mx-1','card','bg-secondary-subtle','col-6')

            const divWeekday = document.createElement('div')
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
            divWeekday.innerText =
                i == 0 ? 'Today' :
                i == 1 ? 'Tomorrow' :
                new Intl.DateTimeFormat('en-US',{weekday:'long'}).format(new Date(data.daily.time[i]))
            divNewDayForecast.appendChild(divWeekday)

            const iconNewDayConditions = document.createElement('i')
            iconNewDayConditions.classList.add('bi',`bi-${getConditions(data.daily.weather_code[i],true)}`,'text-primary','fs-1')
            divNewDayForecast.appendChild(iconNewDayConditions)
            
            const divTempForecastHigh = document.createElement('div')
            divTempForecastHigh.classList.add('d-flex','justify-content-center')
            const divIconTempForecastHigh = document.createElement('div')
            const iconTempForecastHigh = document.createElement('i')
            iconTempForecastHigh.classList.add('bi','bi-thermometer-sun','fs-4','me-2','text-primary')
            divIconTempForecastHigh.appendChild(iconTempForecastHigh)
            divTempForecastHigh.appendChild(divIconTempForecastHigh)
            const parTempForecastHigh = document.createElement('p')
            parTempForecastHigh.innerText = `${data.daily.temperature_2m_max[i]}${data.daily_units.temperature_2m_max} (${data.daily.apparent_temperature_max[i]}${data.daily_units.apparent_temperature_max})`
            divTempForecastHigh.appendChild(parTempForecastHigh)
            divNewDayForecast.appendChild(divTempForecastHigh)
            
            const divTempForecastLow = document.createElement('div')
            divTempForecastLow.classList.add('d-flex','justify-content-center')
            const divIconTempForecastLow = document.createElement('div')
            const iconTempForecastLow = document.createElement('i')
            iconTempForecastLow.classList.add('bi','bi-thermometer-snow','fs-4','me-2','text-primary')
            divIconTempForecastLow.appendChild(iconTempForecastLow)
            divTempForecastLow.appendChild(divIconTempForecastLow)
            const parTempForecastLow = document.createElement('p')
            parTempForecastLow.innerText = `${data.daily.temperature_2m_min[i]}${data.daily_units.temperature_2m_min} (${data.daily.apparent_temperature_min[i]}${data.daily_units.apparent_temperature_min})`
            divTempForecastLow.appendChild(parTempForecastLow)
            divNewDayForecast.appendChild(divTempForecastLow)
            
            const divSunrise = document.createElement('div')
            divSunrise.classList.add('d-flex','justify-content-center')
            const divIconSunrise = document.createElement('div')
            const iconSunrise = document.createElement('i')
            iconSunrise.classList.add('bi','bi-sunrise','fs-4','me-2','text-primary')
            divIconSunrise.appendChild(iconSunrise)
            divSunrise.appendChild(divIconSunrise)
            const divSunriseTime = document.createElement('div')
            divSunriseTime.innerText = new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'numeric',timeZone:data.timezone,timeZoneName:'short'}).format(new Date(data.daily.sunrise[i]))
            divSunrise.appendChild(divSunriseTime)
            divNewDayForecast.appendChild(divSunrise)
            
            const divSunset = document.createElement('div')
            divSunset.classList.add('d-flex','justify-content-center')
            const divIconSunset = document.createElement('div')
            const iconSunset = document.createElement('i')
            iconSunset.classList.add('bi','bi-sunset','fs-4','me-2','text-primary')
            divIconSunset.appendChild(iconSunset)
            divSunset.appendChild(divIconSunset)
            const divSunsetTime = document.createElement('div')
            divSunsetTime.innerText = new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'numeric',timeZone:data.timezone,timeZoneName:'short'}).format(new Date(data.daily.sunset[i]))
            divSunset.appendChild(divSunsetTime)
            divNewDayForecast.appendChild(divSunset)

            divFlexDailies.appendChild(divNewDayForecast)
        }
        for (const i in data.hourly.time){
            if(Date.now() > new Date(data.hourly.time[i])){
                continue
            }
            const divNewHourForecast = document.createElement('div')
            divNewHourForecast.classList.add('text-center','mx-1','card','bg-secondary-subtle','col-6')

            const parWeekday = document.createElement('p')
            parWeekday.innerText =
                i < 24 ? 'Today' :
                i < 48 ? 'Tomorrow' :
                new Intl.DateTimeFormat('en-US',{weekday:'long'}).format(new Date(data.hourly.time[i]))
            parWeekday.classList.add('mt-2')
            divNewHourForecast.appendChild(parWeekday)

            const h3Time = document.createElement('h3')
            h3Time.innerText = new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'numeric'}).format(new Date(data.hourly.time[i]))
            h3Time.classList.add('mb-3')
            divNewHourForecast.appendChild(h3Time)

            const divFlexHourlyTemp = document.createElement('div')
            divFlexHourlyTemp.classList.add('d-flex','justify-content-center')
            const iconHourlyTemp = document.createElement('i')
            iconHourlyTemp.classList.add('bi','bi-thermometer','text-primary','fs-4','me-2')
            divFlexHourlyTemp.appendChild(iconHourlyTemp)
            const parHourlyTemp = document.createElement('p')
            parHourlyTemp.innerText = `${data.hourly.temperature_2m[i]}${data.hourly_units.temperature_2m} (${data.hourly.apparent_temperature[i]}${data.hourly_units.apparent_temperature})`
            divFlexHourlyTemp.appendChild(parHourlyTemp)
            divNewHourForecast.appendChild(divFlexHourlyTemp)

            const divFlexHourlyHum = document.createElement('div')
            divFlexHourlyHum.classList.add('d-flex','justify-content-center')
            const iconHourlyHum = document.createElement('i')
            iconHourlyHum.classList.add('bi','bi-moisture','text-primary','fs-4','me-2')
            divFlexHourlyHum.appendChild(iconHourlyHum)
            const parHourlyNum = document.createElement('p')
            parHourlyNum.innerText = `${data.hourly.relative_humidity_2m[i]}%`
            divFlexHourlyHum.appendChild(parHourlyNum)
            divNewHourForecast.appendChild(divFlexHourlyHum)

            const divFlexHourlyPrecipProb = document.createElement('div')
            divFlexHourlyPrecipProb.classList.add('d-flex','justify-content-center')
            const iconHourlyPrecipProb = document.createElement('i')
            iconHourlyPrecipProb.classList.add('bi','bi-cloud-rain','text-primary','fs-4','me-2')
            divFlexHourlyPrecipProb.appendChild(iconHourlyPrecipProb)
            const parHourlyPrecipProb = document.createElement('p')
            parHourlyPrecipProb.innerText = `${data.hourly.precipitation_probability[i]}%`
            divFlexHourlyPrecipProb.appendChild(parHourlyPrecipProb)
            divNewHourForecast.appendChild(divFlexHourlyPrecipProb)

            const divFlexHourlyWindSpeed = document.createElement('div')
            divFlexHourlyWindSpeed.classList.add('d-flex','justify-content-center')
            const iconHourlyWindSpeed = document.createElement('i')
            iconHourlyWindSpeed.classList.add('bi','bi-wind','text-primary','fs-4','me-2')
            divFlexHourlyWindSpeed.appendChild(iconHourlyWindSpeed)
            const parHourlyWindSpeed = document.createElement('p')
            parHourlyWindSpeed.innerText = `${data.hourly.wind_speed_10m[i]}mph`
            divFlexHourlyWindSpeed.appendChild(parHourlyWindSpeed)
            divNewHourForecast.appendChild(divFlexHourlyWindSpeed)

            const divUvIndex = document.createElement('div')
            divUvIndex.innerText = `UV Index: ${data.hourly.uv_index[i]}`
            divNewHourForecast.appendChild(divUvIndex)

            divFlexHourlies.appendChild(divNewHourForecast)
        }
    })

}

// https://www.w3schools.com/html/html5_geolocation.asp
function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
        Swal.fire({
            title:"Geolocation is not supported by this browser.",
            icon:"error"
        })
    }
}

function geoSuccess(position){
    // https://tutorialreference.com/javascript/examples/faq/javascript-how-to-get-user-time-zone
    loadWeatherData(position.coords.latitude, position.coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone)
}

function geoError(error){
    switch(error.code) {
        case error.POSITION_UNAVAILABLE:
            Swal.fire({
                title:"Location information is unavailable.",
                icon:"error"
            })
            break;
        case error.TIMEOUT:
            Swal.fire({
                title:"The request to get user location timed out.",
                icon:"error"
            })
            break;
        case error.UNKNOWN_ERROR:
            Swal.fire({
                title:"An unknown error occurred.",
                icon:"error"
            })
            break;
    }
}

cboLoc.addEventListener('change',() => {
    divToday.classList.add('d-none')
    iconCurConditions.classList = []
    divCurTemp.innerText = ''
    divTempFeels.innerText = ''
    divTempTodayHigh.innerText = ''
    divTempTodayLow.innerText = ''
    divCurHum.innerText = ''
    divCurWindSpeed.innerText = ''
    divDaily.classList.add('d-none')
    divHourly.classList.add('d-none')
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
    while(divFlexDailies.firstChild){
        divFlexDailies.removeChild(divFlexDailies.firstChild)
    }
    while(divFlexHourlies.firstChild){
        divFlexHourlies.removeChild(divFlexHourlies.firstChild)
    }
    if(cboLoc.value == 'myLocation'){
        if(document.querySelector('#btnRemove')){
            divLoc.removeChild(document.querySelector('#btnRemove'))
        }
        getLocation()
    } else {
        if (!document.querySelector('#btnRemove')){
            const btnRemove = document.createElement('button')
            btnRemove.id = 'btnRemove'
            btnRemove.type = 'button'
            btnRemove.classList.add('btn','btn-secondary')
            btnRemove.innerText = 'Remove location'
            divLoc.appendChild(btnRemove)

            btnRemove.addEventListener('click',() => {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                arrLocs.splice(arrLocs.findIndex(({id}) => id == cboLoc.value), 1)
                localStorage.setItem('arrLocs', JSON.stringify(arrLocs))
                cboLoc.remove(cboLoc.selectedIndex)
                cboLoc.selectedIndex = 0
                // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events#creating_and_dispatching_events
                cboLoc.dispatchEvent(new Event('change'))
            })
        }
        const objLoc = arrLocs.find(({id}) => id == cboLoc.value)
        loadWeatherData(objLoc.latitude,objLoc.longitude,objLoc.timezone)
    }
})

btnReturn.addEventListener('click',() => {
    if(document.querySelector('#formResults')){
        divSearchAndResults.removeChild(document.querySelector('#formResults'))
    }
    txtLocName.value = ''
    divSearch.classList.add('d-none')
    divTop.classList.remove('d-none')
    if(divFlexDailies.firstChild){
        divToday.classList.remove('d-none')
        divDaily.classList.remove('d-none')
        divHourly.classList.remove('d-none')
    }
})

document.querySelector('#btnAddLoc').addEventListener('click',() => {
    divTop.classList.add('d-none')
    divToday.classList.add('d-none')
    divDaily.classList.add('d-none')
    divHourly.classList.add('d-none')
    divSearch.classList.remove('d-none')
})

document.querySelector('#btnSearchLoc').addEventListener('click',() => {
const strLocName = txtLocName.value.trim().replace(' ','+')
    if (document.querySelector('#formResults')) {
        divSearchAndResults.removeChild(document.querySelector('#formResults'))
    }
    const divLoading = document.createElement('div')
    divLoading.classList.add('mt-4','mb-2')
    divLoading.innerText = 'Loading . . .'
    divSearchAndResults.appendChild(divLoading)
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${strLocName}`)
    .then(result => {
        if(result.ok){
            return result.json()
        } else {
            throw new Error(result.status)
        }
    })
    .then(data => {
        const formResults = document.createElement('form')
        const cboResults = document.createElement('select')
        if(data.results){
            const optNone = document.createElement('option')
            optNone.value = 'none'
            optNone.innerText = 'Select location'
            cboResults.appendChild(optNone)
            data.results.forEach(objResult => {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
                if(!arrLocs.some(({id}) => id == objResult.id)) {
                    const optResult = document.createElement('option')
                    optResult.value = objResult.id
                    optResult.innerText = `${objResult.name}, ${objResult.admin1}, ${objResult.country}`
                    cboResults.appendChild(optResult)
                }
            })
        } else {
            const optNone = document.createElement('option')
            optNone.value = 'none'
            optNone.innerText = 'No locations found'
            cboResults.appendChild(optNone)
        }
        cboResults.classList.add('form-control','mt-3')
        cboResults.id = 'cboResults'
        cboResults.ariaLabel = 'Select location'
        formResults.appendChild(cboResults)
        formResults.id = 'formResults'
        divSearchAndResults.removeChild(divLoading)
        divSearchAndResults.appendChild(formResults)

        cboResults.addEventListener('change',() => {
            if(!document.querySelector('#btnAddSelected') && cboResults.value != 'none'){
                const btnAddSelected = document.createElement('button')
                btnAddSelected.id = 'btnAddSelected'
                btnAddSelected.type = 'button'
                btnAddSelected.classList.add('btn','btn-primary', 'mt-3')
                btnAddSelected.innerText = 'Add Location'
                formResults.appendChild(btnAddSelected)
    
                btnAddSelected.addEventListener('click',() => {
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
                    let objNewLoc = data.results.find(({id}) => id == cboResults.value)
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
                    delete objNewLoc.postcodes // not sure how this would be used in this app, and it can take up a lot of space (e.g., for NYC)
                    arrLocs.push(objNewLoc)
                    localStorage.setItem('arrLocs', JSON.stringify(arrLocs))
                    const optNewLoc = document.createElement('option')
                    optNewLoc.value = objNewLoc.id
                    // optNewLoc.selected = true
                    optNewLoc.innerText = `${objNewLoc.name}, ${objNewLoc.admin1}, ${objNewLoc.country}`
                    cboLoc.appendChild(optNewLoc)
                    cboLoc.selectedIndex = optNewLoc.index
                    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
                    btnReturn.click()
                    cboLoc.dispatchEvent(new Event('change'))
                    // unnecessary?
                    // Swal.fire({
                    //     title:"Location added!",
                    //     icon: "success",
                    //     timer: 1500
                    // })
                })
            } else if (document.querySelector('#btnAddSelected') && cboResults.value == 'none') {
                formResults.removeChild(document.querySelector('#btnAddSelected'))
            }
        })
    })
})