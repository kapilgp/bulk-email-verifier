/**
 * Domain MX Record Verification Library
 * @created  August 23, 2016
 * @author Kapil Gupta <kapil.gp@gmail.com>
 * @license https://raw.githubusercontent.com/kapilgp/bulk-email-verifier/master/LICENSE
 */


//Require Modules
const dns = require('dns');

let verified = [];
let unverified = [];

const _isValidDomainMX = (domain) => {
	// Get the MX Records to find the SMTP server
	return new Promise((resolve, reject) => {
	    
	    dns.resolveMx(domain, (err, addresses) => {
	    	//console.log(domain, err, addresses);

	    	if (err || (typeof addresses === 'undefined')) {
	            unverified.push(domain);
	        } else if (addresses && addresses.length <= 0) {
	        	unverified.push(domain);
	        	console.log("invalid - No MX Records");
	        } else {
	        	//Valid Domain, MX Record Found
	        	verified.push(domain);
	        }
	        let stats = {verified: verified, unverified: unverified};
	        
	    	resolve(stats);
	    });	
	});
}

//Export Module
module.exports = {
	
	verifyDomainMX: (domains) => {
		verified = [];
		unverified = [];
		return domains.reduce((promise, domain) => {
	    	return promise.then(() => {
	    		//console.log(domain);
	            return _isValidDomainMX(domain);
	        });
	    }, Promise.resolve());
	}
}