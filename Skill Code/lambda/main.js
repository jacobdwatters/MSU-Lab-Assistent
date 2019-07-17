module.exports = {
    materials : {
        responseText : '',
        materials : null,
    
        loadMaterialsList : function() {
            var fs = require("fs");
            var text = fs.readFileSync("./Labs/Household_Acids_and_Bases-materials.txt").toString('utf-8');
            this.materials = text.split("\n");
        },
        
        getMaterials : function() {
            if(this.materials === null) {
                this.responseText = 'You must begin a lab to view materials. You can say "Begin lab" and the lab number to start a lab.'
            }
            else {
                this.responseText = 'Here are the materials you will need. ' + this.materials.join(', ') + '.';    
            }
        
        return this.responseText;
        },
        
        exitLab: function() {
            this.responseText = '';
            this.materials = null;
        }
    },
    
    instructions : {
        responseText : '',
        currentSubStep: 0,
        currentStep : 1,
        instructionIndex : 0,
        instruction : null,
        inSub : false,
        totalNumberOfSteps : 0,
 
        nextStep : function() { //iterates over the steps of the lab
            if(this.instruction === null){
                this.responseText = 'You must begin a lab to view steps. You can say "Begin lab" and the lab number to start a lab.'
            }
            else{
                this.responseText = 'You are now on step number ';
    
                this.instructionIndex++;
    
                if(this.currentStep < this.totalNumberOfSteps+1) {
            
                    if(this.instruction[this.instructionIndex].includes('/sub')) {
                        this.inSub = false;
                        this.instructionIndex++;
                    }
                    else if(this.instruction[this.instructionIndex].includes('sub')) {
                        this.currentSubStep = 0;
                        this.inSub = true;
                        this.instructionIndex++;
                    }
        
                    if(this.inSub) {
                        this.currentSubStep++;
                        this.responseText += this.currentStep + '.' + this.currentSubStep;
                    }   
                    else {
                        this.currentStep++;
                        this.responseText += this.currentStep;
                    }
        
                    this.responseText += ' of ' + this.totalNumberOfSteps + ': ' + this.instruction[this.instructionIndex];
                }
                else {
                    this.responseText = 'You have completed all steps.';
                }
            }
      
            return this.responseText;
        },
  
        previousStep : function(){
            if(this.instruction === null){
                this.responseText = 'You must begin a lab to view steps. You can say "Begin lab" and the lab number to start a lab.';
            }
            else {
                this.responseText = 'You are now on step number ';
        
                if(this.currentStep > 1) {
                    this.instructionIndex--;
            
                    if(this.instruction[this.instructionIndex].includes('/sub')) {
                        this.currentSubStep = this.currentSubStep++;
                        this.inSub = true;
                        this.instructionIndex--;
                        this.currentStep--;
                    }
                    else if(this.instruction[this.instructionIndex].includes('<sub')) {
                        this.currentStep++;
                        this.inSub = false;
                        this.instructionIndex--;
                    }
            
                    if(this.inSub) {
                        this.currentSubStep--;
                        this.responseText += this.currentStep + '.' + this.currentSubStep;
                    }   
                    else {
                        this.currentStep--;
                        this.responseText += this.currentStep;
                    }
            
                    this.responseText += ' of ' + this.totalNumberOfSteps + ': ' + this.instruction[this.instructionIndex];
                }
                else{
                    this.responseText = 'You are on the first step.';
                }        
            }
      
            return this.responseText;
        },
        
        getStepAndInstruction : function() {
            if(this.instruction === null){
                this.responseText = 'You must begin a lab to view steps. You can say "Begin lab" and the lab number to start a lab.'
            }      
            else {
                if(this.inSub) {
                    this.responseText = 'You are currently on step number ' + this.currentStep + '.' + this.currentSubStep + ' of ' + this.totalNumberOfSteps + ': ' + this.instruction[this.instructionIndex];
                }
                else {
                    this.responseText = 'You are currently on step number ' + this.currentStep + ' of ' + this.totalNumberOfSteps + ': ' + this.instruction[this.instructionIndex];
      
                    if(this.currentStep === 2) {
                        this.responseText += ' At any time you can say, "next step" or "previous step" to navagate the lab.';
                    }
                    else if(this.currentStep === 1) {
                        this.responseText += ' At any time you can say, "what materials do I need?"';
                    }
                }
            }
        
           return this.responseText;
        },
        
        loadInstructions : function() {
            var fs = require("fs");
            var text = fs.readFileSync("./Labs/Household_Acids_and_Bases-Instructions.txt").toString('utf-8');
            this.instruction = text.split("\n");
            this.responseText = 'Starting lab one. ';
            this.totalNumberOfSteps = module.exports.instructions.getNumInstructions();
            return this.responseText;
        },
        getNumInstructions: function() {
            var count = 0;
            var stopCount = false;
      
            for(var i = 0; i < this.instruction.length; i++) {
                if(this.instruction[i].includes('<sub>')) {
                    stopCount = true;
                }
                else if(this.instruction[i].includes('</sub>')) {
                    stopCount = false;
                    i++;
                }
          
                if(!stopCount) {
                    count++;
                }
            }
      
            return count;
        },
        
        exitLab : function() {
            this.instruction = null;
            this.materials = null;
            this.currentStep = 1;
            this.inSub = false;
            this.instructionIndex = 0;
            this.currentSubStep = 0;
            this.responseText = 'Exiting lab.';
            return this.responseText;
        }
    }
};
