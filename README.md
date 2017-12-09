# brsolab-process
Wrapper for Nodejs Child process library 
Uses the ES6 to make it simple the use of subprocess in nodeJS

This library contains two functions: spawn & exec
It's better to use spawn instead of exec when it's possible to avoid args escape problems

Those two functions use the some options as the original ones of nodejs. See the doc page at: https://nodejs.org/api/child_process.html

# spawn
```javascript
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
```

# exec
```javascript
/**
 * exec process
 * exec(cmd, [options, [processInitCallBack]])
 * spaw(cmd, [processInitCallBack])
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
```

# examples
```javascript
const { spawn, exec } = require('brsolab-process');
const fs  = require('fs');

exec('ls .').then( result => console.log(result) ).catch( error => console.error(error) );

// it's better to use "async" & "await"
(async function(){
  result  = await spawn('command', [args]);
  console.log(result);
  
  // pipe the output to a file
  await spawn('commande', [args], {stdio : ['pipe', fs.openSync('file.txt'), 'pipe']});
  
  // send messages to process
  var result = await spawn('cmd', [args], {options}, prcess => {
    // operations on prcess
    prcess.send({ foo: 'bar', baz: NaN });
  });
})();
```

