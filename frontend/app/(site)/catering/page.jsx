// "use client";

// import { cn } from "@/lib/utils";
// import {
//   CalendarDays,
//   CheckCircle2,
//   ChefHat,
//   Clock,
//   Loader2,
//   Mail,
//   MapPin,
//   PartyPopper,
//   PhoneCall,
//   ShieldCheck,
//   Sparkles,
//   Star,
//   Users,
//   UtensilsCrossed,
// } from "lucide-react";
// import { useMemo, useState } from "react";

// export default function CateringPage() {
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     date: "",
//     time: "",
//     guests: "",
//     location: "",
//     message: "",
//   });

//   const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const canSubmit = useMemo(() => {
//     return (
//       form.name.trim() &&
//       form.phone.trim() &&
//       form.email.trim() &&
//       isValidEmail(form.email) &&
//       form.date &&
//       form.time &&
//       (Number(form.guests) || 0) > 0
//     );
//   }, [form]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess(false);

//     // Basic validation
//     if (!form.name.trim()) return setError("Please enter your name.");
//     if (!form.phone.trim()) return setError("Please enter your phone number.");
//     if (!form.email.trim() || !isValidEmail(form.email))
//       return setError("Please enter a valid email address.");
//     if (!form.date) return setError("Please choose a date.");
//     if (!form.time) return setError("Please choose a time.");
//     if ((Number(form.guests) || 0) <= 0)
//       return setError("Please enter number of guests.");

//     setLoading(true);
//     try {
//       //   ✅ Replace with your real backend endpoint later
//       const API = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000";
//       const res = await fetch(`${API}/v1/catering/request`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok || data?.success === false)
//         throw new Error(data?.message || "Request failed");

//       await new Promise((r) => setTimeout(r, 800)); // demo delay

//       setSuccess(true);
//       setForm({
//         name: "",
//         email: "",
//         phone: "",
//         date: "",
//         time: "",
//         guests: "",
//         location: "",
//         message: "",
//       });
//     } catch (err) {
//       setError(err?.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32 ">
//       {/* HERO */}
//       <section className="relative overflow-hidden">
//         <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white ">
//           <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
//             <div className=" container text-center">
//               <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
//                 <Sparkles className="h-4 w-4 text-amber-200" />
//                 <span className="text-amber-100">
//                   Weddings • Office • Birthdays • Private Dining
//                 </span>
//               </div>

//               <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-tight">
//                 Catering that makes your event unforgettable
//               </h1>

//               <p className="mt-4 text-lg text-amber-100/80">
//                 Fresh cuisine, perfect timing, friendly service — we take care
//                 of everything so you can enjoy the moment.
//               </p>

//               <div className="mt-8 text-left grid grid-cols-1 sm:grid-cols-3 gap-3">
//                 <HeroStat
//                   icon={<Clock className="h-4 w-4" />}
//                   title="24/7 Support"
//                   text="Fast response & planning help"
//                 />
//                 <HeroStat
//                   icon={<ChefHat className="h-4 w-4" />}
//                   title="Expert Chefs"
//                   text="Fresh & authentic taste"
//                 />
//                 <HeroStat
//                   icon={<PartyPopper className="h-4 w-4" />}
//                   title="Event Ready"
//                   text="From 10 to 300+ guests"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Glow blobs */}
//         <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
//         <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
//       </section>

//       {/* CONTENT */}
//       <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
//         <div className="grid gap-6 lg:grid-cols-3 mb-6">
//           {/* FORM */}
//           <div className="lg:col-span-2">
//             <div className="rounded-3xl border border-amber-200/60 bg-white shadow-xl">
//               <div className="p-6 md:p-8 border-b">
//                 <h2 className="text-2xl font-bold text-amber-950">
//                   Book our catering service
//                 </h2>
//                 <p className="mt-1 text-sm text-zinc-600">
//                   Fill the details — we’ll confirm availability and send you a
//                   quick quote.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Field label="Name *">
//                     <Input
//                       value={form.name}
//                       onChange={(e) => update("name", e.target.value)}
//                       placeholder="Your name"
//                       icon={<Users className="h-4 w-4" />}
//                     />
//                   </Field>

