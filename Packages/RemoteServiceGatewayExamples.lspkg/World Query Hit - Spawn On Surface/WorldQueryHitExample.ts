// Import required modules
const WorldQueryModule = require("LensStudio:WorldQueryModule");
const SIK = require("SpectaclesInteractionKit.lspkg/SIK").SIK;
const InteractorTriggerType = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor").InteractorTriggerType;
import { Slider } from "SpectaclesInteractionKit.lspkg/Components/UI/Slider/Slider";

const EPSILON = 0.01;

@component
export class SurfacePlacementScript extends BaseScriptComponent {
    private primaryInteractor;
    private hitTestSession: HitTestSession;
    private transform: Transform;

    @input hitIndicator: SceneObject; // Simple 3D mesh for indicating hit area (before hit)
    @input objectsToSpawn: SceneObject[]; // [Painting, Rug, Vase]
    @input objectPreviews: SceneObject[]; // Preview versions of objects (after hit, before tap)
    @input filterEnabled: boolean;
    
    // Scale control slider
    @input scaleSlider: Slider;
    
    // Scale range settings
    @input minScale: number = 1.0;
    @input maxScale: number = 15.0;

    private objectToSpawnIndex: number = -1;
    private lastHitPosition: vec3; // Store the exact hit center position
    private lastHitRotation: quat; // Store the exact hit rotation

    onAwake() {
        // Create hit session
        this.hitTestSession = this.createHitTestSession(this.filterEnabled);

        if (!this.hitIndicator) {
            print("Error: Missing Hit Indicator object.");
            return;
        }

        this.transform = this.hitIndicator.getTransform();
        this.hitIndicator.enabled = false; // Hide initially
        
        // Hide all preview objects initially
        if (this.objectPreviews) {
            for (let i = 0; i < this.objectPreviews.length; i++) {
                if (this.objectPreviews[i]) {
                    this.objectPreviews[i].enabled = false;
                }
            }
        }

        // Initialize slider tracking
        if (this.scaleSlider) {
            print("Scale slider initialized. Current value: " + this.scaleSlider.currentValue);
        } else {
            print("Warning: No scale slider assigned. Using default scale.");
        }

        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    }

    createHitTestSession(filterEnabled) {
        var options = HitTestSessionOptions.create();
        options.filter = filterEnabled;
        return WorldQueryModule.createHitTestSessionWithOptions(options);
    }

    private lastSliderValue: number = -1;

    // Check if slider value has changed and update preview accordingly
    private checkSliderValueChange(): void {
        if (!this.scaleSlider) return;
        
        const currentValue = this.scaleSlider.currentValue || 0;
        if (Math.abs(currentValue - this.lastSliderValue) > 0.001) {
            this.lastSliderValue = currentValue;
            const scaleFactor = this.getScaleFromSlider();
            print(`Scale slider changed to: ${currentValue}, Scale factor: ${scaleFactor.toFixed(2)}`);
            
            // Update preview objects scale in real-time
            this.updatePreviewScale(scaleFactor);
        }
    }

    // Convert slider value (0-1) to scale factor (minScale-maxScale)
    private getScaleFromSlider(): number {
        if (!this.scaleSlider) {
            return this.minScale;
        }
        
        const sliderValue = this.scaleSlider.currentValue || 0;
        return this.minScale + (sliderValue * (this.maxScale - this.minScale));
    }

    // Update the scale of preview objects when slider changes
    private updatePreviewScale(scaleFactor: number): void {
        if (this.objectPreviews && this.objectToSpawnIndex >= 0 && this.objectToSpawnIndex < this.objectPreviews.length) {
            const previewObj = this.objectPreviews[this.objectToSpawnIndex];
            if (previewObj && previewObj.enabled) {
                const newScale = new vec3(scaleFactor, scaleFactor, scaleFactor);
                previewObj.getTransform().setLocalScale(newScale);
            }
        }
    }

