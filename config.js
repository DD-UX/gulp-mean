// =================================================================
// Child processes doc: https://nodejs.org/api/child_process.html ==
// =================================================================
var exec = require('child_process').exec;

// =================================================================
// Config module export ============================================
// =================================================================
module.exports = {
	publicUrl: __dirname + '/public/',
  modulesUrl: __dirname + '/node_modules/',
	sourceUrl: __dirname + '/src/',
	database: 'mongodb://localhost:27017/gulp_mean',
  mailFrom: '', // `john@doe.com`
  mailTransporter: '', // `smtp://john%doe.com:<lepassword>@<smptprovider>.com`
	runCommand: runCommand
}

// =================================================================
// Command exec function ===========================================
// =================================================================
function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  }
}