//                   <Field label="Phone *">
//                     <Input
//                       value={form.phone}
//                       onChange={(e) => update("phone", e.target.value)}
//                       placeholder="+31 6 12 34 56 78"
//                       icon={<PhoneCall className="h-4 w-4" />}
//                     />
//                   </Field>
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Field label="Email *">
//                     <Input
//                       type="email"
//                       value={form.email}
//                       onChange={(e) => update("email", e.target.value)}
//                       placeholder="you@example.com"
//                       icon={<Mail className="h-4 w-4" />}
//                     />
//                   </Field>

//                   <Field label="Guests *">
//                     <Input
//                       type="number"
//                       min="1"
//                       value={form.guests}
//                       onChange={(e) => update("guests", e.target.value)}
//                       placeholder="40"
//                       icon={<Users className="h-4 w-4" />}
//                     />
//                   </Field>
//                 </div>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <Field label="Date *">
//                     <Input
//                       type="date"
//                       value={form.date}
//                       onChange={(e) => update("date", e.target.value)}
//                       icon={<CalendarDays className="h-4 w-4" />}
//                     />
//                   </Field>

//                   <Field label="Time *">
//                     <Input
//                       type="time"
//                       value={form.time}
//                       onChange={(e) => update("time", e.target.value)}
//                       icon={<Clock className="h-4 w-4" />}
//                     />
//                   </Field>
//                 </div>

//                 <Field label="Event Location (optional)">
//                   <Input
//                     value={form.location}
//                     onChange={(e) => update("location", e.target.value)}
//                     placeholder="City / address"
//                     icon={<MapPin className="h-4 w-4" />}
//                   />
//                 </Field>

//                 <Field label="Message (optional)">
//                   <textarea
//                     value={form.message}
//                     onChange={(e) => update("message", e.target.value)}
//                     rows={4}
//                     placeholder="Event type, dietary needs, menu style, delivery/pickup, special requests..."
//                     className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-amber-100"
//                   />
//                 </Field>

//                 {error ? (
//                   <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                     ❌ {error}
//                   </div>
//                 ) : null}

//                 {success ? (
//                   <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                     ✅ Booking request sent! We’ll contact you soon.
//                   </div>
//                 ) : null}

//                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                   <p className="text-xs text-zinc-500">
//                     We usually reply within a few hours.
//                   </p>

//                   <button
//                     type="submit"
//                     disabled={loading || !canSubmit}
//                     className={cn(
//                       "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-md transition",
//                       "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
//                       "disabled:opacity-60 disabled:cursor-not-allowed",
//                     )}
//                   >
//                     {loading ? (
//                       <span className="inline-flex items-center gap-2">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Sending…
//                       </span>
//                     ) : (
//                       "Book Now"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* SIDEBAR */}
//           <div className="space-y-6">
//             <SidebarCard title="Why we’re the best">
//               <Feature
//                 icon={<UtensilsCrossed className="h-5 w-5" />}
//                 title="Best Cuisine"
//                 text="Fresh ingredients, authentic taste, consistent quality."
//               />
//               <Feature
//                 icon={<ShieldCheck className="h-5 w-5" />}
//                 title="Reliable Service"
//                 text="On-time delivery, clean setup, smooth coordination."
//               />
//               <Feature
//                 icon={<Clock className="h-5 w-5" />}
//                 title="24/7 Support"
//                 text="We help you plan menu, timing, and guest count."
//               />
//               <Feature
//                 icon={<Star className="h-5 w-5" />}
//                 title="Special Events"
//                 text="Weddings, birthdays, office parties, corporate lunches."
//               />
//             </SidebarCard>

//             <SidebarCard title="Contact">
//               <div className="space-y-3 text-sm text-zinc-700">
//                 <ContactRow
//                   icon={<PhoneCall className="h-4 w-4" />}
//                   label="Phone"
//                   value="+31 6 87 94 73 71"
//                 />
//                 <ContactRow
//                   icon={<Mail className="h-4 w-4" />}
//                   label="Email"
//                   value="restaurantdekleineman@gmail.com"
//                 />
//                 <div className="mt-4 rounded-2xl border bg-amber-50 px-4 py-3">
//                   <div className="flex items-start gap-2">
//                     <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-700" />
//                     <p className="text-xs text-zinc-700">
//                       Tip: Add dietary needs (vegan/gluten-free), location and
//                       guest count for a faster quote.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </SidebarCard>

