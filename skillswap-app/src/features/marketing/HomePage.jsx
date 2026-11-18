import { Link } from 'react-router-dom';
import { ArrowLeftRight, ArrowRight, CheckCircle2, Handshake, ListChecks, MapPin, Search, ShieldCheck, Layers } from 'lucide-react';
import { Button, Card, Badge, Avatar } from '../../components/ui';

const steps = [
  {
    icon: ListChecks,
    title: 'List what you teach and what you want to learn',
    body: 'Add as many skills as you like, with your level, a short description and whether you meet online or in person.',
  },
  {
    icon: Search,
    title: 'See who fits',
    body: 'SkillSwap pairs you with people who teach what you want to learn and want to learn what you teach.',
  },
  {
    icon: Handshake,
    title: 'Send a request and start swapping',
    body: 'When they accept, you both get each other’s contact details to plan your first session.',
  },
];

const points = [
  { icon: ArrowLeftRight, title: 'No fees, no points', body: 'An hour of your time for an hour of theirs.' },
  { icon: MapPin, title: 'Online or nearby', body: 'Filter by how you like to learn and the city you are in.' },
  { icon: ShieldCheck, title: 'Contact stays private', body: 'Phone numbers are shared only after a request is accepted.' },
  { icon: Layers, title: 'Any skill counts', body: 'Music, languages, maths, cooking, code. If you can teach it, list it.' },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-brand-50/70 to-white" />
        <div className="page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Badge tone="brand" className="mb-5">Teach &amp; Learn</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Teach what you know.
              <br />
              <span className="text-brand-600">Learn what you don&apos;t.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              SkillSwap connects people who want to trade skills. Teach guitar, learn mathematics. Share your coding,
              pick up Spanish. Find your match and start learning from each other.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/signup" size="lg">
                Create a free account <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as="a" href="#how-it-works" variant="secondary" size="lg">
                How it works
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              {['Free to use', 'Online or in person', 'Any skill, any level'].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <MatchPreview />
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-t border-slate-100 bg-white py-20">
        <div className="page">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-600">Three steps from signing up to your first swap.</p>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, index) => (
              <li key={title}>
                <Card className="h-full p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-slate-400">Step {index + 1}</span>
                  </div>
                  <h3 className="mt-5 font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-slate-50/70 py-20">
        <div className="page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Learning that goes both ways</h2>
            <p className="mt-3 text-slate-600">
              Everyone has something worth teaching. SkillSwap makes it easy to find the person whose skills fit yours.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {points.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <h3 className="font-medium text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="page">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-slate-900 px-8 py-12 sm:flex-row sm:items-center sm:px-12">
            <div>
              <h2 className="text-2xl font-semibold text-white">Ready to find your first swap?</h2>
              <p className="mt-2 text-slate-300">It takes about two minutes to set up your profile.</p>
            </div>
            <Button as={Link} to="/signup" size="lg">
              Get started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/** A static example of a mutual match, so visitors see what they will get. */
function MatchPreview() {
  const people = [
    { id: 1, firstName: 'Nimali', lastName: 'Perera', city: 'Colombo', teaches: 'Guitar', learns: 'Mathematics' },
    { id: 3, firstName: 'Daniel', lastName: 'Silva', city: 'Kandy', teaches: 'Mathematics', learns: 'Guitar' },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <Card className="p-5 shadow-raised">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-900">Mutual match</span>
          <Badge tone="green">Both ways</Badge>
        </div>
        <div className="space-y-3">
          {people.map((person) => (
            <div key={person.id} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
              <Avatar person={person} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {person.firstName} {person.lastName}
                </p>
                <p className="text-xs text-slate-500">{person.city}</p>
              </div>
              <div className="text-right text-xs leading-5">
                <p className="text-slate-500">
                  Teaches <span className="font-medium text-slate-900">{person.teaches}</span>
                </p>
                <p className="text-slate-500">
                  Learns <span className="font-medium text-slate-900">{person.learns}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ArrowLeftRight className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          Guitar for Mathematics
        </div>
      </Card>
    </div>
  );
}
