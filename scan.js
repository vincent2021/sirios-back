const fs = require('fs');
const path = require('path');
const mime = require('mime');

function rand(min, max) {
    const nb = Math.round(Math.random() * (max - min) + min);
    return nb;
}
const network = ['FROPS', 'INTRADEF', 'INTRACED'];
const author = ['Sophie Cabanes', 'Benoit Dorigny', 'Damien Sauget', 'Stéphane Madoeuf'];
let completed =  0;
let missing = 0;

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    try {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
        ? walkSync(path.join(dir, file), filelist)
        : filelist.concat({
            filename: file,
            filepath: path.join(dir, file),
            size: fs.statSync(path.join(dir, file)).size,
            mime: mime.lookup(file),
            type:  file.substr(file.lastIndexOf('.') + 1),
            title:  file.substr(0, file.lastIndexOf('.')),
            author: author[rand(0 , 3)],
            network: network[rand(0 , 2)],
            date: isNaN(file.substr(0, 8)) ? '' : file.substr(0, 8),
            date_modif: fs.statSync(path.join(dir, file)).mtime,
            info: file.split('_')
        });
        completed++;
      }
      catch(err) {
          console.log('Cannot access: ' + file + '\n' + err);
          missing++;
    }
  });
  return filelist;
}

root_folder = "/Users/vincent/edg-data/Sauvegarde\ Sharepoint\ Juin\ 2019/";
const data = JSON.stringify(walkSync(root_folder));
fs.writeFileSync('scan.json', data);
console.log("Index done: " + completed + " files (" + missing + " files missing)")