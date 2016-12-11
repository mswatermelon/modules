let fs = require("fs"),
    pokemon = require("./pokemon.js");

let getRandomInt =  (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
},
createDir = (path) => {
  return new Promise((resolve,reject) => {
    fs.access(path, fs.F_OK, (err) => {
      if (err) {
        fs.mkdir(path, (err) => {
          if (err) return reject(err);

          resolve();
        });
      }

      resolve();
    });
  });
},
showFile = (file) => {
  return new Promise((resolve,reject) => {
    fs.readFile(file, { encoding: 'utf-8'}, (err, text) => {
      if (err) return reject(err);
      let new_pokemons = text.split('\n'),
          pokemons = new pokemon.pokemonList();

      for(let row of new_pokemons){
        if(row){
          let data = row.split('|'),
              new_pokemon = new pokemon.pokemon(data[0], parseInt(data[1]));

          pokemons.push(new_pokemon);
        }
      }
      fs.unlink(file, (err) => {
        resolve(pokemons);
      })
    });
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
      let file = fs.appendFile(
        `${newPath}\\pokemon.txt`,
        `${new_pokemon.name}|${new_pokemon.level}\n`,
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
  });
},
createDirForFile = (newPath, new_pokemons, i, keys, paths) => {
  return new Promise((resolve, reject) => {
    let promises = [];

    createDir(newPath).then(() => {
      paths.forEach(function(item, j){
        if(i == item){
          let pokemons = new pokemon.pokemonList();

          promises.push(createFile(newPath, new_pokemons[keys[j]])
            .then(() => {
              pokemons.push(new_pokemons[keys[j]]);
              return(pokemons);
            })
          )
        }
      });

      resolve(Promise.all(promises));
    });
  });
},
updatePokemonList = (values) => {
  let pokemons = new pokemon.pokemonList();

  for(let val of values) {
    pokemons.push(...val);
  }

  return pokemons;
},
createRandomList = (start, end, number) => {
  let arr = [];

  for(let i = 0; i < number;){
    let val = getRandomInt(start, end);

    if (arr.indexOf(val) == -1) {
      arr.push(val);
      i++;
    }
  }

  return arr;
};


module.exports.hide = (path, pokemonList) => {
  return new Promise((resolve, reject) => {
  	let number = pokemonList.length>=3?3:pokemonList.length,
  			keys = createRandomList(0, pokemonList.length-1, number),
  			paths = createRandomList(1, pokemonList.length, number),
        promises = [],
        returnedList = new pokemon.pokemonList(),
  			file;

    createDir(path).then(() => {
    	for(let i = 1; i <= 10; i++ ){
    		let newPath = path + (i==10?i.toString():'0'+i);

        promises.push(createDirForFile(newPath, pokemonList, i, keys, paths)
        .then(values => {
          return updatePokemonList(values);
        }));
    	}

      resolve(Promise.all(promises).then(values => {
          return updatePokemonList(values);
      }));
    });
  });
}

let readDir = (path) => {
  return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (err) return reject(err);

        resolve(files);
      })
  });
};

let getAllPromises = (path) => {
  return new Promise((resolve, reject) => {
    let promises = [];
    let promises2 = [];

    readDir(path).then((tenDirs) => {
      for (let file of tenDirs){
        let newPath = path + file;

        promises2.push(readDir(newPath).then((files) => {
          promises.push(showFiles(files, newPath)
          .then(values => {
            return updatePokemonList(values);
          }));
        })
      );
      }
      Promise.all(promises2).then(() => {
        resolve(promises);
      })
    });
  });
};

module.exports.seek = (path) => {
  return new Promise((resolve, reject) => {
    getAllPromises(path).then((promises) => {
      return Promise.all(promises).then(values => {
        resolve(updatePokemonList(values));
      });
    });
  });
}
