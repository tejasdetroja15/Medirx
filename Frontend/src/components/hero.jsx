import { Button } from "@nextui-org/react";

export default function Hero() {
  return (
    <section className="bg-primary text-white py-20">
      <div className="container mx-auto px-4 text-center hero-txt">
        <h1 className="text-4xl font-bold mb-4">Your Health, Our Priority</h1>
        <p className="text-xl mb-8">
          Get personalized health suggestions, manage prescriptions, and order
          medicines online.
        </p>
        <Button className="hero-btn" variant="secondary" size="lg">
          Get Started
        </Button>
      </div>
    </section>
  );
}
