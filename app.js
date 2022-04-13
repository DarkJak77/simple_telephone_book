const fs = require('fs-extra');
const notifier = require('node-notifier');

const version = fs.readFileSync( __dirname +  '\\resources\\app\\src\\config\\version.txt', {encoding:'utf8', flag:'r'})

const new_version_path = fs.readFileSync( __dirname + '\\resources\\app\\src\\config\\config.txt', {encoding:'utf8', flag:'r'}).replace(
    'Rubrica NON TOCCARE.json','version.txt'
)

const new_version = fs.readFileSync( new_version_path, {encoding:'utf8', flag:'r'})

console.log(version)
console.log(new_version)

if (parseInt(version) < parseInt(new_version)) {
    console.log('check')

    

    // Object
    notifier.notify({
    title: 'Rubrica',
    message: 'Aggiornamento in Corso...'
    });

    fs.copySync(new_version_path + '\\' + new_version + '\\' + 'resurces', __dirname)

    // Object
    notifier.notify({
        title: 'Rubrica',
        message: 'Aggiornamento Completato!'
        });
    
}
