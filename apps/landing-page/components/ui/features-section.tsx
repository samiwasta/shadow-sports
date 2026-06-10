import { FeatureCard } from "@/components/ui/feature-card"

const FEATURES = [
  {
    title: "Squad",
    description:
      "A balanced team of batters, bowlers, and fielders. Player roles and availability are shared before every game.",
  },
  {
    title: "Matches",
    description:
      "League and friendly games played through the season. Fixtures, grounds, and team sheets are shared with all members.",
  },
  {
    title: "Practice",
    description:
      "Weekly net sessions for batting, bowling, and fielding. Open to all members who want more time in the nets.",
  },
  {
    title: "Training",
    description:
      "Coached drills to build skills, fitness, and match awareness. Held on practice days and before match day.",
  },
  {
    title: "Community",
    description:
      "A friendly club where players support each other on and off the field. New members are always welcome to join.",
  },
  {
    title: "Trophies",
    description:
      "Cups, awards, and stand-out performances from past seasons. Moments the whole club shares and remembers.",
  },
] as const

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative z-10 w-full bg-black px-6 py-28 md:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.06),transparent_50%)]" />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center md:mb-14">
          <p className="font-heading mb-4 text-sm font-semibold tracking-[0.25em] text-blue-400 uppercase md:text-base">
            What We Offer
          </p>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground uppercase md:text-5xl lg:text-6xl">
            Built for Your Club
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Practice, play matches, train together, and grow as one cricket club.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
