let hAndS = require('./hidenseek.js'),
    pokemon = require('./pokemon.js');

if (!process.argv[2]) {
  console.log(`node index hide path pokemons - используйте для того,
     чтобы спрятать в папке 'path' покемонов из 'pokemons'`);
  console.log(`node index seek path - используйте для того,
    чтобы найти в папке 'path' покемонов`);
}
else {
  if (!process.argv[3]){
    console.log("Нужен 'path'");
  }
  else {
    if (process.argv[2] == "hide"){
      if (!process.argv[4]){
        console.log("Нужен файл с покемонами");
      }
      else{
        let fs = require("fs");

        fs.readFile(process.argv[4], { encoding: 'utf-8'}, (err, text) => {
          if (err) console.log('Файл с покемонами не найден');
          let pokemons = require('./pokemon.json');

          pokemons.forEach(function(item, i, arr){
            arr[i] = new pokemon.pokemon(
              item.name, item.level
            );
          });

          hAndS.hide('.\\field\\', pokemons)
          .then((pokemons) => pokemons.show());
        });
      }
    }
    else {
      // console.log('hAndS', hAndS.seek('.\\field\\'));
      hAndS.seek('.\\field\\')
      .then((pokemons) => {
        pokemons.show()
      });
    }
  }
}
