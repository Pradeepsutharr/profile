// pages/admin/login.jsx
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let errs = {};

    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!validateEmail(email)) {
      errs.email = "Enter a valid email address";
    }

    if (!pw.trim()) {
      errs.pw = "Password is required";
    } else if (pw.length < 6) {
      errs.pw = "Password must be at least 6 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pw,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data?.user) {
        alert("Login failed, no user returned.");
        return;
      }

      const user = data.user;

      const { data: adminData, error: adminErr } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (adminErr && adminErr.code !== "PGRST116") {
        alert("Error checking admin status");
        await supabase.auth.signOut();
        return;
      }

      if (!adminData) {
        alert("You are not an admin");
        await supabase.auth.signOut();
        return;
      }

      router.push("/admin");
    } catch (err) {
      alert("Unexpected error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0d0d10] text-main flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Background Decorative Neon Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-[420px] bg-[#16161a]/60 backdrop-blur-lg border border-stroke/40 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Branding header inside login box */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-14 h-14 mb-4">
            <Image src="/seo-logo.svg" fill alt="brand logo" className="object-contain" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-main" style={{ fontFamily: "'Sora', sans-serif" }}>
            Admin Portal
          </h2>
          <p className="text-xs text-subtle/50 mt-1 font-mono tracking-wider uppercase">AUTHENTICATION REQUIRED</p>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-y-5">
          {/* EMAIL FIELD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-subtle/50 block mb-1.5 ml-1">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@domain.com"
              className={`w-full py-3 px-4 rounded-xl text-sm bg-[#16161a]/50 text-main border ${
                errors.email ? "border-rose-500/50" : "border-stroke/60"
              } outline-none focus:border-primary/50 transition-all`}
            />
            {errors.email && (
              <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-subtle/50 block mb-1.5 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                className={`w-full py-3 px-4 rounded-xl text-sm bg-[#16161a]/50 text-main border ${
                  errors.pw ? "border-rose-500/50" : "border-stroke/60"
                } outline-none focus:border-primary/50 transition-all pr-12`}
              />

              <button
                type="button"
                onClick={() => setShowPw((prev) => !prev)}
                className="text-subtle/60 hover:text-main absolute top-3 right-4 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.pw && (
              <p className="text-rose-400 text-xs mt-1.5 ml-1">{errors.pw}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black py-3 rounded-xl font-bold text-sm tracking-wide mt-4 shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} />
            <span>{loading ? "Authenticating..." : "Login to Console"}</span>
          </button>
        </form>
      </div>

      {/* Footer copyright */}
      <span className="text-[9px] font-mono tracking-widest text-subtle/30 mt-8 uppercase">&copy; 2026 Admin Dashboard console. All Rights Reserved.</span>
    </div>
  );
}
