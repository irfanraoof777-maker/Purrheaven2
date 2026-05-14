import { Heart, Users, MapPin } from "lucide-react";

const team = [
  {
    name: "Mohammed Irfan Raoof",
    role: "Founder & Cat Lover",
    bio: "Started PurrHeaven after fostering her first street cat in 2019. She's fostered 30+ cats since.",
    initials: "PN",
  },
  {
    name: "Arjun Mehta",
    role: "Tech & Operations",
    bio: "Builds the platform and makes sure every foster is connected with the right cat.",
    initials: "AM",
  },
  {
    name: "Divya Krishnan",
    role: "Community Manager",
    bio: "Coordinates with shelters and individual fosters across 15 cities in India.",
    initials: "DK",
  },
];

const values = [
  {
    icon: Heart,
    title: "Every Cat Matters",
    description:
      "We believe every cat deserves a safe, permanent home. Whether you found a stray on the street or need to rehome your cat due to circumstances beyond your control, we make sure they find the right family — because no cat should ever have to face the streets alone.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "PurrHeaven is built by a community of cat lovers who volunteer their time, homes, and hearts. We're a non-profit run entirely on love and small donations.",
  },
  {
    icon: MapPin,
    title: "Pan-India Network",
    description:
      "From Mumbai to Kochi, Chandigarh to Chennai — we're connecting fosters and cats across India's biggest cities with more joining every month.",
  },
];

export default function About() {
  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Mission */}
        <section className="mb-20 text-center">
          <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
            Our Mission
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Finding temporary homes<br />for cats in need
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            PurrHeaven is a non-profit cat fostering platform built by cat lovers, for cat lovers.
            We exist to reduce the number of cats living on the streets and in overcrowded shelters
            by connecting them with compassionate fosters across India.
          </p>
        </section>

        {/* Story */}
        <section className="mb-20 p-8 bg-card rounded-2xl border border-border/60">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Our Story</h2>
          <div className="prose prose-sm text-muted-foreground max-w-none space-y-4">
            <p>
              PurrHeaven began in 2024 when our founder Mohammed Irfan Raoof spotted a tiny kitten
              trapped inside a moving car on a stormy, rain-soaked day in Hyderabad. Without
              hesitation, he stopped the car and rescued the frightened little one from danger.
            </p>
            <p>
              That kitten never left. She found her forever home right then and there — and today
              she is Irfan's beloved pet and the heart behind PurrHeaven.
            </p>
            <p>
              That one rescue sparked a bigger question — how many more cats out there needed the
              same chance? A warm home, a kind heart, and someone to never let them go. That's how
              PurrHeaven was born. A platform dedicated to connecting stray and rescued cats with
              loving families across India.
            </p>
            <p>
              We don't charge adoption fees. We don't take commissions. PurrHeaven is a labor
              of love, built by volunteers and supported by small donations from people who
              believe no cat should ever face the streets alone.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 bg-card rounded-2xl border border-border/60 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                data-testid={`card-team-${member.name.replace(/\s+/g, "-").toLowerCase()}`}
                className="p-6 bg-card rounded-2xl border border-border/60 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-serif text-xl font-bold text-primary">{member.initials}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-0.5">{member.name}</h3>
                <p className="text-xs text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
