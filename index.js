/* Domain MX Verification & Email Verification */



module.exports = {
	verifyDomainsMX: require('./libs/domain-verify').verifyDomainMX,
	verifyEmails: require('./libs/email-verify').emailVerify
}