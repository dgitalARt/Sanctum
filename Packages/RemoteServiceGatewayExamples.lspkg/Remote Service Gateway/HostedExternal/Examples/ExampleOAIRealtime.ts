import { OpenAI } from "../OpenAI";
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

@component
export class BreathingPracticeAssistant extends BaseScriptComponent {
  @ui.separator
  @ui.group_start("Breathing Practice")
  @input textOutput: Text;
  @input @label("Run On Tap") private startPracticeOnTap: boolean = false;
  @ui.group_end

  @ui.separator
  @ui.group_start("Visual Calm Space")
  @input private zenSpaceImage: Image;
  @input private spatialGallery: ScriptComponent;
  @ui.group_end

  @ui.separator
  @ui.group_start("Voice Settings")
  @input @widget(new TextAreaWidget()) private voiceInstructions: string = "Wise zen master or therapist tone. Calm, grounding, deeply peaceful voice. Speak slowly with intentional pauses between phrases.";
  @ui.group_end

  @ui.separator
  @ui.group_start("Interaction")
  @input private interactableObject: SceneObject;
  @input private toggleViewButton: SceneObject;
  @input private alternateSceneObject: SceneObject;
  @ui.group_end
  
  private rmm = require("LensStudio:RemoteMediaModule") as RemoteMediaModule;
  private gestureModule: GestureModule = require("LensStudio:GestureModule");
  private SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK;
  private interactionManager = this.SIK.InteractionManager;
  private isProcessing: boolean = false;
  private interactable: Interactable | null = null;
  private toggleViewInteractable: Interactable | null = null;

  // Breathing practice sequence
  private breathingPhases = [
    { phase: "preparation", duration: 3, text: "Find a comfortable position. Let your body relax." },
    { phase: "inhale", duration: 4, text: "Breathe in slowly through your nose... 1... 2... 3... 4" },
    { phase: "hold", duration: 4, text: "Hold gently... 1... 2... 3... 4" },
    { phase: "exhale", duration: 6, text: "Breathe out slowly through your mouth... 1... 2... 3... 4... 5... 6" },
    { phase: "pause", duration: 2, text: "Notice the stillness..." }
  ];

  private totalCycles = 3; // 3 cycles for approximately 1 minute

  onAwake() {
    if (this.interactableObject) {
      this.interactable = this.interactableObject.getComponent(Interactable.getTypeName());
      if (!isNull(this.interactable)) {
        this.interactable.onTriggerEnd.add(() => {
          print("Interactable triggered - starting breathing practice...");
          this.startBreathingPractice();
        });
        print("Interactable trigger bound successfully");
      } else {
        print("Interactable component not found on interactableObject.");
      }
    }

    // Setup toggle view button
    if (this.toggleViewButton) {
      this.toggleViewInteractable = this.toggleViewButton.getComponent(Interactable.getTypeName());
      if (!isNull(this.toggleViewInteractable)) {
        this.toggleViewInteractable.onTriggerEnd.add(() => {
          print("Toggle view button triggered");
          this.toggleView();
        });
        print("Toggle view button bound successfully");
      } else {
        print("Toggle view interactable component not found.");
      }
    }

    this.setupInteraction();
    this.setupGestures();
  }

  private setupInteraction() {
    if (this.interactableObject) {
      const interactable = this.interactionManager.getInteractableBySceneObject(this.interactableObject);
      if (interactable) {
        interactable.onInteractorTriggerEnd(() => this.startBreathingPractice());
      }
    }

    // Setup toggle view button interaction
    if (this.toggleViewButton) {
      const toggleInteractable = this.interactionManager.getInteractableBySceneObject(this.toggleViewButton);
      if (toggleInteractable) {
        toggleInteractable.onInteractorTriggerEnd(() => this.toggleView());
      }
    }
  }

  private setupGestures() {
    if (global.deviceInfoSystem.isEditor()) {
      this.createEvent("TapEvent").bind(() => this.onTap());
    } else {
      this.gestureModule.getPinchDownEvent(GestureModule.HandType.Right).add(() => this.onTap());
    }
  }

  private onTap() {
    if (this.startPracticeOnTap) {
      this.startBreathingPractice();
    }
  }

  private async startBreathingPractice() {
    if (this.isProcessing) {
      print("Practice already in progress.");
      return;
    }

    this.isProcessing = true;
    this.textOutput.text = "Preparing your breathing practice...";

    try {
      // Start all processes in parallel for maximum speed
      const [fullScript] = await Promise.all([
        this.generateBreathingScript(),
        this.generateZenSpace(), // Image generation runs in parallel
      ]);
      
      if (fullScript) {
        // Generate and play voice guidance
        this.textOutput.text = "Beginning your practice...";
        await this.generateVoiceGuidance(fullScript);
        
        // Run breathing sequence (text updates)
        this.runBreathingSequence();
      }
    } catch (err) {
      print("ERROR: " + err);
      this.textOutput.text = "Error starting practice. Please try again.";
    } finally {
      this.isProcessing = false;
    }
  }

