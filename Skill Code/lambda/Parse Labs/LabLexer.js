var token = require('./Token.js');

class LabLexer {

    /**
     * Creates a LabLexer object.
     * @constructor
     * @param {String} content Text content of the Lab file.
     */
    constructor(content) {
        this.content = content
    }


    /**
     * Gets the content of this Lexer.
     * @return {String} content of Lexer
     */
    getContent() { return this.content; }


    /**
     * @param code ascii value of character
     * @return {boolean} Returns true if ascii value is digit (i.e. between 48 and 57 inclusive). Otherwise, returns false.
     */
    digit(code) {
        return 48<=code && code<=57;
    }


    /**
     * Produces individual symbols from content, left to right, as ascii values.
     *
     * @return Returns ascii value of the next symbol from content. If content is empty then returns -1
     */
    getNextSymbol() {
        var result = -1;

        if (this.content.length > 0) {
            result = this.content.charAt(0);
            this.content = this.content.substring(1, this.content.length);
        }

        return result;
    }


    /**
     * Generates next token from the content of this LabLexer.
     * @return {Token} next token of the content.
     */
    getNextToken() {
        let state = 1;  // state of FA
        let data = "";  // specific info for the token
        let done = false; // Keeps track if we are done
        let sym;  // holds current symbol

        do {
            sym = this.getNextSymbol(); // Get the next symbol

            if(state === 1) {
                if(sym!==-1) {
                    var symNum = sym.charCodeAt(0)
                }

                if(symNum === 9 || symNum === 10 || symNum === 13 || symNum === 32) { // Whitespace
                    state = 1; // Keep state at one.

                } else if(sym==='<') {
                    data += sym;
                    state = 2;
                    done = true;

                } else if(sym==='>') {
                    data += sym;
                    state = 3;
                    done = true;

                } else if(sym===':') {
                    data += sym;
                    state = 4;
                    done = true;

                } else if(sym==='/') {
                    data += sym;
                    state = 5;
                    done = true;

                } else if(sym === '#') { // Then we have a comment
                    state = 7

                } else if(sym === -1) { // We have reached the end of the string
                    state = 8;
                    done = true;
                } else {
                    data+=sym;
                    state = 6;
                }

            } else if(state === 6) { // Then we have some text

                if(sym === '<' || sym === '>') {
                    this.putBackSymbol(sym); // Then we don't need this symbol
                    done = true; // We are finished

                } else {
                    data += sym;
                    state = 6; // Keep state at 6
                }

            } else if(state === 7) {
                if(sym !== '\n') {
                    state = 7; // Keep state at 7 and ignore symbols
                } else {
                    state = 1; // Comment has ended, return to state 1
                }
            }

        } while(!done);

        if(state === 2) {
            return new token.Token("langle", data);
        } else if(state === 3) {
            return new token.Token("rangle", data);
        } else if(state === 4) {
            return new token.Token("colon", data);
        } else if(state === 5) {
            return new token.Token("lslash", data);
        } else if(state === 6) {
            // if(data.includes(':')) { // then this tag has a label
            //     var loc = data.indexOf(':');
            //     data = data.substring(0, loc);
            // }

            return new token.Token("text", data);
        } else if(state === 8) {
            return new token.Token("eof", data)
        } else {
            throw new Error("Lexer stopped in a bad state.");
        }
    }


    /**
     * Replaces unneeded symbol back into content string.
     *
     * Note: This method should only be used when the programmer is confident the token
     * is not an unexpected token.
     *
     * @param {char} sym symbol to place back into content string
     */
    putBackSymbol(sym) {
        if(sym === -1) {
            this.content = '';
        }
        else {
            this.content = sym + this.content;
        }
    }


    /**
     * Stops execution with an error message
     *
     * @param {String} message error message to print
     */
    error(message) {
        throw new Error(message);
    }
}

module.exports = {
    LabLexer: LabLexer
}