/**
 * Library for Email Verification for single domain
 * @created  August 23, 2016
 * @author Kapil Gupta <kapil.gp@gmail.com>
 * @license https://raw.githubusercontent.com/kapilgp/bulk-email-verifier/master/LICENSE
 */


//Require Modules
const dns = require('dns');

const emailRcpt = (email, socket) => {

	setTimeout(function (email) {
		socket.write("RCPT TO:<" + email + ">\r\n", () => {
			//console.log("RCPT TO" + email); 
		});
	}.bind(this, email), 100);
}

const emailVerify = (domain, emails, options, callback) => {
	
	let verified = [];
	let unverified = [];

	// Default Values
    if (options && !options.port) options.port = 25;
    if (options && !options.sender) options.sender = "name@example.com";
    /*if (options && !options.timeout) options.timeout = 0;*/
    if (options && !options.fqdn) options.fqdn = "mail.example.com";
    if (options && (!options.ignore || typeof options.ignore !== "number")) options.ignore = false;


	// Get the MX Records to find the SMTP server
    dns.resolveMx(domain, (err, addresses) => {

    	if (err || (typeof addresses === 'undefined')) {
            callback(err, null);
        } else if (addresses && addresses.length <= 0) {
            //console.log("No MX Records")
            callback(null, { success: false, info: "No MX Records" });
        } else {
    		
        	// Find the lowest priority mail server
            let priority = 10000;
            let index = 0;
            for (let i = 0 ; i < addresses.length ; i++) {
                if (addresses[i].priority < priority) {
                    priority = addresses[i].priority;
                    index = i;
                }
            }
            

            let smtp = addresses[index].exchange;
            let stage = 0;

            let net = require('net');
            let socket = net.createConnection(options.port, smtp);
            let response = "";
            let completed = false;
            let calledback = false;
            let ended = false;

            let email = "";

            //Reverse Emails for popout, so sequence of email will be maintain 
            emails.reverse();

            socket.on('data', (data) => {
            	
                response += data.toString();
                completed = response.slice(-1) === '\n';

                if (completed) {
                    switch(stage) {
                        case 0: 
                        	if (response.indexOf('220') > -1 && !ended) {
                            	// Connection Worked
                            	socket.write("EHLO "+options.fqdn+"\r\n", () => { 
                                    stage++; response = ""; 
                                });
	                        } else{
	                            socket.end();
	                        }
                        break;

                        case 1: 
                        	if (response.indexOf('250') > -1 && !ended) {
	                            // Connection Worked
	                            socket.write("MAIL FROM:<"+options.sender+">\r\n", () => { 
                                    stage++; response = ""; 
                                });
		                    } else{
                                socket.end();
                            }
                        break;

                        case 2: 
                        	if (response.indexOf('250') > -1 && !ended) {
                                
                                //Popout one email and sent to socket RCPT command
                                email = emails.pop();
                                emailRcpt(email, socket);
					    		
					    		//Increment stage
                                stage++; response = "";
                            } else {
	                            socket.end();
	                    	}
	                    break;

                        case 3: 
                        	if (response.indexOf('250') > -1 || (options.ignore && response.indexOf(options.ignore) > -1)) {
                                //Push into verified list
                                verified.push(email);
                                //console.log(response + ' : ' +email);
                            } else {
                            	//Pushed into unverified list
                            	unverified.push(email);
                            }

                            //Check if still there are emails 
                            if (emails.length > 0) {
                            	//Again popout next email and send to RCPT Command
                            	email = emails.pop();
                                emailRcpt(email, socket);
					    		
                                response = "";
                            	//Set it to same stage
                            	stage = 3;
                            
                            } else {

                            	// IF there are no more emails, increase stage and send QUIT Command
                            	stage++;
                            	response = "";
                            	
                            	// close the connection cleanly.
                            	if(!ended) socket.write("QUIT\r\n");
                            }

                            break;
    
                        case 4:
                        	// close the connection cleanly.
                            socket.end();
                    }
                }
            }).on('connect', (data) => {

            }).on('error', (err) => {
                ended = true;
                if( !calledback ){
                    calledback = true;
                    callback( err, { 
                    	success: false, 
                    	verified: verified,
                        unverified: unverified 
                   	});
                }
            }).on('end', () => {
            	
                ended = true;
                if( !calledback ){
                    calledback = true;
                    callback(null, {
                        success: true,
                        verified: verified,
                        unverified: unverified 
                    });
                }
            });
    		
        }
    });
}

//Export Module
module.exports = {
	emailVerify: emailVerify
}