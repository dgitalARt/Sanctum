# Sanctum

**A Mindfulness & Breathwork Experience for Snap Spectacles (2024)**

Sanctum is an immersive spatial computing application that combines guided breathing practices, chakra-tuned binaural frequencies, and generative AI visuals to create a portable meditation sanctuary. Built for Snap Spectacles 2024 using Lens Studio 5.14+.

---

## Overview

After extensive research into meditation practices, sound healing frequencies, and visual relaxation techniques, Sanctum emerged as a comprehensive mindfulness tool that leverages spatial computing to create calming experiences anywhere, anytime.

The project integrates:
- **AI-Generated Zen Environments**: DALL-E 3 creates unique, calming nature scenes and abstract spaces
- **Guided Breathing Practice**: GPT-4o generates personalized 1-minute breathing exercises with natural voice guidance
- **Chakra-Tuned Frequencies**: Seven distinct binaural beat frequencies corresponding to each chakra center
- **Non-Invasive Visual Meditation**: Animated geometric patterns that provide focal points without eye strain or photosensitivity triggers

---

## Features

### 1. Guided Breathing Practice
- **AI-Generated Scripts**: Each session creates unique, contextually-aware breathing guidance
- **Natural Voice Synthesis**: Calm, therapeutic voice using OpenAI's TTS (Coral voice)
- **Structured Breathwork**: 4-4-6 breathing pattern (inhale 4s, hold 4s, exhale 6s) repeated across 3 cycles
- **Real-time Phase Display**: Visual text cues synchronized with breathing phases

### 2. Generative Zen Spaces
- **Dynamic Environment Generation**: AI creates unique calming visuals per session
  - Peaceful forest scenes with morning light
  - Serene mountain lakes at dawn
  - Abstract flowing water patterns
  - Misty bamboo forests
  - Zen gardens with raked sand
  - Gentle ocean waves at sunset
- **2D to Spatial Transformation**: Images spatialize into immersive 3D environments
- **Persistent Visual Meditation**: Spaces remain available for continued contemplation

### 3. Chakra Frequency Library
Seven distinct binaural beat frequencies, each tuned to resonate with specific chakra centers:

| Chakra | Frequency | Properties |
|--------|-----------|------------|
| Root (Muladhara) | 396 Hz | Grounding, stability, security |
| Sacral (Svadhisthana) | 417 Hz | Creativity, emotional balance |
| Solar Plexus (Manipura) | 528 Hz | Personal power, transformation |
| Heart (Anahata) | 639 Hz | Love, compassion, connection |
| Throat (Vishuddha) | 741 Hz | Expression, communication |
| Third Eye (Ajna) | 852 Hz | Intuition, insight, clarity |
| Crown (Sahasrara) | 963 Hz | Spiritual connection, transcendence |

### 4. Geometric Visual Meditation
- **Non-Photosensitive Animation**: Carefully designed animated geometric patterns
- **Flicker-Free Design**: Smooth, continuous motion without harsh strobing or rapid flashing
- **Hypnotic Flow**: Trippy, mandala-like patterns that facilitate meditative focus
- **Eye-Safe Implementation**: Tested to avoid triggering photosensitive responses or eye strain

---

## Technical Architecture

### Core Technologies
- **Platform**: Snap Spectacles (2024 model)
- **Development Environment**: Lens Studio 5.14+
- **Language**: TypeScript
- **AI Services**: OpenAI API (GPT-4o, DALL-E 3, TTS)

### Key Components

#### `BreathingPracticeAssistant.ts`
Main script handling:
- Interactable button triggers
- AI script generation for breathing guidance
- Voice synthesis with therapeutic tone
- Sequential phase management
- Zen environment generation
- Image spatialization coordination

#### Spatial Integration
- **Remote Service Gateway**: OpenAI API integration
- **Spatial Gallery System**: Transforms 2D generated images into immersive 3D spaces
- **Dynamic Audio Output**: Spatial audio positioning for binaural frequencies
- **Interaction Kit (SIK)**: Gesture and button controls

### Interaction Flow

