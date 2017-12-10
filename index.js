/**
 * BRSOLAB <contact@brsolab.com> (brsolab.com)
 * MIT Licence.
 */
'use strict';

const { spawn, exec }	= require('child_process');

module.exports = {
	spawn	: spawnFx,
	exec	: execFx,
	escape	: escapeArgs
};

const EMPTY_OBJ	= {};

/**
 * spawn process
 * spaw(cmd, [args, [options, [processInitCallBack]]])
 * spaw(cmd, [args, [processInitCallBack]])
 * @param  {string} command The command to run
 * @param  {Array} args    List of string arguments
 * @param  {Object} options
 *         timeout{number}		: process execution timeout in ms 
 *         cwd	{String}		: Current working directory of the child process
 *         env	{Object}		: Environment key-value pairs
 *         argv0{String}		: Explicitly set the value of argv[0] sent to the child process. This will be set to command if not specified.
 *         stdio{Array | String}: Child's stdio configuration
 *         detached{boolean}	: Prepare child to run independently of its parent process.
 *         uid	{number}		: Sets the user identity of the process
 *         gid	{number}		: Sets the group identity of the process
 *         shell{boolean|string}: If true, runs command inside of a shell. Uses '/bin/sh' on UNIX, and process.env.ComSpec on Windows. A different shell can be specified as a string.
 * @return {Promise}
 */
function spawnFx(command, args, options, processInitCallBack){
	var prcess, data = '', error = '', spawnError;
	// init args
		if(typeof options == 'function'){
			processInitCallBack	= options;
			options	= EMPTY_OBJ;
		}
	// create process
		return new Promise((resolve, reject) => {
			// timeout
				if(options && options.timeout)
					setTimeout(()=>{
						try{
							prcess.kill(9);
							reject({error: 'process timeout', timeout: options.timeout, exitCode: -1});
						}catch(e){
							reject({error: e, exitCode: -2});
						}
					}, options.timeout);
			// process
			prcess	= spawn(command, args, options);
			// process response
			prcess.stdout && prcess.stdout.on('data', d => { data	+= d.toString('utf8'); });
			prcess.stderr && prcess.stderr.on('data', d => { error	+= d.toString('utf8'); });
			prcess.on('error', err => {
				if(err.code === ''){
					console.log('==== ino ERROR');
				} else
					spawnError = err
			});
			prcess.on('close', exitCode => {
				if(exitCode){
					// if windows bug with spawn
					if(spawnError && spawnError.code === 'ENOENT'){
						command	= command + ' ' + escapeArgs(args);
						console.warn('BRSOLAB>> spawn fails, use exec instead: ', command);
						resolve(execFx(command, options, processInitCallBack));
					} else{
						reject({exitCode, error, spawnError, data, command, args});
					}
				}
				else{
					resolve(data);
				}
			});
			// user specified process init
			if(processInitCallBack)
				processInitCallBack.call(prcess, prcess);
		});
}

/** exec command, recommanded to use spawn instead */
function execFx(command, options, processInitCallBack){
	var prcess, execError;
	// init args
		if(typeof options == 'function'){
			processInitCallBack	= options;
			options	= EMPTY_OBJ;
		}
	// execute the command
		return new Promise((resolve, reject) => {
			prcess	= exec(command, options, (error, stdout, stderr) => {
				if(typeof stdout != 'string') stdout	= stdout.toString('utf8');
				if(error){
					if(typeof stderr != 'string') stderr	= stderr.toString('utf8');
					reject({error, execError, stdout, stderr, command});
				}
				else		resolve(stdout);
			});
			prcess.on('error', err => { execError = err });
			// user specified process init
			if(processInitCallBack)
				processInitCallBack.call(prcess, prcess);
		});
}

/** escape arguments for exec command */
function escapeArgs(args){
	return args.map(s => {
		if(/[^a-z0-9_\/:=-]/i.test(s)){
			s = "'" + s.replace(/'/g, "'\\''") + "'";
			s = s.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
					.replace(/\\'''/g, "\\'" ); // remove non-escaped single-quote if there are enclosed between 2 escaped
		}
		return s;
	}).join(' ');
}