//             {/* <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-r from-amber-700 to-orange-700 p-6 text-zinc-700 shadow-lg">
//               <p className="text-sm text-amber-950">Great for</p>
//               <div className="mt-2 grid gap-2 text-sm text-zinc-700">
//                 <Pill
//                   className="bg-yellow-950"
//                   icon={<PartyPopper className="h-4 w-4" />}
//                   text="Birthday Parties"
//                 />
//                 <Pill
//                   icon={<Users className="h-4 w-4" />}
//                   text="Office Lunch & Meetings"
//                 />
//                 <Pill
//                   icon={<Sparkles className="h-4 w-4" />}
//                   text="Weddings & Anniversaries"
//                 />
//               </div>
//             </div> */}
//           </div>
//         </div>

//         {/* SERVICES */}
//         <div className="mt-12  rounded-3xl border border-amber-200/60 bg-white p-6 md:p-8 shadow-sm">
//           <h3 className="text-2xl font-bold text-amber-950">Our services</h3>
//           <p className="mt-2 text-sm text-zinc-600">
//             Choose a style that matches your event — we can deliver, set up, and
//             serve.
//           </p>

//           <div className="mt-6 grid gap-4 md:grid-cols-3">
//             <ServiceCard
//               icon={<ChefHat className="h-5 w-5" />}
//               title="Buffet Catering"
//               text="A full spread of warm dishes, sides, sauces — perfect for groups."
//             />
//             <ServiceCard
//               icon={<UtensilsCrossed className="h-5 w-5" />}
//               title="Plated Service"
//               text="Premium experience with curated courses and optional staff."
//             />
//             <ServiceCard
//               icon={<Sparkles className="h-5 w-5" />}
//               title="Snacks & Bites"
//               text="Finger food, appetizers, desserts — ideal for parties and meetings."
//             />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ----------------- Components (Tailwind only) ----------------- */

// function Field({ label, children }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-sm font-semibold text-zinc-800">{label}</label>
//       {children}
//     </div>
//   );
// }

// function Input({ icon, className, ...props }) {
//   return (
//     <div className="relative">
//       {icon ? (
//         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
//           {icon}
//         </div>
//       ) : null}
//       <input
//         {...props}
//         className={cn(
//           "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition",
//           "focus:ring-4 focus:ring-amber-100",
//           icon ? "pl-10" : "",
//           className,
//         )}
//       />
//     </div>
//   );
// }

// function HeroStat({ icon, title, text }) {
//   return (
//     <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
//       <div className="flex items-center gap-2 text-amber-100">
//         {icon}
//         <span className="font-semibold">{title}</span>
//       </div>
//       <div className="mt-1 text-sm text-white/70">{text}</div>
//     </div>
//   );
// }

// function SidebarCard({ title, children }) {
//   return (
//     <div className="rounded-3xl border border-amber-200/60 bg-white p-6 shadow-sm">
//       <h4 className="text-lg font-bold text-amber-950">{title}</h4>
//       <div className="mt-4 space-y-4">{children}</div>
//     </div>
//   );
// }

// function Feature({ icon, title, text }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="rounded-2xl border border-amber-200/60 bg-amber-50 p-2 text-amber-800">
//         {icon}
//       </div>
//       <div>
//         <div className="font-semibold text-zinc-900">{title}</div>
//         <div className="text-sm text-zinc-600">{text}</div>
//       </div>
//     </div>
//   );
// }

// function ContactRow({ icon, label, value }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span className="text-amber-700">{icon}</span>
//       <span className="text-zinc-500">{label}:</span>
//       <span className="font-semibold text-zinc-800">{value}</span>
//     </div>
//   );
// }

// function Pill({ icon, text }) {
//   return (
//     <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-white">
//       {icon}
//       <span>{text}</span>
//     </div>
//   );
// }

// function ServiceCard({ icon, title, text }) {
//   return (
//     <div className="rounded-3xl border border-amber-200/60 bg-amber-50/40 p-5">
//       <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200/60 bg-white px-3 py-2 text-amber-950">
//         <span className="text-amber-700">{icon}</span>
//         <span className="font-semibold">{title}</span>
//       </div>
//       <p className="mt-3 text-sm text-zinc-600">{text}</p>
//     </div>
//   );
// }

