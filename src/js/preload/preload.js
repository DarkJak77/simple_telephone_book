const { ipcRenderer, contextBridge } = require('electron')
const fs = require('fs');
const path = require('path')

// This is channel to send message from "main.js" to "master.js" and viceversa 
const validChannels = ["toMain", "myRenderChannel"];

// this string contains the path of json whit the contacts
let json_path = ''

let file = {
  // this contain the raw json
  raw: '',
  // this contain the parsed json
  data: '',
}

// store contain the "choice"
let store = {
  data: { "comune": "Sassari", "tipologia": "ag" }
}

// Questo serve a ritardare il caricamento del json
window.addEventListener('DOMContentLoaded', () => {
  
  tryload()

})

// nel caso in cui ci fossero dei problemi il master chiede di riprovare
ipcRenderer.on("myRenderChannel", (event, ...args) => {
  if (args[0] == 'load') {
    
    tryload()
    
  } 
})

// la funzione che carica il json
function tryload() {

  try {
    // The path of json with contacts is in the "config.txt"
    json_path =  fs.readFileSync(path.join(__dirname , '..\\..\\..' , '\\src\\config\\config.txt'), { encoding: 'utf8', flag: 'r' });
    file.raw = fs.readFileSync(json_path);
    file.data = JSON.parse(file.raw)

    restore()

  } catch (error) {
    
  }

}

// this function make a table that contain a contact
function tabella() {
  document.getElementById('tab').innerHTML = file.data[store.data.comune][store.data.tipologia].map((v, index) =>

    "<tr><td>{v}</td><td>{numero}</td><td>{info}</td><td>{edit}</td></tr>"
      .replaceAll('{v}', v['nome'])
      .replaceAll('{numero}', v['numero'])
      .replaceAll('{info}', v['info'])
      .replaceAll('{edit}', '<div id="btn"><button type="button" id="edit_{index}" value="{dati}" onclick={edit({index})}>Modifica</button>' +
        '<div id="space"></div>' + '<button type="button" onclick={del({index})}>Elimina</button><div id="space"></div><button onclick={down({index})}>▼</button>' +
        '<div id="space"></div><button onclick={up({index})}>▲</button></div>')
      .replaceAll('{dati}', store.data.comune + '_?' + store.data.tipologia + '_?' + v['nome'] + '_?' +
        v['numero'] + '_?' + v['info'])
      .replaceAll('{index}', index)
  ).join(' ')
}

// Initializa <input> in the html
function input_refresh() {
  document.getElementById('input_refresh').innerHTML =
    '<input class="textTextBoxNoHeaderDisabled" value="" id="nome" placeholder="Nome"></input><input class="textTextBoxNoHeaderDisabled18fd588a" value="" id="numero" placeholder="Numero"></input><input class="textTextBoxNoHeaderDisabledd44008b2" value="" id="info" placeholder="Info"></input>'
}


function restore() {
  store.data = { "comune": "Sassari", "tipologia": "ag" }
  document.getElementsByTagName('datalist')[0].innerHTML =
  document.getElementsByTagName('datalist')[0].innerHTML = Object.keys(file.data).map(function (v) {

    return '<option value="{v}">'.replaceAll('{v}', v)

  }).join(' '),

    document.getElementById('tipologia').innerHTML =
    "<option value='ag'>Autorità Giudiziarie</option>" +
    "<option value='fp'>Forze di Polizia</option>" +
    "<option value='ip'>Istituti Penitenziari</option>" +
    "<option value='co'>Comunità</option>" +
    "<option value='ot'>Altro</option>"

  document.getElementById('comune').value = 'Sassari'

  tabella()
}

/* 
This function is used to sorte element in object
If type == 1 the element move to the "bottom"
If type == 0 the element move to the "top"
*/
function move_array(index, type, value) {
  let new_array = []

  const element = file.data[value[0]][value[1]]

  if (type == 1) {
    for (let ind = 0; ind < file.data[value[0]][value[1]].length; ind++) {
      if (ind == index) {
        new_array.push(element[ind + 1])
        new_array.push(element[ind])
        ind++
      } else {
        new_array.push(element[ind])
      }
    }
  }

  if (type == 0) {
    for (let inde = 0; inde < file.data[value[0]][value[1]].length; inde++) {
      if (inde == index - 1) {
        new_array.push(element[inde + 1])
        new_array.push(element[inde])
        inde++
      } else {
        new_array.push(element[inde])
      }
    }
  }

  file.data[value[0]][value[1]] = new_array
}

