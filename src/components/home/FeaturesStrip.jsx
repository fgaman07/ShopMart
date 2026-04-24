import React from 'react';

export default function FeaturesStrip() {
  const features = [
    { title: "Payment only online", desc: "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärtorpa.", icon: "💳" },
    { title: "New stocks and sales", desc: "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärtorpa.", icon: "🏷️" },
    { title: "Quality assurance", desc: "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärtorpa.", icon: "🛡️" },
    { title: "Delivery from 1 hour", desc: "Tasigförsamhet beteendedesign. Mobile checkout. Ylig kärtorpa.", icon: "⏱️" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10 border-b border-gray-100 mb-10">
      {features.map((feature, i) => (
        <div key={i} className="flex gap-4">
          <div className="text-4xl text-primary mt-1 opacity-90">{feature.icon}</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2 text-[15px]">{feature.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed max-w-[200px]">
              {feature.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
