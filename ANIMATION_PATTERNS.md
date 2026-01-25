# 🎨 Framer Motion & Three.js Pattern Library

## Quick Reference for Adding Animations

### 1. Basic Imports
```tsx
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Float } from '@react-three/drei';
```

### 2. Common Animation Patterns

#### Fade In on Scroll
```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content here
</motion.div>
```

#### Slide Up on Scroll
```tsx
<motion.div
  initial={{ y: 50, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
  Content here
</motion.div>
```

#### Button with Hover & Tap
```tsx
<motion.button
  whileHover={{
    scale: 1.05,
    boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)"
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
  className="your-button-classes"
>
  Click Me
</motion.button>
```

#### Card with Hover Effect
```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  whileHover={{
    scale: 1.05,
    borderColor: "#22d3ee"
  }}
  transition={{ duration: 0.3 }}
  className="card-classes"
>
  Card content
</motion.div>
```

#### Icon Rotation on Hover
```tsx
<motion.div
  whileHover={{ rotate: 360, scale: 1.2 }}
  transition={{ duration: 0.6 }}
>
  <Icon className="w-8 h-8" />
</motion.div>
```

#### Staggered List Animation
```tsx
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

#### Growing Line Divider
```tsx
<motion.div
  initial={{ width: 0 }}
  whileInView={{ width: 96 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="h-1 bg-gradient-to-r from-blue-600 to-cyan-600"
/>
```

#### Pulsing Element
```tsx
<motion.div
  animate={{
    scale: [1, 1.1, 1],
    opacity: [0.5, 1, 0.5]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
>
  Pulsing content
</motion.div>
```

#### Floating Animation
```tsx
<motion.div
  animate={{ y: [0, -20, 0] }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }}
>
  Floating element
</motion.div>
```

### 3. Three.js Patterns

#### Basic Canvas Setup
```tsx
<Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} intensity={1} />
  <Stars radius={100} depth={50} count={5000} />
  {/* Your 3D components */}
</Canvas>
```

#### Animated 3D Sphere
```tsx
function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]}>
      <meshStandardMaterial color="#06b6d4" />
    </Sphere>
  );
}
```

#### Floating Component with Drei
```tsx
<Float speed={2} rotationIntensity={1} floatIntensity={2}>
  <Sphere args={[1, 32, 32]}>
    <meshStandardMaterial color="#06b6d4" />
  </Sphere>
</Float>
```

### 4. Combined Patterns

#### Modal/Popup with AnimatePresence
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="modal-classes"
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

#### Page Transition
```tsx
<motion.div
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 100 }}
  transition={{ duration: 0.5 }}
>
  Page content
</motion.div>
```

### 5. Performance Tips

✅ **Use `viewport={{ once: true }}`** for scroll animations that should trigger only once
✅ **Limit animated elements** to essential UI components
✅ **Use `transform` properties** (scale, rotate, translate) instead of width/height
✅ **Optimize Three.js** by reducing polygon count and particle count
✅ **Throttle/debounce** mouse move handlers
✅ **Use `will-change: transform`** CSS for animated elements

### 6. Timing Functions

```tsx
// Ease In Out (smooth start and end)
transition={{ ease: "easeInOut" }}

// Spring (bouncy natural motion)
transition={{ type: "spring", stiffness: 300, damping: 20 }}

// Linear (constant speed)
transition={{ ease: "linear" }}

// Custom bezier
transition={{ ease: [0.6, 0.01, 0.05, 0.95] }}
```

### 7. Advanced Variants

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## 🎯 When to Use What

| Use Case | Pattern |
|----------|---------|
| Section entrance | Fade in on scroll |
| Button interaction | Hover scale + tap shrink |
| Card hover | Scale + border glow |
| Icon interaction | Rotate + scale |
| List items | Staggered animation |
| Loading state | Pulsing + rotating |
| 3D background | Three.js Canvas |
| Smooth transitions | Spring physics |
| Attention grabber | Floating animation |

## 🚀 Quick Start Template

```tsx
import { motion } from 'framer-motion';

export default function MyComponent() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-20"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Animated Heading
      </motion.h2>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Click Me
      </motion.button>
    </motion.section>
  );
}
```

Happy animating! 🎨✨
