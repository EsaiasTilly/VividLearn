$(function() { // Run This On Page Load
    let codeBlocks = $('code.block').get(); // Get All Code Blocks
    codeBlocks.forEach((codeBlock) => { // Loop Through All Code Blocks
        if($(codeBlock).attr('lang') == 'css') $(codeBlock).html(cParseCSS(cParseUniversal(cParsePrepare($(codeBlock).text())))); // Parse CSS Code Blocks
        if($(codeBlock).attr('lang') == 'js') $(codeBlock).html(cParseJS(cParseObject(cParseUniversal(cParsePrepare($(codeBlock).text()))))); // Parse JS Code Blocks
    });

    let codeLines = $('code.line').get(); // Get All Code Lines
    codeLines.forEach((codeLine) => { // Loop Through All Code Lines
        if($(codeLine).attr('lang') == 'css') $(codeLine).html(cParseCSS(cParseUniversal($(codeLine).text()))); // Parse CSS Code Line
        if($(codeLine).attr('lang') == 'js') $(codeLine).html(cParseJS(cParseObject(cParseUniversal($(codeLine).text())))); // Parse JS Code Line
    });
});

// Prepare Codeblock Text
function cParsePrepare(text) {
    let lines = text.split("\n"); // Split Text Into Lines

    let charFound = false; // Indicate If Any Character Has Been Found Yet
    while(!charFound) { // Loop Until A Character Is Found
        for(let i = 0; i < lines.length; i++) { // Loop Through All Lines
            lines[i] = lines[i].substr(1); // Remove The First Character On The Line
            if(lines[i].length == 0 && (i == 0 || i == lines.length - 1)) { lines.splice(i, 1); i--; } // Remove Line If It's Empty And In The Beginning Or End
            else if(lines[i].substr(0, 1) != ' ' && lines[i].length != 0) charFound = true; // Check If The Next Character Is Not A Space
        }
    }
    return lines.join("\n"); // Join All Lines Together And Return As A Text
}

// Parse A Universal Code
function cParseUniversal(text) {
    let lines = text.split("\n"); // Split Text Into Lines
    let comment = false; // Indicate If A Comment Is Ongoing
    let string = false; // Indicate If A String Is Ongoing
    for(let i = 0; i < lines.length; i++) { // Loop Through All Lines
        // Replace All Four Space Tabs With Tab Tags In The Beginning
        while(lines[i].cParseReplace('<tab></tab>', '').indexOf('    ') == 0)
            lines[i] = lines[i].replace('    ', '<tab></tab>');
        
        // Loop Until No More Comments Are Found
        while(lines[i].cParseContains('/*', '<cmt>/*') || lines[i].cParseContains('*/', '*/</cmt>')) {
            // Check For Comment Start If There Isn't An Ongoing Comment
            if(lines[i].indexOf('/*') != -1 && !comment) {
                lines[i] = lines[i].replace('/*', '<cmt>/*'); // Add A Comment Tag At The Start Of A Comment
                comment = true; // Set The Comment To Be Ongoing
            }

            // Check For Comment End If There Is An Ongoing Comment
            if(lines[i].indexOf('*/') != -1 && comment) {
                lines[i] = lines[i].replace('*/', '*/</cmt>'); // Add An Ending Comment Tag At The End Of A Comment
                comment = false; // Set The Comment To Be Stopped
            }
        }
        
        // Loop Through All Characters On Line
        for(let x = 0; x < lines[i].length; x++) {
            // Start Single Quote String
            if(lines[i][x] == '\'' && !string) {
                lines[i] = lines[i].cParseAdd('<str>', x); // Add The <Str> String Tag To The Start Of The String
                x += 5; string = '\''; // Skip The <Str> String Tag And Set String To Be An Active Single Quote
                continue;
            }

            // End Single Quote String
            if(lines[i][x] == '\'' && string == '\'') {
                lines[i] = lines[i].cParseAdd('</str>', x + 1); // Add The <Str> String Tag To The Start Of The String
                x += 6; string = false; // Skip The </Str> Ending String Tag And Set Deactivate The String
                continue;
            }

            // Start Double Quote String
            if(lines[i][x] == '"' && !string) {
                lines[i] = lines[i].cParseAdd('<str>', x); // Add The <Str> String Tag To The Start Of The String
                x += 5; string = '"'; // Skip The <Str> String Tag And Set String To Be An Active Single Quote
                continue;
            }

            // End Double Quote String
            if(lines[i][x] == '"' && string == '"') {
                lines[i] = lines[i].cParseAdd('</str>', x + 1); // Add The <Str> String Tag To The Start Of The String
                x += 6; string = false; // Skip The </Str> Ending String Tag And Set Deactivate The String
                continue;
            }
            //if(lines[i][x] == '\'' || lines[i][x] == '"') console.log(lines[i][x]);
        }

        // Add A Break On All Lines But The Last
        if(i < lines.length - 1) lines[i] += '<br>';
    }
    return lines.join("\n"); // Return All Lines Joined Together As String
}

