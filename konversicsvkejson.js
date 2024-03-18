const csvFilePath='./rbd600.csv'
const csv=require('csvtojson')
let fs = require('fs');
csv({
    delimiter:';'
})
.fromFile(csvFilePath)
.then((jsonObj)=>{
   
    let hasil =[]
    for(let i =0; i < jsonObj.length; i++){
        // hasil.push()
        let temp =[]
        let temp2 = []
        for (let property in jsonObj[i]) {
            // console.log(`${property}: ${jsonObj[i][property]}`);
            jsonObj[i][property] = jsonObj[i][property].replace('.', '');
            jsonObj[i][property] = jsonObj[i][property].replace(',', '.');
            temp.push(Number(jsonObj[i][property]))
          }
          temp2.push(temp);
          //0 normal, 1 abnormal
          temp2.push(1);
          hasil.push(temp2);
    }
    console.log(hasil);
    var json = JSON.stringify(hasil, null, 2);
    fs.writeFile('Brbd600.json', json, 'utf8', function(err){
        console.log(err);
    });
})