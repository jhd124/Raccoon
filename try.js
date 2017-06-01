var gm = require('gm');
var imageMagick = gm.subClass({imageMagick : true});
imageMagick("./raw/posters/poster1.jpg").resize(120).autoOrient()
.write('./raw/gmtry.jpg', function (err) {
	  if (!err) console.log(' hooray! ');
	  if(err) console.log(err);
});



