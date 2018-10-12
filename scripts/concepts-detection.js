var products = require('../test/data/products.json');
var concepts = new (require('../lib/concepts'))();


concepts.detection(products).then(function(output){

  //
  // save for app
  concepts.save('../test/data/products-clarifai.json',output);

},function(error){
  console.log('----------------',concepts.predicts.length, error.message||error.txt||error);
  if(concepts.predicts.length>100){
    concepts.save('../test/data/products-clarifai.json',concepts.predicts);
  }
});


