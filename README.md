Source files for el_tarjeton_2018
=====

## Preview

[You can find a preview of 'el_tarjeton_2018' here](https://La-Silla-Vacia.github.io/el_tarjeton_2018/)

![](https://raw.githubusercontent.com/La-Silla-Vacia/el_tarjeton_2018/master/screenshot.png)

## Data
Please link to any external data used, as well as scripts for cleaning and analyzing that data, all of which should live in the `/data` directory.

## Installation
First, make sure you have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/en/) installed on your operating system.

After cloning the repository run inside the directory:
```
yarn install
```

To start watching the project and opening in the browser run:
```
yarn start
```

To deploy to GitHub Pages run:
```
yarn run deploy
```

---

## Embeding on webpage
To embed on a webpage use this code:
```html
<!-- START OF OUR INTERACTIVE -->
<script type="text/javascript">
window.tarjetones_2018_data = {
  "dataUri": "https://lsv-candidatos-congreso-2018.firebaseio.com/data.json",
  "filters": [
               {
                 title: 'Género',
                 column: 'genero',
                 only: 'Mujer'
               },
               {
                 title: 'Profesión u oficio',
                 column: 'profesionUOficio'
               },
               {
                 title: 'Nivel de estudios',
                 column: 'nivelDeEstudios'
               },
               {
                 title: 'Sector del que viene',
                 column: 'sectorDelQueViene'
               },
               {
                 title: 'Experto en',
                 column: 'expertoEn'
               },
               {
                 title: 'Ha sido congresista',
                 column: 'haSidoCongresista'
               }
             ]
}
</script>
<div class="lsv-interactive" id="tarjetones_2018">
<img src="https://raw.githubusercontent.com/la-silla-vacia/lsv-interactive/master/misc/lsvi-loading.gif"
     alt="Interactive is loading" style="width:100%;max-width: 320px;margin: 4em auto;display: block;">
</div>
<script defer type="text/javascript" src="https://la-silla-vacia.github.io/el_tarjeton_2018__complete/script.js"></script>
<!-- END OF OUR INTERACTIE -->
```

You can remove the filters if you want, or add more columns. Make sure to 'camelcase' the column title from the spreadsheet. 

Optional is the `only` key. There you can say for example, only rows where the value is 'Mujer'. You can also provide an array with multiple values, for example `['Hombre', 'Mujer']`. 
If you pass the only key, then the filter will also be hidden.