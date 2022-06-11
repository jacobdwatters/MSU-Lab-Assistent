module.exports = {
    Token: class Token {
        
            /**
             * Creates a token of the specified kind and with the specified details.
             * @param {String} k Kind of token to create.
             * @param {String} d Details of the token.
             */
            constructor(k, d) {
                this.kind = k;  this.details = d;
            }
        
        
            /**
             * Checks if token is of kind s.
             *
             * @param {String} s token of interest.
             * @return {boolean} true if token kind equalTo s.
             */
            isKind(s) {
                return this.kind===s;
            }
        
        
            /**
             * Gets the kind of this token.
             * @return {String} token kind.
             */
            getKind() { return this.kind; }
        
        
            /**
             * Gets the details of this token.
             * @return {String} token details.
             */
            getDetails() { return this.details; }
        
        
            /**
             * Checks if given tokens kind and details match k and d respectively.
             *
             * @param {String} k token kind.
             * @param {String} d token details.
             * @return True if token matches kind and details, otherwise false.
             */
            matches(k, d) {
                return this.kind===k && this.details===d;
            }
        
        
            /**
             * If a given tokens kind and details do not match k and d respectively then the program will halt.
             *
             * @param {String} k token kind
             * @param {String} d token details. If d is null then only the kind will be checked.,
             */
            errorCheck(k, d) {
                if(d===null) {
                    if(this.kind !== k) {
                        throw new Error("Expecting token with kind " + k + " but got " + this.kind);
                    }
        
                } else {
                    if(!this.matches(k, d)) {
                        throw new Error("Expecting token [" + k + "," + d + "] but got " + this);
                    }
                }
            }


            /**
             * If a given tokens kind does not matches k and then the program will halt.
             *
             * @param {String} k Expected token kind
             */
            errorCheck(k) {
                if(this.kind !== k) {
                    throw new Error("Expecting token with kind " + k + " but got " + this.kind);
                }
            }
        
        
            /**
             * Constructs a string representation of a token. This will be of the form [kind, details].
             * @return A string representing of this token.
             */
            toString() {
                return "[" + this.kind + ", " + this.details + "]";
            }
    }
}