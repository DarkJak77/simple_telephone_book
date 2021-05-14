// This funciton is used to send message to "main.js"
function send(msg) {
    window.api.send('toMain', msg)
}

// Render when app is started
function auto_load() {
    window.api.auto()
    
}
// Fast Sassari Choice
function restore(){
    window.api.restore()
}
// Used to delete value of telephone book
function del(ind) {
    window.api.del(ind)
    send('Numero Rimosso con successo!')
    render()
}

// Used to edit value of telephone book
function edit(ind) {
    let ret = window.api.edit(ind)
    if (ret == 'no_data') {
        send('no_data')
    } else {
        send('Numero Modificato con successo!')
        render()
    }
}

// This function is used to sort manually the contacts when are render
function up(ind) {
    let ret = window.api.up(ind)
    if (ret == 'no_data') {
        send('no_data')
    } else {
        render()
    }
}

// This function is used to sort manually the contacts when are render
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
    // if there are no contacts to save, the json file update.
    // this is to prevent too many bailouts 
    if (ret == 'no_data') {
        window.api.save_file()
        send('Rubrica Aggiornata con successo!')
    } else {
        send('Numero Aggiunto con successo!')
        render()
    }
}

// This function is tied at "onchange" of html
function comune_choice() {
    let choice = document.getElementById("comune").value
    window.api.save_choice('comune', choice)
}

// This function is tied at "onchange" of html
function tipologia_choice() {
    let choice = document.getElementById("tipologia").value
    window.api.save_choice('tipologia', choice)
}

function render() {
    let search = ['nome','numero','info']
    
    for (let index = 0; index < search.length; index++) {

        // This Exception is used to "seach"
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

// This is a Deat code......
/*
window.api.on('myRenderChannel', (event, ...args) => {
    let rest = args[0]        
})
*/
