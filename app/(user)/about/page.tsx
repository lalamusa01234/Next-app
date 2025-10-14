import React from "react";

const About = () => {
  return (
    <div className="mx-20 px-6 py-16">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-6">About Us</h1>
      <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
        Welcome to <span className="font-semibold">Falafel Verifies</span>, your
        trusted online fashion store. We believe in offering premium-quality
        products that combine comfort, style, and affordability.
      </p>

      {/* Grid Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=900&q=80"
            alt="About us"
            className="rounded-2xl shadow-lg"
          />
        </div>

        {/* Text Content */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Started with a passion for fashion and innovation,{" "}
            <span className="font-medium">Falafel Verifies</span> aims to bring
            you the latest trends while staying true to timeless style. Every
            product is carefully curated to make sure you feel confident and
            comfortable.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            To make fashion accessible without compromising on quality. We
            believe in empowering people through what they wear, while promoting
            sustainability and fair practices.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Premium quality fabrics</li>
            <li>Affordable and fair pricing</li>
            <li>Fast & secure shipping</li>
            <li>Dedicated customer support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