```
User Tap → Generate Practice
    ↓
AI Creates Breathing Script
    ↓
Voice Guidance Begins (Zen Master Tone)
    ↓
Text Display Updates (Phase Instructions)
    ↓
AI Generates Zen Visual (DALL-E 3)
    ↓
2D Image Loads & Displays
    ↓
[Optional] User Spatializes Image
    ↓
3D Immersive Environment Active
```

---

## Research & Design Decisions

### Breathing Pattern Selection
The 4-4-6 pattern was chosen after reviewing multiple breathwork methodologies:
- **Box Breathing (4-4-4-4)**: Military/tactical use, alertness
- **4-7-8 Technique**: Dr. Andrew Weil's sleep method
- **4-4-6 Pattern**: Optimal for active stress reduction while maintaining engagement

The 4-4-6 pattern extends the exhale phase, activating the parasympathetic nervous system more effectively than equal-count methods, while remaining accessible to beginners.

### Frequency Selection Rationale
Chakra frequencies are based on the Solfeggio scale and Pythagorean tuning systems. While scientific evidence for chakra-frequency correspondence remains anecdotal, these frequencies align with:
- Traditional Vedic chakra associations
- Modern sound healing practices
- Harmonic resonance principles
- User-reported subjective experiences in meditation contexts

**Note**: This feature is offered as a complementary wellness tool, not as medical treatment.

### Visual Safety Protocol
Animated geometric patterns underwent careful design to avoid:
- **Photosensitive epilepsy triggers**: No rapid flashing (kept below 3 Hz variation)
- **Eye strain**: Smooth animations, moderate contrast ratios
- **Motion sickness**: Gentle, predictable movement patterns
- **Overwhelming stimulation**: Balanced complexity, calming color palettes

---

## Installation & Setup

### Prerequisites
- Snap Spectacles (2024 model)
- Lens Studio 5.14 or higher
- OpenAI API key with access to:
  - GPT-4o (or GPT-4o-mini)
  - DALL-E 3
  - TTS (Text-to-Speech)

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/sanctum.git
   cd sanctum
   ```

2. **Open in Lens Studio**
   - Launch Lens Studio 5.14+
   - Open the Sanctum project file

3. **Configure OpenAI API**
   - Navigate to Remote Service Gateway settings
   - Add your OpenAI API key
   - Ensure endpoints are correctly configured

4. **Assign Scene Objects**
   In the `BreathingPracticeAssistant` script inspector:
   - `textOutput`: Text component for breathing instructions
   - `zenSpaceImage`: Image component for 2D zen visuals
   - `spatialGallery`: Reference to spatial image gallery system
   - `interactableObject`: Button to start practice
   - `spatializeButton`: Button to transform 2D to spatial
   - `toggleViewButton`: Button to switch views
   - `alternateSceneObject`: Alternative scene content

5. **Import Audio Frequencies**
   - Place chakra frequency audio files in the project
   - Assign to appropriate audio components
   - Configure spatial audio properties

6. **Deploy to Spectacles**
   - Build the lens
   - Sync to your Spectacles device via Lens Studio

---

## Usage

### Starting a Practice
1. Put on Spectacles
2. Launch Sanctum lens
3. Tap/pinch the primary interactable button
4. Follow voice-guided breathing instructions
5. Observe zen visual as it generates

### Spatializing Environments
1. Wait for 2D image to fully load
2. Tap the spatialize button
3. Zen environment transforms into immersive 3D space
4. Move your head to explore the spatial scene

### Chakra Frequency Selection
- Navigate frequency selection UI
- Choose desired chakra frequency
- Audio plays with spatial positioning
- Combine with breathing practice or use independently

### Switching Views
- Tap toggle view button to switch between:
  - Zen visual meditation mode
  - Geometric animation mode
  - Alternate content displays

---

## Customization

### Modifying Breathing Patterns
Edit `breathingPhases` array in `BreathingPracticeAssistant.ts`:
```typescript
private breathingPhases = [
  { phase: "inhale", duration: 4, text: "Breathe in..." },
  { phase: "hold", duration: 4, text: "Hold gently..." },
  { phase: "exhale", duration: 6, text: "Breathe out..." },
  { phase: "pause", duration: 2, text: "Notice the stillness..." }
];
```

### Adjusting Voice Tone
Modify `voiceInstructions` parameter:
```typescript
private voiceInstructions: string = 
  "Wise zen master tone. Calm, grounding voice. Speak slowly.";
