require('dotenv').config()
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {
    
    busquedas = new Busquedas();
    let opt;
    
    do {

        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                //mostrar mensaje
                console.clear();
                const termino = await leerInput('Ciudad: '.green);
                
                //buscar los lugares
                const lugares = await busquedas.ciudad ( termino );
                
                //seleccionar el lugar
                const idSel = await listarLugares ( lugares );
                if (idSel === '0') continue;

                const lugarSel = lugares.find( l => l.id === idSel);

                //Guardar en DB
                busquedas.agregarHistorial( lugarSel.nombre );


                //Clima
                const clima = await busquedas.climaPorLugar(lugarSel.lat, lugarSel.lng);

                //Mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad'.bgBlue);
                console.log('ciudad:',lugarSel.nombre.green);
                console.log('\nLat:',lugarSel.lat);
                console.log('Lng:',lugarSel.lng,'\n');
                console.log('Temperatura Actual:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('Estado actual del clima:', clima.desc.green);

                break;
            case 2:
                console.clear();
                console.log('Historial de Busqueda (Ultimas 6)\n'.bgBlue);
                busquedas.historial.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}\n`);
                });
        
            default:
                break;
        }

       
       if( opt !== 0 ) await pausa();

    } while (opt !== 0);



}

main();