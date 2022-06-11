/**
 * Contains and provides methods for accessing lab procedure steps and required materials.
 */
 class LabProcedure {

    /**
     * List of instructions for this LabProcedure. Each index of the list represents on step of the procedure.
     * @type {String[]}
     */
    instructions = [];
    /**
     * Current Step.
     * @type {number}
     */
    instructionIndex=0;
    /**
     * Needed materials for this lab procedure.
     * @type {String[]}
     */
    materials = [];
    /**
     * Title of this lab.
     * @type {string}
     */
    title = "";
    introduction="";
    objectives=[];
    questions=[];


    /**
     * Gets the current instruction for this lab procedure.
     * @return {String} The current instruction.
     */
    getInstruction() {
        if(this.instructions.length>0) {
            return this.instructions[this.instructionIndex];
        } else {
            return '';
        }
    }


    /**
     * Checks whether there is another instruction in this lab procedure.
     * @return {boolean} Returns true if there is a following instruction in this lab procedure. Otherwise, if the
     * current instruction is the last instruction, returns false.
     */
    hasNextInstruction() {
        if(this.instructionIndex===this.instructions.length-1) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * Increases instruction index by one and returns that instruction. If currently on the last instruction then
     * the index remains the same and the current instruction is returned.
     *
     * @returns {String} The next instruction if one exists. If there is no next instruction, returns the current
     * instruction. If there are no instructions for this lab procedure. Then an empty string is returned.
     */
    nextInstruction() {
        if(this.instructionIndex < this.instructions.length-1) {
            this.instructionIndex++;
        }

        if(this.instructions.length!=0) {
            return this.instructions[this.instructionIndex];
        } else {
            return "";
        }
    }


    /**
     * Checks whether there is a preceding instruction in this lab procedure.
     * @return {boolean} Returns true if there is a preceding instruction in this lab procedure. Otherwise, if the
     * current instruction is the first instruction, returns false.
     */
    hasPreviousInstruction() {
        if(this.instructionIndex===0) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * Decreases instruction index by one and returns that instruction. If currently on the first instruction then
     * the index remains the same and the current instruction is returned.
     *
     * @returns {String} The previous instruction if one exists. If there is no previous instruction, returns the current instruction.
     * If there are no instructions for this lab procedure. Then an empty string is returned.
     */
    previousInstruction() {
        if(this.instructionIndex > 0) {
            this.instructionIndex--;
        }

        if(this.instructions.length!=0) {
            return this.instructions[this.instructionIndex];
        } else {
            return "";
        }
    }


    /**
     * Gets the required materials of this lab procedure.
     * @return {String[]} List of needed materials for this lab procedure.
     */
    getMaterials() {
        return this.materials;
    }


    /**
     * Gets the text of the current instruction.
     * @return {String} The current instruction.
     */
    currentInstruction() {
        return this.instructions[this.instructionIndex];
    }


    /**
     * Gets the current instruction number.
     * @return {number} The number of the curent instruction in the lab procedure.
     */
    currentStep() {
        return this.instructionIndex+1;
    }


    /**
     * Gets the number of steps reamining. If on the last step, there will be zero ramining steps.
     * @return {number} The number of ramining steps.
     */
    remainingSteps() {
        return this.instructions.length-this.currentStep();
    }


    /**
     * Gets the total number of instructions.
     * @return {number} Total number of instructions in the lab procedure.
     */
    totalSteps() {
        return this.instructions.length
    }
}

module.exports = {
    LabProcedure: LabProcedure
};