    onHitTestResult(results) {
        // Hide all preview objects initially
        if (this.objectPreviews) {
            for (let i = 0; i < this.objectPreviews.length; i++) {
                if (this.objectPreviews[i]) {
                    this.objectPreviews[i].enabled = false;
                }
            }
        }
        
        if (results === null) {
            // No hit, hide indicator
            this.hitIndicator.enabled = false;
            this.objectToSpawnIndex = -1;
            this.lastHitPosition = null;
            this.lastHitRotation = null;
        } else {
            const hitPosition = results.position;
            const hitNormal = results.normal.normalize();

            // Store the exact hit center position and rotation
            this.lastHitPosition = hitPosition;

            // Calculate the rotation based on hit normal
            const lookDirection = (1 - Math.abs(hitNormal.dot(vec3.up())) < EPSILON)
                ? vec3.forward()
                : hitNormal.cross(vec3.up());
            
            const toRotation = quat.lookAt(lookDirection, hitNormal);
            this.lastHitRotation = toRotation;
            
            // Position and show the hit indicator at exact hit center
            this.hitIndicator.enabled = true;
            this.hitIndicator.getTransform().setWorldPosition(this.lastHitPosition);
            this.hitIndicator.getTransform().setWorldRotation(this.lastHitRotation);
            
            // Decide what object to spawn
            const UP_DOT = hitNormal.dot(vec3.up());
            const threshold = 0.75;

            if (UP_DOT > threshold) {
                // Upward surface
                if (hitPosition.y > 0.5) {
                    this.objectToSpawnIndex = 2; // Vase
                } else {
                    this.objectToSpawnIndex = 1; // Rug
                }
            } else if (Math.abs(UP_DOT) < 0.3) {
                // Wall (mostly vertical)
                this.objectToSpawnIndex = 0; // Painting
            } else {
                // Ignore ceilings or bad surfaces
                this.objectToSpawnIndex = -1;
                return;
            }

            // Check if the object index is valid
            if (this.objectToSpawnIndex < 0 || 
                this.objectToSpawnIndex >= this.objectsToSpawn.length || 
                !this.objectPreviews || 
                this.objectToSpawnIndex >= this.objectPreviews.length) {
                return;
            }
            
            // When the primary trigger is pressed, show the preview of the actual object
            if (this.primaryInteractor && 
                this.primaryInteractor.isActive() && 
                this.primaryInteractor.currentTrigger !== InteractorTriggerType.None) {
                
                // Hide the hit indicator
                this.hitIndicator.enabled = false;
                
                // Show the appropriate preview object at exact hit center
                if (this.objectPreviews[this.objectToSpawnIndex]) {
                    const previewObj = this.objectPreviews[this.objectToSpawnIndex];
                    previewObj.enabled = true;
                    previewObj.getTransform().setWorldPosition(this.lastHitPosition);
                    previewObj.getTransform().setWorldRotation(this.lastHitRotation);
                    
                    // Apply current slider scale to preview
                    const scaleFactor = this.getScaleFromSlider();
                    const newScale = new vec3(scaleFactor, scaleFactor, scaleFactor);
                    previewObj.getTransform().setLocalScale(newScale);
                }
            }
        }
    }

    onUpdate() {
         if (!this.getSceneObject().enabled) return;
        
        // Check for slider value changes
        this.checkSliderValueChange();
        
        this.primaryInteractor = SIK.InteractionManager.getTargetingInteractors().shift();

        if (this.primaryInteractor &&
            this.primaryInteractor.isActive() &&
            this.primaryInteractor.isTargeting()
        ) {
            const rayStartOffset = new vec3(this.primaryInteractor.startPoint.x, this.primaryInteractor.startPoint.y, this.primaryInteractor.startPoint.z + 30);
            const rayStart = rayStartOffset;
            const rayEnd = this.primaryInteractor.endPoint;

            this.hitTestSession.hitTest(rayStart, rayEnd, this.onHitTestResult.bind(this));

            // Handle tap (trigger end)
            if (
                this.objectToSpawnIndex !== -1 &&
                this.primaryInteractor.previousTrigger !== InteractorTriggerType.None &&
                this.primaryInteractor.currentTrigger === InteractorTriggerType.None &&
                this.lastHitPosition && this.lastHitRotation
            ) {
                // Use the stored exact hit center position and rotation
                const spawnPosition = this.lastHitPosition;
                const spawnRotation = this.lastHitRotation;
                
                // Copy the correct object
                let parent = this.objectsToSpawn[this.objectToSpawnIndex].getParent();
                let newObject = parent.copyWholeHierarchy(this.objectsToSpawn[this.objectToSpawnIndex]);
                newObject.setParentPreserveWorldTransform(null);
                
                // Position the object at exact hit center
                newObject.getTransform().setWorldPosition(spawnPosition);
                newObject.getTransform().setWorldRotation(spawnRotation);
                
                // Apply scale from slider to the spawned object
                const scaleFactor = this.getScaleFromSlider();
                const currentScale = newObject.getTransform().getLocalScale();
                const newScale = new vec3(
                    currentScale.x * scaleFactor,
                    currentScale.y * scaleFactor,
                    currentScale.z * scaleFactor
                );
                newObject.getTransform().setLocalScale(newScale);
                
                print(`Object spawned at exact hit center with scale factor: ${scaleFactor.toFixed(2)}`);
                print(`Spawn position: (${spawnPosition.x.toFixed(3)}, ${spawnPosition.y.toFixed(3)}, ${spawnPosition.z.toFixed(3)})`);
                
                // Make sure the spawned object is properly scaled and visible
                newObject.enabled = true;
                
                // Hide all previews after placing
                if (this.objectPreviews) {
                    for (let i = 0; i < this.objectPreviews.length; i++) {
                        if (this.objectPreviews[i]) {
                            this.objectPreviews[i].enabled = false;
                        }
                    }
                }
                // Hide indicator as well
                this.hitIndicator.enabled = false;
                
                // Clear stored hit data
                this.lastHitPosition = null;
                this.lastHitRotation = null;
            }

        } else {
            // Hide everything when not actively targeting
            this.hitIndicator.enabled = false;
            if (this.objectPreviews) {
                for (let i = 0; i < this.objectPreviews.length; i++) {
                    if (this.objectPreviews[i]) {
                        this.objectPreviews[i].enabled = false;
                    }
                }
            }
            this.objectToSpawnIndex = -1;
            // Clear stored hit data when not targeting
            this.lastHitPosition = null;
            this.lastHitRotation = null;
        }
    }
}