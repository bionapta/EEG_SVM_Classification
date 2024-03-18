var svm = require('node-svm');
var fs = require('fs');

var lengkap = fs.readFileSync('./GabungBrx9600.json', 'utf8');
lengkap = JSON.parse(lengkap)

var clf = new svm.CSVC();

// Measure start time
var startTime = process.hrtime();

clf
.train(lengkap)
.spread(function(trainedModel, trainingReport){
    // ...
    console.log(trainingReport);

    // Measure end time
    var endTime = process.hrtime(startTime);

    // Convert to milliseconds
    var trainingTime = endTime[0] * 1000 + endTime[1] / 1000000;

    console.log('Training time: ' + trainingTime.toFixed(3) + ' ms');

    var json = JSON.stringify(trainedModel, null, 2);
    fs.writeFile('TRNrbd600.json', json, 'utf8', function(err){
        console.log(err);
    });
});