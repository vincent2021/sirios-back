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
const author = ['Sophie Cabanes', 'Benoit Dorigny', 'Damien Sauget', 'Stéphane Madoeuf'];
const titre_doc = ['Presentation', 'Compte-rendu', 'Suivi-des-operations', 'Fiche-de-synthese'];
const titre_img = ['Cartographie', 'Visualisation'];

function randomFile(type) {
    const name = randomDate() + '_' + classif[rand(0 , 3)] + '_' + orga[rand(0 , 4)] + '_' + bur[rand(0 , 4)];
    if (type == 'doc') {
        const titre = titre_doc[rand(0 , 3)];
        const version = ver[rand(0 , 4)];
        const ext = doc_ext[rand(0 , 3)]; 
        return name + '_' + titre + '_' + version + '.' + ext;
    } else if (type == 'img') {
        const titre = titre_img[rand(0 , 1)];
        const ext = img_ext[rand(0 , 2)]; 
        return name + '_' + titre + '.' + ext;
    }
}

const root_folder = 'seed';
const network = ['FROPS', 'INTRADEF', 'INTRACED'];
const folder = ['BARKHANE', 'GPPO-PANDA', 'GPPO-OPX24', 'CPOIA', 'EDG', 'BMA']
const subfolder = ['00_J3', '01_J5', '02_J35', '03_J1'];
// folder.forEach(function(folder) {
//     mkdirp(root_folder + '/' + folder)
//     subfolder.forEach(function(subfolder) {
//         mkdirp(root_folder + '/' + folder + '/' + subfolder);
//         mkdirp(root_folder + '/' + folder + '/' + subfolder + '/PUBLIC');
//     });
// });
function randFolder() {
    const path = network[rand(0 , 2)] + '/' + folder[rand(0 , 3)] + '/' + subfolder[rand(0 , 3)] + '/PUBLIC' ;
    return path
}

const bdd = [];

for (let i = 0; i < 800; i++) {
    const filename = randomFile('doc');
    const fulltitle = filename.substr(0, filename.lastIndexOf('.'));
    const type = filename.substr(filename.lastIndexOf('.') + 1);
    const filepath = randFolder() + '/' + filename;
    const info = fulltitle.split('_');
    const aut = author[rand(0 , 3)];    
    const net = filepath.substr(0, filepath.search('/'));
    const ret = {
        'filepath': filepath,
        'filename': filename,
        'info': {
            'date': info[0],
            'classif': info[1],
            'orga': info[2],
            'bureau': info[3],
            'titre': info[4],
            'version': info[5]
        },
        'author': aut,
        'network': net,
        'type': type
    };
    bdd.push(ret);
}

for (let i = 0; i < 200; i++) {
    const filename = randomFile('img');
    const fulltitle = filename.substr(0, filename.lastIndexOf('.'));
    const type = filename.substr(filename.lastIndexOf('.') + 1);
    const filepath = randFolder() + '/' + filename;
    const info = fulltitle.split('_');
    const aut = author[rand(0 , 3)];    
    const net = filepath.substr(0, filepath.search('/'));
    const ret = {
        'filepath': filepath,
        'filename': filename,
        'info': {
            'date': info[0],
            'classif': info[1],
            'orga': info[2],
            'bureau': info[3],
            'titre': info[4],
            'version': info[5]
        },
        'author': aut,
        'network': net,
        'type': type
    };
    bdd.push(ret);
}

const data = JSON.stringify(bdd);
fs.writeFileSync('bdd.json', data);