var svm = require('node-svm');
var fs = require('fs');

// Initialize the total time taken and run count variables
let totalTime = 0;
let runCount = 0;
let confusionMatrixPrinted = false;

// Function to run the SVM training and prediction process
function runSVM() {
  // Data yang Diuji
  var normal = JSON.parse(fs.readFileSync('./Tins9600.json', 'utf8'));

  // Data Training
  fs.readFile('./TRNins9600.json', 'utf8', function (err, data) {
    data = JSON.parse(data);
    var newClf = svm.restore(data);
    let totalNormal = 0;
    let totalAbnormal = 0;
    let truePositives = 0;
    let falsePositives = 0;
    let trueNegatives = 0;
    let falseNegatives = 0;

    // Predict
    normal.forEach(function (ex) {
      var prediction = newClf.predictSync(ex[0]);
      let label = ex[1];

      if (prediction === 1 && label === 1) {
        truePositives += 1;
      } else if (prediction === 0 && label === 0) {
        trueNegatives += 1;
      } else if (prediction === 1 && label === 0) {
        falsePositives += 1;
      } else if (prediction === 0 && label === 1) {
        falseNegatives += 1;
      }

      (prediction) ? totalAbnormal += 1 : totalNormal += 1;
    });

    if (!confusionMatrixPrinted) {
      let accuracy = (truePositives + trueNegatives) / (normal.length);
      let precision = truePositives / (truePositives + falsePositives);
      let recall = truePositives / (truePositives + falseNegatives);
      let f1Score = 2 * (precision * recall) / (precision + recall);

      // Hasil Confusion Matrix
      console.log("Confusion Matrix:");
      console.log(`| Normal \t Abnormal |`);
      console.log(`| ${totalNormal} \t ${falseNegatives} |`);
      console.log(`| ${falsePositives} \t ${trueNegatives} |`);
      console.log("---------------------");
      console.log(`| ${totalNormal + falsePositives} \t ${truePositives + falseNegatives} |`);
      console.log("---------------------");
      console.log(`Accuracy: ${accuracy}`);
      console.log(`Precision: ${precision}`);
      console.log(`Recall: ${recall}`);
      console.log(`F1 Score: ${f1Score}`);
      console.log(`True Positives: ${truePositives}`);
      console.log(`False Positives: ${falsePositives}`);
      console.log(`True Negatives: ${trueNegatives}`);
      console.log(`False Negatives: ${falseNegatives}`);
      confusionMatrixPrinted = true;
    }

    var clf = new svm.CSVC();

    const startTime = process.hrtime();
    clf
      .train(normal)
      // Waktu proses predict
      .then(() => {
        const elapsedTime = process.hrtime(startTime);
        totalTime += elapsedTime[0] * 1000 + elapsedTime[1] / 1000000;
        runCount++
        
        if (runCount < 10) {
          runSVM();
        } else {
          const avgTime = totalTime / 10;
          console.log(`Average time taken: ${avgTime} ms.`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

// Start the SVM training and prediction process
runSVM();