// Parse A CSS Code
function cParseCSS(text) {
    let lines = text.split("\n"); // Split Text Into Lines
    let levels = 0; // Indicates How Many Levels Deep We Are Currently
    for(let i = 0; i < lines.length; i++) { // Loop Through All Lines
        // Look For Classnames And Ids
        let nameIndex = 0; // Index On The Current Line From Which To Look For Classnames And Ids
        let maxIndex = lines[i].length; // The Maximum Index To Look Until
        if(lines[i].indexOf('{') != -1) maxIndex = lines[i].indexOf('{'); // If There Is An Open Curly Bracket, Then Stop At That
        while(lines[i].substr(nameIndex, maxIndex - nameIndex).match(/\.-?[_a-z]+[_a-z0-9-]*|#-?[_a-z]+[_a-z0-9-]*/gi) && levels == 0) {
            let foundName = lines[i].substr(nameIndex, maxIndex - nameIndex).match(/\.-?[_a-z]+[_a-z0-9-]*|#-?[_a-z]+[_a-z0-9-]*/gi)[0];
            let startIndex = lines[i].indexOf(foundName, nameIndex);
            let endingIndex = startIndex + foundName.length + 6;
            lines[i] = lines[i].cParseAdd(foundName.indexOf('.') == 0 ? '<nmcl>' : '<nmid>', startIndex);
            lines[i] = lines[i].cParseAdd(foundName.indexOf('.') == 0 ? '</nmcl>' : '</nmid>', endingIndex);
            nameIndex = endingIndex + 7;
            maxIndex += 6 + 7;
        }

        // Look For Hexadecimal Colors
        let hexIndex = 0; // Index On The Current Line From Which To Look For Hexadeciaml Colors
        if(lines[i].indexOf(':') != -1) hexIndex = lines[i].indexOf(':'); // Start Looking After Colons
        if(lines[i].indexOf('{') != -1) hexIndex = lines[i].indexOf('{'); // Start Looking After Curly Brackets
        while(lines[i].substr(hexIndex).match(/#[0-9a-f]{6}|#[0-9a-f]{3}/gi)) { // Loop Until No More Hex Color Is Found
            let foundHexColor = lines[i].substr(hexIndex).match(/#[0-9a-f]{6}|#[0-9a-f]{3}/gi)[0]; // Get The Found Hex Color String
            let startIndex = lines[i].indexOf(foundHexColor, hexIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundHexColor.length + 7; // Get The Ending Index Of The Hex Color
            lines[i] = lines[i].cParseAdd('<const>', startIndex); // Add A <Const> Constant Tag At The Start Of The Hex Color
            lines[i] = lines[i].cParseAdd('</const>', endingIndex); // Add An </Const> Ending Constant Tag At The Start Of The Hex Color
            hexIndex = endingIndex + 8; // Set The Hex Index To Be The Ending Index Plus 8
        }

        // Look For RGB Colors
        let rgbIndex = 0;
        let rgbRegex = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)|rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
        if(lines[i].indexOf(':') != -1) rgbIndex = lines[i].indexOf(':'); // Start Looking After Colons
        if(lines[i].indexOf('{') != -1) rgbIndex = lines[i].indexOf('{'); // Start Looking After Curly Brackets
        while(lines[i].substr(rgbIndex).match(rgbRegex)) { // Loop Until No More Hex Color Is Found
            let foundHexColor = lines[i].substr(rgbIndex).match(rgbRegex)[0]; // Get The Found Hex Color String
            let startIndex = lines[i].indexOf(foundHexColor, rgbIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundHexColor.length + 7; // Get The Ending Index Of The Hex Color
            lines[i] = lines[i].cParseAdd('<const>', startIndex); // Add A <Const> Constant Tag At The Start Of The Hex Color
            lines[i] = lines[i].cParseAdd('</const>', endingIndex); // Add An </Const> Ending Constant Tag At The Start Of The Hex Color
            rgbIndex = endingIndex + 8; // Set The RGB Index To Be The Ending Index Plus 8
        }

        // Look For RGB Colors
        let rgbaIndex = 0;
        let rgbaRegex = /rgba\((\d{1,3}),(.{0,1})(\d{1,3}),(.{0,1})(\d{1,3})(.{0,9})\)/;
        if(lines[i].indexOf(':') != -1) rgbaIndex = lines[i].indexOf(':'); // Start Looking After Colons
        if(lines[i].indexOf('{') != -1) rgbaIndex = lines[i].indexOf('{'); // Start Looking After Curly Brackets
        while(lines[i].substr(rgbaIndex).match(rgbaRegex)) { // Loop Until No More Hex Color Is Found
            let foundHexColor = lines[i].substr(rgbaIndex).match(rgbaRegex)[0]; // Get The Found Hex Color String
            let startIndex = lines[i].indexOf(foundHexColor, rgbaIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundHexColor.length + 7; // Get The Ending Index Of The Hex Color
            lines[i] = lines[i].cParseAdd('<const>', startIndex); // Add A <Const> Constant Tag At The Start Of The Hex Color
            lines[i] = lines[i].cParseAdd('</const>', endingIndex); // Add An </Const> Ending Constant Tag At The Start Of The Hex Color
            rgbaIndex = endingIndex + 8; // Set The RGB Index To Be The Ending Index Plus 8
        }

        // Look For Units
        let unitIndex = 0;
        let unitRegex = /((\d{1,99})|(\d{1,99})\.(\d{1,99}))(em|px|\%|cm|mm|in|pt|pc|ex)/gi;
        if(lines[i].indexOf(':') != -1) unitIndex = lines[i].indexOf(':'); // Start Looking After Colons
        if(lines[i].indexOf('{') != -1) unitIndex = lines[i].indexOf('{'); // Start Looking After Curly Brackets
        while(lines[i].substr(unitIndex).match(unitRegex)) { // Loop Until No More Hex Color Is Found
            let foundHexColor = lines[i].substr(unitIndex).match(unitRegex)[0]; // Get The Found Hex Color String
            let startIndex = lines[i].indexOf(foundHexColor, unitIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundHexColor.length + 7; // Get The Ending Index Of The Hex Color
            lines[i] = lines[i].cParseAdd('<const>', startIndex); // Add A <Const> Constant Tag At The Start Of The Hex Color
            lines[i] = lines[i].cParseAdd('</const>', endingIndex); // Add An </Const> Ending Constant Tag At The Start Of The Hex Color
            unitIndex = endingIndex + 8; // Set The RGB Index To Be The Ending Index Plus 8
        }

        // Look For Properties
        let propertyIndex = 0;
        let propertyRegex = /([a-z0-9\-]{1,99})\:/gi;
        if(lines[i].indexOf('{') != -1) propertyIndex = lines[i].indexOf('{'); // Start Looking After Curly Brackets
        while(lines[i].substr(propertyIndex).match(propertyRegex)) { // Loop Until No More Hex Color Is Found
            let foundHexColor = lines[i].substr(propertyIndex).match(propertyRegex)[0]; // Get The Found Hex Color String
            let startIndex = lines[i].indexOf(foundHexColor, propertyIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundHexColor.length + 6; // Get The Ending Index Of The Hex Color
            lines[i] = lines[i].cParseAdd('<prop>', startIndex); // Add A <Const> Constant Tag At The Start Of The Hex Color
            lines[i] = lines[i].cParseAdd('</prop>', endingIndex); // Add An </Const> Ending Constant Tag At The Start Of The Hex Color
            lines[i] = lines[i].cParseReplace(':</prop>', '</prop><colon>:</colon>');
            propertyIndex = endingIndex + 8; // Set The RGB Index To Be The Ending Index Plus 8
        }

        // Look For Urls
        let urlIndex = 0;
        let urlRegex = /url\((.{1,999})\)/gi;
        if(lines[i].indexOf(':') != -1) urlIndex = lines[i].indexOf(':'); // Start Looking After Colons
        if(lines[i].indexOf('{') != -1) urlIndex = lines[i].indexOf('{'); // Start Looking After Curly Brackets
        while(lines[i].substr(urlIndex).match(urlRegex)) { // Loop Until No More Hex Color Is Found
            let foundHexColor = lines[i].substr(urlIndex).match(urlRegex)[0]; // Get The Found Hex Color String
            let startIndex = lines[i].indexOf(foundHexColor, urlIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundHexColor.length + 7; // Get The Ending Index Of The Hex Color
            lines[i] = lines[i].cParseAdd('<const>', startIndex); // Add A <Const> Constant Tag At The Start Of The Hex Color
            lines[i] = lines[i].cParseAdd('</const>', endingIndex); // Add An </Const> Ending Constant Tag At The Start Of The Hex Color
            //lines[i] = lines[i].cParseReplace(':</prop>', '</prop><colon>:</colon>');
            urlIndex = endingIndex + 8; // Set The RGB Index To Be The Ending Index Plus 8
        }

        // Look For Elements
        let elementIndex = 0;
        let elementRegex = /([a-z0-9\_]{1,99})(.{0,1}){/gi;
        while(lines[i].substr(elementIndex).match(elementRegex) && (elementIndex < lines[i].indexOf('{') && lines[i].indexOf('{') >= 0)) {
            let foundHexColor = lines[i].substr(elementIndex).match(elementRegex)[0];
            let startIndex = lines[i].indexOf(foundHexColor, elementIndex);
            let endingIndex = startIndex + foundHexColor.length + 4;
            lines[i] = lines[i].cParseAdd('<nmcl>', startIndex);
            lines[i] = lines[i].cParseAdd('</nmcl>', endingIndex);
            elementIndex = endingIndex + 8;
        }

        // Look For At-Rules
        let atRuleIndex = 0;
        let atRuleRegex = /@([a-z0-9\_\-]{1,99})(.{0,999}){/gi; // <---- FIX THIS!!!
        while(lines[i].substr(atRuleIndex).match(atRuleRegex) && (atRuleIndex < lines[i].indexOf('{') && lines[i].indexOf('{') >= 0)) {
            let foundHexColor = lines[i].substr(atRuleIndex).match(atRuleRegex)[0];
            let startIndex = lines[i].indexOf(foundHexColor, atRuleIndex);
            let endingIndex = startIndex + foundHexColor.length + 4;
            lines[i] = lines[i].cParseAdd('<nmcl>', startIndex);
            lines[i] = lines[i].cParseAdd('</nmcl>', endingIndex);
            atRuleIndex = endingIndex + 8;
        }

        // Add All Opening Brackets
        let openBrackets = lines[i].match(/[{]{1}/gi);
        if(openBrackets) levels += openBrackets.length;

        // Remove All Closing Brackets
        let closedBrackets = lines[i].match(/[}]{1}/gi);
        if(closedBrackets) levels -= closedBrackets.length;
    }
    return lines.join("\n"); // Return All Lines Joined Together As String
}

// Parse A Object-oriented Code
function cParseObject(text) {
    let lines = text.split("\n"); // Split Text Into Lines
    let levels = 0; // Indicates How Many Levels Deep We Are Currently
    for(let i = 0; i < lines.length; i++) { // Loop Through All Lines
        // Look For Variable Declarations
        let varDeclarationIndex = 0;// TEST FOR GIT
        let varDeclarationRegex = /([a-z0-9]{1,99}) ([a-z0-9_-]{1,99})(\;| {0,5}\=)/gi;
        while(lines[i].substr(varDeclarationIndex).match(varDeclarationRegex)) { // Loop Until No More Regex Matches Are Found
            let foundMatch = lines[i].substr(varDeclarationIndex).match(varDeclarationRegex)[0]; // Get The Found Regex Match
            foundMatch = foundMatch.split(' ')[0]; // Only Save The Variable Type Name
            let startIndex = lines[i].indexOf(foundMatch, varDeclarationIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundMatch.length + 5; // Get The Ending Index Of The Regex Match
            lines[i] = lines[i].cParseAdd('<var>', startIndex); // Add A Opening Tag At The Start Of The Regex Match
            lines[i] = lines[i].cParseAdd('</var>', endingIndex); // Add An Closing Tag At The End Of The Regex Match
            varDeclarationIndex = endingIndex + 6; // Set The Index
        }

        // Look For Equal Signs
        let equalSignIndex = 0;
        let equalSignRegex = /=|!|\|/gi;
        while(lines[i].substr(equalSignIndex).match(equalSignRegex)) { // Loop Until No More Regex Matches Are Found
            let foundMatch = lines[i].substr(equalSignIndex).match(equalSignRegex)[0]; // Get The Found Regex Match
            let startIndex = lines[i].indexOf(foundMatch, equalSignIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundMatch.length + 6; // Get The Ending Index Of The Regex Match
            lines[i] = lines[i].cParseAdd('<sign>', startIndex); // Add A Opening Tag At The Start Of The Regex Match
            lines[i] = lines[i].cParseAdd('</sign>', endingIndex); // Add An Closing Tag At The End Of The Regex Match
            equalSignIndex = endingIndex + 6; // Set The Index
        }

        // Look For Methods Being Called
        let calledMethodIndex = 0;
        let calledMethodRegex = /[a-z0-9_]{1,999} {0,5}\(/gi;
        while(lines[i].substr(calledMethodIndex).match(calledMethodRegex)) { // Loop Until No More Regex Matches Are Found
            let foundMatch = lines[i].substr(calledMethodIndex).match(calledMethodRegex)[0]; // Get The Found Regex Match
            foundMatch = foundMatch.substr(0, foundMatch.length - 1); // Remove The Last Character
            console.log(foundMatch);
            let startIndex = lines[i].indexOf(foundMatch, calledMethodIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundMatch.length + 8; // Get The Ending Index Of The Regex Match
            lines[i] = lines[i].cParseAdd('<method>', startIndex); // Add A Opening Tag At The Start Of The Regex Match
            lines[i] = lines[i].cParseAdd('</method>', endingIndex); // Add An Closing Tag At The End Of The Regex Match
            calledMethodIndex = endingIndex + 6; // Set The Index
        }

        // Look For Regular Expressions
        /*let regexIndex = 0;
        let regexRegex = /(= *\/.{5,9999}\/(g{0,1}i{0,1}))|(\/.{5,99}\/(g{0,1}i{0,1})\.)/gi;
        while(lines[i].substr(regexIndex).match(regexRegex)) { // Loop Until No More Regex Matches Are Found
            let foundMatch = lines[i].substr(regexIndex).match(regexRegex)[0]; // Get The Found Regex Match
            let paddingStart = foundMatch.indexOf('=') == 0; // Check If The Expression Starts With Being Declared To A Variable
            let startIndex = lines[i].indexOf(foundMatch, regexIndex) + (paddingStart ? 1 : 0); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundMatch.length + 8 - (!paddingStart ? 1 : 0); // Get The Ending Index Of The Regex Match
            lines[i] = lines[i].cParseAdd('<const>', startIndex); // Add A Opening Tag At The Start Of The Regex Match
            lines[i] = lines[i].cParseAdd('</const>', endingIndex); // Add An Closing Tag At The End Of The Regex Match
            regexIndex = endingIndex + 6; // Set The Index
        }*/

        // Add All Opening Brackets
        let openBrackets = lines[i].match(/[{]{1}/gi);
        if(openBrackets) levels += openBrackets.length;

        // Remove All Closing Brackets
        let closedBrackets = lines[i].match(/[}]{1}/gi);
        if(closedBrackets) levels -= closedBrackets.length;
    }
    return lines.join("\n"); // Return All Lines Joined Together As String
}

// Parse A JS Code
function cParseJS(text) {
    let lines = text.split("\n"); // Split Text Into Lines
    let levels = 0; // Indicates How Many Levels Deep We Are Currently
    for(let i = 0; i < lines.length; i++) { // Loop Through All Lines
        /*// Look For Variable Declarations
        let varDeclarationIndex = 0;
        let varDeclarationRegex = /(var|string) ([a-z0-9_-]{1,99})(\;| {0,5}\=)/gi;
        while(lines[i].substr(varDeclarationIndex).match(varDeclarationRegex)) { // Loop Until No More Regex Matches Are Found
            let foundMatch = lines[i].substr(varDeclarationIndex).match(varDeclarationRegex)[0]; // Get The Found Regex Match
            let startIndex = lines[i].indexOf(foundMatch, varDeclarationIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundMatch.length + 5; // Get The Ending Index Of The Regex Match
            lines[i] = lines[i].cParseAdd('<var>', startIndex); // Add A Opening Tag At The Start Of The Regex Match
            lines[i] = lines[i].cParseAdd('</var>', endingIndex); // Add An Closing Tag At The End Of The Regex Match
            varDeclarationIndex = endingIndex + 6; // Set The Index
        }*/

        /*// Look For Variable Declarations
        let varDeclarationIndex = 0;
        let varDeclarationRegex = /(var|string) ([a-z0-9_-]{1,99})(\;| {0,5}\=)/gi;
        while(lines[i].substr(varDeclarationIndex).match(varDeclarationRegex)) { // Loop Until No More Regex Matches Are Found
            let foundMatch = lines[i].substr(varDeclarationIndex).match(varDeclarationRegex)[0]; // Get The Found Regex Match
            let startIndex = lines[i].indexOf(foundMatch, varDeclarationIndex); // Get The Starting Index Of The Hex Color
            let endingIndex = startIndex + foundMatch.length + 5; // Get The Ending Index Of The Regex Match
            lines[i] = lines[i].cParseAdd('<var>', startIndex); // Add A Opening Tag At The Start Of The Regex Match
            lines[i] = lines[i].cParseAdd('</var>', endingIndex); // Add An Closing Tag At The End Of The Regex Match
            varDeclarationIndex = endingIndex + 6; // Set The Index
        }*/

        // Look For Comments

        // Add All Opening Brackets
        let openBrackets = lines[i].match(/[{]{1}/gi);
        if(openBrackets) levels += openBrackets.length;

        // Remove All Closing Brackets
        let closedBrackets = lines[i].match(/[}]{1}/gi);
        if(closedBrackets) levels -= closedBrackets.length;
    }
    return lines.join("\n"); // Return All Lines Joined Together As String
}

// Put String At Position
String.prototype.cParseAdd = function(addition, index) {
    let str = this.split(''); // Convert String Into An Array
    str.splice(index, 0, addition); // Add The String At The Given Index
    return str.join(''); // Join The String And Return
};

// Check For Not Already Replaced Strings
String.prototype.cParseContains = function(lookfor, ignore) { return this.cParseReplace(ignore, '').indexOf(lookfor) != -1; };

// Get Index Of Not Already Replaced Strings
String.prototype.cParseIndexOf = function(lookfor, ignore) { return this.cParseReplace(ignore, '').indexOf(lookfor) != -1; };

// Replace All Occurances Of A String
String.prototype.cParseReplace = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};