'use client';

export default function ThreeBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10"
         style={{
           background: 'linear-gradient(135deg, #050810 0%, #0A0F1E 50%, #050810 100%)'
         }}
    />
  );
}