```

### Zen Visual Themes
Add new visual themes in `createZenSpacePrompt()`:
```typescript
const prompts = [
  "Your custom DALL-E prompt here...",
  // Add more variations
];
```

### Frequency Tuning
Replace audio files with alternative frequencies or binaural beat configurations matching your research preferences.

---

## Known Limitations

- **API Latency**: Voice and image generation depend on network connectivity and OpenAI API response times
- **Battery Consumption**: AI generation and spatial rendering are battery-intensive operations
- **Frequency Effectiveness**: Subjective experiences with chakra frequencies vary by individual
- **Visual Preferences**: Not all users respond equally to abstract geometric animations

---

## Future Development

Potential enhancements under consideration:
- [ ] Offline mode with pre-generated content
- [ ] User-customizable breathing patterns
- [ ] Progress tracking and session history
- [ ] Integration with heart rate monitoring (if/when available on Spectacles)
- [ ] Expanded frequency library (binaural beats, isochronic tones)
- [ ] Guided meditation scripts beyond breathing
- [ ] Community-shared zen environments
- [ ] Personalized AI adaptation based on user feedback

---

## Contributing

Contributions are welcome. Areas of particular interest:
- Additional scientifically-validated breathing techniques
- Improved visual meditation patterns (with photosensitivity testing)
- Optimized AI prompt engineering for faster generation
- Alternative frequency systems backed by research
- Accessibility enhancements
- Performance optimizations

Please submit pull requests with:
- Clear description of changes
- Testing methodology for safety features (especially visual elements)
- Documentation updates
- Rationale for design decisions

---

## Safety & Disclaimers

**Medical Disclaimer**: Sanctum is a wellness tool, not medical treatment. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. Users with respiratory conditions, anxiety disorders, or other health concerns should consult healthcare professionals before beginning any breathwork practice.

**Photosensitivity Warning**: While designed to minimize risk, individuals with photosensitive epilepsy should use caution with geometric animations. Discontinue use if experiencing discomfort, disorientation, or unusual visual phenomena.

**Frequency Therapy**: Claims about chakra frequencies and their effects are based on traditional practices and anecdotal reports, not peer-reviewed scientific evidence. Use as a complementary relaxation tool, not as primary medical intervention.

**Spatial Awareness**: Always practice in safe environments where you can sit or stand comfortably. Do not use while driving, operating machinery, or in situations requiring full attention to surroundings.

---

## Research References

This project synthesized insights from multiple disciplines:

**Breathwork Science**:
- Jerath et al. (2015). "Self-Regulation of Breathing as Adjunctive Treatment of Insomnia"
- Ma et al. (2017). "The Effect of Diaphragmatic Breathing on Attention, Negative Affect and Stress"
- Zaccaro et al. (2018). "How Breath-Control Can Change Your Life: A Systematic Review"

**Sound Healing & Frequencies**:
- Lee et al. (2012). "The Effects of Music on Pain: A Meta-Analysis"
- Chanda & Levitin (2013). "The Neurochemistry of Music"
- Traditional Vedic texts on chakra systems (Upanishads, Yoga Sutras)

**Visual Meditation**:
- Kabat-Zinn (1990). "Full Catastrophe Living: Using the Wisdom of Your Body and Mind"
- Research on mandala observation in meditative states
- Neuroscience of visual focus and attention training

**Photosensitivity Guidelines**:
- Harding & Jeavons (1994). "Photosensitive Epilepsy"
- WHO Guidelines on preventing photosensitive seizures

---

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Acknowledgments

Built with:
- OpenAI API for generative capabilities
- Snap Lens Studio and Spectacles platform
- Spectacles Interaction Kit (SIK)
- Research contributions from meditation, neuroscience, and sound healing communities

Special thanks to practitioners and researchers in contemplative science who have worked to bridge ancient wisdom traditions with modern technology.

---

## Contact & Support

For questions, feedback, or collaboration inquiries:
- **GitHub Issues**: [Project Issues Page]
- **Discussions**: [Community Forum/Discord]
- **Email**: [Your Contact]

---

**Sanctum** - *Your portable sanctuary for mindful moments in spatial computing.*

