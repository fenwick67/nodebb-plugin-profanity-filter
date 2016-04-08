const profanityUtil = require('profanity-util');
const profanityList = process.env.PROFANITY_FILTER ? process.env.PROFANITY_FILTER.split(','):null;//override for specific strings

var Plugin = {
    profanityHook:function(data,next){
        //console.log(data);
        if (!data){
            return next(null,data);//no data no profanity lol
        }
        //check content
        if (data.content){
            if(callbackOnProfanity(data.content,next,data)){
                return;
            };
        }
        //check title
        if (data.title){
            if(callbackOnProfanity(data.title,next,data)){
                return;
            };    
        }
        
        //check topic title
        if (data.topic && data.topic.title){
            if(callbackOnProfanity(data.topic.title,next,data)){
                return;
            }
        }
        //all ok I guess
        return next(null,data);
    }
};

/**
 * checkProfanity
 *  returns a list of profane words in the string
 * 
 * @param s: the String to search for profanity in
 * @returns: the array of bad words, or false if no profanity
 */
 
function checkProfanity(s){
    
    var list;
    if(profanityList){
        list = profanityUtil.check(s, profanityList);
    }else{
        list =  profanityUtil.check(s);
    }
     if (list.length > 0){
            return list;
        }else{
            return false;
    }
}

/**
 * callbackOnProfanity
 *  immediately call cb if s contains profanity, with an error message describing which words were not accepted
 * 
 * @param s: the String to search for profanity in
 * @returns: true if profanity was found and cb was called, false if not
 */
function callbackOnProfanity(s,cb,data){
    var list = checkProfanity(s);
    if(list){
        //console.log('found the following bad words: '+list.toString());
        cb(new Error('Your message contains the following restricted word(s): ' + list.toString() ),data);
        return true;
    }else{
        return false;
    }
}

module.exports = Plugin;
