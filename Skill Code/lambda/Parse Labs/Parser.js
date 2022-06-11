const lex = require('./LabLexer.js');
const fs = require('fs')
const tk = require('./Token.js')
const lab = require('../LabProcedure.js');

let LabLexer = lex.LabLexer;


/**
 * Parser for extracting the contents of a lab written in VLA Readable Format.
 */
class LabParser {

    /**
     * Parses the contents of the lab.
     * @param labContent Content of the VLA-Readable file as a string.
     */
    parseLab(labContent) {
        // TODO: implementation using context-free grammar for VLA-Readable file.
        this.lexer = new LabLexer(labContent) // Create a lexer for the lab content.
        this.labProcedure = new lab.LabProcedure(); // Create an empty lab procedure.
        var token = null

        do { // Extract all tokens from the lab content
            token = this.lexer.getNextToken();

            if(token.isKind('langle')) {
                var tag = this.lexer.getNextToken();

                if(!tag.isKind('lslash')) { // Then it is an opening tag
                    tag.details = LabParser.removeLabel(tag.details);
                    tag.errorCheck('text');

                    token = this.lexer.getNextToken();
                    token.errorCheck('rangle');

                    if(tag.getDetails()==='title') { // Then we have a title block
                        var title = this.lexer.getNextToken();
                        title.errorCheck('text');
                        this.labProcedure.title = LabParser.sanatize(title.getDetails());

                    } else if(tag.getDetails()==='introduction') {
                        var intro = this.lexer.getNextToken();
                        intro.errorCheck('text');
                        this.labProcedure.introduction = LabParser.sanatize(intro.getDetails());

                    } else if(tag.getDetails()==='objectives') {
                        // Extract objectives for this lab procedure.
                        var objectives = this.lexer.getNextToken();
                        objectives.errorCheck('text');
                        this.labProcedure.materials = this.extractList(objectives.getDetails());

                    } else if(tag.getDetails()==='materials') { // Then we have a materials block
                        // Extract required materials for this lab procedure.
                        var materials = this.lexer.getNextToken();
                        materials.errorCheck('text');
                        this.labProcedure.materials = this.extractList(materials.getDetails());

                    } else if(tag.getDetails()==='questions') {
                        // Extract required materials for this lab procedure.
                        var questions = this.lexer.getNextToken();
                        questions.errorCheck('text');
                        this.labProcedure.questions = this.extractList(questions.getDetails());

                    } else if(tag.getDetails()==='procedure') {
                        // Recursivly parse the procedure block.
                        this.parseNestedBlocks('procedure');

                    } else {
                        throw new Error("Unknown tag: " + tag.getDetails());
                    }

                    if (tag.getDetails()!=='procedure') {
                        token = this.lexer.getNextToken();
                        token.errorCheck('langle');
                        token = this.lexer.getNextToken();
                        token.errorCheck('lslash');
                        token = this.lexer.getNextToken();
                        token.errorCheck('text', tag.getDetails()); // Ensure closing tag matches opening tag
                        token = this.lexer.getNextToken();
                        token.errorCheck('rangle');
                    }
                }
            } else if(!token.isKind('eof')) {
                throw new Error("Expecting block tag.");
            }

        } while(!token.isKind('eof'));

        return this.labProcedure;
    }


    /**
     * Recursivly parses a series of neted blocks. This method should only be used for parsing the procedure block.
     * @param parentTag
     */
    parseNestedBlocks(parentTag) {
        var token = this.lexer.getNextToken();

        if(token.isKind('text')) {
            // Add this instructon to the list
            this.labProcedure.instructions.push(LabParser.sanatize(token.getDetails()));
            token = this.lexer.getNextToken();
        }

        token.errorCheck('langle');
        token = this.lexer.getNextToken();

        if(!token.isKind('lslash')) {
            // Then there is at least one sub-block to parse.
            const repatitionLimit = 1000 // Limit on the number of sequential sub-blocks of the same scope
            let i=1

            token.errorCheck('text');
            var newParent = LabParser.removeLabel(token.getDetails());
            token = this.lexer.getNextToken();
            token.errorCheck('rangle');

            var closingTag = ''

            while(closingTag!==parentTag) { // Parse any aditional sub-blocks of the same scope.
                if(i==repatitionLimit) {
                    throw new Error("To many sequential sub-blocks of the same scope.");
                }

                this.parseNestedBlocks(newParent);

                token = this.lexer.getNextToken();
                token.errorCheck('langle');
                token = this.lexer.getNextToken();
                newParent = LabParser.removeLabel(token.getDetails());
                closingTag = LabParser.removeLabel(this.lexer.getNextToken().getDetails());
                i++;
            }

            token = this.lexer.getNextToken();
            token.errorCheck('rangle');

        } else {
            // Otherwise, this is the end of this block.
            token = this.lexer.getNextToken();
            token.errorCheck('text', parentTag);
            token = this.lexer.getNextToken();
            token.errorCheck('rangle');
        }
    }


    /**
     * Extracts a list of strings from a sinlge string using the newline '\n' character as the delimitor.
     * @param {String} text Text to sperate into a list of strings.
     * @return {string[]} List of strings in text seperated by the newline '\n' character.
     */
    extractList(text) {
        var list = text.trim().split('\n'); // Split each line.

        for(let i=0; i<list.length; i++) {
            // Sanatize the text data.
            list[i] = LabParser.sanatize(list[i]);
        }

        return list;
    }


    /**
     * Replace sequential whitespace with an single space and removes any leading or trailing whitespace.
     * @param {String} str String to sanatize.
     * @return {string} Sanatized string.
     */
    static sanatize(str) {
        return str.replace(/\s+/g,' ').trim();
    }


    /**
     * If a tag contains a label, remove it.
     * @param {String} data Tag.
     */
    static removeLabel(data) {
        if(data.includes(':')) { // then this tag has a label
            var loc = data.indexOf(':');
            data = data.substring(0, loc);
        }

        return data;
    }
}

module.exports = {
    LabParser: LabParser
}

// Testing
// parser = new LabParser();
// content = fs.readFileSync("../Labs/exampleLab.txt").toString('utf-8');
// procedure = parser.parseLab(content)
//
// console.log('Title: ', procedure.title, "\n");
// console.log('Introduction: ', procedure.introduction, "\n");
// console.log('Materials: ', procedure.materials, "\n");
// console.log('Questions: ', procedure.questions);
// console.log('Instructions: ', procedure.instructions);


