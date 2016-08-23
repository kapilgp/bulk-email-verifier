/**
 * Domain MX Record Verification
 */

let dns = require('dns');

let domainsStats = [];
let _isValidDomainMX = (domain) => {
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

module.exports = {
	
	verifyDomainMX: (domains) => {
		return domains.reduce((promise, domain) => {
	    	return promise.then(() => {
	    		//console.log(domain);
	            return _isValidDomainMX(domain);
	        });
	    }, Promise.resolve());
	}
}