"use client";
import { cn } from "@/lib/utils";
import emailjs from "@emailjs/browser";
import {
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Clock,
  DollarSign,
  Loader2,
  Mail,
  MapPin,
  PartyPopper,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function CateringPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    location: "",
    message: "",
  });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.phone.trim() &&
      form.email.trim() &&
      isValidEmail(form.email) &&
      form.date &&
      form.time &&
      (Number(form.guests) || 0) > 0
    );
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.phone.trim()) return setError("Please enter your phone number.");
    if (!form.email.trim() || !isValidEmail(form.email))
      return setError("Please enter a valid email address.");
    if (!form.date) return setError("Please choose a date.");
    if (!form.time) return setError("Please choose a time.");
    if ((Number(form.guests) || 0) <= 0)
      return setError("Please enter number of guests.");

    setLoading(true);

    try {
      await emailjs.send(
        "service_dk7znao",
        "template_g3uqlkf",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          time: form.time,
          guests: form.guests,
          location: form.location,
          message: form.message,
        },
        "FMKB5lY23xRBOkCQG",
      );

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "",
        location: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32 ">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white ">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className=" container text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-amber-200" />
                <span className="text-amber-100">
                  Weddings • Office • Birthdays • Private Dining
                </span>
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Catering that makes your event unforgettable
              </h1>

              <p className="mt-4 text-lg text-amber-100/80">
                Fresh cuisine, perfect timing, friendly service — we take care
                of everything so you can enjoy the moment.
              </p>

              <div className="mt-8 text-left grid grid-cols-1 sm:grid-cols-3 gap-3">
                <HeroStat
                  icon={<Clock className="h-4 w-4" />}
                  title="24/7 Support"
                  text="Fast response & planning help"
                />
                <HeroStat
                  icon={<ChefHat className="h-4 w-4" />}
                  title="Expert Chefs"
                  text="Fresh & authentic taste"
                />
                <HeroStat
                  icon={<PartyPopper className="h-4 w-4" />}
                  title="Event Ready"
                  text="From 10 to 300+ guests"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* FORM */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-amber-200/60 bg-white shadow-xl">
              <div className="p-6 md:p-8 border-b">
                <h2 className="text-2xl font-bold text-amber-950">
                  Book our catering service
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Fill the details — we’ll confirm availability and send you a
                  quick quote.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name *">
                    <Input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Your name"
                      icon={<Users className="h-4 w-4" />}
                    />
                  </Field>

                  <Field label="Phone *">
                    <Input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+31 6 12 34 56 78"
                      icon={<PhoneCall className="h-4 w-4" />}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Email *">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      icon={<Mail className="h-4 w-4" />}
                    />
                  </Field>

                  <Field label="Guests *">
                    <Input
                      type="number"
                      min="1"
                      value={form.guests}
                      onChange={(e) => update("guests", e.target.value)}
                      placeholder="40"
                      icon={<Users className="h-4 w-4" />}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Date *">
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => update("date", e.target.value)}
                      icon={<CalendarDays className="h-4 w-4" />}
                    />
                  </Field>

                  <Field label="Time *">
                    <Input
                      type="time"
                      value={form.time}
                      onChange={(e) => update("time", e.target.value)}
                      icon={<Clock className="h-4 w-4" />}
                    />
                  </Field>
                </div>

                <Field label="Event Location (optional)">
                  <Input
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="City / address"
                    icon={<MapPin className="h-4 w-4" />}
                  />
                </Field>

                <Field label="Message (optional)">
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={4}
                    placeholder="Event type, dietary needs, menu style, delivery/pickup, special requests..."
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-amber-100"
                  />
                </Field>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    ❌ {error}
                  </div>
                ) : null}

                {success ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    ✅ Booking request sent! We’ll contact you soon.
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-zinc-500">
                    We usually reply within a few hours.
                  </p>

                  <button
                    type="submit"
                    disabled={loading || !canSubmit}
                    className={cn(
                      "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-md transition",
                      "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                    )}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      "Book Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <SidebarCard title="Why we’re the best">
              <Feature
                icon={<DollarSign className="h-5 w-5" />}
                title="Affordable Catering"
                text="Enjoy premium taste with a special per-person price."
              />
              <Feature
                icon={<UtensilsCrossed className="h-5 w-5" />}
                title="Best Cuisine"
                text="Fresh ingredients, authentic taste, consistent quality."
              />
              <Feature
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Reliable Service"
                text="On-time delivery, clean setup, smooth coordination."
              />
              <Feature
                icon={<Clock className="h-5 w-5" />}
                title="24/7 Support"
                text="We help you plan menu, timing, and guest count."
              />
              <Feature
                icon={<Star className="h-5 w-5" />}
                title="Special Events"
                text="Weddings, birthdays, office parties, corporate lunches."
              />
            </SidebarCard>

            <SidebarCard title="Contact">
              <div className="space-y-3 text-sm text-zinc-700">
                <ContactRow
                  icon={<PhoneCall className="h-4 w-4" />}
                  label="Phone"
                  value="+31 6 87 94 73 71"
                />
                <ContactRow
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value="restaurantdekleineman@gmail.com"
                />
                <div className="mt-4 rounded-2xl border bg-amber-50 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-700" />
                    <p className="text-xs text-zinc-700">
                      Tip: Add dietary needs (vegan/gluten-free), location and
                      guest count for a faster quote.
                    </p>
                  </div>
                </div>
              </div>
            </SidebarCard>

            {/* <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-r from-amber-700 to-orange-700 p-6 text-zinc-700 shadow-lg">
              <p className="text-sm text-amber-950">Great for</p>
              <div className="mt-2 grid gap-2 text-sm text-zinc-700">
                <Pill
                  className="bg-yellow-950"
                  icon={<PartyPopper className="h-4 w-4" />}
                  text="Birthday Parties"
                />
                <Pill
                  icon={<Users className="h-4 w-4" />}
                  text="Office Lunch & Meetings"
                />
                <Pill
                  icon={<Sparkles className="h-4 w-4" />}
                  text="Weddings & Anniversaries"
                />
              </div>
            </div> */}
          </div>
        </div>

        {/* SERVICES */}
        <div className="mt-12  rounded-3xl border border-amber-200/60 bg-white p-6 md:p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-amber-950">Our services</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Choose a style that matches your event — we can deliver, set up, and
            serve.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ServiceCard
              icon={<ChefHat className="h-5 w-5" />}
              title="Buffet Catering"
              text="A full spread of warm dishes, sides, sauces — perfect for groups."
            />
            <ServiceCard
              icon={<UtensilsCrossed className="h-5 w-5" />}
              title="Plated Service"
              text="Premium experience with curated courses and optional staff."
            />
            <ServiceCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Snacks & Bites"
              text="Finger food, appetizers, desserts — ideal for parties and meetings."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------- Components (Tailwind only) ----------------- */

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-zinc-800">{label}</label>
      {children}
    </div>
  );
}

function Input({ icon, className, ...props }) {
  return (
    <div className="relative">
      {icon ? (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          {icon}
        </div>
      ) : null}
      <input
        {...props}
        className={cn(
          "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition",
          "focus:ring-4 focus:ring-amber-100",
          icon ? "pl-10" : "",
          className,
        )}
      />
    </div>
  );
}

function HeroStat({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
      <div className="flex items-center gap-2 text-amber-100">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <div className="mt-1 text-sm text-white/70">{text}</div>
    </div>
  );
}

function SidebarCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-amber-200/60 bg-white p-6 shadow-sm">
      <h4 className="text-lg font-bold text-amber-950">{title}</h4>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-2xl border border-amber-200/60 bg-amber-50 p-2 text-amber-800">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-zinc-900">{title}</div>
        <div className="text-sm text-zinc-600">{text}</div>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-amber-700">{icon}</span>
      <span className="text-zinc-500">{label}:</span>
      <span className="font-semibold text-zinc-800">{value}</span>
    </div>
  );
}

function Pill({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-white">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function ServiceCard({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-amber-200/60 bg-amber-50/40 p-5">
      <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200/60 bg-white px-3 py-2 text-amber-950">
        <span className="text-amber-700">{icon}</span>
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-3 text-sm text-zinc-600">{text}</p>
    </div>
  );
}
