const fs = require('fs');
const mkdirp = require('mkdirp');

function randomDate() {
    const start = new Date(2017, 0, 1)
    const end = new Date()
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return year + month + day
}

function rand(min, max) {
    const nb = Math.round(Math.random() * (max - min) + min);
    return nb;
  }

const doc_ext = ['pdf', 'pptx', 'docx', 'xlsx'];
const img_ext = ['png', 'jpg', 'bmp'];
const classif = ['NP', 'DR', 'CF', 'SD'];
const orga = ['EMAA', 'EMA', 'EDG', 'CDEC', 'EMAT'];
const bur = ['BPLANS', 'BPSA', 'BORG', 'BOPS', 'BPFD'];
const ver = ['1.0', '1.1', '2', '5', ''];

function randomFile(type) {
    const name = randomDate() + '_' + classif[rand(0 , 3)] + '_' + orga[rand(0 , 4)] + '_' + bur[rand(0 , 4)];
    if (type == 'doc') {
        const titre = 'Presentation';
        const ver = doc_ext[rand(0 , 4)];
        const ext = doc_ext[rand(0 , 3)]; 
        return name + '_' + titre + '_' + ver + '.' + ext;
    } else if (type == 'img') {
        const titre = 'Carto';
        const ext = img_ext[rand(0 , 2)]; 
        return name + '_' + titre + '.' + ext;
    }
}

const root_folder = 'seed';
const network = ['FROPS', 'INTRADEF', 'INTRACED'];
const folder = ['BARKHANE', 'GPPO-PANDA', 'GPPO-OPX24', 'CPOIA', 'EDG', 'BMA']
const subfolder = ['00_J3', '01_J5', '02_J35', '03_J1'];
folder.forEach(function(folder) {
    mkdirp(root_folder + '/' + folder)
    subfolder.forEach(function(subfolder) {
        mkdirp(root_folder + '/' + folder + '/' + subfolder);
        mkdirp(root_folder + '/' + folder + '/' + subfolder + '/PUBLIC');
    });
});
function randFolder() {
    const path = network[rand(0 , 2)] + '/' + folder[rand(0 , 3)] + '/' + subfolder[rand(0 , 3)] + '/PUBLIC' ;
    return path
}

const bdd = [];

for (let i = 0; i < 500; i++) {
    const filename = randomFile('doc');
    const filepath = randFolder() + '/' + filename;
    const info = filename.split('_');
    const ob = {
        'filepath': filepath,
        'filename': filename,
        'info': info
    };
    bdd.push(ob);
}

for (let i = 0; i < 200; i++) {
    const filename = randomFile('doc');
    const filepath = randFolder() + '/' + filename;
    const info = filename.split('_');
    const ob = {
        'filepath': filepath,
        'filename': filename,
        'info': info
    };
    bdd.push(ob);
}

const data = JSON.stringify(bdd);
fs.writeFileSync('bdd.json', data);