  private async generateBreathingScript(): Promise<string> {
    try {
      const response = await OpenAI.chatCompletions({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a meditation guide creating a 1-minute breathing practice script. 
            
            Structure:
            - Brief welcome (5 seconds)
            - 3 breathing cycles with 4-4-6 pattern (inhale 4s, hold 4s, exhale 6s)
            - Brief closing (5 seconds)
            
            Use calming language with natural pauses indicated by "...". 
            Include gentle counting for each breath phase.
            Keep it concise - total speaking time should be around 50-55 seconds.`,
          },
          {
            role: "user",
            content: "Create a calming 1-minute guided breathing practice to help reduce stress and lower heart rate.",
          },
        ],
      });

      const script = response.choices[0].message.content?.trim() || "";
      print("Generated breathing script: " + script);
      return script;
    } catch (error) {
      print("Failed to generate breathing script: " + error);
      return this.getFallbackScript();
    }
  }

  private getFallbackScript(): string {
    return `Welcome. Find a comfortable position and close your eyes if you wish.
    
    Let's begin. Breathe in slowly through your nose... one... two... three... four.
    
    Hold gently... one... two... three... four.
    
    Now breathe out slowly through your mouth... one... two... three... four... five... six.
    
    Again, breathe in... one... two... three... four.
    
    Hold... one... two... three... four.
    
    And release... one... two... three... four... five... six.
    
    One more time. Breathe in deeply... one... two... three... four.
    
    Hold this breath... one... two... three... four.
    
    And let it all go... one... two... three... four... five... six.
    
    Beautiful. Notice how calm your body feels. When you're ready, gently open your eyes.`;
  }

  private async generateVoiceGuidance(script: string) {
    try {
      const response = await OpenAI.speech({
        model: "gpt-4o-mini-tts",
        input: script,
        voice: "coral",
        instructions: this.voiceInstructions,
      });

      const audio = this.sceneObject.createComponent("AudioComponent");
      audio.audioTrack = response;
      audio.play(1);
      
      print("Voice guidance started");
    } catch (error) {
      print("Voice generation error: " + error);
    }
  }

  private runBreathingSequence() {
    let cycleCount = 0;
    let phaseIndex = 0;
    
    const nextPhase = () => {
      if (cycleCount >= this.totalCycles) {
        this.textOutput.text = "Practice complete. Notice how you feel.";
        return;
      }

      const phase = this.breathingPhases[phaseIndex];
      this.textOutput.text = phase.text;

      phaseIndex++;
      if (phaseIndex >= this.breathingPhases.length) {
        phaseIndex = 1; // Skip preparation phase after first cycle
        cycleCount++;
      }

      this.delayedCallback(phase.duration, nextPhase);
    };

    // Start the sequence
    nextPhase();
  }

  private async generateZenSpace() {
    try {
      // Use fallback prompt directly - faster execution
      const zenPrompt = this.getFallbackZenPrompt();
      
      const response = await OpenAI.imagesGenerate({
        model: "dall-e-3",
        prompt: zenPrompt,
        n: 1,
        size: "1024x1024",
      });

      print("Zen space image generated, processing...");
      this.processImageResponse(response, this.zenSpaceImage);
      
    } catch (error) {
      print("Zen space generation failed: " + error);
    }
  }

  private getFallbackZenPrompt(): string {
    const prompts = [
      "Peaceful meditation space: serene mountain lake at dawn, soft mist, perfect reflections, calm water, pastel sky, tranquil atmosphere, photorealistic, soft focus",
      "Peaceful meditation space: gentle forest clearing with soft morning light, ethereal mist, peaceful trees, natural beauty, calming greens and golds, serene atmosphere",
      "Peaceful meditation space: abstract flowing water in soft blues and aqua, gentle ripples, ethereal light, calming patterns, zen minimalism, peaceful movement"
    ];
    
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  private notifySpatialGallery(method: string) {
    try {
      const spatialObj = this.spatialGallery?.getSceneObject() as any;
      if (spatialObj?.api?.[method]) {
        spatialObj.api[method]();
        print(`Called ${method} on spatial gallery`);
      } else {
        print(`Spatial gallery API method ${method} not found`);
      }
    } catch (error) {
      print(`Error calling spatial gallery: ${error}`);
    }
  }

  private processImageResponse(response: any, imageComponent: Image) {
    response.data.forEach((datum) => {
      if (datum.url) {
        const rsm = require("LensStudio:RemoteServiceModule") as RemoteServiceModule;
        const resource = rsm.makeResourceFromUrl(datum.url);
        this.rmm.loadResourceAsImageTexture(
          resource,
          (texture) => {
            if (imageComponent) {
              imageComponent.mainPass.baseTex = texture;
              print("Texture loaded from URL, notifying spatial gallery...");
              
              // CRITICAL: Immediately notify spatial gallery - same as ExampleOAICalls
              this.notifySpatialGallery('notifyGeneratedImageUpdated');
            }
          },
          () => print("Failed to load image from URL")
        );
      } else if (datum.b64_json) {
        Base64.decodeTextureAsync(
          datum.b64_json,
          (texture) => {
            if (imageComponent) {
              imageComponent.mainPass.baseTex = texture;
              print("Texture loaded from base64, notifying spatial gallery...");
              
              // CRITICAL: Immediately notify spatial gallery - same as ExampleOAICalls
              this.notifySpatialGallery('notifyGeneratedImageUpdated');
            }
          },
          () => print("Failed to decode image from base64")
        );
      }
    });
  }

  private toggleView() {
    print("Toggling view...");
    
    // Disable zen space image
    if (this.zenSpaceImage) {
      this.zenSpaceImage.enabled = false;
      this.zenSpaceImage.sceneObject.enabled = false;
      print("Zen space 2D image disabled");
    }

    // Enable alternate scene object
    if (this.alternateSceneObject) {
      this.alternateSceneObject.enabled = true;
      print("Alternate scene object enabled");
    }
  }

  private delayedCallback(delayTime: number, callback: () => void) {
    const delayedCallbackEvent = this.createEvent("DelayedCallbackEvent");
    delayedCallbackEvent.bind(callback);
    delayedCallbackEvent.reset(delayTime);
  }

  // Public API for manual triggering
  public triggerBreathingPractice() {
    this.startBreathingPractice();
  }

  public resetPractice() {
    this.isProcessing = false;
    this.textOutput.text = "Ready to begin your breathing practice";
  }
}