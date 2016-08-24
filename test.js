
var verify = require('./index');

var domains = [
	'yahoomail.com', 
	'yahoo.com', 
	'gmail.com',
	'abc2.com',
	'rediff.com'
];

verify.verifyDomainsMX(domains).then(function(res) {
    console.log('Domains Status: ', res);

    var domains = [
		'google.com',
		'twitter.com'
	];

	verify.verifyDomainsMX(domains).then(function(res) {
	    console.log('Domains Status: ', res);
	});
});



// Testing
var domain = 'rediff.com';
var emails =  [
	'genius_p1jain@rediff.com',
	'genius_pjain@rediff.com',
	'vineet.vaishnav2@rediff.com',
	'divya.solanki@rediff.com'
];

// Testing
verify.verifyEmails(domain, emails, {}, function(err, data){
	console.log("Email verified", err, data);
});