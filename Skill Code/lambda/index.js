// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'I am your MSU virtual lab assistant. What can I help you with?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Is there anyting else I can help you with?')
            .getResponse();
    }
};

const VirtualAssistantIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'VirtualAssistantIntent';
    },
    handle(handlerInput) {
        const speechText = 'I am your MSU virtual lab assistant. I help you complete your lab work. To begin lab say "begin lab" and the lab number.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('Is there anything else I can help with?')
            .getResponse();
    }
};

const BeginLabIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'BeginLabIntent';
    },
    handle(handlerInput) {
        const speechText = instructions.loadInstructions() + instructions.getStepAndInstruction();
        handlerInput.responseBuilder.speak("What lab would you like to begin?").getResponse();
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};

const GetStepIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GetStepIntent';
    },
    handle(handlerInput) {
        const speechText = instructions.getStepAndInstruction();
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};

const NextStepIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'NextStepIntent';
    },
    handle(handlerInput) {
        const speechText = instructions.nextStep();
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};

const PreviousStepIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'PreviousStepIntent';
    },
    handle(handlerInput) {
        const speechText = instructions.previousStep();
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt()
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hello';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

var instructions = {
  responseText : '',
  currentStep : 1,
  instruction : null,
  nextStep : function() {
    if(this.currentStep < 3){
        this.currentStep++;
        this.responseText = 'You are now on step number ' + this.currentStep + ': ' + this.instruction[this.currentStep-1] + '.';
    }
    else{
        this.responseText = 'You have completed all steps.';
    }
      
    return this.responseText;
  },
  previousStep : function(){
    if(this.currentStep > 1){
        this.currentStep--;
        this.responseText = 'You are now on step number ' + this.currentStep + '/' + this.instruction.length + ': ' + this.instruction[this.currentStep-1];
    }
    else{
        this.responseText = 'You are on the first step.';
    }
      
    return this.responseText;
  },
  getStepAndInstruction : function(){
      if(this.instruction === null){
          this.responseText = 'You must begin a lab to view steps. You can say "Begin lab" and the lab number to start a lab.'
      }
      else{
           this.responseText = 'You are currently on step number ' + this.currentStep + '/' + this.instruction.length + ': ' + this.instruction[this.currentStep-1] + ' At any time you can say, "next step" or "previous step" to navagate the lab.';
      }
           return this.responseText;
  },
  loadInstructions : function(){
    var fs = require("fs");
    var text = fs.readFileSync("./Labs/lab1_instructions.txt").toString('utf-8');
    this.instruction = text.split("\n");
    this.responseText = "Starting lab one. ";
    return this.responseText;
  }, 
  exitLab : function(){
      this.instruction = null;
      return "Exiting lab"
  }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        VirtualAssistantIntentHandler,
        BeginLabIntentHandler,
        GetStepIntentHandler,
        PreviousStepIntentHandler,
        NextStepIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
