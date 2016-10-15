let fs = require("fs"),
    pokemon = require("./pokemon.js");

let getRandomInt =  (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
},
createDir = (path) => {
  try{
    fs.accessSync(path, fs.F_OK);
  }
  catch(e){
     fs.mkdirSync(path);
   }
},
showFile = (file) => {
  return new Promise((resolve,reject) => {
    let text = fs.readFileSync(file, { encoding: 'utf-8'}),
        new_pokemons = text.split('\n'),
        pokemons = new pokemon.pokemonList();

    for(let row of new_pokemons){
      if(row){
        let data = row.split('|'),
            new_pokemon = new pokemon.pokemon(data[0], parseInt(data[1]));

        pokemons.push(new_pokemon);
      }
    }
    fs.unlink(file);
    resolve(pokemons);
  });
},
showFiles = (files, newPath) => {
  let promises = [];

  for (let file of files){
    promises.push(showFile(newPath +'\\'+ file));
  }

  return Promise.all(promises);
},
createFile = (newPath, new_pokemon) => {
  return new Promise((resolve, reject) => {
      let file = fs.appendFileSync(
        `${newPath}\\pokemon.txt`,
        `${new_pokemon.name}|${new_pokemon.level}\n`
      );

      resolve();
  });
},
createDirForFile = (newPath, new_pokemons, i, keys, paths) => {
  let promises = [];
  createDir(newPath);

  for (let j=0; j<paths.length; j++){
    if(i == paths[j]){
      let pokemons = new pokemon.pokemonList();

      promises.push(createFile(newPath, new_pokemons[keys[j]])
        .then(() => {
          pokemons.push(new_pokemons[keys[j]]);
          return(pokemons);
        })
      )
    }
  }

  return Promise.all(promises);
},
updatePokemonList = (values) => {
  let pokemons = new pokemon.pokemonList();

  for(let val of values) {
    pokemons.push(...val);
  }

  return pokemons;
};

module.exports.hide = (path, pokemonList) => {
	let number = pokemonList.length>=3?3:pokemonList.length,
			keys = [],
			paths = [],
      promises = [],
      returnedList = new pokemon.pokemonList(),
			file;

  for(let i = 0; i < number; i++){
		keys.push(getRandomInt(0, pokemonList.length-1));
		paths.push(getRandomInt(1, pokemonList.length));
	}

  createDir(path);

	for(let i = 1; i <= 10; i++ ){
		let newPath = path + (i==10?i.toString():'0'+i);

    promises.push(createDirForFile(newPath, pokemonList, i, keys, paths)
    .then(values => {
      return updatePokemonList(values);
    }));
	}

  return Promise.all(promises).then(values => {
    return updatePokemonList(values);
  });
}

module.exports.seek = (path) => {
    let tenDirs = fs.readdirSync(path),
        promises = [];

    for (let file of tenDirs){
      let newPath = path + file,
          files = fs.readdirSync(newPath);

      promises.push(showFiles(files, newPath)
      .then(values => {
        return updatePokemonList(values);
      }));
    }

    return Promise.all(promises).then(values => {
      return updatePokemonList(values);
    });
}
