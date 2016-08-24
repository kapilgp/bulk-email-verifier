/**
 * Domain MX Record Verification Library
 * @created  August 23, 2016
 * @author Kapil Gupta <kapil.gp@gmail.com>
 * @license https://raw.githubusercontent.com/kapilgp/bulk-email-verifier/master/LICENSE
 */


//Require Modules
const dns = require('dns');

let domainsStats = [];
const _isValidDomainMX = (domain) => {
	// Get the MX Records to find the SMTP server
	return new Promise((resolve, reject) => {
	    
	    dns.resolveMx(domain, (err, addresses) => {
	    	//console.log(domain, err, addresses);

	    	if (err || (typeof addresses === 'undefined')) {
	            domainsStats[domain] = 'invalid';
	        } else if (addresses && addresses.length <= 0) {
	            domainsStats[domain] = 'invalid - No MX Records';
	        } else {
	        	domainsStats[domain] = 'valid';
	        }

	    	resolve(domainsStats);
	    });	
	});
}

//Export Module
module.exports = {
	
	verifyDomainMX: (domains) => {
		domainsStats = [];
		return domains.reduce((promise, domain) => {
	    	return promise.then(() => {
	    		//console.log(domain);
	            return _isValidDomainMX(domain);
	        });
	    }, Promise.resolve());
	}
}