/*
THIS IS THE MUST HAVE
ALL window.api.ETC in "master.js" work thanks contextBridge.exposeInMainWorld 
*/
contextBridge.exposeInMainWorld(
  "api", {

  // used to add element to telephone book
  save_data: () => {
    let to_push = {
      "nome": document.getElementById('nome').value,
      "numero": document.getElementById('numero').value,
      "info": document.getElementById('info').value
    }
    let count = 0

    if (document.getElementById('nome').value == '') {
      count += 1
    }
    if (document.getElementById('numero').value == '') {
      count += 1
    }
    if (document.getElementById('info').value == '') {
      count += 1
    }
    if (count != 3) {
      file.data[store.data.comune][store.data.tipologia].push(to_push)
      input_refresh()
    } else {
      return 'no_data'
    }
  },
  
  // save json with new element
  save_file: () => {
    let to_save_1 = JSON.stringify(file.data)
    fs.writeFileSync(json_path, to_save_1);
  },

  // delete a element
  del: (ind) => {
    let value = window.document.getElementById('edit_' + ind).value.split('_?')
    file.data[value[0]][value[1]].splice(ind, 1)
  },

  // edit a element
  edit: (ind) => {
    let value = window.document.getElementById('edit_' + ind).value.split('_?')
    let count = 0
    if (document.getElementById('nome').value != '') {
      file.data[value[0]][value[1]][ind]['nome'] = document.getElementById('nome').value
    } else {
      count += 1
    }
    if (document.getElementById('numero').value != '') {
      file.data[value[0]][value[1]][ind]['numero'] = document.getElementById('numero').value
    } else {
      count += 1
    }
    if (document.getElementById('info').value != '') {
      file.data[value[0]][value[1]][ind]['info'] = document.getElementById('info').value
    } else {
      count += 1
    }
    input_refresh()
    if (count == 3) {
      return 'no_data'
    }
  },

  // move to top an element
  up: (ind) => {
    let value = window.document.getElementById('edit_' + ind).value.split('_?');
    if (ind != 0) {
      move_array(ind, 0, value)
    } else {
      return 'no_data'
    }
  },

  // move to bottom an element
  down: (ind) => {
    let value = window.document.getElementById('edit_' + ind).value.split('_?');
    if (ind != (file.data[value[0]][value[1]].length - 1)) {
      move_array(ind, 1, value)
    } else {
      return 'no_data'
    }
  },

  // make tabella with element
  render_tabella: () => {
    tabella()
    input_refresh()
  },

  /*
  when the input they are not empty, this function search in ALL "provincia" and "comune"
  these words. 
  In this mode, the element is not editable
   */
  search: () => {
    let to_find_key = ['nome', 'numero', 'info']
    let to_find_value = []

    for (let index = 0; index < to_find_key.length; index++) {
      const element = window.document.getElementById(to_find_key[index]).value
      if (element != '') {
        if (!(to_find_value.includes(element))) {
          to_find_value.push(element.toLowerCase())
        }
      }
    }

    let find = []

    Object.values(file.data).map((v, com) => Object.values(v).map(
      (v, tip) => Object.values(v).map(
        function (v) {
          const check = Object.values(v).map((e) => e.toLowerCase())
          for (let i = 0; i < to_find_value.length; i++) {

            for (let ind = 0; ind < check.length; ind++) {
              if (check[ind].includes(to_find_value[i])) {
                {
                  let push_data = {
                    "comune": Object.keys(file.data)[com],
                    "tipologia": Object.keys(Object.values(file.data)[com])[tip],
                    "data": v
                  }
                  console.log(push_data)
                  if (find.includes(push_data)) {

                  } else {
                    find.push(push_data)
                  }
                }
              }
            }
          }
        }
      )
    )
    )

    for (let index = 0; index < find.length; index++) {
      const element = find[index];
      let count = 0

      for (let i = 0; i < find.length; i++) {
        const e = find[i];
        if (element.data.nome == e.data.nome &
          element.data.numero == e.data.numero &
          element.data.info == e.data.info &
          element.comune == e.comune &
          element.tipologia == e.tipologia) {
          count += 1
        }
      }
      if (count > 1) {
        find.splice(index, 1)
      }
    }
    input_refresh()
    document.getElementById('tab').innerHTML = find.map((v, index) =>

      "<tr><td>{v}</td><td>{numero}</td><td>{info}</td><td>{edit}</td></tr>"
        .replaceAll('{v}', find[index].comune + '---' + find[index].data.nome)
        .replaceAll('{numero}', find[index].data.numero)
        .replaceAll('{info}', find[index].data.info)
        .replaceAll('{edit}', 'Non modificabile durante la ricerca')
    ).join(' ')
  },

  // When any <select> change, this function save the choice
  save_choice: (type, choice) => {
    if (type == 'comune') {
      store.data.comune = choice
    } else if (type == 'tipologia') {
      store.data.tipologia = choice
    }
  },

  restore: () => {
    restore()
  },
  
  // used to send message from "master.js" to "main.js"
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
}
);





