process.on('exit',function(){
    console.log(arguments);
});
process.on('error',function(){
    console.log(arguments);
});

process.on('uncaughtException',function(){
    console.log(arguments);
});

setTimeout(function(){
    process.exit(1);
},1000);

