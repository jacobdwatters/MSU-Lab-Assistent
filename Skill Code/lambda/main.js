var fs = require("fs");
var prs = require('./Parse Labs/Parser.js');
var lab = require('./LabProcedure.js')

let LabParser = prs.LabParser;
let LabProcedure = lab.LabProcedure;

class main {
    /**
     * The current lab
     * @type {LabProcedure}
     */
    currentLab = null;


    /**
     * Loads a lab from a file.
     * @param labName Name of then lab to load.
     * @return {String} Response text for VLA.
     */
    loadLab(labName) {
        let responseText = 'Starting lab one.';
        responseText += ' Try "next step" or "previous step" to navagate the lab.';
        responseText += ' At any time you can say, "what materials do I need?"';

        var labContent = fs.readFileSync('./Labs/' + labName + '.txt').toString('utf-8'); // Read file
        var parser = new LabParser(); // Create parser
        this.currentLab = parser.parseLab(labContent); // Parse lab

        return responseText;
    }


    /**
     * Gets the mateirals for the current lab.
     * @return {String} Response text for VLA.
     */
    getMaterials() {
        let responseText;

        if(this.currentLab === null) {
            responseText = 'You must begin a lab to view materials. You can say "Begin lab" followed by the lab name to start a lab.'
        } else {
            responseText = 'Here are the materials you will need. ' + this.currentLab.getMaterials().join(', ') + '.';
        }

        return responseText;
    }


    nextStep() {
        let responseText = '';

        if(this.currentLab===null) {
            responseText = 'You must begin a lab to view steps. You can say "Begin" and the lab title to begin lab.';
        } else {

            if(this.currentLab.hasNextInstructtion()) {
                let instruction = this.currentLab.nextInstruction();
                responseText = 'You are now on step number ' + this.currentLab.currentStep() + ' of '
                    + this.currentLab.totalSteps() + ': ';
                responseText += instruction;

            } else {
                responseText = 'You have completed all steps.';
            }
        }

        return responseText;
    }


    previousStep() {
        let responseText = '';

        if(this.currentLab===null) {
            responseText = 'You must begin a lab to view steps. You can say "Begin" and the lab title to begin lab.';
        } else {
            if(this.currentLab.hasPreviousInstructtion()) {
                let instruction = this.currentLab.previousInstruction();
                responseText = 'You are now on step number ' + this.currentLab.currentStep() + ' of '
                    + this.currentLab.totalSteps() + ': ';
                responseText += instruction;

            } else {
                responseText = 'You are already on the first step: ' + this.currentLab.currentStep();
            }
        }

        return responseText;
    }


    /**
     * Gets the current step number and the coresponding instruction.
     * @return {string} Response text for VLA
     */
    getStepAndInstruction() {
        let responseText;

        if(this.currentLab === null){
            responseText = 'You must begin a lab to view steps. You can say "Begin lab" and the lab number to start a lab.'
        }
        else {
            responseText = 'You are currently on step number ' + this.currentLab.currentStep() + ' of ' +
                this.currentLab.totalSteps() + ': ' + this.currentLab.getInstruction();
        }

        return responseText;
    }


    /**
     * Gets the number of remaining steps.
     * @return {String} Response text for VLA.
     */
    getRemainingSteps() {
        let remainingSteps = this.currentLab.remainingSteps();

        if(this.remainingSteps === 0) {
            responseText = "You have completed the lab. There are no remaining steps."
        }
        else {
            responseText = "There are " + remainingSteps + " steps remaining.";
        }

        return responseText;
    }


    exitLab() {
        this.currentLab = null;
        return 'Exiting lab.';
    }
}


module.exports = {
    main: main
}
