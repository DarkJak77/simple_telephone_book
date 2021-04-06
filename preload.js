const { ipcRenderer, contextBridge } = require('electron')
const fs = require('fs');
const path = require('path')

const validChannels = ["toMain", "myRenderChannel"];

let json_path = ''

// Dev 1 == Activate
let dev = 0
if (dev == 0) {
  json_path = __dirname + '\\src\\json\\Province italiane.json'
} else {
  json_path = './src/json/Province italiane.json'
}

let file = {
  raw: '',
  data: '',
}

let store = {
  data: { "provincia": "Agrigento", "comune": "Agrigento", "tipologia": "ag" }
}

file.raw = fs.readFileSync(json_path);
file.data = JSON.parse(file.raw)

function tabella() {
  document.getElementById('tab').innerHTML = file.data[store.data.provincia][store.data.comune][store.data.tipologia].map((v, index) =>

    "<tr><td>{v}</td><td>{numero}</td><td>{info}</td><td>{edit}</td></tr>"
      .replaceAll('{v}', v['nome'])
      .replaceAll('{numero}', v['numero'])
      .replaceAll('{info}', v['info'])
      .replaceAll('{edit}', '<div id="btn"><button type="button" id="edit_{index}" value="{dati}" onclick={edit({index})}>Edit</button>' +
        '<div id="space"></div>' + '<button type="button" onclick={del({index})}>Delete</button><div id="space"></div><button onclick={down({index})}>▼</button>' +
        '<div id="space"></div><button onclick={up({index})}>▲</button></div>')
      .replaceAll('{dati}', store.data.provincia + '_?' + store.data.comune + '_?' + store.data.tipologia + '_?' + v['nome'] + '_?' +
        v['numero'] + '_?' + v['info'])
      .replaceAll('{index}', index)
  ).join(' ')
}

function input_refresh() {
  document.getElementById('input_refresh').innerHTML =
    '<input class="textTextBoxNoHeaderDisabled" value="" id="nome" placeholder="Nome"></input><input class="textTextBoxNoHeaderDisabled18fd588a" value="" id="numero" placeholder="Numero"></input><input class="textTextBoxNoHeaderDisabledd44008b2" value="" id="info" placeholder="Info"></input>'
}

function move_array(index, type, value) {
  let new_array = []

    const element = file.data[value[0]][value[1]][value[2]]

    if (type == 1) {
      for (let ind = 0; ind < file.data[value[0]][value[1]][value[2]].length; ind++) {
        if (ind == index){
          new_array.push(element[ind+1])
          new_array.push(element[ind])
          ind++
        } else {
          new_array.push(element[ind])
        }
      }
    }

    if (type == 0) {
      for (let inde = 0; inde < file.data[value[0]][value[1]][value[2]].length; inde++) {
        if (inde == index-1){
          new_array.push(element[inde +1])
          new_array.push(element[inde])
          inde++
        } else {
          new_array.push(element[inde])
        }
      }
    }

    file.data[value[0]][value[1]][value[2]] = new_array
}

contextBridge.exposeInMainWorld(
  "api", {
  auto: () => {
    window.addEventListener('DOMContentLoaded', () => {
      document.getElementById('province').innerHTML = Object.keys(file.data).map((v) => '<option value="{v}">{v}</option>'.replaceAll('{v}', v)).join(' '),
        document.getElementById('comune').innerHTML = Object.keys(file.data[store.data.provincia]).map((v) => '<option value="{v}">{v}</option>'.replaceAll('{v}', v)).join(' ')
      tabella()
    })
  },
  save_data: () => {
    let to_push = {
      "nome": document.getElementById('nome').value,
      "numero": document.getElementById('numero').value,
      "info": info = document.getElementById('info').value
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
      file.data[store.data.provincia][store.data.comune][store.data.tipologia].push(to_push)
    } else {
      return 'no_data'
    }

  },
  save_file: () => {
    let to_save_1 = JSON.stringify(file.data)
    fs.writeFileSync(json_path, to_save_1);
  },
  del: (ind) => {
    let value = window.document.getElementById('edit_' + ind).value.split('_?')
    file.data[value[0]][value[1]][value[2]].splice(ind, 1)
  },
  edit: (ind) => {
    let value = window.document.getElementById('edit_' + ind).value.split('_?')
    let count = 0
    if (document.getElementById('nome').value != '') {
      file.data[value[0]][value[1]][value[2]][ind]['nome'] = document.getElementById('nome').value
    } else {
      count += 1
    }
    if (document.getElementById('numero').value != '') {
      file.data[value[0]][value[1]][value[2]][ind]['numero'] = document.getElementById('numero').value
    } else {
      count += 1
    }
    if (document.getElementById('info').value != '') {
      file.data[value[0]][value[1]][value[2]][ind]['info'] = document.getElementById('info').value
    } else {
      count += 1
    }
    if (count == 3) {
      return 'no_data'
    }
  },
  up: (ind) => {
    let value = window.document.getElementById('edit_' + ind).value.split('_?');
    if (ind != 0) {
      move_array(ind, 0, value)
    } else {
      return 'no_data'
    }
  },
  down: (ind) => {
    let value = window.document.getElementById('edit_' + ind).value.split('_?');
    if (ind != (file.data[value[0]][value[1]][value[2]].length - 1)) {
      move_array(ind, 1, value)
    } else {
      return 'no_data'
    }
  },
  render_comune: () => {
    window.document.getElementById('comune').innerHTML = Object.keys(file.data[store.data.provincia]).map((v) => '<option value="{v}">{v}</option>'.replaceAll('{v}', v)).join(' ')
  },
  render_tabella: () => {
    tabella()
    input_refresh()
  },
  save_choice: (type, choice) => {
    if (type == 'provincia') {
      store.data.provincia = choice
      store.data.comune = Object.keys(file.data[store.data.provincia])[0]
    } else if (type == 'comune') {
      store.data.comune = choice
    } else if (type == 'tipologia') {
      store.data.tipologia = choice
    }
  },
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  /*
  on: (channel, callback) => {
    if (validChannels.includes(channel)) {
      // Filtering the event param from ipcRenderer
      const newCallback = (_, data) => callback(data);
      ipcRenderer.on(channel, newCallback);
    }
  },
  once: (channel, callback) => {
    if (validChannels.includes(channel)) {
      const newCallback = (_, data) => callback(data);
      ipcRenderer.once(channel, newCallback);
    }
  },
  removeListener: (channel, callback) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback);
    }
  },
  removeAllListeners: (channel) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel)
    }
  },
  */
}
);
