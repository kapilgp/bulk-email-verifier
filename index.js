/**
 * Domain MX Verification & Email Verification
 * @created  August 23, 2016
 * @author Kapil Gupta <kapil.gp@gmail.com>
 * @license https://raw.githubusercontent.com/kapilgp/bulk-email-verifier/master/LICENSE
 */

module.exports = {
	//Verify Multiple Domain MX Records
	verifyDomainsMX: require('./libs/domain-verify').verifyDomainMX,
	
	//Verify Multiple emails of a single domain
	verifyEmails: require('./libs/email-verify').emailVerify
}