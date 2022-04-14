# simple_telephone_book

## Table of Contents
1. [General Info](#general-info)
2. [Attention](#attention)
3. [Usage](#usage)
4. [License](#license)

## GENERAL INFO
- ITA - 
> Rubrica scritta in Electron, testata su sistema windows 1064 bit e windows 7 32 bit.

- ENG - 
> Address book written in Electron, tested on windows 1064 bit and windows 7 32 bit systems.

## ATTENTION
- ITA - 
> Questo programma nasce come esercizio nel tentativo di approcciarmi nel migliore dei modi
> a questo Framework

- ENG - 
> This program was born as an exercise in an attempt to approach myself in the best way
> to this Framework

## USAGE

- ITA - 
* INSERIMENTO
> E' possibile inserire i valori compilando gli i riquadri 
> "nome" - "numero" - "info" ( basta anche uno solo di questi )
> e cliccare sul tasto "salva"

* RICERCA
> E' possibile ricercare inserendo il nome del luogo ( primo riquadro a
> sinistra ), oppure basta inserire un valore da cercare e cliccare sul tasto "cerca"

* MODIFICA
> E' possibile modificare i valori già inseriti compilando i riquadri
> "nome" - "numero" - "info" e cliccare sul tasto modifica
> PS: non è possibile cambiare "luogo", bisogna cancellare e inserire di nuovo

* PREDEFINITO E TIPOLOGIA - PRECISAZIONI
> Essendo un lavoro strettamente personale e non pensato per una divulgazione
> la ricerca prefedinita è modificabile solo da codice, idem per le tipologie

* FILE RUBRICA JSON
> Il file json è formato nel seguente modo:
```json
{
    "Comune X":  
    {
            "ag":[
                {
                    "nome":"TEST",
                    "numero":"0123456789",
                    "info":"TEST"
                    }
            ],
            "fp":[],
            "ip":[],
            "co":[],
            "ot":[]
    }
}
```

- ENG - 
* INSERTION
> It is possible to insert the values ​​by filling in the boxes
> "name" - "number" - "info" (even one of these is enough)
> and click on the "save" button

* RESEARCH
> It is possible to search by entering the name of the place (first box a
> left), or just enter a value to search for and click on the "search" button

* MODIFICATION
> It is possible to modify the values ​​already entered by filling in the boxes
> "name" - "number" - "info" and click on the edit button
> PS: it is not possible to change "place", you have to delete and enter again

* DEFAULT AND TYPE - DETAILS
> Being a strictly personal work and not intended for disclosure
> the pre-defined search can only be modified from the code, the same for the types

* PHONE BOOK JSON
> The json file is formed as follows:

## License
[MIT](https://choosealicense.com/licenses/mit/)