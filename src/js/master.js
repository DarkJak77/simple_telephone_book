function stay_alive(){

}

function send(msg) {
    window.api.send('toMain', msg)
}


function auto_load() {
    window.api.auto()
}

function del(ind) {
    window.api.del(ind)
    send('Numero Rimosso con successo!')
    render()
}

function edit(ind) {
    let ret = window.api.edit(ind)
    if (ret == 'no_data') {
        send('no_data')
    } else {
        send('Numero Modificato con successo!')
        render()
    }
}

function up(ind) {
    let ret = window.api.up(ind)
    if (ret == 'no_data') {
        send('no_data')
    } else {
        render()
    }
}

function down(ind) {
    let ret = window.api.down(ind)
    if (ret == 'no_data') {
        send('no_data')
    } else {
        render()
    }
}

function save() {
    let ret = window.api.save_data()
    if (ret == 'no_data') {
        window.api.save_file()
        send('Rubrica Aggiornata con successo!')
    } else {
        send('Numero Aggiunto con successo!')
        render()
    }
}

// Choice 
function provincia_choice() {
    let choice = document.getElementById("province").value
    window.api.save_choice('provincia', choice)
    window.api.render_comune()
}

function comune_choice() {
    let choice = document.getElementById("comune").value
    window.api.save_choice('comune', choice)
}

function tipologia_choice() {
    let choice = document.getElementById("tipologia").value
    window.api.save_choice('tipologia', choice)
}

// Render
function render() {
    let search = ['nome','numero','info']
    
    for (let index = 0; index < search.length; index++) {
        if (document.getElementById(search[index]).value != ''){
            window.api.search()
            break
        }
        if ( index == 2) {
          window.api.render_tabella()  
        }
    }

    
}

auto_load()


/*
window.api.on('myRenderChannel', (event, ...args) => {
    let rest = args[0]        
})
*/
