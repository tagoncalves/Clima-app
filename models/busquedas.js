const fs = require('fs');
const axios = require('axios');

class Busquedas {
    
    historial = [];
    dbPath = './db/database.json';
    
    constructor(){
        this.leerDB();
        
    }
    
    // get historialCapitalizado() {
    //     //capitalizar cada palabra
    //     if( !fs.existsSync(this.dbPath) ) return;
        

    //     return this.historial;
    // }

    get paramsMapbox() {
        return {
            'access_token': process.env.Mapbox_Key,
            'limit':5,
            'language': 'es'
            
        }
    }
    get paramsOpenWeather() {
        return {
            appid: process.env.OpenWeather_key,
            'units': 'metric',
            'lang': 'es'
            
        }
    }
    
    // Funcion asincrona de API MapBox.
    async ciudad( lugar = '' ){
        try {
           //peticion http
           const instance = axios.create({
            
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
           
            });


            const resp = await instance.get();
            
            return resp.data.features.map( lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            
        } catch (error) {
            return [];
        }
    }
    // Funcion asincrona de API OpenWeather.
    async climaPorLugar(lat = '', lon = ''){
        try{
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            })
            
            const resp = await instance.get();
            const {weather, main} = resp.data;
            
            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };
            
        }catch (error) {
            console.log(error);
        }
    }
    
    agregarHistorial( lugar = ''){

        //prevenir duplicados
        if( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }
        this.historial = this.historial.splice(0,5);
        
        this.historial.unshift (lugar);

        //grabar
        this.guardarDB();
    }
    guardarDB() {
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB() {
        if( !fs.existsSync(this.dbPath) ) return;
        try {
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );

        this.historial = data.historial;
        }catch (error) {console.log(error);}
    }
}



module.exports = Busquedas;